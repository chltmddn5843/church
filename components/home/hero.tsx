import Image from "next/image"
import Link from "next/link"
import { church } from "@/lib/church"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/wd-main.jpg"
        alt="원당교회 전경"
        fill
        priority
        className="hero-motion object-cover opacity-85"
      />
      <div className="absolute inset-0 bg-primary/20" />
      <div className="absolute inset-0 bg-white/25" />
      <div className="relative mx-auto flex min-h-[580px] max-w-6xl items-center justify-center px-4 py-24 text-center text-foreground md:min-h-[700px]">
        <div className="w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/55 px-6 py-10 shadow-2xl shadow-primary/15 backdrop-blur-sm md:px-12 md:py-14">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            {church.denomination}
          </p>
          <h1 className="font-serif text-3xl font-bold leading-[1.18] sm:text-4xl md:text-6xl">
            <span className="block whitespace-nowrap">제자 되고 제자 삼는</span>
            <span className="block whitespace-nowrap">원당교회</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {church.subSlogan}
          </p>
          <div className="mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
            <Button render={<Link href="/about" />} nativeButton={false} size="lg" className="h-14 rounded-2xl text-base">
              교회 소개
            </Button>
            <Button
              render={<Link href="/sermons" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="h-14 rounded-2xl border-primary/30 bg-white/70 text-base text-primary hover:bg-white"
            >
              설교 말씀 보기
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
