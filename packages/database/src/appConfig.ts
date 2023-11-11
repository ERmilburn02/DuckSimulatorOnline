import { prisma, type AppConfig } from "./client";

export const getLatestAppConfig: () => Promise<AppConfig> = async () => {
  const appConfigs = await prisma.appConfig.findMany();

  if (appConfigs.length == 0) {
    throw new Error("No AppConfig");
  }

  appConfigs.sort((a, b) => b.version - a.version);

  return appConfigs[0];
};
