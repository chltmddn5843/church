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
  const link = token ? `/offering/${token}` : "저장 후 전용 링크가 생성됩니다."

  return (
    <>
      <div className="border-b border-[#dedede] pb-7">
        <p className="text-sm font-medium text-[#39715d]">OFFERING REPORT</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">헌금 현황 관리</h1>
        <p className="mt-2 text-sm text-[#777]">
          헌금 현황은 공개 메뉴에 노출되지 않고, 아래 전용 링크를 받은 분만 로그인 없이 볼 수 있습니다.
        </p>
      </div>

      <section className="mt-8 rounded-xl border bg-[#fafafa] p-5">
        <p className="text-sm font-semibold text-[#333]">배포용 링크</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input readOnly value={link} className="bg-white" />
          {token && (
            <Button render={<Link href={link} target="_blank" />} nativeButton={false} variant="outline">
              <ExternalLink className="size-4" />
              열기
            </Button>
          )}
        </div>
        <p className="mt-2 flex items-center gap-1 text-xs text-[#777]">
          <Copy className="size-3" />
          상대 경로로 표시됩니다. 배포 도메인 뒤에 붙여 전달해 주세요.
        </p>
      </section>

      <form action={saveOfferingReport} className="mt-8 grid gap-4 rounded-2xl border bg-card p-6 shadow-sm">
        {report && <input type="hidden" name="id" value={report.id} />}
        <label className="grid gap-2 text-sm font-medium">
          제목
          <Input name="title" required defaultValue={report?.title ?? "이번 주 헌금 현황"} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          헌금 리스트
          <textarea
            name="content"
            required
            rows={18}
            defaultValue={report?.content ?? ""}
            placeholder={"십일조\n홍길동 100,000\n\n감사헌금\n김원당 50,000"}
            className="min-h-[360px] rounded-lg border bg-background p-4 font-mono text-sm leading-7"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={report?.active ?? true} />
          전용 링크 공개
        </label>
        <Button type="submit" className="w-fit">헌금 현황 저장</Button>
      </form>
    </>
  )
}
