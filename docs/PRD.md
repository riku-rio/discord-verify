# Discord Verify — Product Requirements Document

> **File:** `docs/PRD.md`
> **Project:** `discord-verify`
> **Repository:** `discord-verify`
> **CLI executable:** `discord-verify`
> **Agent guide:** `DISCORD_VERIFY.md`
> **Status:** Draft for implementation
> **Version:** 0.1.0
> **License:** MIT
> **Primary interface:** Command-line interface
> **Initial framework support:** `discord.js v14` and `discord.py 2.x`

---

## 1. Executive Summary

Discord Verify is a CLI-first verification framework for Discord bots.

Its purpose is to give developers, coding agents, and CI systems a reliable way to verify Discord bot functionality after implementation without depending entirely on repetitive human testing inside the Discord client.

The tool completes the missing verification step in the common agentic software-development workflow:

1. Plan
2. Implement
3. Verify
4. Review

Discord Verify allows the same verification capabilities to be used by:

* A human developer through an interactive CLI.
* An AI coding agent through non-interactive CLI commands.
* A CI system through deterministic commands, exit codes, and JSON output.

The first release supports:

* `discord.js v14`
* `discord.py 2.x`

Discord Verify tests the project’s own bot, using the project’s existing bot token, client configuration, handlers, database, and test Discord guild.

It does not create or depend on a separate control bot.

It does not automate a Discord user account.

It does not use self-bots, user tokens, or Discord client UI automation.

Discord Verify invokes the project’s real handlers through framework adapters, captures responses and side effects, optionally verifies live Discord API state, and produces structured evidence describing what passed, what failed, and what still requires manual testing.

---

## 2. Product Vision

Discord bot development should have a verification experience comparable to modern web development.

A web-focused coding agent can:

* Start an application.
* Open a browser.
* Interact with the interface.
* Inspect the result.
* Detect runtime errors.
* Modify the implementation.
* Repeat until the behavior is correct.

Discord bot development currently lacks an equivalent reusable verification layer.

Agents can write commands, buttons, events, modals, and menus, but they often cannot verify the result without asking a person to manually open Discord and test every interaction.

Discord Verify aims to close that gap.

The long-term vision is:

> Any developer or coding agent should be able to inspect, execute, verify, and review Discord bot behavior through one predictable CLI contract, regardless of whether the bot is implemented with JavaScript, TypeScript, or Python.

---

## 3. Problem Statement

Discord bots expose behavior through interaction types that are difficult to test automatically using Discord’s public API alone.

Examples include:

* Slash commands.
* Prefix commands.
* User and message context-menu commands.
* Autocomplete handlers.
* Buttons.
* Select menus.
* Modal creation.
* Modal submission.
* Gateway events.
* Deferred replies.
* Follow-up responses.
* Ephemeral responses.
* Permission-sensitive behavior.
* Database side effects.
* Discord API side effects.

A Discord bot cannot officially invoke its own slash command as if it were a human user.

A bot also cannot officially press its own button, submit its own modal, or generate every possible user-originated interaction through the public Discord API.

As a result, developers commonly rely on:

* Manual testing.
* Project-specific mocks.
* Inconsistent test helpers.
* Direct handler invocation without standardized evidence.
* Incomplete unit tests that do not represent the actual project runtime.
* Agents implementing code without being able to verify it.

Existing testing approaches are often tightly coupled to one project structure and cannot be reused by another Discord bot.

Discord Verify provides a standardized adapter-based verification layer that sits between the CLI and the project’s real application code.

---

## 4. Product Goals

### 4.1 Primary Goals

Discord Verify must:

1. Provide a complete CLI workflow for verifying Discord bot features.
2. Support both human developers and coding agents through the same core functionality.
3. Support interactive and non-interactive execution.
4. Support `discord.js v14` and `discord.py 2.x` in the first release.
5. Use the project’s own Discord bot and configuration.
6. Invoke the project’s real handlers rather than duplicating business logic.
7. Capture interaction responses, errors, logs, and side effects.
8. Verify live Discord state when a test requires it.
9. Produce deterministic machine-readable JSON.
10. Produce readable terminal output for humans.
11. Protect Discord tokens and other secrets from agents, logs, reports, and persistent storage.
12. Restrict live operations to an explicitly configured test guild.
13. Generate an agent-readable `DISCORD_VERIFY.md` guide inside initialized projects.
14. Work across Windows, Linux, and macOS.
15. Be installable and executable through npm and `npx`.

### 4.2 Secondary Goals

Discord Verify should:

1. Detect common Discord bot project structures automatically.
2. Generate minimal adapter scaffolding when automatic integration is incomplete.
3. Allow custom adapters for unconventional architectures.
4. Support targeted verification of only recently modified features.
5. Support reusable test scenarios and fixtures.
6. Provide cleanup capabilities for live resources created during testing.
7. Integrate naturally with local coding agents and CI systems.
8. Minimize required changes to the target bot project.
9. Provide stable schemas that external tools can consume.
10. Clearly distinguish simulated, handler-level, hybrid, and live verification.

---

## 5. Non-Goals

The first release will not:

1. Automate a normal Discord user account.
2. Accept or use Discord user tokens.
3. implement self-bot behavior.
4. Automate the Discord desktop or web client.
5. Pretend that simulated interactions are full UI-level end-to-end tests.
6. Provide a hosted SaaS platform.
7. Require an MCP server.
8. Provide dedicated integrations for every coding agent.
9. Support every Discord framework in the first release.
10. Guarantee automatic integration with every custom project architecture.
11. Automatically understand arbitrary application business logic.
12. Replace project-specific unit tests.
13. Replace security reviews.
14. Perform production load testing.
15. Execute destructive operations against production guilds.
16. Test voice and audio pipelines in the first release.
17. Validate visual appearance inside the official Discord client.
18. Expose project secrets to the invoking agent.
19. Store Discord tokens in a Discord Verify database.
20. provide full database introspection without explicit project hooks.

---

## 6. Product Principles

### 6.1 CLI First

The CLI is the primary and complete product interface.

No essential verification capability may require:

* MCP.
* An IDE extension.
* A hosted service.
* A proprietary agent integration.
* A graphical application.

### 6.2 One Core, Multiple Consumers

Human mode, agent mode, and CI mode must use the same internal verification engine.

Interactive prompts are only an input layer.

JSON output is only a presentation layer.

They must not implement separate verification logic.

### 6.3 Agent-Compatible by Default

Every operation available interactively must also be available through explicit non-interactive flags.

No verification workflow may require a human prompt when `--non-interactive` is enabled.

### 6.4 Honest Verification

Every result must identify the verification level used.

Discord Verify must not describe a simulated interaction as a full live Discord UI test.

### 6.5 Real Project Code

Adapters must invoke the target project’s actual:

* Routers.
* Command handlers.
* Component handlers.
* Event handlers.
* Services.
* Discord client.
* Database integrations.

The tool must avoid reimplementing application behavior.

### 6.6 Secrets Never Become Agent Context

Agents may know that a token exists and is configured.

Agents must never receive the token value.

### 6.7 Safe by Default

Live actions must be restricted to a configured test guild.

Destructive operations must require explicit authorization.

### 6.8 Stable Machine Contract

Structured output, exit codes, result types, and error codes are public product contracts.

Changes to these contracts must follow versioning rules.

### 6.9 Adapter-Based Extensibility

Framework-specific behavior must remain behind a shared adapter contract.

The core CLI must not depend directly on project-specific handler implementations.

### 6.10 Minimal Project Intrusion

Discord Verify should make the smallest reasonable changes to the target project.

Generated integration code should be:

* Small.
* Explicit.
* Reviewable.
* Removable.
* Version-controlled when appropriate.

---

## 7. Target Users

### 7.1 Discord Bot Developer

A developer building or maintaining a Discord bot who wants to verify commands and interactions without repeatedly testing every path manually.

### 7.2 AI Coding Agent

An agent such as Pi, Codex, OpenCode, Claude Code, Cursor, or another terminal-capable coding agent that needs a reliable verification step after editing a Discord bot.

### 7.3 Maintainer

A repository maintainer reviewing contributions who needs evidence that a Discord feature works.

### 7.4 CI System

A continuous-integration system that runs deterministic Discord verification scenarios and fails builds when required behavior does not pass.

### 7.5 Framework or Template Author

A developer maintaining a Discord bot starter template who wants built-in verification support.

---

## 8. Core User Stories

### 8.1 Human Developer

As a Discord bot developer, I want to run:

```powershell
discord-verify test
```

and interactively select a command or interaction so that I can verify behavior without remembering every CLI option.

### 8.2 Coding Agent

As a coding agent, I want to run:

```powershell
discord-verify verify --changed --json --non-interactive
```

so that I can verify my implementation, parse the result, fix failures, and repeat.

### 8.3 Slash Command Verification

As a developer, I want to invoke a project slash-command handler using realistic command options and member permissions so that I can verify its reply and side effects.

### 8.4 Button Verification

As a developer, I want to verify that a command creates the correct button and that the button handler produces the expected result.

### 8.5 Modal Verification

As a developer, I want to verify both modal construction and modal submission using controlled field values.

### 8.6 Event Verification

As a developer, I want to invoke an event handler with a fixture or trigger a supported live Discord event and inspect the resulting behavior.

### 8.7 Secret Protection

As a repository owner, I want agents to run the test suite without reading or printing my Discord bot token.

### 8.8 Custom Project Structure

As a developer with a custom command architecture, I want to provide a small adapter file instead of rewriting my project around Discord Verify.

### 8.9 CI Verification

As a maintainer, I want stable exit codes and JSON reports so CI can detect verification failure without parsing human-formatted terminal text.

---

## 9. Product Scope

### 9.1 Supported Frameworks in Version 1

#### JavaScript and TypeScript

* `discord.js v14`
* CommonJS projects.
* ECMAScript module projects.
* JavaScript projects.
* TypeScript projects.
* Common command-loader patterns.
* Common event-loader patterns.
* Custom adapter fallback.

#### Python

* `discord.py 2.x`
* Standard commands extension.
* Application commands.
* Cogs.
* Views.
* Modals.
* UI components.
* Common bot startup patterns.
* Custom adapter fallback.

### 9.2 Supported Interaction Types

Version 1 must support:

* Slash commands.
* Slash-command groups and subcommands.
* Prefix commands.
* User context-menu commands.
* Message context-menu commands.
* Autocomplete interactions.
* Buttons.
* String select menus.
* User select menus.
* Role select menus.
* Channel select menus.
* Mentionable select menus.
* Modal creation.
* Modal submission.
* Gateway event handlers.
* Command errors.
* Global application errors.
* Deferred responses.
* Edited replies.
* Follow-up responses.
* Ephemeral responses.
* Attachments and generated files.
* Embeds.
* Message components.

### 9.3 Supported Verification Targets

Discord Verify must be able to inspect or assert:

* Interaction response content.
* Message content.
* Embed properties.
* Component trees.
* Modal properties.
* Modal field values.
* Files and attachment metadata.
* Deferred state.
* Ephemeral state.
* Follow-up responses.
* Handler exceptions.
* Console output.
* Structured logs.
* Discord REST operations.
* Created, updated, or deleted Discord resources.
* Role changes.
* Member state changes.
* Channel state changes.
* Message state changes.
* Database side effects through project hooks.
* Cache changes through project hooks.
* Execution time.
* Timeout behavior.
* Cleanup behavior.

---

## 10. Verification Levels

Each result must include one of the following verification levels.

### 10.1 `HANDLER`

The framework adapter invokes the project’s real handler with a controlled framework-compatible test context.

No live Discord API effect is required.

Example:

* Invoking a slash-command callback.
* Capturing `reply()`.
* Inspecting an embed.
* Verifying an error response.

### 10.2 `LIVE_API`

The test performs and verifies an operation against Discord’s API inside the configured test guild.

Example:

* Fetching the guild.
* Fetching a channel.
* Verifying a created role.
* Confirming a sent message exists.

### 10.3 `HYBRID`

The test uses a controlled interaction or event input but executes real project code and allows real Discord API or database side effects.

Example:

* Simulating a slash-command interaction.
* Running the real command handler.
* Allowing the project to assign a real role in the test guild.
* Verifying that role assignment through Discord’s API.

### 10.4 `SIMULATED`

The adapter simulates framework objects or events without performing live Discord operations.

This classification should be used when a handler cannot safely or meaningfully use live state.

### 10.5 `MANUAL_REQUIRED`

The behavior cannot be fully verified through the supported legal and technical interfaces.

Examples may include:

* Visual appearance inside a specific Discord client.
* Client-only interaction behavior.
* Human usability judgment.
* Unsupported voice behavior.
* Discord behavior that requires a real user interaction and cannot be represented reliably by the adapter.

### 10.6 Verification Honesty Requirement

Every test result must include:

```json
{
  "verificationLevel": "HYBRID",
  "limitations": [
    "The slash interaction was generated by the adapter rather than the Discord client."
  ]
}
```

A successful result must never hide material verification limitations.

---

## 11. High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       Discord Verify CLI                    │
├─────────────────────────────────────────────────────────────┤
│ Interactive UX │ Non-Interactive UX │ JSON Output │ Reports │
├─────────────────────────────────────────────────────────────┤
│                     Verification Core                       │
│                                                             │
│ Discovery │ Scenarios │ Assertions │ Sessions │ Cleanup     │
│ Security  │ Redaction │ Diagnostics │ Result Schemas        │
├─────────────────────────────────────────────────────────────┤
│                     Adapter Protocol                        │
│                   JSON Lines over stdio                     │
├──────────────────────────┬──────────────────────────────────┤
│ discord.js Adapter       │ discord.py Adapter               │
│ Node.js worker           │ Python worker                    │
├──────────────────────────┴──────────────────────────────────┤
│                    Target Bot Project                       │
│ Handlers │ Routers │ Services │ Discord Client │ Database   │
├─────────────────────────────────────────────────────────────┤
│ Discord Test Guild │ Discord API │ Project Test Database    │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. Architectural Decisions

### 12.1 Core Language

The primary CLI and verification core will be implemented in TypeScript.

Reasons:

* Straightforward npm distribution.
* Easy execution through `npx`.
* Native compatibility with `discord.js` projects.
* Strong type support for result schemas and adapter contracts.
* Cross-platform Node.js support.
* Familiar environment for many Discord bot developers.

### 12.2 Process Isolation

Framework adapters should run in isolated worker processes.

The core CLI must not directly import arbitrary target-project code into its own process.

This applies to both supported frameworks.

#### `discord.js`

The CLI starts a Node.js adapter worker.

#### `discord.py`

The CLI starts a Python adapter worker using the project’s configured Python interpreter.

Benefits:

* Unified adapter protocol.
* Cleaner failure isolation.
* Easier timeout enforcement.
* Reduced module-system conflicts.
* Better support for project-specific dependencies.
* Framework-neutral core behavior.
* Safer stdout and stderr control.
* Easier future adapter support.

### 12.3 Adapter Communication

The CLI and adapter workers communicate using JSON Lines over standard input and standard output.

Each line is one JSON object.

Example request:

```json
{
  "id": "req_01",
  "method": "invoke_slash_command",
  "params": {
    "command": "ping",
    "options": {}
  }
}
```

Example response:

```json
{
  "id": "req_01",
  "ok": true,
  "result": {
    "responses": [
      {
        "type": "reply",
        "content": "Pong!"
      }
    ]
  }
}
```

Adapter diagnostics must be written to standard error, not standard output.

### 12.4 Same Bot, Same Project

Discord Verify uses the target project’s:

* Bot token.
* Client ID.
* Application ID.
* Command handlers.
* Event handlers.
* Discord client.
* Services.
* Data access layer.
* Test database configuration.

Discord Verify does not create a second Discord bot for test orchestration.

### 12.5 No Mandatory Hosted Component

Version 1 must operate entirely on the user’s machine or CI runner.

No Discord Verify cloud account or hosted server is required.

### 12.6 No Mandatory MCP

Version 1 does not include an MCP server.

Any terminal-capable agent can use the CLI.

An optional MCP wrapper may be considered later, but it must call the same core API and must not become required for full functionality.

---

## 13. CLI Design

### 13.1 Primary Commands

The first release must expose the following command groups:

```text
discord-verify
discord-verify init
discord-verify doctor
discord-verify discover
discord-verify list
discord-verify start
discord-verify stop
discord-verify test
discord-verify verify
discord-verify scenario
discord-verify report
discord-verify cleanup
discord-verify config
discord-verify instructions
discord-verify version
```

### 13.2 Root Command

Running the command without arguments:

```powershell
discord-verify
```

must start an interactive experience when the terminal is interactive.

The root experience should offer:

* Initialize project.
* Run diagnostics.
* Discover bot features.
* Test one feature.
* Run verification suite.
* View previous report.
* Clean test resources.
* Exit.

When the terminal is not interactive, the root command must fail with a structured usage error instead of waiting for input.

### 13.3 Initialization

```powershell
discord-verify init
```

Responsibilities:

1. Detect project language.
2. Detect Discord framework.
3. Detect framework version.
4. Inspect package metadata.
5. Detect likely bot entry point.
6. Detect common command and event structures.
7. Detect environment variable names without revealing values.
8. Detect project start commands.
9. Propose adapter integration.
10. Preview generated files.
11. Generate configuration after confirmation.
12. Generate `DISCORD_VERIFY.md`.
13. Generate sample fixtures and scenarios.
14. Update ignore files where appropriate.
15. Run `doctor` after setup.

Required flags:

```text
--dry-run
--yes
--non-interactive
--framework
--language
--adapter
--force
--json
--no-color
```

`--dry-run` must produce a complete plan without modifying files.

In non-interactive mode, missing required information must produce an error that identifies the required flag or configuration field.

### 13.4 Diagnostics

```powershell
discord-verify doctor
```

The doctor command must validate:

* Supported runtime availability.
* Node.js availability.
* Python availability when required.
* Package-manager availability.
* Project framework detection.
* Framework version.
* Bot entry point.
* Adapter availability.
* Adapter protocol compatibility.
* Environment configuration.
* Token presence without exposing its value.
* Client ID presence.
* Test guild ID presence.
* Test channel configuration when required.
* Bot access to the test guild.
* Required Discord intents.
* Required Discord permissions.
* Project start command.
* Database test-mode configuration.
* Report directory permissions.
* Temporary directory permissions.
* Secret-redaction configuration.
* Project guide presence.
* Configuration schema version.

Example human output:

```text
Discord Verify Doctor

PASS  Project framework: discord.js v14
PASS  Adapter: built-in discord.js adapter
PASS  Bot token: configured
PASS  Test guild: accessible
WARN  Test channel is not configured
PASS  Project start command: npm run dev
FAIL  Database environment appears to target production
```

Example agent invocation:

```powershell
discord-verify doctor --json --non-interactive
```

### 13.5 Discovery

```powershell
discord-verify discover
```

The command must discover:

* Slash commands.
* Prefix commands.
* Context-menu commands.
* Autocomplete handlers.
* Buttons.
* Select menus.
* Modals.
* Events.
* Error handlers.
* Command groups.
* Subcommands.
* Permission requirements.
* Required intents when detectable.
* Fixture requirements.
* Unsupported or ambiguous handlers.

The discovery result must include confidence information.

Example:

```json
{
  "schemaVersion": "1.0",
  "framework": "discord.js",
  "features": [
    {
      "id": "slash:moderation:ban",
      "type": "slash_command",
      "name": "ban",
      "group": "moderation",
      "source": "src/commands/moderation/ban.ts",
      "confidence": "high",
      "adapterSupport": "automatic"
    }
  ]
}
```

### 13.6 Listing Features

```powershell
discord-verify list
```

Supported filters:

```text
--type
--name
--tag
--source
--supported
--unsupported
--json
```

### 13.7 Starting the Bot

```powershell
discord-verify start
```

The command must support:

* Project-defined start command.
* Framework adapter start mode.
* Environment override profile.
* Test-mode environment variables.
* Readiness timeout.
* Readiness detection.
* Structured process state.
* Log capture.
* Existing-process detection.
* Graceful shutdown registration.

Required behavior:

* The token value must never be printed.
* The child process must receive only necessary environment variables when restricted mode is enabled.
* The command must fail if the configured guild appears to be disallowed.
* The process ID may be stored in temporary session state.
* The session state must not contain secrets.

### 13.8 Stopping the Bot

```powershell
discord-verify stop
```

The command must:

* Ask the adapter to close the Discord client.
* Allow the project to release database connections.
* Wait for graceful shutdown.
* Force termination after a configurable timeout.
* Remove temporary process metadata.
* Preserve reports.
* Attempt cleanup when configured.

### 13.9 Feature Testing

Primary syntax:

```powershell
discord-verify test <type> <target>
```

Examples:

```powershell
discord-verify test slash ping
discord-verify test slash moderation ban
discord-verify test prefix help
discord-verify test context user-info
discord-verify test autocomplete search
discord-verify test button confirm-delete
discord-verify test select ticket-category
discord-verify test modal ticket-create
discord-verify test event guildMemberAdd
```

Supported types:

```text
slash
prefix
context
autocomplete
button
select
modal
event
scenario
```

Common flags:

```text
--fixture
--set
--user
--member
--channel
--guild
--permissions
--expect
--timeout
--verification-level
--live
--no-live
--cleanup
--retain
--json
--non-interactive
--no-color
--report
--trace
```

### 13.10 Full Verification

```powershell
discord-verify verify
```

Supported modes:

```text
--all
--changed
--tag
--type
--scenario
--required
```

Responsibilities:

1. Run doctor checks required for the selected tests.
2. Discover current project features.
3. Resolve applicable scenarios.
4. Start required workers.
5. Start the bot when required.
6. Execute tests.
7. Capture evidence.
8. Execute assertions.
9. Track created resources.
10. Perform cleanup.
11. Generate reports.
12. Return an appropriate exit code.

### 13.11 Scenario Management

```powershell
discord-verify scenario list
discord-verify scenario run <name>
discord-verify scenario validate <name>
discord-verify scenario create <name>
```

Scenarios are reusable verification definitions stored in:

```text
.discord-verify/scenarios/
```

### 13.12 Reports

```powershell
discord-verify report
discord-verify report list
discord-verify report show <session>
discord-verify report export <session>
```

Supported formats:

* Human terminal summary.
* JSON.
* Markdown.
* JUnit XML for CI.
* Optional HTML in a later release.

### 13.13 Cleanup

```powershell
discord-verify cleanup
```

Cleanup must support:

```text
--session
--all
--dry-run
--force
--json
--non-interactive
```

Cleanup may remove only resources recorded in the session resource ledger unless the user explicitly provides a targeted resource.

---

## 14. Interactive and Non-Interactive Modes

### 14.1 Interactive Mode

Interactive mode is designed for humans.

It may:

* Prompt for missing values.
* Offer searchable command lists.
* Show confirmation screens.
* Display progress indicators.
* Ask whether to retain test resources.
* Suggest fixtures.
* Present readable diffs between expected and actual results.

Interactive behavior is allowed only when:

* Standard input is a terminal.
* `--non-interactive` is not enabled.
* `--json` is not enabled.

### 14.2 Non-Interactive Mode

Non-interactive mode is designed for agents and CI.

Enabled using:

```text
--non-interactive
```

Requirements:

1. Never prompt.
2. Never wait for user input.
3. Fail clearly when required data is missing.
4. Provide actionable structured errors.
5. Use stable exit codes.
6. Support complete configuration through flags, files, and environment mappings.
7. Avoid animated output.
8. Avoid progress spinners.
9. Respect timeout settings.
10. Never ask for confirmation.

### 14.3 JSON Mode

Enabled using:

```text
--json
```

Requirements:

* Standard output must contain valid JSON only.
* No banner may be printed to standard output.
* No progress message may be printed to standard output.
* Diagnostics and logs must use standard error.
* ANSI styling must be disabled.
* Result schema version must be included.
* Secret values must be redacted.
* Stack traces must be omitted unless explicitly enabled.
* Partial results should be returned when possible.

Recommended agent invocation:

```powershell
discord-verify verify --changed --json --non-interactive --no-color
```

---

## 15. Agent Guide

### 15.1 Generated File

Initialization must create:

```text
DISCORD_VERIFY.md
```

at the target project root.

### 15.2 Purpose

The file teaches any repository-aware coding agent how to use Discord Verify without requiring:

* MCP configuration.
* Agent-specific plugins.
* IDE configuration.
* External documentation discovery.
* Human explanation.

### 15.3 Required Contents

`DISCORD_VERIFY.md` must include:

1. A short description of Discord Verify.
2. When the agent must run verification.
3. The required verification workflow.
4. Safe non-interactive commands.
5. Project-specific framework information.
6. Configured adapter information.
7. Project-specific test commands.
8. Environment-variable names without secret values.
9. Fixture locations.
10. Scenario locations.
11. Exit-code meanings.
12. JSON result interpretation.
13. Cleanup requirements.
14. Secret-handling rules.
15. Test-guild restrictions.
16. Prohibited behavior.
17. Manual-verification limitations.
18. A retry and repair workflow.
19. Commands for changed-feature verification.
20. Commands for full verification before completion.

### 15.4 Required Agent Workflow

The generated guide must instruct agents to:

1. Read `DISCORD_VERIFY.md`.
2. Run doctor diagnostics.
3. Discover supported features.
4. Implement or modify the requested behavior.
5. Run targeted verification.
6. Inspect structured failures.
7. Fix the implementation.
8. Re-run targeted verification.
9. Run affected or changed verification.
10. Run cleanup.
11. Summarize evidence during review.

### 15.5 Agent Safety Rules

The file must explicitly tell agents:

* Do not print environment files.
* Do not request the Discord token.
* Do not pass tokens as CLI arguments.
* Do not modify the test-guild restriction.
* Do not use production guild IDs.
* Do not enable destructive mode unless required and authorized.
* Do not claim manual-only behavior was automatically verified.
* Do not skip cleanup when resources were created.
* Do not use interactive mode.
* Do not parse human terminal output when JSON is available.

---

## 16. Project Initialization Output

A typical initialized project should contain:

```text
project/
├── DISCORD_VERIFY.md
├── .discord-verify/
│   ├── config.json
│   ├── adapter/
│   │   ├── index.ts
│   │   └── README.md
│   ├── fixtures/
│   │   ├── users/
│   │   ├── members/
│   │   ├── commands/
│   │   ├── components/
│   │   └── events/
│   ├── scenarios/
│   │   └── smoke.json
│   ├── reports/
│   ├── sessions/
│   └── README.md
└── ...
```

The adapter directory may be omitted when the built-in adapter can integrate without project-specific code.

Generated reports and session files should be ignored by version control by default.

Fixtures, scenarios, configuration, and custom adapters should be version-controlled unless the user chooses otherwise.

---

## 17. Configuration

### 17.1 Configuration File

Primary configuration path:

```text
.discord-verify/config.json
```

Example:

```json
{
  "$schema": "https://discord-verify.dev/schemas/config-v1.json",
  "schemaVersion": 1,
  "project": {
    "framework": "discord.js",
    "language": "typescript",
    "root": ".",
    "entryPoint": "src/index.ts",
    "startCommand": "npm run dev"
  },
  "adapter": {
    "type": "built-in",
    "name": "discord.js-v14"
  },
  "environment": {
    "files": [
      ".env.test",
      ".env"
    ],
    "variables": {
      "token": "DISCORD_TOKEN",
      "clientId": "DISCORD_CLIENT_ID",
      "testGuildId": "DISCORD_TEST_GUILD_ID",
      "testChannelId": "DISCORD_TEST_CHANNEL_ID"
    }
  },
  "safety": {
    "requireTestGuild": true,
    "allowedGuildIds": [
      "${DISCORD_TEST_GUILD_ID}"
    ],
    "allowDestructiveActions": false,
    "cleanupAfterRun": true
  },
  "output": {
    "reportsDirectory": ".discord-verify/reports",
    "defaultFormat": "human"
  }
}
```

### 17.2 Environment Variable Mapping

Discord Verify must not require projects to rename existing variables.

Configuration maps semantic fields to project variable names.

Example:

```json
{
  "environment": {
    "variables": {
      "token": "BOT_TOKEN",
      "clientId": "APPLICATION_ID",
      "testGuildId": "MCP_TESTING_SERVER"
    }
  }
}
```

The name `MCP_TESTING_SERVER` may be used by an existing project even though Discord Verify itself does not require MCP.

### 17.3 Environment Loading Priority

Recommended priority:

1. Explicit process environment.
2. Explicit CLI-selected environment file.
3. Configured test environment file.
4. Configured fallback environment file.
5. Project defaults.

The tool must display which source was used without displaying secret values.

Example:

```json
{
  "token": {
    "configured": true,
    "source": ".env.test",
    "variable": "DISCORD_TOKEN",
    "value": "[REDACTED]"
  }
}
```

### 17.4 Test Profiles

Configuration should support profiles:

```json
{
  "profiles": {
    "local": {
      "environmentFiles": [".env.test"]
    },
    "ci": {
      "environmentFiles": [],
      "requireProcessEnvironment": true
    }
  }
}
```

Usage:

```powershell
discord-verify verify --profile ci
```

---

## 18. Secrets and Security

### 18.1 Secret Storage Policy

Discord Verify must never persist the project’s Discord token.

The token may exist only in:

* The project’s existing secret source.
* The process environment.
* Process memory.
* The target bot process.

The token must not be stored in:

* Discord Verify configuration.
* Session metadata.
* Reports.
* Logs.
* JSON output.
* Adapter messages.
* Generated documentation.
* Telemetry.
* Cache files.
* Temporary fixtures.

### 18.2 Secret Access Model

The CLI may read the token internally.

The invoking agent must receive only metadata such as:

```json
{
  "tokenConfigured": true,
  "tokenSource": "project_environment",
  "tokenVariable": "DISCORD_TOKEN"
}
```

No command should accept the token directly as a normal argument.

Prohibited:

```powershell
discord-verify start --token "secret"
```

Allowed:

```powershell
discord-verify start --profile local
```

### 18.3 Redaction

Discord Verify must redact:

* Discord bot tokens.
* Webhook tokens.
* Authorization headers.
* Database connection strings.
* Known configured secret values.
* Secret-looking environment values.
* Values explicitly marked as secret in configuration.

Redaction must occur before:

* Logging.
* Serialization.
* Report writing.
* Error rendering.
* Adapter-response forwarding.

### 18.4 Memory Limitations

The product must not promise cryptographically guaranteed memory erasure in garbage-collected runtimes.

Documentation should state that Discord Verify:

* Avoids persistent secret storage.
* Minimizes secret lifetime.
* Removes references after use where practical.
* Prevents secrets from entering output channels.

### 18.5 Project Code Trust Boundary

Discord Verify executes target-project code.

The user is responsible for trusting the project being verified.

Discord Verify must warn before executing an untrusted repository.

### 18.6 Test Guild Restriction

Live Discord operations require an explicitly configured test guild.

Before live execution, Discord Verify must:

1. Resolve the configured guild ID.
2. Confirm the bot can access the guild.
3. Confirm the requested operation targets the same guild.
4. Reject cross-guild operations.
5. Record the validated guild ID in the session.
6. Never allow a fixture to override the guild restriction silently.

### 18.7 Optional Guild Marker

Discord Verify should support an optional test-guild marker.

Examples:

* Required guild name suffix.
* Required role.
* Required channel.
* Required configuration value.

Example:

```json
{
  "safety": {
    "guildMarker": {
      "type": "channel",
      "name": "discord-verify-test"
    }
  }
}
```

### 18.8 Destructive Operations

The following operations are considered destructive:

* Deleting channels.
* Deleting roles.
* Kicking members.
* Banning members.
* Bulk-deleting messages.
* Modifying high-level permissions.
* Deleting webhooks.
* Removing persistent project data.
* Resetting database tables.

Destructive operations must be disabled by default.

They require:

* Test-guild validation.
* Explicit scenario declaration.
* Explicit configuration authorization.
* Explicit CLI authorization in interactive mode.
* `--allow-destructive` in non-interactive mode.
* Resource-scoped cleanup information where applicable.

### 18.9 Rate Limits

Discord Verify must respect Discord rate limits.

The tool must:

* Use framework or REST-client rate-limit handling.
* Avoid uncontrolled parallel live operations.
* Surface rate-limit waits in trace output.
* Support test concurrency limits.
* Distinguish rate-limit failure from assertion failure.

---

## 19. Adapter Contract

### 19.1 Required Adapter Capabilities

Each first-party adapter must implement:

```text
initialize
get_capabilities
inspect_project
discover_features
validate_configuration
start_runtime
wait_until_ready
stop_runtime
invoke_slash_command
invoke_prefix_command
invoke_context_menu
invoke_autocomplete
invoke_button
invoke_select_menu
open_modal
submit_modal
emit_event
capture_responses
capture_logs
capture_discord_operations
run_project_hook
reset_state
cleanup
shutdown
```

### 19.2 Capability Negotiation

Adapters must return a capability document.

Example:

```json
{
  "adapter": "discord.js-v14",
  "protocolVersion": "1.0",
  "capabilities": {
    "slashCommands": true,
    "prefixCommands": true,
    "contextMenus": true,
    "autocomplete": true,
    "buttons": true,
    "selectMenus": true,
    "modals": true,
    "events": true,
    "liveDiscordVerification": true,
    "databaseHooks": true
  }
}
```

The CLI must not invoke unsupported capabilities without producing a clear error.

### 19.3 Built-In and Custom Adapters

Adapter modes:

* Built-in automatic adapter.
* Generated project adapter.
* User-authored custom adapter.

A custom adapter must conform to the same protocol.

### 19.4 Adapter Failure Isolation

If an adapter crashes:

* The CLI must capture the exit code.
* Standard error must be preserved with redaction.
* The current test must fail as an adapter error.
* Other independent tests may continue when safe.
* Cleanup must still be attempted.
* The final report must contain partial results.

---

## 20. `discord.js` Adapter Requirements

The `discord.js` adapter must support:

* JavaScript.
* TypeScript.
* CommonJS.
* ECMAScript modules.
* Command collections.
* Dynamic command loaders.
* Event-emitter handlers.
* Interaction routers.
* Direct callback exports.
* Class-based commands where detectable.
* Custom adapter mapping.

The adapter must provide framework-compatible interaction facades for:

* `ChatInputCommandInteraction`
* `ContextMenuCommandInteraction`
* `AutocompleteInteraction`
* `ButtonInteraction`
* Select-menu interactions.
* `ModalSubmitInteraction`
* Prefix-command message contexts.

The adapter must capture calls such as:

* `reply`
* `deferReply`
* `editReply`
* `followUp`
* `deleteReply`
* `showModal`
* `update`
* `deferUpdate`
* Message sends.
* Role changes.
* Channel operations.
* REST operations where observable.

The adapter must avoid depending on private framework internals when a public extension point is available.

---

## 21. `discord.py` Adapter Requirements

The `discord.py` adapter must support:

* Python modules.
* Async handlers.
* Bot subclasses.
* Commands extension.
* Cogs.
* Application commands.
* Command groups.
* Views.
* Buttons.
* Selects.
* Modals.
* Listeners.
* Error handlers.
* Custom adapter mapping.

The adapter must provide compatible test contexts for:

* Application command interactions.
* Prefix command contexts.
* UI component callbacks.
* Modal submissions.
* Event listeners.

The adapter must capture behavior such as:

* `interaction.response.send_message`
* `interaction.response.defer`
* `interaction.response.edit_message`
* `interaction.response.send_modal`
* `interaction.followup.send`
* Context sends.
* Message sends.
* Role changes.
* Channel operations.
* HTTP operations where observable.

The TypeScript CLI must invoke the Python adapter using the project’s configured Python interpreter.

The Python bridge files may be distributed inside the npm package and executed from their installed package path.

A separate global Python package must not be required for the first release unless technically unavoidable.

---

## 22. Project Discovery

### 22.1 Discovery Strategy

Discovery should combine:

* Package metadata.
* Dependency inspection.
* Project configuration.
* Static source analysis.
* Known directory conventions.
* Export inspection.
* Runtime adapter inspection.
* User-provided hints.
* Custom adapter metadata.

### 22.2 Confidence Levels

Every discovered feature must include:

* `high`
* `medium`
* `low`
* `manual`

Low-confidence discoveries must not be executed automatically in destructive or live modes.

### 22.3 Common Conventions

The initial release should detect common structures such as:

```text
src/commands/
src/events/
src/components/
src/buttons/
src/selects/
src/modals/
bot/commands/
cogs/
extensions/
```

Detection must not assume that these paths always exist.

### 22.4 Ambiguity Handling

Interactive mode may ask the user to choose between candidates.

Non-interactive mode must return a structured ambiguity error.

Example:

```json
{
  "error": {
    "code": "DISCOVERY_AMBIGUOUS_ENTRY_POINT",
    "message": "Multiple bot entry points were detected.",
    "candidates": [
      "src/index.ts",
      "src/bot.ts"
    ],
    "resolution": "Set project.entryPoint in .discord-verify/config.json."
  }
}
```

---

## 23. Invocation Model

### 23.1 Canonical Test Context

Discord Verify must define a framework-neutral canonical test context.

Example:

```json
{
  "guild": {
    "id": "123456789012345678"
  },
  "channel": {
    "id": "234567890123456789",
    "type": "text"
  },
  "user": {
    "id": "345678901234567890",
    "username": "test-user",
    "bot": false
  },
  "member": {
    "roles": [],
    "permissions": [
      "SendMessages"
    ]
  },
  "locale": "en-US"
}
```

Adapters convert this canonical context into framework-specific objects.

### 23.2 Real and Synthetic Objects

The adapter may combine:

* Live Discord objects fetched from the test guild.
* Synthetic interaction payloads.
* Framework-compatible response collectors.
* Real project services.
* Real database dependencies.
* Real Discord clients.

The result must identify which parts were live and which parts were synthetic.

### 23.3 Test Identities

Discord Verify must not impersonate a real Discord user through unauthorized means.

Synthetic users are used only as controlled handler context.

If a live Discord operation requires a real member, a configured test member ID may be referenced for read-only or bot-authorized operations.

---

## 24. Fixtures

### 24.1 Fixture Format

Fixtures should use JSON by default.

Example slash-command fixture:

```json
{
  "schemaVersion": 1,
  "type": "slash_command",
  "target": "moderation ban",
  "context": {
    "user": {
      "id": "345678901234567890"
    },
    "member": {
      "permissions": [
        "BanMembers"
      ]
    }
  },
  "options": {
    "target": "456789012345678901",
    "reason": "Automated verification"
  },
  "expect": {
    "response": {
      "contentIncludes": "banned"
    }
  }
}
```

### 24.2 Fixture Composition

Fixtures should support:

* Extending another fixture.
* Environment-variable references.
* Named reusable users.
* Named reusable members.
* Named reusable channels.
* Named reusable roles.
* Generated unique values.
* Session-scoped values.
* Secret references that are never serialized into reports.

### 24.3 Fixture Validation

Fixtures must be validated before project code executes.

Invalid fixtures must produce configuration errors, not handler failures.

---

## 25. Scenarios

### 25.1 Scenario Purpose

Scenarios represent multi-step workflows.

Example:

1. Invoke `/ticket create`.
2. Verify a modal is shown.
3. Submit modal values.
4. Verify a channel is created.
5. Verify an embed is sent.
6. Press the close button.
7. Verify the channel is archived or deleted.
8. Run cleanup.

### 25.2 Scenario Example

```json
{
  "schemaVersion": 1,
  "name": "ticket-create-and-close",
  "tags": [
    "tickets",
    "smoke"
  ],
  "steps": [
    {
      "id": "create",
      "action": "invoke_slash_command",
      "target": "ticket create"
    },
    {
      "id": "assert-modal",
      "action": "assert_modal",
      "from": "create",
      "expect": {
        "customId": "ticket-create"
      }
    },
    {
      "id": "submit",
      "action": "submit_modal",
      "target": "ticket-create",
      "fields": {
        "subject": "Login problem",
        "description": "Unable to sign in"
      }
    },
    {
      "id": "assert-channel",
      "action": "assert_discord_resource",
      "resource": "channel",
      "expect": {
        "nameStartsWith": "ticket-"
      }
    }
  ]
}
```

### 25.3 Scenario Variables

Scenarios must support:

* Step outputs.
* Resource IDs.
* Generated values.
* Environment references.
* Fixture references.
* Conditional cleanup.
* Timeouts.
* Retries for eventually consistent live state.

---

## 26. Assertions

### 26.1 Core Assertions

Version 1 must support assertions for:

* Exact equality.
* Contains.
* Starts with.
* Ends with.
* Regular expression.
* Type.
* Presence.
* Absence.
* Length.
* Numeric comparison.
* Collection membership.
* Partial object matching.
* Ordered steps.
* Unordered collections.
* Execution duration.
* Error type.
* Error message.
* Log presence.
* Discord resource existence.
* Discord resource absence.
* Database hook result.
* Cleanup success.

### 26.2 Discord Response Assertions

Assertions must support:

* Content.
* Embeds.
* Embed titles.
* Embed descriptions.
* Embed fields.
* Embed footers.
* Component rows.
* Button custom IDs.
* Button labels.
* Button styles.
* Button disabled state.
* Select custom IDs.
* Select options.
* Modal custom IDs.
* Modal titles.
* Modal fields.
* Ephemeral state.
* Deferred state.
* Follow-up count.
* Attachment names.
* Attachment content metadata.

### 26.3 Snapshot Assertions

Snapshot support may be included in the first release if it can be implemented without making reports unstable.

Snapshots must normalize:

* Snowflake IDs when configured.
* Timestamps.
* Session-specific paths.
* Generated nonces.
* Unstable ordering.
* Secret values.

---

## 27. Database and External State

### 27.1 Database Hooks

Discord Verify must not attempt to automatically support every database library.

Instead, it provides adapter hooks:

```text
before_test
after_test
snapshot_state
assert_state
reset_state
cleanup_state
```

Projects may implement these hooks in their custom adapter.

### 27.2 Test Database Safety

Doctor diagnostics should detect common production-risk signals such as:

* Missing test environment profile.
* Production-like database hostnames.
* Explicit production flags.
* Same database URL in development and test profiles.
* Missing cleanup hook when database mutation is expected.

The tool must warn or block based on configured safety level.

### 27.3 External Services

External services should be handled through:

* Project-provided fakes.
* Project test environments.
* Adapter hooks.
* Explicit scenario configuration.

Discord Verify does not automatically mock arbitrary external APIs.

---

## 28. Live Discord Verification

### 28.1 Supported Live Checks

Version 1 should support:

* Guild availability.
* Channel existence.
* Message existence.
* Message content.
* Embed content.
* Component metadata.
* Role existence.
* Member-role membership.
* Nickname changes.
* Permission overwrites.
* Thread existence.
* Reaction existence.
* Webhook existence when explicitly enabled.
* Resource deletion.
* Bot identity.
* Command registration state where applicable.

### 28.2 Eventual Consistency

Live assertions must support configurable polling.

Example:

```json
{
  "timeoutMs": 5000,
  "pollIntervalMs": 250
}
```

### 28.3 Resource Ledger

Every resource created during a live test should be recorded.

Example:

```json
{
  "sessionId": "session_01",
  "resources": [
    {
      "type": "channel",
      "id": "123",
      "createdByStep": "create-ticket",
      "cleanup": "delete"
    }
  ]
}
```

The ledger must not contain secrets.

### 28.4 Cleanup Guarantees

Cleanup must be best effort.

If cleanup fails:

* The verification result must indicate failure or warning according to policy.
* The remaining resource must be listed.
* A manual cleanup command must be provided.
* Secret values must remain redacted.

---

## 29. Result Schema

### 29.1 Top-Level Result

All machine-readable commands must return a versioned structure.

Example:

```json
{
  "schemaVersion": "1.0",
  "command": "verify",
  "success": true,
  "sessionId": "session_01",
  "startedAt": "2026-01-01T00:00:00.000Z",
  "completedAt": "2026-01-01T00:00:01.000Z",
  "durationMs": 1000,
  "project": {
    "framework": "discord.js",
    "frameworkVersion": "14.x",
    "adapter": "discord.js-v14"
  },
  "summary": {
    "total": 3,
    "passed": 3,
    "failed": 0,
    "skipped": 0,
    "manualRequired": 0
  },
  "tests": [],
  "warnings": [],
  "errors": [],
  "cleanup": {
    "attempted": true,
    "success": true,
    "remainingResources": []
  }
}
```

### 29.2 Test Result

```json
{
  "id": "slash:ping:default",
  "name": "Slash command /ping",
  "type": "slash_command",
  "target": "ping",
  "status": "passed",
  "verificationLevel": "HYBRID",
  "durationMs": 143,
  "responses": [
    {
      "type": "reply",
      "content": "Pong!",
      "ephemeral": false
    }
  ],
  "assertions": [
    {
      "path": "responses[0].content",
      "operator": "equals",
      "expected": "Pong!",
      "actual": "Pong!",
      "passed": true
    }
  ],
  "sideEffects": [],
  "logs": [],
  "warnings": [],
  "errors": [],
  "limitations": [
    "The interaction was generated by the adapter."
  ]
}
```

### 29.3 Status Values

Allowed test statuses:

```text
passed
failed
skipped
blocked
manual_required
cancelled
timed_out
adapter_error
configuration_error
```

### 29.4 Stable Error Codes

Errors must use stable codes.

Examples:

```text
CONFIG_MISSING
CONFIG_INVALID
FRAMEWORK_UNSUPPORTED
FRAMEWORK_VERSION_UNSUPPORTED
DISCOVERY_FAILED
DISCOVERY_AMBIGUOUS_ENTRY_POINT
ADAPTER_NOT_FOUND
ADAPTER_PROTOCOL_MISMATCH
ADAPTER_CRASHED
BOT_START_FAILED
BOT_READY_TIMEOUT
TOKEN_NOT_CONFIGURED
TEST_GUILD_NOT_CONFIGURED
TEST_GUILD_MISMATCH
TEST_GUILD_UNAVAILABLE
DESTRUCTIVE_ACTION_BLOCKED
FIXTURE_INVALID
SCENARIO_INVALID
HANDLER_NOT_FOUND
HANDLER_EXECUTION_FAILED
ASSERTION_FAILED
LIVE_API_FAILED
RATE_LIMITED
TEST_TIMEOUT
CLEANUP_FAILED
INTERNAL_ERROR
```

---

## 30. Exit Codes

The CLI must use stable exit codes.

```text
0   Command completed successfully.
1   One or more verification tests failed.
2   Invalid command usage or invalid configuration.
3   Project discovery or adapter failure.
4   Bot startup, runtime, or readiness failure.
5   Safety policy blocked execution.
6   Cleanup failed and requires attention.
7   Operation timed out.
8   Internal Discord Verify failure.
130 Execution was interrupted.
```

When multiple failures occur, the most operationally significant exit code should be used, while all failures remain available in JSON.

---

## 31. Reporting

### 31.1 Human Report

The default terminal report must prioritize:

* Pass/fail status.
* Target feature.
* Verification level.
* Response summary.
* Failed assertion details.
* Relevant logs.
* Remaining resources.
* Recommended next action.

Example:

```text
FAIL  Slash command: /ban
Level: HYBRID
Duration: 418ms

Expected:
  Response content includes "banned"

Actual:
  "Missing Permissions"

Evidence:
  Member permissions did not include BanMembers.

Next:
  Update the test fixture or command permission handling.
```

### 31.2 JSON Report

JSON reports must preserve complete structured evidence.

### 31.3 Markdown Report

Markdown reports should be suitable for:

* Pull-request comments.
* Issue attachments.
* Human review.
* Agent summaries.

### 31.4 JUnit Report

JUnit output should map:

* Verification test → test case.
* Assertion failure → failure.
* Adapter or configuration block → error.
* Manual requirement → skipped with explanation.

### 31.5 Report Retention

Default report retention should be configurable.

Reports must never include secret values.

---

## 32. Logging and Tracing

### 32.1 Logging Levels

Supported levels:

```text
silent
error
warn
info
debug
trace
```

### 32.2 Standard Streams

Human mode:

* Normal output: standard output.
* Errors and diagnostics: standard error.

JSON mode:

* JSON result: standard output only.
* Logs and diagnostics: standard error only.

### 32.3 Trace Mode

```powershell
discord-verify verify --trace
```

Trace mode may include:

* Adapter requests.
* Adapter responses.
* Handler resolution.
* Timing.
* Discord API operation metadata.
* Polling attempts.
* Cleanup actions.

Trace mode must still redact secrets.

---

## 33. Runtime and Process Management

### 33.1 Managed Runtime

Discord Verify should support starting and stopping the project bot.

Configuration defines:

* Start command.
* Working directory.
* Readiness pattern or adapter signal.
* Shutdown timeout.
* Required environment profile.

### 33.2 Adapter Runtime

Adapters must signal lifecycle states:

```text
initializing
ready
busy
stopping
stopped
failed
```

### 33.3 Timeouts

Timeouts must exist for:

* Adapter startup.
* Bot startup.
* Handler execution.
* Live Discord polling.
* Scenario steps.
* Cleanup.
* Graceful shutdown.

### 33.4 Orphan Prevention

Discord Verify must attempt to prevent orphan processes by:

* Tracking process identifiers.
* Registering shutdown handlers.
* Handling interrupts.
* Cleaning stale session state.
* Detecting existing managed instances.
* Providing a recovery command.

---

## 34. Cross-Platform Requirements

Version 1 must support:

* Windows.
* Linux.
* macOS.

The tool must:

* Avoid platform-specific shell assumptions.
* Use Node.js process APIs instead of shell parsing where possible.
* Handle Windows paths.
* Handle spaces in paths.
* Detect project-local runtimes.
* Work from PowerShell.
* Work from common Unix shells.
* Avoid requiring Bash-specific scripts.
* Normalize line endings.
* Avoid ANSI output when unsupported or disabled.

---

## 35. Distribution

### 35.1 npm Package

The primary distribution mechanism is npm.

Expected usage:

```powershell
npx discord-verify init
```

Optional installation:

```powershell
npm install --global discord-verify
```

Project-local installation:

```powershell
npm install --save-dev discord-verify
```

### 35.2 Package Contents

The package should include:

* Compiled CLI.
* Core libraries.
* JSON schemas.
* Built-in `discord.js` adapter.
* Python adapter bridge.
* Templates.
* Generated-guide template.
* License.
* Documentation.

### 35.3 Update Behavior

Version 1 should not automatically update itself.

It may display a non-blocking update notice unless disabled.

Agent and CI modes should not emit update notices into JSON output.

---

## 36. Performance Requirements

Targets for a typical local project:

* `discord-verify version`: under 200 ms.
* `discord-verify doctor`: under 3 seconds excluding network checks.
* Static discovery: under 5 seconds for a medium project.
* Adapter startup: under 5 seconds excluding project initialization.
* JSON serialization: under 500 ms for normal reports.
* Cleanup invocation: begin within 1 second after test completion.
* Memory usage should remain reasonable for local developer tooling.

Live Discord verification timing depends on network conditions and Discord availability.

Performance targets are goals, not guarantees for arbitrary project code.

---

## 37. Reliability Requirements

Discord Verify must:

1. Preserve partial results after adapter failure.
2. Attempt cleanup after test failure.
3. Attempt cleanup after interruption.
4. Write reports atomically.
5. Detect corrupted session files.
6. Validate configuration before execution.
7. Validate fixtures before execution.
8. Avoid silently ignoring unsupported features.
9. Avoid claiming success when assertions did not run.
10. Distinguish skipped tests from passed tests.
11. Distinguish configuration failure from implementation failure.
12. Preserve enough evidence to reproduce failures.

---

## 38. Accessibility and Terminal UX

Human-readable output should:

* Not rely on color alone.
* Use clear status labels.
* Support `--no-color`.
* Avoid excessive animation.
* Handle narrow terminals.
* Provide copyable commands.
* Provide concise default output.
* Provide detailed output through flags.
* Use consistent terminology.

---

## 39. Privacy and Telemetry

Version 1 should default to no telemetry.

If telemetry is introduced later, it must be:

* Opt-in.
* Documented.
* Free of source code.
* Free of command inputs.
* Free of Discord IDs unless explicitly aggregated and anonymized.
* Free of tokens and secrets.
* Disableable through configuration and environment variables.

Crash reports must not upload project data automatically.

---

## 40. Compatibility Strategy

### 40.1 Framework Versions

The first release supports:

* `discord.js v14`
* `discord.py 2.x`

Patch and minor compatibility should be validated through automated test projects.

### 40.2 Unsupported Frameworks

Unsupported frameworks must receive a clear result.

Example:

```json
{
  "error": {
    "code": "FRAMEWORK_UNSUPPORTED",
    "message": "Detected py-cord. Version 1 supports discord.py 2.x.",
    "customAdapterSupported": true
  }
}
```

### 40.3 Custom Adapter Path

Users may continue by implementing a custom adapter using the public protocol.

The custom adapter path must be documented but may be considered advanced.

---

## 41. Developer Experience

### 41.1 Initialization Expectations

A typical supported project should reach its first successful verification within ten minutes.

### 41.2 Generated Code Quality

Generated files must:

* Be readable.
* Contain comments only where useful.
* Avoid unnecessary dependencies.
* Match the project module system.
* Match the project language where possible.
* Include a generated-file marker where appropriate.
* Avoid overwriting existing files without confirmation or `--force`.

### 41.3 Dry Run

Every modifying setup command must support:

```text
--dry-run
```

The dry-run result must include:

* Files to create.
* Files to modify.
* Dependencies to add.
* Configuration decisions.
* Detected assumptions.
* Required manual actions.
* Potential risks.

---

## 42. Success Metrics

Initial product success should be measured using:

1. Time from installation to first passing test.
2. Percentage of common projects initialized without a custom adapter.
3. Percentage of discovered handlers with high confidence.
4. Percentage of tests runnable non-interactively.
5. Number of secrets exposed in logs or reports: target zero.
6. Cleanup success rate.
7. Adapter crash rate.
8. JSON schema stability.
9. Percentage of CLI capabilities usable by agents.
10. Reduction in required manual Discord testing.
11. Number of successful CI integrations.
12. User-reported false-positive verification results.

Suggested initial targets:

* At least 90% of CLI capabilities available non-interactively.
* 100% of verification commands support JSON output.
* Zero known secret leaks.
* At least 80% automatic discovery success across supported sample projects.
* At least 95% cleanup success for resources created by Discord Verify scenarios.
* First passing smoke test within ten minutes for supported conventional projects.

---

## 43. Functional Requirements

### FR-001 — CLI Availability

The product must expose the `discord-verify` executable.

### FR-002 — Interactive Human Mode

The CLI must provide an interactive mode for human users.

### FR-003 — Non-Interactive Agent Mode

Every verification capability must be usable without prompts.

### FR-004 — JSON Output

Every read, discovery, diagnostic, test, verification, report, and cleanup command must support JSON output.

### FR-005 — `discord.js` Support

Version 1 must support `discord.js v14`.

### FR-006 — `discord.py` Support

Version 1 must support `discord.py 2.x`.

### FR-007 — Adapter Protocol

Framework adapters must communicate through a stable versioned protocol.

### FR-008 — Slash Commands

The product must discover and invoke slash commands.

### FR-009 — Prefix Commands

The product must discover and invoke prefix commands.

### FR-010 — Context Menus

The product must support user and message context-menu commands.

### FR-011 — Autocomplete

The product must support autocomplete handlers.

### FR-012 — Buttons

The product must inspect and invoke button handlers.

### FR-013 — Select Menus

The product must inspect and invoke supported select-menu handlers.

### FR-014 — Modals

The product must verify modal creation and modal submission.

### FR-015 — Events

The product must invoke event handlers using fixtures and support selected live event verification.

### FR-016 — Response Capture

The product must capture initial replies, deferred replies, edited replies, follow-ups, updates, and modal responses.

### FR-017 — Discord Side Effects

The product must capture and verify supported live Discord side effects.

### FR-018 — Database Hooks

The product must provide project-defined hooks for database assertions and cleanup.

### FR-019 — Test Guild Lock

Live operations must be restricted to configured guild IDs.

### FR-020 — Secret Protection

Secrets must never appear in persistent output or agent-visible structured results.

### FR-021 — Resource Ledger

Live resources created during verification must be tracked.

### FR-022 — Cleanup

The product must provide automatic and manual cleanup.

### FR-023 — Reports

The product must generate human, JSON, Markdown, and JUnit reports.

### FR-024 — Exit Codes

The product must use stable documented exit codes.

### FR-025 — Generated Agent Guide

Initialization must generate `DISCORD_VERIFY.md`.

### FR-026 — Dry Run

Initialization and destructive cleanup planning must support dry-run mode.

### FR-027 — Discovery Confidence

Discovered features must include confidence and support metadata.

### FR-028 — Custom Adapters

The product must expose a documented custom adapter contract.

### FR-029 — Cross-Platform Support

The product must support Windows, Linux, and macOS.

### FR-030 — Partial Results

The product must preserve partial results after recoverable failures.

### FR-031 — Verification-Level Classification

Every test must report its verification level and limitations.

### FR-032 — Scenario Support

The product must support reusable multi-step scenarios.

### FR-033 — Fixture Support

The product must support reusable fixtures.

### FR-034 — Project Runtime Management

The product must support managed project start, readiness, and shutdown.

### FR-035 — Traceability

Reports must identify source files and discovered handlers when available.

---

## 44. Non-Functional Requirements

### NFR-001 — Security

The product must not persist secrets.

### NFR-002 — Determinism

Non-interactive commands must provide stable machine contracts.

### NFR-003 — Reliability

Test failures must not prevent cleanup attempts.

### NFR-004 — Maintainability

Framework-specific logic must remain inside adapters.

### NFR-005 — Extensibility

New framework adapters must be addable without rewriting the CLI core.

### NFR-006 — Performance

Local diagnostics and discovery must complete within reasonable developer-tooling expectations.

### NFR-007 — Portability

The tool must avoid platform-specific shell dependencies.

### NFR-008 — Observability

Failures must include actionable diagnostics and evidence.

### NFR-009 — Compatibility

Schema and adapter protocol changes must be versioned.

### NFR-010 — Accessibility

Human output must remain understandable without color.

### NFR-011 — Privacy

No source code or project data may be uploaded automatically.

### NFR-012 — Minimal Intrusion

Initialization must minimize changes to the target project.

---

## 45. MVP Acceptance Criteria

The first public release is complete only when all criteria below are satisfied.

### 45.1 Installation

* The package can be installed from npm.
* `npx discord-verify version` works on Windows, Linux, and macOS.
* The package includes both first-party adapters.

### 45.2 Initialization

* `discord-verify init` initializes a conventional `discord.js v14` project.
* `discord-verify init` initializes a conventional `discord.py 2.x` project.
* `--dry-run` performs no modifications.
* `DISCORD_VERIFY.md` is generated.
* `.discord-verify/config.json` is generated.
* Example fixtures and scenarios are generated.
* Existing files are not overwritten silently.

### 45.3 Diagnostics

* Doctor detects missing token configuration.
* Doctor detects missing test-guild configuration.
* Doctor validates adapter compatibility.
* Doctor validates project runtime availability.
* Doctor never displays secret values.

### 45.4 Discovery

* Slash commands are discovered in sample projects.
* Prefix commands are discovered in sample projects.
* Components and modals are discovered where statically possible.
* Events are discovered in sample projects.
* Discovery results include confidence levels.
* Ambiguous discovery returns actionable errors.

### 45.5 Verification

* A `discord.js` slash command can be invoked and its reply asserted.
* A `discord.py` slash command can be invoked and its reply asserted.
* Prefix commands can be invoked for both frameworks.
* Buttons can be invoked for both frameworks.
* Select menus can be invoked for both frameworks.
* Modal creation and submission can be verified for both frameworks.
* Events can be invoked for both frameworks.
* Handler exceptions are captured.
* Deferred and follow-up responses are captured.
* At least one hybrid live Discord side-effect test passes for both frameworks.

### 45.6 Agent Usage

* All verification commands support `--json`.
* All verification commands support `--non-interactive`.
* JSON mode writes valid JSON only to standard output.
* Missing input returns structured errors instead of prompts.
* Exit codes match documentation.
* A terminal-capable coding agent can follow `DISCORD_VERIFY.md` without MCP.

### 45.7 Security

* Token values do not appear in logs.
* Token values do not appear in reports.
* Token values do not appear in adapter messages.
* Token values do not appear in generated documentation.
* Live operations outside the configured guild are blocked.
* Destructive actions are blocked by default.
* Secret-redaction tests pass.

### 45.8 Cleanup

* Created live resources are recorded.
* Automatic cleanup runs after verification.
* Failed cleanup produces a clear report.
* Cleanup can be retried by session ID.

### 45.9 Reporting

* Human summary is readable.
* JSON report validates against its schema.
* Markdown report is generated.
* JUnit report is generated.
* Verification levels and limitations appear in reports.

---

## 46. Reference Verification Workflow

A coding agent should be able to execute the following workflow.

### Step 1 — Inspect Instructions

Read:

```text
DISCORD_VERIFY.md
```

### Step 2 — Run Diagnostics

```powershell
discord-verify doctor --json --non-interactive --no-color
```

### Step 3 — Discover Features

```powershell
discord-verify discover --json --non-interactive --no-color
```

### Step 4 — Implement the Requested Change

The agent modifies the project code.

### Step 5 — Run Targeted Verification

```powershell
discord-verify test slash ping --json --non-interactive --no-color
```

### Step 6 — Inspect Failure Evidence

The agent reads:

* Error code.
* Handler source.
* Actual response.
* Failed assertions.
* Relevant logs.
* Side effects.
* Limitations.

### Step 7 — Fix and Repeat

The agent modifies the implementation and re-runs the same command.

### Step 8 — Verify Affected Features

```powershell
discord-verify verify --changed --json --non-interactive --no-color
```

### Step 9 — Run Cleanup

```powershell
discord-verify cleanup --json --non-interactive --no-color
```

### Step 10 — Review

The agent summarizes:

* What was implemented.
* Which verification commands ran.
* Which tests passed.
* Which tests failed.
* Which behaviors remain manual.
* Whether cleanup succeeded.

---

## 47. Example End-to-End Scenario

### Feature

A `/ticket create` slash command:

1. Shows a modal.
2. Accepts a title and description.
3. Creates a private ticket channel.
4. Sends an embed with a close button.
5. Allows the opener to close the ticket.

### Discord Verify Flow

```powershell
discord-verify scenario run ticket-create-and-close `
  --json `
  --non-interactive `
  --no-color
```

Expected verification:

1. Slash handler is invoked.
2. Modal response is captured.
3. Modal structure is asserted.
4. Modal submission handler is invoked.
5. Real channel creation is allowed in the test guild.
6. Channel state is fetched from Discord.
7. Initial message and embed are verified.
8. Close button handler is invoked.
9. Channel close behavior is verified.
10. Resource cleanup is recorded.
11. Final JSON report is returned.

Result classification:

```text
HYBRID
```

Limitation:

```text
The slash command, modal submission, and button press were generated by the adapter rather than the Discord client.
```

---

## 48. Risks and Mitigations

### Risk 1 — Discord Bot Project Structures Vary Widely

**Impact:** Automatic discovery may fail.

**Mitigation:**

* Confidence scoring.
* Configurable paths.
* Generated adapters.
* Custom adapter protocol.
* Clear ambiguity errors.
* Sample integrations.

### Risk 2 — Framework Objects Are Complex

**Impact:** Synthetic contexts may not behave exactly like live interactions.

**Mitigation:**

* Use minimal framework-compatible facades.
* Load live guild objects where useful.
* Report verification limitations.
* Maintain adapter compatibility suites.
* Prefer public framework behavior.

### Risk 3 — Project Code Has Side Effects During Import

**Impact:** Discovery or adapter initialization may start the bot unexpectedly.

**Mitigation:**

* Use static analysis before runtime inspection.
* Run adapter workers in isolated processes.
* Provide explicit safe-discovery mode.
* Document import-safety requirements.
* Allow custom discovery metadata.

### Risk 4 — Secret Leakage

**Impact:** Bot compromise.

**Mitigation:**

* No token CLI argument.
* Central redaction layer.
* Output tests.
* Minimal environment forwarding.
* No telemetry by default.
* Secret scanning in generated reports.

### Risk 5 — Production Guild or Database Accident

**Impact:** Destructive production changes.

**Mitigation:**

* Mandatory test guild.
* Optional guild marker.
* Destructive mode disabled.
* Test profile checks.
* Database safety warnings.
* Explicit authorization.
* Resource ledger.

### Risk 6 — Adapter and Core Protocol Drift

**Impact:** Broken integrations.

**Mitigation:**

* Versioned protocol.
* Capability negotiation.
* Compatibility tests.
* Clear mismatch errors.

### Risk 7 — Discord API Rate Limits

**Impact:** Slow or failed tests.

**Mitigation:**

* Controlled concurrency.
* Rate-limit awareness.
* Polling policies.
* Retry classification.
* Live-test minimization.

### Risk 8 — Cleanup Failure

**Impact:** Test resources remain in the guild.

**Mitigation:**

* Session ledger.
* Retryable cleanup.
* Best-effort shutdown cleanup.
* Manual cleanup commands.
* Clear remaining-resource reports.

### Risk 9 — Supporting Two Frameworks in Version 1

**Impact:** Larger initial scope.

**Mitigation:**

* Shared canonical model.
* Shared protocol.
* Shared result schemas.
* Framework-specific workers.
* Contract test suite.
* Equivalent sample projects.

### Risk 10 — False Confidence

**Impact:** Users assume all behavior was fully end-to-end tested.

**Mitigation:**

* Required verification levels.
* Required limitations.
* Manual-required status.
* No hidden simulation.
* Evidence-based reporting.

---

## 49. Future Considerations

The following are outside version 1 but should remain architecturally possible:

* Additional Discord frameworks.
* `py-cord`.
* `nextcord`.
* `disnake`.
* Oceanic.js.
* Eris.
* JDA.
* Discord.Net.
* Serenity.
* Voice-state scenario helpers.
* Audio pipeline verification.
* Hosted report viewer.
* Optional MCP wrapper.
* IDE extensions.
* Agent-specific instruction generators.
* Pull-request report publishing.
* GitHub Actions integration package.
* Visual Discord client smoke-testing helper where legally and technically appropriate.
* Distributed test execution.
* Snapshot approval workflows.
* Plugin marketplace.
* Framework-template certifications.
* Test coverage mapping.
* Mutation testing for handlers.
* Performance and rate-limit testing.
* Multi-bot project support.
* Multi-guild test profiles.

---

## 50. Implementation Phases

### Phase 1 — Core CLI Foundation

Deliver:

* CLI executable.
* Configuration loading.
* JSON output contract.
* Exit codes.
* Logging.
* Redaction.
* Session management.
* Report foundation.
* Cross-platform process utilities.

### Phase 2 — Adapter Protocol

Deliver:

* JSON Lines protocol.
* Worker lifecycle.
* Capability negotiation.
* Timeout handling.
* Error isolation.
* Adapter contract test suite.

### Phase 3 — Project Discovery

Deliver:

* Framework detection.
* Runtime detection.
* Environment mapping.
* Entry-point detection.
* Feature discovery.
* Confidence scoring.
* `init`.
* `doctor`.
* `discover`.

### Phase 4 — `discord.js` Adapter

Deliver:

* Slash commands.
* Prefix commands.
* Context menus.
* Autocomplete.
* Buttons.
* Select menus.
* Modals.
* Events.
* Response capture.
* Live Discord verification.

### Phase 5 — `discord.py` Adapter

Deliver feature parity with the `discord.js` adapter for the agreed version-1 contract.

### Phase 6 — Fixtures and Scenarios

Deliver:

* Fixture schemas.
* Scenario engine.
* Variables.
* Multi-step workflows.
* Assertions.
* Cleanup ledger.

### Phase 7 — Agent Experience

Deliver:

* `DISCORD_VERIFY.md`.
* Complete non-interactive support.
* Stable JSON schemas.
* Changed-feature verification.
* Agent-focused error resolutions.

### Phase 8 — Reporting and CI

Deliver:

* Human reports.
* JSON reports.
* Markdown reports.
* JUnit reports.
* CI examples.
* Exit-code validation.

### Phase 9 — Security and Hardening

Deliver:

* Secret-leak tests.
* Guild-lock tests.
* Destructive-operation tests.
* Cleanup interruption tests.
* Cross-platform test matrix.
* Adapter crash recovery.
* Documentation review.

### Phase 10 — Public Release

Deliver:

* npm package.
* Public repository.
* MIT license.
* Contribution guide.
* Security policy.
* Example projects.
* Release notes.
* Versioned schemas.
* Public documentation.

---

## 51. Definition of Done

Discord Verify version 1 is done when:

1. A developer can install it from npm.
2. It initializes both supported framework types.
3. It generates `DISCORD_VERIFY.md`.
4. A terminal-capable agent can use it without MCP.
5. Humans can use the same capabilities interactively.
6. Slash, prefix, context, autocomplete, button, select, modal, and event verification work for both frameworks.
7. Hybrid live Discord verification works in a configured test guild.
8. Test results include evidence and limitations.
9. JSON output is stable and documented.
10. Exit codes are stable and documented.
11. Secrets do not appear in output.
12. Cross-guild live actions are blocked.
13. Destructive actions are blocked by default.
14. Resource cleanup works and can be retried.
15. Reports are available in all required formats.
16. Public sample projects pass their verification suites.
17. Windows, Linux, and macOS test pipelines pass.
18. Documentation is sufficient for a new contributor to continue development.

---

## 52. Locked Product Decisions

The following decisions are considered approved for the initial implementation:

| Decision                     | Selected Option                              |
| ---------------------------- | -------------------------------------------- |
| Product name                 | `discord-verify`                             |
| Repository name              | `discord-verify`                             |
| CLI executable               | `discord-verify`                             |
| Agent guide                  | `DISCORD_VERIFY.md`                          |
| Product interface            | CLI-first                                    |
| MCP in version 1             | No                                           |
| Human usage                  | Interactive CLI                              |
| Agent usage                  | Non-interactive CLI with JSON                |
| CI usage                     | Non-interactive CLI with JSON and exit codes |
| Core language                | TypeScript                                   |
| Distribution                 | npm and `npx`                                |
| Initial JavaScript framework | `discord.js v14`                             |
| Initial Python framework     | `discord.py 2.x`                             |
| Discord bot used             | Target project bot                           |
| Separate control bot         | No                                           |
| User-account automation      | Prohibited                                   |
| Self-bot support             | Prohibited                                   |
| Test guild                   | Required for live operations                 |
| Token persistence            | Prohibited                                   |
| Default telemetry            | Disabled                                     |
| License                      | MIT                                          |
| Supported operating systems  | Windows, Linux, macOS                        |

---

## 53. Glossary

### Adapter

A framework-specific worker that connects Discord Verify to the target project.

### Agent Mode

Non-interactive CLI execution designed for coding agents.

### Canonical Context

A framework-neutral representation of a Discord interaction or event input.

### Cleanup Ledger

A session record of resources created during verification.

### Fixture

Reusable structured input for one test.

### Handler Verification

Invocation of real project code using an adapter-generated context.

### Hybrid Verification

A controlled handler input combined with real project code and live side effects.

### Live Verification

A check performed against Discord’s API in the configured test guild.

### Manual Required

A result indicating that part of the behavior still requires human testing.

### Scenario

A multi-step reusable verification workflow.

### Test Guild

A Discord guild explicitly designated for verification and isolated from production usage.

### Verification Evidence

Structured data showing what executed, what was observed, what was asserted, and what limitations remain.

---

## 54. Final Product Statement

Discord Verify is a CLI-first verification framework that enables humans, coding agents, and CI systems to test Discord bot behavior through one shared and secure interface.

It supports `discord.js v14` and `discord.py 2.x`, invokes the project’s real handlers, protects secrets, restricts live operations to a test guild, captures responses and side effects, generates reusable evidence, and makes the verification phase of agentic Discord bot development practical.

The intended development loop is:

```text
Plan → Implement → Verify → Review
```

Discord Verify owns the verification step.
