import { pgTable, text, timestamp, boolean, serial } from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  // Custom field: "member" (default) or "admin". Managed via SQL/CMS, not the auth flow.
  role: text("role").notNull().default("member"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables (church CMS content) ---------------------------------------
// These are site-wide content managed by admins, not per-user data.

// 설교 (sermons)
export const sermons = pgTable("sermons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  preacher: text("preacher").notNull().default("양승철"),
  scripture: text("scripture"), // 본문 말씀
  category: text("category").notNull().default("주일예배"), // 주일예배 | 수요예배 | 새벽기도
  youtubeId: text("youtubeId"), // YouTube video id
  summary: text("summary"),
  preachedAt: timestamp("preachedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// 교회소식 / 공지 (posts)
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("교회소식"), // 교회소식 | 공지사항
  authorId: text("authorId"),
  authorName: text("authorName").notNull().default("관리자"),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// 갤러리 (gallery)
export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("imageUrl").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// 팝업 배너 (popups)
export const popups = pgTable("popups", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("imageUrl"),
  linkUrl: text("linkUrl"),
  content: text("content"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
