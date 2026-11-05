(function (root) {
  'use strict';

  function xmlEscape(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '\uFFFD')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function jsonText(value) {
    if (value === undefined) return 'undefined';
    try {
      var encoded = JSON.stringify(value);
      return encoded === undefined ? String(value) : encoded;
    } catch (error) {
      return String(value);
    }
  }

  function buildJUnitXml(report) {
    var source = report && Array.isArray(report.results) ? report.results : [];
    var results = source.map(function (result, index) {
      return {
        sampleIndex: Number.isInteger(result && result.sampleIndex) ? result.sampleIndex : index + 1,
        inputLine: Number.isInteger(result && result.inputLine) ? result.inputLine : null,
        passed: !!(result && result.passed),
        errors: result && Array.isArray(result.errors) ? result.errors : []
      };
    });
    var failures = results.filter(function (result) { return !result.passed; }).length;
    var parsedDate = report && report.generatedAt ? Date.parse(report.generatedAt) : NaN;
    var timestamp = Number.isNaN(parsedDate) ? new Date().toISOString() : new Date(parsedDate).toISOString();

    var testCases = results.map(function (result) {
      var firstError = result.errors[0] || {};
      var failureMessage = firstError.message || 'Contract validation failed';
      var failureType = firstError.keyword || 'contract_failure';
      var diagnosticText = result.errors.map(function (error) {
        return [
          'instancePath: ' + (error.instancePath || '/'),
          'schemaPath: ' + (error.schemaPath || '#'),
          'keyword: ' + (error.keyword || 'unknown'),
          'expected: ' + jsonText(error.expected),
          'actual: ' + jsonText(error.actual),
          'message: ' + (error.message || '')
        ].join('\n');
      }).join('\n\n');
      var failure = result.passed ? '' : '<failure message="' + xmlEscape(failureMessage) + '" type="' + xmlEscape(failureType) + '">' + xmlEscape(diagnosticText || failureMessage) + '</failure>';
      var systemOut = [
        'sampleIndex: ' + result.sampleIndex,
        'inputLine: ' + (result.inputLine === null ? 'unknown' : result.inputLine),
        'passed: ' + result.passed,
        'diagnostics:\n' + (diagnosticText || 'none')
      ].join('\n');
      return '<testcase classname="JSON Contract Tester" name="sample-' + result.sampleIndex + '">' + failure + '<system-out>' + xmlEscape(systemOut) + '</system-out></testcase>';
    }).join('\n');

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<testsuites tests="' + results.length + '" failures="' + failures + '" errors="0" skipped="0">',
      '<testsuite name="JSON Contract Tester" tests="' + results.length + '" failures="' + failures + '" errors="0" skipped="0" timestamp="' + xmlEscape(timestamp) + '">',
      testCases,
      '</testsuite>',
      '</testsuites>',
      ''
    ].join('\n');
  }

  root.JSONContractTesterJUnit = { buildJUnitXml: buildJUnitXml };
  if (typeof module !== 'undefined' && module.exports) module.exports = { buildJUnitXml: buildJUnitXml };
})(typeof globalThis !== 'undefined' ? globalThis : this);
