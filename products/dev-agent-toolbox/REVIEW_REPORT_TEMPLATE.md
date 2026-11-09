# JSON/API Contract Review — Delivery Template

> Internal working template for the optional one-time review. Use only redacted, non-confidential examples. Never commit a completed customer report or customer payloads to this repository.

## 1. Review metadata

- Review reference: [internal reference; do not use customer identifiers]
- Received date:
- Delivery date:
- Contract name/version:
- Schema dialect/version declared by customer:
- Samples received: [1–10]
- Reviewer:

## 2. Scope and safety check

- [ ] One JSON Schema or documented JSON contract was supplied.
- [ ] All samples are synthetic or redacted.
- [ ] No API keys, bearer tokens, passwords, private keys, personal data, VINs, payment data or production secrets are present.
- [ ] Customer understands this is a bounded contract review, not a security audit or production guarantee.
- [ ] Any unsupported schema keywords are listed as **not evaluated**, never silently treated as passing.

If confidential or unredacted material is received, stop and request a sanitized replacement. Do not copy it into GitHub, email, public logs or this template.

## 3. Test method

- Tool/version:
- Validation date:
- Supported subset checked: `type`, `required`, `properties`, `additionalProperties: false`, `items`, `enum`, `const`, numeric bounds, string length/pattern and array length.
- Known unsupported areas to disclose where relevant: `$ref`/`$defs`, `allOf`/`anyOf`/`oneOf`/`not`, format assertions, boolean schemas, schema-valued `additionalProperties`, and any other unimplemented keyword.
- Unknown keywords are ignored by the MVP; a PASS is not full JSON Schema conformance.

## 4. Batch summary

| Metric | Result |
|---|---:|
| Samples reviewed | |
| PASS | |
| FAIL | |
| Not evaluated / unsupported | |

## 5. Findings

| Sample | JSON Pointer | Schema location | Keyword | Expected | Actual | Severity | Recommendation |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |

Use exact pointers and sample indices. Distinguish a missing value from explicit `null`. Do not invent expected values; quote the supplied contract's constraint.

## 6. Recommendations

1. Contract/schema changes:
2. Producer/API/agent output changes:
3. Regression cases to add:
4. CI or monitoring follow-up:

## 7. Limitations and conclusion

- This review checks only the declared, supported subset and the supplied redacted samples.
- It is not a security, privacy, compliance or penetration test.
- It does not prove that future responses will conform.
- A PASS does not establish application correctness or production safety.
- State any unsupported features and assumptions prominently.

**Overall result:** [PASS / FAIL / MIXED / NOT EVALUATED]

**Customer-facing summary:**

[Write a concise summary with the highest-impact findings first. Attach only the agreed report; do not attach source payloads or secrets.]

## 8. Delivery and deletion checklist

- [ ] Payment independently checked against the approved receiving record; a submitted TxID or screenshot alone is not verification.
- [ ] Report delivered to the customer using the agreed channel.
- [ ] Any temporary local payload copies deleted after delivery and retention obligations are met.
- [ ] No customer data was added to the repository or public issue tracker.
- [ ] Scope and limitations were included in the delivery.
