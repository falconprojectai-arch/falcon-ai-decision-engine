import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBatch } from '../src/validator.js';

const schema = {
  type: 'object', required: ['ok', 'result', 'meta'], additionalProperties: false,
  properties: {
    ok: { type: 'boolean' }, result: { type: 'string' },
    meta: { type: 'object', required: ['retry_count'], properties: { retry_count: { type: 'integer' } } }
  }
};

test('mixed batch reports one pass and three failures with nested JSON Pointer', () => {
  const r = validateBatch({ schema, outputs: [
    { id: 'good', json: { ok: true, result: 'done', meta: { retry_count: 1 } } },
    { id: 'missing', json: { ok: true, result: 'done' } },
    { id: 'wrong-type', json: { ok: 'yes', result: 'done', meta: { retry_count: 0 } } },
    { id: 'nested', json: { ok: true, result: 'done', meta: { retry_count: '2' } } }
  ]});
  assert.equal(r.ok, true);
  assert.deepEqual(r.data.summary, { total: 4, passed: 1, failed: 3 });
  assert.equal(r.data.results[3].errors[0].instancePath, '/meta/retry_count');
  assert.equal(r.data.results[3].errors[0].keyword, 'type');
  assert.equal(r.data.results[3].errors[0].expected, 'integer');
  assert.equal(r.data.results[3].errors[0].actual, 'string');
});

test('rejects empty and oversized batches before payment middleware', () => {
  assert.equal(validateBatch({ schema, outputs: [] }).status, 400);
  assert.equal(validateBatch({ schema, outputs: Array.from({ length: 11 }, () => ({ json: {} })) }).status, 400);
});

test('rejects excessive nesting', () => {
  let value = {};
  for (let i = 0; i < 35; i++) value = { child: value };
  const r = validateBatch({ schema: { type: 'object' }, outputs: [{ json: value }] });
  assert.equal(r.ok, false);
  assert.match(r.error, /nesting/);
});

test('escapes JSON Pointer property names', () => {
  const r = validateBatch({ schema: { type: 'object', properties: { 'a/b~c': { type: 'integer' } } }, outputs: [{ json: { 'a/b~c': 'bad' } }] });
  assert.equal(r.data.results[0].errors[0].instancePath, '/a~1b~0c');
});
