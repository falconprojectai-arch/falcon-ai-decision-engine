# Complete Distribution Audit — 2026-11-12

## Executive state

This audit covers the public product portfolio, approved Agensi skills, free TechTools Launchpad listings, CHAAAM submissions, GitHub skill packages, API health, project dashboard, and the unified Super Scout automation.

**Verified distribution state**
- Agensi: 9/9 free skills approved and live.
- TechTools Launchpad: 10/10 records public/live (9 products/skills plus the separate paid JSON Contract Tester API).
- CHAAAM: 6 free submissions accepted into the editorial review queue; not yet approved/live.
- GitHub: 9 installable `SKILL.md` packages published under `skills/`.
- Skills.sh and SkillsMP: repository indexing not confirmed.
- Verified net settled revenue: **$0.00**.
- Verified product usage: Agensi dashboard reports 0 uses, 0 ratings and 0 reviews for all nine skills. TechTools listings show zero upvotes for the four new records and the API listing; no project buyer or sale is confirmed. CHAAAM is still in review.

## 1. Agensi — approved and live

The creator dashboard returned 9 skills; every skill has `review_status=live`, `security_status=approved`, Free pricing, and 0 uses/ratings/reviews at the time of this audit.

| Skill | Public listing |
|---|---|
| Lead Follow-up Strategist | https://agensi.io/skills/lead-follow-up-strategist |
| Quote-to-Booking Workflow Planner | https://agensi.io/skills/quote-to-booking-workflow-planner |
| JSON Contract Tester | https://agensi.io/skills/json-contract-tester |
| Dev & Agent Toolbox | https://agensi.io/skills/dev-agent-toolbox |
| LocalBiz FollowUp | https://agensi.io/skills/localbiz-followup |
| StockPulse | https://agensi.io/skills/stockpulse |
| MCPGuard Lite | https://agensi.io/skills/mcpguard-lite |
| ExpenseSnap | https://agensi.io/skills/expensesnap |
| CronPulse | https://agensi.io/skills/cronpulse |

All nine public pages were fetched successfully. Agensi paid publishing remains unavailable because payouts are disconnected; no payout setting was changed.

## 2. TechTools Launchpad — 10 public/live listings

Official API documentation: https://techtools.cz/launchpad-api/docs

The directory states that submission is free, no account/sign-in/CAPTCHA is required, only name and URL are mandatory, listings are immediately live, and one normalized URL can be listed once. It has no edit/delete function and a limit of 10 submissions per hour per IP. All writes were made through the documented public API, after exact-URL duplicate checks where applicable. No paid placement or upvote manipulation was used.

| ID | Listing | State |
|---:|---|---|
| 7727 | JSON Contract Tester API | Existing listing verified |
| 9746 | JSON Contract Tester browser tool | HTTP 201 accepted; live |
| 9747 | Dev & Agent Toolbox | HTTP 201 accepted; live |
| 9748 | Lead Follow-up Strategist | HTTP 201 accepted; live |
| 9754 | Quote-to-Booking Workflow Planner | HTTP 201 accepted; live |
| 7543 | LocalBiz FollowUp | Existing listing verified |
| 7544 | StockPulse | Existing listing verified |
| 7545 | MCPGuard Lite | Existing listing verified |
| 7546 | ExpenseSnap | Existing listing verified |
| 7547 | CronPulse | Existing listing verified |

Public share URLs:
- https://techtools.cz/tools/launchpad/?tool=7727
- https://techtools.cz/tools/launchpad/?tool=9746
- https://techtools.cz/tools/launchpad/?tool=9747
- https://techtools.cz/tools/launchpad/?tool=9748
- https://techtools.cz/tools/launchpad/?tool=9754
- https://techtools.cz/tools/launchpad/?tool=7543
- https://techtools.cz/tools/launchpad/?tool=7544
- https://techtools.cz/tools/launchpad/?tool=7545
- https://techtools.cz/tools/launchpad/?tool=7546
- https://techtools.cz/tools/launchpad/?tool=7547

New listing records returned HTTP 201 and `success: true`. Direct GET of IDs 7727, 9746, 9747, 9748 and 9754 returned HTTP 200 and their exact listing details. Four newly created records and the existing API record currently show 0 upvotes. The directory-wide stats endpoint reported 9,750 total listings and 2,054 added in the last week at 2026-11-12 04:41 UTC; these are platform-wide metrics, not our product traffic.

## 3. CHAAAM — six submissions accepted for editorial review

Official form: https://chaaam.com/submit/

The form is free, has no account requirement and no CAPTCHA. Contact email is explicitly optional; the email field was left blank. Each submission returned HTTP 200 and the official “Thanks for suggesting an AI tool” page, which says accepted submissions enter a human editorial review queue. This is **submission accepted**, not approval or a live listing.

1. JSON Contract Tester — https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/
2. Dev & Agent Toolbox — https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/dev-agent-toolbox/
3. MCPGuard Lite — https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/mcpguard-lite/
4. CronPulse — https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/cronpulse/
5. Lead Follow-up Strategist — https://agensi.io/skills/lead-follow-up-strategist
6. Quote-to-Booking Workflow Planner — https://agensi.io/skills/quote-to-booking-workflow-planner

Directory: https://chaaam.com/directory

Check the directory for approval/publication before any future submission; do not resubmit these six while their review state is unresolved.

## 4. Public GitHub Agent Skills

Nine source packages are published under:
https://github.com/falconprojectai-arch/falcon-ai-decision-engine/tree/main/skills

Packages:
- lead-followup-strategist
- quote-to-booking-workflow-planner
- localbiz-followup
- stockpulse
- mcpguard-lite
- expensesnap
- cronpulse
- json-contract-tester
- dev-agent-toolbox

Catalogue and install instructions:
https://github.com/falconprojectai-arch/falcon-ai-decision-engine/blob/main/skills/README.md

The repository README carries the official skills.sh badge. However, the skills.sh repository page returned 404 for the repository and the direct skill page reported the slug unavailable. SkillsMP creator search returned zero results. Therefore neither index currently counts as a verified listing. Continue monitoring indexing, but do not claim the packages have been indexed.

## 5. API and x402 verification

The JSON Contract Tester API returned HTTP 200 for:
- https://json-contract-tester-api.falcon-project-ai.workers.dev/health
- https://json-contract-tester-api.falcon-project-ai.workers.dev/openapi.json
- https://json-contract-tester-api.falcon-project-ai.workers.dev/.well-known/x402.json

The OpenAPI document specifies a paid POST to `/v1/validate-batch`, 1–10 samples per batch, a documented JSON Schema subset, and a price of 0.005 USDC per batch on Base Mainnet (`eip155:8453`) via x402 v2 exact. A read-only GET probe to the paid route returned the expected HTTP 402 payment challenge. No paid POST, payment signature, transfer, or settlement was attempted.

TechTools API listing for the paid API is #7727, distinct from the free browser tool listing #9746.

PayAPI Market listing ID 54bd4f89-23f8-47e7-b507-039362b51198 remains last-known pending_review/not live; canary result unreported. Agent402 routability/discovery must not be confused with a successful paid buyer call or settlement.

## 6. Other channels and exact blockers

| Channel | Current state | Reason / next route |
|---|---|---|
| AgenticSkills | Not submitted | Required authorName and email; no owner contact data supplied. Use existing Agensi and public GitHub source meanwhile. |
| AgenticMart.org | Not submitted | Final submission requires GitHub sign-in. |
| AgentStackd | Not submitted | Requires submitter name/email. |
| aibrew | Not submitted | Requires contact email and Turnstile CAPTCHA. |
| Ignlab Launch | Not submitted | Required human math challenge. |
| Forward Future | Not submitted | Public form has no email/CAPTCHA visible, but Next.js server-action endpoint could not be identified; do not guess the submission endpoint. |
| Stackviv | Not submitted | Previous live fetch returned HTTP 500. |
| Product Hunt | Not submitted | Personal account and verified email required; existing browser session could not load external sites. |
| DevTools Daily | Not submitted | Sign-in required. |
| Best of AI | Not submitted | Flow requires plan/account selection and includes paid checkout; no paid route authorized. |
| Dev Pages | Not submitted | Sign-in and badge placement required. |
| Tools AI Online | Not submitted | Owner contact email and CAPTCHA required. |
| Future Tools | Not submitted | Required email and CAPTCHA. |
| KeelTools | Not submitted | Required contact email. |
| The AI Tools Directory | Not submitted | Required email and badge; free tier still requires these. |
| Agentic.ai | Not submitted | Vendor account sign-up with email required. |
| Atelier | Not published | Last known deployment page said temporarily paused. |

If a route is blocked, switch to another legitimate channel; do not fabricate identities, solve human-only challenges by evasion, create accounts, or spend money.

## 7. Automation and project files

- Super Scout automation ID: `6af38e598a20819196433c9749f7ad5d`.
- Active, one daily run at 13:00 Asia/Tehran.
- Prompt updated to remove the artificial 10-minute minimum, preserve the Golden Framework/Blue Smooth Route, record the nine Agensi live listings, ten TechTools listings, six CHAAAM review submissions, and indexing/payout limitations.
- Dashboard replaced with a current Persian RTL status page; stale November 7–8 audit data and ECU project references were removed.
- Product hub and `llms.txt` updated with TechTools IDs, CHAAAM submissions and distinct API/browser-tool links.
- Public skill README and root README updated with discovery links.

Latest known GitHub Actions at the time of the last check:
- Revenue Machine tests: run 43157162306, completed successfully.
- Deploy control dashboard: run 43157162279, was still in progress at the last poll.
- Later commits updated the dashboard and skill catalogue after those runs. Recheck the latest Pages deployment run before claiming the newest dashboard is live.

## 8. Payout, costs and revenue

- Zero-cost rule maintained: no paid listings, boosts, ads, subscriptions, or top-ups.
- StableDomains affiliate link exists: https://stabledomains.net/?ref=ff6ueixx
- SwiftNodes affiliate link exists: https://swiftnodes.io/?ref=xxuxt8dw
- Intended SwiftNodes MetaMask address was explicitly confirmed by the owner: `0x8e35C3cB1e14DaDde79c2cA7dec890f9c6B34ac`. The network is not inferred from the address and must be checked in the official dashboard before payout readiness. No payout setting changed.
- Agensi paid publishing remains unavailable while payouts are disconnected.
- No affiliate sale, x402 payment, CHAAAM buyer, or settled revenue is verified.
- Net settled revenue remains **$0.00**.

## 9. Next execution sequence

1. Verify the latest GitHub Pages deployment for the final dashboard/hub/llms commits; fix any deployment/test failure.
2. Recheck CHAAAM review state for the six exact submissions; do not duplicate.
3. Recheck TechTools listing IDs and upvotes without manipulating votes.
4. Recheck Agensi use counts and approval status.
5. Continue discovering other genuinely no-account/no-contact free directories and buyer-intent communities.
6. Improve the highest-value product funnel, prioritizing a direct customer path rather than additional low-signal directories.
7. Recheck affiliate terms and actual referral evidence where accessible; never infer commissions.
8. Keep the revenue gate strict: no revenue until an independent settlement record verifies the amount, asset, network, transaction and fees.
