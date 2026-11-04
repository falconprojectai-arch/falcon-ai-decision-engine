# Product launch guide — 2026-11-04

This guide is the source of truth for the five browser-first micro-products in this release. Each tool is a local-first MVP. Do not describe these products as hosted SaaS with accounts, cloud sync, messaging integrations, live monitoring or automated alerts.

## Standard product introduction package

Every product card in [the product catalogue](./index.html) uses the same five-part format:

1. **Short title** — product name and category.
2. **Screenshot** — a real PNG captured from the working product interface during GitHub Pages deployment. Each screenshot uses synthetic sample data, not customer data.
3. **Plain-language description** — one paragraph explaining the problem and what the tool actually does.
4. **Test status** — updated only after the deployment workflow passes the product smoke tests.
5. **Links** — direct product page and source repository.

The repository also keeps an SVG interface illustration for each product as a fallback. The published catalogue uses the real PNG screenshots.

## Product index

| Product | User problem | Current capability | Important limit |
|---|---|---|---|
| [LocalBiz FollowUp](./localbiz-followup/) | Losing track of enquiries and follow-ups | Customer records, status, follow-up dates, reply drafts, CSV export | Local browser storage; no messaging integration or shared team database |
| [StockPulse](./stockpulse/) | Spreadsheet-based stock and margin tracking | SKU records, reorder thresholds, stock value and gross-margin calculations, CSV import/export | No live store/accounting sync; calculations depend on entered cost and price data |
| [MCPGuard Lite](./mcpguard-lite/) | Risky agent/MCP configuration patterns | Local heuristic scan for exposed secrets, risky commands, broad access and insecure configuration patterns | Not a full security audit; false positives and missed risks are possible |
| [ExpenseSnap](./expensesnap/) | Scattered billable-time and project-expense records | Time and expense entries, project/client totals, invoice-ready CSV/JSON summary | Not tax/accounting software; no timer, invoicing, payments or cloud sync |
| [CronPulse](./cronpulse/) | Repeated failures hidden in exported job histories | Import JSON/JSONL run history, normalize common fields, identify repeated failures, export incident summary | Offline analysis only; not live monitoring, alerting, retry or restart |

## Release test status

**PASS — All five products, catalogue images and launch guide passed the GitHub Actions deployment workflow** on commit `73c052c4e4c77b07cffca5d200723745ead0565e`.

The successful run:
- Captured five real PNG screenshots from the working product interfaces.
- Published the dashboard, catalogue, product pages, screenshot PNGs, SVG fallbacks and this guide to GitHub Pages.
- Passed Chromium smoke tests for LocalBiz FollowUp, StockPulse, MCPGuard Lite, ExpenseSnap and CronPulse.
- Verified five catalogue cards, all five screenshot image loads, all five repository links, the visible passed-test labels and the published launch guide.

[Open the successful deployment and test run](https://github.com/falconprojectai-arch/falcon-ai-decision-engine/actions/runs/41873099905).

## Run and test locally

1. Open the relevant `index.html` in a modern browser, or serve the repository root over a local static HTTP server.
2. Use synthetic/sample data first. Do not upload production secrets, customer personal data, payment details or confidential payloads.
3. Test the core flow:
   - LocalBiz: create a customer, change status, set a follow-up, export CSV.
   - StockPulse: add a SKU, change quantity below reorder threshold, check stock value/margin, export CSV.
   - MCPGuard: scan a synthetic config containing a deliberately fake token and risky command; interpret findings as heuristic.
   - ExpenseSnap: add two hours at rate 50 and verify estimated billable total 100; add an expense and export.
   - CronPulse: import four synthetic runs containing two failures; verify repeated-failure summary and export.

## Distribution gates

- Index Agentica accepted a structured listing request into its curator review queue. Request ID: `15`; status: `pending`; it is not yet an approved or published listing.
- x402.jobs seller resource registration requires an API key. Do not claim a listing was submitted until the API confirms it.
- Never pay a listing fee or make a test payment from the user's funds without a separate explicit instruction.
- Revenue remains zero until an independent buyer payment is verified against provider settlement evidence.
