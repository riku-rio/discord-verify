# Discord Verify

Discord Verify is a CLI-first verification framework for Discord bots. The project is currently in its engineering-foundation phase; product commands begin in Milestone M1.

The first release targets `discord.js` v14 and `discord.py` 2.x through isolated framework adapters. The TypeScript core remains framework-neutral, and adapter workers will communicate with it using a versioned JSON Lines protocol.

## Safety and scope

Discord Verify uses bot accounts and documented Discord bot APIs. It does not support user tokens, self-bots, or Discord client UI automation. Live verification will be restricted to explicitly configured test guilds.

Discord Verify is not affiliated with Discord Inc.

## Requirements

- Node.js 22 or 24 LTS
- pnpm 11
- Python 3.10 through 3.13 for Python-adapter development

## Setup

```powershell
corepack enable
corepack prepare pnpm@11.11.0 --activate
pnpm install
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -e "packages/adapter-discordpy/python[dev]"
pnpm check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).
