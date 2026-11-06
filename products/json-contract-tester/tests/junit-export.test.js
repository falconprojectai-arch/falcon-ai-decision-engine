'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildJUnitXml } = require('../junit-export.js');

test('exports one JUnit testcase per sample with correct batch totals', () => {
  const xml = buildJUnitXml({
    generatedAt: '2026-11-06T08:00:00.000Z',
    results: [
      { sampleIndex: 1, inputLine: 1, passed: true, errors: [] },
      {
        sampleIndex: 2,
        inputLine: 4,
        passed: false,
        errors: [
          {
            instancePath: '/name',
            schemaPath: '#/properties/name/type',
            keyword: 'type',
            message: 'Expected a string',
            expected: 'string',
            actual: 42
          },
          {
            instancePath: '/nested',
            schemaPath: '#/properties/nested/required',
            keyword: 'required',
            message: 'Missing required field',
            expected: 'present',
            actual: null
          }
        ]
      }
    ]
  });

  assert.match(xml, /<testsuites tests="2" failures="1" errors="0" skipped="0">/);
  assert.match(xml, /<testsuite name="JSON Contract Tester" tests="2" failures="1"/);
  assert.equal((xml.match(/<testcase\b/g) || []).length, 2);
  assert.equal((xml.match(/<failure\b/g) || []).length, 1);
  assert.match(xml, /name="sample-1"/);
  assert.match(xml, /name="sample-2"/);
  assert.match(xml, /instancePath: \/name/);
  assert.match(xml, /instancePath: \/nested/);
  assert.match(xml, /timestamp="2026-11-06T08:00:00.000Z"/);
});

test('escapes XML special characters in failure attributes and text', () => {
  const xml = buildJUnitXml({
    results: [{
      passed: false,
      errors: [{
        keyword: 'type&enum',
        message: 'Bad <value> & "quoted" \'text\'',
        expected: '<string>&',
        actual: 'wrong'
      }]
    }]
  });

  assert.match(xml, /message="Bad &lt;value&gt; &amp; &quot;quoted&quot; &apos;text&apos;"/);
  assert.match(xml, /type="type&amp;enum"/);
  assert.match(xml, /expected: &quot;&lt;string&gt;&amp;&quot;/);
  assert.doesNotMatch(xml, /<value>/);
});

test('handles empty reports and failures without diagnostics', () => {
  const empty = buildJUnitXml({ results: [] });
  assert.match(empty, /<testsuites tests="0" failures="0"/);
  assert.match(empty, /<testsuite name="JSON Contract Tester" tests="0" failures="0"/);

  const sparse = buildJUnitXml({ results: [{ passed: false, errors: [] }] });
  assert.match(sparse, /<failure message="Contract validation failed" type="contract_failure">/);
  assert.match(sparse, /diagnostics:\nnone/);
});
