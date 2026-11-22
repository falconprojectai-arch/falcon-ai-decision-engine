import test from 'node:test';
import assert from 'node:assert/strict';
import { NonceStore } from '../src/wallet-auth.js';

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
