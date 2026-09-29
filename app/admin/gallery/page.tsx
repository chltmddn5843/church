import { ExternalLink } from "lucide-react"
import { createGalleryItem, deleteGalleryItem } from "@/app/actions/gallery"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { SubmitButton } from "@/components/admin/submit-button"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import { getGallery, getGalleryCount } from "@/lib/queries"

const categories = ["교회", "전체 수료자", "새가족반", "양육반", "제자반", "사역반"]
const PAGE_SIZE = 24
const fieldClass = "h-11 rounded-md border border-border bg-white px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { page: pageParam, category: categoryParam } = await searchParams
  const category = categories.find((c) => c === categoryParam)
  const total = await getGalleryCount(category)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(totalPages, Math.max(1, Number(pageParam) || 1))
  const items = await getGallery(PAGE_SIZE, (page - 1) * PAGE_SIZE, category)

  function hrefFor(p: number) {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (p > 1) params.set("page", String(p))
    const qs = params.toString()
    return qs ? `/admin/gallery?${qs}` : "/admin/gallery"
  }

  return (
    <>
      <div className="border-b border-border pb-6">
        <p className="text-sm font-semibold text-primary">GALLERY</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">갤러리 관리</h1>
        <p className="mt-2 text-sm text-muted-foreground">사진을 등록하고, 분류별로 확인하며 정리합니다.</p>
      </div>

      <form action={createGalleryItem} className="mt-8 grid gap-4 border border-border bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          사진 제목
          <input name="title" required className={fieldClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          분류
          <select name="category" defaultValue={category ?? "교회"} className={fieldClass}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium md:col-span-2">
          이미지 <span className="font-normal text-muted-foreground">JPG, PNG, WEBP, GIF</span>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required className="border border-border p-3" />
        </label>
        <label className="grid gap-2 text-sm font-medium md:col-span-2">
          설명 <span className="font-normal text-muted-foreground">선택</span>
          <textarea name="description" rows={3} className="border border-border p-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40" />
        </label>
        <SubmitButton className="h-10 w-fit px-4" pendingLabel="업로드 중...">사진 등록</SubmitButton>
      </form>

      <section className="mt-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">등록된 사진</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {category ? `${category} ` : "전체 "}{total.toLocaleString("ko-KR")}장
              {totalPages > 1 && ` · ${page} / ${totalPages} 페이지`}
            </p>
          </div>
          <form className="flex gap-2">
            <label className="sr-only" htmlFor="gallery-category">분류 선택</label>
            <select id="gallery-category" name="category" defaultValue={category ?? ""} className={fieldClass}>
              <option value="">전체 분류</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <Button type="submit" variant="outline" className="h-11 px-4">보기</Button>
          </form>
        </div>

        {items.length === 0 ? (
          <p className="border border-border py-16 text-center text-muted-foreground">등록된 사진이 없습니다.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col border border-border bg-white shadow-sm">
                <a href={item.imageUrl} target="_blank" rel="noreferrer" aria-label={`${item.title} 원본 보기`} className="group relative block aspect-[4/3] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt="" loading="lazy" className="size-full object-cover transition group-hover:opacity-90" />
                  <ExternalLink aria-hidden className="absolute right-2 top-2 size-7 bg-black/50 p-1.5 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" />
                </a>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <p className="line-clamp-2 font-semibold leading-snug" title={item.title}>{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.category} · {item.createdAt.toLocaleDateString("ko-KR")}</p>
                  {item.description && <p className="line-clamp-2 text-xs text-muted-foreground" title={item.description}>{item.description}</p>}
                  <form action={deleteGalleryItem.bind(null, item.id)} className="mt-auto flex justify-end pt-2">
                    <input type="hidden" name="returnTo" value={hrefFor(page)} />
                    <ConfirmDeleteButton confirmMessage={`'${item.title}' 사진을 삭제하시겠습니까?`} />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
      </section>
    </>
  )
}
