"use client"

import { useRef, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TurnstileWidget, type TurnstileHandle } from "@/components/turnstile-widget"
import { authErrorMessage } from "@/components/auth-form"

export function ForgotPasswordForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstile = useRef<TurnstileHandle>(null)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password", fetchOptions: { headers: { "x-captcha-response": captchaToken ?? "" } } })
    setLoading(false)
    turnstile.current?.reset()
    setMessage(error ? authErrorMessage(error) : "가입된 이메일이면 재설정 링크를 보냈습니다. 받은 메일함을 확인해 주세요.")
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="reset-email">이메일</Label>
        <Input id="reset-email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-11" />
      </div>
      <TurnstileWidget ref={turnstile} siteKey={turnstileSiteKey} onToken={setCaptchaToken} />
      <Button type="submit" disabled={loading || !captchaToken} className="h-11 w-full text-base">
        {loading ? "잠시만 기다려 주세요..." : "재설정 메일 보내기"}
      </Button>
      {message && <p className="text-sm text-primary" role="status">{message}</p>}
    </form>
  )
}
