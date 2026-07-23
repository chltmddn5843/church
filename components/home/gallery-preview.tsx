import Image from "next/image"
import Link from "next/link"
import { getGallery } from "@/lib/queries"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"

export async function GalleryPreview() {
  const items = await getGallery(4)
  if (items.length === 0) return null

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Gallery" title="교회 앨범" description="원당교회의 소중한 순간들을 함께 나눕니다." />
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-sm font-medium text-primary-foreground">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button render={<Link href="/gallery" />} variant="outline">
            갤러리 더보기
          </Button>
        </div>
      </div>
    </section>
  )
}
