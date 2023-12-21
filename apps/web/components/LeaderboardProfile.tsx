"use client";

import { type User } from "database";
import Image from "next/image";

const usernameUI = (username: string, discriminator: string): string => {
  const hasDiscriminator = discriminator != "0";

  return `${hasDiscriminator ? "" : "@"}${username}${
    hasDiscriminator ? `#${discriminator}` : ""
  }`;
};

const getPositionColor = (position: number): string | undefined => {
  switch (position) {
    case 0:
      return "#ee0";
    case 1:
      return "#bbb";
    case 2:
      return "#bf7f3f";
    default:
      return undefined;
  }
};

export type LeaderboardProfileProps = {
  user: User;
  position: number;
};

export default function LeaderboardProfile({
  user,
  position,
}: LeaderboardProfileProps) {
  let userAvatar = user.avatarURL;
  if (userAvatar == "") {
    const idAsBI = BigInt(user.discordUserId);
    const hasDiscriminator = user.discriminator != "0";

    let defaultAvatar = BigInt(0);

    if (hasDiscriminator) {
      defaultAvatar = (idAsBI >> BigInt(22)) % BigInt(6);
    } else {
      defaultAvatar = BigInt(user.discriminator) % BigInt(5);
    }

    userAvatar = `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
  }

  return (
    <>
      <div className="grid grid-cols-level-leaderboard-mobile md:grid-cols-level-leaderboard grid-rows-2 text-center items-center justify-items-center w-full md:w-[98%] h-24 md:h-36 border rounded-3xl md:my-2 mx-auto">
        <div
          className="row-span-2 font-bold text-xl md:text-5xl m-1"
          style={{ color: getPositionColor(position) }}
        >
          #{position + 1 /* Adding 1 to make it start at 1 */}
        </div>
        <div className="row-span-2 overflow-hidden">
          <div className="relative w-16 h-16 md:w-32 md:h-32 m-4">
            <Image
              src={`${userAvatar}?size=512`}
              alt="Profile Image"
              fill
              className="object-cover rounded-full"
              unoptimized
            />
          </div>
        </div>
        <div
          className="text-md md:text-3xl overflow-hidden whitespace-nowrap overflow-ellipsis w-10/12"
          title={`${user.displayName} (${usernameUI(
            user.username,
            user.discriminator
          )})`}
        >
          {user.displayName}
        </div>
        <div className="text-md md:text-3xl">
          Level {user.level.toLocaleString("en-us")}
        </div>
        <div className="text-md md:text-3xl">
          {user.xp.toLocaleString("en-US")} XP
        </div>
        <div className="text-md md:text-3xl">
          {user.messages.toLocaleString("en-US")} messages
        </div>
      </div>
    </>
  );
}
