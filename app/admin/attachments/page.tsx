import Link from "next/link"
import { desc, eq } from "drizzle-orm"
import { deleteAttachment } from "@/app/actions/attachments"
import { Button } from "@/components/ui/button"
import { getDb } from "@/lib/db"
import { attachments, gallery, popups, posts } from "@/lib/db/schema"

export default async function AdminAttachmentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const db = getDb()
  const [postFiles, galleryFiles, popupFiles] = await Promise.all([
    db.select({ id: attachments.id, name: attachments.name, url: attachments.url, size: attachments.size, createdAt: attachments.createdAt, source: posts.title }).from(attachments).innerJoin(posts, eq(attachments.postId, posts.id)).orderBy(desc(attachments.createdAt)),
    db.select({ id: gallery.id, name: gallery.title, url: gallery.imageUrl, createdAt: gallery.createdAt }).from(gallery).orderBy(desc(gallery.createdAt)),
    db.select({ id: popups.id, name: popups.title, url: popups.imageUrl, createdAt: popups.createdAt }).from(popups).orderBy(desc(popups.createdAt)),
  ])
  const files = [
    ...postFiles.map(file => ({ ...file, type: "게시글 첨부", manageHref: null })),
    ...galleryFiles.map(file => ({ ...file, size: null, source: "갤러리", type: "갤러리", manageHref: "/admin/gallery" })),
    ...popupFiles.filter(file => file.url).map(file => ({ ...file, url: file.url!, size: null, source: "팝업", type: "팝업", manageHref: "/admin/popups" })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  const q = (await searchParams).q?.trim().toLowerCase() ?? ""
  const visible = q ? files.filter(file => `${file.name} ${file.source}`.toLowerCase().includes(q)) : files

  return <><h1 className="text-3xl font-bold">첨부파일 관리</h1><form className="mt-6 flex max-w-xl gap-2"><input name="q" defaultValue={q} placeholder="파일명 또는 게시글 검색" className="h-11 flex-1 border px-3"/><Button>검색</Button></form><p className="mt-5 text-sm text-muted-foreground">게시글 첨부는 여기서 삭제할 수 있습니다. 갤러리와 팝업 이미지는 연결된 콘텐츠 관리 화면에서 삭제합니다.</p><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="border-y bg-muted/40"><tr><th className="p-3 text-left">구분</th><th className="p-3 text-left">파일</th><th className="p-3 text-left">연결 콘텐츠</th><th className="p-3 text-right">크기</th><th className="p-3 text-right">날짜</th><th className="p-3 text-right">관리</th></tr></thead><tbody>{visible.map(file => <tr key={`${file.type}-${file.id}`} className="border-b"><td className="p-3">{file.type}</td><td className="max-w-72 truncate p-3"><a href={file.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{file.name}</a></td><td className="p-3">{file.source}</td><td className="p-3 text-right">{file.size == null ? "-" : `${Math.ceil(file.size / 1024).toLocaleString("ko-KR")} KB`}</td><td className="p-3 text-right">{file.createdAt.toLocaleDateString("ko-KR")}</td><td className="p-3 text-right">{file.manageHref ? <Button render={<Link href={file.manageHref}/>} nativeButton={false} size="sm" variant="outline">관리</Button> : <form action={deleteAttachment.bind(null, file.id)}><Button size="sm" variant="destructive">삭제</Button></form>}</td></tr>)}</tbody></table>{visible.length === 0 && <p className="py-12 text-center text-muted-foreground">첨부파일이 없습니다.</p>}</div></>
}
