"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { liveStream } from "@/lib/db/schema"
import { parseYoutubeId } from "@/lib/youtube"

export async function saveLiveStream(formData: FormData) {
  await requireAdmin()
  const youtubeId = parseYoutubeId(String(formData.get("url") ?? ""))
  // Back to the form with a message rather than an error page; admins paste many link shapes.
  if (!youtubeId) redirect("/admin/live?error=youtube")
  await getDb().insert(liveStream).values({ id: 1, youtubeId, updatedAt: new Date() }).onConflictDoUpdate({ target: liveStream.id, set: { youtubeId, updatedAt: new Date() } })
  revalidatePath("/admin/live")
  revalidatePath("/")
  redirect("/admin/live?saved=live")
}

export async function clearLiveStream() {
  await requireAdmin()
  await getDb().delete(liveStream).where(eq(liveStream.id, 1))
  revalidatePath("/admin/live")
  revalidatePath("/")
  redirect("/admin/live?saved=cleared")
}
