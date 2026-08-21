"use client"

import { useFormStatus } from "react-dom"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ConfirmDeleteButtonProps = {
  label?: string
  confirmMessage?: string
  className?: string
}

export function ConfirmDeleteButton({
  label = "삭제",
  confirmMessage = "삭제하시겠습니까?",
  className,
}: ConfirmDeleteButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="sm"
      variant="destructive"
      className={className}
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault()
      }}
    >
      <Trash2 className="size-4" />
      {pending ? "삭제 중" : label}
    </Button>
  )
}
