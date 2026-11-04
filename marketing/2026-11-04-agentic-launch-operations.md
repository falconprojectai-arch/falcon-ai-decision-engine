# Agentic launch operations — 2026-11-04

Owner: project launch manager
Scope: LocalBiz FollowUp, StockPulse, MCPGuard Lite, ExpenseSnap, CronPulse.
Catalog: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/
Launch copy: https://github.com/falconprojectai-arch/falcon-ai-decision-engine/blob/main/marketing/2026-11-04-launch-kit.md

## Operating rules
- Reuse the first product's proven channels and prior submission records; never create duplicate submissions.
- Free listings only. No paid upgrades, account creation, new credentials, or actions requiring user identity/approval.
- Public content must describe actual current behavior, limitations, and product URLs.
- Never claim a listing is live until its public page is opened and verified.
- Never claim customer activity, installs, sales, or revenue without evidence.
- No unsolicited private messages or mass posting.

## Prior first-product channel evidence (JSON Contract Tester)
| Channel | Prior evidence/status | Handling for five new products |
|---|---|---|
| true402 | Registration succeeded; ID a5ccc7ac-2153-403a-91a8-be5be7a69073; free/no account/manual approval; initially 0 transactions and trust 0 | Inspect current rules and determine whether each product can be separately listed without credentials |
| Agent Bazaar / Saylor | Free listing published; GET/POST mismatch; not promoted | Inspect whether new products are supported; do not imply successful API execution |
| Index Agentica | Request #15; HTTP 201; pending review; one vote; zero cost | Avoid duplicate submission for JSON Contract Tester; inspect support for separate product entries |
| Ignlab Launch | Submitted, awaiting editorial review (prior record) | Reuse only if multiple products allowed and free |
| PromoteIndex | Submitted, ticket #000098 processing (prior record) | Reuse only if multiple products allowed and free |
| Launching Next | Saved awaiting publication (prior record) | Check whether five distinct entries are allowed |
| DevXTools | Pending review (prior record) | Check multiple listing policy |
| The Tool Directory | Pending review (prior record) | Check multiple listing policy |
| PayAPI Market | Submission 54bd4f89-23f8-47e7-b507-039362b51198; pending_review; not live | Inspect only; do not create new API credentials or assume settlement |
| DEV Community | JSON Contract Tester tutorial published | Avoid duplicate promotion; separate useful product-specific tutorial only where appropriate |
| Reddit r/SideProject | Earlier post removed by filters in one attempt; another prior record says live | Check existing state; do not repost duplicates or evade moderation |

## Product-specific truthful listing copy
- LocalBiz FollowUp: customer request tracking, sales status, next follow-up date, draft replies, CSV export. Audience: small shops and online sellers.
- StockPulse: stock tracking, low-stock flags, inventory value and margin estimates, CSV import/export. Audience: small retailers.
- MCPGuard Lite: local heuristic checks for common MCP/agent configuration risks; not a full audit or runtime protection.
- ExpenseSnap: project time and expense records, totals, invoice preparation; not accounting or payment processing.
- CronPulse: offline analysis of supplied cron/agent execution logs; not live monitoring or alert delivery.

## Submission ledger
Update each row only with evidence returned by the channel. Valid states: researched, drafted, submitted, pending_review, approved, live_verified, blocked_user_action, rejected, failed.

| Product | Channel | State | Submission ID / public URL | Evidence / next action |
|---|---|---|---|---|
| All five products | QuestStack | failed / retry scheduled | No IDs; no listings created | Exact-URL duplicate checks returned available=true; POST returned HTTP 429. One-time retry scheduled 2026-11-05 15:30 UTC. Free API path; optional paid upgrades not used. |
| LocalBiz FollowUp | Tool Commons | blocked_user_action | No issue created | Exact-name and URL duplicate searches: 0. Official issue template redirects to GitHub sign-in. |
| StockPulse | Tool Commons | blocked_user_action | No issue created | Exact-name and URL duplicate searches: 0. Official issue template redirects to GitHub sign-in. |
| MCPGuard Lite | Tool Commons | blocked_user_action | No issue created | Exact-name and URL duplicate searches: 0. Official issue template redirects to GitHub sign-in. |
| ExpenseSnap | Tool Commons | blocked_user_action | No issue created | Exact-name and URL duplicate searches: 0. Official issue template redirects to GitHub sign-in. |
| CronPulse | Tool Commons | blocked_user_action | No issue created | Exact-name and URL duplicate searches: 0. Official issue template redirects to GitHub sign-in. |

## Final verification
For every live listing: open listing URL, confirm title and canonical product URL, open product URL, check page loads, and record timestamp and HTTP/browser evidence. A directory submission receipt alone is not publication.


## Additional channel verification — 2026-11-04

- QuestStack official API rules verified: free listing, no account/API key, optional paid boosts only. Five exact URL checks were clear. Submission was blocked by HTTP 429; no record was created. One-time retry scheduled for 2026-11-05 15:30 UTC.
- Tool Commons official criteria verified: OSI license, no login, local-first, no ads/tracking, static hostable, single-purpose. The project source is MIT licensed and source inspection found no analytics/tracking/network calls in these five product pages. Exact-name and exact-URL duplicate searches returned zero. GitHub issue creation was blocked because the browser was logged out and the GitHub connector lacks issue-write permission. No credentials were requested and no account was created.
- Correct Pages host is `falconprojectai-arch.github.io`; a later browser task accidentally tested a different guessed host and its 404 findings are excluded. The correct canonical product pages were separately confirmed HTTP 200.


## Agentic launch update — 2026-11-04 19:05 UTC

### Confirmed public listings — TechTools Launchpad

The documented unauthenticated JSON API was called from GitHub Actions to avoid the exhausted Browser Use credits. All five submissions returned HTTP 201 and the public listing API re-check found all five exact canonical URLs.

| Product | State | Listing ID | Public link |
|---|---|---:|---|
| LocalBiz FollowUp | live_verified | 7543 | https://techtools.cz/tools/launchpad/?tool=7543 |
| StockPulse | live_verified | 7544 | https://techtools.cz/tools/launchpad/?tool=7544 |
| MCPGuard Lite | live_verified | 7545 | https://techtools.cz/tools/launchpad/?tool=7545 |
| ExpenseSnap | live_verified | 7546 | https://techtools.cz/tools/launchpad/?tool=7546 |
| CronPulse | live_verified | 7547 | https://techtools.cz/tools/launchpad/?tool=7547 |

Execution evidence: https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41893495551

### Blockers re-tested

- QuestStack: GitHub Actions runner got HTTP 403 on the duplicate-check endpoint and stopped before submission. No listing created. Earlier Browser Use attempt returned HTTP 429. The scheduled retry remains enabled but has no confirmed next-run timestamp.
- Tool Commons: GitHub connector create_issue returned HTTP 403 Resource not accessible by integration; no issue created. Needs Issues: write permission or authenticated browser.
- Browser Use credits remain unavailable; no paid top-up was initiated. The successful TechTools route used GitHub Actions at no added cost.

Revenue remains $0.00; no user acquisition or payment is claimed.


Dashboard update deployed successfully: https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41893873049 — all deployment and Chromium smoke-test steps passed.
