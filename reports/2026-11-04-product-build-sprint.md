# Product Build Sprint — 2026-11-04

## Decision

Build three browser-first micro-products that address two current small-business operating pains and one emerging AI-agent security need. Keep them free to run, with no paid APIs, no account requirement and no customer data sent to a server.

## Market evidence

- The 2026 inTandem SMB digital adoption survey says billing/invoicing remains the top requested feature, automated reminders have risen to the third most requested capability, and scheduling and practical AI are also prominent. This supports lightweight customer follow-up and administrative tools: https://intandem.vcita.com/content-hub/the-2026-small-business-digital-adoption-report
- A Q4 2026 ecommerce operator pain index reports manual data re-entry as the most common pain (45.2% of 135 operators) and fragile spreadsheets as another major problem (31.1%). This supports a low-friction stock and CSV workflow: https://www.sku.io/research/ecommerce-ops-pain-index/
- LangChain's 2026 State of Agent Engineering survey of 1,300+ respondents reports 57% with agents in production, 32% citing quality as a top barrier, and 89% implementing observability: https://www.langchain.com/state-of-agent-engineering
- Theory Ventures' 2026 AI in Practice survey of 455 technical builders reports security/governance as the top pain point, with 43% rating it 6–7 out of 7 and only 10% saying current tools deliver the most value: https://theoryvc.com/blog-posts/ai-in-practice-survey-2026
- OECD's 2026 SME survey notes AI adoption is rising but strategic/secure integration remains uneven, with time, maintenance cost and skills as barriers: https://www.oecd.org/en/publications/empowering-smes-in-the-age-of-ai_bf5a9816-en.html

These sources support problem selection, not guaranteed demand, conversion, pricing or revenue for our specific products. Some sources are surveys with non-representative or vendor-collected samples.

## Products built

### 1. LocalBiz FollowUp
Path: `products/localbiz-followup/index.html`
- Customer/enquiry capture with source, need, stage and next follow-up date.
- Open/due/won counters, search/filter, stage updates.
- Draft message, CSV export and JSON backup.
- Browser localStorage only.
- Not included: automated messaging, WhatsApp/Instagram APIs, cloud sync, multi-user access or reminders while closed.

### 2. StockPulse
Path: `products/stockpulse/index.html`
- SKU inventory with on-hand stock, reorder threshold, cost and selling price.
- Low-stock flag, inventory cost value and gross-margin estimate.
- CSV import/export and JSON backup.
- Browser localStorage only.
- Not included: live store integrations, purchase orders, multi-warehouse bins, tax/shipping/refund accounting or audited profit calculations.

### 3. MCPGuard Lite
Path: `products/mcpguard-lite/index.html`
- Local heuristic checks for credential-like strings, shell execution, remote download patterns, broad access hints, plain HTTP, environment exposure and unpinned package hints.
- JSON file input, report download.
- Browser-only; no config upload.
- Not included: malware detection, policy enforcement, dependency provenance verification or a complete security audit. False positives and missed risks are possible.

## Publication

- Product catalogue: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/
- LocalBiz FollowUp: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/localbiz-followup/
- StockPulse: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/stockpulse/
- MCPGuard Lite: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/mcpguard-lite/
- Dashboard: https://falconprojectai-arch.github.io/falcon-ai-decision-engine/

GitHub Pages deployment workflow was updated to include all three products and run Playwright smoke tests. Do not mark public deployment complete until that workflow succeeds and the live pages return HTTP 200.

## Acceptance tests

The deployment workflow now checks:
- LocalBiz: page loads, new customer can be created and open count increments.
- StockPulse: page loads, SKU can be created and low-stock count increments.
- MCPGuard: page loads, sample config scans and high-risk finding is detected.
- Browser page errors are collected and must be empty.
- Product files are served from the assembled Pages artifact.

## Commercial status

- Product code and documentation committed to the public repository.
- No paid services, paid APIs, accounts or external outreach used for these builds.
- No customer, paid conversion, transaction or settlement confirmed.
- Confirmed revenue remains $0.00 until an independent buyer payment is verified.
- Next commercial validation: recruit a handful of real small-business operators and developers for task-based tests; track first-use completion, repeat use, data export and explicit willingness to pay before building integrations.
