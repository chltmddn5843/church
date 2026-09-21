import Link from "next/link"
import { Copy, ExternalLink } from "lucide-react"
import { saveOfferingReport } from "@/app/actions/offering-reports"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getLatestOfferingReport } from "@/lib/queries"

export const dynamic = "force-dynamic"

export default async function AdminOfferingPage() {
  const report = await getLatestOfferingReport()
  const token = report?.accessToken
  const path = token ? `/offering/${token}` : null
  const link = path && process.env.BETTER_AUTH_URL ? new URL(path, process.env.BETTER_AUTH_URL).toString() : path ?? "저장 후 전용 링크가 생성됩니다."

  return (
    <>
      <div className="border-b border-[#d7e5ee] pb-6">
        <p className="text-sm font-semibold text-[#2F5D8A]">OFFERING REPORT</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#183247]">헌금 현황 관리</h1>
        <p className="mt-2 text-sm text-[#526a7d]">
          헌금 현황은 공개 메뉴에 노출되지 않고, 아래 전용 링크를 받은 분만 로그인 없이 볼 수 있습니다.
        </p>
      </div>

      <section className="mt-8 rounded-lg border border-[#d7e5ee] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-[#183247]">배포용 링크</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input readOnly value={link} className="bg-white" />
          {path && (
            <Button render={<Link href={path} target="_blank" rel="noopener noreferrer" />} nativeButton={false} variant="outline">
              <ExternalLink className="size-4" />
              열기
            </Button>
          )}
        </div>
        <p className="mt-2 flex items-center gap-1 text-xs text-[#6d7f8c]">
          <Copy className="size-3" />
          이 주소를 받은 분은 회원가입이나 로그인 없이 현황을 확인할 수 있습니다.
        </p>
      </section>

      <form action={saveOfferingReport} className="mt-8 grid gap-4 rounded-lg border border-[#d7e5ee] bg-white p-6 shadow-sm">
        {report && <input type="hidden" name="id" value={report.id} />}
        <label className="grid gap-2 text-sm font-medium text-[#183247]">
          제목
          <Input name="title" required defaultValue={report?.title ?? "이번 주 헌금 현황"} />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#183247]">
          헌금 리스트
          <textarea
            name="content"
            required
            rows={18}
            defaultValue={report?.content ?? ""}
            placeholder={"십일조\n홍길동 100,000\n\n감사헌금\n김원당 50,000"}
            className="min-h-[360px] rounded-md border border-[#cbd9e3] bg-white p-4 font-mono text-sm leading-7 outline-none transition focus:border-[#2F5D8A] focus:ring-2 focus:ring-[#9CC7E6]/40"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-[#183247]">
          <input type="checkbox" name="active" defaultChecked={report?.active ?? true} className="size-4" />
          전용 링크 공개
        </label>
        <Button type="submit" className="w-fit">헌금 현황 저장</Button>
      </form>
    </>
  )
}
