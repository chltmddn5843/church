import { createPopup, deletePopup, togglePopup } from "@/app/actions/popups"
import { getDb } from "@/lib/db"
import { popups } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { Button } from "@/components/ui/button"

export default async function AdminPopupsPage() {
  const items = await getDb().select().from(popups).orderBy(desc(popups.createdAt))
  return <><h1 className="text-3xl font-bold">팝업 관리</h1><form action={createPopup} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 shadow-sm"><input name="title" required placeholder="팝업 제목" className="h-11 rounded-lg border px-3"/><input name="imageUrl" placeholder="이미지 경로 (예: /images/gallery-1.png)" className="h-11 rounded-lg border px-3"/><input name="linkUrl" placeholder="클릭 링크" className="h-11 rounded-lg border px-3"/><textarea name="content" rows={4} placeholder="내용" className="rounded-lg border p-3"/><label className="flex gap-2"><input type="checkbox" name="active" defaultChecked/> 바로 노출</label><Button className="w-fit">팝업 등록</Button></form><div className="mt-8 space-y-3">{items.map(item=><div key={item.id} className="flex items-center justify-between rounded-xl border bg-card p-4"><div><p className="font-semibold">{item.title}</p><p className="text-sm text-muted-foreground">{item.active ? "노출 중" : "숨김"}</p></div><div className="flex gap-2"><form action={togglePopup.bind(null,item.id,!item.active)}><Button size="sm" variant="outline">{item.active ? "숨기기" : "노출"}</Button></form><form action={deletePopup.bind(null,item.id)}><Button size="sm" variant="destructive">삭제</Button></form></div></div>)}</div></>
}
