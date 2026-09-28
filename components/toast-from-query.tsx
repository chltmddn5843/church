"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

const messages: Record<string, string> = {
  created: "등록되었습니다.",
  updated: "수정되었습니다.",
  deleted: "삭제되었습니다.",
  member: "회원 승인 상태가 변경되었습니다.",
  group: "회원 자료 권한이 변경되었습니다.",
  popup: "팝업 설정이 저장되었습니다.",
  offering: "헌금 현황이 저장되었습니다.",
  gallery: "사진이 등록되었습니다.",
  cleared: "직접 지정한 영상을 내렸습니다. 이제 생방송을 자동으로 찾아 표시합니다.",
  live: "직접 지정한 영상이 메인 페이지 '말씀 다시보기' 자리에 표시됩니다.",
}

const errors: Record<string, string> = {
  youtube: "YouTube 영상 주소를 확인해 주세요. 예: https://www.youtube.com/live/영상ID 또는 https://youtu.be/영상ID",
}

export function ToastFromQuery() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const saved = searchParams.get("saved")
  const error = searchParams.get("error")

  useEffect(() => {
    if (!saved && !error) return

    if (error) {
      toast.error(errors[error] ?? "처리하지 못했습니다. 입력 내용을 확인해 주세요.")
    } else if (saved) {
      const message = messages[saved] ?? "처리되었습니다."
      toast.success(message)
      if (saved === "deleted") window.alert(message)
    }

    const next = new URLSearchParams(searchParams.toString())
    next.delete("saved")
    next.delete("error")
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [error, pathname, router, saved, searchParams])

  return null
}
