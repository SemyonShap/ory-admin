import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.with-jiko.com"],
  output: "standalone",
};

export default nextConfig;
