# MCPGuard Lite

A local heuristic scanner for MCP and AI-agent JSON configuration files.

## Checks
- Embedded credential-like values
- Shell execution and remote-download indicators
- Broad/wildcard access hints
- Plain HTTP endpoints
- Environment-variable exposure patterns
- Unpinned package hints

## Limits
This is not a full security audit, malware scanner, policy engine or guarantee of safety. Pattern matching can miss risks and produce false positives. Scan locally and never paste production secrets into online tools.

## Run
Open `index.html` in a modern browser. No build step or dependencies.
