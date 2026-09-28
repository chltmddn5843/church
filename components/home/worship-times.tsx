import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { WorshipSchedule } from "@/components/worship-schedule"
import { Button } from "@/components/ui/button"

export function WorshipTimes() {
  return (
    <section id="worship" className="scroll-mt-24 relative isolate overflow-x-clip pb-20 pt-28 md:pb-28 md:pt-40">
      <Image src="/images/wd-main.jpg" alt="" fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-sidebar/80 via-sidebar/60 to-sidebar/85" />
      <div aria-hidden="true" className="absolute -top-0.5 left-1/2 h-9 w-[160%] -translate-x-1/2 rounded-b-[50%_100%] bg-background md:h-[58px] md:w-[130%]" />

      <div className="scroll-reveal relative mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Worship</p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white md:text-3xl">주일예배 시간</h2>
        </div>
        <div className="mt-8">
          <WorshipSchedule sections="summary" variant="dark" />
        </div>
        <div className="mt-4">
          <Button
            render={<Link href="/worship" />}
            nativeButton={false}
            className="group h-auto min-h-14 w-full gap-2 whitespace-normal py-3 text-center border border-white/20 bg-sidebar/60 text-base font-semibold text-white shadow-xl backdrop-blur-md hover:bg-primary"
          >
            전체 예배 안내 보기 (셀모임 · 새벽예배 · 다음세대)
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}
