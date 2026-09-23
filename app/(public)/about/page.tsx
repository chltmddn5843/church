import Image from "next/image"
import type { Metadata } from "next"
import { church } from "@/lib/church"
import { PageBanner } from "@/components/page-banner"
import { SectionHeading } from "@/components/section-heading"
import { Cross, Heart, Users, BookOpen, MapPin, Phone, Printer, ChevronDown } from "lucide-react"

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

type HistoryEvent = { date: string; event: string }
type HistoryGroup = { label: string; items: HistoryEvent[] }
const historyGroups: HistoryGroup[] = [
  {
    label: "1963~1970년",
    items: [
      { date: "1963. 06. 16", event: "조인택 전도사님이 이원희씨 사랑방에서 김선흠 집사를 중심으로 10여명이 모여 예배드리기 시작." },
      { date: "1963. 07. 28", event: "김포읍교회 11구역이였던 원당지역을 원당교회로 하는 환송 예배를 드림." },
      { date: "1963. 08. 03", event: "김선흠 집사 소유 산 51-1번지에 서울청암교회 지원 받아 예배당 20평 착공." },
      { date: "1964. 06. 16", event: "예배당 준공하고 21일 입당 예배 드림." },
      { date: "1966. 09. 15", event: "조인택 목사 사임." },
      { date: "1966. 10. 22", event: "이종수 전도사 부임." },
      { date: "1968. 11. 25", event: "사택 10평(흙블록 스래트) 준공." },
      { date: "1970. 01.", event: "이종수 전도사 사임." },
      { date: "1970. 03.", event: "이기양 전도사 부임." },
    ],
  },
  {
    label: "1971~1980년",
    items: [
      { date: "1971. 03. 29", event: "이기양 전도사 사임." },
      { date: "1971. 07. 30", event: "김해용 전도사 부임." },
      { date: "1975. 01. 30", event: "김해용 전도사 사임." },
      { date: "1975. 04. 06", event: "김보하 강도사 부임." },
      { date: "1977. 01. 05", event: "김보하 목사 사임." },
      { date: "1977. 01. 16", event: "임영석 전도사 부임." },
      { date: "1978. 06. 16", event: "임영석 목사 사임." },
      { date: "1978. 08. 10", event: "정연한 전도사 부임." },
    ],
  },
  {
    label: "1981~1990년",
    items: [
      { date: "1982. 01.", event: "교회 자립과 협력 선교 시작 : 애굽의 김신숙 선교사, 필리핀의 박기호 선교사, 신안교회." },
      { date: "1982. 10. 12", event: "정연한 목사로 장립되고, 임시당회장 되다." },
      { date: "1985. 06. 28", event: "김선흠 집사가 현 예배당 부지 311평을 교회명의로 이전 등기함." },
      { date: "1986. 04. 15", event: "김선흠 초대 장로로 장립 받다." },
      { date: "1988. 08. 30", event: "김선흠 장로 소유 산 1308평 재분할하여 산 51-2번지를 원당교회 소유로 등록 전환 함." },
      { date: "1989. 06. 16", event: "정연한 목사 위임식과 초대 집사 장립(장용희, 오순복)과, 초대 권사 취임(권순례, 오의순, 서지순)." },
    ],
  },
  {
    label: "1991~2000년",
    items: [
      { date: "1993. 06. 16", event: "2대 집사 장립(박석원, 이순일)과, 2대 권사 취임(지복례, 최월순)." },
      { date: "1994. 05. 22", event: "김선흠 장로 사임 하다." },
      { date: "1995. 06. 17", event: "장용희, 이순일 2대 장로로, 허수행, 장현상 3대 집사로 장립되다." },
      { date: "1995. 11", event: "장구산 원당동 61-8번지 1450평을 교회당 부지로 매입하다." },
      { date: "1997. 05", event: "연건평 1500평 건축 허가 받음." },
      { date: "1997. 10", event: "이충현 전도사 부임." },
      { date: "1998. 02", event: "착공신고하고, 벌목과 절개 작업 수행." },
      { date: "1998. 03", event: "장용희씨가 장로직을 사임." },
      { date: "1999. 05. 29", event: "오순복, 박석원 3대 장로로 장립되고, 한덕숙 3대 권사로 취임되다. 장종구, 임용우 4대 집사로 장립되다." },
    ],
  },
  {
    label: "2001~2010년",
    items: [
      { date: "2003. 04", event: "정연한 목사 남서울노회 노회장이 되심." },
      { date: "2004. 06. 19", event: "장현덕, 권태식, 이창근 5대 집사로 장립되고,  박일화, 이선심, 박태순, 정양애, 박영숙 4대 권사로 취임되다." },
      { date: "2005. 11", event: "장구산에 교회당 연건평 1500평 건축 위해 재설계 신청하다." },
      { date: "2006. 07. 17", event: "장구산에 교회당 건축 착공 예배를 드리다." },
      { date: "2006. 09", event: "장구산 61-8번지가 436-3번지로 지적변경." },
      { date: "2008. 06. 14", event: "성전준공 및 입당예배를 드리다." },
      { date: "2007. 09", event: "이희숙 전도사 부임." },
      { date: "2008. 08. 05", event: "이충현 부목사 사임" },
      { date: "2008. 08. 10", event: "신학수 부목사 부임." },
      { date: "2009. 12", event: "이희숙 전도사 사임." },
      { date: "2010. 01", event: "서경수 전도사 부임." },
      { date: "2010. 06. 19", event: "이창근, 박상근, 정경위, 권태식 4대 장로로 장립되고, 김수호, 최수복, 박창식, 임갑수, 이경춘, 김일환, 한현동, 이광근, 이희원 6대 집사로 장립되고, 황미자, 신정순, 김옥녀, 김영순, 이정순, 이은경, 김현춘, 구오남 5대 권사로 취임되다." },
      { date: "2010. 11. 21", event: "인도 아바디 미라클교회당 헌당 예배 드림.(30평)" },
    ],
  },
  {
    label: "2011~2020년",
    items: [
      { date: "2012. 11. 25", event: "신학수 부목사 사임." },
      { date: "2015. 02. 08", event: "원당대로820번1길 5번지로 교회를 이전하다." },
      { date: "2015. 03. 22", event: "양승철 목사 담임목사 부임." },
      { date: "2015. 04. 25", event: "정연한 목사 은퇴 및 양승철 목사 위임." },
      { date: "2015. 08. 07", event: "수요예배 대신 금요예배 드림." },
      { date: "2015. 11. 08", event: "서경수 전도사 사임." },
      { date: "2015. 11. 08", event: "김수한 전도사 중등부 고등부 부임." },
      { date: "2015. 12. 06", event: "황성훈 전도사 청년부, 박미나 전도사 유년부 초등부 부임." },
      { date: "2016. 05. 13", event: "3대가 함께하는 월삭금요예배 시작." },
      { date: "2016. 12. 11", event: "황성훈 전도사 사임." },
      { date: "2016. 12. 11", event: "조영욱 전도사 중등부 고등부 부임." },
      { date: "2017. 10. 08", event: "이수기 부목사 행정. 교구 부임." },
      { date: "2017. 11. 12", event: "진미소 전도사 유아부 유치부 부임." },
      { date: "2017. 11. 26", event: "박미나 전도사 유년부 초등부 사임." },
      { date: "2017. 12. 03", event: "송명학 전도사 유년부 초등부 부임." },
      { date: "2018. 06. 24", event: "송명학 전도사 유년부 초등부 사임." },
      { date: "2018. 07. 01", event: "고예선 전도사 유년부 초등부 부임." },
      { date: "2018. 11. 25", event: "진미소 전도사 유아부 유치부 사임." },
      { date: "2018. 11. 25", event: "조영욱 전도사 중등부 고등부 사임." },
      { date: "2018. 11. 25", event: "김수한 전도사 청년부 사임." },
      { date: "2018. 12. 02", event: "박이슬 전도사 유아부 유치부 부임." },
      { date: "2018. 12. 02", event: "정현기 전도사 교육전임 청년부 부임." },
      { date: "2018. 12. 30", event: "이창은 전도사 중등부 고등부 부임." },
      { date: "2019. 11. 24", event: "노정흠 전도사 초등부 부임." },
      { date: "2020. 02. 16", event: "이창은 전도사 중고등부 사임." },
      { date: "2020. 05. 03", event: "김철우 전도사 청소년부 부임." },
      { date: "2020. 05. 17", event: "김철우 전도사 청소년부 사임." },
      { date: "2020. 09. 06", event: "김이삭 전도사 청소년부 부임." },
      { date: "2020. 11. 29", event: "고예선 전도사 유년부 사임." },
      { date: "2020. 11. 29", event: "박이슬 전도사 유아부 유치부 사임." },
      { date: "2020. 11. 29", event: "김이삭 전도사 청소년부 사임." },
      { date: "2020. 12. 06", event: "김성진 전도사 청소년부 부임." },
      { date: "2020. 12. 27", event: "김바울 전도사 유년부 부임." },
    ],
  },
  {
    label: "2021년~",
    items: [
      { date: "2021. 08. 15", event: "김연주 전도사 유아부 유치부 부임." },
      { date: "2021. 11. 14", event: "김연주 전도사 유아부 유치부 사임." },
      { date: "2021. 11. 28", event: "이수기 부목사 사임." },
      { date: "2021. 12. 05", event: "노정흠 전도사 전임 전도사 부임." },
      { date: "2021. 12. 05", event: "최종렬 전도사 유년부 부임." },
      { date: "2021. 12. 12", event: "김혜연 전도사 유아부 유치부 부임." },
      { date: "2022. 03. 08", event: "양승철 담임목사 한달간 안식월을 갖다.(3/8~4/8)" },
      { date: "2022. 05. 23", event: "아라동 종교부지 5번(원당동1088번지), 1,033평을 교회당 부지로 분양받다." },
      { date: "2022. 06. 11", event: "허수행 장로로 장립되고, 고성도, 이택근, 한용남, 최길림 안수집사로 장립되고, 서애경, 신건숙, 신건옥, 신정옥, 엄애자, 이미숙, 이애경, 한남숙 권사로 취임되다." },
      { date: "2022. 12. 25", event: "김바울 전도사 청소년부 사임." },
      { date: "2023. 01. 01", event: "신요섭 목사 청소년부 부임." },
      { date: "2023. 03. 18", event: "비전센터 기공 감사예배 드림." },
      { date: "2023. 08. 27", event: "비전센터 이음1로 320 믿음관 소망관 준공하고 봉헌." },
      { date: "2023. 10. 15", event: "정현기 부목사 사임." },
      { date: "2023. 11. 05", event: "박이찬 전도사 초등부 부임." },
      { date: "2023. 11. 05", event: "신요섭 부목사 전임 목사 부임." },
      { date: "2023. 11. 26", event: "김혜연 전도사 유아부 유치부 사임." },
      { date: "2023. 11. 26", event: "최종렬 전도사 유년부 사임." },
      { date: "2023. 12. 03", event: "오보배 전도사 유년부 부임." },
      { date: "2023. 12. 03", event: "조은경 사모를 유아부 교육간사로 임명." },
      { date: "2023. 12. 03", event: "이경은 집사를 유치부 교육간사로 임명." },
      { date: "2023. 12. 10", event: "노정흠 강도사 초등부 청년부 사임." },
      { date: "2023. 12. 17", event: "나정주 부목사 부임." },
      { date: "2023. 12. 31", event: "김상준 목사를 협동목사로 임명." },
      { date: "2024. 03. 14", event: "주일 오전 9시 영어예배 시작." },
      { date: "2024. 09. 01", event: "김미경 집사를 찬양 행정간사로 임명." },
      { date: "2024. 11. 10", event: "이효원 전도사 청소년부 부임." },
      { date: "2024. 12. 02", event: "비전센터 사랑관 봉헌." },
      { date: "2025. 01. 01", event: "김미경 간사를 전임 목회행정간사로 임명." },
      { date: "2025. 04. 27", event: "이효원 전도사 청소년부 사임." },
      { date: "2025. 06. 01", event: "허철 교육목사 중등부 부임." },
      { date: "2025. 12. 01", event: "허철 부목사 전임 목사 부임." },
      { date: "2025. 12. 01", event: "고강건 전도사 고등부 부임." },
      { date: "2026. 09. 06", event: "1부 8시, 2부 10시, 3부 12시 예배를 드리다." },
    ],
  },
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
          <SectionHeading eyebrow="History" title="교회발자취" description="1963년 시작된 원당교회가 지나온 발자취입니다." />
          <div className="mt-10 space-y-3">
            {historyGroups.map((group, i) => (
              <details
                key={group.label}
                open={i === historyGroups.length - 1}
                className="group overflow-hidden rounded-2xl border border-border bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
                  <span className="font-serif text-lg font-bold text-foreground">{group.label}</span>
                  <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground">
                    {group.items.length}건
                    <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <ol className="space-y-4 border-t border-border px-6 py-6">
                  {group.items.map((item) => (
                    <li key={`${item.date}-${item.event}`} className="flex flex-wrap gap-x-4 gap-y-1 text-sm leading-relaxed sm:flex-nowrap">
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

      <section id="mission" className="scroll-mt-24 bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Mission" title="선교" description="원당교회가 파송하고 후원하는 해외 선교사님을 소개합니다." />
          <h3 className="mt-12 text-center font-serif text-2xl font-bold">후원하는 해외 선교사님</h3>
          <div className="mt-8 rounded-3xl border border-border bg-card p-3 shadow-sm sm:p-6">
            <div className="relative aspect-[360/125]">
              <Image src="/images/world-dots.svg" alt="" fill unoptimized className="select-none" />
              <svg viewBox="0 0 360 125" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full lg:block" aria-hidden="true">
                {missionFields.map((f) => (
                  <line key={f.region} x1={mapX(f.lon)} y1={mapY(f.lat)} x2={mapX(f.lx)} y2={mapY(f.ly)} className="stroke-primary/40" strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
              <span aria-hidden="true" className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A15A] ring-2 ring-white" style={mapPos(HOME.lon, HOME.lat)} />
              {missionFields.map((f, i) => (
                <span key={f.region} aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2" style={mapPos(f.lon, f.lat)}>
                  <span className="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping" />
                  <span className="relative flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-white sm:size-6 sm:text-xs">
                    {i + 1}
                  </span>
                </span>
              ))}
              {missionFields.map((f, i) => (
                <div
                  key={f.region}
                  className="absolute hidden w-44 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm lg:block xl:w-48"
                  style={mapPos(f.lx, f.ly)}
                >
                  <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <MapPin className="size-3.5" />
                    {i + 1}. {f.region}
                  </p>
                  {f.people.map((p) => (
                    <div key={p.name} className="mt-1">
                      <p className="text-sm font-semibold leading-tight text-foreground">{p.name} 선교사</p>
                      <p className="text-xs leading-snug text-muted-foreground">{p.field}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              <span className="size-3 rounded-full bg-[#C9A15A]" /> 원당교회
            </p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:hidden">
              {missionFields.map((f, i) => (
                <li key={f.region} className="flex gap-3 rounded-xl border border-border p-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                  <div>
                    <p className="text-xs font-bold text-primary">{f.region}</p>
                    {f.people.map((p) => (
                      <p key={p.name} className="mt-0.5 text-sm">
                        <span className="font-semibold text-foreground">{p.name} 선교사</span>
                        <span className="block text-xs text-muted-foreground">{p.field}</span>
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
      <section id="location" className="scroll-mt-24 bg-white py-16 md:py-24">
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
