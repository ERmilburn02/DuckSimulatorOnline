import { Events } from "discord.js";
import { type DuckEvent } from "../types";
import { getLatestAppConfig } from "database";
import { handleNewAIThread } from "../utils/ai";

const ThreadCreateEvent: DuckEvent<Events.ThreadCreate> = {
  name: Events.ThreadCreate,
  once: false,
  async execute(thread, newlyCreated) {
    const appConfig = await getLatestAppConfig();

    if (appConfig.AIForumID == thread.parentId) {
      await handleNewAIThread(thread);
    }
  },
};

export default ThreadCreateEvent;
