import { Events } from "discord.js";
import { type DuckEvent } from "../types";

const ThreadCreateEvent: DuckEvent<Events.ThreadCreate> = {
  name: Events.ThreadCreate,
  once: false,
  async execute(thread, newlyCreated) {
    console.log(`Joining thread ${thread.id} (${thread.name})`);
    await thread.join();
  },
};

export default ThreadCreateEvent;
