import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      // Post attachments allow multiple files up to 20MB each (see lib/uploads.ts);
      // Next's default 1MB Server Action body limit rejects those before that check runs.
      bodySizeLimit: "100mb",
    },
  },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: blob: https://img.youtube.com; font-src 'self' data:; frame-src https://www.youtube.com https://www.openstreetmap.org; connect-src 'self' https://vitals.vercel-insights.com" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    }]
  },
  async redirects() {
    return [
      ["/Board/Index/21", "/sermons?category=주일예배"],
      ["/Board/Index/22", "/sermons?category=금요예배"],
      ["/Board/Index/23", "/sermons?category=찬양대"],
      ["/Board/Index/59", "/community?category=공지사항"],
      ["/Page/Index/59", "/community?category=공지사항"],
      ["/Board/Index/60", "/community?category=교회소식"],
      ["/Board/Index/61", "/community?category=새가족소개"],
      ["/Board/Index/62", "/gallery"],
      ["/Board/Index/332", "/community?category=가정예배순서지"],
      ["/Board/Index/976", "/community?category=자료실"],
    ].map(([source, destination]) => ({ source, destination, permanent: true }))
  },
};

export default nextConfig;
