import type { Metadata } from "next"
import Image from "next/image"
import { PageBanner } from "@/components/page-banner"
import { SectionHeading } from "@/components/section-heading"
import { Clock, MapPin } from "lucide-react"
import { departments } from "@/lib/church"

export const metadata: Metadata = {
  title: "다음세대",
  description: "영유아부터 청년까지, 믿음의 다음세대를 세우는 원당교회 교육부서를 소개합니다.",
}

export default function NextGenerationPage() {
  return (
    <>
      <PageBanner
        title="다음세대"
        subtitle="믿음의 다음세대를 함께 세워갑니다"
        image="/images/next-generation.jpg"
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Next Generation"
            title="교육부서 안내"
            description="연령별 맞춤 신앙 교육으로 자라나는 다음세대"
          />
          <div className="mt-12 space-y-16">
            {departments.map((d, i) => (
              <div
                key={d.id}
                id={d.id}
                className="grid scroll-mt-24 items-center gap-8 md:grid-cols-2"
              >
                <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary shadow-lg ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <Image src={d.image} alt={d.name} fill className={d.contain ? "object-contain" : "object-cover"} />
                </div>
                <div>
                  <p className="text-base font-semibold uppercase tracking-widest text-primary md:text-lg">{d.age}</p>
                  <h3 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">{d.name}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{d.desc}</p>
                  <div className="mt-6 flex flex-col gap-2 text-base md:text-lg">
                    <span className="flex items-center gap-2 text-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {d.time}
                    </span>
                    <span className="flex items-center gap-2 text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {d.place}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
