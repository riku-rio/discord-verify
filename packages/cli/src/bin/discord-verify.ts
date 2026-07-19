#!/usr/bin/env node

import { runCli } from '../run-cli.js';

const exitCode = await runCli({
  argv: process.argv.slice(2),
  stdout: process.stdout,
  stderr: process.stderr,
});

process.exitCode = exitCode;
