import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { WorshipSchedule } from "@/components/worship-schedule"
import { Button } from "@/components/ui/button"

export function WorshipTimes() {
  return (
    <section id="worship" className="scroll-mt-24 bg-secondary/50 py-16 md:py-20">
      <div className="scroll-reveal mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Worship" title="주일예배 시간" description="원당교회의 주일예배 시간을 확인하세요." />
        <div className="mt-10">
          <WorshipSchedule sections="summary" />
        </div>
        <div className="mx-auto mt-8 max-w-5xl">
          <Button
            render={<Link href="/worship" />}
            nativeButton={false}
            variant="outline"
            className="h-14 w-full gap-1.5 rounded-2xl border-primary/25 bg-white/80 text-base font-semibold text-primary shadow-sm hover:bg-white"
          >
            전체 예배 안내 보기 (셀모임 · 새벽예배 · 다음세대)
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
