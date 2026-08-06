"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { liveStream } from "@/lib/db/schema"
import { parseYoutubeId } from "@/lib/youtube"

export async function saveLiveStream(formData: FormData) {
  await requireAdmin()
  const youtubeId = parseYoutubeId(String(formData.get("url") ?? ""))
  if (!youtubeId) throw new Error("올바른 YouTube 영상 주소를 입력해 주세요.")
  await getDb().insert(liveStream).values({ id: 1, youtubeId, updatedAt: new Date() }).onConflictDoUpdate({ target: liveStream.id, set: { youtubeId, updatedAt: new Date() } })
  revalidatePath("/admin/live")
  revalidatePath("/")
}
