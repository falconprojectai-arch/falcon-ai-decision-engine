import test from 'node:test';
import assert from 'node:assert/strict';
import { NonceStore, registerWalletAuth } from '../src/wallet-auth.js';
import { Hono } from 'hono';
import { privateKeyToAccount } from 'viem/accounts';

function makeStore() {
  const values = new Map();
  let lock = Promise.resolve();
  const storage = {
    get: async key => values.get(key),
    put: async (key, value) => values.set(key, value),
    delete: async key => values.delete(key),
    transaction: async callback => {
      const previous = lock;
      let release;
      lock = new Promise(resolve => { release = resolve; });
      await previous;
      try {
        return await callback({
          get: async key => values.get(key),
          delete: async key => values.delete(key)
        });
      } finally {
        release();
      }
    }
  };
  return new NonceStore({ storage });
}

test('nonce store accepts a challenge and returns it before expiry', async () => {
  const store = makeStore();
  const record = { nonce: 'a'.repeat(32), message: 'sign this exact text', expiresAt: Date.now() + 60_000 };
  const put = await store.fetch(new Request('https://nonce/put', { method: 'POST', body: JSON.stringify(record) }));
  assert.equal(put.status, 200);
  const get = await store.fetch(new Request(`https://nonce/get?nonce=${record.nonce}`));
  assert.equal(get.status, 200);
  assert.deepEqual(await get.json(), record);
});

test('nonce store rejects expired challenges', async () => {
  const store = makeStore();
  const record = { nonce: 'b'.repeat(32), message: 'expired', expiresAt: Date.now() - 1 };
  await store.fetch(new Request('https://nonce/put', { method: 'POST', body: JSON.stringify(record) }));
  const get = await store.fetch(new Request(`https://nonce/get?nonce=${record.nonce}`));
  assert.equal(get.status, 404);
});

test('nonce consumption is one-time and bound to the exact message', async () => {
  const store = makeStore();
  const record = { nonce: 'c'.repeat(32), message: 'original message', expiresAt: Date.now() + 60_000 };
  await store.fetch(new Request('https://nonce/put', { method: 'POST', body: JSON.stringify(record) }));
  const mismatch = await store.fetch(new Request('https://nonce/consume', {
    method: 'POST', body: JSON.stringify({ nonce: record.nonce, message: 'modified message' })
  }));
  assert.equal(mismatch.status, 409);
  const first = await store.fetch(new Request('https://nonce/consume', {
    method: 'POST', body: JSON.stringify({ nonce: record.nonce, message: record.message })
  }));
  assert.equal(first.status, 200);
  const replay = await store.fetch(new Request('https://nonce/consume', {
    method: 'POST', body: JSON.stringify({ nonce: record.nonce, message: record.message })
  }));
  assert.equal(replay.status, 409);
});

test('multiple outstanding challenges for one wallet remain independently valid', async () => {
  const store = makeStore();
  const records = ['d', 'e'].map(char => ({
    nonce: char.repeat(32), message: `message-${char}`, expiresAt: Date.now() + 60_000
  }));
  for (const record of records) {
    await store.fetch(new Request('https://nonce/put', { method: 'POST', body: JSON.stringify(record) }));
  }
  for (const record of records) {
    const response = await store.fetch(new Request(`https://nonce/get?nonce=${record.nonce}`));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), record);
  }
});

test('concurrent consume attempts allow exactly one winner', async () => {
  const store = makeStore();
  const record = { nonce: 'f'.repeat(32), message: 'single-use', expiresAt: Date.now() + 60_000 };
  await store.fetch(new Request('https://nonce/put', { method: 'POST', body: JSON.stringify(record) }));
  const consume = () => store.fetch(new Request('https://nonce/consume', {
    method: 'POST', body: JSON.stringify({ nonce: record.nonce, message: record.message })
  }));
  const responses = await Promise.all([consume(), consume()]);
  assert.deepEqual(responses.map(response => response.status).sort(), [200, 409]);
});


test('wallet challenge refuses addresses other than configured PAY_TO', async () => {
  const app = new Hono();
  registerWalletAuth(app);
  const response = await app.request('/v1/auth/challenge', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address: '0x1111111111111111111111111111111111111111' })
  }, { PAY_TO: '0x2222222222222222222222222222222222222222' });
  assert.equal(response.status, 403);
  assert.match((await response.json()).error, /configured receiving wallet/);
});

test('wallet verification refuses an address other than configured PAY_TO before nonce lookup', async () => {
  const app = new Hono();
  registerWalletAuth(app);
  const response = await app.request('/v1/auth/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      address: '0x1111111111111111111111111111111111111111',
      nonce: 'a'.repeat(32),
      message: 'irrelevant',
      signature: '0x' + 'a'.repeat(130)
    })
  }, {
    PAY_TO: '0x2222222222222222222222222222222222222222',
    NONCE_STORE: { idFromName() { throw new Error('must not access storage'); } }
  });
  assert.equal(response.status, 403);
  assert.match((await response.json()).error, /configured receiving wallet/);
});


test('wallet auth verifies a real EIP-191 signature and rejects replay', async () => {
  const account = privateKeyToAccount('0x' + '0'.repeat(63) + '1');
  const app = new Hono();
  const store = makeStore();
  registerWalletAuth(app);
  const env = {
    PAY_TO: account.address,
    NONCE_STORE: {
      idFromName() { return 'test-wallet'; },
      get() { return { fetch: request => store.fetch(request) }; }
    }
  };

  const challengeResponse = await app.request('/v1/auth/challenge', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address: account.address })
  }, env);
  assert.equal(challengeResponse.status, 200);
  const challenge = await challengeResponse.json();

  const wrongSignature = await account.signMessage({ message: 'not the issued challenge' });
  const wrongProof = await app.request('/v1/auth/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      address: challenge.address, nonce: challenge.nonce,
      message: challenge.message, signature: wrongSignature
    })
  }, env);
  assert.equal(wrongProof.status, 401);

  const signature = await account.signMessage({ message: challenge.message });
  const proof = {
    address: challenge.address, nonce: challenge.nonce,
    message: challenge.message, signature
  };
  const verifiedResponse = await app.request('/v1/auth/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(proof)
  }, env);
  assert.equal(verifiedResponse.status, 200);
  const verified = await verifiedResponse.json();
  assert.equal(verified.verified, true);
  assert.equal(verified.paymentAuthorized, false);
  assert.equal(verified.sessionCreated, false);

  const replayResponse = await app.request('/v1/auth/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(proof)
  }, env);
  assert.equal(replayResponse.status, 409);
});
