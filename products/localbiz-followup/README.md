# LocalBiz FollowUp

A browser-only lead and customer follow-up tracker for small businesses.

## MVP features
- Add enquiries with source, contact, need, stage and next follow-up date.
- Prepare a message and open a prefilled WhatsApp chat from a valid phone number; the user reviews and presses Send manually.
- Due-date and pipeline counts.
- Search/filter, editable stage, message draft, CSV export and JSON backup.
- Local browser storage; no external service or API.

## Limits
No WhatsApp/Instagram API or automatic sending, cloud sync, multi-user access, payment processing or reminders while the browser is closed. The WhatsApp button only opens a prefilled draft after a user click; it never sends. Data stays in local browser storage unless exported. Do not store sensitive customer information. Back up records regularly.

## Run
Open `index.html` in a modern browser. No build step or dependencies.
