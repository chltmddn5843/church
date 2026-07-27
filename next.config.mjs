import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pg", "pg-cloudflare"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
