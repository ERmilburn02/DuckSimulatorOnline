import { Message, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { extension } from "mime-types";
import { createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { resolve as pathResolve } from "node:path";

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

export const handleSuggestion = async (message: Message<boolean>) => {
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
