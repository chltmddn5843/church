import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell, OfficeContact } from "@/components/auth-form"
import { runtimeEnv } from "@/lib/runtime-env"
import { ForgotPasswordForm } from "./forgot-password-form"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "비밀번호 찾기" }

export default function ForgotPasswordPage() {
  // Without outgoing email a reset request would claim success and send nothing, so point to the office instead.
  const emailEnabled = Boolean(runtimeEnv("RESEND_API_KEY") && runtimeEnv("EMAIL_FROM"))
  return (
    <AuthShell
      title="비밀번호 찾기"
      description={emailEnabled ? "가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드려요." : undefined}
    >
      {emailEnabled ? <ForgotPasswordForm turnstileSiteKey={runtimeEnv("TURNSTILE_SITE_KEY") ?? ""} /> : <OfficeContact />}
      <p className="mt-6 border-t border-border pt-5 text-sm">
        <Link href="/sign-in" className="inline-flex min-h-8 items-center font-semibold text-primary underline-offset-4 hover:underline">로그인으로 돌아가기</Link>
      </p>
    </AuthShell>
  )
}
