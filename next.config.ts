import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ESLintによるエラーがあってもビルドを続行する
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 型チェックエラーがあってもビルドを続行する
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
