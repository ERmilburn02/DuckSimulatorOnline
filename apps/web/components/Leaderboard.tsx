import { type User } from "database";
import LeaderboardProfile from "./LeaderboardProfile";

export type LeaderboardProps = {
  users: Array<User>;
};

export default function Leaderboard({ users }: LeaderboardProps) {
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
