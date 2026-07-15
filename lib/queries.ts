import "server-only"
import { db } from "@/lib/db"
import { sermons, posts, gallery, popups } from "@/lib/db/schema"
import { desc, eq, and } from "drizzle-orm"

export async function getSermons(category?: string, limit?: number) {
  const where = category ? eq(sermons.category, category) : undefined
  const q = db.select().from(sermons).where(where).orderBy(desc(sermons.preachedAt))
  if (limit) return q.limit(limit)
  return q
}

export async function getSermon(id: number) {
  const rows = await db.select().from(sermons).where(eq(sermons.id, id)).limit(1)
  return rows[0] ?? null
}

export async function getPosts(category?: string, limit?: number) {
  const where = category ? eq(posts.category, category) : undefined
  const q = db.select().from(posts).where(where).orderBy(desc(posts.pinned), desc(posts.createdAt))
  if (limit) return q.limit(limit)
  return q
}

export async function getPost(id: number) {
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1)
  return rows[0] ?? null
}

export async function getGallery(limit?: number) {
  const q = db.select().from(gallery).orderBy(desc(gallery.createdAt))
  if (limit) return q.limit(limit)
  return q
}

export async function getActivePopups() {
  return db.select().from(popups).where(eq(popups.active, true)).orderBy(desc(popups.createdAt))
}
