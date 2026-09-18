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
    id: "toddler",
    name: "유아부",
    age: "2~4세(12개월 이상)와 부모",
    time: "주일 오전 10:10~10:50",
    place: "소망관 1층 사무엘홀",
    desc: "부모님과 함께 찬양하고 예배하며, 하나님과 말씀을 중심으로 예수님의 작은 제자로 자라가는 공동체입니다.",
    image: "/images/next-generation/toddler.jpg",
  },
  {
    id: "kindergarten",
    name: "유치부",
    age: "5~7세",
    time: "주일 오전 11:00",
    place: "소망관 2층 다윗홀",
    desc: "즐겁게 찬양하고 기도하며 말씀을 배우고, 바른 예배 습관과 말씀 묵상으로 세상의 빛과 소금이 되는 예수님의 꼬마 제자를 세웁니다.",
    image: "/images/next-generation/kindergarten.jpg",
  },
  {
    id: "elementary",
    name: "초등부",
    age: "초등학교 4~6학년",
    time: "주일 오전 10:55~12:20",
    place: "사랑관 2층 드림홀",
    desc: "즐겁게 찬양하고 기도로 깊어지며 말씀과 성경적 세계관으로 성장하는, 제자 되고 제자 삼는 공동체입니다.",
    image: "/images/next-generation/elementary.png",
  },
  {
    id: "middle",
    name: "중등부",
    age: "중학교 1~3학년(14~16세)",
    time: "주일 오전 11:00~12:20",
    place: "사랑관 3층 디모데홀",
    desc: "바른 말씀으로 건강한 자아와 하나님의 가치관을 세우고, 세상이 감당하지 못하는 믿음의 사람으로 훈련받습니다.",
    image: "/images/next-generation/middle.jpg",
    contain: true,
  },
  {
    id: "high",
    name: "고등부",
    age: "고등학교 1~3학년(17~19세)",
    time: "주일 오전 11:00~12:20",
    place: "소망관 2층 다니엘홀",
    desc: "말씀과 기도로 건강한 자기 이해와 하나님의 가치관을 세워, 하나님을 기쁘시게 하는 믿음의 사람으로 성장합니다.",
    image: "/images/next-generation/high.jpg",
  },
  {
    id: "young-adult",
    name: "청년부",
    age: "20~35세",
    time: "주일 오후 2:00~3:30",
    place: "사랑관 3층 디모데홀",
    desc: "한 성령 안에서 예배하며 예수 생명으로 회복되고, 믿음과 사랑으로 서로를 세워 세상을 변화시키는 예수님의 제자 공동체입니다.",
    image: "/images/next-generation/young-adult.jpg",
  },
  {
    id: "english",
    name: "영어예배부",
    age: "초등학교 1~6학년",
    time: "주일 오전 9:00~10:10",
    place: "사랑관 2층 드림홀",
    desc: "영어 학습보다 예배의 본질에 집중하며, 영어 찬양과 말씀을 도구로 하나님께 즐겁게 나아가고 하나님을 경험하도록 돕습니다.",
    image: "/images/next-generation/english.jpg",
    contain: true,
  },
  {
    id: "awana",
    name: "어와나(AWANA)",
    age: "7세~고등학생",
    time: "주일 오후 2:00 · YM 토요일 오전 10:00",
    place: "사랑관 2층 드림홀 · 1층 만나홀",
    desc: "복음과 성경 암송, 재미있는 활동을 통해 어린이와 청소년이 예수 그리스도를 알고 사랑하고 섬기도록 훈련합니다. 참여 전 입단 과정이 필요합니다.",
    image: "/images/next-generation/awana.jpg",
    contain: true,
  },
]

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
