import type { NextConfig } from "next";
import path from "node:path";

const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    const noIndexHeaders = [
      {
        key: "X-Robots-Tag",
        value: "noindex, nofollow, noarchive",
      },
    ];

    return [
      {
        source: "/dashboard/:path*",
        headers: noIndexHeaders,
      },
      {
        source: "/login",
        headers: noIndexHeaders,
      },
      {
        source: "/live-tracking",
        headers: noIndexHeaders,
      },
      {
        source: "/history",
        headers: noIndexHeaders,
      },
    ];
  },

  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
