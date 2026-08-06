import "server-only"
import { getCloudflareContext } from "@opennextjs/cloudflare"

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "application/pdf", "audio/mpeg", "audio/mp4",
])

export async function uploadFile(file: File, folder: "gallery" | "attachments") {
  if (!file.size || file.size > MAX_FILE_SIZE) throw new Error("파일은 20MB 이하만 업로드할 수 있습니다.")
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("이미지, PDF, MP3, M4A 파일만 업로드할 수 있습니다.")
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin"
  const key = `${folder}/${crypto.randomUUID()}.${extension}`
  await getCloudflareContext().env.POPUP_IMAGES.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { originalName: file.name },
  })
  return { key, url: `/api/uploads/${key}` }
}

export async function deleteUpload(url: string) {
  const prefix = "/api/uploads/"
  if (url.startsWith(prefix)) await getCloudflareContext().env.POPUP_IMAGES.delete(url.slice(prefix.length))
}
