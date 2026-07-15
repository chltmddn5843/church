import Image from "next/image"
import Link from "next/link"
import { church } from "@/lib/church"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/hero-worship.png"
        alt="원당교회 예배 모습"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/85" />
      <div className="relative mx-auto flex min-h-[560px] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center text-primary-foreground md:min-h-[640px]">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-accent">
          {church.denomination}
        </p>
        <h1 className="max-w-3xl text-balance font-serif text-4xl font-bold leading-tight md:text-6xl">
          {church.slogan}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed opacity-90 md:text-lg">
          {church.subSlogan}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/about">교회 소개</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link href="/sermons">설교 말씀 보기</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
