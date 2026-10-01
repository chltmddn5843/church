// Cloudflare Images transformations (zone setting Images → Transformations must be on) shrink our own
// photos — R2 uploads are camera originals up to 20MB. Dev has no /cdn-cgi/image, and blob:/data:/remote/SVG pass through.
export default function cloudflareLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (process.env.NODE_ENV === "development" || !src.startsWith("/") || src.endsWith(".svg")) return src
  return `/cdn-cgi/image/width=${width},quality=${quality || 75},format=auto${src}`
}
