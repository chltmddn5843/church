import type { Metadata } from "next"
import { CampusGuide } from "@/components/campus-map"
import { PageBanner } from "@/components/page-banner"

export const metadata: Metadata = {
  title: "공간 안내",
  description: "원당교회 사랑관·소망관·믿음관의 층별 공간과 부서별 예배 장소를 3D 모형과 함께 살펴보세요.",
}

export default function CampusPage() {
  return (
    <>
      <PageBanner title="공간 안내" subtitle="사랑관·소망관·믿음관, 어디서 무엇을 하는지 한눈에 살펴보세요." image="/images/wd-main.jpg" />
      <CampusGuide />
    </>
  )
}
