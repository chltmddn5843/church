import Link from "next/link"
import { getDb } from "@/lib/db"
import { gallery, popups, posts, sermons, user } from "@/lib/db/schema"
import { count } from "drizzle-orm"

export default async function AdminPage() {
  const db = getDb()
  const tables = [sermons, posts, gallery, popups, user] as const
  const values = await Promise.all(tables.map(async (table) => (await db.select({ value: count() }).from(table).get())?.value ?? 0))
  const cards = [
    ["설교", values[0], "/admin/sermons"], ["게시글", values[1], "/admin/posts"],
    ["갤러리", values[2], "/admin/gallery"], ["팝업", values[3], "/admin/popups"], ["회원", values[4], "/admin/members"],
  ] as const
  return <><h1 className="text-3xl font-bold">관리자 대시보드</h1><p className="mt-2 text-muted-foreground">원당교회 홈페이지 콘텐츠를 관리합니다.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([label,value,href])=><Link key={label} href={href} className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold text-primary">{value}</p></Link>)}</div></>
}
