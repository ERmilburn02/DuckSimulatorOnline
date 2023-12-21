import { Suspense } from "react";
import Leaderboard from "../../components/Leaderboard";
import SkeletonLeaderboard from "../../components/Skeleton/SkeletonLeaderboard";

export const dynamic = "force-dynamic";

export default function LeaderboardPage() {
  return (
    <>
      <div className="my-2">
        <Suspense fallback={<SkeletonLeaderboard />}>
          <Leaderboard />
        </Suspense>
      </div>
    </>
  );
}
