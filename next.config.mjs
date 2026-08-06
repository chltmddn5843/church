import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      ["/Board/Index/21", "/sermons?category=주일예배"],
      ["/Board/Index/22", "/sermons?category=금요예배"],
      ["/Board/Index/23", "/sermons?category=찬양대"],
      ["/Board/Index/59", "/community?category=공지사항"],
      ["/Board/Index/60", "/community?category=교회소식"],
      ["/Board/Index/61", "/community?category=새가족소개"],
      ["/Board/Index/62", "/gallery"],
      ["/Board/Index/332", "/community?category=가정예배순서지"],
      ["/Board/Index/976", "/community?category=자료실"],
      ["/Board/Index/4820", "/community?category=헌금 내역"],
    ].map(([source, destination]) => ({ source, destination, permanent: true }))
  },
};

export default nextConfig;
