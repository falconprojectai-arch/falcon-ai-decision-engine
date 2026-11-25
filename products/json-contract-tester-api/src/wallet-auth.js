import { verifyMessage } from 'viem';
import { getVerifiedPayTo } from './receiver.js';

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const SIGNATURE_RE = /^0x[a-fA-F0-9]{130}$/;
const CHALLENGE_TTL_SECONDS = 300;
const CHAIN_ID = 8453;

function nonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function challengeMessage({ domain, address, nonce: value, issuedAt, expirationTime }) {
  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    '',
    'Sign this message to prove wallet ownership for JSON Contract Tester. This does not authorize a payment or transfer.',
    '',
    `URI: https://${domain}`,
    'Version: 1',
    `Chain ID: ${CHAIN_ID}`,
    `Nonce: ${value}`,
    `Issued At: ${issuedAt}`,
    `Expiration Time: ${expirationTime}`
  ].join('\n');
}

async function nonceStore(env, address, action, payload = {}) {
  const id = env.NONCE_STORE.idFromName(address.toLowerCase());
  const stub = env.NONCE_STORE.get(id);
  const path = action === 'get' ? `/get?nonce=${encodeURIComponent(payload.nonce)}` : `/${action}`;
  return stub.fetch(new Request(`https://nonce-store.internal${path}`, {
    method: action === 'get' ? 'GET' : 'POST',
    headers: { 'content-type': 'application/json' },
    body: action === 'get' ? undefined : JSON.stringify(payload)
  }));
}

export function registerWalletAuth(app) {
  app.post('/v1/auth/challenge', async c => {
    let body;
    try { body = await c.req.json(); } catch { return c.json({ error: 'A JSON body is required.' }, 400); }
    if (!body || typeof body.address !== 'string' || !ADDRESS_RE.test(body.address)) {
      return c.json({ error: 'A valid EVM wallet address is required.' }, 400);
    }
    const payTo = getVerifiedPayTo(c.env);
    if (!payTo) return c.json({ error: 'Receiving wallet must match the independently pinned configured receiving wallet.' }, 503);
    if (body.address.toLowerCase() !== payTo.toLowerCase()) {
      return c.json({ error: 'Challenge address must match the configured receiving wallet.' }, 403);
    }
    if (!c.env.NONCE_STORE) return c.json({ error: 'Wallet-auth nonce storage is not configured.' }, 503);
    const address = body.address.toLowerCase();
    const issued = new Date();
    const expires = new Date(issued.getTime() + CHALLENGE_TTL_SECONDS * 1000);
    const value = nonce();
    const message = challengeMessage({
      domain: new URL(c.req.url).host,
      address,
      nonce: value,
      issuedAt: issued.toISOString(),
      expirationTime: expires.toISOString()
    });
    const stored = await nonceStore(c.env, address, 'put', {
      nonce: value, message, expiresAt: expires.getTime()
    });
    if (!stored.ok) return c.json({ error: 'Unable to store the signing challenge.' }, 503);
    return c.json({
      address,
      message,
      nonce: value,
      issuedAt: issued.toISOString(),
      expiresAt: expires.toISOString(),
      chainId: CHAIN_ID,
      purpose: 'wallet_ownership_proof_only',
      paymentAuthorized: false
    });
  });

  app.post('/v1/auth/verify', async c => {
    let body;
    try { body = await c.req.json(); } catch { return c.json({ error: 'A JSON body is required.' }, 400); }
    if (!body || typeof body.address !== 'string' || !ADDRESS_RE.test(body.address) ||
        typeof body.nonce !== 'string' || !/^[a-f0-9]{32}$/.test(body.nonce) ||
        typeof body.message !== 'string' || typeof body.signature !== 'string' ||
        !SIGNATURE_RE.test(body.signature)) {
      return c.json({ error: 'address, nonce, message, and a 65-byte EVM signature are required.' }, 400);
    }
    const payTo = getVerifiedPayTo(c.env);
    if (!payTo) return c.json({ error: 'Receiving wallet must match the independently pinned configured receiving wallet.' }, 503);
    if (body.address.toLowerCase() !== payTo.toLowerCase()) {
      return c.json({ error: 'Verification address must match the configured receiving wallet.' }, 403);
    }
    if (!c.env.NONCE_STORE) return c.json({ error: 'Wallet-auth nonce storage is not configured.' }, 503);
    const lookup = await nonceStore(c.env, body.address, 'get', { nonce: body.nonce });
    if (!lookup.ok) return c.json({ error: 'Challenge is invalid, expired, or already used.' }, 401);
    const challenge = await lookup.json();
    if (!challenge || challenge.message !== body.message || challenge.expiresAt <= Date.now()) {
      return c.json({ error: 'Challenge is invalid, expired, or already used.' }, 401);
    }
    let valid = false;
    try {
      valid = await verifyMessage({
        address: body.address,
        message: challenge.message,
        signature: body.signature
      });
    } catch { valid = false; }
    if (!valid) return c.json({ error: 'Wallet signature verification failed.' }, 401);

    // A Durable Object serializes this consume operation, so concurrent replay
    // attempts cannot both succeed. This endpoint proves ownership only; it
    // deliberately does not mint a session or enable payments.
    const consumed = await nonceStore(c.env, body.address, 'consume', {
      nonce: body.nonce, message: body.message
    });
    if (consumed.status === 409) return c.json({ error: 'Challenge has already been used.' }, 409);
    if (!consumed.ok) return c.json({ error: 'Challenge could not be consumed.' }, 503);
    return c.json({
      verified: true,
      address: body.address,
      purpose: 'wallet_ownership_proof_only',
      paymentAuthorized: false,
      sessionCreated: false
    });
  });
}

export class NonceStore {
  constructor(ctx) { this.ctx = ctx; this.storage = ctx.storage; }

  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/put' && request.method === 'POST') {
      const body = await request.json();
      if (!/^[a-f0-9]{32}$/.test(body.nonce || '') ||
          typeof body.message !== 'string' || !Number.isFinite(body.expiresAt)) {
        return Response.json({ error: 'Invalid challenge record.' }, { status: 400 });
      }
      await this.storage.put(`challenge:${body.nonce}`, body);
      return Response.json({ stored: true });
    }
    if (url.pathname === '/get' && request.method === 'GET') {
      const value = url.searchParams.get('nonce') || '';
      const key = `challenge:${value}`;
      const record = await this.storage.get(key);
      if (!record || record.nonce !== value || record.expiresAt <= Date.now()) {
        if (record) await this.storage.delete(key);
        return Response.json({ error: 'Challenge unavailable.' }, { status: 404 });
      }
      return Response.json(record);
    }
    if (url.pathname === '/consume' && request.method === 'POST') {
      const body = await request.json();
      const key = `challenge:${body.nonce || ''}`;
      const consumed = await this.storage.transaction(async txn => {
        const record = await txn.get(key);
        if (!record || record.expiresAt <= Date.now() || record.message !== body.message) {
          if (record && record.expiresAt <= Date.now()) await txn.delete(key);
          return false;
        }
        await txn.delete(key);
        return true;
      });
      if (!consumed) return Response.json({ error: 'Challenge unavailable.' }, { status: 409 });
      return Response.json({ consumed: true });
    }
    return Response.json({ error: 'Not found.' }, { status: 404 });
  }
}
