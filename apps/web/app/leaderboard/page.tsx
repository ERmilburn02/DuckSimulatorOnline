import { Suspense } from "react";
import Leaderboard from "../../components/Leaderboard";
import SkeletonLeaderboard from "../../components/Skeleton/SkeletonLeaderboard";

export default function LeaderboardPage() {
  return (
    <>
      <Suspense fallback={<SkeletonLeaderboard />}>
        <Leaderboard />
      </Suspense>
    </>
  );
}
