import { ChatInputCommandInteraction, Events } from "discord.js";
import {
  type DuckEvent,
  type DuckCommandAutoComplete,
  DuckClient,
} from "../types";

const InteractionCreateEvent: DuckEvent<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const chatInteract = interaction as ChatInputCommandInteraction;
      const command = (chatInteract.client as DuckClient).commands.get(
        chatInteract.commandName
      );

      if (command == undefined) {
        console.error(`Command ${chatInteract.commandName} not found!`);
        await chatInteract.reply({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
        return;
      }

      try {
        await command.execute(chatInteract);
      } catch (error) {
        console.error(error);
        await chatInteract.reply({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
        return;
      }
    }
  },
};

export default InteractionCreateEvent;
