import Link from "next/link"
import { ExternalLink, Plus, Save } from "lucide-react"
import { saveOfferingReport } from "@/app/actions/offering-reports"
import { CopyLinkButton } from "@/components/admin/copy-link-button"
import { SubmitButton } from "@/components/admin/submit-button"
import { Input } from "@/components/ui/input"
import { getOfferingReports } from "@/lib/queries"

export const dynamic = "force-dynamic"

const kstDate = (date: Date, options: Intl.DateTimeFormatOptions) => date.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", ...options })

function ReportFields({ title, content, active }: { title: string; content: string; active: boolean }) {
  return (
    <>
      <label className="grid gap-2 text-sm font-medium text-foreground">
        제목
        <Input name="title" required defaultValue={title} className="h-11 bg-white" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-foreground">
        헌금 리스트
        <textarea
          name="content"
          required
          rows={16}
          defaultValue={content}
          placeholder={"십일조\n홍길동 100,000\n\n감사헌금\n김원당 50,000"}
          className="min-h-[320px] rounded-md border border-border bg-white p-4 font-mono text-sm leading-7 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="active" defaultChecked={active} className="size-4" />
        링크로 공개 <span className="text-muted-foreground">(해제하면 이 주차는 링크에서 보이지 않습니다)</span>
      </label>
    </>
  )
}

function LinkRow({ url, path }: { url: string; path: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Input readOnly value={url} className="h-10 bg-white font-mono text-xs" />
      <div className="flex shrink-0 gap-2">
        <CopyLinkButton url={url} />
        <Link href={path} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-border px-2.5 text-sm font-medium hover:bg-muted">
          <ExternalLink className="size-4" /> 열기
        </Link>
      </div>
    </div>
  )
}

export default async function AdminOfferingPage() {
  const reports = await getOfferingReports()
  const latest = reports[0]
  const base = process.env.BETTER_AUTH_URL
  const toUrl = (path: string) => (base ? new URL(path, base).toString() : path)
  const mainPath = latest ? `/offering/${latest.accessToken}` : null

  return (
    <>
      <div className="border-b border-border pb-6">
        <p className="text-sm font-semibold text-primary">OFFERING REPORT</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">헌금 현황 관리</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          매주 새 현황을 등록하면 기록이 주차별로 쌓입니다. 공개 메뉴에는 노출되지 않고, 전용 링크를 받은 분만 로그인 없이 볼 수 있습니다.
        </p>
      </div>

      <section className="mt-8 rounded-lg border border-border bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground">고정 배포 링크</p>
        <p className="mt-1 text-xs text-muted-foreground">항상 가장 최근 주차를 보여 줍니다. 한 번 공유하면 매주 다시 보낼 필요가 없습니다.</p>
        <div className="mt-3">
          {mainPath ? <LinkRow url={toUrl(mainPath)} path={mainPath} /> : <Input readOnly value="첫 현황을 저장하면 전용 링크가 생성됩니다." className="h-10" />}
        </div>
      </section>

      <form action={saveOfferingReport} className="mt-8 grid gap-4 rounded-lg border border-border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-foreground">이번 주 현황 등록</h2>
          <p className="mt-1 text-xs text-muted-foreground">지난주 내용을 불러와 두었습니다. 바뀐 부분만 고쳐 등록하면 새 주차로 저장되고, 지난 기록은 그대로 남습니다.</p>
        </div>
        <ReportFields title={`${kstDate(new Date(), { month: "long", day: "numeric" })} 헌금 현황`} content={latest?.content ?? ""} active />
        <SubmitButton className="w-fit" pendingLabel="등록 중...">
          <Plus className="size-4" /> 새 주차로 등록
        </SubmitButton>
      </form>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold text-foreground">주차별 기록</h2>
          <span className="text-xs text-muted-foreground">총 {reports.length}건</span>
        </div>
        {reports.length === 0 ? (
          <p className="rounded-lg border border-border bg-white py-12 text-center text-sm text-muted-foreground">등록된 헌금 현황이 없습니다.</p>
        ) : (
          <ol className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white">
            {reports.map((report, i) => {
              const path = `/offering/${report.accessToken}?week=${report.id}`
              return (
                <li key={report.id} className="p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-semibold text-foreground">
                      {report.title}
                      {i === 0 && <span className="ml-2 text-xs font-medium text-primary">최신 · 고정 링크에 표시 중</span>}
                      {!report.active && <span className="ml-2 text-xs font-medium text-muted-foreground">비공개</span>}
                    </h3>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {kstDate(new Date(report.createdAt), { dateStyle: "medium" })} 등록
                      {+report.updatedAt !== +report.createdAt && ` · ${kstDate(new Date(report.updatedAt), { dateStyle: "medium" })} 수정`}
                    </span>
                  </div>
                  <div className="mt-3">
                    <LinkRow url={toUrl(path)} path={path} />
                  </div>
                  <details className="mt-3 rounded-md border border-border bg-muted">
                    <summary className="cursor-pointer px-4 py-2.5 text-sm font-semibold text-foreground">이 주차 수정하기</summary>
                    <form action={saveOfferingReport} className="grid gap-4 border-t border-border p-4">
                      <input type="hidden" name="id" value={report.id} />
                      <ReportFields title={report.title} content={report.content} active={report.active} />
                      <SubmitButton size="sm" className="w-fit" pendingLabel="저장 중...">
                        <Save className="size-4" /> 저장하기
                      </SubmitButton>
                    </form>
                  </details>
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </>
  )
}
