import { sql } from "drizzle-orm"
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"

const now = sql`(unixepoch())`

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("pending"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(now),
})

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(now),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(now),
})

// better-auth rate-limit counters. D1 (not KV) so every Worker isolate sees the same count immediately.
export const rateLimit = sqliteTable("rateLimit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: integer("lastRequest").notNull(),
})

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(now),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(now),
})

export const sermons = sqliteTable("sermons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  preacher: text("preacher").notNull().default("양승철"),
  scripture: text("scripture"),
  category: text("category").notNull().default("주일예배"),
  youtubeId: text("youtubeId"),
  summary: text("summary"),
  preachedAt: integer("preachedAt", { mode: "timestamp" }).notNull().default(now),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
}, (table) => [index("sermons_category_preached_idx").on(table.category, table.preachedAt)])

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("교회소식"),
  authorId: text("authorId"),
  authorName: text("authorName").notNull().default("관리자"),
  pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
  visibility: text("visibility").notNull().default("public"),
  legacyBoard: integer("legacyBoard"),
  legacyId: integer("legacyId"),
  views: integer("views").notNull().default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(now),
}, (table) => [
  uniqueIndex("posts_legacy_unique").on(table.legacyBoard, table.legacyId),
  index("posts_category_pinned_created_idx").on(table.category, table.pinned, table.createdAt),
])

export const attachments = sqliteTable("attachments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("postId").notNull().references(() => posts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  contentType: text("contentType").notNull(),
  size: integer("size").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
}, (table) => [index("attachments_post_idx").on(table.postId)])

export const userGroups = sqliteTable("user_groups", {
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  group: text("group").notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.group] })])

export const galleryAlbums = sqliteTable("gallery_albums", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("교회"),
  legacyId: integer("legacyId").unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
}, (table) => [index("gallery_albums_category_created_idx").on(table.category, table.createdAt)])

// Photos keep their own title/category copies so per-photo views (e.g. 전체 수료자) keep working.
export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  albumId: integer("albumId").references(() => galleryAlbums.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  imageUrl: text("imageUrl").notNull(),
  description: text("description"),
  category: text("category").notNull().default("교회"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
}, (table) => [
  index("gallery_category_created_idx").on(table.category, table.createdAt),
  index("gallery_album_idx").on(table.albumId),
])

export const popups = sqliteTable("popups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  imageUrl: text("imageUrl"),
  linkUrl: text("linkUrl"),
  content: text("content"),
  width: integer("width").notNull().default(420),
  height: integer("height").notNull().default(540),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
})

export const offeringReports = sqliteTable("offering_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  // Every weekly report shares the one distributed link; ?week=<id> opens a past week.
  accessToken: text("accessToken").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(now),
}, (table) => [index("offering_reports_token_idx").on(table.accessToken)])

export const contentPages = sqliteTable("content_pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  legacyId: integer("legacyId").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  imageUrl: text("imageUrl"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  visibility: text("visibility").notNull().default("public"),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(now),
})

export const liveStream = sqliteTable("live_stream", {
  id: integer("id").primaryKey().default(1),
  youtubeId: text("youtubeId").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(now),
})

// Small JSON cache for the YouTube lists and live check. D1 rather than KV: KV Free allows only 1,000 writes/day.
export const appCache = sqliteTable("app_cache", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
})

// 교회발자취. date is display text ("1963. 06. 16" or "1970. 01."), which also sorts chronologically.
export const historyEvents = sqliteTable("history_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  event: text("event").notNull(),
}, (table) => [index("history_events_date_idx").on(table.date)])
