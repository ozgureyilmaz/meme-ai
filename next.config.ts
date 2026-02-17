import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/meme-ai",
  assetPrefix: "/meme-ai/",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fal.media",
      },
      {
        protocol: "https",
        hostname: "*.fal.media",
      },
      {
        protocol: "https",
        hostname: "fal-cdn.batuhan-941.workers.dev",
      },
    ],
  },
};

export default nextConfig;
