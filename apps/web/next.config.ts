import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_IMAGES_DOMAIN || "localhost"],
  },
};

export default nextConfig;
