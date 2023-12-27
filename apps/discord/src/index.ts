import { DuckClient, type DuckCommand, type DuckEvent } from "./types";

import {
  AdminCommand,
  LevelCommand,
  PingCommand,
  QuackCommand,
} from "./commands";
import {
  InteractionCreateEvent,
  MessageCreateEvent,
  MessageReactionAddEvent,
  MessageReactionRemoveEvent,
  ReadyEvent,
  ThreadCreateEvent,
} from "./events";
import {
  ActivityType,
  ClientEvents,
  GatewayIntentBits,
  Partials,
  REST,
  RESTPostAPIApplicationCommandsResult,
  Routes,
} from "discord.js";
import { getLatestAppConfig } from "database";
import { env } from "./env";
import { isDateOlderThanDays } from "./utils/date";
import { prisma } from "database";

const CheckForDeploymentUpdate = async () => {
  const config = await getLatestAppConfig();

  if (
    config.deployOnStart ||
    isDateOlderThanDays(config.lastDeployTime, config.autoRedeployTimer)
  ) {
    try {
      await DeployCommands();

      await prisma.appConfig.update({
        where: {
          version: config.version,
        },
        data: {
          lastDeployTime: new Date(),
          deployOnStart: false,
        },
      });
    } catch (error) {
      console.error(
        `An error occurred! Check the above logs for more details.\n\nCaution: Some data might be corrupt. It is recommended to fix the issues and redeploy ASAP.`
      );
      throw error;
    }
  }
};

const GLOBAL_CHAT_COMMANDS: Array<DuckCommand> = [QuackCommand, AdminCommand];
const LOCAL_CHAT_COMMANDS: Array<DuckCommand> = [LevelCommand, PingCommand];
const EVENTS: Array<DuckEvent<keyof ClientEvents>> = [
  InteractionCreateEvent,
  MessageCreateEvent,
  MessageReactionAddEvent,
  MessageReactionRemoveEvent,
  ReadyEvent,
  ThreadCreateEvent,
];

const DeployCommands = async () => {
  const appConfig = await getLatestAppConfig();

  const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN);

  try {
    const localChatCommands = LOCAL_CHAT_COMMANDS.map((a) => a.data.toJSON());

    const res = (await rest.put(
      Routes.applicationGuildCommands(appConfig.clientID, appConfig.appGuildID),
      {
        body: localChatCommands,
      }
    )) as RESTPostAPIApplicationCommandsResult[];

    console.log(`Reloaded ${res.length} guild commands`);
  } catch (error) {
    console.error(error);
    throw error;
  }

  try {
    const globalChatCommands = GLOBAL_CHAT_COMMANDS.map((a) => a.data.toJSON());

    const res = (await rest.put(
      Routes.applicationCommands(appConfig.clientID),
      {
        body: globalChatCommands,
      }
    )) as RESTPostAPIApplicationCommandsResult[];

    console.log(`Reloaded ${res.length} global commands`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const LoadEventsAndCommands = (client: DuckClient) => {
  for (const event of EVENTS) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  const allCommands = GLOBAL_CHAT_COMMANDS.concat(LOCAL_CHAT_COMMANDS);

  for (const command of allCommands) {
    client.commands.set(command.data.name, command);
  }
};

(async () => {
  const VERSION = "0.0.0";

  const Client = new DuckClient(VERSION, {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    presence: {
      activities: [{ name: "your every move...", type: ActivityType.Watching }],
    },
  });

  LoadEventsAndCommands(Client);

  await CheckForDeploymentUpdate();

  Client.login(env.DISCORD_BOT_TOKEN);
})();
