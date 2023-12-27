-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "discordUserId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "avatarURL" TEXT NOT NULL,
    "messages" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,
    "lastMessageTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConfig" (
    "id" SERIAL NOT NULL,
    "ping" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppConfig" (
    "version" SERIAL NOT NULL,
    "lastDeployTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autoRedeployTimer" INTEGER NOT NULL DEFAULT 7,
    "deployOnStart" BOOLEAN NOT NULL DEFAULT true,
    "clientID" TEXT NOT NULL DEFAULT '',
    "appGuildID" TEXT NOT NULL DEFAULT '',
    "baseXPPerLevel" INTEGER NOT NULL DEFAULT 50,
    "XPMultiplierPerLevel" DOUBLE PRECISION NOT NULL DEFAULT 1.3,
    "AIID" TEXT NOT NULL DEFAULT '',
    "AIForumID" TEXT NOT NULL DEFAULT '',
    "RequireImageChannels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "SuggestionChannel" TEXT NOT NULL DEFAULT '',
    "XPWaitBetweenMessages" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "QuackerAIThreads" (
    "id" SERIAL NOT NULL,
    "threadDiscordChannelID" TEXT NOT NULL DEFAULT '',
    "threadAIID" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "QuackerAIThreads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordUserId_key" ON "User"("discordUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UserConfig_userId_key" ON "UserConfig"("userId");

-- AddForeignKey
ALTER TABLE "UserConfig" ADD CONSTRAINT "UserConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

