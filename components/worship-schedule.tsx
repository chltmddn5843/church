import { Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const mainWorship = [
  { name: "주일예배 1부", day: "주일 오전", time: "08:00 ~ 10:10", place: "믿음관/비전홀(1층)" },
  { name: "주일예배 2부", day: "주일 오전", time: "10:00 ~ 11:10", place: "믿음관/비전홀(1층)" },
  { name: "주일예배 3부", day: "주일 오후", time: "12:00 ~ 01:10", place: "믿음관/비전홀(1층)" },
  { name: "주일셀모임", day: "주일 오후", time: "02:30 ~ 04:30", place: "각 장소" },
  { name: "금요예배", day: "금요일 저녁", time: "09:00 ~ 11:00", place: "믿음관/비전홀(1층)" },
  { name: "새벽예배", day: "월~금 오전", time: "05:00 ~ 05:30", place: "믿음관/비전홀(1층)" },
]

const nextGenWorship = [
  { name: "유아부", day: "주일 오전", time: "10:00 ~ 11:10", place: "소망관/사무엘홀(1층)" },
  { name: "유치부", day: "주일 오전", time: "10:00 ~ 11:20", place: "소망관/다윗홀(2층)" },
  { name: "유년부", day: "주일 오후", time: "12:00 ~ 01:20", place: "소망관/요셉홀(2층)" },
  { name: "초등부", day: "주일 오전", time: "11:55 ~ 01:20", place: "사랑관/드림홀(2층)" },
  { name: "중등부", day: "주일 오전", time: "11:00 ~ 12:20", place: "사랑관/디모데홀(3층)" },
  { name: "고등부", day: "주일 오전", time: "11:00 ~ 12:20", place: "소망관/다니엘홀(2층)" },
  { name: "어와나(AWANA)", day: "주일 · 토요", time: "02:30~04:30 · 10:00~12:00", place: "사랑관 드림홀(2층)/만나홀(1층)" },
  { name: "영어예배부", day: "주일 오전", time: "10:00 ~ 11:10", place: "사랑관/드림홀(2층)" },
  { name: "청년부", day: "주일 오후", time: "02:00 ~ 03:00", place: "사랑관/디모데홀(3층)" },
]

function ScheduleTable({
  caption,
  firstColumn,
  rows,
}: {
  caption: string
  firstColumn: string
  rows: { name: string; day: string; time: string; place: string }[]
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
      <table className="w-full min-w-[560px] table-fixed text-left">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col className="w-[28%]" />
          <col className="w-[34%]" />
          <col className="w-[38%]" />
        </colgroup>
        <thead>
          <tr className="bg-secondary">
            <th scope="col" className="px-5 py-4 text-sm font-bold text-foreground md:text-base">{firstColumn}</th>
            <th scope="col" className="px-5 py-4 text-sm font-bold text-foreground md:text-base">요일 / 시간</th>
            <th scope="col" className="px-5 py-4 text-sm font-bold text-foreground md:text-base">장소</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row" className="px-5 py-4 align-middle font-serif text-base font-bold text-foreground md:text-lg">{row.name}</th>
              <td className="px-5 py-4 align-middle">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{row.day}</p>
                <p className="mt-0.5 text-lg font-bold tabular-nums text-primary md:text-xl">{row.time}</p>
              </td>
              <td className="px-5 py-4 align-middle text-sm text-muted-foreground md:text-base">{row.place}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SummaryStrip({ rows, variant = "light" }: { rows: { name: string; day: string; time: string; place: string }[]; variant?: "light" | "dark" }) {
  const dark = variant === "dark"
  return (
    <div
      className={cn(
        "grid overflow-hidden shadow-xl sm:grid-cols-3",
        dark
          ? "divide-y divide-white/15 rounded-md border border-white/20 bg-white/10 backdrop-blur-md sm:divide-x sm:divide-y-0"
          : "divide-y divide-border rounded-2xl border border-border bg-card sm:divide-x sm:divide-y-0",
      )}
    >
      {rows.map((row) => (
        <div key={row.name} className="p-7 text-center">
          <p className={cn("text-sm font-semibold uppercase tracking-wide", dark ? "text-white/70" : "text-muted-foreground")}>{row.day}</p>
          <p className={cn("mt-1 font-serif text-xl font-bold md:text-2xl", dark ? "text-white" : "text-foreground")}>{row.name}</p>
          <p className={cn("mt-3 flex items-center justify-center gap-2 text-2xl font-bold tabular-nums md:text-3xl", dark ? "text-white" : "text-primary")}>
            <Clock aria-hidden className="size-6" />
            {row.time}
          </p>
          <p className={cn("mt-2 flex items-center justify-center gap-1.5 text-base", dark ? "text-white/80" : "text-muted-foreground")}>
            <MapPin aria-hidden className="size-4 shrink-0" />
            {row.place}
          </p>
        </div>
      ))}
    </div>
  )
}

export function WorshipSchedule({ sections = "all", variant = "light" }: { sections?: "summary" | "all"; variant?: "light" | "dark" }) {
  if (sections === "summary") {
    return <SummaryStrip rows={mainWorship.filter((row) => row.name.startsWith("주일예배"))} variant={variant} />
  }

  return (
    <div className="space-y-10">
      <ScheduleTable caption="예배 시간표" firstColumn="예배" rows={mainWorship} />
      <div>
        <h3 className="mb-4 text-lg font-bold text-foreground md:text-xl">교육부 · 다음세대</h3>
        <ScheduleTable caption="다음세대 예배 시간표" firstColumn="부서" rows={nextGenWorship} />
      </div>
    </div>
  )
}
