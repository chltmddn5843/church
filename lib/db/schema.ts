import { sql } from "drizzle-orm"
import { integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"

const now = sql`(unixepoch())`

// Better Auth tables. Column names intentionally match Better Auth defaults.
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
})

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
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(now),
}, (table) => [uniqueIndex("posts_legacy_unique").on(table.legacyBoard, table.legacyId)])

export const attachments = sqliteTable("attachments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("postId").notNull().references(() => posts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  contentType: text("contentType").notNull(),
  size: integer("size").notNull(),
})

export const userGroups = sqliteTable("user_groups", {
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  group: text("group").notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.group] })])

export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  imageUrl: text("imageUrl").notNull(),
  description: text("description"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
})

export const popups = sqliteTable("popups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  imageUrl: text("imageUrl"),
  linkUrl: text("linkUrl"),
  content: text("content"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(now),
})

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
