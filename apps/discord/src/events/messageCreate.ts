import { Events } from "discord.js";
import { type DuckEvent } from "../types";

const MessageCreateEvent: DuckEvent<Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    console.warn(
      `HEY IDIOT! YOU DIDN\'T FINISH THIS EVENT (MessageCreateEvent)!`
    );
    return;
  },
};

export default MessageCreateEvent;
