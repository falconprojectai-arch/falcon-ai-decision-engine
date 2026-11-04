import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { paymentMiddleware, x402ResourceServer } from '@x402/hono';
import { HTTPFacilitatorClient } from '@x402/core/server';
import { registerExactEvmScheme } from '@x402/evm/exact/server';
import { bazaarResourceServerExtension } from '@x402/extensions/bazaar';
import { validateBatch, LIMITS } from './validator.js';

const app = new Hono();

const serviceDescription = 'JSON Schema validation API for AI agents, LLM structured outputs, API responses, webhook payloads, and backend data contracts. Validate 1–10 JSON samples in one batch against a documented JSON Schema subset; receive per-sample PASS/FAIL results and structured JSON Pointer diagnostics for contract testing and regression checks. Not full JSON Schema; the pattern keyword is unsupported. $0.005 USDC per batch on Base Mainnet via x402 v2 exact.';
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
const bazaarInputExample = {
  schema: { type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } },
  outputs: [
    { id: 'valid-sample', json: { ok: true } },
    { id: 'invalid-sample', json: { ok: 'yes' } }
  ]
};
const bazaarOutputExample = {
  reportVersion: '1.0',
  tool: 'JSON Contract Tester API',
  valid: false,
  summary: { total: 2, passed: 1, failed: 1 },
  results: [
    { id: 'valid-sample', passed: true, errors: [] },
    {
      id: 'invalid-sample',
      passed: false,
      errors: [{
        instancePath: '/ok',
        schemaPath: '#/properties/ok/type',
        keyword: 'type',
        message: 'Value has the wrong type',
        expected: 'boolean',
        actual: 'string'
      }]
    }
  ],
  limitation: 'Documented JSON Schema subset only; not a full JSON Schema implementation.'
};
const bazaarOutputSchema = {
  type: 'object',
  required: ['reportVersion', 'tool', 'valid', 'summary', 'results', 'limitation'],
  properties: {
    reportVersion: { const: '1.0' },
    tool: { const: 'JSON Contract Tester API' },
    valid: { type: 'boolean' },
    summary: {
      type: 'object',
      required: ['total', 'passed', 'failed'],
      properties: {
        total: { type: 'integer' },
        passed: { type: 'integer' },
        failed: { type: 'integer' }
      }
    },
    results: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'passed', 'errors'],
        properties: {
          id: { type: 'string' },
          passed: { type: 'boolean' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              required: ['instancePath', 'schemaPath', 'keyword', 'message', 'expected', 'actual'],
              properties: {
                instancePath: { type: 'string' },
                schemaPath: { type: 'string' },
                keyword: { type: 'string' },
                message: { type: 'string' },
                expected: {},
                actual: {}
              }
            }
          }
        }
      }
    },
    limitation: { type: 'string' }
  }
};
const bazaarExtension = {
  info: {
    input: {
      type: 'http',
      method: 'POST',
      bodyType: 'json',
      body: bazaarInputExample
    },
    output: {
      type: 'json',
      example: bazaarOutputExample
    }
  },
  schema: {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    properties: {
      input: {
        type: 'object',
        properties: {
          type: { type: 'string', const: 'http' },
          method: { type: 'string', enum: ['POST', 'PUT', 'PATCH'] },
          bodyType: { type: 'string', enum: ['json', 'form-data', 'text'] },
          body: requestSchema,
          queryParams: { type: 'object', additionalProperties: { type: 'string' } },
          headers: { type: 'object', additionalProperties: { type: 'string' } }
        },
        required: ['type', 'method', 'bodyType', 'body'],
        additionalProperties: false
      },
      output: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          example: bazaarOutputSchema
        },
        required: ['type']
      }
    },
    required: ['input']
  }
};
const resourceTags = [
  'json-schema-validation',
  'api-response-validation',
  'ai-agent-output',
  'structured-output',
  'webhook-validation',
  'contract-testing',
  'regression-testing'
];

const discoveryManifest = {
  name: 'JSON Contract Tester API',
  description: serviceDescription,
  version: '0.1.0',
  resources: [{
    name: 'validate_json_batch',
    path: '/v1/validate-batch',
    method: 'POST',
    summary: 'JSON Schema validation for AI-agent outputs, API responses, and webhook payloads; batch PASS/FAIL with JSON Pointer diagnostics.',
    tags: ['json-schema-validation', 'json-validation', 'api-response-validation', 'ai-agent-output', 'structured-output', 'webhook-validation', 'contract-testing', 'regression-testing'],
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
    '/.well-known/x402.json': {
      get: {
        operationId: 'getCdpBazaarX402Manifest',
        summary: 'x402 v2 manifest for agent marketplaces',
        description: 'Public machine-readable manifest including the paid resource URL, Base USDC price, and receiving address.',
        security: [],
        responses: {
          '200': { description: 'x402 v2 resource manifest' },
          '503': { description: 'Payment receiver is not configured.' }
        }
      }
    },
    '/v1/validate-batch': {
      get: {
        operationId: 'probeValidateBatchGet',
        summary: 'Read-only x402 discovery probe (validation requires POST)',
        description: 'Returns the same unpaid x402 challenge for marketplace discovery. GET is not the billable validation operation; use POST with the documented request body.',
        tags: ['json-schema-validation', 'api-response-validation'],
        'x-payment-required': true,
        responses: {
          '402': { description: 'x402 v2 discovery challenge; no validation is performed.' },
          '405': { description: 'Use POST for batch validation; no settlement occurs.' }
        }
      },
      head: {
        operationId: 'probeValidateBatchHead',
        summary: 'Read-only x402 discovery probe (validation requires POST)',
        description: 'HEAD returns the same unpaid x402 challenge for marketplace discovery. The billable validation operation remains POST.',
        tags: ['json-schema-validation', 'api-response-validation'],
        'x-payment-required': true,
        responses: {
          '402': { description: 'x402 v2 discovery challenge; no validation is performed.' },
          '405': { description: 'Use POST for batch validation; no settlement occurs.' }
        }
      },
      post: {
        operationId: 'validateJsonBatch',
        summary: 'Validate JSON Schema for AI outputs, API responses, and webhook payloads',
        description: serviceDescription,
        tags: ['json-schema-validation', 'json-validation', 'api-response-validation', 'ai-agent-output', 'structured-output', 'webhook-validation', 'contract-testing', 'regression-testing'],
        'x-price-usd': '0.005',
        'x-x402-network': 'eip155:8453',
        'x-payment-info': {
          protocols: ['x402'],
          price: { mode: 'fixed', currency: 'USD', amount: '0.005' },
          network: 'eip155:8453',
          asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
        },
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
resourceServer.registerExtension(bazaarResourceServerExtension);

async function readLimitedBody(request, maxBytes) {
  if (!request.body) return { empty: true };
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
  if (total === 0) return { empty: true };
  try { return { value: JSON.parse(new TextDecoder().decode(joined)) }; }
  catch { return { error: 'Request body must be valid JSON.' }; }
}

app.get('/', c => c.json({
  name: 'JSON Contract Tester API',
  status: 'ok',
  description: 'Paid batch validation API for JSON outputs against a documented JSON Schema subset.',
  price: '0.005 USDC per batch on Base Mainnet (x402)',
  endpoints: {
    health: '/health',
    discovery: '/.well-known/x402',
    openapi: '/openapi.json',
    validate: 'POST /v1/validate-batch'
  },
  product: 'https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/'
}));
app.get('/health', c => c.json({ status: 'ok', service: 'json-contract-tester-api', version: '0.1.0' }));
app.get('/.well-known/x402', c => c.json(discoveryManifest));
// Coinbase CDP Bazaar-compatible x402 v2 manifest. The receiving address is
// public payment metadata and is read from the Worker secret at request time.
app.get('/.well-known/x402.json', c => {
  const payTo = c.env.PAY_TO;
  if (!payTo || !/^0x[a-fA-F0-9]{40}$/.test(payTo)) return c.json({ error: 'Payment receiver is not configured.' }, 503);
  return c.json({
    x402Version: 2,
    resources: [{
      url: new URL('/v1/validate-batch', c.req.url).toString(),
      type: 'http',
      serviceName: 'JSON Contract Tester API',
      description: serviceDescription,
      mimeType: 'application/json',
      tags: resourceTags,
      outputSchema: bazaarOutputSchema,
      extensions: { bazaar: bazaarExtension },
      accepts: [{
        scheme: 'exact',
        network: 'eip155:8453',
        payTo,
        asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        amount: '5000',
        maxTimeoutSeconds: 60
      }]
    }]
  });
});
app.get('/openapi.json', c => c.json(openApiDocument));

// Reject only malformed or oversized bodies before payment. Schema/batch
// validation happens after payment so generic x402 directory probes using {}
// receive the real 402 challenge rather than a misleading 400 response.
app.use('/v1/validate-batch', async (c, next) => {
  if (c.req.method !== 'POST') return next();
  const parsed = await readLimitedBody(c.req.raw, LIMITS.maxBodyBytes);
  if (parsed.tooLarge) return c.json({ error: `Request body exceeds ${LIMITS.maxBodyBytes} bytes.` }, 413);
  if (parsed.error) return c.json({ error: parsed.error }, 400);
  // Empty-body POST probes from paid-API directories must receive the live
  // x402 challenge. If a buyer pays without a valid batch body, validation
  // returns 400 and the middleware does not settle a successful response.
  c.set('requestBody', parsed.empty ? null : parsed.value);
  return next();
});

app.use('*', async (c, next) => {
  if (c.req.path !== '/v1/validate-batch' || !['GET', 'HEAD', 'POST'].includes(c.req.method)) return next();
  const payTo = c.env.PAY_TO;
  if (!payTo || !/^0x[a-fA-F0-9]{40}$/.test(payTo)) return c.json({ error: 'Payment receiver is not configured.' }, 503);
  const accepts = [{ scheme: 'exact', price: '$0.005', network: 'eip155:8453', payTo, maxTimeoutSeconds: 60 }];
  const publicAccepts = [{
    scheme: 'exact',
    network: 'eip155:8453',
    payTo,
    asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    amount: '5000',
    maxTimeoutSeconds: 60
  }];
  const description = 'Validate 1–10 JSON outputs against the documented JSON Schema subset; receive structured PASS/FAIL results and JSON Pointer diagnostics.';
  // GET and HEAD expose the same unpaid 402 challenge for read-only marketplace
  // probes. The actual billable operation remains POST only.
  const mw = paymentMiddleware({
    'POST /v1/validate-batch': {
      accepts,
      description,
      mimeType: 'application/json',
      extensions: { bazaar: bazaarExtension }
    },
    'GET /v1/validate-batch': { accepts, description, mimeType: 'application/json' },
    'HEAD /v1/validate-batch': { accepts, description, mimeType: 'application/json' }
  }, resourceServer);
  const response = await mw(c, next);
  if (response.status !== 402) return response;
  // Preserve the canonical x402 v2 header and expose accepts[] in the body
  // for older marketplace indexers that still parse v1-style JSON challenges.
  const headers = new Headers(response.headers);
  headers.set('content-type', 'application/json; charset=UTF-8');
  return new Response(JSON.stringify({
    x402Version: 2,
    error: 'Payment required',
    resource: {
      url: new URL('/v1/validate-batch', c.req.url).toString(),
      description,
      mimeType: 'application/json',
      serviceName: 'JSON Contract Tester API',
      tags: resourceTags
    },
    accepts: publicAccepts,
    extensions: { bazaar: bazaarExtension }
  }), {
    status: 402,
    headers
  });
});

const discoveryMethodNotAllowed = c => c.json({ error: 'Use POST /v1/validate-batch for batch validation.' }, 405, { Allow: 'POST' });
app.get('/v1/validate-batch', discoveryMethodNotAllowed);
app.on('HEAD', '/v1/validate-batch', c => new Response(null, { status: 405, headers: { Allow: 'POST' } }));

app.post('/v1/validate-batch', c => {
  const result = validateBatch(c.get('requestBody'));
  if (!result.ok) return c.json({ error: result.error }, result.status);
  return c.json(result.data);
});
app.notFound(c => c.json({ error: 'Not found.' }, 404));
export default app;
