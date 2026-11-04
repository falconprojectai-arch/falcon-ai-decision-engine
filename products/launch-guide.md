# Product launch guide — 2026-11-04

This guide is the source of truth for the five browser-first micro-products added in the November 4 build sprint. Each tool is a local-first MVP; do not describe it as a hosted SaaS with accounts, cloud sync, integrations, or automated alerts.

## Product index

| Product | User problem | Current capability | Important limit | Browser path |
|---|---|---|---|---|
| [LocalBiz FollowUp](./localbiz-followup/) | Losing track of enquiries and follow-ups | Customer records, status, follow-up dates, reply drafts, CSV export | Local browser storage; no messaging integration or shared team database | `products/localbiz-followup/` |
| [StockPulse](./stockpulse/) | Spreadsheet-based stock and margin tracking | SKU records, reorder thresholds, stock value and gross-margin calculations, CSV import/export | No live store/accounting sync; calculations depend on entered cost and price data | `products/stockpulse/` |
| [MCPGuard Lite](./mcpguard-lite/) | Risky agent/MCP configuration patterns | Local heuristic scan for exposed secrets, risky commands, broad access and insecure configuration patterns | Heuristic findings are not a full security audit; scan only sanitized configuration | `products/mcpguard-lite/` |
| [ExpenseSnap](./expensesnap/) | Scattered billable-time and project-expense records | Time and expense entries, project/client totals, invoice-ready CSV/JSON summary | Not tax/accounting software; no timer, invoicing, payments or cloud sync | `products/expensesnap/` |
| [CronPulse](./cronpulse/) | Repeated failures hidden in exported job histories | Import JSON/JSONL run history, normalize common fields, identify repeated failures, export incident summary | Offline analysis only; not live monitoring, alerting, retry or restart | `products/cronpulse/` |

## Standard product introduction package

Each product card in [`products/index.html`](./index.html) now uses the same structure: short product name, illustrative interface preview, one-paragraph plain-language explanation, current release-test status, live product path, and direct source-repository link. The SVG previews are intentionally labelled as illustrative; they are not captured browser screenshots and contain synthetic sample data.

The GitHub Pages workflow now copies all five preview images and this guide into the published site. The workflow also runs Chromium smoke tests for all five products after deployment. Do not change a product's status to passed unless the corresponding workflow run completes successfully on the current product commits.

## Run and test

1. Open the relevant `index.html` in a modern browser, or serve the repository root over a local static HTTP server.
2. Use synthetic/sample data first. Do not upload production secrets, customer personal data, payment details or confidential payloads.
3. Test the core flow:
   - LocalBiz: create a customer, change status, set a follow-up, export CSV.
   - StockPulse: add a SKU, change quantity below reorder threshold, check stock value/margin, export CSV.
   - MCPGuard: scan a synthetic config containing a deliberately fake token and risky command; verify findings are clearly labeled as heuristic.
   - ExpenseSnap: add two hours at rate 50 and verify estimated billable total 100; add an expense and export.
   - CronPulse: import four synthetic runs containing two failures; verify repeated-failure summary and export.
4. Record browser, commit SHA, test result and timestamp before calling a test passed.

## Release status

- Repository source and product catalogue: committed.
- Prior CI evidence: the previous deployment passed Chromium smoke tests for the dashboard, developer toolbox, payment page, JSON Contract Tester and the first three micro-products.
- The current release workflow explicitly tests LocalBiz FollowUp, StockPulse, MCPGuard Lite, ExpenseSnap and CronPulse, then checks the catalogue images and launch guide before a release can pass.
- A browser proxy error is not evidence that the public site is broken; independently verify from a normal public network.
- Product preview artwork is included as SVG. It is an illustrative interface preview, not a captured screenshot or recorded demo.

## Distribution gates

- Index Agentica accepts a structured listing request without authentication; a request is a review queue entry, not an approved listing.
- x402.jobs public discovery is open, but seller resource registration requires an API key. Do not claim a listing was submitted until a key is available and the API confirms it.
- Never pay a listing fee or make a test payment from the user's funds without a separate explicit instruction.
- Revenue remains zero until an independent buyer payment is verified against provider settlement evidence.
