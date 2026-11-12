import { Lock } from "lucide-react"
import { clearBoardPassword, setBoardPassword } from "@/app/actions/board-passwords"
import { SubmitButton } from "@/components/admin/submit-button"

const fieldClass =
  "h-9 min-w-0 flex-1 rounded-md border border-border bg-white px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"

/** Per-board read passwords. key is the board_passwords.category row; locks maps key → hash. */
export function BoardPasswordPanel({
  adminPage,
  boards,
  locks,
  note,
}: {
  adminPage: "/admin/posts" | "/admin/gallery"
  boards: { key: string; label: string }[]
  locks: Map<string, string>
  note: string
}) {
  const anyLocked = boards.some((b) => locks.has(b.key))
  return (
    <details className="mt-6 rounded-lg border border-border bg-white shadow-sm" open={anyLocked}>
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 px-5 py-4 font-semibold text-foreground">
        <Lock className="size-4 text-primary" aria-hidden /> 비밀번호 잠금
        <span className="text-sm font-normal text-muted-foreground">{note}</span>
      </summary>
      <ul className="divide-y divide-border border-t border-border">
        {boards.map(({ key, label }) => (
          <li key={key} className="flex flex-wrap items-center gap-3 px-5 py-3">
            <span className="w-28 shrink-0 text-sm font-medium text-foreground">{label}</span>
            <span className={`w-16 shrink-0 text-xs font-semibold ${locks.has(key) ? "text-primary" : "text-muted-foreground"}`}>{locks.has(key) ? "잠금" : "공개"}</span>
            <form action={setBoardPassword.bind(null, key, adminPage)} className="flex flex-1 flex-wrap items-center gap-2">
              <input name="password" type="password" required minLength={4} maxLength={100} autoComplete="new-password" aria-label={`${label} 비밀번호`} placeholder={locks.has(key) ? "새 비밀번호로 변경" : "비밀번호 설정 (4자 이상)"} className={fieldClass} />
              <SubmitButton size="sm" pendingLabel="저장 중...">저장</SubmitButton>
            </form>
            {locks.has(key) && (
              <form action={clearBoardPassword.bind(null, key, adminPage)}>
                <SubmitButton size="sm" variant="outline" pendingLabel="해제 중...">해제</SubmitButton>
              </form>
            )}
          </li>
        ))}
      </ul>
    </details>
  )
}
