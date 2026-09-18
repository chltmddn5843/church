import type { Metadata } from "next"
import { getGallery, getGalleryCount } from "@/lib/queries"
import { PageBanner } from "@/components/page-banner"
import { GalleryGrid } from "@/components/gallery-grid"
import { Pagination } from "@/components/pagination"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSessionUser } from "@/lib/session"

const PAGE_SIZE = 24

export const metadata: Metadata = {
  title: "갤러리",
  description: "원당교회의 소중한 순간들을 사진으로 만나보세요.",
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const [items, total, user] = await Promise.all([
    getGallery(PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getGalleryCount(),
    getSessionUser(),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <>
      <PageBanner title="갤러리" subtitle="원당교회의 소중한 순간들" image="/images/gallery-1.jpg" />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          {user?.role === "admin" && <div className="mb-6 flex justify-end"><Button render={<Link href="/admin/gallery" />} nativeButton={false}>사진 등록</Button></div>}
          <GalleryGrid items={items} />
          <Pagination page={page} totalPages={totalPages} hrefFor={(p) => (p > 1 ? `/gallery?page=${p}` : "/gallery")} />
        </div>
      </section>
    </>
  )
}
