import { SectionHeading } from "@/components/section-heading"
import { WorshipSchedule } from "@/components/worship-schedule"

export function WorshipTimes() {
  return (
    <section className="bg-secondary/50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Worship" title="예배 시간 안내" description="원당교회의 예배와 모임 시간을 확인하세요." />
        <div className="mt-10">
          <WorshipSchedule variant="home" />
        </div>
      </div>
    </section>
  )
}
