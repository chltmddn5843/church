import "server-only"
import { getDb } from "@/lib/db"
import { sermons, posts, gallery, galleryAlbums, popups, attachments, offeringReports } from "@/lib/db/schema"
import { and, asc, count, desc, eq, gt, inArray, like, lt, ne, sql } from "drizzle-orm"
import { canAccess, getViewerAccess } from "@/lib/access"

export async function getSermons(category?: string, limit?: number, offset?: number) {
  const db = getDb()
  const where = category ? eq(sermons.category, category) : undefined
  const q = db.select().from(sermons).where(where).orderBy(desc(sermons.preachedAt))
  if (limit) q.limit(limit)
  if (offset) q.offset(offset)
  return q
}

export async function getSermonsCount(category?: string) {
  const db = getDb()
  const where = category ? eq(sermons.category, category) : undefined
  const result = await db.select({ value: count() }).from(sermons).where(where).get()
  return result?.value ?? 0
}

export async function getSermon(id: number) {
  if (!Number.isSafeInteger(id) || id < 1) return null
  const db = getDb()
  return (await db.select().from(sermons).where(eq(sermons.id, id)).limit(1).get()) ?? null
}

export type PostSearch = { field: "title" | "author"; q: string }

function postsWhere(category: string | undefined, viewer: Awaited<ReturnType<typeof getViewerAccess>>, search?: PostSearch) {
  const visibility = viewer.role === "admin"
    ? undefined
    : inArray(posts.visibility, ["public", ...(viewer.role === "member" ? ["member"] : []), ...viewer.groups])
  const searchCondition = search?.q
    ? like(search.field === "author" ? posts.authorName : posts.title, `%${search.q}%`)
    : undefined
  return and(category ? eq(posts.category, category) : undefined, ne(posts.category, "헌금 현황"), visibility, searchCondition)
}

export async function getPosts(category?: string, limit?: number, offset?: number, search?: PostSearch) {
  const db = getDb()
  const where = postsWhere(category, await getViewerAccess(), search)
  const q = db.select().from(posts).where(where).orderBy(desc(posts.pinned), desc(posts.createdAt))
  if (limit) q.limit(limit)
  if (offset) q.offset(offset)
  return q
}

export async function getPostsCount(category?: string, search?: PostSearch) {
  const db = getDb()
  const where = postsWhere(category, await getViewerAccess(), search)
  const result = await db.select({ value: count() }).from(posts).where(where).get()
  return result?.value ?? 0
}

export async function getPostThumbnails(postIds: number[]) {
  if (!postIds.length) return new Map<number, string>()
  const rows = await getDb()
    .select({ postId: attachments.postId, url: attachments.url, contentType: attachments.contentType })
    .from(attachments)
    .where(inArray(attachments.postId, postIds))
  const thumbnails = new Map<number, string>()
  for (const row of rows) {
    if (row.contentType.startsWith("image/") && !thumbnails.has(row.postId)) thumbnails.set(row.postId, row.url)
  }
  return thumbnails
}

export async function getLatestBulletin() {
  const [post] = await getPosts("주보", 1)
  if (!post) return null
  const files = await getDb()
    .select({ url: attachments.url, name: attachments.name, contentType: attachments.contentType })
    .from(attachments)
    .where(eq(attachments.postId, post.id))
  const pdf = files.find((f) => f.contentType === "application/pdf") ?? null
  const images = pdf ? [] : files.filter((f) => f.contentType.startsWith("image/"))
  return { id: post.id, title: post.title, createdAt: post.createdAt, pdf, images }
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

export async function getAdjacentPosts(id: number, category: string, createdAt: Date) {
  const db = getDb()
  const viewer = await getViewerAccess()
  const visibility = viewer.role === "admin"
    ? undefined
    : inArray(posts.visibility, ["public", ...(viewer.role === "member" ? ["member"] : []), ...viewer.groups])
  const base = and(eq(posts.category, category), visibility)
  const [prev, next] = await Promise.all([
    db.select({ id: posts.id, title: posts.title }).from(posts)
      .where(and(base, lt(posts.createdAt, createdAt)))
      .orderBy(desc(posts.createdAt)).limit(1).get(),
    db.select({ id: posts.id, title: posts.title }).from(posts)
      .where(and(base, gt(posts.createdAt, createdAt)))
      .orderBy(asc(posts.createdAt)).limit(1).get(),
  ])
  return { prev: prev ?? null, next: next ?? null }
}

export async function getLegacyPost(board: number, id: number) {
  if (![board, id].every(Number.isSafeInteger)) return null
  return getDb().select({ id: posts.id }).from(posts).where(and(eq(posts.legacyBoard, board), eq(posts.legacyId, id))).get()
}

const albumFields = {
  id: galleryAlbums.id,
  title: galleryAlbums.title,
  category: galleryAlbums.category,
  createdAt: galleryAlbums.createdAt,
  // Spelled out: inside select(), drizzle prints columns unqualified, so "id" would bind to the subquery's gallery.id.
  coverUrl: sql<string | null>`(SELECT p."imageUrl" FROM "gallery" p WHERE p."albumId" = "gallery_albums"."id" ORDER BY p."id" LIMIT 1)`,
  photoCount: sql<number>`(SELECT count(*) FROM "gallery" p WHERE p."albumId" = "gallery_albums"."id")`,
}

export async function getGalleryAlbums(limit?: number, offset?: number, category?: string) {
  const q = getDb().select(albumFields).from(galleryAlbums).where(category ? eq(galleryAlbums.category, category) : undefined).orderBy(desc(galleryAlbums.createdAt), desc(galleryAlbums.id))
  if (limit) q.limit(limit)
  if (offset) q.offset(offset)
  return q
}

export async function getGalleryAlbumCount(category?: string) {
  const result = await getDb().select({ value: count() }).from(galleryAlbums).where(category ? eq(galleryAlbums.category, category) : undefined).get()
  return result?.value ?? 0
}

export async function getGalleryAlbum(id: number) {
  if (!Number.isSafeInteger(id)) return null
  const db = getDb()
  const album = await db.select().from(galleryAlbums).where(eq(galleryAlbums.id, id)).get()
  if (!album) return null
  const [photos, prev, next] = await Promise.all([
    db.select({ id: gallery.id, imageUrl: gallery.imageUrl }).from(gallery).where(eq(gallery.albumId, id)).orderBy(asc(gallery.id)),
    db.select({ id: galleryAlbums.id, title: galleryAlbums.title }).from(galleryAlbums).where(lt(galleryAlbums.createdAt, album.createdAt)).orderBy(desc(galleryAlbums.createdAt)).limit(1).get(),
    db.select({ id: galleryAlbums.id, title: galleryAlbums.title }).from(galleryAlbums).where(gt(galleryAlbums.createdAt, album.createdAt)).orderBy(asc(galleryAlbums.createdAt)).limit(1).get(),
  ])
  return { ...album, photos, prev, next }
}

export async function getLegacyGalleryAlbum(legacyId: number) {
  if (!Number.isSafeInteger(legacyId)) return null
  return getDb().select({ id: galleryAlbums.id }).from(galleryAlbums).where(eq(galleryAlbums.legacyId, legacyId)).get()
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

/** The week with that id, or the newest week when none is given. Hidden weeks never show. */
export async function getActiveOfferingReportByToken(token: string, week?: number) {
  if (!token || token.length < 16) return null
  const filters = [eq(offeringReports.accessToken, token), eq(offeringReports.active, true)]
  if (week !== undefined) filters.push(eq(offeringReports.id, week))
  return (
    (await getDb()
      .select()
      .from(offeringReports)
      .where(and(...filters))
      .orderBy(desc(offeringReports.id))
      .limit(1)
      .get()) ?? null
  )
}

/** Visible weeks behind one link, newest first, for the viewer's week list. */
export async function getActiveOfferingWeeks(token: string) {
  return getDb()
    .select({ id: offeringReports.id, title: offeringReports.title, createdAt: offeringReports.createdAt })
    .from(offeringReports)
    .where(and(eq(offeringReports.accessToken, token), eq(offeringReports.active, true)))
    .orderBy(desc(offeringReports.id))
}

// Newest week first. id, not updatedAt: correcting an old week must not make it "this week".
export async function getOfferingReports() {
  return getDb().select().from(offeringReports).orderBy(desc(offeringReports.id))
}
