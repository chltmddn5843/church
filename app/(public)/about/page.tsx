import Image from "next/image"
import type { Metadata } from "next"
import { church } from "@/lib/church"
import { PageBanner } from "@/components/page-banner"
import { SectionHeading } from "@/components/section-heading"
import { Cross, Heart, Users, BookOpen, MapPin, Phone, Printer } from "lucide-react"

export const metadata: Metadata = {
  title: "교회소개",
  description: `${church.name} 인사말, 비전, 섬기는 사람들과 오시는 길을 안내합니다.`,
}

const visions = [
  { icon: Cross, title: "예배", desc: "살아계신 하나님께 신령과 진정으로 드리는 예배 중심의 교회" },
  { icon: BookOpen, title: "말씀", desc: "하나님의 말씀 위에 굳게 세워지는 건강한 신앙 공동체" },
  { icon: Heart, title: "사랑", desc: "그리스도의 사랑으로 서로 섬기고 이웃을 돌아보는 교회" },
  { icon: Users, title: "선교", desc: "땅끝까지 복음을 전하며 다음세대를 세우는 교회" },
]

const staff = [
  { name: church.pastor, role: "담임목사", image: "/images/pastor.png" },
  { name: "김은혜", role: "부목사", image: "/images/gallery-1.png" },
  { name: "이믿음", role: "교육목사", image: "/images/next-generation.png" },
  { name: "박소망", role: "찬양사역자", image: "/images/gallery-4.png" },
]

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="교회소개"
        subtitle={`${church.denomination} · ${church.name}`}
        image="/images/church-exterior.png"
      />

      {/* 인사말 */}
      <section id="greeting" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg">
            <Image src="/images/pastor.png" alt={`${church.pastor} 담임목사`} fill className="object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="Greeting" title="담임목사 인사말" align="left" />
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                원당교회 홈페이지를 찾아주신 여러분을 주님의 이름으로 진심으로 환영합니다. 우리 교회는 하나님의
                말씀 위에 세워지는 건강한 교회를 지향합니다.
              </p>
              <p>
                예배를 통해 하나님께 영광을 돌리고, 말씀과 기도로 성숙한 제자를 세우며, 사랑으로 이웃과 지역
                사회를 섬기는 공동체가 되기를 소망합니다. 지치고 상한 영혼이 이곳에서 참된 안식과 회복을
                경험하시길 기도합니다.
              </p>
              <p>여러분의 가정과 삶에 하나님의 은혜와 평강이 늘 함께하시기를 축원합니다.</p>
            </div>
            <p className="mt-6 font-serif text-lg font-bold text-foreground">
              {church.pastorTitle} {church.pastor}
            </p>
          </div>
        </div>
      </section>

      {/* 비전 */}
      <section id="vision" className="scroll-mt-24 bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Vision" title="교회 비전" description="원당교회가 추구하는 네 가지 방향입니다." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visions.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <v.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-serif text-xl font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 섬기는 사람들 */}
      <section id="staff" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Staff" title="섬기는 사람들" description="원당교회를 섬기는 교역자를 소개합니다." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((p) => (
              <div key={p.name} className="text-center">
                <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full shadow-md">
                  <Image src={p.image || "/placeholder.svg"} alt={p.name} fill className="object-cover" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{p.name}</h3>
                <p className="text-sm text-primary">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 오시는 길 */}
      <section id="location" className="scroll-mt-24 bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Location" title="오시는 길" />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="원당교회 위치 지도"
                width="100%"
                height="100%"
                className="min-h-80 w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${church.map.lng - 0.008}%2C${church.map.lat - 0.005}%2C${church.map.lng + 0.008}%2C${church.map.lat + 0.005}&layer=mapnik&marker=${church.map.lat}%2C${church.map.lng}`}
              />
            </div>
            <div className="flex flex-col justify-center gap-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">주소</p>
                  <p className="text-muted-foreground">{church.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">전화</p>
                  <p className="text-muted-foreground">{church.tel}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Printer className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">팩스</p>
                  <p className="text-muted-foreground">{church.fax}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
