import type { Metadata } from "next"
import Image from "next/image"
import { PageBanner } from "@/components/page-banner"
import { SectionHeading } from "@/components/section-heading"
import { BookOpen, Users, Sprout, GraduationCap } from "lucide-react"

export const metadata: Metadata = {
  title: "제자훈련",
  description: "말씀 위에 세워지는 제자의 삶, 원당교회 제자훈련 과정을 안내합니다.",
}

const courses = [
  {
    icon: Sprout,
    step: "STEP 1",
    title: "새가족반",
    period: "4주 과정",
    desc: "교회에 처음 오신 분들을 위한 신앙의 기초와 교회 생활 안내 과정입니다.",
  },
  {
    icon: BookOpen,
    step: "STEP 2",
    title: "양육반",
    period: "10주 과정",
    desc: "성경 전체의 흐름과 핵심 진리를 체계적으로 배우는 말씀 훈련 과정입니다.",
  },
  {
    icon: Users,
    step: "STEP 3",
    title: "제자반",
    period: "27주 과정",
    desc: "예수님의 제자로 닮아가는 삶을 위해 순종과 변화를 배워가는 훈련 과정입니다.",
  },
  {
    icon: GraduationCap,
    step: "STEP 4",
    title: "사역반",
    period: "26주 과정",
    desc: "훈련된 제자를 사역자로 세우는 리더십과 봉사 실천 과정입니다.",
  },
]

export default function DiscipleshipPage() {
  return (
    <>
      <PageBanner
        title="제자훈련"
        subtitle="배워서 남 주는 제자, 예수님을 닮아가는 삶"
        image="/images/discipleship.png"
      />

      <section id="intro" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <Image src="/images/discipleship.png" alt="제자훈련 소그룹 모임" fill className="object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="Discipleship" title="제자훈련 안내" align="left" />
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                원당교회 제자훈련은 한 사람을 예수 그리스도의 온전한 제자로 세우는 것을 목표로 합니다. 말씀과
                기도, 그리고 삶의 나눔을 통해 신앙이 성숙해집니다.
              </p>
              <p>
                단계별 양육 과정을 통해 누구나 신앙의 기초부터 사역자로 성장하는 여정을 함께 걸어갑니다. 지금
                제자의 삶으로 여러분을 초대합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="scroll-mt-24 bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Courses" title="훈련 과정" description="단계별로 성장하는 양육 시스템" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => (
              <div key={c.title} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <c.icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                  {c.step}
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold text-foreground">{c.title}</h3>
                <p className="text-sm font-medium text-primary">{c.period}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
