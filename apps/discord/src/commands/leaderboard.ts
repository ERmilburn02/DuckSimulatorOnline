import { SlashCommandBuilder } from "discord.js";
import { type DuckCommand } from "../types";

const LeaderboardCommand: DuckCommand = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show the leaderboard"),
  async execute(interaction) {
    await interaction.reply({
      content:
        "Check out the server leaderboard at https://ducksimulator.com/leaderboard",
      ephemeral: true,
    });
  },
};

export default LeaderboardCommand;
