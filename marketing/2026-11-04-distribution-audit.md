# Distribution audit — 2026-11-04

## Executive result

- Products in scope: LocalBiz FollowUp, StockPulse, MCPGuard Lite, ExpenseSnap, CronPulse.
- New directory submissions completed in this audit: **0**.
- New confirmation IDs: **0**.
- New public listings verified: **0**.
- Product pages and catalogue: all six URLs returned **HTTP 200** in the browser check.
- No paid placements, accounts, identity checks, API keys, payments, duplicate submissions, or unsolicited messages were used.

A submission was not counted as successful unless the form was actually sent and a receipt or public listing could be independently verified.

## Product URL verification

| Product | Public URL | Result |
|---|---|---|
| Catalogue | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/ | HTTP 200 |
| LocalBiz FollowUp | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/localbiz-followup/ | HTTP 200 |
| StockPulse | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/stockpulse/ | HTTP 200 |
| MCPGuard Lite | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/mcpguard-lite/ | HTTP 200 |
| ExpenseSnap | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/expensesnap/ | HTTP 200 |
| CronPulse | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/cronpulse/ | HTTP 200 |

## New directory candidates inspected

| Channel | Public submission URL | Result | Reason |
|---|---|---|---|
| TechTools Launchpad | https://techtools.cz/tools/launchpad/ | Failed to load | Browser network error `ERR_SOCKS_CONNECTION_FAILED`; no form submission |
| NoUploadTools | https://nouploadtools.com/submit | Failed to load | `ERR_QUIC_PROTOCOL_ERROR`; rules/form could not be verified |
| FreeNoSignup | https://www.freenosignup.com/submit/ | Failed to load | `ERR_QUIC_PROTOCOL_ERROR`; no form submission |
| weblist.dev | https://weblist.dev/submit/ | Failed to load | `ERR_QUIC_PROTOCOL_ERROR`; no form submission |
| BSDirectory | https://directory.project-bs.com/submit | Failed to load | `ERR_SOCKS_CONNECTION_FAILED`; free listing reportedly has a long queue |
| Zearches | https://zearches.com/submit-website-free.php | Failed to load | `ERR_SOCKS_CONNECTION_FAILED`; no form submission |
| Qevra | https://qevra.app/ | Failed to load | `ERR_SOCKS_CONNECTION_FAILED`; no form submission |
| AgentStackd | https://agentstackd.com/submit/ | Failed to load | `ERR_SOCKS_CONNECTION_FAILED`; product-scope fit not fully verifiable |
| Linkrena | https://linkrena.com/ | Failed to load | `ERR_QUIC_PROTOCOL_ERROR`; no form submission |
| Forward Future | https://forwardfuture.com/tools/submit | Failed to load | `ERR_SOCKS_CONNECTION_FAILED`; no form submission |
| Share Your Startup | https://shareyourstartup.com/ | Failed to load | `ERR_QUIC_PROTOCOL_ERROR`; free path could not be verified |
| Toolsland | https://www.toolsland.ai/submit-ai-tool-free | Failed to load | `ERR_SOCKS_CONNECTION_FAILED`; likely AI-tool scope only |

These are candidate leads, not verified eligible submission routes. Search snippets suggested free/no-account paths for some sites, but the actual forms could not be opened. Therefore no form was submitted.

## Previously checked channels — do not duplicate

Earlier checks found blockers or no suitable product type:
- Ignlab Launch: anti-bot challenge did not load.
- PromoteIndex and Launching Next: submission pages failed to load.
- LaunchFree: Turnstile challenge blocked the form.
- Index Agentica: requires GitHub contribution and maintainer merge; existing JSON Contract Tester request #15 was not duplicated.
- true402 and Agent Bazaar: require x402 service manifests or agent cards; the five browser utilities are not those paid service types.
- PayAPI Market: paid API/canary route, not suitable for these local browser utilities.
- DEV, Indie Hackers and Hacker News: require authenticated user accounts for publishing; no account-based post was made.
- DevXTools and The Tool Directory: no usable eligible public form was verified in the prior audit.

## Product eligibility notes

- LocalBiz FollowUp: browser-based customer/follow-up utility for small shops and online sellers.
- StockPulse: browser-based inventory and reorder tracker for small retailers.
- MCPGuard Lite: local heuristic checker; do not describe as a full security audit or runtime protection.
- ExpenseSnap: local time/expense tracker; do not describe as accounting, invoicing or payment software.
- CronPulse: offline run-history analyzer; do not describe as live monitoring or alerting.

## Next actions

1. Retry the strongest free/no-account candidates when their public pages become reachable.
2. Check exact-name duplicates before each submission.
3. Submit only where the actual form and free terms are visible and product scope matches.
4. Record the receipt ID and later verify the public listing URL.
5. Seek genuine user testing and feedback; do not confuse directory listing with demand.
6. Revenue remains **$0.00** until independent payment settlement evidence is available.

## Evidence links

- [Product catalogue](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/)
- [Latest successful release workflow](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41873099905)
- [Launch guide](../products/launch-guide.md)
- [Previous launch kit](./2026-11-04-launch-kit.md)
- [Agentic launch operations ledger](./2026-11-04-agentic-launch-operations.md)
