"use server";

import { prisma } from "database";
import LeaderboardProfile from "./LeaderboardProfile";

export default async function Leaderboard() {
  const users = await prisma.user.findMany({ orderBy: { xp: "desc" } });

  return (
    <>
      <div className="w-11/12 mx-auto flex flex-col">
        {users.map((user, index) => {
          return (
            <LeaderboardProfile user={user} position={index} key={user.id} />
          );
        })}
      </div>
    </>
  );
}
