-- CreateTable
CREATE TABLE "RoleXPMultiplier" (
    "id" SERIAL NOT NULL,
    "discordRoleId" TEXT NOT NULL DEFAULT '',
    "xpMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "RoleXPMultiplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoleXPMultiplier_discordRoleId_key" ON "RoleXPMultiplier"("discordRoleId");
