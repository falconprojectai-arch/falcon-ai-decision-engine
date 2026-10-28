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

## First real-world channel to test
- **Primary candidate:** [r/SideProject](https://www.reddit.com/r/SideProject/), because it is explicitly oriented toward sharing side projects and receiving constructive feedback. Check the live rules and pinned posts immediately before publishing; community norms can change. Its own stated purpose and third-party recent guidance support it as a reasonable first test, but neither guarantees reach or acceptance. [Community context](https://www.reddit.com/r/SideProject/) · [Show HN rules for comparison](https://news.ycombinator.com/showhn.html).
- **Do not use Show HN as the first channel yet.** Its official guidelines expect a personally built, non-trivial project that is ready for people to try and that the maker can discuss. First prove the live page works and improve the tool enough to justify that bar.
- **Post format:** explain the exact job (compare several AI/API JSON outputs against a contract), disclose that this is a small subset validator, link the live demo, and ask for one concrete failure case or missing rule. Do not claim user counts, time savings, or demand without evidence.
- **Measurement:** capture the post URL and timestamp; after 48 hours and again at day 7, record visible views if available, substantive comments, independent testers, reproducible bugs, and repeat-use signals. A view or upvote alone is not validation.
- **Execution status:** channel research and test criteria are prepared; no community post has been submitted from this workflow, so there are no market results to report yet.

## Distribution log (2026-10-29)
- **DEV Community:** the author published [7 Checks Before Trusting an API or AI-Agent JSON Response](https://dev.to/falconprojectaiarch/7-checks-before-trusting-an-api-or-ai-agent-json-response-1mii). This is a published article, not evidence of qualified traffic or demand.
- **DevXTools:** a free listing was submitted for review. The first attempt accidentally used a placeholder contact email; a corrected submission with `falcon.project.ai@gmail.com` was sent afterward. Approval is not confirmed, and the directory has not confirmed whether it will disregard the first submission.
- **The Tool Directory:** a free standard listing was submitted successfully for review at https://thetooldirectory.com/submit-a-tool/. No paid placement was selected. Approval/publication is not confirmed.
- **Metrics:** no independently verified customer payment, qualified-visit count, repeat-use signal, or substantive external feedback has been recorded as part of this sprint. Do not infer traffic from submissions or article publication.

## Launch message
> I made a free browser-only JSON Contract Tester for checking multiple AI-agent/API JSON outputs against one JSON Schema. It runs locally in the browser, has no sign-up or upload, and can download a JSON report. It currently supports a documented subset of JSON Schema, not the full spec. I'd value feedback on whether this is useful in your workflow and what fails on real examples: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/

## Decision rules
- **Fix first:** reproducible correctness or usability bugs.
- **Continue testing:** at least 3 independent developers describe a concrete relevant use case, or there are credible repeat-use signals.
- **Do not build paid features yet:** no concrete repeated-use/buying-intent evidence.
- **Pause or reposition:** after 2 rule-compliant distribution attempts and 7 days, no relevant feedback or measurable usage signal.
- **Revenue:** report only independently verified, received payments; optional wallet support is not evidence of demand by itself.

## Current limitations
- The deployed public URL now passes a Chromium smoke test in GitHub Actions: HTTP 200, expected default sample (1 PASS / 2 FAIL), structural `const` equality with reordered object keys, clearing stale reports after a schema error, and no uncaught browser JavaScript errors. [Browser-test workflow](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/40629537101).
- This is a focused desktop Chromium smoke test, not exhaustive cross-browser/mobile/accessibility testing or a full JSON Schema conformance suite.
- There is no usage telemetry, so product-side page visits, repeat usage, and conversion cannot currently be measured. Do not add tracking until the privacy trade-off is justified and clearly disclosed.
- The validator is intentionally a subset, not a full JSON Schema implementation. It supports `type`, `required`, `properties`, `additionalProperties: false`, `items`, `enum`, `const`, numeric bounds, string length/pattern, and array length. It does not support `$ref`/`$defs`, schema composition (`allOf`, `anyOf`, `oneOf`, `not`), `format` assertions, boolean schemas, or schema-valued `additionalProperties`. Unknown keywords are ignored, and regex behavior follows JavaScript's engine.
- A PASS only confirms the documented subset. Do not use this MVP as the sole gate for production, security-sensitive, or compliance-critical data until it uses a well-tested full validator.
- Recent hardening fixes structural comparison for `const`/`enum` (object key order no longer changes equality) and clears an old report before a new run, so a schema error cannot leave a stale report available for download. The deployed-browser smoke test now exercises these two cases.
