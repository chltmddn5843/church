import { Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

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

export function WorshipSchedule({ variant = "dialog" }: { variant?: "dialog" | "home" }) {
  const large = variant === "home"

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mainWorship.map((row) => (
          <div
            key={row.name}
            className={cn("rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md", large ? "p-7" : "p-6")}
          >
            <p className={cn("font-semibold uppercase tracking-wide text-muted-foreground", large ? "text-sm" : "text-xs")}>{row.day}</p>
            <p className={cn("mt-1 font-serif font-bold text-foreground", large ? "text-xl md:text-2xl" : "text-lg")}>{row.name}</p>
            <p className={cn("mt-3 flex items-center gap-2 font-bold tabular-nums text-primary", large ? "text-2xl md:text-3xl" : "text-xl")}>
              <Clock aria-hidden className={large ? "size-6" : "size-5"} />
              {row.time}
            </p>
            <p className={cn("mt-2 flex items-center gap-1.5 text-muted-foreground", large ? "text-base" : "text-sm")}>
              <MapPin aria-hidden className="size-4 shrink-0" />
              {row.place}
            </p>
          </div>
        ))}
      </div>

      <p className={cn("mt-10 mb-4 font-semibold text-muted-foreground", large ? "text-base" : "text-sm")}>교육부 · 다음세대</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {nextGenWorship.map((row) => (
          <div key={row.name} className={cn("rounded-xl border border-border bg-card shadow-sm", large ? "p-5" : "p-4")}>
            <p className={cn("font-semibold text-foreground", large ? "text-base" : "text-sm")}>{row.name}</p>
            <p className={cn("mt-1.5 flex items-center gap-1.5 text-muted-foreground", large ? "text-sm" : "text-xs")}>
              <Clock aria-hidden className={cn("shrink-0", large ? "size-4" : "size-3.5")} />
              {row.time}
            </p>
            <p className={cn("mt-1 flex items-center gap-1.5 text-muted-foreground", large ? "text-sm" : "text-xs")}>
              <MapPin aria-hidden className={cn("shrink-0", large ? "size-4" : "size-3.5")} />
              {row.place}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
