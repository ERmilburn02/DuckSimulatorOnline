import { User } from "database";
import Image from "next/image";

const usernameUI = (username: string, discriminator: string): string => {
  const hasDiscriminator = discriminator != "0";

  return `${hasDiscriminator ? "" : "@"}${username}${
    hasDiscriminator ? `#${discriminator}` : ""
  }`;
};

export type LeaderboardProfileProps = {
  user: User;
  position: number;
};

export default function LeaderboardProfile({
  user,
  position,
}: LeaderboardProfileProps) {
  return (
    <>
      <div className="grid grid-cols-level-leaderboard-mobile md:grid-cols-level-leaderboard grid-rows-2 text-center items-center justify-items-center w-full h-24 md:h-36 my-4">
        <div className="row-span-2 font-bold text-xl md:text-5xl m-1">
          #{position + 1 /* Adding 1 to make it start at 1 */}
        </div>
        <div className="row-span-2 overflow-hidden">
          <div className="relative w-16 h-16 md:w-32 md:h-32 m-4">
            <Image
              src={`${user.avatarURL}?size=512`}
              alt="Profile Image"
              fill
              className="object-cover rounded-full"
              unoptimized
            />
          </div>
        </div>
        <div
          className="text-md md:text-3xl overflow-hidden px-4"
          title={usernameUI(user.username, user.discriminator)}
        >
          {/* {usernameUI(user.username, user.discriminator)} */}
          {user.displayName}
        </div>
        <div className="text-md md:text-3xl">Level undefined</div>
        <div className="text-md md:text-3xl">{user.xp} XP</div>
        <div className="text-md md:text-3xl">{user.messages} messages</div>
      </div>
    </>
  );
}
