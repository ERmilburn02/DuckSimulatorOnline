import Leaderboard from "../components/Leaderboard";
import SkeletonLeaderboard from "../components/Skeleton/SkeletonLeaderboard";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  return (
    <div className="w-full h-full">
      {/* LEADERBOARD */}
      <Suspense fallback={<SkeletonLeaderboard />}>
        <Leaderboard />
      </Suspense>
    </div>
  );
}
