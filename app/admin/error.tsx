"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-xl font-bold text-foreground">일시적인 오류가 발생했습니다</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        서버 응답이 잠시 불안정했을 수 있어요. 방금 작업(등록/수정/삭제)이 실제로 반영됐는지 목록에서 확인한 뒤,
        아래 버튼으로 다시 시도해 주세요.
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  )
}
