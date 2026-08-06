import { bootstrapAdmin } from "@/app/actions/setup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const dynamic = "force-dynamic"

export default function SetupAdminPage() {
  return <main className="mx-auto max-w-md px-4 py-20"><h1 className="text-3xl font-bold">최초 관리자 설정</h1><p className="mt-3 text-muted-foreground">관리자 이메일로 로그인한 뒤 Cloudflare Secret에 등록한 설정 키를 입력하세요. 관리자가 한 명이라도 있으면 이 기능은 비활성화됩니다.</p><form action={bootstrapAdmin} className="mt-8 space-y-4"><div className="space-y-2"><Label htmlFor="key">설정 키</Label><Input id="key" name="key" type="password" required autoComplete="off" /></div><Button className="w-full">관리자 설정</Button></form></main>
}
