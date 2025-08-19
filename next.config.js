// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // todo find better impl (could use presigned urls and upload from browser)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  serverExternalPackages: ["pdf-parse"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

module.exports = nextConfig;
