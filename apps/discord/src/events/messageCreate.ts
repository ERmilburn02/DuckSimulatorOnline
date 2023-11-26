import { ChannelType, Events } from "discord.js";
import { DuckClient, type DuckEvent } from "../types";
import { getLatestAppConfig, prisma } from "database";
import { handleNewAIMessage } from "../utils/ai";

const isFromImportantChannel: (channelID: string) => Promise<boolean> = async (
  channelID: string
) => {
  if (await isCurrentChannelAI(channelID)) {
    return true;
  }

  return false;
};

const isCurrentChannelAI: (channelID: string) => Promise<boolean> = async (
  channelID: string
) => {
  const aiThreads = (await prisma.quackerAIThreads.findMany()).map(
    (thread) => thread.threadDiscordChannelID
  );

  let returnValue = false;
  aiThreads.forEach((threadID) => {
    if (channelID == threadID) {
      returnValue = true;
    }
  });

  return returnValue;
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
  },
};

export default MessageCreateEvent;
