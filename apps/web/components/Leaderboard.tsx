"use server";

import { prisma } from "database";
import LeaderboardProfile from "./LeaderboardProfile";
import { unstable_noStore as noStore } from "next/cache";
import { setTimeout } from "timers/promises";

export default async function Leaderboard() {
  noStore();

  const users = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: 10,
  });

  if (users.length < 10) {
    const placeholdersToAdd = 10 - users.length;

    for (let i = 0; i < placeholdersToAdd; i++) {
      users.push({
        id: -1,
        discordUserId: "",
        displayName: "Nobody",
        username: "nobody",
        discriminator: "0",
        avatarURL: `https://cdn.discordapp.com/embed/avatars/${i % 6}.png`,
        messages: 0,
        xp: 0,
        level: 0,
        lastMessageTime: new Date(),
      });
    }
  }

  return (
    <>
      <div className="w-11/12 mx-auto flex flex-col border-2 rounded-3xl">
        {users.map((user, index) => {
          return (
            <LeaderboardProfile user={user} position={index} key={user.id} />
          );
        })}
      </div>
    </>
  );
}
