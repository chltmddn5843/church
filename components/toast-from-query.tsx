"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

const messages: Record<string, string> = {
  created: "등록 완료됐습니다.",
  updated: "수정 완료됐습니다.",
  deleted: "삭제 완료됐습니다.",
  member: "회원 승인 상태가 변경됐습니다.",
  group: "회원 자료 권한이 변경됐습니다.",
  popup: "팝업 설정이 저장됐습니다.",
  offering: "헌금 현황이 저장됐습니다.",
  gallery: "사진이 등록됐습니다.",
}

export function ToastFromQuery() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const saved = searchParams.get("saved")

  useEffect(() => {
    if (!saved) return

    toast.success(messages[saved] ?? "처리 완료됐습니다.")
    const next = new URLSearchParams(searchParams.toString())
    next.delete("saved")
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [pathname, router, saved, searchParams])

  return null
}
