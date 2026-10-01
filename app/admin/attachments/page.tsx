import Link from "next/link"
import { desc, eq } from "drizzle-orm"
import { ExternalLink, FileText, Music } from "lucide-react"
import { deleteAttachment } from "@/app/actions/attachments"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { getDb } from "@/lib/db"
import { attachments, gallery, popups, posts } from "@/lib/db/schema"
import cloudflareLoader from "@/lib/image-loader"

const PAGE_SIZE = 30
const types = ["게시글 첨부", "갤러리", "팝업"] as const
const fieldClass = "h-11 rounded-md border border-border bg-white px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"

export default async function AdminAttachmentsPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; page?: string }> }) {
  const params = await searchParams
  const q = params.q?.trim() ?? ""
  const type = types.find((t) => t === params.type)
  const db = getDb()
  // ponytail: loads every file row then filters/pages in memory; fine for a church site, move to SQL LIMIT/OFFSET if rows reach tens of thousands.
  const [postFiles, galleryFiles, popupFiles] = await Promise.all([
    db.select({ id: attachments.id, name: attachments.name, url: attachments.url, size: attachments.size, contentType: attachments.contentType, createdAt: attachments.createdAt, postId: posts.id, source: posts.title }).from(attachments).innerJoin(posts, eq(attachments.postId, posts.id)).orderBy(desc(attachments.createdAt)),
    db.select({ id: gallery.id, name: gallery.title, url: gallery.imageUrl, createdAt: gallery.createdAt }).from(gallery).orderBy(desc(gallery.createdAt)),
    db.select({ id: popups.id, name: popups.title, url: popups.imageUrl, createdAt: popups.createdAt }).from(popups).orderBy(desc(popups.createdAt)),
  ])
  const files = [
    ...postFiles.map((file) => ({ ...file, type: "게시글 첨부" as const, sourceHref: `/community/${file.postId}`, manageHref: null })),
    ...galleryFiles.map((file) => ({ ...file, size: null, contentType: "image/", source: "갤러리", type: "갤러리" as const, sourceHref: null, manageHref: "/admin/gallery" })),
    ...popupFiles.flatMap((file) => (file.url ? [{ ...file, url: file.url, size: null, contentType: "image/", source: "팝업", type: "팝업" as const, sourceHref: null, manageHref: "/admin/popups" }] : [])),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const needle = q.toLowerCase()
  const visible = files.filter((file) => (!type || file.type === type) && (!needle || `${file.name} ${file.source}`.toLowerCase().includes(needle)))
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const page = Math.min(totalPages, Math.max(1, Number(params.page) || 1))
  const rows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function hrefFor(p: number) {
    const next = new URLSearchParams()
    if (q) next.set("q", q)
    if (type) next.set("type", type)
    if (p > 1) next.set("page", String(p))
    const qs = next.toString()
    return qs ? `/admin/attachments?${qs}` : "/admin/attachments"
  }

  return (
    <>
      <div className="border-b border-border pb-6">
        <p className="text-sm font-semibold text-primary">FILE MANAGEMENT</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">첨부파일 관리</h1>
        <p className="mt-2 text-sm text-muted-foreground">게시글 첨부는 여기서 삭제할 수 있습니다. 갤러리와 팝업 이미지는 연결된 관리 화면에서 삭제합니다.</p>
      </div>

      <form className="mt-8 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="type">구분</label>
        <select id="type" name="type" defaultValue={type ?? ""} className={fieldClass}>
          <option value="">전체 구분</option>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
        <label className="sr-only" htmlFor="q">검색어</label>
        <input id="q" name="q" type="search" defaultValue={q} placeholder="파일명 또는 게시글 제목" className={`${fieldClass} flex-1`} />
        <Button type="submit" className="h-11 px-5">검색</Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {q || type ? `검색 결과 ${visible.length.toLocaleString("ko-KR")}개` : `총 ${visible.length.toLocaleString("ko-KR")}개`}
        {totalPages > 1 && ` · ${page} / ${totalPages} 페이지`}
      </p>

      <div className="mt-3 overflow-x-auto border border-border">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="w-20 p-3 text-left">미리보기</th>
              <th scope="col" className="p-3 text-left">파일</th>
              <th scope="col" className="p-3 text-left">연결 콘텐츠</th>
              <th scope="col" className="p-3 text-right">크기</th>
              <th scope="col" className="p-3 text-right">등록일</th>
              <th scope="col" className="p-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((file) => (
              <tr key={`${file.type}-${file.id}`} className="hover:bg-muted/40">
                <td className="p-3">
                  <a href={file.url} target="_blank" rel="noreferrer" aria-label={`${file.name} 새 창에서 열기`} className="flex size-14 items-center justify-center overflow-hidden border border-border bg-muted text-muted-foreground">
                    {file.contentType.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cloudflareLoader({ src: file.url, width: 160 })} alt="" loading="lazy" className="size-full object-cover" />
                    ) : file.contentType.startsWith("audio/") ? (
                      <Music aria-hidden className="size-5" />
                    ) : (
                      <FileText aria-hidden className="size-5" />
                    )}
                  </a>
                </td>
                <td className="max-w-80 p-3">
                  <a href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary hover:underline">
                    <span className="truncate" title={file.name}>{file.name}</span>
                    <ExternalLink aria-hidden className="size-3.5 shrink-0" />
                  </a>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{file.type}</span>
                </td>
                <td className="max-w-64 p-3">
                  {file.sourceHref ? (
                    <Link href={file.sourceHref} target="_blank" className="block truncate text-primary hover:underline" title={file.source}>{file.source}</Link>
                  ) : (
                    file.source
                  )}
                </td>
                <td className="p-3 text-right tabular-nums">{file.size == null ? "-" : `${Math.ceil(file.size / 1024).toLocaleString("ko-KR")} KB`}</td>
                <td className="p-3 text-right tabular-nums">{file.createdAt.toLocaleDateString("ko-KR")}</td>
                <td className="p-3 text-right">
                  {file.manageHref ? (
                    <Button render={<Link href={file.manageHref} />} nativeButton={false} size="sm" variant="outline">관리 화면</Button>
                  ) : (
                    <form action={deleteAttachment.bind(null, file.id)}>
                      <input type="hidden" name="returnTo" value={hrefFor(page)} />
                      <ConfirmDeleteButton confirmMessage={`'${file.name}' 파일을 삭제하시겠습니까?`} />
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="py-12 text-center text-muted-foreground">{q || type ? "조건에 맞는 파일이 없습니다." : "첨부파일이 없습니다."}</p>}
      </div>
      <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
    </>
  )
}
