import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ↓ 추가된 부분
  images: {
    domains: ["bmduyrsgjjwrpvmrrgut.supabase.co"],
  },
};

export default nextConfig;
