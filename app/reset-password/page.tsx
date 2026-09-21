"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const token = new URLSearchParams(window.location.search).get("token")
    if (!token) return setMessage("재설정 링크가 올바르지 않거나 만료되었습니다.")
    const { error } = await authClient.resetPassword({ newPassword: password, token })
    setMessage(error ? (error.message ?? "재설정에 실패했습니다.") : "비밀번호를 변경했습니다. 이제 로그인해 주세요.")
  }
  return <main className="mx-auto max-w-md px-4 py-20"><h1 className="text-3xl font-bold">새 비밀번호 설정</h1><form onSubmit={submit} className="mt-8 space-y-4"><Input type="password" minLength={8} value={password} onChange={event => setPassword(event.target.value)} placeholder="새 비밀번호 (8자 이상)" required/><Button type="submit" className="w-full">비밀번호 변경</Button></form>{message && <p className="mt-4 text-sm" role="status">{message}</p>}</main>
}
