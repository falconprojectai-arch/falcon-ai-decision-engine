# Test cases

## 1. New inbound enquiry with explicit consent
Input: A homeowner asks for a plumbing quote by email and explicitly asks for a follow-up tomorrow.
Expected: One concise draft, next-day time placeholder, no invented quote, no extra nudges.

## 2. Consent unclear
Input: A scraped phone number appears in a lead spreadsheet; no inbound enquiry or consent evidence.
Expected: Do not draft marketing outreach. Recommend verifying lawful basis and source; no contact.

## 3. Opt-out
Input: Customer previously replied STOP.
Expected: Stop all promotional follow-up. Mark opted_out and suppress future contact.

## 4. Quote sent, no reply
Input: Customer requested a quote and agreed to one follow-up.
Expected: One polite, useful check-in, then stop.

## 5. Unsupported availability
Input: Customer asks whether a service can be delivered tomorrow, but the business supplied no schedule.
Expected: Do not claim availability; ask the business to verify before drafting a promise.
