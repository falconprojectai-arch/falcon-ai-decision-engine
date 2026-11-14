# Super Scout — 2026-11-14

## Revenue gate

- Independently verified net settled proceeds: **$0.00**
- Verified paid JSON Contract Tester API transactions: **0**
- Verified affiliate conversions / commissions: **0**
- Agensi skill usage: **0 uses across all nine live skills**
- Rolling 7-day average net settled proceeds: **$0.00/day**
- Gmail checks since 2026-11-12 found no messages matching the USDT payment-verification or free JSON-contract preflight subjects, and no new PayAPI Market correspondence. This is not an on-chain audit; no transaction hash or settlement evidence was available.

A listing, directory view, HTTP 402 challenge, pending review, click, registration or unverified balance is not revenue.

## Verified work completed

1. Rechecked Agensi creator status and all nine published skills on 2026-11-14. Each remains `review_status=live` and `security_status=approved`; all show zero uses, ratings and reviews. Paid publishing remains unavailable while creator payouts are disconnected. No payout settings were changed and no duplicate skills were submitted.
2. Reviewed the free Agensi peer skill [API Contract Validator](https://agensi.io/skills/api-contract-validator). It showed 13 uses and 3 votes, with no reviews. Its scope includes OpenAPI linting, implementation/runtime validation, breaking-change detection and CI gates. Those are marketplace activity signals, not earnings. It requires external CLI/runtime tooling and is broader than our browser-only JSON Schema subset; our public claims must not imply OpenAPI drift detection or CI integration.
3. Found the cause of the 2026-11-13 Pages workflow failure. Run [43411100341](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/43411100341) successfully deployed the Pages artifact and passed the dashboard, product, payment, catalogue and product smoke tests. The final affiliate-guide smoke test failed because its expected title still used the old “Blockchain Infrastructure Checklist” title after the page had been renamed. Updated the assertion to the actual “MCP Server Launch Checklist: RPC, Domains & Discovery” title in commit `83908a5`.
4. Verified [Pages run 43584520761](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/43584520761) completed successfully after that fix. Its deploy job and all included smoke tests passed, including the affiliate infrastructure guide checks. The later product-hub label, Ignlab entry-point link and `llms.txt` count updates were included in [Pages run 43584670451](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/43584670451), which also completed successfully with no failed steps.
5. Updated the public MCP launch guide and agent-integration guide to disclose conflicting StableDomains commission terms rather than repeat one rate as certain. Updated the product hub guide label, Ignlab card link, publication-verification date, `llms.txt`, and channel matrix.
6. Corrected the SkillStore state in `llms.txt`: the anonymous repository submission on 2026-11-12 returned a Pending receipt for an estimated 10 skills (only prefix `dde1d29d...` preserved). It was not a failed submission, but no exact receipt ID or public approval is available. No duplicate submission was made.
7. Rechecked the Agensi growth request “Zero-cost AI-agent business growth review and revenue playbook”. Connector state remains open, non-bounty and 0 votes; this is not evidence of a creator reply or private consultation.

## Market research — distinct angles

### 1. AI-agent skill demand

The [API Contract Validator](https://agensi.io/skills/api-contract-validator) peer skill had 13 uses and 3 votes. Its detailed workflow addresses OpenAPI spec drift, runtime response mismatches and breaking changes. This is a useful problem signal, but 13 uses do not prove paid demand. Our current JSON Contract Tester only validates its documented JSON Schema subset; it does not lint OpenAPI specs, compare spec versions or run CI gates.

### 2. MCP and developer directories

[mcpub](https://mcpub.dev/) advertises free, accountless submission but requires a real MCP endpoint and a `/.well-known/mcp.json` server card. The current JSON Contract Tester API is REST/x402, not an MCP server. It was not submitted as MCP and must not be described as one.

### 3. Local-business follow-up

The previously inspected [Upwork speed-to-lead brief](https://www.upwork.com/freelance-jobs/apply/Speed-Lead-System-for-HVAC-Roofing_~022113721182841106844/) described 150–300 monthly leads and a $1,500–$2,500 budget, with more than 50 proposals at the time checked. That is evidence of demand for operational CRM/SMS follow-up, not for a browser-only tracker. LocalBiz FollowUp still stores records in local browser storage and drafts messages; it does not send SMS, connect to a CRM, handle missed calls or sync a team database. Keep the limitation prominent and do not pitch it as the requested automation.

### 4. No-account SaaS distribution

[Ignlab Launch](https://launch.ignlab.net/) homepage checked 2026-11-14 showed 7,646+ tools and 668 Developer Tools listings. It advertises free submission without an account or paywall, editorial review and a private edit link. The actual form fields and CAPTCHA/anti-bot requirements were not verified. No submission was attempted and no write endpoint was guessed. If a safe inspection later confirms no owner-only fields and no CAPTCHA, test one relevant browser tool only; do not batch-submit the portfolio.

### 5. Additional AI-tools directory

[AI Tools Directory](https://aitoolsdirectory.com/submit-tool) describes itself as a free resource with manual review, but it accepts AI-related tools only and explicitly excludes crypto-related products. Its optional Fast Track is paid ($39) and is not considered. A browser-only JSON Contract Tester listing might fit if the form permits it, but the form's contact/CAPTCHA requirements were not verified; nothing was submitted.

### 6. Creator marketplace quality

[SkillChain](https://www.skillchain.me/) advertises SOL escrow purchases and an 85% creator share. The public marketplace counters for skills, agents, purchases and volume were blank, and seller registration, payout mechanics, fees and moderation terms were not independently verified. It is deferred; no account, wallet or listing action was taken.

### 7. Affiliate economics

- [SwiftNodes official affiliate terms](https://swiftnodes.io/affiliates): 20% of each referred customer's payment for the life of the subscription; 30-day hold; USDC on Base, Arbitrum or Polygon; $50 minimum; monthly payouts. The public referral URL exists, but the private dashboard, account attribution, payout address/network and conversion statistics remain unverified. The browser automation wallet has $0; no top-up was made.
- StableDomains' official pages conflict. The [main affiliate page](https://stabledomains.net/affiliates) and [program page](https://stabledomains.net/affiliates/program) say 10% of margin, while the [referral-link page](https://stabledomains.net/affiliates/link) and [developer page](https://stabledomains.net/developers) still say $0.60 per .com and $0.51 per .xyz. The pages agree on 30-day first-referrer attribution, weekly USDC on Base and a $5 minimum subject to review. The public guides now disclose this conflict; do not rely on a specific commission amount until the provider/dashboard resolves it.
- No self-referrals, payout changes or transfers were made.

## Candidate scoring

Scores are 0–5, where higher is better; “low support burden” means 5 is easiest to maintain. Confidence is low unless otherwise noted.

| Candidate | Buyer evidence | Time to first sale | Zero-cost feasibility | Automation | Low support burden | Legal / platform feasibility | Confidence |
|---|---:|---:|---:|---:|---:|---:|---|
| Manual API/agent contract review (4 USDT) | 2 | 2 | 5 | 1 | 2 | 5 | Low |
| SwiftNodes + StableDomains infrastructure referral funnel | 2 | 1 | 5 | 5 | 5 | 5 | Low |
| JSON Contract Tester x402 API | 1 | 1 | 5 | 5 | 3 | 4 | Low |
| LocalBiz browser tracker | 2 | 2 | 5 | 2 | 3 | 5 | Low |
| Ignlab browser-tool listing | 1 | 2 | 5 | 3 | 4 | 5 | Low |
| SkillChain creator marketplace | 1 | 1 | 5 | 3 | 3 | 1 | Low |

A zero legal/platform score would block an action. SkillChain is deferred at 1 because essential seller/payout terms and buyer activity remain unverified; this is not an eligibility conclusion.

## Decision

- **First-sale experiment:** keep the bounded manual API & AI-Agent Contract Review offer ($4 USDT, TRC20 or BEP20 only) paired with the free browser tester and checklist. It has a direct paid outcome but is manual, crypto-only and higher-friction; it is a first-dollar experiment, not the long-term automated-income model.
- **Low-maintenance alternate:** keep the MCP/RPC/domain infrastructure guide with clearly disclosed SwiftNodes and StableDomains referral links. It is passive to maintain but currently has no verified conversion, and StableDomains' commission basis is inconsistent across official pages.
- **Automated secondary route:** retain the $0.005 USDC x402 JSON validation API. It is technically discoverable, but the last verified external evidence showed no paid buyer or settlement. Do not send a paid POST or fund a test wallet.
- Do not build more broad products or directories until there is a genuine buyer action. Keep LocalBiz claims aligned with its actual browser-only behavior.

## Open blockers and next evidence

- **Deployment:** latest relevant Pages run [43584670451](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/43584670451) completed successfully on commit `1eaeb6b3`; the deploy job and all smoke tests passed. The product hub and `llms.txt` edits are included. Later report/matrix-only commits do not change the Pages artifact.
- **SwiftNodes:** private dashboard and referral stats remain inaccessible through the zero-credit browser tool. A $10 top-up is prohibited; do not request one.
- **StableDomains:** commission calculation conflict remains unresolved; payout dashboard and referral statistics are not verified.
- **SkillStore:** exact receipt ID is missing; do not resubmit.
- **Ignlab / AI Tools Directory:** form fields and CAPTCHA/anti-bot requirements are not verified; no submission.
- **Buyer activity:** no new payment/preflight emails matched, no buyer use or affiliate conversion was verified, and no settled proceeds were recorded.

## Sources

- [Agensi API Contract Validator](https://agensi.io/skills/api-contract-validator)
- [Ignlab Launch](https://launch.ignlab.net/)
- [AI Tools Directory submission rules](https://aitoolsdirectory.com/submit-tool)
- [SkillChain](https://www.skillchain.me/)
- [mcpub submission requirements](https://mcpub.dev/)
- [SwiftNodes affiliate terms](https://swiftnodes.io/affiliates)
- [StableDomains affiliate terms](https://stabledomains.net/affiliates)
- [StableDomains program details](https://stabledomains.net/affiliates/program)
- [StableDomains referral-link page](https://stabledomains.net/affiliates/link)
- [StableDomains developer docs](https://stabledomains.net/developers)
