import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/gym",
          "/gym/*",
          "/lift",
          "/lift/*",
          "/api/*",
          "/invoice/*",
          "/delivery/*",
          "/design-lab",
          "/logo-lab",
          "/brand",
        ],
      },
    ],
    sitemap: "https://builtbybwhirl.com/sitemap.xml",
    host: "https://builtbybwhirl.com",
  };
}
