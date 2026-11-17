'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { inspectSchema } = require('../schema-guard.js');

test('accepts the documented subset and nested schema nodes', () => {
  const issues = inspectSchema({
    type: 'object',
    title: 'Response',
    required: ['ok', 'items'],
    properties: {
      ok: { type: 'boolean' },
      items: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'integer', minimum: 1 } },
          additionalProperties: false
        }
      },
      code: { type: 'string', pattern: '^[A-Z]+$' }
    },
    additionalProperties: false
  });
  assert.deepEqual(issues, []);
});

test('rejects unsupported keywords at root and nested property paths', () => {
  const issues = inspectSchema({
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      data: { type: 'object', patternProperties: { '^x': { type: 'string' } } }
    },
    $defs: { item: { type: 'string' } }
  });
  assert.deepEqual(issues.map(x => [x.keyword, x.schemaPath]), [
    ['format', '#/properties/email/format'],
    ['patternProperties', '#/properties/data/patternProperties'],
    ['$defs', '#/$defs']
  ]);
});

test('rejects unsupported schema forms instead of silently passing them', () => {
  const issues = inspectSchema({
    type: 'array',
    items: [{ type: 'string' }],
    additionalProperties: { type: 'string' }
  });
  assert.deepEqual(issues.map(x => x.keyword), ['items', 'additionalProperties']);
});

test('rejects malformed keyword values and invalid regular expressions', () => {
  const issues = inspectSchema({
    type: ['string', 'not-a-json-type'],
    required: 'name',
    enum: [],
    minLength: -1,
    pattern: '['
  });
  assert.deepEqual(issues.map(x => x.keyword), ['type', 'required', 'enum', 'minLength', 'pattern']);
});

test('ignores annotation data without scanning it as nested schema', () => {
  const issues = inspectSchema({
    type: 'object',
    title: 'Example',
    description: 'A property called oneOf is just data in this annotation.',
    default: { oneOf: [{ type: 'string' }] },
    examples: [{ format: 'email' }],
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    properties: { value: { type: 'string' } }
  });
  assert.deepEqual(issues, []);
});

test('escapes slash and tilde in JSON Pointer schema paths', () => {
  const issues = inspectSchema({ properties: { 'a/b~c': { format: 'email' } } });
  assert.equal(issues[0].schemaPath, '#/properties/a~1b~0c/format');
});
