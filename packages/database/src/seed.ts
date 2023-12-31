import { prisma } from ".";

import type { AppConfig, User } from "@prisma/client";

const DEFAULT_USERS = [
  // Add your own user to pre-populate the database with
  {
    discordUserId: "676511901890510848",
    displayName: "ERmilburn02 (Eliza M)",
    username: "ermilburn02",
    discriminator: "0",
    avatarURL:
      "https://cdn.discordapp.com/avatars/676511901890510848/536e2f0b4c9e7023d9b1da761446f8d3.webp",
  },
  {
    discordUserId: "356398636982206485",
    displayName: "Cebo",
    username: "a_folf",
    discriminator: "0",
    avatarURL:
      "https://cdn.discordapp.com/avatars/356398636982206485/ce58389e49d6aaacb9168d7e002b20ab.webp",
  },
  {
    discordUserId: "428258078417354782",
    displayName: "Orius",
    username: "orius",
    discriminator: "0",
    avatarURL:
      "https://cdn.discordapp.com/avatars/428258078417354782/0c26a66d6237c262f0588f864cde2d92.webp",
  },
  {
    discordUserId: "541331027466125315",
    displayName: "GoldZook",
    username: "goldzook",
    discriminator: "0",
    avatarURL:
      "https://cdn.discordapp.com/avatars/541331027466125315/e1c82bc5c605d708785c4b9627e9a08d.webp",
  },
] as Array<User>;

const DEFAULT_APP_CONFIG = {
  version: 1,
  AIID: "asst_HF4afoLazM5tjg5gR5fYUt6f",
  AIForumID: "1178079464035450981",
  SuggestionChannel: "1184667490517794846",
  RequireImageChannels: ["1184858509968416828", "1184858633528422491"],
} as AppConfig;

(async () => {
  debugger;
  try {
    await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: {
            discordUserId: user.discordUserId!,
          },
          update: {
            ...user,
          },
          create: {
            ...user,
            config: {
              create: {},
            },
          },
        })
      )
    );
    await prisma.appConfig.upsert({
      where: {
        version: DEFAULT_APP_CONFIG.version!,
      },
      update: {
        ...DEFAULT_APP_CONFIG,
      },
      create: {
        ...DEFAULT_APP_CONFIG,
      },
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
