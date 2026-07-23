import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pg", "pg-cloudflare"],
  images: {
    unoptimized: true,
  },
  // OpenNext/esbuild 번들링 에러 방지
  
  serverExternalPackages: ["pg", "pg-cloudflare"],
};

export default nextConfig;
