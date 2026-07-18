# Discord Verify

Discord Verify is a CLI-first verification framework for Discord bots. The repository is currently in
foundation development; product commands begin in Milestone M1.

## Development

```powershell
corepack enable
pnpm install
pnpm check
pnpm build
uv sync --dev
pnpm check:python
```

Development uses pnpm workspaces, but published npm packages will remain consumable with npm and
`npx`; consumers will not need pnpm.

Discord Verify is not affiliated with, endorsed by, or sponsored by Discord Inc. It never supports
self-bots or Discord user tokens.

See `docs/PRD.md`, `docs/TASKS.md`, `CONTRIBUTING.md`, and `SECURITY.md` for project policy.
