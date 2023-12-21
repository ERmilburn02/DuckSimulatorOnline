import {
  SlashCommandBuilder,
  ClientEvents,
  Awaitable,
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
  Message,
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
  delayedMessages: Array<Message<boolean>>;

  constructor(version: string, options: ClientOptions) {
    super(options);

    this.version = version;
    this.commands = new Collection();
    this.delayedMessages = [];
  }
}

export {
  type DuckEvent,
  type DuckCommand,
  type DuckCommandAutoComplete,
  DuckClient,
};
