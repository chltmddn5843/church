import "server-only"
import { getDb } from "@/lib/db"
import { sermons, posts, gallery, popups, attachments } from "@/lib/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"
import { canAccess, getViewerAccess } from "@/lib/access"

export async function getSermons(category?: string, limit?: number) {
  const db = getDb()
  const where = category ? eq(sermons.category, category) : undefined
  const q = db.select().from(sermons).where(where).orderBy(desc(sermons.preachedAt))
  if (limit) return q.limit(limit)
  return q
}

export async function getSermon(id: number) {
  if (!Number.isSafeInteger(id) || id < 1) return null
  const db = getDb()
  return (await db.select().from(sermons).where(eq(sermons.id, id)).limit(1).get()) ?? null
}

export async function getPosts(category?: string, limit?: number) {
  const db = getDb()
  const where = category ? eq(posts.category, category) : undefined
  const q = db.select().from(posts).where(where).orderBy(desc(posts.pinned), desc(posts.createdAt))
  const items = await q
  const viewer = await getViewerAccess()
  const visible = items.filter((post) => canAccess(post.visibility, viewer))
  return limit ? visible.slice(0, limit) : visible
}

export async function getPost(id: number) {
  if (!Number.isSafeInteger(id) || id < 1) return null
  const db = getDb()
  const post = await db.select().from(posts).where(eq(posts.id, id)).limit(1).get()
  if (!post || !canAccess(post.visibility, await getViewerAccess())) return null
  return { ...post, attachments: await db.select().from(attachments).where(eq(attachments.postId, post.id)) }
}

export async function incrementPostView(id: number) {
  await getDb().update(posts).set({ views: sql`${posts.views} + 1` }).where(eq(posts.id, id))
}

export async function getLegacyPost(board: number, id: number) {
  if (![board, id].every(Number.isSafeInteger)) return null
  return getDb().select({ id: posts.id }).from(posts).where(and(eq(posts.legacyBoard, board), eq(posts.legacyId, id))).get()
}

export async function getGallery(limit?: number) {
  const db = getDb()
  const q = db.select().from(gallery).orderBy(desc(gallery.createdAt))
  if (limit) return q.limit(limit)
  return q
}

export async function getActivePopups() {
  const db = getDb()
  try {
    return await db
      .select()
      .from(popups)
      .where(eq(popups.active, true))
      .orderBy(desc(popups.createdAt))
  } catch (error) {
    console.error("Failed to load active popups:", error)
    return []
  }
}
