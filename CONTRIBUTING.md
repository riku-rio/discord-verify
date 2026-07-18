# Contributing

## Setup

Install Node.js 20 or later, pnpm 10, Python 3.10 or later, and uv. From a clean clone run:

```powershell
corepack enable
pnpm install
uv sync --dev
```

## Validation

```powershell
pnpm check
pnpm check:python
pnpm build
pnpm pack:check
```

## Architecture

Framework-neutral behavior belongs in `packages/core`, contracts in `packages/adapter-protocol`,
and shared primitives in `packages/shared`. Framework behavior must stay in its named adapter.

## Public contracts

Changes to CLI output, JSON schemas, error codes, protocol messages, or published types require a
changeset and compatibility notes. Breaking changes must not be merged without an approved versioning
plan.

## Releases

Use Conventional Commits. Maintainers merge changesets, run the complete CI matrix, review generated
changelogs and package contents, then publish synchronized compatible versions.

By contributing, you agree that your contributions are licensed under the repository's MIT License.
