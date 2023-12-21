import { Message } from "discord.js";

export const handleImageRequired = async (message: Message<boolean>) => {
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
