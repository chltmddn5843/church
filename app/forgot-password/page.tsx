"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" })
    setMessage("가입된 이메일이면 재설정 링크를 보냈습니다.")
  }
  return <main className="mx-auto max-w-md px-4 py-20"><h1 className="text-3xl font-bold">비밀번호 찾기</h1><form onSubmit={submit} className="mt-8 space-y-4"><Input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="이메일" required/><Button className="w-full">재설정 메일 보내기</Button></form>{message && <p className="mt-4 text-sm text-primary" role="status">{message}</p>}</main>
}
