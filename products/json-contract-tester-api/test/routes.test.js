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
  assert.equal((await getResponse.json()).error, 'Payment receiver is not configured.');

  const headResponse = await app.fetch(new Request('https://api.example.test/v1/validate-batch', { method: 'HEAD' }), {});
  assert.equal(headResponse.status, 503);
  assert.equal(headResponse.headers.get('content-type'), 'application/json');
});
