# JSON Contract Tester — demand validation sprint

**Status:** ready to test; demand is not yet proven. No revenue is recorded.

## Goal
Determine whether developers who work with AI-agent/API JSON outputs find this small browser tool useful enough to use again or recommend. Do not build paid features until evidence supports them.

## Product link
https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/

## Test window and gates
Run a 7-day validation sprint after confirming the public URL opens in a normal browser.

Track only observable evidence:
- Qualified visits from developer audiences (where the channel exposes counts).
- Substantive feedback describing a real use case or a defect.
- Voluntary repeat-use signals or a request for a saved/CI workflow.
- Independently verified payments (count as revenue only after confirmation from the receiving provider).

Do not treat repository commits, successful CI, page publication, impressions alone, or unverified payment claims as revenue or product-market fit.

## Low-cost distribution order
1. Share a concise, transparent product demo in one relevant developer community where tool/showcase posts are allowed.
2. Ask for feedback on the specific problem: validating batches of LLM/API JSON responses against a contract.
3. Use a second community only if the first allows the post and the first attempt yields no meaningful signal.
4. Do not scrape member lists, mass-DM, automate comments, or repost against community rules.

## Launch message
> I made a free browser-only JSON Contract Tester for checking multiple AI-agent/API JSON outputs against one JSON Schema. It runs locally in the browser, has no sign-up or upload, and can download a JSON report. It currently supports a documented subset of JSON Schema, not the full spec. I'd value feedback on whether this is useful in your workflow and what fails on real examples: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/

## Decision rules
- **Fix first:** reproducible correctness or usability bugs.
- **Continue testing:** at least 3 independent developers describe a concrete relevant use case, or there are credible repeat-use signals.
- **Do not build paid features yet:** no concrete repeated-use/buying-intent evidence.
- **Pause or reposition:** after 2 rule-compliant distribution attempts and 7 days, no relevant feedback or measurable usage signal.
- **Revenue:** report only independently verified, received payments; optional wallet support is not evidence of demand by itself.

## Current limitations
- The deployment workflow succeeds, but the public URL has not been independently tested in a normal browser from this environment.
- Repository CI checks source-level invariants; they do not yet execute the page in a real browser or test the UI end to end.
- There is no usage telemetry, so product-side page visits, repeat usage, and conversion cannot currently be measured. Do not add tracking until the privacy trade-off is justified and clearly disclosed.
- The validator is intentionally a subset, not a full JSON Schema implementation. It supports `type`, `required`, `properties`, `additionalProperties: false`, `items`, `enum`, `const`, numeric bounds, string length/pattern, and array length. It does not support `$ref`/`$defs`, schema composition (`allOf`, `anyOf`, `oneOf`, `not`), `format` assertions, boolean schemas, or schema-valued `additionalProperties`. Unknown keywords are ignored, and regex behavior follows JavaScript's engine.
- A PASS only confirms the documented subset. Do not use this MVP as the sole gate for production, security-sensitive, or compliance-critical data until it uses a well-tested full validator.
- Recent hardening fixes structural comparison for `const`/`enum` (object key order no longer changes equality) and clears an old report before a new run, so a schema error cannot leave a stale report available for download. Source tests assert these behaviors, but a real-browser interaction test is still needed.
