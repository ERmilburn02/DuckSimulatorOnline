import { Events } from "discord.js";
import { type DuckEvent } from "../types";

const ReadyEvent: DuckEvent<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
  },
};

export default ReadyEvent;
