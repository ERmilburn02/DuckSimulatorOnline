import {
  ActivityType,
  ClientEvents,
  Collection,
  GatewayIntentBits,
  REST,
  RESTPostAPIApplicationCommandsResult,
  Routes,
} from "discord.js";
import { DuckClient, type DuckCommand, type DuckEvent } from "./types";
import { AppConfig, prisma } from "database";

import { PingCommand, QuackCommand } from "./commands";
import {
  InteractionCreateEvent,
  MessageCreateEvent,
  ReadyEvent,
} from "./events";

const deployCommands = async (
  localCommands: Array<[string, DuckCommand]>,
  globalCommands: Array<[string, DuckCommand]>
) => {
  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_BOT_TOKEN!
  );

  try {
    const localCommandsArr = localCommands.map((a) => a[1].data.toJSON());

    const appConfig = await getLatestAppConfig();

    const res = (await rest.put(
      Routes.applicationGuildCommands(appConfig.clientID, appConfig.appGuildID),
      { body: localCommandsArr }
    )) as RESTPostAPIApplicationCommandsResult[];

    console.log(`Reloaded ${res.length} guild commands`);
  } catch (error) {
    console.error(error);
  }

  try {
    const globalCommandsArr = globalCommands.map((a) => a[1].data.toJSON());

    const appConfig = await getLatestAppConfig();

    const res = (await rest.put(
      Routes.applicationCommands(appConfig.clientID),
      { body: globalCommandsArr }
    )) as RESTPostAPIApplicationCommandsResult[];

    console.log(`Reloaded ${res.length} global commands`);
  } catch (error) {
    console.error(error);
  }
};

const getLatestAppConfig = async () => {
  const appConfigs = await prisma.appConfig.findMany();

  if (appConfigs.length == 0) {
    throw new Error("No AppConfig! Bot cannot start!");
  }

  appConfigs.sort((a, b) => b.version - a.version);

  return appConfigs[0];
};

const isDateOlderThanDays = (dateToCheck: Date, days: number) => {
  const now = new Date();
  const prev = new Date(now);
  prev.setDate(now.getDate() - days);

  return dateToCheck < prev;
};

const loadEventsAndCommands = (
  client: DuckClient,
  commands: Collection<string, DuckCommand>,
  events: Array<DuckEvent<keyof ClientEvents>>
) => {
  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  for (const command of commands) {
    client.commands.set(command[0], command[1]);
  }
};

const checkForDeploymentUpdate = async (
  config: AppConfig,
  localCommands: Array<[string, DuckCommand]>,
  globalCommands: Array<[string, DuckCommand]>
) => {
  if (
    config.deployOnStart ||
    isDateOlderThanDays(config.lastDeployTime, config.autoRedeployTimer)
  ) {
    await deployCommands(localCommands, globalCommands);

    await prisma.appConfig.update({
      where: {
        version: config.version,
      },
      data: {
        lastDeployTime: new Date(),
        deployOnStart: false,
      },
    });
  }
};

(async () => {
  const VERSION = "0.1.0";

  const GLOBAL_COMMANDS: Array<[string, DuckCommand]> = [
    [QuackCommand.data.name, QuackCommand],
    [PingCommand.data.name, PingCommand],
  ];
  const LOCAL_COMMANDS: Array<[string, DuckCommand]> = [];

  const all_commands_arr: Iterable<[string, DuckCommand]> =
    GLOBAL_COMMANDS.concat(LOCAL_COMMANDS);

  const ALL_COMMANDS: Collection<string, DuckCommand> =
    Collection.combineEntries(all_commands_arr, (_x, y) => y);

  const EVENTS: Array<DuckEvent<keyof ClientEvents>> = [
    ReadyEvent,
    InteractionCreateEvent,
  ];

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

  loadEventsAndCommands(CLIENT, ALL_COMMANDS, EVENTS);

  const appConfig = await getLatestAppConfig();

  await checkForDeploymentUpdate(appConfig, LOCAL_COMMANDS, GLOBAL_COMMANDS);

  CLIENT.login(process.env.DISCORD_BOT_TOKEN);
})();
