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
  // 詳細なエラーメッセージを表示する
  reactStrictMode: true,
  // 本番環境でもソースマップを生成する
  productionBrowserSourceMaps: true,
  // 環境変数をクライアントに公開する
  env: {
    DEBUG: 'true',
  },
};

export default nextConfig;
