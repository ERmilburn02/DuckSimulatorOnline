import SkeletonLeaderboardProfile from "./SkeletonLeaderboardProfile";

export default async function SkeletonLeaderboard() {
  return (
    <>
      <div className="w-11/12 mx-auto flex flex-col">
        <SkeletonLeaderboardProfile />
        <SkeletonLeaderboardProfile />
        <SkeletonLeaderboardProfile />
      </div>
    </>
  );
}
