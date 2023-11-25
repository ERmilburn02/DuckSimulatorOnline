import { Events } from "discord.js";
import { type DuckEvent } from "../types";
import { prisma } from "database";

const isFromImportantChannel: (channelID: string) => Promise<boolean> = async (
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

  // TODO: memes, suggestions, etc...

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

    const isImportant = await isFromImportantChannel(message.channelId);

    if (isImportant) {
      console.log(`IMPORTANT CHANNEL!`);
    }
  },
};

export default MessageCreateEvent;
