import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  distDir: "out",
  basePath: "",
  trailingSlash: true,
  assetPrefix: "./",
};

export default nextConfig;
