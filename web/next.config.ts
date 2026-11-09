import type { NextConfig } from "next";

/**
 * Static export: `next build` writes plain HTML/CSS/JS to `out/`, which the
 * Python server in portfolio_server/ serves (locally and on Cloud Run).
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // no image server in a static export; images are pre-sized
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
