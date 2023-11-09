import { prisma } from "database";
import LeaderboardProfile from "../components/LeaderboardProfile";
import Leaderboard from "../components/Leaderboard";

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  const users = await prisma.user.findMany({ orderBy: { xp: "desc" } });

  return (
    <div className="w-full h-full">
      {/* LEADERBOARD */}
      <Leaderboard users={users} />
    </div>
  );
}
