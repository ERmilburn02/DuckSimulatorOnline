import {
  AttachmentBuilder,
  ChannelType,
  EmbedBuilder,
  Events,
  Message,
} from "discord.js";
import { DuckClient, type DuckEvent } from "../types";
import { getLatestAppConfig, prisma } from "database";
import { handleNewAIMessage } from "../utils/ai";
import { tmpdir } from "node:os";
import { resolve as pathResolve } from "node:path";
import { createWriteStream } from "node:fs";
import { extension } from "mime-types";

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

const handleSuggestion = async (message: Message<boolean>) => {
  const attatchmentsToDownload: Array<{
    url: string;
    name: string;
    filePath: string;
  }> = [];
  if (message.attachments.size > 0) {
    message.attachments.forEach(async (att, key, map) => {
      return new Promise(async (resolve, reject) => {
        if (att.contentType == null) {
          reject();
          return null;
        }

        if (att.contentType.startsWith("image")) {
          const ext = extension(att.contentType);
          if (ext == false) {
            throw new Error("Unknown mime type!");
          }
          const name = `${Math.random().toString(16).slice(2)}.${ext}`;
          attatchmentsToDownload.push({
            url: att.url,
            filePath: pathResolve(tmpdir(), name),
            name,
          });
        }

        resolve();
      });
    });
  }

  const downloads = attatchmentsToDownload.map(async (att) => {
    const res = await fetch(att.url);
    const buffer = await res.arrayBuffer();
    await saveArrayBufferToFile(buffer, att.filePath);
  });

  try {
    await Promise.all(downloads);
  } catch (error) {
    console.error(error);
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(`Suggestion`)
    .setDescription(message.content)
    .setFooter({
      text: `Suggested by ${message.author.tag} | User ID: ${message.author.id}`,
      iconURL: message.author.displayAvatarURL(),
    });

  let msg: Message<boolean>;

  if (attatchmentsToDownload.length > 0) {
    const attatchment = new AttachmentBuilder(
      attatchmentsToDownload[0].filePath
    );
    embed.setImage(`attachment://${attatchmentsToDownload[0].name}`);

    msg = await message.channel.send({
      embeds: [embed],
      files: [attatchment],
    });
  } else {
    msg = await message.channel.send({
      embeds: [embed],
    });
  }

  await message.delete();

  await msg.react("⬆️");
  await msg.react("⬇️");

  if (attatchmentsToDownload.length < 2) {
    await msg.react("🧵");
    return;
  }

  const thread = await msg.startThread({
    name: `Suggestion by ${message.author.tag}`,
    reason: "Multiple Attachments",
  });
  const atts: Array<AttachmentBuilder> = [];
  for (let i = 1; i < attatchmentsToDownload.length; i++) {
    atts.push(new AttachmentBuilder(attatchmentsToDownload[i].filePath));
  }
  thread.send({
    content: "Extra attachments",
    files: atts,
  });
};

const saveArrayBufferToFile: (
  arrayBuffer: ArrayBuffer,
  filePath: string
) => Promise<void> = async (arrayBuffer: ArrayBuffer, filePath: string) => {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(filePath);
    stream.on("error", (error) => {
      reject(error);
    });
    stream.write(Buffer.from(arrayBuffer));
    stream.end(() => {
      console.log(`Wrote to file ${filePath}`);
      resolve();
    });
  });
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

    if (!isFromImportantChannel(message.channelId)) {
      return;
    }

    if (message.channelId == appConfig.SuggestionChannel) {
      await handleSuggestion(message);
    }
  },
};

export default MessageCreateEvent;
