const MAX_DEPTH = 32;
const MAX_ERRORS_PER_SAMPLE = 100;
const MAX_NODES_PER_BATCH = 2000;
function sameJson(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  return ak.length === bk.length && ak.every(k => Object.prototype.hasOwnProperty.call(b, k) && sameJson(a[k], b[k]));
}
function pointerJoin(base, part) { return `${base}/${String(part).replace(/~/g, '~0').replace(/\\//g, '~1')}`; }
function schemaJoin(base, part) { return `${base}/${String(part).replace(/~/g, '~0').replace(/\\//g, '~1')}`; }
function actualValue(value) {
  try { const s = JSON.stringify(value); return s === undefined ? String(value) : s.length > 500 ? `${s.slice(0, 497)}...` : s; }
  catch { return String(value); }
}
function issue(errors, instancePath, schemaPath, keyword, message, expected, actual) {
  if (errors.length >= MAX_ERRORS_PER_SAMPLE) return;
  errors.push({ instancePath: instancePath || '/', schemaPath: schemaPath || '#', keyword, message,
    expected: expected === undefined ? null : expected, actual: actual === undefined ? null : actual });
}
function check(value, schema, path = '', schemaPath = '#', errors = [], depth = 0) {
  if (depth > MAX_DEPTH) { issue(errors, path, schemaPath, 'max_depth', 'Maximum validation depth exceeded', MAX_DEPTH, depth); return errors; }
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) { issue(errors, path, schemaPath, 'schema', 'Schema node must be an object', 'object schema node', actualValue(schema)); return errors; }
  if (Object.prototype.hasOwnProperty.call(schema, 'const') && !sameJson(value, schema.const)) issue(errors, path, schemaJoin(schemaPath, 'const'), 'const', 'Value must equal const value', actualValue(schema.const), actualValue(value));
  if (Array.isArray(schema.enum) && !schema.enum.some(v => sameJson(v, value))) issue(errors, path, schemaJoin(schemaPath, 'enum'), 'enum', 'Value is not in enum', actualValue(schema.enum), actualValue(value));
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (schema.type) {
    const matches = t => t === 'null' ? value === null : t === 'array' ? Array.isArray(value) : t === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value) : t === 'integer' ? typeof value === 'number' && Number.isInteger(value) : t === 'number' ? typeof value === 'number' && Number.isFinite(value) : t === 'boolean' ? typeof value === 'boolean' : t === 'string' ? typeof value === 'string' : false;
    if (!types.some(matches)) { issue(errors, path, schemaJoin(schemaPath, 'type'), 'type', 'Value has the wrong type', types.join(' or '), Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value); return errors; }
  }
  if (typeof value === 'string') {
    if (Number.isInteger(schema.minLength) && schema.minLength >= 0 && [...value].length < schema.minLength) issue(errors, path, schemaJoin(schemaPath, 'minLength'), 'minLength', 'String is shorter than minLength', schema.minLength, [...value].length);
    if (Number.isInteger(schema.maxLength) && schema.maxLength >= 0 && [...value].length > schema.maxLength) issue(errors, path, schemaJoin(schemaPath, 'maxLength'), 'maxLength', 'String is longer than maxLength', schema.maxLength, [...value].length);

  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (typeof schema.minimum === 'number' && value < schema.minimum) issue(errors, path, schemaJoin(schemaPath, 'minimum'), 'minimum', 'Number is below minimum', schema.minimum, value);
    if (typeof schema.maximum === 'number' && value > schema.maximum) issue(errors, path, schemaJoin(schemaPath, 'maximum'), 'maximum', 'Number is above maximum', schema.maximum, value);
  }
  if (Array.isArray(value)) {
    if (Number.isInteger(schema.minItems) && schema.minItems >= 0 && value.length < schema.minItems) issue(errors, path, schemaJoin(schemaPath, 'minItems'), 'minItems', 'Array has fewer than minItems', schema.minItems, value.length);
    if (Number.isInteger(schema.maxItems) && schema.maxItems >= 0 && value.length > schema.maxItems) issue(errors, path, schemaJoin(schemaPath, 'maxItems'), 'maxItems', 'Array has more than maxItems', schema.maxItems, value.length);
    if (schema.items && typeof schema.items === 'object' && !Array.isArray(schema.items)) value.forEach((v, i) => check(v, schema.items, pointerJoin(path, i), schemaJoin(schemaPath, 'items'), errors, depth + 1));
  }
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    if (Array.isArray(schema.required)) schema.required.forEach(k => { if (typeof k === 'string' && !Object.prototype.hasOwnProperty.call(value, k)) issue(errors, pointerJoin(path, k), schemaJoin(schemaPath, 'required'), 'required', 'Missing required property', k, 'missing'); });
    if (schema.properties && typeof schema.properties === 'object' && !Array.isArray(schema.properties)) Object.keys(schema.properties).forEach(k => { if (Object.prototype.hasOwnProperty.call(value, k)) check(value[k], schema.properties[k], pointerJoin(path, k), schemaJoin(schemaJoin(schemaPath, 'properties'), k), errors, depth + 1); });
    if (schema.additionalProperties === false && schema.properties && typeof schema.properties === 'object' && !Array.isArray(schema.properties)) Object.keys(value).forEach(k => { if (!Object.prototype.hasOwnProperty.call(schema.properties, k)) issue(errors, pointerJoin(path, k), schemaJoin(schemaPath, 'additionalProperties'), 'additionalProperties', 'Unexpected property', Object.keys(schema.properties), `present: ${k}`); });
  }
  return errors;
}
function hasPatternKeyword(schema) {
  if (!schema || typeof schema !== 'object') return false;
  if (Object.prototype.hasOwnProperty.call(schema, 'pattern')) return true;
  for (const child of Object.values(schema)) if (hasPatternKeyword(child)) return true;
  return false;
}

function inspectTree(value, depth = 0, budget = { nodes: 0 }) {
  budget.nodes++;
  if (depth > MAX_DEPTH) return { tooDeep: true, tooMany: false };
  if (budget.nodes > MAX_NODES_PER_BATCH) return { tooDeep: false, tooMany: true };
  if (value !== null && typeof value === 'object') for (const child of Object.values(value)) {
    const result = inspectTree(child, depth + 1, budget);
    if (result.tooDeep || result.tooMany) return result;
  }
  return { tooDeep: false, tooMany: false };
}
export function validateBatch(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, status: 400, error: 'Request body must be a JSON object.' };
  const { schema, outputs } = input;
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return { ok: false, status: 400, error: 'schema must be a JSON object.' };
  if (!Array.isArray(outputs) || outputs.length < 1 || outputs.length > 10) return { ok: false, status: 400, error: 'outputs must contain between 1 and 10 samples.' };
  if (hasPatternKeyword(schema)) return { ok: false, status: 400, error: 'The hosted API does not support the pattern keyword; use the local browser tester for regex rules.' };
  const budget = { nodes: 0 };
  const schemaStats = inspectTree(schema, 0, budget);
  if (schemaStats.tooDeep) return { ok: false, status: 400, error: `schema nesting exceeds ${MAX_DEPTH}.` };
  if (schemaStats.tooMany) return { ok: false, status: 400, error: `request exceeds ${MAX_NODES_PER_BATCH} JSON nodes.` };
  const results = []; let passed = 0;
  for (let i = 0; i < outputs.length; i++) {
    const sample = outputs[i];
    if (!sample || typeof sample !== 'object' || Array.isArray(sample) || !Object.prototype.hasOwnProperty.call(sample, 'json')) return { ok: false, status: 400, error: `outputs[${i}] must be an object with a json property.` };
    const stats = inspectTree(sample.json, 0, budget);
    if (stats.tooDeep) return { ok: false, status: 400, error: `outputs[${i}] nesting exceeds ${MAX_DEPTH}.` };
    if (stats.tooMany) return { ok: false, status: 400, error: `request exceeds ${MAX_NODES_PER_BATCH} JSON nodes.` };
    const errors = check(sample.json, schema); const success = errors.length === 0;
    if (success) passed++;
    results.push({ id: typeof sample.id === 'string' && sample.id.length <= 80 ? sample.id : `sample-${i + 1}`, passed: success, errors });
  }
  return { ok: true, data: { reportVersion: '1.0', tool: 'JSON Contract Tester API', valid: passed === outputs.length,
    summary: { total: outputs.length, passed, failed: outputs.length - passed }, results,
    limitation: 'Documented JSON Schema subset only; not a full JSON Schema implementation.' } };
}
export const LIMITS = { maxBodyBytes: 64 * 1024, maxOutputs: 10, maxDepth: MAX_DEPTH, maxNodes: MAX_NODES_PER_BATCH };
