# Golden Desk — Operating Blueprint

## Purpose
A six-role decision and execution desk for finding the shortest credible, zero-upfront-cost route to first independently verified revenue, then improving automation and repeatability. Golden Desk is a workflow architecture, not a claim that six independent agents are already deployed.

## Six logical roles

1. **Scout** — discover buyer-intent signals, new markets, products, and lawful distribution channels. Maintain a separate search track for opportunities unrelated to Falcon or JSON/API tooling.
2. **Analyst** — compare candidates using evidence of demand, time-to-first-sale, zero-cost feasibility, automation potential, competition, support burden, policy risk, and expected net value. Mark assumptions and confidence.
3. **Builder** — implement one bounded improvement to a product, workflow, landing page, or validation asset; run tests and avoid paid dependencies or embedded secrets.
4. **Distribution** — advance one permitted channel or evergreen discovery asset; verify the public state and log a direct URL. No spam, mass-DM, fake accounts, or moderation evasion.
5. **Skeptic** — challenge the leading idea for hidden costs, scams, weak demand evidence, platform restrictions, eligibility, technical failure, and unsupported automation claims.
6. **Desk Lead** — select the single best next action using the **blue smooth route** principle: shortest credible route to a verified first payment, balancing speed and future automation.

## Decision score
Score each candidate from 0–5 on:
- Buyer-demand evidence
- Time-to-first-sale
- Zero-upfront-cost feasibility
- Automation potential
- Low maintenance/support burden
- Legal and platform feasibility

A zero for legal/platform feasibility blocks execution. Prefer evidence-weighted opportunities over novelty. Keep JSON Contract Tester/Falcon as one portfolio track, not the entire strategy.

## Operating loop
Scout → Analyst → Skeptic → Desk Lead → Builder → Distribution → verify → log → repeat.

Every run should inspect current evidence, investigate at least one materially different route, make one concrete change or validation step where possible, verify it, and update the evidence log. Separate researched, submitted, publicly visible, accepted, used, and paid states.

## Revenue and safety gates
- Revenue remains zero until independently verified from a payment provider or settlement record.
- No upfront spending, paid API dependency, transfers, signing, payout changes, or handling customer funds.
- Never store or transmit bank/card/identity details or credentials in prompts, logs, repository files, or reports.
- Stop for user action only when identity, credentials, payout setup, explicit authorization, or an irreversible/high-impact decision is required.
- Respect laws, sanctions, platform terms, privacy, and community rules. No spam, scraping member lists, fake accounts, mass-DM, or moderation evasion.

## Current implementation truth (2026-11-03)
The repository's existing Revenue Machine is a safe dry-run foundation. Its README and ARCHITECTURE identify live opportunity-source adapters, external worker adapters, payment-provider verification, and live dashboard telemetry as not yet implemented. The dashboard is static, not connected to runtime telemetry. Golden Desk therefore currently operates as a scheduled research/decision workflow plus documented architecture; it is **not** yet a fully autonomous income engine, and six separate software agents have not been deployed.

## First build sequence
1. Establish a canonical opportunity/evidence schema and decision scoring.
2. Add source adapters with strict allowlists, timeouts, provenance, and tests.
3. Add a human-approved action queue for external changes; keep safe reversible local work autonomous.
4. Add channel-state and traffic evidence to the dashboard.
5. Add payment-provider read-only verification adapter; never infer revenue from self-report.
6. Enable any execution adapter only after tests, limits, audit logs, and explicit permission boundaries exist.
