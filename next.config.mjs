/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // OpenNext/esbuild 번들링 에러 방지
  serverExternalPackages: ["pg", "pg-cloudflare"],
};

export default nextConfig;
