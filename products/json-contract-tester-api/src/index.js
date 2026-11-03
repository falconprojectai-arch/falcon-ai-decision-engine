import { Hono } from 'hono';
import { paymentMiddleware, x402ResourceServer } from '@x402/hono';
import { HTTPFacilitatorClient } from '@x402/core/server';
import { registerExactEvmScheme } from '@x402/evm/exact/server';
import { validateBatch, LIMITS } from './validator.js';

const app = new Hono();
const facilitator = new HTTPFacilitatorClient({ url: 'https://x402.org/facilitator' });
const resourceServer = new x402ResourceServer(facilitator);
registerExactEvmScheme(resourceServer);

async function readLimitedBody(request, maxBytes) {
  if (!request.body) return { error: 'Request body is required.' };
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > maxBytes) return { tooLarge: true };
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) { await reader.cancel(); return { tooLarge: true }; }
    chunks.push(value);
  }
  const joined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.byteLength; }
  try { return { value: JSON.parse(new TextDecoder().decode(joined)) }; }
  catch { return { error: 'Request body must be valid JSON.' }; }
}

app.get('/health', c => c.json({ status: 'ok', service: 'json-contract-tester-api', version: '0.1.0' }));

// Reject malformed/oversized requests before the payment middleware.
app.use('/v1/validate-batch', async (c, next) => {
  if (c.req.method !== 'POST') return next();
  const parsed = await readLimitedBody(c.req.raw, LIMITS.maxBodyBytes);
  if (parsed.tooLarge) return c.json({ error: `Request body exceeds ${LIMITS.maxBodyBytes} bytes.` }, 413);
  if (parsed.error) return c.json({ error: parsed.error }, 400);
  const result = validateBatch(parsed.value);
  if (!result.ok) return c.json({ error: result.error }, result.status);
  c.set('validationResult', result.data);
  return next();
});

app.use('*', async (c, next) => {
  if (c.req.path !== '/v1/validate-batch' || c.req.method !== 'POST') return next();
  const payTo = c.env.PAY_TO;
  if (!payTo || !/^0x[a-fA-F0-9]{40}$/.test(payTo)) return c.json({ error: 'Payment receiver is not configured.' }, 503);
  const mw = paymentMiddleware({
    'POST /v1/validate-batch': {
      accepts: [{ scheme: 'exact', price: '$0.005', network: 'eip155:8453', payTo }],
      description: 'Validate 1–10 JSON outputs against the documented JSON Schema subset; receive structured PASS/FAIL results and JSON Pointer diagnostics.',
      mimeType: 'application/json'
    }
  }, resourceServer);
  return mw(c, next);
});

app.post('/v1/validate-batch', c => {
  const result = c.get('validationResult');
  if (!result) return c.json({ error: 'Validation preflight failed.' }, 400);
  return c.json(result);
});
app.notFound(c => c.json({ error: 'Not found.' }, 404));
export default app;
