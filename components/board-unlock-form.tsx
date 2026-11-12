import { Lock } from "lucide-react"
import { unlockBoard } from "@/app/actions/board-passwords"
import { Button } from "@/components/ui/button"

const messages: Record<string, string> = {
  wrong: "비밀번호가 맞지 않습니다.",
  limited: "시도가 너무 많습니다. 1분 뒤 다시 입력해 주세요.",
}

/** Password prompt for a locked 게시판 post or 앨범. lockKey is the board_passwords.category row. */
export function BoardUnlockForm({ lockKey, returnTo, label, error }: { lockKey: string; returnTo: string; label: string; error?: string }) {
  const message = error ? messages[error] : undefined
  return (
    <form action={unlockBoard} className="mx-auto mt-10 grid max-w-sm gap-3 border border-border bg-card p-6">
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="category" value={lockKey} />
      <label htmlFor="board-password" className="flex items-center gap-2 font-semibold text-foreground">
        <Lock className="size-4" aria-hidden /> {label}
      </label>
      <input id="board-password" name="password" type="password" required autoFocus autoComplete="current-password" aria-describedby={message ? "unlock-error" : undefined} className="h-11 border bg-background px-3" />
      {message && <p id="unlock-error" role="alert" className="text-sm text-destructive">{message}</p>}
      <Button type="submit">확인</Button>
    </form>
  )
}
