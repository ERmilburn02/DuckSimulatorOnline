const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");
const withMDX = require("@next/mdx")();

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  redirects: async () => {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/duck-simulator-908148295606628363",
        permanent: false,
      },
    ];
  },
};

module.exports = withMDX(nextConfig);
