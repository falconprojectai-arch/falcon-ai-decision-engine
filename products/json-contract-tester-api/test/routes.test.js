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

test('CDP Bazaar x402 manifest exposes the paid resource and public receiver', async () => {
  const payTo = '0x1111111111111111111111111111111111111111';
  const response = await app.fetch(new Request('https://api.example.test/.well-known/x402.json'), { PAY_TO: payTo });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.x402Version, 2);
  assert.equal(body.resources[0].url, 'https://api.example.test/v1/validate-batch');
  assert.equal(body.resources[0].accepts[0].scheme, 'exact');
  assert.equal(body.resources[0].accepts[0].network, 'eip155:8453');
  assert.equal(body.resources[0].accepts[0].payTo, payTo);
  assert.equal(body.resources[0].accepts[0].amount, '5000');
});

test('empty-body POST marketplace probes reach x402 payment gating', async () => {
  const response = await app.fetch(new Request('https://api.example.test/v1/validate-batch', { method: 'POST' }), {});
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, 'Payment receiver is not configured.');
});

test('OpenAPI exposes x-payment-info for x402 discovery registries', async () => {
  const response = await app.fetch(new Request('https://api.example.test/openapi.json'), {});
  assert.equal(response.status, 200);
  const body = await response.json();
  const operation = body.paths['/v1/validate-batch'].post;
  assert.deepEqual(operation['x-payment-info'].protocols, ['x402']);
  assert.equal(operation['x-payment-info'].price.mode, 'fixed');
  assert.equal(operation['x-payment-info'].price.currency, 'USD');
  assert.equal(operation['x-payment-info'].price.amount, '0.005');
});
