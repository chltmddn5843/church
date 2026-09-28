import type { Metadata } from "next"
import { CampusMap } from "@/components/campus-map"

export const metadata: Metadata = {
  title: "3D 공간 안내",
  description: "원당교회 사랑관·소망관·믿음관의 위치와 예배 장소를 살펴보세요.",
}

export default function CampusPage() {
  return <CampusMap />
}
