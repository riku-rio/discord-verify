# CLI parser

Discord Verify uses the maintained `node:util` `parseArgs` API from the supported Node.js runtime.
This keeps the parser dependency-free while providing typed boolean and string options, token metadata,
and predictable cross-platform behavior.

## Global options

The root parser recognizes these options before or after a command:

```text
--json
--non-interactive
--no-color
--quiet
--verbose
--trace
--profile <name>
--config <path>
--cwd <path>
--timeout <milliseconds>
```

`--timeout` is parsed as a positive integer in milliseconds. `--quiet` cannot be combined with
`--verbose` or `--trace`.

Unknown options before the command are rejected by the root parser. Options after the command that are
not global options are preserved for the selected command parser.

## JSON safety

Until the versioned JSON result renderer is implemented, parser help and version diagnostics are routed
to stderr when `--json` is present. Command stdout is guarded so human-formatted command output cannot
silently corrupt future JSON output.

## Subcommands and validation

The command registry supports nested subcommands and aliases. A command may provide a validation hook
that runs before execution. Group commands without an executor fail with a missing-subcommand usage
error.
