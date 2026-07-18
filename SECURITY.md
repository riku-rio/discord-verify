# Security Policy

## Supported versions

No stable release has been published. Security fixes currently target `main`.

## Reporting

Use GitHub private vulnerability reporting. Do not open a public issue or include real Discord tokens, guild IDs, database credentials, or other secrets.

Security-critical issues include secret exposure, test-guild boundary bypass, destructive live operations without authorization, and executing target-project code outside adapter-worker isolation.

Self-bots and user-token automation are unsupported by design.
