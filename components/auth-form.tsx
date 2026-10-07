"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { church } from "@/lib/church"
import { TurnstileWidget, type TurnstileHandle } from "@/components/turnstile-widget"

// Card shared by the sign-in, sign-up and password-reset pages: blue band with the real logo, like the site header.
export function AuthShell({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md border border-border bg-card shadow-sm">
        <Link href="/" className="flex h-20 items-center justify-center bg-primary focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white">
          <Image src="/images/wd-logo.png" alt={`${church.name} 홈으로`} width={247} height={53} priority className="h-11 w-auto" />
        </Link>
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && <p className="mt-2 break-keep leading-relaxed text-muted-foreground">{description}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  )
}

// Password reset needs outgoing email; until Resend is configured, members are sent to the church office instead.
export function OfficeContact() {
  return (
    <p className="break-keep text-sm leading-relaxed text-muted-foreground">
      비밀번호를 잊으셨나요? 교회 사무실{" "}
      <a href={`tel:${church.tel.replaceAll("-", "")}`} className="inline-flex min-h-8 items-center font-semibold text-primary underline-offset-4 hover:underline">
        {church.tel}
      </a>
      로 문의해 주세요.
    </p>
  )
}

// better-auth answers in English; the codes worth translating for visitors (captcha and rate limit are new).
export function authErrorMessage(error: { code?: string; status?: number; message?: string }) {
  if (error.status === 429) return "시도가 너무 많습니다. 잠시 후 다시 시도해 주세요."
  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD": return "이메일 또는 비밀번호가 올바르지 않습니다."
    case "USER_ALREADY_EXISTS": case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL": return "이미 가입된 이메일입니다."
    case "EMAIL_NOT_VERIFIED": return "이메일 인증 후 로그인할 수 있습니다. 받은 메일함을 확인해 주세요."
    case "MISSING_RESPONSE": case "VERIFICATION_FAILED": return "자동 입력 방지 확인에 실패했습니다. 확인 표시가 뜬 뒤 다시 시도해 주세요."
    default: return error.message ?? "오류가 발생했습니다. 다시 시도해 주세요."
  }
}

export function AuthForm({ mode, emailEnabled, turnstileSiteKey }: { mode: "sign-in" | "sign-up"; emailEnabled: boolean; turnstileSiteKey: string }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstile = useRef<TurnstileHandle>(null)

  const isSignUp = mode === "sign-up"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const fetchOptions = { headers: { "x-captcha-response": captchaToken ?? "" } }
    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name, fetchOptions })
      : await authClient.signIn.email({ email, password, fetchOptions })

    setLoading(false)
    // The token was spent on this attempt; get a fresh one for any retry.
    turnstile.current?.reset()

    if (error) {
      setError(authErrorMessage(error))
      return
    }

    if (isSignUp) {
      setSuccess(emailEnabled ? "인증 메일을 보냈습니다. 이메일 인증 후 관리자 승인을 기다려 주세요." : "회원가입이 완료됐습니다. 관리자 승인 후 회원 자료를 볼 수 있습니다.")
      router.refresh()
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <AuthShell
      title={isSignUp ? "회원가입" : "로그인"}
      description={isSignUp ? "가입 후 관리자 승인을 거쳐 회원으로 등록됩니다." : "원당교회 홈페이지에 오신 것을 환영합니다."}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {isSignUp && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className="h-11" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">비밀번호</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              aria-describedby={isSignUp ? "password-help" : undefined}
              className="h-11 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            >
              {showPassword ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
            </button>
          </div>
          {isSignUp && <p id="password-help" className="text-sm text-muted-foreground">8자 이상 입력해 주세요.</p>}
        </div>

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        {success && <p className="text-sm text-primary" role="status">{success}</p>}

        <TurnstileWidget ref={turnstile} siteKey={turnstileSiteKey} onToken={setCaptchaToken} />

        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={loading || !captchaToken} className="h-11 w-full text-base">
            {loading ? "잠시만 기다려 주세요..." : isSignUp ? "회원가입" : "로그인"}
          </Button>
          {!captchaToken && !loading && (
            <p className="text-center text-sm text-muted-foreground" aria-live="polite">자동 입력 방지 확인 중이에요. 잠시만 기다려 주세요.</p>
          )}
        </div>
      </form>

      {!isSignUp && (
        <div className="mt-6">
          {emailEnabled ? (
            <Link href="/forgot-password" className="inline-flex min-h-8 items-center text-sm font-medium text-primary hover:underline">비밀번호를 잊으셨나요?</Link>
          ) : (
            <OfficeContact />
          )}
        </div>
      )}

      <p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
        {/* Old-site accounts weren't migrated; their sign-ins fail as "User not found". */}
        {isSignUp ? "이미 계정이 있으신가요? " : "10월 1일 홈페이지 변경으로 기존 회원 계정이 없어졌습니다. 계속 이용하시려면 새로 "}
        <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="inline-flex min-h-8 items-center font-semibold text-primary underline-offset-4 hover:underline">
          {isSignUp ? "로그인" : "회원가입"}
        </Link>
        {!isSignUp && "을 해 주세요."}
      </p>
    </AuthShell>
  )
}
