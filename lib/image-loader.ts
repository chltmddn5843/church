// Cloudflare Images transformations (zone setting Images → Transformations must be on) shrink our own
// photos — R2 uploads are camera originals up to 20MB. Dev has no /cdn-cgi/image, and blob:/data:/remote/SVG pass through.
export default function cloudflareLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/") || src.endsWith(".svg")) return src
  // ?w= only satisfies Next's dev check that the loader uses width; the static file server ignores it.
  if (process.env.NODE_ENV === "development") return `${src}?w=${width}`
  return `/cdn-cgi/image/width=${width},quality=${quality || 75},format=auto${src}`
}
