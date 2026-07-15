import type { Metadata } from "next"
import { getGallery } from "@/lib/queries"
import { PageBanner } from "@/components/page-banner"
import { GalleryGrid } from "@/components/gallery-grid"

export const metadata: Metadata = {
  title: "갤러리",
  description: "원당교회의 소중한 순간들을 사진으로 만나보세요.",
}

export default async function GalleryPage() {
  const items = await getGallery()

  return (
    <>
      <PageBanner title="갤러리" subtitle="원당교회의 소중한 순간들" image="/images/gallery-1.png" />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <GalleryGrid items={items} />
        </div>
      </section>
    </>
  )
}
