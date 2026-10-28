# Revenue ledger and payment verification

This file defines the minimum manual control for the first paid offer. The CSV alongside it starts empty by design: no customer orders or revenue are assumed.

## Non-negotiable rule

`VERIFIED_REVENUE_PER_DAY` counts only funds independently verified on the relevant blockchain explorer and confirmed as the correct asset, network, destination address, and amount. A screenshot, submitted TxID, email, or form submission alone is not proof. Pending, failed, underpaid, wrong-network, or otherwise uncertain transfers count as **0** until resolved.

## Workflow

1. Assign a unique `order_id` when a genuine request arrives.
2. Record the requested offer and amount; do not put secrets, personal payloads, or customer data in the ledger.
3. When a TxID is submitted, mark it `pending`; verify it independently using a reputable explorer for the stated network.
4. Confirm token contract/asset is USDT, destination matches the published wallet for that network, transaction succeeded, and received amount is at least the agreed amount. Do not rely on screenshots.
5. Record the verified amount and UTC timestamp; only then set `verification_status=verified`.
6. Deliver only after payment is verified and safe/redacted materials are received. Record delivery timestamp.
7. Keep the ledger private operationally. Do not add customer names, email addresses, wallet balances, secrets, or payloads to this public repository. Store detailed customer communication in the business inbox, not GitHub.

## Allowed verification statuses

- `pending`
- `verified`
- `underpaid`
- `wrong_asset_or_network`
- `failed`
- `unresolved`
- `refunded`

## Operational limits

- The static website does not verify blockchain transactions or persist submitted orders.
- FormSubmit activation and inbox delivery were confirmed on 2026-10-28 using a harmless no-payment message. The temporary activation form was removed afterward. Real orders still require independent on-chain verification; an email notification is not payment proof.
- No card checkout is enabled. Do not imply universal payment availability or bypass geographic, sanctions, or processor restrictions.
- The public CSV is a schema/template only. Do not write actual customer payment records to the public repository; keep a private copy in a secure location.

## Current KPI

- `VERIFIED_REVENUE_PER_DAY`: **0 until a real transfer is independently verified and privately recorded**.
- `TIME_TO_FIRST_VERIFIED_REVENUE`: not yet achieved.
