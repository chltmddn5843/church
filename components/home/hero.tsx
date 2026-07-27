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
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-primary/25" />
      <div className="relative mx-auto flex min-h-[560px] max-w-6xl flex-col items-start justify-center px-4 py-24 text-left text-foreground md:min-h-[640px]">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          {church.denomination}
        </p>
        <h1 className="max-w-3xl text-balance font-serif text-4xl font-bold leading-tight md:text-6xl">
          {church.slogan}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed opacity-90 md:text-lg">
          {church.subSlogan}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button render={<Link href="/about" />} nativeButton={false} size="lg">
            교회 소개
          </Button>
          <Button
            render={<Link href="/sermons" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="border-primary/30 bg-white/70 text-primary hover:bg-white"
          >
            설교 말씀 보기
          </Button>
        </div>
      </div>
    </section>
  )
}
