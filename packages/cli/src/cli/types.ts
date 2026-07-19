export interface TextOutput {
  write(chunk: string): unknown;
}

export interface GlobalCliOptions {
  json: boolean;
  nonInteractive: boolean;
  noColor: boolean;
  quiet: boolean;
  verbose: boolean;
  trace: boolean;
  profile: string | undefined;
  config: string | undefined;
  cwd: string | undefined;
  timeout: number | undefined;
}

export type GlobalOptionValidator = (options: Readonly<GlobalCliOptions>) => void;

export interface ParsedCliInput {
  commandName: string | undefined;
  commandArgs: readonly string[];
  globalOptions: Readonly<GlobalCliOptions>;
  helpRequested: boolean;
  versionRequested: boolean;
}

export interface CliCommandContext {
  args: readonly string[];
  commandPath: readonly string[];
  globalOptions: Readonly<GlobalCliOptions>;
  stdout: TextOutput;
  stderr: TextOutput;
}

export interface CliCommand {
  name: string;
  aliases?: readonly string[];
  description: string;
  usage: string;
  hidden?: boolean;
  subcommands?: readonly CliCommand[];
  validate?(context: CliCommandContext): void | Promise<void>;
  execute?(context: CliCommandContext): number | Promise<number>;
}

export interface ResolvedCliCommand {
  command: CliCommand;
  commandPath: readonly string[];
  args: readonly string[];
}

export interface RunCliOptions {
  argv: readonly string[];
  stdout: TextOutput;
  stderr: TextOutput;
}
