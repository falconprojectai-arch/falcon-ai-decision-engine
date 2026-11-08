# ECU Workshop Forms — research prototype

**Version:** 0.1  
**Language:** Persian (fa-IR)  
**Status:** free research sample; not for sale  
**Public preview:** https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/ecu-workshop-forms/  
**Feedback:** https://github.com/falconprojectai-arch/falcon-ai-decision-engine/issues/22

## Buyer and job to be done

Independent ECU and automotive-electrical repair shops that need a consistent paper trail from intake through diagnosis and hand-over, without buying a full workshop-management system solely for this workflow.

## Current sample

The printable sample contains three pages:

1. **Intake:** vehicle and unit identifiers, reported symptom, accessories, and pre-existing condition.
2. **Diagnostic/work record:** test conditions, observations, work performed, parts and unresolved findings.
3. **Final check and hand-over:** final-test checklist, recorded result, warranty terms supplied by the shop, and signatures.

The page is print-to-PDF only. It has no form submission, analytics, local storage, customer database, payment link, or automated delivery.

## Explicit exclusions

- No wiring diagrams, firmware, calibration values, pinouts, repair instructions, or technical recommendations.
- No claim that the form is a legal contract or a warranty template.
- No customer records or real vehicle identifiers in this repository.
- No copied third-party technical content.
- No sale or revenue claim.

## Validation hypothesis

- **Buyer:** independent ECU/auto-electrical shop owner or service manager.
- **Offer hypothesis:** editable/printable Persian pack with intake, diagnostic log, parts/work record, and hand-over form.
- **Price hypothesis:** 149,000–249,000 toman one-time. This is an unvalidated test range, not a live price.
- **Primary proof needed:** feedback from at least three working ECU technicians on missing fields and whether the pack complements their current software/paper workflow.
- **No-go signal:** technicians say existing software already covers this at no additional effort, or they require bespoke legal/technical content that creates ongoing support.

## Fulfilment and payment constraints

- Digyno appears to provide automatic digital delivery and charges 3% per sale, but requires seller eKYC and store approval. Its current public seller page did not state an AI-assisted-content policy; obtain provider confirmation before listing.
- BluePal publishes no setup/monthly fee and offers payment links, but the link itself does not prove automatic file delivery. Its onboarding requires identity verification and a same-name settlement account.
- Do not use card-to-card as the default; it weakens automated reconciliation.
- The owner must enter any identity, tax, or bank details only in the chosen provider's official secure dashboard. Never store those details in this repository.

## Next release gate

Do not build the paid bundle or activate checkout until:
1. at least one working technician reviews the fields;
2. the owner approves the Persian terminology and workflow;
3. the selected marketplace/provider confirms the category is permitted;
4. the seller completes any required identity verification directly with the provider;
5. automatic file delivery and refund handling are tested end-to-end with a non-production test order.

## Safety and privacy

Use synthetic data in public feedback. Do not submit customer names, phone numbers, registration plates, VINs, firmware files, credentials, or payment details to GitHub issues or public channels.
