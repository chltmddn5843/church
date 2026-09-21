import Link from "next/link"
import { ArrowRight, Bell, BookOpen, FileText, ImageIcon, Newspaper, Plus, Users } from "lucide-react"
import { count, desc } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { gallery, popups, posts, sermons, user } from "@/lib/db/schema"

function formatDate(value: Date | null) {
  if (!value) return "-"
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(value)
}

export default async function AdminPage() {
  const db = getDb()
  const tables = [sermons, posts, gallery, popups, user] as const
  const [values, recentPosts, recentSermons] = await Promise.all([
    Promise.all(tables.map(async (table) => (await db.select({ value: count() }).from(table).get())?.value ?? 0)),
    db.select().from(posts).orderBy(desc(posts.createdAt)).limit(4),
    db.select().from(sermons).orderBy(desc(sermons.createdAt)).limit(4),
  ])

  const cards = [
    { label: "등록된 설교", value: values[0], href: "/admin/sermons", icon: BookOpen, tone: "bg-[#9CC7E6]/35 text-[#123A63]" },
    { label: "소식 및 공지", value: values[1], href: "/admin/posts", icon: Newspaper, tone: "bg-[#F2E9DA] text-[#123A63]" },
    { label: "갤러리 사진", value: values[2], href: "/admin/gallery", icon: ImageIcon, tone: "bg-[#e7fbf6] text-[#267b72]" },
    { label: "등록된 팝업", value: values[3], href: "/admin/popups", icon: Bell, tone: "bg-[#f0f8ff] text-[#5a8fc7]" },
    { label: "전체 회원", value: values[4], href: "/admin/members", icon: Users, tone: "bg-[#f2f8fc] text-[#496879]" },
  ]

  return (
    <>
      <div className="border-b border-[#d7e5ee] pb-6">
        <p className="text-sm font-semibold text-[#2F5D8A]">ADMINISTRATION</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#183247]">관리자 대시보드</h1>
        <p className="mt-2 text-sm text-[#526a7d]">원당교회 홈페이지의 콘텐츠와 회원 현황을 관리합니다.</p>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold text-[#183247]">콘텐츠 현황</h2>
          <span className="text-xs text-[#6d7f8c]">현재 등록 기준</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map(({ label, value, href, icon: Icon, tone }) => (
            <Link
              key={label}
              href={href}
              className="group rounded-lg border border-[#d7e5ee] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9CC7E6] hover:shadow-md"
            >
              <div className={`flex size-10 items-center justify-center rounded-full ${tone}`}><Icon className="size-[18px]" /></div>
              <p className="mt-5 text-sm text-[#526a7d]">{label}</p>
              <div className="mt-1 flex items-end justify-between">
                <strong className="text-3xl tracking-tight text-[#183247]">{value}</strong>
                <ArrowRight className="size-4 text-[#9CC7E6] transition group-hover:translate-x-1 group-hover:text-[#2F5D8A]" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-[#183247]">빠른 등록</h2>
        <div className="grid overflow-hidden rounded-lg border border-[#d7e5ee] bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["새 설교 등록", "/admin/sermons", BookOpen],
            ["공지사항 작성", "/admin/posts", Newspaper],
            ["갤러리 등록", "/admin/gallery", ImageIcon],
            ["팝업 등록", "/admin/popups", Bell],
          ].map(([label, href, Icon], index) => (
            <Link
              key={label as string}
              href={href as string}
              className={`flex items-center justify-between px-5 py-4 text-sm font-medium text-[#183247] transition hover:bg-[#eaf7ff] ${index > 0 ? "border-t border-[#d7e5ee] sm:border-t-0 sm:border-l" : ""} ${index === 2 ? "sm:border-l-0 sm:border-t lg:border-l lg:border-t-0" : ""}`}
            >
              <span className="flex items-center gap-3"><Icon className="size-[18px] text-[#2F5D8A]" />{label as string}</span>
              <Plus className="size-4 text-[#9CC7E6]" />
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <RecentList title="최근 소식·공지" href="/admin/posts" empty="등록된 게시글이 없습니다." items={recentPosts.map((item) => ({ id: item.id, title: item.title, meta: item.category, date: formatDate(item.createdAt) }))} icon={FileText} />
        <RecentList title="최근 설교" href="/admin/sermons" empty="등록된 설교가 없습니다." items={recentSermons.map((item) => ({ id: item.id, title: item.title, meta: item.category, date: formatDate(item.createdAt) }))} icon={BookOpen} />
      </div>
    </>
  )
}

function RecentList({ title, href, empty, items, icon: Icon }: { title: string; href: string; empty: string; items: { id: number; title: string; meta: string; date: string }[]; icon: typeof FileText }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#183247]">{title}</h2>
        <Link href={href} className="flex items-center gap-1 text-xs text-[#6d7f8c] hover:text-[#183247]">전체보기 <ArrowRight className="size-3" /></Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-[#d7e5ee] bg-white shadow-sm">
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#6d7f8c]">{empty}</p>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className={`flex items-center gap-3 px-5 py-4 ${index > 0 ? "border-t border-[#e5eef4]" : ""}`}>
              <Icon className="size-4 shrink-0 text-[#9CC7E6]" />
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#183247]">{item.title}</p><p className="mt-1 text-xs text-[#6d7f8c]">{item.meta}</p></div>
              <time className="shrink-0 text-xs text-[#6d7f8c]">{item.date}</time>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
