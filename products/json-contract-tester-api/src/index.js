import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { paymentMiddleware, x402ResourceServer } from '@x402/hono';
import { HTTPFacilitatorClient } from '@x402/core/server';
import { registerExactEvmScheme } from '@x402/evm/exact/server';
import { validateBatch, LIMITS } from './validator.js';

const app = new Hono();

const serviceDescription = 'Validate 1–10 JSON outputs against a documented JSON Schema subset. Returns per-sample PASS/FAIL results and JSON Pointer diagnostics. $0.005 USDC per batch on Base Mainnet via x402 v2 exact.';
const requestExample = {
  schema: {
    type: 'object',
    required: ['ok'],
    properties: { ok: { type: 'boolean' } }
  },
  outputs: [{ id: 'sample-1', json: { ok: true } }]
};
const requestSchema = {
  type: 'object',
  required: ['schema', 'outputs'],
  properties: {
    schema: { type: 'object', description: 'Supported JSON Schema subset.' },
    outputs: {
      type: 'array',
      minItems: 1,
      maxItems: 10,
      items: {
        type: 'object',
        required: ['json'],
        properties: {
          id: { type: 'string', maxLength: 80 },
          json: {}
        }
      }
    }
  }
};

// Machine-readable discovery metadata. Marketplaces can discover the POST route
// without guessing its method or request body, then verify the live 402 quote.
const discoveryManifest = {
  name: 'JSON Contract Tester API',
  description: serviceDescription,
  version: '0.1.0',
  resources: [{
    name: 'validate_json_batch',
    path: '/v1/validate-batch',
    method: 'POST',
    summary: serviceDescription,
    price_usd: '0.005',
    accepts: [{
      scheme: 'exact',
      network: 'eip155:8453',
      asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '5000',
      maxTimeoutSeconds: 60,
      extra: { name: 'USD Coin', version: '2' }
    }],
    input_schema: requestSchema,
    example: requestExample
  }]
};
const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'JSON Contract Tester API',
    version: '0.1.0',
    description: serviceDescription
  },
  servers: [{ url: 'https://json-contract-tester-api.falcon-project-ai.workers.dev' }],
  paths: {
    '/v1/validate-batch': {
      post: {
        operationId: 'validateJsonBatch',
        summary: 'Validate a batch of JSON outputs',
        description: serviceDescription,
        tags: ['validation', 'json'],
        'x-price-usd': '0.005',
        'x-x402-network': 'eip155:8453',
        'x-payment-required': true,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: requestSchema,
              example: requestExample
            }
          }
        },
        responses: {
          '200': { description: 'Batch validation report; individual samples may pass or fail.' },
          '400': { description: 'Invalid schema or batch shape; returned after payment verification, before successful settlement.' },
          '402': { description: 'x402 v2 payment required; inspect PAYMENT-REQUIRED.' },
          '413': { description: 'Request body exceeds 64 KiB; rejected before payment.' },
          '503': { description: 'Payment receiver is not configured.' }
        }
      }
    }
  }
};

// Allow browser clients to read the x402 payment challenge and submit payment signatures.
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'PAYMENT-SIGNATURE'],
  exposeHeaders: ['PAYMENT-REQUIRED', 'PAYMENT-RESPONSE'],
  maxAge: 86400
}));
const facilitator = new HTTPFacilitatorClient({ url: 'https://facilitator.payai.network' });
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
app.get('/.well-known/x402', c => c.json(discoveryManifest));
app.get('/openapi.json', c => c.json(openApiDocument));

// Reject only malformed or oversized bodies before payment. Schema/batch
// validation happens after payment so generic x402 directory probes using {}
// receive the real 402 challenge rather than a misleading 400 response.
app.use('/v1/validate-batch', async (c, next) => {
  if (c.req.method !== 'POST') return next();
  const parsed = await readLimitedBody(c.req.raw, LIMITS.maxBodyBytes);
  if (parsed.tooLarge) return c.json({ error: `Request body exceeds ${LIMITS.maxBodyBytes} bytes.` }, 413);
  if (parsed.error) return c.json({ error: parsed.error }, 400);
  c.set('requestBody', parsed.value);
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
  const result = validateBatch(c.get('requestBody'));
  if (!result.ok) return c.json({ error: result.error }, result.status);
  return c.json(result.data);
});
app.notFound(c => c.json({ error: 'Not found.' }, 404));
export default app;
