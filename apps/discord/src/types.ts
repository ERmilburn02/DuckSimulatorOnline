import {
  SlashCommandBuilder,
  ClientEvents,
  Awaitable,
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
} from "discord.js";

interface DuckEvent<T extends keyof ClientEvents> {
  name: T;
  once: boolean;
  execute(...args: ClientEvents[T]): Awaitable<void>;
}

interface DuckCommand {
  data: SlashCommandBuilder;
  execute(interaction: ChatInputCommandInteraction): Awaitable<void>;
}

interface DuckCommandAutoComplete extends DuckCommand {
  autocomplete(interaction: ChatInputCommandInteraction): Awaitable<void>;
}

class DuckClient extends Client {
  version: string;
  commands: Collection<string, DuckCommand>;

  constructor(
    version: string,
    commands: Collection<string, DuckCommand>,
    options: ClientOptions
  ) {
    super(options);

    this.version = version;
    this.commands = commands;
  }
}

export {
  type DuckEvent,
  type DuckCommand,
  type DuckCommandAutoComplete,
  DuckClient,
};
