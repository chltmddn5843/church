import { createGalleryItem, deleteGalleryItem } from "@/app/actions/gallery"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import { getGallery, getGalleryCount } from "@/lib/queries"

const categories = ["교회", "전체 수료자", "새가족반", "양육반", "제자반", "사역반"]
const PAGE_SIZE = 24

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const [items, total] = await Promise.all([
    getGallery(PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getGalleryCount(),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <>
      <h1 className="text-3xl font-bold">갤러리 관리</h1>
      <form action={createGalleryItem} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6">
        <input name="title" required placeholder="사진 제목" className="h-11 rounded-lg border px-3" />
        <select name="category" defaultValue="교회" className="h-11 rounded-lg border px-3">
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required className="h-11 rounded-lg border px-3 py-2" />
        <textarea name="description" rows={3} placeholder="설명" className="rounded-lg border p-3" />
        <Button type="submit" className="w-fit">사진 등록</Button>
      </form>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border bg-card p-4">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.category}</p>
              <p className="max-w-64 truncate text-sm text-muted-foreground">{item.imageUrl}</p>
            </div>
            <form action={deleteGalleryItem.bind(null, item.id)}>
              <Button type="submit" size="sm" variant="destructive">삭제</Button>
            </form>
          </div>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} hrefFor={(p) => (p > 1 ? `/admin/gallery?page=${p}` : "/admin/gallery")} />
    </>
  )
}
