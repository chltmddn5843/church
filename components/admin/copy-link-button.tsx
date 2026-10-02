"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function CopyLinkButton({ url }: { url: string }) {
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => navigator.clipboard.writeText(url).then(() => toast.success("링크를 복사했습니다."), () => toast.error("복사하지 못했습니다. 주소를 직접 선택해 복사해 주세요."))}
    >
      <Copy className="size-4" />
      복사
    </Button>
  )
}
