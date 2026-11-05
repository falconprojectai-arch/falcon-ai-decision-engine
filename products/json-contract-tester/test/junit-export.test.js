const test = require('node:test');
const assert = require('node:assert/strict');
const { buildJUnitXml } = require('../junit-export.js');

test('emits one testcase per sample and correct failure counts', function () {
  const xml = buildJUnitXml({
    generatedAt: '2026-11-05T10:17:38.000Z',
    results: [
      { sampleIndex: 1, inputLine: 1, passed: true, errors: [] },
      { sampleIndex: 2, inputLine: 2, passed: false, errors: [{ instancePath: '/ok', schemaPath: '#/properties/ok/type', keyword: 'type', message: 'Wrong type', expected: 'boolean', actual: 'string' }] }
    ]
  });
  assert.match(xml, /<testsuites tests="2" failures="1"/);
  assert.match(xml, /<testcase classname="JSON Contract Tester" name="sample-1">/);
  assert.match(xml, /<testcase classname="JSON Contract Tester" name="sample-2">/);
  assert.match(xml, /<failure message="Wrong type" type="type">/);
  assert.match(xml, /instancePath: \/ok/);
  assert.match(xml, /expected: &quot;boolean&quot;/);
  assert.match(xml, /actual: &quot;string&quot;/);
});

test('escapes XML metacharacters in failure attributes and text', function () {
  const xml = buildJUnitXml({
    generatedAt: '2026-11-05T10:17:38.000Z',
    results: [{ sampleIndex: 1, inputLine: 1, passed: false, errors: [{ keyword: 'type', message: 'Expected <x> & "y"', expected: '<ok>', actual: "a&b'c" }] }]
  });
  assert.match(xml, /message="Expected &lt;x&gt; &amp; &quot;y&quot;"/);
  assert.match(xml, /expected: &quot;&lt;ok&gt;&quot;/);
  assert.match(xml, /actual: &quot;a&amp;b&apos;c&quot;/);
});

test('handles an empty report', function () {
  const xml = buildJUnitXml({ results: [] });
  assert.match(xml, /<testsuites tests="0" failures="0"/);
  assert.match(xml, /<testsuite name="JSON Contract Tester" tests="0" failures="0"/);
});
