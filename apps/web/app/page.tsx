import { prisma } from "database";
import Image from "next/image";

export default async function IndexPage() {
  const users = await prisma.user.findMany({ include: { config: {} } });

  const placeholderUser = {
    id: 1,
    discordUserId: "676511901890510848",
    displayName: "ERmilburn02 (Eliza M)",
    username: "ermilburn02",
    discriminator: "0",
    avatarURL:
      "https://cdn.discordapp.com/avatars/676511901890510848/536e2f0b4c9e7023d9b1da761446f8d3.webp",
    messages: 0,
    xp: 0,
    lastMessageTime: new Date(),
    config: {
      id: 1,
      ping: false,
      userId: 1,
    },
  };

  return (
    <div>
      <div>
        <Image
          src={`${placeholderUser.avatarURL}?size=512`}
          alt="Profile Image"
          width={300}
          height={300}
          unoptimized
        />
        <p>{placeholderUser.displayName}</p>
        <p>
          {placeholderUser.username}
          {placeholderUser.discriminator == "0"
            ? ""
            : `#${placeholderUser.discriminator}`}
        </p>
        <p>XP: {placeholderUser.xp}</p>
        <p>Messages: {placeholderUser.messages}</p>
        <p>Level: 0 {/* TODO: Write XP to Level calculation */}</p>
      </div>
    </div>
  );
}
