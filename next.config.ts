import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",      // Cloudflare Pages static export
  trailingSlash: true,   // CF Pages routing compatibility
  images: {
    unoptimized: true,   // next/image works in static export
  },
};

export default nextConfig;
