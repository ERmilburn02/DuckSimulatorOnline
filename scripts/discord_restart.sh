#!/bin/sh
pm2 stop ./apps/discord/dist/index.js
rm -rf ./apps/discord/dist/
git pull
pnpm install --frozen-lockfile
pnpm run build:discord
pm2 start ./apps/discord/dist/index.js