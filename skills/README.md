# Public Agent Skills

This repository publishes reusable Agent Skills in the open `SKILL.md` format. They are procedural instructions, not standalone integrations. Review each package before installation.

## Install

```bash
npx skills add falconprojectai-arch/falcon-ai-decision-engine
```

Select the relevant skill from the repository. The source packages are organized under `skills/<skill-name>/SKILL.md`.

## Available skills

| Skill | Purpose | Public product/source |
|---|---|---|
| Lead Follow-up Strategist | Consent-aware follow-up plans and message drafts for genuine inbound business leads. | [Source](lead-followup-strategist/SKILL.md) · [TechTools](https://techtools.cz/tools/launchpad/?tool=9748) |
| LocalBiz FollowUp | Enquiry stages, next actions and draft follow-up workflows for shops and online sellers. | [Source](localbiz-followup/SKILL.md) · [Browser app](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/localbiz-followup/) · [TechTools](https://techtools.cz/tools/launchpad/?tool=7543) |
| StockPulse | Manual SKU inventory, reorder thresholds and estimated gross margin. | [Source](stockpulse/SKILL.md) · [Browser app](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/stockpulse/) · [TechTools](https://techtools.cz/tools/launchpad/?tool=7544) |
| MCPGuard Lite | Heuristic local review of MCP and AI-agent configuration files. | [Source](mcpguard-lite/SKILL.md) · [Browser app](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/mcpguard-lite/) · [TechTools](https://techtools.cz/tools/launchpad/?tool=7545) |
| ExpenseSnap | Local time and expense logging with export-ready summaries. | [Source](expensesnap/SKILL.md) · [Browser app](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/expensesnap/) · [TechTools](https://techtools.cz/tools/launchpad/?tool=7546) |
| CronPulse | Offline analysis of exported scheduled-job and agent run history. | [Source](cronpulse/SKILL.md) · [Browser app](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/cronpulse/) · [TechTools](https://techtools.cz/tools/launchpad/?tool=7547) |
| JSON Contract Tester | Validation guidance for API/AI JSON outputs against a documented JSON Schema subset. | [Source](json-contract-tester/SKILL.md) · [Browser tool](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/json-contract-tester/) · [TechTools](https://techtools.cz/tools/launchpad/?tool=9746) |
| Dev & Agent Toolbox | Safe selection and use of browser-only developer utilities. | [Source](dev-agent-toolbox/SKILL.md) · [Browser toolbox](https://falconprojectai-arch.github.io/falcon-ai-decision-engine/products/dev-agent-toolbox/) · [TechTools](https://techtools.cz/tools/launchpad/?tool=9747) |

## Marketplace status

The nine free Agensi listings are separate from these public GitHub packages. At the latest check, all nine Agensi listings were submitted and pending review; do not infer approval from the existence of these GitHub files or TechTools listings.

## Scope and safety

These skills do not create integrations or authorize external actions by themselves. Unless a skill explicitly says otherwise, they provide instructions, analysis, drafts and local workflows only. They do not send messages, book appointments, change records, charge customers, execute trades, or process payments.
