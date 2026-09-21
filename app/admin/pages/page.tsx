import Link from "next/link"
import { saveContentPage } from "@/app/actions/pages"
import { Button } from "@/components/ui/button"
import { getDb } from "@/lib/db"
import { contentPages } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import { accessOptions } from "@/lib/access"

export default async function AdminContentPagesPage() {
  const pages = await getDb().select().from(contentPages).orderBy(asc(contentPages.legacyId))
  return <><h1 className="text-3xl font-bold">소개 페이지 관리</h1><p className="mt-2 text-muted-foreground">기존 사이트의 Page/Index 주소와 호환되는 콘텐츠를 직접 관리합니다.</p><form action={saveContentPage} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6"><input name="legacyId" type="number" min="1" required placeholder="기존 페이지 번호" className="h-11 rounded-lg border px-3"/><input name="title" required placeholder="페이지 제목" className="h-11 rounded-lg border px-3"/><input name="imageUrl" placeholder="/images/pastor.png" className="h-11 rounded-lg border px-3"/><select name="visibility" className="h-11 rounded-lg border px-3">{accessOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><textarea name="content" required rows={12} placeholder="페이지 내용" className="rounded-lg border p-3"/><label className="flex gap-2"><input type="checkbox" name="published" defaultChecked/> 게시</label><Button type="submit" className="w-fit">페이지 저장</Button></form><div className="mt-8 space-y-3">{pages.map(page=><Link key={page.id} href={`/Page/Index/${page.legacyId}`} className="flex justify-between rounded-xl border bg-card p-4"><span><b>{page.legacyId}</b> · {page.title}</span><span className="text-sm text-muted-foreground">{page.published ? accessOptions.find(([value]) => value === page.visibility)?.[1] : "미게시"}</span></Link>)}</div></>
}
