export interface TextOutput {
  write(chunk: string): unknown;
}

export interface CliCommandContext {
  args: readonly string[];
  stdout: TextOutput;
  stderr: TextOutput;
}

export interface CliCommand {
  name: string;
  aliases?: readonly string[];
  description: string;
  usage: string;
  hidden?: boolean;
  execute(context: CliCommandContext): number | Promise<number>;
}

export interface RunCliOptions {
  argv: readonly string[];
  stdout: TextOutput;
  stderr: TextOutput;
}
