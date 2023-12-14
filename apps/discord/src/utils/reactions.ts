import {
  ColorResolvable,
  EmbedBuilder,
  MessageReaction,
  PartialMessageReaction,
} from "discord.js";

const handleSuggestionReactions = async (
  reaction: MessageReaction | PartialMessageReaction
) => {
  const msg = reaction.message;

  const upvote = msg.reactions.cache.find((r) => r.emoji.name == "⬆️");
  const downvote = msg.reactions.cache.find((r) => r.emoji.name == "⬇️");

  if (upvote == undefined || downvote == undefined) {
    console.error("Missing reactions!");
    await msg.reactions.removeAll();
    await msg.react("⬆️");
    await msg.react("⬇️");
    if (!msg.hasThread) {
      await msg.react("🧵");
    }

    return;
  }

  const ratio = upvote.count / (upvote.count + downvote.count);
  let color: ColorResolvable = "Yellow";
  if (ratio > 0.5) {
    color = "Green";
  } else if (ratio < 0.5) {
    color = "Red";
  }

  const oldEmbed = msg.embeds[0];
  const newEmbed = EmbedBuilder.from(oldEmbed).setColor(color);
  reaction.message.edit({ embeds: [newEmbed] });
};

export { handleSuggestionReactions };
