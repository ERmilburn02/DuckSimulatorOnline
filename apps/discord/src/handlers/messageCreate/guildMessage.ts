import { getLatestAppConfig, prisma } from "database";
import { Message, Guild } from "discord.js";
import { isDateOlderThanSeconds } from "../../utils/date";
import { createNewUser } from "../../utils/db";
import { getCurrentLevelv2, sendLevelUpMessage } from "../../utils/level";

export const handleGuildMessage = async (
  message: Message<boolean>,
  guild: Guild
) => {
  const user = await prisma.user.findFirst({
    where: {
      discordUserId: message.author.id,
    },
    include: {
      config: {},
    },
  });

  if (user == null) {
    await createNewUser(message.author);
    return;
  }

  if (user.config == null) {
    throw new Error(
      `User Config is null for user \"${message.author.id} (${message.author.tag})\"`
    );
  }

  const appConfig = await getLatestAppConfig();

  if (
    !isDateOlderThanSeconds(
      user.lastMessageTime,
      appConfig.XPWaitBetweenMessages,
      message.createdAt
    )
  ) {
    return; // previous message not old enough
  }

  let xpMultiplier = 1;

  const multipliers = await prisma.roleXPMultiplier.findMany();
  multipliers.forEach((multiplier) => {
    if (message.member?.roles.cache.has(multiplier.discordRoleId)) {
      xpMultiplier *= multiplier.xpMultiplier;
    }
  });
  // TODO: Role-based multipliers

  const xp = Math.floor(Math.random() * 5 * xpMultiplier) + 1; // TODO: Make Base Message XP configurable
  const newTotalXp = user.xp + xp;
  const newLevel = await getCurrentLevelv2(newTotalXp);
  const newTotalMessages = user.messages + 1;

  await prisma.user.update({
    where: {
      discordUserId: message.author.id,
    },
    data: {
      xp: newTotalXp,
      messages: newTotalMessages,
      level: newLevel,

      // Ensure everything is up to date
      username: message.author.username,
      displayName: message.author.displayName,
      avatarURL: message.author.avatarURL({ forceStatic: true }) || "",
      discriminator: message.author.discriminator,
      lastMessageTime: message.createdAt,
    },
  });

  if (newLevel > user.level && user.config.ping) {
    await sendLevelUpMessage(message, newLevel);
  }
};
