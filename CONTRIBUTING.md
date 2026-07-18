# Contributing to Discord Verify

## Local setup

Use Node.js 22 or 24, pnpm 11, and Python 3.10 through 3.13.

```powershell
corepack enable
corepack prepare pnpm@11.11.0 --activate
pnpm install
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -e "packages/adapter-discordpy/python[dev]"
pnpm check
```

## Architecture boundaries

Framework-specific behavior belongs only in explicitly named adapter packages. The CLI and core must not import `discord.js`, Python bridge internals, or arbitrary target-project code. Workspace packages must be imported through public exports.

The Python bridge ships inside `@discord-verify/adapter-discordpy`; it is not independently published to PyPI.

## Public contracts

Every public schema, protocol message, error code, result type, and exit code is a versioned contract. Contract changes require documentation, compatibility notes, tests, and a Changeset.

## Pull requests

Use conventional commits with scopes such as `cli`, `core`, `protocol`, `discordjs`, `discordpy`, `shared`, `test-kit`, `docs`, `ci`, `deps`, and `release`. Every implementation PR must include its `DV-####` task, tests, documentation impact, compatibility notes, and security considerations.
