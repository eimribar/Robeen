import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for integration with main Vite app
  output: 'export',

  // Blog will be served at /blog
  basePath: '/blog',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Trailing slashes for cleaner URLs
  trailingSlash: true,
};

export default nextConfig;
