import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import { WorshipSchedule } from "@/components/worship-schedule"

export const metadata: Metadata = {
  title: "예배 안내",
  description: "원당교회 주일예배, 주일셀모임, 금요예배, 새벽예배와 다음세대 예배 시간을 안내합니다.",
}

export default function WorshipPage() {
  return (
    <>
      <PageBanner title="예배 안내" subtitle="원당교회의 예배와 모임 시간을 확인하세요." image="/images/worship-praise-wide.jpg" />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <WorshipSchedule sections="all" />
        </div>
      </section>
    </>
  )
}
