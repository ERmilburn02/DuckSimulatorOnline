import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { type DuckCommand } from "../types";
import { prisma } from "database";
import { getNeededXP } from "../utils/level";

const LevelCommand: DuckCommand = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Get your current level")
    .addBooleanOption((option) =>
      option
        .setName("public")
        .setDescription("Show publicly")
        .setRequired(false)
    ),
  async execute(interaction) {
    const isPublic = interaction.options.getBoolean("public", false) || false;

    await interaction.deferReply({
      ephemeral: !isPublic,
    });

    const userID = interaction.user.id;

    const user = await prisma.user.findFirst({
      where: {
        discordUserId: userID,
      },
      include: {
        config: {},
      },
    });

    if (user == null) {
      interaction.editReply("You have no level. Have you chatted yet?");
      return;
    }

    const nextLevel = user.level + 1;
    const xpToNext = (await getNeededXP(nextLevel)) - user.xp;

    const userConfig = user.config;
    if (userConfig == null) {
      interaction.editReply("An error occurred. Sorry about that.");
      throw new Error(
        `User Config is null for user \"${interaction.user.id} (${interaction.user.tag})\"`
      );
    }
    const ping = userConfig.ping ? "Yes" : "No";

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.avatarURL({ forceStatic: true }) || undefined,
      })
      .setTimestamp()
      .setFields([
        { name: "Level", value: user.level.toLocaleString(), inline: true },
        { name: "XP", value: user.xp.toLocaleString(), inline: true },
        {
          name: "Messages",
          value: user.messages.toLocaleString(),
          inline: true,
        },
        { name: "\u200b", value: "\u200b", inline: false },
        {
          name: "XP to next level",
          value: xpToNext.toLocaleString(),
          inline: true,
        },
        {
          name: "Ping on level up",
          value: ping,
          inline: true,
        },
      ])
      .setThumbnail(interaction.user.avatarURL({ forceStatic: true }));

    interaction.editReply({
      embeds: [embed],
    });
  },
};

export default LevelCommand;
