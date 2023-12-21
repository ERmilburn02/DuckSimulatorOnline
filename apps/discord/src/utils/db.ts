import { User } from "discord.js";
import { prisma } from "database";

export const createNewUser = async (discordUser: User) => {
  return await prisma.user.create({
    data: {
      discordUserId: discordUser.id,
      avatarURL: discordUser.avatarURL({ forceStatic: true }) || "",
      discriminator: discordUser.discriminator,
      displayName: discordUser.displayName,
      username: discordUser.username,
      lastMessageTime: new Date(),
      level: 0,
      messages: 0,
      xp: 0,
      config: {
        create: {},
      },
    },
  });
};
