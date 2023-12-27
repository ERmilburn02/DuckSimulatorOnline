import { SlashCommandBuilder } from "discord.js";
import { type DuckCommand } from "../types";
import { prisma } from "database";

const PingCommand: DuckCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Enable or Disable getting pinged on level ups")
    .addBooleanOption((ping) =>
      ping.setName("ping").setDescription("Should Ping?").setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const shouldPing = interaction.options.getBoolean("ping", true);

    const user = await prisma.user.findFirst({
      where: {
        discordUserId: interaction.user.id,
      },
      select: {
        config: {
          select: {
            id: true,
            ping: true,
          },
        },
      },
    });

    if (user == null) {
      await interaction.reply("There was an error executing your command");

      return;
    }

    if (user.config == null) {
      await interaction.reply("There was an error executing your command");

      throw new Error("User's Config was null!");
    }

    await prisma.userConfig.update({
      where: {
        id: user.config.id,
      },
      data: {
        ping: shouldPing,
      },
    });

    if (shouldPing) {
      await interaction.editReply({
        content: `You will now be pinged when levelling up`,
      });
    } else {
      await interaction.editReply({
        content: `You will no longer be pinged when levelling up`,
      });
    }
  },
};

export default PingCommand;
