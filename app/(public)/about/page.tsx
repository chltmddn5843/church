import Image from "next/image"
import type { Metadata } from "next"
import { church } from "@/lib/church"
import { PageBanner } from "@/components/page-banner"
import { SectionHeading } from "@/components/section-heading"
import { MessageCards } from "@/components/message-cards"
import { MapPin, Phone, Printer, ChevronDown } from "lucide-react"
import { asc } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { historyEvents } from "@/lib/db/schema"
import { groupHistory } from "@/lib/history"

export const metadata: Metadata = {
  title: "교회소개",
  description: `${church.name} 인사말, 비전, 섬기는 사람들과 오시는 길을 안내합니다.`,
}

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

// 지도 좌표: 핀(lon, lat), 설명 박스 중심(lx, ly). 지도는 경도 -180~180, 위도 75~-50 정방형 투영.
const missionFields = [
  { region: "인도", lon: 73.9, lat: 18.5, lx: 45, ly: 46, people: [{ name: "김진곤 · 김미경", field: "중인도 마하라스트라주 뿌네지역" }] },
  { region: "브라질", lon: -46.6, lat: -23.1, lx: -98, ly: -22, people: [{ name: "차용조 · 안기영", field: "브라질 아찌바이아" }] },
  { region: "마다가스카르", lon: 47.5, lat: -18.9, lx: 12, ly: -38, people: [{ name: "정남현 · 이은경", field: "아프리카 마다가스카르" }] },
  { region: "태국", lon: 99, lat: 18.8, lx: 82, ly: -24, people: [{ name: "강성춘 · 박성화", field: "태국 쁘라뚜 치앙마이" }] },
  { region: "캄보디아", lon: 104.9, lat: 11.6, lx: 150, ly: -8, people: [{ name: "김정현 · 이효은", field: "기아대책 캄보디아" }] },
  {
    region: "일본",
    lon: 139.7,
    lat: 35.7,
    lx: 150,
    ly: 57,
    people: [
      { name: "안중식 · 손인자", field: "일본" },
      { name: "이윤주 · 강성현", field: "GP선교회 · 일본" },
    ],
  },
]
const HOME = { lon: 126.8, lat: 37.6 }
const mapX = (lon: number) => lon + 180
const mapY = (lat: number) => 75 - lat
const mapPos = (lon: number, lat: number) => ({ left: `${(mapX(lon) / 360) * 100}%`, top: `${(mapY(lat) / 125) * 100}%` })

const elders = [
  { name: "정경위", role: "장로", image: "/images/staff/jeong-gyeongwi.jpg" },
  { name: "권태식", role: "장로", image: "/images/staff/gwon-taesik.jpg" },
  { name: "허수행", role: "장로", image: "/images/staff/heo-suhaeng.jpg" },
]

export default async function AboutPage() {
  const historyGroups = groupHistory(
    await getDb().select().from(historyEvents).orderBy(asc(historyEvents.date), asc(historyEvents.id)),
  )

  return (
    <>
      <PageBanner
        title="교회소개"
        subtitle={`${church.denomination} · ${church.name}`}
        image="/images/wd-main.jpg"
        focus="center 80%"
      />

      {/* 인사말 */}
      <section id="greeting" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center lg:max-w-[1360px] lg:px-6">
          <div className="relative aspect-[4/5] overflow-hidden shadow-lg">
            <Image src="/images/wd-pastor.jpg" alt={`${church.pastor} 담임목사`} fill className="object-cover object-top" />
          </div>
          <div>
            <SectionHeading eyebrow="Greeting" title="담임목사 인사말" />
            <div className="mt-6 space-y-6 leading-relaxed text-muted-foreground">
              <div className="space-y-2">
                <p>안녕하세요.<br />원당교회 홈페이지를 방문해 주셔서 감사합니다.</p>
                <p>인생의 방황은 예수님을 만나면 끝이 나고 신앙의 방황은 좋은 교회를 만나면 끝이 납니다.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-semibold text-primary">원당교회는 제자 되고 제자 삼는 교회입니다.</h3>
                <p>제자는 예수님의 인격을 닮아야 하고 예수님께서 하신 사역을 감당해야 합니다. 그러기 위해 우리는 끊임없이 배우고 훈련하는 일에 게을리하지 않고, 배우면서 다른 사람을 내 어깨 위에 세우도록 힘쓰고 있습니다.</p>
                <p>바라기는 원당교회를 통해 우리 모두가 예수님의 작은 제자가 되어 하나님께 영광을 돌리며, 가정에서부터 인정받고 주변 이웃들에게 좋은 이웃이 되어 주며 대한민국의 좋은 국민이라는 소리를 듣기를 기도하고 소망합니다.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-semibold text-primary">원당교회는 시대적 사명으로 예배의 회복에 힘쓰고 있습니다.</h3>
                <p>하나님의 영광의 임재가 충만한 예배를 통해 하나님과의 관계가 회복되고 영과 육이 치유되며, 우리 삶의 목적과 방향을 확인하고 힘을 얻어 삶의 예배자로 살아가고자 힘쓰고 있습니다.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-semibold text-primary">원당교회의 또 다른 시대적 사명으로 다음 세대를 세우는 일에 힘쓰고 있습니다.</h3>
                <p>원당교회는 젊은 교회로서 앞으로가 더 소망이 있는 교회입니다. 하나님께서 다음 세대 자녀들을 많이 보내주셔서 주일학교 신앙교육에 우선적으로 힘쓰고 있습니다. 어려서부터 말씀 암송과 제자훈련을 통한 체계적인 교육과정을 만들어 하나님 나라와 열방과 민족을 이끌어 갈 리더로 세우기 위해 최선을 다하고 있습니다.</p>
              </div>
              <p>바라고 기도하기는 원당교회를 통해 예수님을 만나고 제자로 훈련되어, 원당교회의 비전과 사명과 역할에 함께 동역하는 기쁨과 행복을 누리시기를 바랍니다.</p>
            </div>
            <p className="mt-6 font-serif text-lg font-semibold text-foreground">
              {church.pastorTitle} {church.pastor}
            </p>
          </div>
        </div>
      </section>

      <MessageCards />

      <section id="elders" className="scroll-mt-24 bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <SectionHeading eyebrow="Elders" title="장로" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {elders.map((p) => (
              <div key={p.name} className="text-center">
                <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full shadow-md">
                  <Image src={p.image} alt={p.name} fill className="object-cover object-top" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{p.name}</h3>
                <p className="text-sm text-primary">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="history" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4">
          <SectionHeading eyebrow="History" title="교회발자취" description="1963년 시작된 원당교회가 지나온 발자취입니다." />
          <div className="mt-10 space-y-3">
            {historyGroups.map((group, i) => (
              <details
                key={group.label}
                open={i === historyGroups.length - 1}
                className="group overflow-hidden border border-border bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
                  <span className="font-serif text-lg font-semibold text-foreground">{group.label}</span>
                  <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground">
                    {group.items.length}건
                    <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <ol className="space-y-4 border-t border-border px-6 py-6">
                  {group.items.map((item) => (
                    <li key={item.id} className="flex flex-wrap gap-x-4 gap-y-1 text-sm leading-relaxed sm:flex-nowrap">
                      <span className="w-28 shrink-0 font-semibold tabular-nums text-primary">{item.date}</span>
                      <span className="text-muted-foreground">{item.event}</span>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="scroll-mt-24 bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <SectionHeading eyebrow="Mission" title="선교" description="원당교회가 파송하고 후원하는 해외 선교사님을 소개합니다." />
          <h3 className="mt-10 font-serif text-xl font-semibold text-foreground md:text-2xl">후원하는 해외 선교사님</h3>
          <div className="mt-8 border border-border bg-card p-3 shadow-sm sm:p-6">
            <div className="relative aspect-[360/125]">
              <Image src="/images/world-dots.svg" alt="" fill unoptimized className="select-none" />
              <svg viewBox="0 0 360 125" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full lg:block" aria-hidden="true">
                {missionFields.map((f) => (
                  <line key={f.region} x1={mapX(f.lon)} y1={mapY(f.lat)} x2={mapX(f.lx)} y2={mapY(f.ly)} className="stroke-primary/40" strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
              <span aria-hidden="true" className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-light ring-2 ring-white" style={mapPos(HOME.lon, HOME.lat)} />
              {missionFields.map((f, i) => (
                <span key={f.region} aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2" style={mapPos(f.lon, f.lat)}>
                  <span className="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping" />
                  <span className="relative flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-white sm:size-6">
                    {i + 1}
                  </span>
                </span>
              ))}
              {missionFields.map((f, i) => (
                <div
                  key={f.region}
                  className="absolute hidden w-48 -translate-x-1/2 -translate-y-1/2 border border-border bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm lg:block xl:w-52"
                  style={mapPos(f.lx, f.ly)}
                >
                  <p className="flex items-center gap-1.5 text-sm font-bold text-primary">
                    <MapPin className="size-3.5" />
                    {i + 1}. {f.region}
                  </p>
                  {f.people.map((p) => (
                    <div key={p.name} className="mt-1">
                      <p className="text-sm font-semibold leading-tight text-foreground">{p.name} 선교사</p>
                      <p className="text-sm leading-snug text-muted-foreground">{p.field}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
              <span className="size-3 rounded-full bg-brand-light" /> 원당교회
            </p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:hidden">
              {missionFields.map((f, i) => (
                <li key={f.region} className="flex gap-3 border border-border p-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-primary">{f.region}</p>
                    {f.people.map((p) => (
                      <p key={p.name} className="mt-0.5 text-sm">
                        <span className="font-semibold text-foreground">{p.name} 선교사</span>
                        <span className="block text-sm text-muted-foreground">{p.field}</span>
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 섬기는 사람들 */}
      <section id="staff" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <SectionHeading eyebrow="Staff" title="섬기는 사람들" description="원당교회를 섬기는 교역자를 소개합니다." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((p) => (
              <div key={p.name} className="text-center">
                <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full shadow-md">
                  <Image src={p.image || "/placeholder.svg"} alt={p.name} fill className="object-cover" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{p.name}</h3>
                <p className="text-sm text-primary">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 오시는 길 */}
      <section id="location" className="scroll-mt-24 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <SectionHeading eyebrow="Location" title="오시는 길" />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden border border-border shadow-sm">
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
            <div className="flex flex-col justify-center gap-7">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <p className="text-lg font-semibold text-foreground">주소</p>
                  <p className="mt-1 text-lg text-muted-foreground">{church.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <p className="text-lg font-semibold text-foreground">전화</p>
                  <p className="mt-1 text-lg text-muted-foreground">{church.tel}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Printer className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <p className="text-lg font-semibold text-foreground">팩스</p>
                  <p className="mt-1 text-lg text-muted-foreground">{church.fax}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
