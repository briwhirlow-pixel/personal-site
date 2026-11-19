import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/lift", destination: "/lift/index.html" },
      { source: "/lift/", destination: "/lift/index.html" },
    ];
  },
  async headers() {
    return [
      { source: "/lift-sw.js", headers: [
        { key: "Cache-Control", value: "no-cache" },
        { key: "Service-Worker-Allowed", value: "/lift" },
      ] },
      { source: "/lift", headers: [{ key: "Cache-Control", value: "no-cache" }, { key: "X-Robots-Tag", value: "noindex" }] },
      { source: "/lift/:path*", headers: [{ key: "Cache-Control", value: "no-cache" }, { key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
