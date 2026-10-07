import "server-only"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { ALLOWED_TYPES, contentTypeOf } from "@/lib/upload-types"

const MAX_FILE_SIZE = 20 * 1024 * 1024

export class UploadError extends Error {}

export async function uploadFile(file: File, folder: "gallery" | "attachments") {
  if (!file.size || file.size > MAX_FILE_SIZE) throw new UploadError("파일은 20MB 이하만 업로드할 수 있습니다.")
  const contentType = contentTypeOf(file)
  if (!contentType) throw new UploadError("이미지(JPG·PNG·WEBP·GIF), PDF, MP3, M4A 파일만 업로드할 수 있습니다.")
  const key = `${folder}/${crypto.randomUUID()}.${ALLOWED_TYPES.get(contentType)}`
  await getCloudflareContext().env.POPUP_IMAGES.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType },
    customMetadata: { originalName: file.name },
  })
  return { key, url: `/api/uploads/${key}`, contentType }
}

export async function deleteUpload(url: string) {
  const prefix = "/api/uploads/"
  if (url.startsWith(prefix)) await getCloudflareContext().env.POPUP_IMAGES.delete(url.slice(prefix.length))
}
