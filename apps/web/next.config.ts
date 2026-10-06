import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shams1384.s3.ir-thr-at1.arvanstorage.ir',
      },
    ],
  },
};

export default nextConfig; 