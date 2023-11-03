import {
  ActivityType,
  ClientEvents,
  Collection,
  GatewayIntentBits,
} from "discord.js";
import { DuckClient, type DuckCommand, type DuckEvent } from "./types";

import { PingCommand, QuackCommand } from "./commands";
import { MessageCreateEvent, ReadyEvent } from "./events";

const VERSION = "0.1.0";
const GLOBAL_COMMANDS: Array<[string, DuckCommand]> = [
  [QuackCommand.data.name, QuackCommand],
  [PingCommand.data.name, PingCommand],
];
const LOCAL_COMMANDS: Array<[string, DuckCommand]> = [];

const all_commands_arr: Iterable<[string, DuckCommand]> =
  GLOBAL_COMMANDS.concat(LOCAL_COMMANDS);

const ALL_COMMANDS: Collection<string, DuckCommand> = Collection.combineEntries(
  all_commands_arr,
  (_x, y) => y
);

const EVENTS: Array<DuckEvent<keyof ClientEvents>> = [ReadyEvent];

const CLIENT = new DuckClient(VERSION, ALL_COMMANDS, {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  presence: {
    activities: [{ name: "your every move...", type: ActivityType.Watching }],
  },
});
