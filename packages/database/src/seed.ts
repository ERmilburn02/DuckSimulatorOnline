import { prisma } from ".";

import type { User } from "@prisma/client";

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
] as Array<User>;

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
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
