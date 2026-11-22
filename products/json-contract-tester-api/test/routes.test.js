import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/index.js';

test('root route returns service information and useful endpoint links', async () => {
  const response = await app.fetch(new Request('https://api.example.test/'), {});
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.name, 'JSON Contract Tester API');
  assert.equal(body.status, 'ok');
  assert.equal(body.endpoints.health, '/health');
  assert.equal(body.endpoints.discovery, '/.well-known/x402');
  assert.equal(body.endpoints.openapi, '/openapi.json');
  assert.equal(body.endpoints.validate, 'POST /v1/validate-batch');
  assert.match(body.product, /json-contract-tester/);
});

test('health route remains public and reports the service status', async () => {
  const response = await app.fetch(new Request('https://api.example.test/health'), {});
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, 'ok');
  assert.equal(body.service, 'json-contract-tester-api');
});

test('GET and HEAD discovery probes are routed through payment gating, not 404', async () => {
  const getResponse = await app.fetch(new Request('https://api.example.test/v1/validate-batch'), {});
  assert.equal(getResponse.status, 503);
  assert.equal((await getResponse.json()).error, 'Payments are disabled pending receiver verification.');

  const headResponse = await app.fetch(new Request('https://api.example.test/v1/validate-batch', { method: 'HEAD' }), {});
  assert.equal(headResponse.status, 503);
  assert.equal(headResponse.headers.get('content-type'), 'application/json');
});

test('legacy x402 discovery manifest is unavailable while payments are disabled', async () => {
  const response = await app.fetch(new Request('https://api.example.test/.well-known/x402'), {});
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, 'Payments are disabled pending receiver verification.');
});

test('legacy x402 discovery manifest is available only after explicit enablement', async () => {
  const response = await app.fetch(new Request('https://api.example.test/.well-known/x402'), { PAYMENTS_ENABLED: 'true' });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.resources[0].path, '/v1/validate-batch');
});

test('CDP Bazaar x402 manifest exposes the paid resource and public receiver', async () => {
  const payTo = '0x1111111111111111111111111111111111111111';
  const response = await app.fetch(new Request('https://api.example.test/.well-known/x402.json'), { PAYMENTS_ENABLED: 'true', PAY_TO: payTo });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.x402Version, 2);
  assert.equal(body.resources[0].url, 'https://api.example.test/v1/validate-batch');
  assert.equal(body.resources[0].accepts[0].scheme, 'exact');
  assert.equal(body.resources[0].accepts[0].network, 'eip155:8453');
  assert.equal(body.resources[0].accepts[0].payTo, payTo);
  assert.equal(body.resources[0].accepts[0].amount, '5000');
  assert.equal(body.resources[0].serviceName, 'JSON Contract Tester API');
  assert.ok(body.resources[0].tags.includes('json-schema-validation'));
  assert.equal(body.resources[0].extensions.bazaar.info.input.method, 'POST');
  assert.equal(body.resources[0].extensions.bazaar.info.input.body.outputs.length, 2);
  assert.equal(body.resources[0].extensions.bazaar.info.output.type, 'json');
  assert.equal(body.resources[0].outputSchema.properties.valid.type, 'boolean');
});

test('empty-body POST marketplace probes reach x402 payment gating', async () => {
  const response = await app.fetch(new Request('https://api.example.test/v1/validate-batch', { method: 'POST' }), {});
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, 'Payments are disabled pending receiver verification.');
});

test('OpenAPI accurately documents the paused payment state without advertising checkout', async () => {
  const response = await app.fetch(new Request('https://api.example.test/openapi.json'), {});
  assert.equal(response.status, 200);
  const body = await response.json();
  const paths = body.paths['/v1/validate-batch'];
  assert.equal(paths.get.responses['503'].description, 'Payments are disabled pending receiver verification.');
  assert.equal(paths.head.responses['503'].description, 'Payments are disabled pending receiver verification.');
  assert.equal(paths.post.responses['503'].description, 'Payments are disabled pending receiver verification.');
  assert.equal(paths.post['x-payment-info'], undefined);
  assert.equal(paths.post['x-payment-required'], undefined);
  assert.doesNotMatch(JSON.stringify(body), /0\\.005|PAYMENT-REQUIRED|x-payment-info/);
});

test('explicitly enabled payments still fail closed without a valid receiver', async () => {
  const response = await app.fetch(new Request('https://api.example.test/.well-known/x402.json'), { PAYMENTS_ENABLED: 'true' });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, 'Payment receiver is not configured.');
});
