import { Events } from "discord.js";
import { type DuckEvent } from "../types";
import { getLatestAppConfig } from "database";
import { handleSuggestionReactions } from "../utils/reactions";

const MessageReactionRemoveEvent: DuckEvent<Events.MessageReactionRemove> = {
  name: Events.MessageReactionRemove,
  once: false,
  async execute(reaction, user) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the message:", error);
        return;
      }
    }

    if (user.partial) {
      try {
        await user.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the user:", error);
        return;
      }
    }

    if (user.system || user.bot) {
      return;
    }

    const appConfig = await getLatestAppConfig();

    if (reaction.message.channelId != appConfig.SuggestionChannel) {
      return;
    }

    await handleSuggestionReactions(reaction);
  },
};

export default MessageReactionRemoveEvent;
