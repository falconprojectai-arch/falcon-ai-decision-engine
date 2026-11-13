# Super Scout — 2026-11-13

## Executive result

- Independently verified net settled revenue: **$0.00**
- Verified paid API transactions: **0**
- Verified affiliate conversions/commissions: **0**
- Rolling 7-day average net settled proceeds: **$0.00/day**
- New third-party listings submitted in this run: **0**. New channels were either incompatible with the payout/owner-input constraints or required a genuine MCP server that does not yet exist.
- Owned-repository content, navigation, machine-readable catalogue and evidence-log updates were committed. Static validation passed for LocalBiz metadata/JSON-LD, truthful manual-send disclosure, affiliate terms/disclosures, MCP eligibility wording, navigation links, channel matrix and this report. GitHub Pages deployment/public verification is still pending; these commits are not described as live until the deployed pages are fetched successfully.

## Work completed by workstream

### 1. SCOUT — six materially different angles

**A. MCP server discovery directory**

- Reviewed [mcpub](https://mcpub.dev/). Its submission route is free and accountless, but it requires a functioning MCP endpoint and a `/.well-known/mcp.json` file.
- The current JSON Contract Tester API is a REST/x402 API, not an MCP server. Submitting it as MCP would be inaccurate, so no submission was made.
- The community directory's well-known-file requirement is not an MCP protocol requirement and must not be presented as one. The [official MCP Registry](https://registry.modelcontextprotocol.io/) is separate.

**B. Creator marketplaces and payout models**

- [Techne Skills](https://techneskills.ai/founding-creators/terms): founding offer has a 10% platform fee and a 14-day requirement to ship a real, runnable skill. The application page requires email magic-link sign-in; it says shortlisted applicants get a personal call. The application page estimates ~6 minutes, while the terms page describes a seven-step form taking around 15 minutes. Stripe/Connect fees apply, and its terms prohibit promoting competing platforms on Techne. Not suitable under current no-owner-login/no-Stripe-payout constraints.
- [SkillExchange](https://skillexchange.market/terms): creator registration requires GitHub or Google OAuth; payouts are fiat EUR through Stripe Connect. The public creator page's 80/20 versus 85/15 fee claims are inconsistent. Not submitted.
- [Skillzy](https://skillzy.ai/terms): advertises free instant listings and an 80% seller share, but payouts require Stripe Connect onboarding and identity checks. No crypto payout route; listings are not pre-reviewed, leaving seller security/IP responsibility. Not submitted.

**C. Local-business follow-up demand**

- A current [Upwork speed-to-lead job for HVAC and roofing](https://www.upwork.com/freelance-jobs/apply/Speed-Lead-System-for-HVAC-Roofing_~022113721182841106844/) describes 150–300 leads/month, an instant SMS/AI qualification/CRM/calendar workflow and a $1,500–$2,500 budget; the listing showed 50+ proposals.
- A second [GHL/n8n automation job](https://www.upwork.com/freelance-jobs/apply/GHL-n8n-Automation-Integration-Specialist_~022120286826874535541/) was posted the previous day and includes a missed-lead auditor.
- This is evidence of demand for implemented CRM/SMS/calendar automation, not proof that our browser-only LocalBiz FollowUp already solves it. The current product only tracks enquiries and prepares drafts for manual review/send. No unsupported automation claims were added.

**D. Affiliate economics**

- [SwiftNodes official affiliate terms](https://swiftnodes.io/affiliates), checked 2026-11-13: 20% of each referred customer's payment for the life of the subscription; 30-day hold; USDC on Base, Arbitrum or Polygon; $50 minimum; monthly payout.
- [StableDomains official affiliate terms](https://stabledomains.net/affiliates), checked 2026-11-13: $0.60 per eligible .com and $0.51 per eligible .xyz registration/renewal/transfer attributed within 30 days; first referrer wins; self-referrals excluded; weekly USDC on Base after review at a $5 minimum. Smaller balances roll over.
- Neither route has a verified conversion or commission. The SwiftNodes private dashboard could not be inspected because the available browser automation wallet is at $0 and its $10 minimum top-up violates the zero-spend rule. No paid top-up was made and no payout setting was changed.

**E. Peer creator playbooks on Agensi**

- [AI Digital Marketing Tool — Spark Media](https://agensi.io/skills/ai-digital-marketing-tool-spark-media) shows 76 uses and a 5-star rating from 2 reviews.
- [SEO Audit Agent](https://agensi.io/skills/seo-audit-agent-full-website-seo-checker) shows 75 uses and a 5-star rating from 3 reviews.
- These are marketplace use/rating signals, not proof of creator earnings. The SEO playbook was useful as a checklist and identified missing LocalBiz page metadata. The Spark Media framework was broad and needed a more specific buyer segment.
- The existing Agensi request “Zero-cost AI-agent business growth review and revenue playbook” remains open with 0 votes; no creator reply or private consultation is verified. No duplicate request or bounty funding was attempted.

**F. Existing product and distribution channels**

- Agensi recheck: all nine free skills remain live and security-approved; each currently shows 0 uses, 0 ratings and 0 reviews.
- SkillStore: the 2026-11-12 anonymous repository submission previously returned a Pending receipt for an estimated 10 skills. Only receipt prefix `dde1d29d...` is preserved; no exact status ID or status URL is available. No resubmission was made. The public pending folder did not show a matching PR during this check, which is not sufficient to infer rejection.
- PayAPI Market: Gmail recheck found no newer provider message than the 2026-11-03 acceptance note stating the API listing was not yet live and that the provider planned its own canary. No paid call or payout evidence.
- YourAITools: an automated duplicate-safe POST on 2026-11-12 returned HTTP 409 with existing listing `sub_zreyutibyh` in `pending_review`. This was a duplicate guard, not a new submission; no duplicate was created and no paid review was used.

## 2. ANALYST — decision gate

Scores are 0–5, not conversion probabilities. Higher support-burden score means less ongoing support work.

| Candidate | Buyer evidence | Time to first sale | Zero-cost feasibility | Automation | Low support burden | Legal/platform fit | Confidence / decision |
|---|---:|---:|---:|---:|---:|---:|---|
| Infrastructure content + SwiftNodes/StableDomains referrals | 3 | 2 | 5 | 5 | 5 | 5 | Medium; leading route, no conversion yet |
| JSON Contract Tester API via x402/Agent402 | 2 | 2 | 5 | 5 | 3 | 4 | Low–medium; alternate, no paid buyers yet |
| LocalBiz FollowUp as a manual browser tracker | 2 | 2 | 5 | 2 | 3 | 5 | Low–medium; keep scope narrow |
| mcpub submission for current REST API | 0 | 0 | 5 | 4 | 3 | 5 | Not eligible: no actual MCP server |
| Techne / SkillExchange / Skillzy seller routes | 3 | 1 | 0 | 3 | 3 | 4 | Blocked by required owner sign-in and/or Stripe Connect/KYC payout path |

### Golden River

**Continue the existing MCP/RPC/domain infrastructure content funnel with transparent SwiftNodes and StableDomains referral links.** It is already aligned with developer infrastructure intent, requires no paid promotion and can operate with low ongoing support. StableDomains has the lower published payout threshold ($5); SwiftNodes offers recurring 20% but has a $50 threshold. There is still no evidence of clicks, conversions, commissions or settled proceeds.

### Alternate route

**Continue the JSON Contract Tester API's existing x402/Agent402 discovery path.** The service is live and automatable, but the last recorded public discovery data showed zero paid transactions and zero buyers. A 402 challenge, route registration or listing is not a sale. Do not self-buy or fund a canary.

## 3. BUILDER — owned assets updated

1. `products/localbiz-followup/index.html`
   - Added a meta description, canonical URL, robots directive, Open Graph/Twitter metadata and valid WebApplication JSON-LD.
   - Preserved the truthful browser-only/manual-send disclosure.
   - Commit: `0ade7a24d31d7129afaf261c382921626a602b2a`.

2. `products/dev-agent-toolbox/blockchain-infrastructure.html`
   - Refocused the guide on launching a remote MCP server: RPC selection, domains, endpoint verification and directory distinctions.
   - Added current published SwiftNodes and StableDomains affiliate terms and retained visible referral disclosures.
   - Explicitly states the JSON Contract Tester API is REST/x402, not an MCP server, so it has not been submitted to mcpub.
   - Commit: `2121c5d3be82bca54be9949cd520115fae6e71cc`.

3. `products/dev-agent-toolbox/agent-integration-patterns.html`
   - Updated both affiliate disclosures to the current published terms and date.
   - Commit: `5d7a73d4139280ab68a02a036af6d6d25579af`.

4. `products/dev-agent-toolbox/index.html`, `products/marketplace-hub.html` and `llms.txt`
   - Renamed navigation to the MCP server launch checklist and updated the machine-readable guide description.
   - Commits: `a3cdfab80e5b8385bc2b6a2f675ee294280954d2`, `ad13d29395df108ec0583a51c5cb1fb1d1435270`, `a98c3485c572d8527d1b08f13d9922d612c62111`.

5. `reports/channel-matrix.md`
   - Reconciled Agensi, SkillStore, SwiftNodes, StableDomains, mcpub, Techne, SkillExchange and Skillzy states; added the decision gate and evidence links.
   - Commits: `e40e52e3adbdaef77635a90e810b67cf0e7781ff`, `d6b1dc13a563bf12b0f5d6ef2552ba2ada5675a8`, `7427ef8f460f3ed144315913fd51d58a855882e4` and `a8644c21c6d1cc77de52bca20899e1d72dfcd490`.

6. `reports/super-scout-2026-11-13.md`
   - Added this dated evidence report.
   - Commit: `194fac576e651f59c414db80135f2094248a6357`.

**Static checks passed:** LocalBiz JSON-LD parses; metadata/canonical/Open Graph tags exist; manual-send disclosure remains; affiliate term blocks and disclosures, MCP eligibility wording, navigation links, channel matrix and report content all passed source-level assertions. Latest GitHub Pages deployment and public-page verification are still pending.

## 4. DISTRIBUTION

- No new third-party submission was made because the available new routes were not compatible or the product was not technically eligible.
- Existing Agensi, TechTools, CHAAAM, GitHub, SkillStore, YourAITools and PayAPI states remain distinct in the [channel matrix](./channel-matrix.md).
- No mass outreach, unsolicited comments, paid listings, ads, top-ups, fake installs, fake reviews, self-referrals or payout changes were performed.

## 5. SKEPTIC — current risks

- Directory count is not demand. Agensi's nine live skills still show zero uses.
- The LocalBiz product is a manual tracker, not a missed-call text-back or CRM automation platform.
- Upwork budget/proposal counts indicate a competitive service market; they do not establish our ability to deliver the full scope.
- StableDomains commissions are small per registration and require a $5 cleared balance; SwiftNodes has a $50 minimum and a 30-day hold.
- The browser automation wallet is empty; no paid top-up is allowed.
- SkillStore's exact receipt identifier was not preserved; do not guess a status URL or resubmit.
- No peer creator has privately replied. Marketplace playbooks are not direct consultation or proof of earnings.

## 6. DESK LEAD — next evidence-driven actions

1. Verify GitHub Pages deployment for the three content commits; fetch the public pages and confirm the new metadata, guide text and affiliate disclosures before calling them live.
2. Keep the infrastructure guide as the lead acquisition asset; only add more distribution when the channel has a real developer audience and no owner-only gate.
3. Recheck SwiftNodes referral dashboard only through a no-cost authenticated session; never top up the browser wallet or modify payout settings.
4. Check the SkillStore status only if the exact receipt becomes available; do not resubmit.
5. Keep the x402 API route available and monitor only independently verified paid POSTs/settlement. Do not fund test purchases.
6. Keep LocalBiz positioned as a privacy-conscious, local-first manual tracker. Seek qualified, opt-in feedback before building integrations.

## Revenue proof

No independently verified settled proceeds were found in this run. Revenue remains **$0.00**, and the rolling seven-day average remains **$0.00/day**.
