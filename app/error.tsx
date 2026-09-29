"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { church } from "@/lib/church"

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-bold text-foreground">일시적인 오류가 발생했습니다</h1>
      <p className="max-w-md text-sm text-muted-foreground">잠시 후 다시 시도해 주세요. 문제가 계속되면 교회 사무실({church.tel})로 알려 주세요.</p>
      <div className="flex gap-2">
        <Button onClick={reset}>다시 시도</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>홈으로</Button>
      </div>
    </main>
  )
}
