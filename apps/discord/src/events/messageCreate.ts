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
  const attachmentsToDownload: Array<{
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
          attachmentsToDownload.push({
            url: att.url,
            filePath: pathResolve(tmpdir(), name),
            name,
          });
        }

        resolve();
      });
    });
  }

  const downloads = attachmentsToDownload.map(async (att) => {
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
    })
    .setColor("Yellow")
    .setTimestamp();

  let msg: Message<boolean>;

  if (attachmentsToDownload.length > 0) {
    const attachment = new AttachmentBuilder(attachmentsToDownload[0].filePath);
    embed.setImage(`attachment://${attachmentsToDownload[0].name}`);

    msg = await message.channel.send({
      embeds: [embed],
      files: [attachment],
    });
  } else {
    msg = await message.channel.send({
      embeds: [embed],
    });
  }

  await message.delete();

  await msg.react("⬆️");
  await msg.react("⬇️");

  if (attachmentsToDownload.length < 2) {
    await msg.react("🧵");
    return;
  }

  const thread = await msg.startThread({
    name: `Suggestion by ${message.author.tag}`,
    reason: "Multiple Attachments",
  });
  const atts: Array<AttachmentBuilder> = [];
  for (let i = 1; i < attachmentsToDownload.length; i++) {
    atts.push(new AttachmentBuilder(attachmentsToDownload[i].filePath));
  }
  thread.send({
    content: "Extra attachments",
    files: atts,
  });
};

const handleImageRequired = async (message: Message<boolean>) => {
  if (message.attachments.size != 1) {
    const reply = await message.reply({
      content: "Please upload exactly 1 image with your post!",
    });
    await message.delete();
    setTimeout(async () => {
      await reply.delete();
    }, 5e3);
    return;
  }

  const attachment = message.attachments.first();
  if (attachment == undefined) {
    throw new Error("1 attachment but undefined?!");
  }

  if (attachment.contentType == null) {
    console.error("Attachment content type is null?!");
    return;
  }

  if (!attachment.contentType.startsWith("image")) {
    const reply = await message.reply({
      content:
        "Please ensure you're only uploading an image. If it was an image, then please contact the bot's developer.",
    });
    await message.delete();
    setTimeout(async () => {
      await reply.delete();
    }, 5e3);
    return;
  }
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
