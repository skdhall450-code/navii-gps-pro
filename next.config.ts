import type { NextConfig } from "next";
import path from "node:path";

const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      {
        source: "/products/g17",
        destination: "/products/g17-gps-tracker",
        permanent: true,
      },
      {
        source: "/products/gs900",
        destination: "/products/gs900-4g-gps-tracker",
        permanent: true,
      },
      {
        source: "/products/ev02",
        destination: "/products/ev02-gps-tracker",
        permanent: true,
      },
      {
        source: "/products/dashcam",
        destination: "/products/ai-dash-camera",
        permanent: true,
      },
      {
        source: "/products/fuel-sensor",
        destination: "/products/fuel-monitoring-sensor",
        permanent: true,
      },
      {
        source: "/products/smart-elock",
        destination: "/products/smart-e-lock",
        permanent: true,
      },
      {
        source: "/lander",
        destination: "/",
        permanent: true,
      },
    ];
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