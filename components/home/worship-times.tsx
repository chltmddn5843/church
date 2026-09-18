import { Clock, MapPin } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

const mainWorship = [
  { name: "주일예배 1부", day: "주일 오전", time: "09:00 ~ 10:00", place: "믿음관/비전홀(1층)" },
  { name: "주일예배 2부", day: "주일 오전", time: "11:00 ~ 12:20", place: "믿음관/비전홀(1층)" },
  { name: "주일셀모임", day: "주일 오후", time: "01:30 ~ 03:30", place: "각 홀에서 진행" },
  { name: "금요예배", day: "금요일 저녁", time: "09:00 ~ 11:00", place: "믿음관/비전홀(1층)" },
  { name: "새벽예배", day: "월~금 오전", time: "05:00 ~ 05:30", place: "믿음관/비전홀(1층)" },
]

const nextGenWorship = [
  { name: "유아부", time: "09:50 ~ 10:50", place: "소망관/사무엘홀(1층)" },
  { name: "유치부", time: "11:00 ~ 12:20", place: "소망관/다윗홀(2층)" },
  { name: "유년부", time: "10:50 ~ 12:20", place: "소망관/요셉홀(2층)" },
  { name: "초등부", time: "10:55 ~ 12:20", place: "사랑관/드림홀(2층)" },
  { name: "중등부", time: "11:00 ~ 12:20", place: "사랑관/디모데홀(3층)" },
  { name: "고등부", time: "11:00 ~ 12:20", place: "소망관/다니엘홀(2층)" },
  { name: "어와나(AWANA)", time: "주일 13:30~15:00 · 토요 10:00~12:00", place: "사랑관 드림홀(2층)/만나홀(1층)" },
  { name: "영어예배부", time: "09:00 ~ 10:10", place: "사랑관/드림홀(2층)" },
  { name: "청년부", time: "01:50 ~ 03:00", place: "사랑관/디모데홀(3층)" },
]

export function WorshipTimes() {
  return (
    <section id="worship" className="scroll-mt-24 bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <SectionHeading eyebrow="Worship" title="예배 안내" description="원당교회 예배시간 안내입니다." />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mainWorship.map((row) => (
            <div key={row.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{row.day}</p>
              <p className="mt-1 font-serif text-lg font-bold text-foreground">{row.name}</p>
              <p className="mt-3 flex items-center gap-2 text-xl font-bold tabular-nums text-primary">
                <Clock aria-hidden className="size-5" />
                {row.time}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin aria-hidden className="size-4 shrink-0" />
                {row.place}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 mb-4 text-sm font-semibold text-muted-foreground">교육부 · 다음세대</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {nextGenWorship.map((row) => (
            <div key={row.name} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-sm font-semibold text-foreground">{row.name}</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock aria-hidden className="size-3.5 shrink-0" />
                {row.time}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin aria-hidden className="size-3.5 shrink-0" />
                {row.place}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
