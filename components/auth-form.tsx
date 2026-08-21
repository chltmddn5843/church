"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Cross } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { church } from "@/lib/church"

export function AuthForm({ mode, emailEnabled }: { mode: "sign-in" | "sign-up"; emailEnabled: boolean }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const isSignUp = mode === "sign-up"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? "오류가 발생했습니다. 다시 시도해 주세요.")
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
    <main className="flex min-h-svh items-center justify-center bg-secondary px-4 py-12">
      <Card className="w-full max-w-sm p-6">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Cross className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-bold text-foreground">{church.name}</span>
        </Link>

        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {isSignUp ? "회원가입" : "로그인"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignUp ? "가입 후 관리자 승인 절차를 거쳐 회원으로 등록됩니다." : "원당교회 홈페이지에 오신 것을 환영합니다."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          {success && <p className="text-sm text-primary" role="status">{success}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "잠시만 기다려 주세요..." : isSignUp ? "회원가입" : "로그인"}
          </Button>
        </form>

        {!isSignUp && emailEnabled && (
          <p className="mt-4 text-center text-sm">
            <Link href="/forgot-password" className="text-primary hover:underline">비밀번호를 잊으셨나요?</Link>
          </p>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? "이미 계정이 있으신가요? " : "아직 계정이 없으신가요? "}
          <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-medium text-primary underline-offset-4 hover:underline">
            {isSignUp ? "로그인" : "회원가입"}
          </Link>
        </p>
      </Card>
    </main>
  )
}
