# Security Policy

## Supported versions

Until the first public release, only the latest commit on `main` receives security fixes. After
release, the latest minor release line will be supported unless a release note states otherwise.

## Reporting a vulnerability

Do not open a public issue for a vulnerability. Use GitHub's private vulnerability reporting feature
for this repository. Include reproduction steps, affected versions, impact, and suggested
mitigations.

## Severity guidance

Leaking a Discord token or another secret to logs, output, reports, session files, or adapter
messages is critical. Escaping the configured test guild or enabling an unauthorized destructive
action is critical. Cleanup failures that can delete unrelated resources are critical.

Reports requesting self-bot behavior, Discord user tokens, or user-account automation are
unsupported and will be closed without implementation.
