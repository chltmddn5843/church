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
  { name: church.pastor, role: "담임목사", image: "/images/wd-pastor.jpg" },
  { name: "나정주", role: "부목사", image: "/images/staff/na-jeongju.png" },
  { name: "신요섭", role: "부목사", image: "/images/staff/shin-yoseop.png" },
  { name: "허철", role: "부목사", image: "/images/staff/heo-cheol.jpg" },
  { name: "오보배", role: "전도사", image: "/images/staff/oh-bobae.jpg" },
  { name: "고강건", role: "전도사", image: "/images/staff/go-ganggeon.png" },
  { name: "이경은", role: "전도사", image: "/images/staff/lee-gyeongeun.jpg" },
  { name: "조은경", role: "교육간사", image: "/images/staff/jo-eungyeong.jpg" },
  { name: "김미경", role: "목회행정간사", image: "/images/staff/kim-migyeong.jpg" },
]

const elders = [
  { name: "정경위", role: "장로", image: "/images/staff/jeong-gyeongwi.jpg" },
  { name: "권태식", role: "장로", image: "/images/staff/gwon-taesik.jpg" },
  { name: "허수행", role: "장로", image: "/images/staff/heo-suhaeng.jpg" },
]

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="교회소개"
        subtitle={`${church.denomination} · ${church.name}`}
      />

      {/* 인사말 */}
      <section id="greeting" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg">
            <Image src="/images/wd-pastor.jpg" alt={`${church.pastor} 담임목사`} fill className="object-cover object-top" />
          </div>
          <div>
            <SectionHeading eyebrow="Greeting" title="담임목사 인사말" align="left" />
            <div className="mt-6 space-y-6 leading-relaxed text-muted-foreground">
              <div className="space-y-2">
                <p>안녕하세요.<br />원당교회 홈페이지를 방문해 주셔서 감사합니다.</p>
                <p>인생의 방황은 예수님을 만나면 끝이 나고 신앙의 방황은 좋은 교회를 만나면 끝이 납니다.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-primary">원당교회는 제자 되고 제자 삼는 교회입니다.</h3>
                <p>제자는 예수님의 인격을 닮아야 하고 예수님께서 하신 사역을 감당해야 합니다. 그러기 위해 우리는 끊임없이 배우고 훈련하는 일에 게을리하지 않고, 배우면서 다른 사람을 내 어깨 위에 세우도록 힘쓰고 있습니다.</p>
                <p>바라기는 원당교회를 통해 우리 모두가 예수님의 작은 제자가 되어 하나님께 영광을 돌리며, 가정에서부터 인정받고 주변 이웃들에게 좋은 이웃이 되어 주며 대한민국의 좋은 국민이라는 소리를 듣기를 기도하고 소망합니다.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-primary">원당교회는 시대적 사명으로 예배의 회복에 힘쓰고 있습니다.</h3>
                <p>하나님의 영광의 임재가 충만한 예배를 통해 하나님과의 관계가 회복되고 영과 육이 치유되며, 우리 삶의 목적과 방향을 확인하고 힘을 얻어 삶의 예배자로 살아가고자 힘쓰고 있습니다.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-primary">원당교회의 또 다른 시대적 사명으로 다음 세대를 세우는 일에 힘쓰고 있습니다.</h3>
                <p>원당교회는 젊은 교회로서 앞으로가 더 소망이 있는 교회입니다. 하나님께서 다음 세대 자녀들을 많이 보내주셔서 주일학교 신앙교육에 우선적으로 힘쓰고 있습니다. 어려서부터 말씀 암송과 제자훈련을 통한 체계적인 교육과정을 만들어 하나님 나라와 열방과 민족을 이끌어 갈 리더로 세우기 위해 최선을 다하고 있습니다.</p>
              </div>
              <p>바라고 기도하기는 원당교회를 통해 예수님을 만나고 제자로 훈련되어, 원당교회의 비전과 사명과 역할에 함께 동역하는 기쁨과 행복을 누리시기를 바랍니다.</p>
            </div>
            <p className="mt-6 font-serif text-lg font-bold text-foreground">
              {church.pastorTitle} {church.pastor}
            </p>
          </div>
        </div>
      </section>

      {/* 비전 */}
      <section id="vision" className="relative scroll-mt-24 overflow-hidden bg-secondary py-16 md:py-24">
        <Image src="/images/wd-vision.png" alt="원당교회 비전" fill className="object-cover opacity-10" />
        <div className="relative mx-auto max-w-6xl px-4">
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
          <h3 className="mt-16 text-center font-serif text-2xl font-bold">장로</h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {elders.map((p) => (
              <div key={p.name} className="text-center">
                <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full shadow-md">
                  <Image src={p.image} alt={p.name} fill className="object-cover object-top" />
                </div>
                <h4 className="mt-4 font-serif text-lg font-bold text-foreground">{p.name}</h4>
                <p className="text-sm text-primary">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="history" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <SectionHeading eyebrow="History" title="교회발자취" description="1963년 시작된 원당교회의 주요 발자취입니다." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {["1963년 원당 지역에서 예배 시작", "1964년 첫 예배당 입당", "2008년 성전 준공 및 입당", "2015년 양승철 담임목사 위임", "2023년 비전센터 믿음관·소망관 봉헌", "2024년 비전센터 사랑관 봉헌"].map(item => <p key={item} className="rounded-xl border bg-card p-5 text-muted-foreground">{item}</p>)}
          </div>
        </div>
      </section>

      <section id="mission" className="scroll-mt-24 bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <SectionHeading eyebrow="Mission" title="선교" description="해외선교와 미자립교회·농어촌교회, 지역사회를 함께 섬깁니다." />
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
