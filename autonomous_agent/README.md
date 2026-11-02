# OpenAI Autonomous Agent (Claude-free)

One OpenAI model plans and executes a project task through a bounded local toolset.
There is no Claude or Anthropic dependency.

## Capabilities
- List, read and write UTF-8 files inside the selected workspace.
- Run predefined checks only: pytest, compileall, git status, git diff check and diff stat.
- Store task state, OpenAI conversation ID and timestamped tool audit events in SQLite.
- Resume a task with the same task ID after reaching the step limit.
- Pause when human input is genuinely required.

## Safety
No arbitrary shell, network access, package installation, deployment, publishing, payments,
external messages, account changes, secret-file reading or deletion tools. File access is
workspace-confined; each read/write is limited to 200 KB. Review the Git diff before use.
The model's final report is not a substitute for independently checking evidence.

## Install
Python 3.10+ and an OpenAI API key with API billing enabled are required.

    python -m pip install -r autonomous_agent/requirements.txt

Set OPENAI_API_KEY as an environment variable. Do not commit it.

    export OPENAI_API_KEY="your-key"

Run from repository root:

    python autonomous_agent/agent.py "Add tests for the parser" --workspace .

Resume with the same task text and task ID. If the agent paused for human input, include the answer with --human-note:

    python autonomous_agent/agent.py "Add tests for the parser" --workspace . --task-id task-20261102-120000 --human-note "Use the existing pytest structure"

## Configuration
- OPENAI_MODEL (default gpt-4.1)
- AGENT_MAX_STEPS (default 16)
- AGENT_COMMAND_TIMEOUT (default 90 seconds)

## Cost
Local code and SQLite storage have no hosting fee. OpenAI API usage is billed separately;
it is not free. Keep the step limit low during initial testing.
