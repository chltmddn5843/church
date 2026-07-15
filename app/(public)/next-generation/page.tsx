import type { Metadata } from "next"
import Image from "next/image"
import { PageBanner } from "@/components/page-banner"
import { SectionHeading } from "@/components/section-heading"
import { Clock, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "다음세대",
  description: "영유아부터 청년까지, 믿음의 다음세대를 세우는 원당교회 교육부서를 소개합니다.",
}

const departments = [
  {
    id: "kids",
    name: "영유아·유치부",
    age: "만 0~7세",
    time: "주일 오전 11:00",
    place: "교육관 1층",
    desc: "하나님의 사랑을 처음 배우는 우리 아이들, 놀이와 찬양으로 신앙의 첫걸음을 뗍니다.",
    image: "/images/next-generation.png",
  },
  {
    id: "children",
    name: "아동부",
    age: "초등 1~6학년",
    time: "주일 오전 11:00",
    place: "교육관 2층",
    desc: "말씀과 활동으로 예수님을 인격적으로 만나고 믿음의 친구를 사귀는 시간입니다.",
    image: "/images/gallery-4.png",
  },
  {
    id: "youth",
    name: "청소년부",
    age: "중·고등학생",
    time: "주일 오후 02:00",
    place: "교육관 3층",
    desc: "치열한 삶의 현장에서 믿음을 지키는 청소년, 예배와 소그룹으로 함께 성장합니다.",
    image: "/images/gallery-1.png",
  },
  {
    id: "young-adult",
    name: "청년부",
    age: "20~30대 청년",
    time: "주일 오후 02:00",
    place: "비전홀",
    desc: "시대를 깨우는 청년, 예배와 공동체 안에서 하나님의 부르심을 발견합니다.",
    image: "/images/gallery-3.png",
  },
]

export default function NextGenerationPage() {
  return (
    <>
      <PageBanner
        title="다음세대"
        subtitle="믿음의 다음세대를 함께 세워갑니다"
        image="/images/next-generation.png"
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
                <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <Image src={d.image || "/placeholder.svg"} alt={d.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">{d.age}</p>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-foreground md:text-3xl">{d.name}</h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{d.desc}</p>
                  <div className="mt-6 flex flex-col gap-2 text-sm">
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
