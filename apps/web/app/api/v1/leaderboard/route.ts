import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { prisma } from "database";
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "ducksimonlineapi",
});

const UNAUTHORIZED_CODE = 401;
const TOO_MANY_REQUESTS_CODE = 429;

export async function GET(request: NextRequest) {
  const headersList = headers();
  const key = headersList.get("X-DuckSimOnline-API-Key");

  if (key === "") {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: UNAUTHORIZED_CODE }
    );
  }

  const { success, pending, limit, reset, remaining } =
    await ratelimit.limit(key);
  await pending;

  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests",
      },
      {
        status: TOO_MANY_REQUESTS_CODE,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  const exists = await redis.exists(`ducksimonlineapikey_${key}`);
  if (!exists) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: UNAUTHORIZED_CODE }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page")) || 0;
  const skip = page * 10;

  const totalUsers = await prisma.user.findMany({ select: { id: true } });
  const totalPages = Math.floor(totalUsers.length / 10);

  if (skip > totalPages) {
    return NextResponse.json(
      {
        error: "Bad Request",
      },
      {
        status: 400,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: 10,
    select: {
      discordUserId: true,
      username: true,
      discriminator: true,
      displayName: true,
      avatarURL: true,
      level: true,
      xp: true,
      messages: true,
    },
    skip,
  });

  return NextResponse.json(
    {
      users,
      page,
      totalPages,
    },
    {
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    }
  );
}
