import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 builds a fully static site into ./out (used for GitHub Pages).
 * NEXT_PUBLIC_BASE_PATH sets the sub-path the site is served from, e.g. /ridham-portfolio.
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  basePath,
  ...(staticExport
    ? {
        output: "export",
        trailingSlash: true,
        // No image optimizer on a static host; source images are already small JPEGs.
        images: { unoptimized: true },
      }
    : {
        images: { formats: ["image/avif", "image/webp"] },
        async headers() {
          return [{ source: "/(.*)", headers: securityHeaders }];
        },
      }),
  experimental: { optimizePackageImports: ["framer-motion", "recharts", "@react-three/drei"] },
};

export default nextConfig;
