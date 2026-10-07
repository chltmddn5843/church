// Pure (no server-only) so lib/uploads.test.ts can run under plain node.
export const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/gif", "gif"],
  ["application/pdf", "pdf"], ["audio/mpeg", "mp3"], ["audio/mp4", "m4a"],
])

// Browsers report the same file differently (macOS m4a = audio/x-m4a, some mp3 = audio/mp3, Windows often ""),
// so an unknown type falls back to the file extension and is stored under its canonical type.
const TYPE_ALIASES = new Map([["audio/x-m4a", "audio/mp4"], ["audio/mp3", "audio/mpeg"], ["image/jpg", "image/jpeg"], ["image/pjpeg", "image/jpeg"]])
const EXTENSION_TYPES = new Map<string, string>([...[...ALLOWED_TYPES].map(([type, ext]) => [ext, type] as const), ["jpeg", "image/jpeg"]])

export function contentTypeOf(file: { name: string; type: string }) {
  const type = TYPE_ALIASES.get(file.type) ?? file.type
  return ALLOWED_TYPES.has(type) ? type : EXTENSION_TYPES.get(file.name.split(".").pop()?.toLowerCase() ?? "")
}
