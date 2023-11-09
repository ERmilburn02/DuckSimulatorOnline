import { prisma } from "database";
import LeaderboardProfile from "../components/LeaderboardProfile";

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  const users = await prisma.user.findMany();

  users.sort((a, b) => b.xp - a.xp);

  return (
    <div className="w-full h-full">
      {/* LEADERBOARD */}
      <div className="w-11/12 mx-auto flex flex-col">
        {users.map((user, index) => {
          return (
            <LeaderboardProfile user={user} position={index} key={user.id} />
          );
        })}
      </div>
    </div>
  );
}
