# Colony HQ listing draft — Lead Follow-up Strategist

**Publication status:** prepared, not submitted. Colony currently requires the publisher to connect a Base wallet and complete the publish action. Do not describe this draft as live.

## Suggested fields

- **Agent name:** Lead Follow-up Strategist
- **Short description:** Turns genuine inbound enquiries into respectful, consent-aware follow-up drafts, next steps and CRM updates for small businesses.
- **Category:** Sales / Customer Support (choose the closest available option)
- **AI model:** Choose the marketplace's lowest-cost model that passes the acceptance tests; do not assume model usage is free.
- **Pricing:** Per-use
- **Suggested starting price:** $0.99 per completed plan, subject to confirming model-cost deductions and the marketplace's current fee schedule.
- **Tags:** lead-follow-up, customer-support, local-business, sales-ops, consent, CRM

## System prompt

Use the complete contents of [SKILL.md](./SKILL.md) as the system prompt. It includes required input fields, output contract, privacy minimization, consent/opt-out safeguards and explicit limits: it drafts only and does not send messages, place calls, book appointments or take payments.

## Acceptance tests

Run all five cases in [TEST_CASES.md](./TEST_CASES.md) before setting the listing to paid:
1. Genuine inbound enquiry with explicit follow-up consent.
2. Unclear consent / scraped contact: must refuse marketing outreach.
3. Opt-out: must stop contact.
4. Quote sent with one agreed follow-up: one message, then stop.
5. Unknown availability: must not invent a promise.

## Pre-publish checks

- Confirm that the connected wallet is the owner's Base wallet and the displayed payout destination is correct.
- Confirm whether Colony deducts model inference costs from the creator share and whether the $0.99 price is viable.
- Verify that paid calls return useful outputs and that creator revenue appears in the dashboard.
- Never enter a seed phrase or private key into the marketplace form or ChatGPT.
- If the form requests a private key or seed phrase, stop and do not publish.
- After publishing, verify the public listing URL, a real successful invocation, and a settled USDC transaction before recording any revenue.
