import { User, getLatestAppConfig } from "database";
import { EmbedBuilder, Message } from "discord.js";

export const getNeededXP: (level: number) => Promise<number> = async (
  level: number
) => {
  const appConfig = await getLatestAppConfig();

  return Math.floor(
    appConfig.baseXPPerLevel * appConfig.XPMultiplierPerLevel ** level
  );
};

export const getCurrentLevel: (xp: number) => Promise<number> = async (
  xp: number
) => {
  let level = 0;

  do {
    level++;
  } while ((await getNeededXP(level)) > xp);

  return level;
};

export const getCurrentLevelv2: (xp: number) => Promise<number> = async (
  xp: number
) => {
  const appConfig = await getLatestAppConfig();

  // Using the inverse of the XP formula to directly calculate the level
  const level = Math.floor(
    Math.log(xp / appConfig.baseXPPerLevel) /
      Math.log(appConfig.XPMultiplierPerLevel)
  );

  // Ensure the calculated level is non-negative
  return Math.max(level, 0);
};

export const sendLevelUpMessage = async (
  message: Message<boolean>,
  newLevel: number
) => {
  const levelUpEmbed = new EmbedBuilder()
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.displayAvatarURL({ forceStatic: true }),
    })
    .setColor("Yellow")
    .setTimestamp()
    .setDescription(
      `Congratulations ${
        message.member?.displayName || message.author.tag
      }, you have reached level ${newLevel.toLocaleString()}`
    );

  await message.reply({
    embeds: [levelUpEmbed],
  });
};
