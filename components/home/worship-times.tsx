import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { WorshipSchedule } from "@/components/worship-schedule"
import { Button } from "@/components/ui/button"

export function WorshipTimes() {
  return (
    <section id="worship" className="scroll-mt-24 relative isolate overflow-hidden py-20 md:py-28">
      <Image src="/images/wd-main.jpg" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/75" />

      <div className="scroll-reveal relative mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/80">Worship</p>
          <span className="mt-3 mx-auto block h-[3px] w-10 rounded-full bg-[#C9A15A]" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-white md:text-4xl">주일예배 시간</h2>
          <p className="mt-3 text-white/85">원당교회의 주일예배 시간을 확인하세요.</p>
        </div>
        <div className="mt-10">
          <WorshipSchedule sections="summary" variant="dark" />
        </div>
        <div className="mx-auto mt-8 max-w-5xl">
          <Button
            render={<Link href="/worship" />}
            nativeButton={false}
            className="h-14 w-full gap-1.5 rounded-2xl bg-white text-base font-semibold text-primary shadow-sm hover:bg-white/90"
          >
            전체 예배 안내 보기 (셀모임 · 새벽예배 · 다음세대)
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
