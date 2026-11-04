# CronPulse

Offline analyzer for exported cron, scheduled task and AI-agent run histories.

- Accepts JSON arrays and JSON Lines.
- Normalizes common status, timestamp, duration and error fields.
- Flags repeated failures and provides CSV / JSON incident export.

Limits: not live monitoring, not connected to any scheduler or agent platform, cannot detect missing/unexported runs, does not alert or restart jobs.

Open index.html in a modern browser.
