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
