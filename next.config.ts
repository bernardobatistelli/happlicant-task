import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,

  experimental: {
    globalNotFound: true,
  },
  cacheComponents: true,
  enablePrerenderSourceMaps: true,

  images: {
    remotePatterns: [
      { hostname: "api.elbstream.com" },
    ],
  },

  reactCompiler: true,
};

export default nextConfig;