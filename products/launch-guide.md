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
| [LocalBiz FollowUp](./localbiz-followup/) | Losing track of enquiries and follow-ups | Customer records, source, last contact, next action, notes, status, follow-up dates, reply drafts and CSV export | Local browser storage; due list updates only while open; no messaging integration or shared team database |
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

## LocalBiz FollowUp quick start

LocalBiz FollowUp is a browser-only enquiry tracker for small shops, service providers and online sellers. Use it to keep the next customer action visible; it does not send messages or sync records to a cloud account.

### Example: an online-shop product enquiry

A customer asks through Instagram whether a product is in stock and what delivery costs. You answer, but the customer wants time to decide.

1. Open [LocalBiz FollowUp](./localbiz-followup/).
2. Add the customer's name and the contact method they used. Keep only the minimum information needed.
3. Enter the product or service they asked about.
4. Set a sensible follow-up date and choose the current stage, such as **New** or **Waiting**.
5. When the date arrives, filter for **Due today / overdue** and choose **Draft**.
6. Review and personalize the message. Copy it or open the WhatsApp draft; you decide whether and when to send it.
7. Update the stage when the customer buys, declines or needs more time.

Example draft:

> Hi Sara, I’m following up on your question about the blue backpack. Would you like me to confirm the available colours or delivery options for you?

This is only a starting point. Check the conversation history, respect opt-outs and contact customers only through channels they have agreed to use.

### A simple daily routine

- **Start of day:** review enquiries due today or overdue.
- **Before contacting anyone:** check the latest conversation and whether another message is appropriate.
- **After a reply:** update the stage and next action.
- **End of day:** export CSV or JSON backups if you need an external record.

### Privacy and limitations

- Records stay in the current browser's local storage; they do not automatically sync between devices.
- Export backups before clearing browser data.
- Do not store payment-card details, passwords, identity documents or sensitive personal information.
- The app prepares drafts only. It has no WhatsApp API, automatic sending, cloud account, background reminders or payment processing.
- Test with fictional data before entering real customer information.

[Open LocalBiz FollowUp](./localbiz-followup/) · [Read the Agent Skill](../skills/localbiz-followup/SKILL.md)

## JSON Contract Tester quick start

Use JSON Contract Tester to check whether a batch of API or AI-agent responses matches the contract your application expects. The tool runs in the browser and does not upload the pasted schema or test data.

### Example: validate an AI support-agent response

Suppose your application expects every response to contain a boolean `ok` field and a non-empty string `answer` field, with no extra top-level properties.

Use this schema:

```json
{
  "type": "object",
  "required": ["ok", "answer"],
  "properties": {
    "ok": { "type": "boolean" },
    "answer": { "type": "string", "minLength": 1 }
  },
  "additionalProperties": false
}
```

Paste one JSON value per non-empty line in the test-output box:

```json
{"ok":true,"answer":"Your order is being processed."}
{"ok":true,"answer":""}
{"ok":"yes","answer":"Your order is being processed."}
{"ok":true,"answer":"Done","debug":"internal"}
```

The first record should pass. The remaining records should fail for a missing non-empty answer, the wrong type for `ok`, and an unexpected `debug` property respectively.

### Workflow

1. Write the smallest schema that describes the response your application actually consumes.
2. Paste representative valid, invalid, and edge-case outputs, one JSON value per line.
3. Run validation and inspect the JSON Pointer path and reason for each failure.
4. Fix the producer, schema, or test fixture according to the intended contract; do not simply weaken validation to make failures disappear.
5. Export JUnit XML if you want to connect the results to a separate CI workflow.

### Important limits

This browser tool implements a documented subset of JSON Schema, not the complete specification. It supports common keywords such as `type`, `required`, `properties`, `items`, `enum`, `const`, numeric/string/array bounds, `pattern`, and `additionalProperties: false`. It does not support references, combinators such as `oneOf` or `anyOf`, full `format` checks, or every JSON Schema feature. Unknown keywords are ignored. A PASS means the data passed the supported rules only; use a full standards-compliant validator for production or security-critical contracts.

[Open JSON Contract Tester](./json-contract-tester/) · [Read the Agent Skill](../skills/json-contract-tester/SKILL.md)

