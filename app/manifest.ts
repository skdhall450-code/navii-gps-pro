import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NAVII GPS INDIA",
    short_name: "NAVII GPS",
    description:
      "GPS tracking, fleet management, vehicle security and connected IoT solutions.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#06142E",
    theme_color: "#06142E",
    orientation: "portrait-primary",
    categories: ["business", "navigation", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
