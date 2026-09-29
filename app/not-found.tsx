import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-2xl font-bold text-foreground">페이지를 찾을 수 없습니다</h1>
      <p className="max-w-md text-sm text-muted-foreground">주소가 바뀌었거나 삭제된 페이지일 수 있습니다.</p>
      <Button render={<Link href="/" />} nativeButton={false}>홈으로 가기</Button>
    </main>
  )
}
