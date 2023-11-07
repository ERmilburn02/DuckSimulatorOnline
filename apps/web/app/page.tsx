import { prisma } from "database";
import LeaderboardProfile from "../components/LeaderboardProfile";

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  const users = await prisma.user.findMany();

  return (
    <div className="w-full h-full">
      {/* LEADERBOARD */}
      <div className="w-full md:max-w-3xl flex flex-col">
        {users.map((user, index) => {
          return (
            <LeaderboardProfile user={user} position={index} key={user.id} />
          );
        })}
      </div>
    </div>
  );
}
