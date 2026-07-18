# Versioning and Change Conventions

Use Conventional Commits with scopes `cli`, `core`, `protocol`, `discordjs`, `discordpy`, `shared`,
`test-kit`, `docs`, `ci`, and `release`.

Published packages use semantic versioning. Protocol and schema versions are public contracts and are
versioned independently inside their payloads. Compatible additive changes increment the minor
contract version; incompatible changes require a major contract version and a package major release.

All user-visible changes require a changeset. Workspace package versions remain synchronized for the
1.x release line.
