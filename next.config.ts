import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Force HTTPS: redirect any request that arrived over plain HTTP
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        permanent: true,
        destination: "https://worldcup.datamerislaunchpad.com/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/delrmm6pq/image/upload/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // HTML/pages: don't cache — prevents stale page referencing old JS/CSS hashes
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      {
        // Hashed static assets: cache forever (safe because filenames change each build)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
