# Discord Verify — Implementation Tasks

> **File:** `docs/TASKS.md`
> **Project:** `discord-verify`
> **Source of truth:** `docs/PRD.md`
> **Current target:** Version `1.0.0`
> **Primary interface:** CLI
> **Initial frameworks:** `discord.js v14`, `discord.py 2.x`
> **Core language:** TypeScript
> **Distribution:** npm / `npx`
> **Status:** Ready for implementation

---

## 1. Purpose

This document converts the requirements in `docs/PRD.md` into an executable implementation plan.

It is designed to support:

* Human contributors.
* AI coding agents.
* GitHub Issues.
* Pull-request planning.
* Milestone tracking.
* CI release gates.
* Incremental delivery.
* Parallel work across adapters, core, security, and documentation.

The implementation must preserve the product contract defined in the PRD:

```text
Plan → Implement → Verify → Review
```

Discord Verify owns the verification step.

---

## 2. Delivery Strategy

Development is divided into milestones that produce progressively usable releases.

```text
M0  Repository and engineering foundation
M1  CLI kernel and machine contract
M2  Configuration, security, and sessions
M3  Adapter protocol and worker runtime
M4  Project discovery and initialization
M5  discord.js v14 adapter
M6  discord.py 2.x adapter
M7  Fixtures, assertions, and scenarios
M8  Live Discord verification and cleanup
M9  Reports, agent guide, and CI experience
M10 Hardening, compatibility, and security
M11 Release candidate
M12 Public v1.0.0 release
```

Each milestone must be independently reviewable.

No milestone may bypass required tests, documentation, or security checks.

---

## 3. Status Legend

Use the following task status convention:

```text
[ ] Not started
[-] In progress
[x] Complete
[!] Blocked
[~] Deferred
```

---

## 4. Priority Legend

```text
P0  Release blocker or security-critical
P1  Required for version 1
P2  Important but may move after initial release candidate
P3  Future or optional improvement
```

---

## 5. Task Labels

Recommended GitHub labels:

```text
area:adapter
area:cli
area:config
area:discovery
area:docs
area:fixtures
area:framework-discordjs
area:framework-discordpy
area:live-api
area:process
area:reporting
area:scenario
area:security
area:testing
area:ux

priority:p0
priority:p1
priority:p2
priority:p3

type:architecture
type:bug
type:documentation
type:feature
type:hardening
type:refactor
type:release
type:research
type:test

status:blocked
status:needs-design
status:ready
status:review
```

---

## 6. Engineering Rules

All implementation work must follow these rules.

### 6.1 Core Rules

* [ ] Framework-specific logic must remain outside the core package.
* [ ] CLI human mode and agent mode must call the same internal services.
* [ ] JSON mode must never contain human-formatted output.
* [ ] Secrets must never appear in stdout, stderr, logs, reports, session files, or adapter messages.
* [ ] Live Discord operations must remain locked to configured guilds.
* [ ] Destructive operations must be disabled by default.
* [ ] Adapter workers must execute in isolated processes.
* [ ] Every public schema must include a schema version.
* [ ] Every public error must include a stable error code.
* [ ] Every verification result must include a verification level.
* [ ] Every modifying command must support dry-run where technically meaningful.
* [ ] Every non-interactive command must fail instead of prompting.
* [ ] Windows, Linux, and macOS must be treated as supported platforms.
* [ ] Generated files must be reviewable and minimal.
* [ ] Partial results must be preserved after recoverable failures.
* [ ] Cleanup must be attempted after failed or interrupted verification.

### 6.2 Pull-Request Rules

Every implementation pull request must include:

* [ ] A linked task ID.
* [ ] A concise implementation summary.
* [ ] Tests for new behavior.
* [ ] Documentation updates when public behavior changes.
* [ ] JSON schema updates when output changes.
* [ ] Compatibility notes when adapters change.
* [ ] Security considerations when environment, process, or Discord API behavior changes.
* [ ] No unrelated refactoring.
* [ ] No undocumented public CLI changes.

### 6.3 Definition of Ready

A task is ready when:

* [ ] Its expected behavior is clear.
* [ ] Dependencies are complete or explicitly mocked.
* [ ] Acceptance criteria are measurable.
* [ ] Public contracts are identified.
* [ ] Security impact is understood.
* [ ] Test strategy is defined.

### 6.4 Definition of Done

A task is complete when:

* [ ] Implementation is merged.
* [ ] Unit tests pass.
* [ ] Relevant integration tests pass.
* [ ] Relevant cross-platform tests pass.
* [ ] Documentation is updated.
* [ ] No secret-leak regression is introduced.
* [ ] No unversioned public contract is introduced.
* [ ] Acceptance criteria are satisfied.
* [ ] Follow-up limitations are documented.

---

# Milestone M0 — Repository and Engineering Foundation

## Goal

Create a stable repository, package structure, quality gates, and contributor workflow before product features are implemented.

---

## M0.1 Repository Bootstrap

### DV-0001 — Create repository structure

* **Priority:** P0

* **Dependencies:** None

* [ ] Create the root project structure.

* [ ] Add `packages/`.

* [ ] Add `docs/`.

* [ ] Add `examples/`.

* [ ] Add `schemas/`.

* [ ] Add `scripts/`.

* [ ] Add `.github/`.

* [ ] Add `tests/`.

Proposed structure:

```text
discord-verify/
├── packages/
│   ├── cli/
│   ├── core/
│   ├── adapter-protocol/
│   ├── adapter-discordjs/
│   ├── adapter-discordpy/
│   ├── shared/
│   └── test-kit/
├── examples/
│   ├── discordjs-basic/
│   ├── discordjs-advanced/
│   ├── discordpy-basic/
│   └── discordpy-advanced/
├── schemas/
├── docs/
│   ├── PRD.md
│   └── TASKS.md
├── scripts/
├── tests/
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

**Acceptance criteria**

* [ ] Every workspace package can be discovered by the package manager.
* [ ] Root scripts can build and test all packages.
* [ ] No package contains framework-specific behavior unless explicitly named as an adapter.

---

### DV-0002 — Select package manager and workspace strategy

* **Priority:** P0

* **Dependencies:** DV-0001

* [ ] Select `pnpm` workspaces as the default development package manager.

* [ ] Document npm compatibility for consumers.

* [ ] Add `packageManager` to root `package.json`.

* [ ] Pin the supported package-manager version.

* [ ] Configure workspace package resolution.

**Acceptance criteria**

* [ ] A fresh clone installs with one command.
* [ ] Workspace dependencies resolve without manual linking.
* [ ] Published packages do not require pnpm for consumers.

---

### DV-0003 — Configure TypeScript

* **Priority:** P0

* **Dependencies:** DV-0001

* [ ] Enable strict TypeScript.

* [ ] Configure project references.

* [ ] Configure Node.js target and module settings.

* [ ] Create separate configs for source, tests, and build.

* [ ] Enable declaration output for public packages.

* [ ] Enable source maps.

Required compiler expectations:

```text
strict
noUncheckedIndexedAccess
exactOptionalPropertyTypes
noImplicitOverride
useUnknownInCatchVariables
noFallthroughCasesInSwitch
```

**Acceptance criteria**

* [ ] All TypeScript packages build with zero type errors.
* [ ] Public packages generate declaration files.
* [ ] Test files are excluded from publish output.

---

### DV-0004 — Configure linting and formatting

* **Priority:** P0

* **Dependencies:** DV-0003

* [ ] Configure ESLint.

* [ ] Configure Prettier.

* [ ] Add import ordering rules.

* [ ] Add no-floating-promises rules.

* [ ] Add unsafe-any restrictions.

* [ ] Add command scripts for check and fix.

* [ ] Add Markdown formatting rules where practical.

**Acceptance criteria**

* [ ] CI rejects lint errors.
* [ ] Formatting can be validated without rewriting files.
* [ ] Generated fixtures may be excluded explicitly.

---

### DV-0005 — Configure test framework

* **Priority:** P0

* **Dependencies:** DV-0003

* [ ] Select Vitest for TypeScript unit and integration tests.

* [ ] Configure coverage.

* [ ] Configure test projects per package.

* [ ] Add timeout conventions.

* [ ] Add fixture helpers.

* [ ] Add deterministic temporary-directory helpers.

**Acceptance criteria**

* [ ] Root test command runs all TypeScript tests.
* [ ] Coverage output is generated.
* [ ] Tests run consistently on Windows, Linux, and macOS.

---

### DV-0006 — Configure Python test environment

* **Priority:** P0

* **Dependencies:** DV-0001

* [ ] Add Python bridge source directory.

* [ ] Add `pyproject.toml` for adapter development tests.

* [ ] Configure `pytest`.

* [ ] Configure `ruff`.

* [ ] Configure `mypy`.

* [ ] Define supported Python versions.

* [ ] Add Python virtual-environment instructions.

**Acceptance criteria**

* [ ] Python adapter tests run independently.
* [ ] Static checks run in CI.
* [ ] The npm package can later ship Python bridge files without requiring a separate PyPI package.

---

### DV-0007 — Add license and legal files

* **Priority:** P0

* **Dependencies:** DV-0001

* [ ] Add MIT license.

* [ ] Add copyright notice.

* [ ] Add third-party notices strategy.

* [ ] Add contribution license statement if required.

* [ ] Add legal disclaimer about Discord trademarks.

* [ ] Add legal disclaimer prohibiting self-bots and user tokens.

**Acceptance criteria**

* [ ] Repository license is detected correctly by GitHub.
* [ ] Documentation clearly states that Discord Verify is not affiliated with Discord.

---

### DV-0008 — Add contribution documentation

* **Priority:** P1

* **Dependencies:** DV-0001

* [ ] Add `CONTRIBUTING.md`.

* [ ] Add local setup instructions.

* [ ] Add testing instructions.

* [ ] Add adapter-development instructions.

* [ ] Add public-contract change policy.

* [ ] Add release-process overview.

---

### DV-0009 — Add security policy

* **Priority:** P0

* **Dependencies:** DV-0001

* [ ] Add `SECURITY.md`.

* [ ] Document responsible disclosure.

* [ ] Define secret-leak severity.

* [ ] Define test-guild safety severity.

* [ ] Define unsupported self-bot reports.

* [ ] Define supported release lines.

---

## M0.2 CI Foundation

### DV-0010 — Configure primary CI workflow

* **Priority:** P0

* **Dependencies:** DV-0004, DV-0005, DV-0006

* [ ] Run installation.

* [ ] Run TypeScript type checks.

* [ ] Run lint.

* [ ] Run formatting check.

* [ ] Run TypeScript tests.

* [ ] Run Python tests.

* [ ] Build all packages.

* [ ] Validate package contents.

* [ ] Upload test artifacts on failure.

Matrix:

```text
Windows
Ubuntu
macOS

Node.js current LTS
Node.js previous supported LTS

Python 3.10
Python 3.11
Python 3.12
Python 3.13 where supported
```

**Acceptance criteria**

* [ ] Pull requests cannot merge while required checks fail.
* [ ] No job prints secret fixtures.
* [ ] Platform-specific failures are separately visible.

---

### DV-0011 — Add dependency update automation

* **Priority:** P2

* **Dependencies:** DV-0010

* [ ] Configure dependency update automation.

* [ ] Group development tooling updates.

* [ ] Separate Discord framework updates.

* [ ] Separate security updates.

* [ ] Prevent automatic adapter-major-version upgrades.

---

### DV-0012 — Add commit and changelog conventions

* **Priority:** P1

* **Dependencies:** DV-0008

* [ ] Define conventional commit scopes.

* [ ] Configure changeset workflow.

* [ ] Add changelog generation.

* [ ] Add package-version synchronization rules.

* [ ] Define protocol and schema versioning policy.

---

## M0 Release Gate

* [ ] Repository installs from a clean clone.
* [ ] All TypeScript checks pass.
* [ ] All Python checks pass.
* [ ] All three operating systems pass CI.
* [ ] License, security, and contribution files exist.
* [ ] Workspace structure matches architecture boundaries.

---

# Milestone M1 — CLI Kernel and Machine Contract

## Goal

Deliver the executable, command framework, JSON contract, errors, and human/non-interactive mode behavior.

---

## M1.1 CLI Bootstrap

### DV-0100 — Create CLI executable

* **Priority:** P0

* **Dependencies:** M0

* [ ] Create `discord-verify` executable entry point.

* [ ] Add shebang handling.

* [ ] Add Windows command compatibility.

* [ ] Add root command.

* [ ] Add version command.

* [ ] Add help output.

* [ ] Add command registration architecture.

**Acceptance criteria**

```powershell
discord-verify version
discord-verify --help
```

must run successfully from a built package.

---

### DV-0101 — Select and configure CLI parser

* **Priority:** P0

* **Dependencies:** DV-0100

* [ ] Select a maintained command parser.

* [ ] Add typed option parsing.

* [ ] Add global options.

* [ ] Add subcommand support.

* [ ] Add validation hooks.

* [ ] Prevent parser output from corrupting JSON mode.

Required global options:

```text
--json
--non-interactive
--no-color
--quiet
--verbose
--trace
--profile
--config
--cwd
--timeout
```

---

### DV-0102 — Implement terminal capability detection

* **Priority:** P0

* **Dependencies:** DV-0100

* [ ] Detect TTY input.

* [ ] Detect TTY output.

* [ ] Detect color capability.

* [ ] Detect CI environments.

* [ ] Disable prompts automatically in non-TTY contexts.

* [ ] Disable spinners in JSON mode.

* [ ] Provide test overrides.

---

### DV-0103 — Implement interactive root menu

* **Priority:** P1

* **Dependencies:** DV-0102

* [ ] Add root menu.

* [ ] Add initialization option.

* [ ] Add doctor option.

* [ ] Add discovery option.

* [ ] Add targeted test option.

* [ ] Add full verify option.

* [ ] Add report option.

* [ ] Add cleanup option.

* [ ] Add exit option.

**Acceptance criteria**

* [ ] Root menu appears only when interactive.
* [ ] Root command fails with structured usage error when non-interactive.

---

## M1.2 Output Contracts

### DV-0110 — Define base result schema

* **Priority:** P0

* **Dependencies:** DV-0101

* [ ] Define command-result envelope.

* [ ] Add schema version.

* [ ] Add command name.

* [ ] Add success flag.

* [ ] Add timestamps.

* [ ] Add duration.

* [ ] Add warnings.

* [ ] Add errors.

* [ ] Add metadata.

* [ ] Add partial-result support.

---

### DV-0111 — Define error model

* **Priority:** P0

* **Dependencies:** DV-0110

* [ ] Define stable error-code type.

* [ ] Define error severity.

* [ ] Define user-facing message.

* [ ] Define structured details.

* [ ] Define resolution guidance.

* [ ] Define cause chaining.

* [ ] Define stack-trace policy.

* [ ] Define secret-safe serialization.

Initial error codes must include all PRD codes.

---

### DV-0112 — Implement JSON renderer

* **Priority:** P0

* **Dependencies:** DV-0110, DV-0111

* [ ] Ensure stdout contains JSON only.

* [ ] Serialize unknown values safely.

* [ ] Normalize errors.

* [ ] Add schema version.

* [ ] Disable ANSI output.

* [ ] Preserve partial results.

* [ ] Add newline termination.

* [ ] Reject accidental stdout writes in tests.

**Acceptance criteria**

* [ ] Every JSON-mode CLI integration test parses stdout successfully.
* [ ] Human logs appear only on stderr in JSON mode.

---

### DV-0113 — Implement human renderer

* **Priority:** P1

* **Dependencies:** DV-0110

* [ ] Add status labels.

* [ ] Add compact summary rendering.

* [ ] Add detailed failure rendering.

* [ ] Add no-color support.

* [ ] Add narrow-terminal support.

* [ ] Add copyable remediation commands.

* [ ] Avoid color-only meaning.

---

### DV-0114 — Implement Markdown renderer foundation

* **Priority:** P1

* **Dependencies:** DV-0110

* [ ] Add Markdown-safe escaping.

* [ ] Add summary tables.

* [ ] Add failure sections.

* [ ] Add limitation sections.

* [ ] Add cleanup sections.

* [ ] Add evidence sections.

---

### DV-0115 — Define exit-code resolver

* **Priority:** P0

* **Dependencies:** DV-0111

* [ ] Implement all PRD exit codes.

* [ ] Define precedence when multiple errors occur.

* [ ] Support interrupt code `130`.

* [ ] Add unit tests for every mapping.

* [ ] Document exit-code contract.

---

## M1.3 Logging

### DV-0120 — Implement structured logger

* **Priority:** P0

* **Dependencies:** DV-0112

* [ ] Add log levels.

* [ ] Add contextual fields.

* [ ] Add child loggers.

* [ ] Add stderr output.

* [ ] Add JSON-safe diagnostic mode.

* [ ] Add silent mode.

* [ ] Add trace mode.

---

### DV-0121 — Prevent direct stdout logging

* **Priority:** P0

* **Dependencies:** DV-0120

* [ ] Add internal stdout guard in JSON-mode tests.

* [ ] Audit CLI dependencies for uncontrolled output.

* [ ] Redirect adapter diagnostics.

* [ ] Add development assertion for accidental writes.

---

## M1 Release Gate

* [ ] `discord-verify version` works.
* [ ] Interactive root mode works.
* [ ] Non-interactive root mode fails predictably.
* [ ] JSON stdout always parses.
* [ ] Human output remains readable without color.
* [ ] Exit codes match the PRD.
* [ ] Public result and error schemas are versioned.

---

# Milestone M2 — Configuration, Security, and Sessions

## Goal

Load project configuration safely, manage environment mappings, redact secrets, and persist only non-sensitive session data.

---

## M2.1 Configuration

### DV-0200 — Define configuration schema

* **Priority:** P0

* **Dependencies:** M1

* [ ] Define versioned JSON schema.

* [ ] Define project settings.

* [ ] Define adapter settings.

* [ ] Define environment mappings.

* [ ] Define safety settings.

* [ ] Define output settings.

* [ ] Define runtime settings.

* [ ] Define profiles.

* [ ] Define hooks.

* [ ] Define live verification settings.

---

### DV-0201 — Implement configuration loader

* **Priority:** P0

* **Dependencies:** DV-0200

* [ ] Resolve explicit `--config`.

* [ ] Resolve project-root default.

* [ ] Resolve `--cwd`.

* [ ] Parse JSON.

* [ ] Validate schema.

* [ ] Apply defaults.

* [ ] Return structured validation errors.

* [ ] Reject unsupported schema versions.

---

### DV-0202 — Implement profile resolution

* **Priority:** P1

* **Dependencies:** DV-0201

* [ ] Support named profiles.

* [ ] Merge base configuration.

* [ ] Apply environment-file rules.

* [ ] Apply runtime overrides.

* [ ] Apply safety overrides only when permitted.

* [ ] Report active profile.

---

### DV-0203 — Implement environment mapping

* **Priority:** P0

* **Dependencies:** DV-0201

* [ ] Map semantic fields to variable names.

* [ ] Resolve process environment.

* [ ] Resolve configured environment files.

* [ ] Preserve source metadata.

* [ ] Never expose secret values.

* [ ] Detect missing required values.

* [ ] Support projects using nonstandard variable names.

---

### DV-0204 — Implement environment file parser

* **Priority:** P0

* **Dependencies:** DV-0203

* [ ] Parse common `.env` syntax.

* [ ] Support comments.

* [ ] Support quoted values.

* [ ] Support multiline values where safe.

* [ ] Avoid shell evaluation.

* [ ] Avoid variable command execution.

* [ ] Track source file.

* [ ] Treat configured secret fields as secrets.

---

### DV-0205 — Implement configuration inspection command

* **Priority:** P1
* **Dependencies:** DV-0201, DV-0203

Commands:

```powershell
discord-verify config show
discord-verify config validate
discord-verify config paths
```

Requirements:

* [ ] Display variable names.
* [ ] Display configured status.
* [ ] Display sources.
* [ ] Redact values.
* [ ] Support JSON mode.
* [ ] Never display full environment files.

---

## M2.2 Secret Redaction

### DV-0210 — Implement central redaction service

* **Priority:** P0

* **Dependencies:** DV-0203

* [ ] Register known secret values.

* [ ] Register secret field names.

* [ ] Redact nested objects.

* [ ] Redact strings.

* [ ] Redact URL credentials.

* [ ] Redact authorization headers.

* [ ] Redact webhook tokens.

* [ ] Redact Discord token patterns.

* [ ] Handle partial token appearances.

* [ ] Prevent recursive object failures.

---

### DV-0211 — Integrate redaction with all output paths

* **Priority:** P0

* **Dependencies:** DV-0210

* [ ] Logger.

* [ ] JSON renderer.

* [ ] Human renderer.

* [ ] Markdown renderer.

* [ ] Session writer.

* [ ] Report writer.

* [ ] Adapter diagnostics.

* [ ] Error serialization.

* [ ] Trace output.

---

### DV-0212 — Add secret-leak test suite

* **Priority:** P0
* **Dependencies:** DV-0211

Test cases:

* [ ] Discord bot token in message.
* [ ] Token inside stack trace.
* [ ] Token inside URL.
* [ ] Token inside JSON.
* [ ] Database URL.
* [ ] Webhook URL.
* [ ] Authorization header.
* [ ] Secret split by prefix and suffix.
* [ ] Secret in adapter stderr.
* [ ] Secret in project exception.
* [ ] Secret in scenario output.

**Acceptance criteria**

* [ ] No known secret fixture appears in generated artifacts.
* [ ] Tests scan stdout, stderr, reports, traces, and sessions.

---

## M2.3 Guild Safety

### DV-0220 — Implement test-guild resolver

* **Priority:** P0

* **Dependencies:** DV-0203

* [ ] Resolve configured test guild.

* [ ] Resolve allowed guild list.

* [ ] Reject empty live configuration.

* [ ] Normalize snowflake values.

* [ ] Reject malformed IDs.

* [ ] Return safe metadata.

---

### DV-0221 — Implement guild-target authorization

* **Priority:** P0

* **Dependencies:** DV-0220

* [ ] Validate every live request target.

* [ ] Prevent fixture override.

* [ ] Prevent scenario override.

* [ ] Prevent adapter-reported cross-guild operation.

* [ ] Record authorized guild in session.

* [ ] Add security audit event.

---

### DV-0222 — Implement optional guild marker validation

* **Priority:** P1
* **Dependencies:** DV-0221

Marker types:

* [ ] Guild-name pattern.
* [ ] Required channel.
* [ ] Required role.
* [ ] Required guild metadata hook.

---

### DV-0223 — Implement destructive-operation policy

* **Priority:** P0

* **Dependencies:** DV-0221

* [ ] Define destructive-operation catalog.

* [ ] Default to blocked.

* [ ] Require config authorization.

* [ ] Require explicit CLI flag in non-interactive mode.

* [ ] Require confirmation in interactive mode.

* [ ] Record authorization evidence.

* [ ] Never allow production-guild bypass.

---

## M2.4 Sessions

### DV-0230 — Define session schema

* **Priority:** P0
* **Dependencies:** DV-0110

Include:

* [ ] Session ID.
* [ ] Start time.
* [ ] Project identity.
* [ ] Adapter identity.
* [ ] Active profile.
* [ ] Authorized guild.
* [ ] Process IDs.
* [ ] Resource ledger.
* [ ] Test results.
* [ ] Cleanup state.
* [ ] No secrets.

---

### DV-0231 — Implement session store

* **Priority:** P0

* **Dependencies:** DV-0230

* [ ] Create session directory.

* [ ] Atomic writes.

* [ ] Corruption detection.

* [ ] Stale session detection.

* [ ] Session lookup.

* [ ] Session list.

* [ ] Session retention.

* [ ] Cross-platform paths.

---

### DV-0232 — Implement interruption handling

* **Priority:** P0

* **Dependencies:** DV-0231

* [ ] Handle `SIGINT`.

* [ ] Handle `SIGTERM`.

* [ ] Handle Windows termination behavior where possible.

* [ ] Mark interrupted sessions.

* [ ] Attempt graceful shutdown.

* [ ] Attempt cleanup.

* [ ] Return exit code `130`.

---

## M2 Release Gate

* [ ] Configuration validates against a versioned schema.
* [ ] Existing environment variable names can be mapped.
* [ ] Secret values never appear in outputs or session files.
* [ ] Live requests cannot target unauthorized guilds.
* [ ] Destructive operations are blocked by default.
* [ ] Interrupted runs leave recoverable session state.

---

# Milestone M3 — Adapter Protocol and Worker Runtime

## Goal

Create the framework-neutral worker protocol used by both first-party adapters.

---

## M3.1 Protocol

### DV-0300 — Define adapter protocol schema

* **Priority:** P0
* **Dependencies:** M2

Define:

* [ ] Protocol version.
* [ ] Request envelope.
* [ ] Response envelope.
* [ ] Notification envelope.
* [ ] Error envelope.
* [ ] Capability document.
* [ ] Lifecycle events.
* [ ] Cancellation.
* [ ] Request IDs.
* [ ] Timeout metadata.
* [ ] Trace correlation IDs.

---

### DV-0301 — Define canonical feature schema

* **Priority:** P0
* **Dependencies:** DV-0300

Feature types:

* [ ] Slash command.
* [ ] Prefix command.
* [ ] Context menu.
* [ ] Autocomplete.
* [ ] Button.
* [ ] Select menu.
* [ ] Modal.
* [ ] Event.
* [ ] Error handler.

Feature fields:

* [ ] Stable ID.
* [ ] Name.
* [ ] Source file.
* [ ] Source location.
* [ ] Confidence.
* [ ] Support status.
* [ ] Required fixture fields.
* [ ] Permissions.
* [ ] Intents.
* [ ] Tags.
* [ ] Adapter metadata.

---

### DV-0302 — Define canonical invocation context

* **Priority:** P0
* **Dependencies:** DV-0300

Include:

* [ ] Guild.
* [ ] Channel.
* [ ] User.
* [ ] Member.
* [ ] Roles.
* [ ] Permissions.
* [ ] Locale.
* [ ] Message.
* [ ] Command options.
* [ ] Component values.
* [ ] Modal fields.
* [ ] Event payload.
* [ ] Live-object references.
* [ ] Session variables.

---

### DV-0303 — Define canonical response model

* **Priority:** P0
* **Dependencies:** DV-0300

Response types:

* [ ] Reply.
* [ ] Deferred reply.
* [ ] Edited reply.
* [ ] Follow-up.
* [ ] Update.
* [ ] Deferred update.
* [ ] Modal.
* [ ] Deleted reply.
* [ ] Message send.
* [ ] Framework error.

---

### DV-0304 — Define canonical side-effect model

* **Priority:** P0
* **Dependencies:** DV-0300

Side effects:

* [ ] Discord REST operation.
* [ ] Channel mutation.
* [ ] Role mutation.
* [ ] Member mutation.
* [ ] Message mutation.
* [ ] Thread mutation.
* [ ] Webhook mutation.
* [ ] Database hook output.
* [ ] External hook output.
* [ ] Cache mutation where observable.

---

## M3.2 JSON Lines Runtime

### DV-0310 — Implement JSON Lines parser

* **Priority:** P0

* **Dependencies:** DV-0300

* [ ] Streaming input.

* [ ] Line framing.

* [ ] Maximum line size.

* [ ] Parse errors.

* [ ] UTF-8 handling.

* [ ] Empty-line handling.

* [ ] Graceful EOF.

---

### DV-0311 — Implement protocol client

* **Priority:** P0

* **Dependencies:** DV-0310

* [ ] Request dispatch.

* [ ] Request correlation.

* [ ] Timeout handling.

* [ ] Cancellation.

* [ ] Notification handling.

* [ ] Worker shutdown.

* [ ] Protocol mismatch handling.

* [ ] Partial result preservation.

---

### DV-0312 — Implement protocol server test harness

* **Priority:** P0

* **Dependencies:** DV-0310

* [ ] Mock adapter server.

* [ ] Configurable delays.

* [ ] Configurable crashes.

* [ ] Invalid JSON.

* [ ] Mismatched IDs.

* [ ] Protocol-version mismatch.

* [ ] Partial-response simulation.

* [ ] Secret-bearing stderr fixture.

---

## M3.3 Worker Management

### DV-0320 — Implement adapter worker launcher

* **Priority:** P0

* **Dependencies:** DV-0311

* [ ] Spawn without shell where possible.

* [ ] Pass working directory.

* [ ] Pass restricted environment.

* [ ] Capture stdout protocol stream.

* [ ] Capture stderr diagnostics.

* [ ] Track process ID.

* [ ] Register session.

* [ ] Handle startup timeout.

* [ ] Handle unexpected exit.

---

### DV-0321 — Implement capability negotiation

* **Priority:** P0

* **Dependencies:** DV-0320

* [ ] Send initialize request.

* [ ] Verify protocol version.

* [ ] Verify adapter identity.

* [ ] Resolve capabilities.

* [ ] Reject unsupported required capabilities.

* [ ] Store capability document in session.

---

### DV-0322 — Implement worker lifecycle controller

* **Priority:** P0
* **Dependencies:** DV-0320

States:

```text
created
starting
initializing
ready
busy
stopping
stopped
failed
```

* [ ] Validate state transitions.
* [ ] Emit lifecycle events.
* [ ] Support graceful shutdown.
* [ ] Force kill after timeout.
* [ ] Preserve diagnostics.

---

### DV-0323 — Implement worker crash recovery

* **Priority:** P1

* **Dependencies:** DV-0322

* [ ] Mark affected test.

* [ ] Preserve previous results.

* [ ] Attempt cleanup.

* [ ] Optionally restart worker for independent tests.

* [ ] Prevent restart loops.

* [ ] Report adapter crash clearly.

---

### DV-0324 — Build adapter contract test suite

* **Priority:** P0
* **Dependencies:** DV-0321

Every adapter must pass tests for:

* [ ] Initialize.
* [ ] Capability negotiation.
* [ ] Discovery.
* [ ] Invocation.
* [ ] Responses.
* [ ] Errors.
* [ ] Timeouts.
* [ ] Cancellation.
* [ ] Cleanup.
* [ ] Shutdown.
* [ ] Secret handling.
* [ ] Protocol compatibility.

---

## M3 Release Gate

* [ ] Mock adapter can complete a full request lifecycle.
* [ ] Worker crashes produce structured errors.
* [ ] Protocol mismatches are rejected.
* [ ] Adapter stderr cannot corrupt JSON output.
* [ ] Both future adapters can share the same protocol contract.

---

# Milestone M4 — Project Discovery and Initialization

## Goal

Detect supported projects, initialize configuration, generate adapters when required, and create `DISCORD_VERIFY.md`.

---

## M4.1 Project Detection

### DV-0400 — Implement project-root detection

* **Priority:** P0

* **Dependencies:** M3

* [ ] Detect explicit `--cwd`.

* [ ] Detect nearest supported project root.

* [ ] Detect monorepo package roots.

* [ ] Detect nested bots.

* [ ] Handle ambiguous roots.

* [ ] Support explicit override.

---

### DV-0401 — Implement JavaScript project detection

* **Priority:** P0

* **Dependencies:** DV-0400

* [ ] Detect `package.json`.

* [ ] Detect `discord.js`.

* [ ] Detect framework version.

* [ ] Detect TypeScript.

* [ ] Detect CommonJS.

* [ ] Detect ESM.

* [ ] Detect package manager.

* [ ] Detect likely start commands.

* [ ] Detect likely entry points.

---

### DV-0402 — Implement Python project detection

* **Priority:** P0

* **Dependencies:** DV-0400

* [ ] Detect `pyproject.toml`.

* [ ] Detect requirements files.

* [ ] Detect Poetry.

* [ ] Detect uv.

* [ ] Detect pipenv where practical.

* [ ] Detect `discord.py`.

* [ ] Detect framework version.

* [ ] Detect likely Python executable.

* [ ] Detect likely entry points.

* [ ] Detect bot subclasses and startup files where possible.

---

### DV-0403 — Implement unsupported-framework detection

* **Priority:** P1
* **Dependencies:** DV-0401, DV-0402

Detect and report:

* [ ] py-cord.
* [ ] nextcord.
* [ ] disnake.
* [ ] Eris.
* [ ] Oceanic.js.
* [ ] Other Discord libraries.

Requirements:

* [ ] Do not silently treat them as supported frameworks.
* [ ] Offer custom-adapter path.
* [ ] Return stable error code.

---

## M4.2 Static Discovery Foundation

### DV-0410 — Implement filesystem scanner

* **Priority:** P0

* **Dependencies:** DV-0400

* [ ] Respect ignore rules.

* [ ] Ignore dependency directories.

* [ ] Ignore build outputs.

* [ ] Ignore secret files by default.

* [ ] Limit maximum file size.

* [ ] Support configured include/exclude patterns.

* [ ] Produce deterministic ordering.

---

### DV-0411 — Implement TypeScript and JavaScript source scanner

* **Priority:** P0

* **Dependencies:** DV-0410

* [ ] Parse source safely.

* [ ] Discover imports and exports.

* [ ] Discover command builders.

* [ ] Discover handler exports.

* [ ] Discover event registrations.

* [ ] Discover component custom IDs.

* [ ] Discover modal custom IDs.

* [ ] Report confidence.

---

### DV-0412 — Implement Python source scanner

* **Priority:** P0

* **Dependencies:** DV-0410

* [ ] Parse Python AST without importing modules.

* [ ] Discover decorators.

* [ ] Discover Cogs.

* [ ] Discover application commands.

* [ ] Discover prefix commands.

* [ ] Discover listeners.

* [ ] Discover Views.

* [ ] Discover Modals.

* [ ] Report confidence.

---

### DV-0413 — Implement discovery aggregation

* **Priority:** P0

* **Dependencies:** DV-0411, DV-0412

* [ ] Merge static findings.

* [ ] Remove duplicates.

* [ ] Produce stable feature IDs.

* [ ] Record source locations.

* [ ] Detect conflicts.

* [ ] Detect ambiguity.

* [ ] Mark custom-adapter requirements.

---

## M4.3 Init Command

### DV-0420 — Implement initialization planner

* **Priority:** P0
* **Dependencies:** DV-0401, DV-0402, DV-0413

Planner output:

* [ ] Detected project.
* [ ] Detected framework.
* [ ] Detected environment names.
* [ ] Proposed adapter.
* [ ] Files to create.
* [ ] Files to modify.
* [ ] Dependencies to add.
* [ ] Risks.
* [ ] Required manual inputs.
* [ ] Dry-run support.

---

### DV-0421 — Implement interactive initialization

* **Priority:** P1
* **Dependencies:** DV-0420

Prompts may cover:

* [ ] Project selection.
* [ ] Framework confirmation.
* [ ] Entry-point selection.
* [ ] Environment variable mapping.
* [ ] Test guild variable.
* [ ] Test channel variable.
* [ ] Start command.
* [ ] Adapter mode.
* [ ] Report preferences.
* [ ] Safety preferences.

---

### DV-0422 — Implement non-interactive initialization

* **Priority:** P0

* **Dependencies:** DV-0420

* [ ] Require explicit values for unresolved fields.

* [ ] Never prompt.

* [ ] Return structured missing-input errors.

* [ ] Support `--yes`.

* [ ] Support `--framework`.

* [ ] Support `--adapter`.

* [ ] Support `--entry-point`.

* [ ] Support environment mappings.

* [ ] Support dry-run JSON output.

---

### DV-0423 — Generate `.discord-verify/config.json`

* **Priority:** P0

* **Dependencies:** DV-0420

* [ ] Write versioned schema.

* [ ] Preserve project-relative paths.

* [ ] Avoid secret values.

* [ ] Include environment names only.

* [ ] Include safety defaults.

* [ ] Include report defaults.

* [ ] Use atomic writes.

---

### DV-0424 — Generate directory structure

* **Priority:** P1
* **Dependencies:** DV-0420

Generate:

```text
.discord-verify/
├── fixtures/
├── scenarios/
├── reports/
├── sessions/
└── adapter/
```

* [ ] Ignore generated reports.
* [ ] Ignore generated sessions.
* [ ] Preserve fixtures and scenarios for version control.

---

### DV-0425 — Generate sample fixtures

* **Priority:** P1
* **Dependencies:** DV-0424

Generate framework-relevant examples for:

* [ ] Slash command.
* [ ] Prefix command.
* [ ] Button.
* [ ] Modal.
* [ ] Event.

---

### DV-0426 — Generate sample smoke scenario

* **Priority:** P1

* **Dependencies:** DV-0425

* [ ] Use discovered safe feature when possible.

* [ ] Otherwise generate placeholder.

* [ ] Clearly mark unresolved fields.

* [ ] Avoid live destructive operations.

---

### DV-0427 — Implement safe file mutation engine

* **Priority:** P0

* **Dependencies:** DV-0420

* [ ] Preview modifications.

* [ ] Refuse overwrite by default.

* [ ] Support backups where appropriate.

* [ ] Support `--force`.

* [ ] Support atomic writes.

* [ ] Record modified paths.

* [ ] Avoid modifying project source when built-in adapter is sufficient.

---

## M4.4 Doctor Command

### DV-0430 — Implement doctor checks framework

* **Priority:** P0

* **Dependencies:** DV-0201, DV-0401, DV-0402

* [ ] Check registry.

* [ ] Check severity.

* [ ] Check result.

* [ ] Resolution guidance.

* [ ] Human output.

* [ ] JSON output.

* [ ] Required and optional checks.

---

### DV-0431 — Implement runtime checks

* **Priority:** P0

* **Dependencies:** DV-0430

* [ ] Node.js version.

* [ ] Python version.

* [ ] Package manager.

* [ ] Project dependencies.

* [ ] Adapter files.

* [ ] Start command.

* [ ] Working directory.

---

### DV-0432 — Implement environment checks

* **Priority:** P0

* **Dependencies:** DV-0430

* [ ] Token configured.

* [ ] Client ID configured.

* [ ] Test guild configured.

* [ ] Test channel configured where required.

* [ ] No values displayed.

* [ ] Profile consistency.

---

### DV-0433 — Implement database-risk checks

* **Priority:** P1

* **Dependencies:** DV-0430

* [ ] Detect absent test profile.

* [ ] Detect production-like names.

* [ ] Detect identical test and production URLs where mappings exist.

* [ ] Warn about missing cleanup hooks.

* [ ] Allow project override with explicit acknowledgement.

---

## M4.5 Agent Guide

### DV-0440 — Define `DISCORD_VERIFY.md` template

* **Priority:** P0
* **Dependencies:** DV-0420

Include:

* [ ] Purpose.
* [ ] Agent workflow.
* [ ] Project framework.
* [ ] Doctor command.
* [ ] Discovery command.
* [ ] Targeted verification commands.
* [ ] Full verification command.
* [ ] Cleanup command.
* [ ] JSON guidance.
* [ ] Exit codes.
* [ ] Secret rules.
* [ ] Guild restrictions.
* [ ] Manual limitations.
* [ ] Project-specific paths.

---

### DV-0441 — Implement guide generator

* **Priority:** P0

* **Dependencies:** DV-0440

* [ ] Render project-specific commands.

* [ ] Render environment variable names.

* [ ] Never render values.

* [ ] Render configured profile.

* [ ] Render fixture paths.

* [ ] Render scenario paths.

* [ ] Render custom adapter notes.

* [ ] Support regeneration.

---

### DV-0442 — Implement instructions command

* **Priority:** P1
* **Dependencies:** DV-0441

Commands:

```powershell
discord-verify instructions
discord-verify instructions --refresh
discord-verify instructions --stdout
```

* [ ] Regenerate safely.
* [ ] Preview changes.
* [ ] Support JSON summary.
* [ ] Preserve user extension section where possible.

---

## M4 Release Gate

* [ ] Conventional `discord.js` project can be detected.
* [ ] Conventional `discord.py` project can be detected.
* [ ] Unsupported frameworks are reported honestly.
* [ ] Init dry-run makes no changes.
* [ ] Non-interactive init never prompts.
* [ ] `DISCORD_VERIFY.md` is generated without secrets.
* [ ] Doctor produces useful diagnostics.

---

# Milestone M5 — `discord.js v14` Adapter

## Goal

Provide complete version-1 verification capabilities for JavaScript and TypeScript bots using `discord.js v14`.

---

## M5.1 Runtime and Loading

### DV-0500 — Create Node.js adapter worker

* **Priority:** P0

* **Dependencies:** M3, M4

* [ ] Implement protocol server.

* [ ] Implement lifecycle.

* [ ] Implement capability response.

* [ ] Implement restricted logging.

* [ ] Implement graceful shutdown.

* [ ] Implement source-map support.

---

### DV-0501 — Implement module-system detection

* **Priority:** P0

* **Dependencies:** DV-0500

* [ ] CommonJS.

* [ ] ESM.

* [ ] JavaScript.

* [ ] TypeScript.

* [ ] tsx-based runtime.

* [ ] ts-node where configured.

* [ ] Compiled-output path.

* [ ] Unsupported loader errors.

---

### DV-0502 — Implement safe target module loading

* **Priority:** P0

* **Dependencies:** DV-0501

* [ ] Load custom adapter when configured.

* [ ] Load built-in integration.

* [ ] Avoid double bot login.

* [ ] Detect import side effects.

* [ ] Provide safe-discovery mode.

* [ ] Isolate module cache per worker.

* [ ] Capture load errors.

---

### DV-0503 — Implement client discovery

* **Priority:** P0

* **Dependencies:** DV-0502

* [ ] Detect exported client.

* [ ] Detect client factory.

* [ ] Detect custom adapter client resolver.

* [ ] Detect login state.

* [ ] Detect intents.

* [ ] Detect application identity.

* [ ] Return structured ambiguity.

---

## M5.2 Command Discovery

### DV-0510 — Discover slash commands

* **Priority:** P0

* **Dependencies:** DV-0502

* [ ] Command builders.

* [ ] JSON command definitions.

* [ ] Command collections.

* [ ] Command groups.

* [ ] Subcommands.

* [ ] Subcommand groups.

* [ ] Permissions.

* [ ] NSFW state.

* [ ] Integration contexts where available.

---

### DV-0511 — Discover prefix commands

* **Priority:** P0

* **Dependencies:** DV-0502

* [ ] Collection-based commands.

* [ ] Exported handlers.

* [ ] Aliases.

* [ ] Prefix metadata.

* [ ] Permission metadata.

* [ ] Custom adapter override.

---

### DV-0512 — Discover context-menu commands

* **Priority:** P1

* **Dependencies:** DV-0510

* [ ] User commands.

* [ ] Message commands.

* [ ] Handler resolution.

* [ ] Source locations.

---

### DV-0513 — Discover autocomplete handlers

* **Priority:** P1

* **Dependencies:** DV-0510

* [ ] Command association.

* [ ] Option association.

* [ ] Handler source.

* [ ] Required fixture values.

---

### DV-0514 — Discover component handlers

* **Priority:** P0

* **Dependencies:** DV-0502

* [ ] Buttons.

* [ ] String selects.

* [ ] User selects.

* [ ] Role selects.

* [ ] Channel selects.

* [ ] Mentionable selects.

* [ ] Static custom IDs.

* [ ] Pattern-based custom IDs.

* [ ] Router-based handlers.

---

### DV-0515 — Discover modal handlers

* **Priority:** P0

* **Dependencies:** DV-0502

* [ ] Modal custom IDs.

* [ ] Modal submit handlers.

* [ ] Modal field expectations.

* [ ] Dynamic custom-ID patterns.

* [ ] Source locations.

---

### DV-0516 — Discover event handlers

* **Priority:** P0

* **Dependencies:** DV-0502

* [ ] Client event registration.

* [ ] Once handlers.

* [ ] Event modules.

* [ ] Error handlers.

* [ ] Interaction router.

* [ ] Message router.

* [ ] Listener source locations.

---

## M5.3 Test Facades

### DV-0520 — Implement base interaction facade

* **Priority:** P0

* **Dependencies:** DV-0302, DV-0303

* [ ] Guild context.

* [ ] Channel context.

* [ ] User context.

* [ ] Member context.

* [ ] Locale.

* [ ] Permissions.

* [ ] Client reference.

* [ ] Command metadata.

* [ ] Type guards expected by common project code.

---

### DV-0521 — Implement slash-command interaction facade

* **Priority:** P0

* **Dependencies:** DV-0520

* [ ] Options resolver.

* [ ] Subcommands.

* [ ] Subcommand groups.

* [ ] User options.

* [ ] Member options.

* [ ] Role options.

* [ ] Channel options.

* [ ] Attachment options.

* [ ] Mentionable options.

* [ ] Required option validation.

---

### DV-0522 — Implement prefix-message facade

* **Priority:** P0

* **Dependencies:** DV-0520

* [ ] Message content.

* [ ] Author.

* [ ] Member.

* [ ] Channel.

* [ ] Guild.

* [ ] Mentions.

* [ ] Attachments.

* [ ] Replies.

* [ ] Common message methods.

* [ ] Bot-author behavior configuration.

---

### DV-0523 — Implement context-menu facades

* **Priority:** P1

* **Dependencies:** DV-0520

* [ ] Target user.

* [ ] Target member.

* [ ] Target message.

* [ ] Resolved data.

* [ ] Correct command type.

---

### DV-0524 — Implement autocomplete facade

* **Priority:** P1

* **Dependencies:** DV-0520

* [ ] Focused option.

* [ ] Current option values.

* [ ] Respond capture.

* [ ] Maximum-choice validation.

* [ ] Choice schema normalization.

---

### DV-0525 — Implement button facade

* **Priority:** P0

* **Dependencies:** DV-0520

* [ ] Custom ID.

* [ ] Source message.

* [ ] Component metadata.

* [ ] Update.

* [ ] Defer update.

* [ ] Reply methods.

---

### DV-0526 — Implement select-menu facades

* **Priority:** P0

* **Dependencies:** DV-0520

* [ ] String values.

* [ ] Selected users.

* [ ] Selected roles.

* [ ] Selected channels.

* [ ] Selected mentionables.

* [ ] Source component metadata.

* [ ] Min/max validation.

---

### DV-0527 — Implement modal-submit facade

* **Priority:** P0

* **Dependencies:** DV-0520

* [ ] Custom ID.

* [ ] Text field resolver.

* [ ] Source interaction context.

* [ ] Reply methods.

* [ ] Validation of required fields.

---

## M5.4 Response Capture

### DV-0530 — Capture interaction replies

* **Priority:** P0
* **Dependencies:** DV-0520

Capture:

* [ ] `reply`.
* [ ] `deferReply`.
* [ ] `editReply`.
* [ ] `followUp`.
* [ ] `deleteReply`.
* [ ] `fetchReply`.
* [ ] `showModal`.
* [ ] `update`.
* [ ] `deferUpdate`.

---

### DV-0531 — Normalize response payloads

* **Priority:** P0
* **Dependencies:** DV-0530

Normalize:

* [ ] Content.
* [ ] Embeds.
* [ ] Components.
* [ ] Attachments.
* [ ] Ephemeral state.
* [ ] Allowed mentions.
* [ ] Polls where supported.
* [ ] Message flags.
* [ ] Timestamps.
* [ ] Generated IDs.

---

### DV-0532 — Capture response-order violations

* **Priority:** P1
* **Dependencies:** DV-0530

Detect:

* [ ] Double initial reply.
* [ ] Edit before reply.
* [ ] Follow-up before acknowledgement where invalid.
* [ ] Modal after acknowledgement where invalid.
* [ ] Reply after timeout simulation.
* [ ] Invalid update lifecycle.

---

## M5.5 Invocation

### DV-0540 — Invoke slash-command handlers

* **Priority:** P0

* **Dependencies:** DV-0510, DV-0521, DV-0530

* [ ] Direct callback handlers.

* [ ] Router-based handlers.

* [ ] Command collections.

* [ ] Subcommands.

* [ ] Error handling.

* [ ] Timeout handling.

* [ ] Response capture.

* [ ] Source traceability.

---

### DV-0541 — Invoke prefix-command handlers

* **Priority:** P0

* **Dependencies:** DV-0511, DV-0522

* [ ] Parse prefix input.

* [ ] Resolve aliases.

* [ ] Resolve arguments.

* [ ] Invoke actual router or callback.

* [ ] Capture sends and replies.

* [ ] Support project-provided parser hook.

---

### DV-0542 — Invoke context-menu handlers

* **Priority:** P1
* **Dependencies:** DV-0512, DV-0523

---

### DV-0543 — Invoke autocomplete handlers

* **Priority:** P1
* **Dependencies:** DV-0513, DV-0524

---

### DV-0544 — Invoke button handlers

* **Priority:** P0
* **Dependencies:** DV-0514, DV-0525

---

### DV-0545 — Invoke select-menu handlers

* **Priority:** P0
* **Dependencies:** DV-0514, DV-0526

---

### DV-0546 — Invoke modal-submit handlers

* **Priority:** P0
* **Dependencies:** DV-0515, DV-0527

---

### DV-0547 — Invoke event handlers

* **Priority:** P0

* **Dependencies:** DV-0516

* [ ] Event fixture conversion.

* [ ] Multiple listeners.

* [ ] Once listeners.

* [ ] Error propagation.

* [ ] Listener-order recording.

* [ ] Timeout handling.

---

## M5.6 Runtime Integration

### DV-0550 — Start project bot in test mode

* **Priority:** P0

* **Dependencies:** DV-0503

* [ ] Use configured start command.

* [ ] Use adapter-managed mode.

* [ ] Detect readiness.

* [ ] Detect login success.

* [ ] Capture startup logs.

* [ ] Prevent duplicate login.

* [ ] Respect startup timeout.

---

### DV-0551 — Stop project bot gracefully

* **Priority:** P0

* **Dependencies:** DV-0550

* [ ] Destroy client.

* [ ] Close project hooks.

* [ ] Wait for process.

* [ ] Force stop after timeout.

* [ ] Report shutdown failures.

---

### DV-0552 — Capture Discord REST operations

* **Priority:** P1

* **Dependencies:** DV-0550

* [ ] Observe framework REST calls where practical.

* [ ] Normalize method.

* [ ] Normalize route.

* [ ] Redact authorization.

* [ ] Record target guild.

* [ ] Record response metadata.

* [ ] Avoid storing secret request bodies.

---

## M5.7 Adapter Test Projects

### DV-0560 — Build basic `discord.js` example

* **Priority:** P0
* **Dependencies:** DV-0540

Include:

* [ ] Slash command.
* [ ] Prefix command.
* [ ] Button.
* [ ] Select.
* [ ] Modal.
* [ ] Event.
* [ ] Error case.

---

### DV-0561 — Build advanced `discord.js` example

* **Priority:** P1
* **Dependencies:** DV-0560

Include:

* [ ] Command groups.
* [ ] Dynamic loader.
* [ ] Pattern custom IDs.
* [ ] Deferred response.
* [ ] Follow-up.
* [ ] Database hook.
* [ ] Live role side effect.

---

### DV-0562 — Build `discord.js` adapter compatibility suite

* **Priority:** P0

* **Dependencies:** DV-0560, DV-0561

* [ ] JavaScript CommonJS.

* [ ] JavaScript ESM.

* [ ] TypeScript ESM.

* [ ] TypeScript CommonJS where supported.

* [ ] Direct exports.

* [ ] Collection loaders.

* [ ] Custom adapter.

---

## M5 Release Gate

* [ ] All required interaction types can be invoked.
* [ ] Replies, deferrals, edits, follow-ups, updates, and modals are captured.
* [ ] Events can be invoked.
* [ ] Runtime startup and shutdown work.
* [ ] Adapter contract suite passes.
* [ ] Example projects pass.
* [ ] No target-project secret leaks through errors or logs.

---

# Milestone M6 — `discord.py 2.x` Adapter

## Goal

Reach equivalent version-1 capability for Python bots using `discord.py 2.x`.

---

## M6.1 Python Worker

### DV-0600 — Create Python adapter worker

* **Priority:** P0

* **Dependencies:** M3, M4

* [ ] JSON Lines protocol server.

* [ ] Async event loop.

* [ ] Lifecycle.

* [ ] Capability document.

* [ ] Error serialization.

* [ ] Redacted diagnostics.

* [ ] Graceful shutdown.

---

### DV-0601 — Implement Python interpreter resolution

* **Priority:** P0
* **Dependencies:** DV-0600

Resolution order:

* [ ] Explicit config.
* [ ] Active virtual environment.
* [ ] uv environment.
* [ ] Poetry environment.
* [ ] Project `.venv`.
* [ ] System Python.
* [ ] Structured ambiguity error.

---

### DV-0602 — Implement Python path and import isolation

* **Priority:** P0

* **Dependencies:** DV-0601

* [ ] Project root path.

* [ ] Virtual environment packages.

* [ ] Module import.

* [ ] Import error capture.

* [ ] Module cleanup where practical.

* [ ] No accidental global install requirement.

---

### DV-0603 — Implement bot and tree discovery

* **Priority:** P0

* **Dependencies:** DV-0602

* [ ] Bot instance.

* [ ] Bot factory.

* [ ] Command tree.

* [ ] Cogs.

* [ ] Views.

* [ ] Entry point.

* [ ] Custom adapter override.

---

## M6.2 Discovery

### DV-0610 — Discover application commands

* **Priority:** P0

* **Dependencies:** DV-0603

* [ ] Slash commands.

* [ ] Groups.

* [ ] Subcommands.

* [ ] Context menus.

* [ ] Checks.

* [ ] Permissions.

* [ ] Autocomplete.

---

### DV-0611 — Discover prefix commands

* **Priority:** P0

* **Dependencies:** DV-0603

* [ ] Commands extension.

* [ ] Groups.

* [ ] Aliases.

* [ ] Checks.

* [ ] Cogs.

* [ ] Error handlers.

---

### DV-0612 — Discover Views and buttons

* **Priority:** P0

* **Dependencies:** DV-0603

* [ ] Persistent Views.

* [ ] Dynamic items where supported.

* [ ] Buttons.

* [ ] Callback source.

* [ ] Custom IDs.

* [ ] Timeout metadata.

---

### DV-0613 — Discover selects

* **Priority:** P0

* **Dependencies:** DV-0603

* [ ] String selects.

* [ ] User selects.

* [ ] Role selects.

* [ ] Channel selects.

* [ ] Mentionable selects.

* [ ] Callback source.

---

### DV-0614 — Discover Modals

* **Priority:** P0

* **Dependencies:** DV-0603

* [ ] Modal classes.

* [ ] Text inputs.

* [ ] Submit callback.

* [ ] Custom IDs.

* [ ] Titles.

---

### DV-0615 — Discover event listeners

* **Priority:** P0

* **Dependencies:** DV-0603

* [ ] Decorated events.

* [ ] Cog listeners.

* [ ] Error handlers.

* [ ] Ready handler.

* [ ] Interaction handler.

* [ ] Message handler.

---

## M6.3 Test Contexts

### DV-0620 — Implement base interaction context

* **Priority:** P0

* **Dependencies:** DV-0302

* [ ] User.

* [ ] Member.

* [ ] Guild.

* [ ] Channel.

* [ ] Locale.

* [ ] Permissions.

* [ ] Client.

* [ ] Response.

* [ ] Follow-up.

---

### DV-0621 — Implement app-command interaction context

* **Priority:** P0

* **Dependencies:** DV-0620

* [ ] Namespace options.

* [ ] Resolved values.

* [ ] Command metadata.

* [ ] Group metadata.

* [ ] Checks.

---

### DV-0622 — Implement prefix command context

* **Priority:** P0

* **Dependencies:** DV-0620

* [ ] Message.

* [ ] Prefix.

* [ ] Invoked command.

* [ ] Arguments.

* [ ] Author.

* [ ] Guild.

* [ ] Channel.

* [ ] Send and reply capture.

---

### DV-0623 — Implement component contexts

* **Priority:** P0

* **Dependencies:** DV-0620

* [ ] Button item.

* [ ] Select item.

* [ ] View state.

* [ ] Source message.

* [ ] Selected values.

* [ ] Interaction response.

---

### DV-0624 — Implement modal-submit context

* **Priority:** P0

* **Dependencies:** DV-0620

* [ ] Modal values.

* [ ] Child inputs.

* [ ] Submit callback.

* [ ] Response capture.

---

## M6.4 Response Capture

### DV-0630 — Capture interaction response methods

* **Priority:** P0
* **Dependencies:** DV-0620

Capture:

* [ ] `send_message`.
* [ ] `defer`.
* [ ] `edit_message`.
* [ ] `send_modal`.
* [ ] Autocomplete response.
* [ ] Pong response where relevant.
* [ ] Response completion state.

---

### DV-0631 — Capture follow-up methods

* **Priority:** P0

* **Dependencies:** DV-0630

* [ ] Follow-up sends.

* [ ] Edits.

* [ ] Deletes.

* [ ] Wait behavior.

* [ ] Ephemeral state.

---

### DV-0632 — Normalize Python response payloads

* **Priority:** P0

* **Dependencies:** DV-0630

* [ ] Content.

* [ ] Embeds.

* [ ] Files.

* [ ] Attachments.

* [ ] Views.

* [ ] Components.

* [ ] Allowed mentions.

* [ ] Ephemeral state.

---

## M6.5 Invocation

### DV-0640 — Invoke application commands

* **Priority:** P0

* **Dependencies:** DV-0610, DV-0621, DV-0630

* [ ] Commands.

* [ ] Groups.

* [ ] Subcommands.

* [ ] Context menus.

* [ ] Checks.

* [ ] Error handlers.

* [ ] Timeouts.

---

### DV-0641 — Invoke prefix commands

* **Priority:** P0

* **Dependencies:** DV-0611, DV-0622

* [ ] Conversion.

* [ ] Checks.

* [ ] Groups.

* [ ] Aliases.

* [ ] Error handlers.

* [ ] Send capture.

---

### DV-0642 — Invoke autocomplete handlers

* **Priority:** P1
* **Dependencies:** DV-0610, DV-0621

---

### DV-0643 — Invoke button callbacks

* **Priority:** P0
* **Dependencies:** DV-0612, DV-0623

---

### DV-0644 — Invoke select callbacks

* **Priority:** P0
* **Dependencies:** DV-0613, DV-0623

---

### DV-0645 — Invoke modal callbacks

* **Priority:** P0
* **Dependencies:** DV-0614, DV-0624

---

### DV-0646 — Invoke event listeners

* **Priority:** P0

* **Dependencies:** DV-0615

* [ ] Bot event.

* [ ] Cog listener.

* [ ] Multiple listeners.

* [ ] Error propagation.

* [ ] Listener order.

* [ ] Async timeout.

---

## M6.6 Runtime

### DV-0650 — Start Python bot in test mode

* **Priority:** P0

* **Dependencies:** DV-0603

* [ ] Configured start command.

* [ ] Adapter-managed mode.

* [ ] Readiness signal.

* [ ] Login detection.

* [ ] Startup timeout.

* [ ] Startup diagnostics.

---

### DV-0651 — Stop Python bot gracefully

* **Priority:** P0

* **Dependencies:** DV-0650

* [ ] Close client.

* [ ] Close sessions.

* [ ] Close database hooks.

* [ ] Stop event loop.

* [ ] Force termination fallback.

---

### DV-0652 — Capture Discord HTTP operations

* **Priority:** P1

* **Dependencies:** DV-0650

* [ ] Normalize route.

* [ ] Normalize method.

* [ ] Redact authorization.

* [ ] Record target guild.

* [ ] Record response metadata.

* [ ] Avoid unstable private internals where possible.

---

## M6.7 Example Projects

### DV-0660 — Build basic `discord.py` example

* **Priority:** P0
* **Dependencies:** DV-0640

Include:

* [ ] Slash command.
* [ ] Prefix command.
* [ ] Button.
* [ ] Select.
* [ ] Modal.
* [ ] Event.
* [ ] Error case.

---

### DV-0661 — Build advanced `discord.py` example

* **Priority:** P1
* **Dependencies:** DV-0660

Include:

* [ ] Cogs.
* [ ] Command groups.
* [ ] Persistent View.
* [ ] Deferred response.
* [ ] Follow-up.
* [ ] Database hook.
* [ ] Live role side effect.

---

### DV-0662 — Build Python adapter compatibility suite

* **Priority:** P0

* **Dependencies:** DV-0660, DV-0661

* [ ] Python 3.10.

* [ ] Python 3.11.

* [ ] Python 3.12.

* [ ] Python 3.13 where supported.

* [ ] Standard commands.

* [ ] Cogs.

* [ ] App commands.

* [ ] Custom adapter.

---

## M6 Release Gate

* [ ] Required feature parity with `discord.js` adapter.
* [ ] Async errors are captured.
* [ ] Worker protocol passes.
* [ ] Python runtime resolution works.
* [ ] Example projects pass.
* [ ] Python project secrets remain redacted.

---

# Milestone M7 — Fixtures, Assertions, and Scenarios

## Goal

Create the reusable test-definition system used by humans, agents, and CI.

---

## M7.1 Fixtures

### DV-0700 — Define fixture schema

* **Priority:** P0

* **Dependencies:** M5, M6

* [ ] Fixture version.

* [ ] Feature type.

* [ ] Target.

* [ ] Context.

* [ ] Options.

* [ ] Values.

* [ ] Event payload.

* [ ] Expectations.

* [ ] Verification level.

* [ ] Cleanup policy.

* [ ] Tags.

---

### DV-0701 — Implement fixture loader

* **Priority:** P0

* **Dependencies:** DV-0700

* [ ] JSON loading.

* [ ] Path resolution.

* [ ] Schema validation.

* [ ] Error locations.

* [ ] Safe environment references.

* [ ] No arbitrary code execution.

---

### DV-0702 — Implement fixture inheritance

* **Priority:** P1

* **Dependencies:** DV-0701

* [ ] `extends`.

* [ ] Deep merge rules.

* [ ] Array merge rules.

* [ ] Circular inheritance detection.

* [ ] Source traceability.

---

### DV-0703 — Implement fixture variable resolution

* **Priority:** P0
* **Dependencies:** DV-0701

Variable sources:

* [ ] Environment names.
* [ ] Session variables.
* [ ] Named users.
* [ ] Named members.
* [ ] Named roles.
* [ ] Named channels.
* [ ] Generated UUID.
* [ ] Generated timestamp.
* [ ] Previous step outputs.
* [ ] Secret references without serialization.

---

### DV-0704 — Implement CLI fixture overrides

* **Priority:** P1
* **Dependencies:** DV-0701

Syntax:

```powershell
discord-verify test slash ping --set context.user.id=123
```

* [ ] Typed parsing.
* [ ] Nested paths.
* [ ] Clear errors.
* [ ] No secret values in process-list-sensitive arguments.
* [ ] Warn against passing secrets.

---

## M7.2 Assertions

### DV-0710 — Define assertion schema

* **Priority:** P0
* **Dependencies:** DV-0700

Operators:

* [ ] Equals.
* [ ] Not equals.
* [ ] Contains.
* [ ] Not contains.
* [ ] Starts with.
* [ ] Ends with.
* [ ] Regex.
* [ ] Exists.
* [ ] Absent.
* [ ] Type.
* [ ] Length.
* [ ] Greater than.
* [ ] Greater than or equal.
* [ ] Less than.
* [ ] Less than or equal.
* [ ] Partial match.
* [ ] Collection contains.
* [ ] Collection excludes.

---

### DV-0711 — Implement assertion engine

* **Priority:** P0

* **Dependencies:** DV-0710

* [ ] JSON path resolution.

* [ ] Helpful expected/actual values.

* [ ] Safe truncation.

* [ ] Redaction.

* [ ] Multiple assertions.

* [ ] Stop-on-first-failure option.

* [ ] Continue-by-default policy.

---

### DV-0712 — Implement Discord response assertions

* **Priority:** P0

* **Dependencies:** DV-0711

* [ ] Content.

* [ ] Embeds.

* [ ] Fields.

* [ ] Footer.

* [ ] Components.

* [ ] Buttons.

* [ ] Selects.

* [ ] Modal.

* [ ] Ephemeral.

* [ ] Deferred.

* [ ] Follow-ups.

* [ ] Attachments.

---

### DV-0713 — Implement error assertions

* **Priority:** P1

* **Dependencies:** DV-0711

* [ ] Error code.

* [ ] Error type.

* [ ] Message.

* [ ] Cause.

* [ ] Stack presence.

* [ ] Expected failure support.

---

### DV-0714 — Implement timing assertions

* **Priority:** P1

* **Dependencies:** DV-0711

* [ ] Maximum duration.

* [ ] Minimum duration.

* [ ] Timeout expectation.

* [ ] Polling duration.

* [ ] Runtime phase durations.

---

### DV-0715 — Implement normalized snapshots

* **Priority:** P2

* **Dependencies:** DV-0712

* [ ] Snapshot format.

* [ ] ID normalization.

* [ ] Timestamp normalization.

* [ ] Path normalization.

* [ ] Secret redaction.

* [ ] Review/update workflow.

* [ ] Agent-safe behavior.

---

## M7.3 Scenario Engine

### DV-0720 — Define scenario schema

* **Priority:** P0

* **Dependencies:** DV-0700, DV-0710

* [ ] Name.

* [ ] Description.

* [ ] Tags.

* [ ] Required capabilities.

* [ ] Variables.

* [ ] Steps.

* [ ] Assertions.

* [ ] Cleanup.

* [ ] Timeout.

* [ ] Retry policy.

---

### DV-0721 — Implement step executor

* **Priority:** P0
* **Dependencies:** DV-0720

Actions:

* [ ] Invoke slash command.
* [ ] Invoke prefix command.
* [ ] Invoke context menu.
* [ ] Invoke autocomplete.
* [ ] Invoke button.
* [ ] Invoke select.
* [ ] Open modal.
* [ ] Submit modal.
* [ ] Emit event.
* [ ] Wait for condition.
* [ ] Assert response.
* [ ] Assert resource.
* [ ] Run hook.
* [ ] Cleanup resource.

---

### DV-0722 — Implement scenario variable flow

* **Priority:** P0

* **Dependencies:** DV-0721

* [ ] Step output references.

* [ ] Resource IDs.

* [ ] Response references.

* [ ] Conditional values.

* [ ] Generated values.

* [ ] Scope rules.

* [ ] Missing-value errors.

---

### DV-0723 — Implement conditional steps

* **Priority:** P1

* **Dependencies:** DV-0722

* [ ] Run if previous passed.

* [ ] Run if previous failed.

* [ ] Run if value exists.

* [ ] Skip reason.

* [ ] No arbitrary script evaluation.

---

### DV-0724 — Implement retry and polling steps

* **Priority:** P0

* **Dependencies:** DV-0721

* [ ] Maximum attempts.

* [ ] Poll interval.

* [ ] Exponential backoff option.

* [ ] Retryable errors.

* [ ] Final evidence.

* [ ] Rate-limit awareness.

---

### DV-0725 — Implement scenario validation command

* **Priority:** P1
* **Dependencies:** DV-0720

```powershell
discord-verify scenario validate ticket-create
```

* [ ] Schema validation.
* [ ] Target existence.
* [ ] Capability validation.
* [ ] Variable validation.
* [ ] Cleanup validation.
* [ ] Destructive-policy validation.

---

### DV-0726 — Implement scenario creation helper

* **Priority:** P2

* **Dependencies:** DV-0720

* [ ] Interactive generation.

* [ ] Non-interactive template generation.

* [ ] Framework-neutral format.

* [ ] No project code mutation.

---

## M7.4 Test Selection

### DV-0730 — Implement tags

* **Priority:** P1

* **Dependencies:** DV-0700, DV-0720

* [ ] Feature tags.

* [ ] Fixture tags.

* [ ] Scenario tags.

* [ ] Include filters.

* [ ] Exclude filters.

---

### DV-0731 — Implement required-test selection

* **Priority:** P1

* **Dependencies:** DV-0730

* [ ] Mark required scenarios.

* [ ] Run required suite.

* [ ] Fail when required scenario is missing.

* [ ] Report skipped optional scenarios.

---

### DV-0732 — Implement changed-feature detection

* **Priority:** P1

* **Dependencies:** DV-0413

* [ ] Accept changed file list.

* [ ] Use Git when available.

* [ ] Support explicit file arguments.

* [ ] Map source files to discovered features.

* [ ] Map shared files conservatively.

* [ ] Fall back to broader verification.

* [ ] Avoid mandatory Git dependency.

No implementation should rely on parsing `git diff` output as a public product requirement.

---

## M7 Release Gate

* [ ] Fixtures validate before execution.
* [ ] Scenarios can execute multi-step workflows.
* [ ] Assertions produce actionable diffs.
* [ ] Variables flow between steps.
* [ ] Changed-feature verification selects relevant tests.
* [ ] Invalid scenarios fail before project mutation.

---

# Milestone M8 — Live Discord Verification and Cleanup

## Goal

Safely verify real Discord state inside the configured test guild and clean created resources.

---

## M8.1 Discord API Client

### DV-0800 — Implement live verification client abstraction

* **Priority:** P0

* **Dependencies:** M2, M5, M6

* [ ] Use project bot authorization internally.

* [ ] Never expose authorization.

* [ ] Support rate limits.

* [ ] Support guild lock.

* [ ] Support request correlation.

* [ ] Capture safe metadata.

* [ ] Support cancellation.

---

### DV-0801 — Implement bot identity check

* **Priority:** P0

* **Dependencies:** DV-0800

* [ ] Fetch current bot identity.

* [ ] Match configured client/application ID when available.

* [ ] Detect invalid token.

* [ ] Detect wrong bot.

* [ ] Never return token.

---

### DV-0802 — Implement guild accessibility check

* **Priority:** P0

* **Dependencies:** DV-0800, DV-0221

* [ ] Fetch test guild.

* [ ] Validate allowed guild.

* [ ] Validate optional marker.

* [ ] Record safe guild metadata.

* [ ] Detect missing access.

---

## M8.2 Live Assertions

### DV-0810 — Implement channel assertions

* **Priority:** P0

* **Dependencies:** DV-0802

* [ ] Exists.

* [ ] Absent.

* [ ] Name.

* [ ] Type.

* [ ] Parent.

* [ ] Topic.

* [ ] Permission overwrites.

* [ ] Thread properties.

---

### DV-0811 — Implement message assertions

* **Priority:** P0

* **Dependencies:** DV-0802

* [ ] Exists.

* [ ] Absent.

* [ ] Content.

* [ ] Embeds.

* [ ] Components.

* [ ] Attachments.

* [ ] Author.

* [ ] Reply reference.

* [ ] Reactions.

---

### DV-0812 — Implement role assertions

* **Priority:** P0

* **Dependencies:** DV-0802

* [ ] Exists.

* [ ] Absent.

* [ ] Name.

* [ ] Permissions.

* [ ] Position.

* [ ] Color.

* [ ] Mentionable.

* [ ] Member assignment.

---

### DV-0813 — Implement member assertions

* **Priority:** P0

* **Dependencies:** DV-0802

* [ ] Exists.

* [ ] Roles.

* [ ] Nickname.

* [ ] Timeout.

* [ ] Permissions.

* [ ] Bot state.

* [ ] Voice state where available.

---

### DV-0814 — Implement command registration assertions

* **Priority:** P1

* **Dependencies:** DV-0800

* [ ] Guild command exists.

* [ ] Command schema.

* [ ] Options.

* [ ] Description.

* [ ] Permissions where exposed.

* [ ] Avoid destructive registration by default.

---

### DV-0815 — Implement generic resource assertion

* **Priority:** P1

* **Dependencies:** DV-0810, DV-0811, DV-0812, DV-0813

* [ ] Resource type.

* [ ] Resource ID.

* [ ] Query criteria.

* [ ] Polling.

* [ ] Normalization.

* [ ] Evidence attachment.

---

## M8.3 Resource Ledger

### DV-0820 — Implement resource-ledger API

* **Priority:** P0

* **Dependencies:** DV-0230

* [ ] Register created resource.

* [ ] Register modified resource.

* [ ] Register deleted resource.

* [ ] Record creating step.

* [ ] Record cleanup strategy.

* [ ] Record ownership confidence.

* [ ] Prevent secret fields.

---

### DV-0821 — Capture resources from adapter side effects

* **Priority:** P0

* **Dependencies:** DV-0304, DV-0820

* [ ] Channel creation.

* [ ] Role creation.

* [ ] Message creation.

* [ ] Thread creation.

* [ ] Webhook creation.

* [ ] Other supported resources.

* [ ] Distinguish pre-existing resources.

---

### DV-0822 — Implement cleanup dependency ordering

* **Priority:** P0
* **Dependencies:** DV-0820

Examples:

* [ ] Delete webhook before channel.
* [ ] Delete message before channel when required.
* [ ] Remove role assignment before role deletion.
* [ ] Delete child channel before category.
* [ ] Handle already-deleted resources.

---

### DV-0823 — Implement automatic cleanup

* **Priority:** P0

* **Dependencies:** DV-0822

* [ ] Cleanup after successful run.

* [ ] Cleanup after failed run.

* [ ] Cleanup after timeout.

* [ ] Cleanup after interrupt.

* [ ] Respect retain flag.

* [ ] Report failures.

---

### DV-0824 — Implement manual cleanup command

* **Priority:** P0
* **Dependencies:** DV-0823

```powershell
discord-verify cleanup --session <id>
discord-verify cleanup --all
discord-verify cleanup --dry-run
```

* [ ] Dry-run.
* [ ] Session targeting.
* [ ] All stale sessions.
* [ ] JSON output.
* [ ] Non-interactive mode.
* [ ] Safety authorization.
* [ ] Remaining-resource output.

---

## M8.4 Rate Limits and Polling

### DV-0830 — Implement concurrency controller

* **Priority:** P0

* **Dependencies:** DV-0800

* [ ] Limit live requests.

* [ ] Limit concurrent scenarios.

* [ ] Support config override.

* [ ] Prevent uncontrolled bursts.

* [ ] Report queue timing.

---

### DV-0831 — Implement Discord-aware retry logic

* **Priority:** P0

* **Dependencies:** DV-0800

* [ ] Respect retry-after.

* [ ] Classify rate limits.

* [ ] Avoid retrying invalid requests.

* [ ] Bound retry duration.

* [ ] Emit trace details.

---

### DV-0832 — Implement eventual-consistency poller

* **Priority:** P0

* **Dependencies:** DV-0815

* [ ] Timeout.

* [ ] Interval.

* [ ] Backoff.

* [ ] Last observed state.

* [ ] Assertion integration.

* [ ] Cancellation.

---

## M8 Release Gate

* [ ] Bot identity and guild access can be validated.
* [ ] Live assertions work for channels, messages, roles, and members.
* [ ] Resource ledger records created resources.
* [ ] Cleanup runs after success, failure, timeout, and interruption.
* [ ] Cross-guild operations remain blocked.
* [ ] Rate-limit handling works without uncontrolled retries.

---

# Milestone M9 — Reports, Agent Guide, and CI Experience

## Goal

Provide polished outputs for humans, agents, and CI systems.

---

## M9.1 Verification Orchestration

### DV-0900 — Implement `test` command orchestration

* **Priority:** P0

* **Dependencies:** M5, M6, M7, M8

* [ ] Resolve target.

* [ ] Resolve fixture.

* [ ] Validate capability.

* [ ] Start adapter.

* [ ] Start bot if needed.

* [ ] Invoke target.

* [ ] Run assertions.

* [ ] Run live checks.

* [ ] Run cleanup.

* [ ] Return result.

---

### DV-0901 — Implement `verify` command orchestration

* **Priority:** P0

* **Dependencies:** DV-0900

* [ ] `--all`.

* [ ] `--changed`.

* [ ] `--tag`.

* [ ] `--type`.

* [ ] `--scenario`.

* [ ] `--required`.

* [ ] Aggregate results.

* [ ] Resolve final exit code.

* [ ] Preserve partial results.

---

### DV-0902 — Implement `start` command

* **Priority:** P1

* **Dependencies:** DV-0550, DV-0650

* [ ] Select adapter.

* [ ] Start runtime.

* [ ] Wait for ready.

* [ ] Persist managed process.

* [ ] Return process metadata.

* [ ] Support JSON.

---

### DV-0903 — Implement `stop` command

* **Priority:** P1

* **Dependencies:** DV-0551, DV-0651

* [ ] Resolve managed session.

* [ ] Stop gracefully.

* [ ] Force fallback.

* [ ] Clean process metadata.

* [ ] Support JSON.

---

## M9.2 Reports

### DV-0910 — Define report schema

* **Priority:** P0
* **Dependencies:** DV-0110, DV-0901

Include:

* [ ] Project metadata.
* [ ] Adapter metadata.
* [ ] Environment profile.
* [ ] Test summary.
* [ ] Test results.
* [ ] Assertions.
* [ ] Responses.
* [ ] Side effects.
* [ ] Limitations.
* [ ] Cleanup.
* [ ] Warnings.
* [ ] Errors.
* [ ] No secrets.

---

### DV-0911 — Implement JSON report writer

* **Priority:** P0

* **Dependencies:** DV-0910

* [ ] Schema validation.

* [ ] Atomic writing.

* [ ] Stable ordering.

* [ ] Redaction.

* [ ] Optional pretty format.

* [ ] Session linkage.

---

### DV-0912 — Implement Markdown report writer

* **Priority:** P0

* **Dependencies:** DV-0910

* [ ] Summary.

* [ ] Passed tests.

* [ ] Failed tests.

* [ ] Manual-required tests.

* [ ] Evidence.

* [ ] Limitations.

* [ ] Cleanup.

* [ ] Recommended next actions.

---

### DV-0913 — Implement JUnit report writer

* **Priority:** P0

* **Dependencies:** DV-0910

* [ ] Passed → test case.

* [ ] Failed assertion → failure.

* [ ] Adapter/config error → error.

* [ ] Manual required → skipped.

* [ ] Timing.

* [ ] Safe diagnostic output.

---

### DV-0914 — Implement report commands

* **Priority:** P1
* **Dependencies:** DV-0911, DV-0912, DV-0913

```powershell
discord-verify report list
discord-verify report show <session>
discord-verify report export <session>
```

* [ ] Human mode.
* [ ] JSON mode.
* [ ] Format selection.
* [ ] Missing-session errors.

---

## M9.3 Human UX

### DV-0920 — Implement interactive test selector

* **Priority:** P1

* **Dependencies:** DV-0900

* [ ] Feature type.

* [ ] Target.

* [ ] Fixture.

* [ ] Verification level.

* [ ] Live mode.

* [ ] Cleanup policy.

* [ ] Confirmation for destructive actions.

---

### DV-0921 — Implement human failure diff

* **Priority:** P1

* **Dependencies:** DV-0711

* [ ] Expected vs actual.

* [ ] Object diff.

* [ ] Collection diff.

* [ ] Response timeline.

* [ ] Source location.

* [ ] Suggested next action.

---

### DV-0922 — Implement progress events

* **Priority:** P2

* **Dependencies:** DV-0901

* [ ] Human-only progress.

* [ ] No JSON stdout.

* [ ] No CI animation.

* [ ] Current test.

* [ ] Cleanup status.

* [ ] Polling state.

---

## M9.4 Agent Experience

### DV-0930 — Validate all commands in agent mode

* **Priority:** P0
* **Dependencies:** DV-0901

For every command:

* [ ] `--json`.
* [ ] `--non-interactive`.
* [ ] `--no-color`.
* [ ] No prompts.
* [ ] Stable error codes.
* [ ] Stable exit codes.
* [ ] Valid JSON.
* [ ] No secrets.

---

### DV-0931 — Add agent workflow integration tests

* **Priority:** P0
* **Dependencies:** DV-0930

Simulate:

1. [ ] Read instructions.
2. [ ] Run doctor.
3. [ ] Run discovery.
4. [ ] Run targeted test.
5. [ ] Parse failure.
6. [ ] Re-run passing test.
7. [ ] Run changed verification.
8. [ ] Cleanup.
9. [ ] Read report.

---

### DV-0932 — Add remediation guidance

* **Priority:** P1
* **Dependencies:** DV-0111

Errors should include machine-readable resolutions:

```json
{
  "resolution": {
    "type": "set_config",
    "path": "project.entryPoint",
    "example": "src/index.ts"
  }
}
```

Resolution types:

* [ ] Set config.
* [ ] Set environment mapping.
* [ ] Install runtime.
* [ ] Add fixture field.
* [ ] Add adapter mapping.
* [ ] Enable permission.
* [ ] Use manual verification.
* [ ] Run cleanup.

---

### DV-0933 — Finalize `DISCORD_VERIFY.md`

* **Priority:** P0

* **Dependencies:** DV-0441, DV-0930

* [ ] Verify every documented command.

* [ ] Include project-specific examples.

* [ ] Include agent safety rules.

* [ ] Include limitations.

* [ ] Include exact exit codes.

* [ ] Include retry workflow.

* [ ] Include cleanup workflow.

* [ ] Include report workflow.

---

## M9.5 CI Integration

### DV-0940 — Add CI example for GitHub Actions

* **Priority:** P1

* **Dependencies:** DV-0913, DV-0930

* [ ] Install package.

* [ ] Configure secrets.

* [ ] Run doctor.

* [ ] Run required suite.

* [ ] Upload reports.

* [ ] Publish JUnit.

* [ ] Cleanup in always step.

* [ ] Avoid token output.

---

### DV-0941 — Add generic CI documentation

* **Priority:** P1

* **Dependencies:** DV-0940

* [ ] Process environment.

* [ ] Non-interactive mode.

* [ ] Exit codes.

* [ ] Report paths.

* [ ] Cleanup.

* [ ] Rate limits.

* [ ] Dedicated test guild recommendation.

---

## M9 Release Gate

* [ ] Humans can run tests interactively.
* [ ] Agents can run all verification commands without prompts.
* [ ] JSON, Markdown, and JUnit reports work.
* [ ] `DISCORD_VERIFY.md` commands are tested.
* [ ] CI example completes full verification and cleanup.

---

# Milestone M10 — Hardening, Compatibility, and Security

## Goal

Eliminate release-blocking reliability, security, and compatibility issues.

---

## M10.1 Security Hardening

### DV-1000 — Conduct secret-flow audit

* **Priority:** P0
* **Dependencies:** M9

Audit:

* [ ] Environment loading.
* [ ] Child-process spawning.
* [ ] Adapter messages.
* [ ] Errors.
* [ ] Logs.
* [ ] Reports.
* [ ] Sessions.
* [ ] Traces.
* [ ] CI artifacts.
* [ ] Generated guides.

---

### DV-1001 — Conduct guild-isolation audit

* **Priority:** P0
* **Dependencies:** M8

Test:

* [ ] Fixture attempts other guild.
* [ ] Scenario attempts other guild.
* [ ] Adapter reports other guild.
* [ ] Live API request targets other guild.
* [ ] Cleanup targets other guild.
* [ ] Custom adapter attempts bypass.
* [ ] Empty guild configuration.

---

### DV-1002 — Conduct destructive-action audit

* **Priority:** P0
* **Dependencies:** DV-0223, M8

Test:

* [ ] Delete channel.
* [ ] Delete role.
* [ ] Kick.
* [ ] Ban.
* [ ] Bulk delete.
* [ ] Permission overwrite.
* [ ] Database reset hook.
* [ ] Interactive confirmation.
* [ ] Non-interactive authorization.
* [ ] Configuration authorization.

---

### DV-1003 — Add untrusted-project warning

* **Priority:** P1

* **Dependencies:** DV-0320

* [ ] Warn before executing target code interactively.

* [ ] Require explicit acknowledgement in special untrusted mode.

* [ ] Document repository trust boundary.

* [ ] Avoid false impression of sandboxing.

---

### DV-1004 — Add dependency security scanning

* **Priority:** P1

* **Dependencies:** M0

* [ ] npm audit policy.

* [ ] Python dependency scan.

* [ ] License scan.

* [ ] Supply-chain workflow.

* [ ] Release blocking for critical issues.

---

## M10.2 Reliability

### DV-1010 — Add chaos tests for adapter failures

* **Priority:** P0

* **Dependencies:** DV-0323

* [ ] Crash during initialize.

* [ ] Crash during discovery.

* [ ] Crash during invocation.

* [ ] Crash during cleanup.

* [ ] Invalid JSON.

* [ ] Infinite output.

* [ ] Hung process.

* [ ] Partial response.

---

### DV-1011 — Add interruption tests

* **Priority:** P0

* **Dependencies:** DV-0232, DV-0823

* [ ] Interrupt during startup.

* [ ] Interrupt during handler.

* [ ] Interrupt during live polling.

* [ ] Interrupt during cleanup.

* [ ] Interrupt during report write.

* [ ] Verify recoverable session.

---

### DV-1012 — Add stale-session recovery

* **Priority:** P1

* **Dependencies:** DV-0231

* [ ] Detect stale PID.

* [ ] Detect missing process.

* [ ] Detect incomplete report.

* [ ] Offer cleanup.

* [ ] Offer session repair.

* [ ] Avoid deleting active sessions.

---

### DV-1013 — Add atomic report recovery

* **Priority:** P1

* **Dependencies:** DV-0911

* [ ] Temporary write.

* [ ] Atomic replace.

* [ ] Corrupt file detection.

* [ ] Preserve last valid report.

* [ ] Cross-platform validation.

---

## M10.3 Compatibility

### DV-1020 — Build cross-platform end-to-end suite

* **Priority:** P0
* **Dependencies:** M9

Scenarios:

* [ ] Init.
* [ ] Doctor.
* [ ] Discover.
* [ ] Test slash.
* [ ] Test prefix.
* [ ] Test component.
* [ ] Test modal.
* [ ] Test event.
* [ ] Verify.
* [ ] Report.
* [ ] Cleanup.

Platforms:

* [ ] Windows.
* [ ] Ubuntu.
* [ ] macOS.

---

### DV-1021 — Validate paths with spaces and Unicode

* **Priority:** P0

* **Dependencies:** DV-1020

* [ ] Project path with spaces.

* [ ] User path with Unicode.

* [ ] Report path with spaces.

* [ ] Python environment path with spaces.

* [ ] Windows drive path.

* [ ] Relative path handling.

---

### DV-1022 — Validate monorepo projects

* **Priority:** P1

* **Dependencies:** DV-0400

* [ ] npm workspace.

* [ ] pnpm workspace.

* [ ] Python monorepo.

* [ ] Multiple Discord bots.

* [ ] Explicit package selection.

* [ ] Ambiguous root handling.

---

### DV-1023 — Validate supported framework version range

* **Priority:** P0

* **Dependencies:** M5, M6

* [ ] Lowest supported `discord.js v14` minor.

* [ ] Latest supported `discord.js v14` minor.

* [ ] Supported `discord.py 2.x` versions.

* [ ] Clear unsupported-version error.

* [ ] Compatibility matrix documentation.

---

## M10.4 Performance

### DV-1030 — Add performance benchmarks

* **Priority:** P1
* **Dependencies:** M9

Measure:

* [ ] Version command.
* [ ] Doctor.
* [ ] Static discovery.
* [ ] Worker startup.
* [ ] One handler test.
* [ ] Ten-handler suite.
* [ ] Report serialization.
* [ ] Cleanup startup.

---

### DV-1031 — Optimize static discovery

* **Priority:** P2

* **Dependencies:** DV-1030

* [ ] Cache file metadata.

* [ ] Avoid parsing ignored files.

* [ ] Parallel parsing with bounds.

* [ ] Reuse parse results.

* [ ] Preserve deterministic ordering.

---

### DV-1032 — Optimize adapter startup

* **Priority:** P2

* **Dependencies:** DV-1030

* [ ] Lazy imports.

* [ ] Worker reuse per session.

* [ ] Avoid duplicate project startup.

* [ ] Cache capability metadata safely.

* [ ] Avoid persistent secret cache.

---

## M10 Release Gate

* [ ] Secret-flow audit passes.
* [ ] Cross-guild attacks are blocked.
* [ ] Destructive operations require explicit authorization.
* [ ] Crash and interruption tests preserve partial results.
* [ ] End-to-end tests pass on all supported operating systems.
* [ ] Framework compatibility matrix passes.

---

# Milestone M11 — Release Candidate

## Goal

Prepare a complete, documented, installable release candidate and validate it with external-style projects.

---

## M11.1 Documentation

### DV-1100 — Write root README

* **Priority:** P0
* **Dependencies:** M10

Include:

* [ ] Product purpose.
* [ ] Installation.
* [ ] Quick start.
* [ ] Supported frameworks.
* [ ] Human workflow.
* [ ] Agent workflow.
* [ ] Safety model.
* [ ] Verification levels.
* [ ] Example output.
* [ ] Limitations.
* [ ] Links to documentation.

---

### DV-1101 — Write CLI reference

* **Priority:** P0
* **Dependencies:** M10

Document every:

* [ ] Command.
* [ ] Subcommand.
* [ ] Option.
* [ ] Exit code.
* [ ] Environment behavior.
* [ ] JSON schema.
* [ ] Example.
* [ ] Safety requirement.

---

### DV-1102 — Write configuration reference

* **Priority:** P0

* **Dependencies:** DV-0200

* [ ] Every config field.

* [ ] Defaults.

* [ ] Profiles.

* [ ] Environment mappings.

* [ ] Safety.

* [ ] Hooks.

* [ ] Adapter config.

* [ ] Examples for both frameworks.

---

### DV-1103 — Write adapter authoring guide

* **Priority:** P1

* **Dependencies:** M5, M6

* [ ] Protocol.

* [ ] Capabilities.

* [ ] Lifecycle.

* [ ] Discovery.

* [ ] Invocation.

* [ ] Response capture.

* [ ] Cleanup.

* [ ] Contract tests.

* [ ] Security requirements.

---

### DV-1104 — Write fixture and scenario guide

* **Priority:** P0

* **Dependencies:** M7

* [ ] Fixture schema.

* [ ] Contexts.

* [ ] Assertions.

* [ ] Variables.

* [ ] Multi-step scenarios.

* [ ] Live checks.

* [ ] Cleanup.

* [ ] Examples.

---

### DV-1105 — Write security guide

* **Priority:** P0

* **Dependencies:** M10

* [ ] Token handling.

* [ ] Test guilds.

* [ ] Destructive operations.

* [ ] Production database risk.

* [ ] Untrusted repositories.

* [ ] CI secrets.

* [ ] No self-bots.

* [ ] Incident response.

---

### DV-1106 — Write troubleshooting guide

* **Priority:** P1

* **Dependencies:** M10

* [ ] Framework not detected.

* [ ] Entry point ambiguous.

* [ ] Bot startup failure.

* [ ] Wrong token.

* [ ] Missing intents.

* [ ] Missing permissions.

* [ ] Adapter timeout.

* [ ] Cleanup failure.

* [ ] JSON parse issues.

* [ ] Windows path issues.

* [ ] Python environment issues.

---

## M11.2 Packaging

### DV-1110 — Configure npm package

* **Priority:** P0

* **Dependencies:** M10

* [ ] Package metadata.

* [ ] Binary mapping.

* [ ] Published files.

* [ ] License.

* [ ] Repository links.

* [ ] Engine requirements.

* [ ] Package exports.

* [ ] Python bridge inclusion.

* [ ] Schema inclusion.

* [ ] Template inclusion.

---

### DV-1111 — Add package-content validation

* **Priority:** P0
* **Dependencies:** DV-1110

Validate:

* [ ] CLI executable present.
* [ ] Built files present.
* [ ] Declaration files present where required.
* [ ] Python bridge present.
* [ ] Schemas present.
* [ ] Templates present.
* [ ] No test secrets.
* [ ] No development caches.
* [ ] No oversized unnecessary files.

---

### DV-1112 — Test packed package installation

* **Priority:** P0

* **Dependencies:** DV-1111

* [ ] Install tarball in clean `discord.js` project.

* [ ] Install tarball in clean `discord.py` project.

* [ ] Run version.

* [ ] Run init.

* [ ] Run doctor.

* [ ] Run discovery.

* [ ] Run smoke test.

* [ ] Run cleanup.

---

## M11.3 External-Style Validation

### DV-1120 — Validate against conventional public-style `discord.js` architecture

* **Priority:** P0

* **Dependencies:** DV-1112

* [ ] Dynamic commands.

* [ ] Event loader.

* [ ] Buttons.

* [ ] Modal.

* [ ] Environment mapping.

* [ ] Custom start command.

---

### DV-1121 — Validate against conventional public-style `discord.py` architecture

* **Priority:** P0

* **Dependencies:** DV-1112

* [ ] Cogs.

* [ ] App commands.

* [ ] Views.

* [ ] Modal.

* [ ] Environment mapping.

* [ ] uv or Poetry environment.

---

### DV-1122 — Conduct agent usability test

* **Priority:** P0
* **Dependencies:** DV-0933, DV-1112

Test conditions:

* [ ] Agent sees repository and `DISCORD_VERIFY.md`.
* [ ] Agent receives no extra verbal instructions.
* [ ] Agent runs doctor.
* [ ] Agent runs discovery.
* [ ] Agent runs targeted verification.
* [ ] Agent interprets failure.
* [ ] Agent re-runs verification.
* [ ] Agent runs cleanup.
* [ ] Agent reports evidence correctly.

---

### DV-1123 — Conduct human usability test

* **Priority:** P1

* **Dependencies:** DV-0920, DV-1112

* [ ] New developer installs package.

* [ ] Runs interactive init.

* [ ] Runs interactive test.

* [ ] Understands results.

* [ ] Cleans resources.

* [ ] Completes without reading source code.

---

## M11.4 Release Candidate

### DV-1130 — Publish prerelease package

* **Priority:** P0
* **Dependencies:** DV-1112, DV-1120, DV-1121

Suggested tag:

```text
discord-verify@1.0.0-rc.1
```

* [ ] Publish with prerelease tag.
* [ ] Verify package provenance where available.
* [ ] Verify package installation.
* [ ] Collect issue reports.
* [ ] Do not mark as stable.

---

### DV-1131 — Run release-candidate soak period

* **Priority:** P1

* **Dependencies:** DV-1130

* [ ] Track crashes.

* [ ] Track adapter failures.

* [ ] Track secret incidents.

* [ ] Track cleanup failures.

* [ ] Track unsupported architectures.

* [ ] Track misleading verification results.

* [ ] Fix P0 and P1 regressions.

---

## M11 Release Gate

* [ ] Documentation is complete.
* [ ] Packed package works in clean projects.
* [ ] Agent usability test passes without MCP.
* [ ] Human usability test passes.
* [ ] Release candidate is published.
* [ ] No open P0 issues.
* [ ] No known secret leaks.
* [ ] No known cross-guild bypass.
* [ ] No known cleanup data-loss issue.

---

# Milestone M12 — Public Version 1.0.0 Release

## Goal

Publish a stable release that satisfies the PRD definition of done.

---

### DV-1200 — Final version audit

* **Priority:** P0

* **Dependencies:** M11

* [ ] Confirm CLI version.

* [ ] Confirm schema versions.

* [ ] Confirm adapter protocol version.

* [ ] Confirm package versions.

* [ ] Confirm documentation versions.

* [ ] Confirm compatibility matrix.

* [ ] Confirm changelog.

---

### DV-1201 — Final security release audit

* **Priority:** P0

* **Dependencies:** DV-1200

* [ ] Secret scans.

* [ ] Dependency scans.

* [ ] Package-content scan.

* [ ] Guild-isolation tests.

* [ ] Destructive-policy tests.

* [ ] Session and report scans.

* [ ] CI artifact scans.

---

### DV-1202 — Final release test matrix

* **Priority:** P0

* **Dependencies:** DV-1200

* [ ] Windows.

* [ ] Ubuntu.

* [ ] macOS.

* [ ] Supported Node.js versions.

* [ ] Supported Python versions.

* [ ] `discord.js` basic example.

* [ ] `discord.js` advanced example.

* [ ] `discord.py` basic example.

* [ ] `discord.py` advanced example.

* [ ] Agent workflow.

* [ ] CI workflow.

* [ ] Cleanup workflow.

---

### DV-1203 — Publish `1.0.0`

* **Priority:** P0

* **Dependencies:** DV-1201, DV-1202

* [ ] Publish npm package.

* [ ] Tag repository.

* [ ] Generate release notes.

* [ ] Publish changelog.

* [ ] Verify `npx discord-verify version`.

* [ ] Verify package page metadata.

* [ ] Verify documentation links.

---

### DV-1204 — Create post-release monitoring plan

* **Priority:** P1
* **Dependencies:** DV-1203

Monitor:

* [ ] Installation failures.
* [ ] Adapter crashes.
* [ ] Framework incompatibility.
* [ ] Secret-leak reports.
* [ ] Cleanup failures.
* [ ] Incorrect verification claims.
* [ ] Windows issues.
* [ ] Python environment issues.

---

### DV-1205 — Create `1.0.x` maintenance backlog

* **Priority:** P1
* **Dependencies:** DV-1203

Include:

* [ ] Compatibility patches.
* [ ] Documentation improvements.
* [ ] Discovery improvements.
* [ ] Performance improvements.
* [ ] Additional examples.
* [ ] Non-breaking schema additions.

---

# 7. Cross-Cutting Test Matrix

Every major feature must be tested across the following dimensions where applicable.

## Framework

* [ ] `discord.js v14`
* [ ] `discord.py 2.x`

## Operating System

* [ ] Windows
* [ ] Linux
* [ ] macOS

## Mode

* [ ] Interactive human mode
* [ ] Non-interactive agent mode
* [ ] CI mode
* [ ] JSON mode
* [ ] No-color mode
* [ ] Trace mode

## Verification Level

* [ ] `HANDLER`
* [ ] `SIMULATED`
* [ ] `HYBRID`
* [ ] `LIVE_API`
* [ ] `MANUAL_REQUIRED`

## Feature Type

* [ ] Slash command
* [ ] Prefix command
* [ ] Context menu
* [ ] Autocomplete
* [ ] Button
* [ ] Select menu
* [ ] Modal
* [ ] Event
* [ ] Error handler

## Outcome

* [ ] Pass
* [ ] Assertion failure
* [ ] Handler exception
* [ ] Timeout
* [ ] Adapter crash
* [ ] Configuration failure
* [ ] Safety block
* [ ] Cleanup failure
* [ ] Manual required
* [ ] User interrupt

---

# 8. Public CLI Checklist

The following commands must exist before version `1.0.0`.

```text
discord-verify
discord-verify init
discord-verify doctor
discord-verify discover
discord-verify list
discord-verify start
discord-verify stop
discord-verify test
discord-verify test slash
discord-verify test prefix
discord-verify test context
discord-verify test autocomplete
discord-verify test button
discord-verify test select
discord-verify test modal
discord-verify test event
discord-verify verify
discord-verify scenario
discord-verify scenario list
discord-verify scenario run
discord-verify scenario validate
discord-verify scenario create
discord-verify report
discord-verify report list
discord-verify report show
discord-verify report export
discord-verify cleanup
discord-verify config
discord-verify config show
discord-verify config validate
discord-verify config paths
discord-verify instructions
discord-verify version
```

Every relevant command must support:

```text
--json
--non-interactive
--no-color
--config
--cwd
--profile
--timeout
```

Modifying commands must support where applicable:

```text
--dry-run
--yes
--force
```

---

# 9. Public Schema Checklist

Before version `1.0.0`, publish and test schemas for:

* [ ] Configuration.
* [ ] Command result.
* [ ] Error.
* [ ] Doctor result.
* [ ] Discovery result.
* [ ] Feature.
* [ ] Fixture.
* [ ] Scenario.
* [ ] Assertion.
* [ ] Test result.
* [ ] Verification report.
* [ ] Session.
* [ ] Resource ledger.
* [ ] Adapter request.
* [ ] Adapter response.
* [ ] Adapter capability document.

Every schema must:

* [ ] Include a version.
* [ ] Have tests.
* [ ] Have at least one valid example.
* [ ] Have at least one invalid example.
* [ ] Avoid secret-bearing fields unless explicitly marked and never serialized.

---

# 10. Security Release Checklist

Version `1.0.0` must not ship until all items pass.

## Secrets

* [ ] Token never accepted as normal CLI argument.
* [ ] Token never printed.
* [ ] Token never written to configuration.
* [ ] Token never written to sessions.
* [ ] Token never written to reports.
* [ ] Token never sent in adapter protocol messages.
* [ ] Authorization headers are redacted.
* [ ] Webhook tokens are redacted.
* [ ] Database credentials are redacted.
* [ ] Trace mode remains redacted.

## Discord Safety

* [ ] Live guild is required.
* [ ] Every live request is guild-authorized.
* [ ] Cross-guild fixtures are rejected.
* [ ] Cross-guild scenarios are rejected.
* [ ] Cross-guild adapter operations are rejected.
* [ ] Destructive operations are off by default.
* [ ] Explicit authorization is required.
* [ ] Optional guild marker works.

## Project Safety

* [ ] Untrusted-project warning exists.
* [ ] No false sandbox claim.
* [ ] Import side effects are documented.
* [ ] Database test-profile risks are detected.
* [ ] Cleanup is best effort and honestly reported.

---

# 11. Documentation Checklist

Required documentation before `1.0.0`:

* [ ] `README.md`
* [ ] `docs/PRD.md`
* [ ] `docs/TASKS.md`
* [ ] `docs/CLI.md`
* [ ] `docs/CONFIGURATION.md`
* [ ] `docs/FIXTURES.md`
* [ ] `docs/SCENARIOS.md`
* [ ] `docs/ADAPTERS.md`
* [ ] `docs/SECURITY.md`
* [ ] `docs/TROUBLESHOOTING.md`
* [ ] `docs/CI.md`
* [ ] `CONTRIBUTING.md`
* [ ] `SECURITY.md`
* [ ] `CHANGELOG.md`
* [ ] `LICENSE`

Generated project documentation:

* [ ] `DISCORD_VERIFY.md`
* [ ] `.discord-verify/README.md`
* [ ] Custom adapter README when generated.

---

# 12. Suggested Parallel Workstreams

After M3 is stable, work can proceed in parallel.

## Workstream A — Core CLI

Owns:

* CLI.
* Configuration.
* Sessions.
* Reports.
* JSON contracts.
* Human UX.

## Workstream B — Adapter Protocol

Owns:

* Protocol.
* Worker process.
* Contract tests.
* Lifecycle.
* Error isolation.

## Workstream C — `discord.js`

Owns:

* Discovery.
* Test facades.
* Invocation.
* Runtime.
* Examples.
* Compatibility.

## Workstream D — `discord.py`

Owns:

* Python worker.
* Discovery.
* Test contexts.
* Invocation.
* Runtime.
* Examples.
* Compatibility.

## Workstream E — Scenarios

Owns:

* Fixtures.
* Assertions.
* Variables.
* Scenarios.
* Changed-feature selection.

## Workstream F — Live and Security

Owns:

* Discord API.
* Guild lock.
* Destructive policy.
* Resource ledger.
* Cleanup.
* Redaction audits.

## Workstream G — Documentation and Release

Owns:

* Guides.
* Agent experience.
* CI examples.
* npm packaging.
* Release process.

---

# 13. Critical Dependency Path

The shortest path to a usable proof of concept is:

```text
DV-0001
→ DV-0003
→ DV-0100
→ DV-0110
→ DV-0200
→ DV-0300
→ DV-0311
→ DV-0320
→ DV-0401
→ DV-0500
→ DV-0510
→ DV-0521
→ DV-0530
→ DV-0540
→ DV-0700
→ DV-0711
→ DV-0900
```

This path should produce:

```powershell
discord-verify test slash ping --json --non-interactive
```

for one conventional `discord.js v14` example.

The corresponding Python path is:

```text
DV-0402
→ DV-0600
→ DV-0601
→ DV-0603
→ DV-0610
→ DV-0621
→ DV-0630
→ DV-0640
```

---

# 14. First Demonstrable Prototype

The first internal prototype is complete when the following workflow succeeds:

```powershell
discord-verify init --dry-run --json --non-interactive
discord-verify doctor --json --non-interactive
discord-verify discover --json --non-interactive
discord-verify test slash ping --json --non-interactive
```

The prototype may initially support only:

* One conventional `discord.js v14` example.
* One slash command.
* Handler-level verification.
* One content assertion.

Prototype acceptance:

* [ ] JSON stdout parses.
* [ ] Secret token does not appear.
* [ ] Real command handler executes.
* [ ] Reply is captured.
* [ ] Assertion result is returned.
* [ ] Exit code is correct.
* [ ] Worker shuts down.

This prototype is not a public MVP.

---

# 15. Internal Alpha Criteria

Internal alpha requires:

* [ ] Both framework workers start.
* [ ] Slash and prefix invocation work.
* [ ] Buttons and modals work.
* [ ] Events work.
* [ ] Fixtures work.
* [ ] Assertions work.
* [ ] JSON reports work.
* [ ] Guild lock works.
* [ ] Basic cleanup works.
* [ ] `DISCORD_VERIFY.md` is generated.

---

# 16. Public Beta Criteria

Public beta requires:

* [ ] Full required feature types for both frameworks.
* [ ] Scenario engine.
* [ ] Live Discord assertions.
* [ ] Resource ledger.
* [ ] Cleanup recovery.
* [ ] Markdown and JUnit reports.
* [ ] Cross-platform CI.
* [ ] Security audit.
* [ ] Agent workflow validation.
* [ ] Complete documentation.
* [ ] Prerelease npm package.

---

# 17. Version 1.0.0 Final Gate

Version `1.0.0` may be released only when:

* [ ] All P0 tasks are complete.
* [ ] All version-1 P1 tasks are complete or explicitly approved for deferral.
* [ ] No open P0 bugs exist.
* [ ] No known secret leaks exist.
* [ ] No known guild-isolation bypass exists.
* [ ] No known destructive-action bypass exists.
* [ ] Both adapters pass contract tests.
* [ ] Both basic example projects pass.
* [ ] Both advanced example projects pass.
* [ ] Windows tests pass.
* [ ] Linux tests pass.
* [ ] macOS tests pass.
* [ ] Agent workflow passes without MCP.
* [ ] Human interactive workflow passes.
* [ ] CI workflow passes.
* [ ] Cleanup recovery passes.
* [ ] Package tarball validation passes.
* [ ] Documentation is complete.
* [ ] Changelog is complete.
* [ ] Security policy is published.
* [ ] npm package provenance is enabled where possible.

---

# 18. Deferred Post-v1 Backlog

The following tasks are intentionally outside the version-1 commitment.

* [ ] Optional MCP wrapper.
* [ ] py-cord adapter.
* [ ] nextcord adapter.
* [ ] disnake adapter.
* [ ] Eris adapter.
* [ ] Oceanic.js adapter.
* [ ] Java JDA adapter.
* [ ] Discord.Net adapter.
* [ ] Rust Serenity adapter.
* [ ] Voice testing.
* [ ] Audio testing.
* [ ] Hosted report viewer.
* [ ] IDE extension.
* [ ] Web dashboard.
* [ ] Plugin registry.
* [ ] Pull-request comment publisher.
* [ ] Snapshot approval UI.
* [ ] Mutation testing.
* [ ] Load testing.
* [ ] Multi-bot projects.
* [ ] Multi-guild scenario orchestration.
* [ ] Remote worker execution.
* [ ] Agent-specific instruction formats.
* [ ] Automatic CI workflow generation.
* [ ] Visual Discord client automation research.

These items must not delay version `1.0.0`.

---

# 19. Recommended First Implementation Sequence

The recommended first sequence for the next working session is:

1. [ ] Create repository and workspace structure.
2. [ ] Configure TypeScript.
3. [ ] Configure Vitest.
4. [ ] Create CLI executable.
5. [ ] Implement JSON result envelope.
6. [ ] Implement stable errors and exit codes.
7. [ ] Define adapter protocol.
8. [ ] Build mock adapter worker.
9. [ ] Implement worker launcher.
10. [ ] Create one `discord.js` example project.
11. [ ] Discover one slash command.
12. [ ] Invoke its real handler.
13. [ ] Capture `reply()`.
14. [ ] Add one assertion.
15. [ ] Expose:

```powershell
discord-verify test slash ping --json --non-interactive
```

16. [ ] Add token-redaction regression test.
17. [ ] Add Windows CI.
18. [ ] Add Linux CI.
19. [ ] Add macOS CI.
20. [ ] Continue toward initialization and Python adapter.

---

# 20. Final Execution Principle

Every task in this document should move Discord Verify toward this outcome:

```text
A human or coding agent edits a Discord bot,
runs one predictable CLI,
receives structured verification evidence,
fixes failures,
re-runs verification,
and completes review without depending on manual Discord testing for every behavior.
```

The product is complete only when that workflow works reliably for both:

```text
discord.js v14
discord.py 2.x
```

and remains:

```text
Safe
Honest
Agent-compatible
Cross-platform
CLI-first
Framework-extensible
```
