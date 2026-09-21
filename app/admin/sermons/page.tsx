import { createSermon, deleteSermon, updateSermon } from "@/app/actions/sermons"
import { getSermons, getSermonsCount } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"

const categories = ["주일예배", "금요예배", "새벽예배", "쉐키나찬양단", "할렐루야찬양대"]
const PAGE_SIZE = 20

export default async function AdminSermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const [items, total] = await Promise.all([
    getSermons(undefined, PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getSermonsCount(),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  return <><h1 className="text-3xl font-bold">설교 관리</h1><p className="mt-2 text-muted-foreground">YouTube 전체 링크 또는 영상 ID를 입력하면 자동으로 임베드됩니다.</p><form action={createSermon} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 shadow-sm md:grid-cols-2"><input name="title" required placeholder="설교 제목" className="h-11 rounded-lg border px-3 md:col-span-2"/><input name="preacher" placeholder="설교자" defaultValue="양승철" className="h-11 rounded-lg border px-3"/><input name="scripture" placeholder="성경 본문" className="h-11 rounded-lg border px-3"/><select name="category" className="h-11 rounded-lg border px-3">{categories.map(category => <option key={category}>{category}</option>)}</select><input name="preachedAt" type="date" className="h-11 rounded-lg border px-3"/><input name="youtubeId" required placeholder="https://www.youtube.com/watch?v=..." className="h-11 rounded-lg border px-3 md:col-span-2"/><textarea name="summary" rows={5} placeholder="말씀 요약" className="rounded-lg border p-3 md:col-span-2"/><Button type="submit" className="w-fit">설교 등록</Button></form><div className="mt-8 space-y-3">{items.map(item=><details key={item.id} className="rounded-xl border bg-card p-4"><summary className="cursor-pointer font-semibold">{item.title} <span className="text-sm font-normal text-muted-foreground">· {item.category} · {item.preacher}</span></summary><form action={updateSermon.bind(null,item.id)} className="mt-4 grid gap-3 md:grid-cols-2"><input name="title" required defaultValue={item.title} className="h-11 rounded-lg border px-3 md:col-span-2"/><input name="preacher" defaultValue={item.preacher} className="h-11 rounded-lg border px-3"/><input name="scripture" defaultValue={item.scripture ?? ""} className="h-11 rounded-lg border px-3"/><select name="category" defaultValue={item.category} className="h-11 rounded-lg border px-3">{categories.map(category => <option key={category}>{category}</option>)}</select><input name="preachedAt" type="date" defaultValue={new Date(item.preachedAt).toISOString().slice(0,10)} className="h-11 rounded-lg border px-3"/><input name="youtubeId" required defaultValue={item.youtubeId ?? ""} className="h-11 rounded-lg border px-3 md:col-span-2"/><textarea name="summary" rows={5} defaultValue={item.summary ?? ""} className="rounded-lg border p-3 md:col-span-2"/><div className="flex gap-2"><Button type="submit" size="sm">수정 저장</Button><Button type="submit" formAction={deleteSermon.bind(null,item.id)} size="sm" variant="destructive">삭제</Button></div></form></details>)}</div><Pagination page={page} totalPages={totalPages} hrefFor={(p) => (p > 1 ? `/admin/sermons?page=${p}` : "/admin/sermons")} /></>
}
