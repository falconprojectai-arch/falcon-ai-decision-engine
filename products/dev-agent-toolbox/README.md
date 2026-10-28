# Dev & Agent Toolbox

A free, browser-only suite for common developer and AI-agent debugging tasks. Inputs are processed locally; the page does not upload them.

## Utilities

1. JSON Formatter
2. Semantic JSON Diff
3. JSONPath Lite
4. JWT Decoder (decode only; does not verify signatures)
5. Base64 / Base64URL
6. URL Inspector
7. Regex Playground
8. UUID Generator
9. SHA-256 Hash
10. HMAC-SHA256
11. Unix Time Converter
12. Cron Field Explainer
13. Retry / Backoff Calculator
14. Rate Limit Analyzer
15. cURL Inspector
16. Agent Trace Timeline
17. Tool-Call Normalizer
18. Secret Redactor
19. PII Scrubber
20. Prompt Token Estimator

The current page also includes an OpenAPI endpoint index utility; it is intentionally lightweight and accepts JSON OpenAPI documents, not YAML.

## Limits and safety

- JWT decoding is not signature verification and must not be used for authentication decisions.
- JSONPath support is deliberately limited to simple property paths, array indexes, and wildcards.
- cURL parsing supports common forms and is not a full shell parser.
- Cron explanations are field-level hints, not schedule simulation.
- Token counts are approximate; do not use them for billing.
- Redaction patterns are best-effort and cannot guarantee that all sensitive data is removed.
- Do not paste production credentials into untrusted environments. HMAC keys are used locally in the browser.
