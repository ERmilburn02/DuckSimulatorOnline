import { getLatestAppConfig } from "database";

export const getNeededXP: (level: number) => Promise<number> = async (
  level: number
) => {
  const appConfig = await getLatestAppConfig();

  return Math.floor(
    appConfig.baseXPPerLevel * appConfig.XPMultiplierPerLevel ** level
  );
};

export const getCurrentLevel: (xp: number) => Promise<number> = async (
  xp: number
) => {
  let level = 0;

  do {
    level++;
  } while ((await getNeededXP(level)) > xp);

  return level;
};

export const getCurrentLevelv2: (xp: number) => Promise<number> = async (
  xp: number
) => {
  const appConfig = await getLatestAppConfig();

  // Using the inverse of the XP formula to directly calculate the level
  const level = Math.floor(
    Math.log(xp / appConfig.baseXPPerLevel) /
      Math.log(appConfig.XPMultiplierPerLevel)
  );

  // Ensure the calculated level is non-negative
  return Math.max(level, 0);
};
