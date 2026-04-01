import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "testingknown.blob.core.windows.net"
      },
      {
        protocol: "https",
        hostname: "*.blob.core.windows.net"
      }
    ]
  }
};

export default nextConfig;

