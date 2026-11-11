import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBatch } from '../src/validator.js';
const schema = { type: 'object', required: ['ok', 'result', 'meta'], additionalProperties: false,
  properties: { ok: { type: 'boolean' }, result: { type: 'string' }, meta: { type: 'object', required: ['retry_count'], properties: { retry_count: { type: 'integer' } } } } };
test('mixed batch reports one pass and three failures with nested JSON Pointer', () => {
  const r = validateBatch({ schema, outputs: [
    { id: 'good', json: { ok: true, result: 'done', meta: { retry_count: 1 } } },
    { id: 'missing', json: { ok: true, result: 'done' } },
    { id: 'wrong-type', json: { ok: 'yes', result: 'done', meta: { retry_count: 0 } } },
    { id: 'nested', json: { ok: true, result: 'done', meta: { retry_count: '2' } } }
  ]});
  assert.equal(r.ok, true); assert.deepEqual(r.data.summary, { total: 4, passed: 1, failed: 3 });
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
  let value = {}; for (let i = 0; i < 35; i++) value = { child: value };
  const r = validateBatch({ schema: { type: 'object' }, outputs: [{ json: value }] });
  assert.equal(r.ok, false); assert.match(r.error, /nesting/);
});
test('escapes JSON Pointer property names', () => {
  const r = validateBatch({ schema: { type: 'object', properties: { 'a/b~c': { type: 'integer' } } }, outputs: [{ json: { 'a/b~c': 'bad' } }] });
  assert.equal(r.data.results[0].errors[0].instancePath, '/a~1b~0c');
});
test('rejects batches that exceed the total JSON node budget', () => {
  const many = Object.fromEntries(Array.from({ length: 2100 }, (_, i) => [`k${i}`, i]));
  const r = validateBatch({ schema: { type: 'object' }, outputs: [{ json: many }] });
  assert.equal(r.ok, false); assert.match(r.error, /JSON nodes/);
});


test('rejects regex pattern schemas before payment to avoid unbounded regex work', () => {
  const r = validateBatch({ schema: { type: 'string', pattern: '^(a+)+$' }, outputs: [{ json: 'aaaa' }] });
  assert.equal(r.ok, false);
  assert.match(r.error, /does not support the pattern keyword/);
});


test('rejects nested unsupported composition keywords instead of silently passing', () => {
  const r = validateBatch({
    schema: { type: 'object', properties: { status: { oneOf: [{ const: 'ok' }, { const: 'done' }] } } },
    outputs: [{ json: { status: 'ok' } }]
  });
  assert.equal(r.ok, false);
  assert.equal(r.status, 400);
  assert.equal(r.code, 'unsupported_schema');
  assert.deepEqual(r.unsupportedKeywords, [{ keyword: 'oneOf', schemaPath: '#/properties/status/oneOf' }]);
  assert.match(r.error, /oneOf/);
});

test('rejects references and formats explicitly', () => {
  const r = validateBatch({
    schema: { type: 'string', format: 'email', $ref: '#/$defs/email' },
    outputs: [{ json: 'buyer@example.test' }]
  });
  assert.equal(r.ok, false);
  assert.equal(r.code, 'unsupported_schema');
  assert.deepEqual(r.unsupportedKeywords.map(x => x.keyword).sort(), ['$ref', 'format']);
});

test('does not treat ordinary JSON data inside enum as schema keywords', () => {
  const value = { oneOf: 'ordinary-data' };
  const r = validateBatch({ schema: { enum: [value] }, outputs: [{ json: value }] });
  assert.equal(r.ok, true);
  assert.equal(r.data.results[0].passed, true);
});

test('rejects unsupported additionalProperties schema forms', () => {
  const r = validateBatch({
    schema: { type: 'object', additionalProperties: { type: 'string' } },
    outputs: [{ json: { note: 'ok' } }]
  });
  assert.equal(r.ok, false);
  assert.equal(r.code, 'unsupported_schema');
  assert.equal(r.unsupportedKeywords[0].keyword, 'additionalProperties');
});
