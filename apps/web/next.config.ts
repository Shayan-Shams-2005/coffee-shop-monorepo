import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowLocalIP: true, // 🚀 FIX: Allows Next.js to process images resolved to private IPs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shams1384.s3.ir-thr-at1.arvanstorage.ir',
      },
      {
        protocol: 'https',
        hostname: 's3.ir-thr-at1.arvanstorage.ir',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
};

export default nextConfig;