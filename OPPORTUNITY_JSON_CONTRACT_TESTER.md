# Opportunity hypothesis: JSON contract testing for AI/API outputs

**Status:** MVP published as a static browser tool; demand and revenue are unvalidated.

## Why this candidate
- A recent public scan of 2,646 developer-community problem reports identified AI-agent/LLM tooling (19.4%), testing/CI/deployment (13.2%), and security/authentication (11.7%) as large problem clusters. This is directional evidence from a developer-focused sample, not proof of willingness to pay: https://startupideasdb.com/blog/micro-saas-ideas
- GitHub's 2026 Octoverse commentary also highlights tools that reduce friction and improve reproducibility in AI-assisted development: https://github.blog/news-insights/octoverse/what-the-fastest-growing-tools-reveal-about-how-software-is-being-built/
- The repository already contains a private, browser-only JSON Schema Generator, so this tool is a low-cost adjacent experiment rather than a new backend.

## MVP
- Single static HTML page; no accounts, backend, external libraries, analytics, or data upload.
- Batch test JSON outputs against a documented subset of JSON Schema rules.
- Download a local JSON test report.
- Clearly discloses that it is not a complete JSON Schema implementation.

## Business hypothesis
Target: developers integrating LLM/agent outputs into APIs or automation who need quick regression checks. Potential paid extensions (not built): reusable contract suites, saved local projects, CI-ready test fixtures, and multi-file reports. Do not build paid extensions until there is evidence of repeated use or buying intent.

## Acceptance / evidence gates
1. Page renders on mobile and desktop.
2. Sample test returns 1 passing and 2 failing cases.
3. Inputs are not transmitted off-device.
4. No revenue is counted until a real payment is independently verified.
5. Next investment decision requires actual demand evidence; search popularity and a successful build are not demand evidence.

## Payment constraint
The operator is in Iran and currently has only a crypto wallet. Do not integrate a third-party crypto processor that excludes Iran. CoinGate and BitPay publicly list Iran as unsupported/restricted. A direct wallet payment option should not be deployed until a wallet address is provided and lawful/operational receipt, network, confirmations, refund policy, and buyer trust are addressed. No account-country misrepresentation.
