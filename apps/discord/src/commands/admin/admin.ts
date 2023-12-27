import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { type DuckCommand } from "../../types";
import { getLatestAppConfig, prisma } from "database";
import { exit } from "node:process";

const AdminCommand: DuckCommand = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Admin Command - Developer use only!")
    .addBooleanOption((ispublic) =>
      ispublic
        .setName("public")
        .setDescription("Should reply be public?")
        .setRequired(false)
    )
    .addBooleanOption((redeploy) =>
      redeploy
        .setName("redeploy")
        .setDescription("Redeploy command on next reboot")
        .setRequired(false)
    )
    .addBooleanOption((reboot) =>
      reboot
        .setName("reboot")
        .setDescription("Restarts the bot (assuming pm2 is running)")
    ),
  async execute(interaction) {
    const isPublic = interaction.options.getBoolean("public") || false;

    await interaction.deferReply({ ephemeral: !isPublic });

    const appConfig = await getLatestAppConfig();

    if (interaction.user.id !== appConfig.ownerID) {
      await interaction.editReply({
        content: "You do not have permission to use that command",
      });

      return;
    }

    const redeploy = interaction.options.getBoolean("redeploy", false) || false;
    const reboot = interaction.options.getBoolean("reboot") || false;

    if (redeploy) {
      await prisma.appConfig.update({
        where: {
          version: appConfig.version,
        },
        data: {
          deployOnStart: redeploy,
        },
      });
    }

    await interaction.editReply({
      content: "TEMP: DONE",
    });

    if (reboot) {
      await interaction.followUp({
        content: "REBOOTING",
      });
      exit();
    }
  },
};

export default AdminCommand;
