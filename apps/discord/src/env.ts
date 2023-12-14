import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_PRISMA_URL: z.string().url(),
    DATABASE_URL_NON_POOLING: z.string().url(),
    DISCORD_BOT_TOKEN: z.string(),
    OPENAI_API_KEY: z.string(),
  },

  runtimeEnv: process.env,

  emptyStringAsUndefined: true,
});
