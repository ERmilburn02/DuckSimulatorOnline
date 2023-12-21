import { ChannelType, Events } from "discord.js";
import { DuckClient, type DuckEvent } from "../types";
import { getLatestAppConfig } from "database";
import { handleNewAIMessage, isCurrentChannelAI } from "../utils/ai";
import { handleSuggestion } from "../handlers/messageCreate/suggestion";
import { handleImageRequired } from "../handlers/messageCreate/imageRequired";
import { handleGuildMessage } from "../handlers/messageCreate/guildMessage";

const isFromImportantChannel: (channelID: string) => Promise<boolean> = async (
  channelID: string
) => {
  if (await isCurrentChannelAI(channelID)) {
    return true;
  }

  const appConfig = await getLatestAppConfig();

  if (appConfig.SuggestionChannel == channelID) {
    return true;
  }

  appConfig.RequireImageChannels.forEach((channel) => {
    if (channel == channelID) {
      return true;
    }
  });

  return false;
};

const MessageCreateEvent: DuckEvent<Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (message.system || message.author.bot) {
      return; // We don't care if it's from a bot
    }

    console.log(`Received message: ${message.content}`);

    const appConfig = await getLatestAppConfig();

    if (message.channel.type == ChannelType.PublicThread) {
      if (message.channel.parentId == appConfig.AIForumID) {
        if (!(await isCurrentChannelAI(message.channelId))) {
          console.log(`AI not ready yet, storing message`);
          (message.client as DuckClient).delayedMessages.push(message);
          return;
        }
        console.log(`Message is from AI thread`);

        handleNewAIMessage(message);
      }
    }

    if (!message.inGuild()) {
      return;
    }

    if (message.guildId != appConfig.appGuildID) {
      return;
    }

    await handleGuildMessage(message, message.guild);

    if (!isFromImportantChannel(message.channelId)) {
      return;
    }

    if (message.channelId == appConfig.SuggestionChannel) {
      await handleSuggestion(message);
      return;
    }

    appConfig.RequireImageChannels.forEach(async (ric) => {
      if (message.channelId == ric) {
        await handleImageRequired(message);
        return;
      }
    });
  },
};

export default MessageCreateEvent;
