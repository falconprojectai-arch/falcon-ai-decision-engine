# Distribution audit — 2026-11-04

## Executive result

- Products in scope: LocalBiz FollowUp, StockPulse, MCPGuard Lite, ExpenseSnap, CronPulse.
- New directory submissions completed in this audit: **5** (TechTools Launchpad).
- TechTools Launchpad: all five distinct product URLs were accepted with HTTP 201 and independently re-read from the public listings API; IDs **7543–7547**.
- QuestStack: GitHub Actions runner received HTTP 403 on the public duplicate-check GET, so no POST was attempted and no listing was created. The earlier browser attempt had returned HTTP 429; the runner network is now separately blocked.
- Tool Commons: all five products passed exact-name and canonical-URL duplicate searches, but issue creation remains blocked by GitHub integration permission (HTTP 403) and logged-out browser session.
- New confirmation IDs: **5**.
- New public listings verified: **5**.
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
| TechTools Launchpad | https://techtools.cz/tools/launchpad/ | **5 live listings verified** | API accepted five unique product URLs (HTTP 201); public list API re-check found all five |
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

## Additional verified submission routes

| Channel | Result | Evidence / next step |
|---|---|---|
| [TechTools Launchpad](https://techtools.cz/tools/launchpad/) | **5/5 live** | GitHub Actions workflow [41893495551](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41893495551) submitted five unique product URLs sequentially. All five POSTs returned HTTP 201; subsequent public API reads confirmed every canonical URL. IDs: 7543–7547. No login, payment, badge, or API key required. |
| [QuestStack](https://queststack.io/submit-your-tool) | Blocked by runner network | Free no-account API. The new GitHub Actions workflow received HTTP 403 from the duplicate-check GET and stopped before POST; no listing was created. Earlier Browser Use POST had returned HTTP 429. No paid upgrade used. The one-time retry task remains scheduled, but execution is not guaranteed. |
| [Tool Commons](https://toolcommons.org/) | Criteria fit; blocked by GitHub permission | MIT license and source inspection support open-source, local-first, static-hosted, no-login/no-tracking fit. Five exact-name and exact-URL duplicate searches returned zero. GitHub connector issue creation returned HTTP 403 Resource not accessible by integration; no issue was created. Requires GitHub Issues: write permission or a signed-in browser session. |

**Correct canonical Pages host:** `falconprojectai-arch.github.io`. A separate attempted check accidentally substituted `falcon-ai-decision-engine.github.io`; those 404s are not evidence about the actual canonical pages and are excluded. The correct six URLs above were previously verified HTTP 200 in the browser check.

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


## Agentic submission execution — 2026-11-04 19:05 UTC

### TechTools Launchpad — completed

The browser-credit limitation was bypassed without purchasing credits: a GitHub Actions workflow called the directory's documented public JSON API directly. The platform explicitly supports unauthenticated agent submissions, no CAPTCHA, automatic approval, and one unique URL per listing.

Workflow: [41893495551](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41893495551)

| Product | Listing ID | Public listing link | POST | Public API verification |
|---|---:|---|---:|---|
| LocalBiz FollowUp | 7543 | https://techtools.cz/tools/launchpad/?tool=7543 | HTTP 201 | Found |
| StockPulse | 7544 | https://techtools.cz/tools/launchpad/?tool=7544 | HTTP 201 | Found |
| MCPGuard Lite | 7545 | https://techtools.cz/tools/launchpad/?tool=7545 | HTTP 201 | Found |
| ExpenseSnap | 7546 | https://techtools.cz/tools/launchpad/?tool=7546 | HTTP 201 | Found |
| CronPulse | 7547 | https://techtools.cz/tools/launchpad/?tool=7547 | HTTP 201 | Found |

No paid features, accounts, API keys, badge, or payment were used. Platform documentation says listings are automatically approved and immediately visible. The public list API re-check matched all five exact product URLs.

### QuestStack — stopped safely

Workflow: [41893418251](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41893418251)

The GitHub-hosted runner received HTTP 403 Forbidden on the initial duplicate-check GET. The workflow stopped before POST, so no duplicate or unintended listing was created. The earlier Browser Use attempt was separately blocked by HTTP 429. QuestStack's strict one-listing-per-website policy means the intended scope was one catalogue listing, not five separate listings.

### Tool Commons — permission blocker

The GitHub connector's issue-creation call returned HTTP 403 Resource not accessible by integration. No issue was created. The only safe fix is to reconnect GitHub with Issues: write permission or use an authenticated browser session; credentials were not requested or stored.

### Revenue and demand

Directory listings are distribution, not evidence of customers or revenue. No customer, sale, or payment settlement has been verified; revenue remains **$0.00**.


### Dashboard deployment verification

Updated dashboard deployed successfully in [GitHub Actions run 41893873049](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41893873049). Deployment step and all Chromium smoke tests completed with success, including dashboard, developer toolbox, payment page, product pages, new micro products, and catalogue/preview assets.


## QuestStack retry — 2026-11-05 15:38 UTC

### Official duplicate-check result — no new submission

The revised GitHub Actions workflow checked the exact canonical URL of each product and the catalogue URL against the documented public endpoint `GET https://queststack.io/api/v1/listings/check?url=...`.

Evidence: [QuestStack retry workflow 42057022428](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/42057022428). The runner completed all six GET requests successfully with HTTP 200. Every response returned `available: false` and the same exact message:

> That website was already submitted and waits for review, usually within 24 hours. Do not submit it again.

| Checked entry | Exact URL | HTTP | `available` | Outcome |
|---|---|---:|---:|---|
| LocalBiz FollowUp | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/localbiz-followup/ | 200 | false | Existing submission pending review; do not resubmit |
| StockPulse | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/stockpulse/ | 200 | false | Existing submission pending review; do not resubmit |
| MCPGuard Lite | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/mcpguard-lite/ | 200 | false | Existing submission pending review; do not resubmit |
| ExpenseSnap | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/expensesnap/ | 200 | false | Existing submission pending review; do not resubmit |
| CronPulse | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/cronpulse/ | 200 | false | Existing submission pending review; do not resubmit |
| Falcon AI Micro Tools catalogue | https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/ | 200 | false | Existing submission pending review; do not resubmit |

**Submission result:** no POST was sent, no duplicate listing was created, and no listing ID, public listing URL, or management token was returned by the duplicate-check endpoint. The current run did **not** receive HTTP 429; the API returned HTTP 200 with `available: false`. The earlier runner attempt on 2026-11-04 had received HTTP 403 on its duplicate-check GET, but this retry reached the endpoint successfully.

QuestStack's official submission instructions state **one listing per website** and explicitly say not to submit again when `available` is false. All five product URLs share the same website origin, so five separate listings would also conflict with that published rule. The workflow therefore checks all five URLs but does not attempt five separate submissions. The catalogue URL was also checked and returned unavailable.

The response indicates an existing submission is waiting for admin review, usually within 24 hours. Because the duplicate-check response did not include its listing ID, the public listing title and canonical URL cannot yet be verified through the documented `GET /listings/{id}` route. No public listing was counted as live or accepted. No Pro boost, paid upgrade, payment, badge, backlink, account creation, or API key action occurred.

- Official rules and API route: https://queststack.io/submit-your-tool
- Workflow evidence: https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/42057022428
- Repository test workflow: https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/42057022526

**Next action:** wait for the existing QuestStack admin review outcome. If it becomes active, obtain the listing ID/public URL and verify its title and canonical catalogue URL. If rejected, review the stated reason and only retry after the official duplicate check permits it. The one-time retry automation has been stopped to avoid repeated duplicate checks while the existing submission is pending.
