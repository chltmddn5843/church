import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, ChevronLeft, ChevronRight, Church, History, Smartphone } from "lucide-react"
import { getActiveOfferingReportByToken, getActiveOfferingWeeks } from "@/lib/queries"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  return {
    title: "헌금 현황",
    description: "원당교회 주간 헌금 현황",
    manifest: `/offering/${token}/manifest.webmanifest`,
    robots: { index: false, follow: false, nocache: true },
    appleWebApp: { capable: true, title: "헌금 현황", statusBarStyle: "black-translucent" },
  }
}

function splitOfferingContent(content: string) {
  const sections: { title: string; lines: string[] }[] = []
  let current: { title: string; lines: string[] } | null = null

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue

    const looksLikeHeader = !/\d/.test(line) && line.length <= 24
    if (!current || looksLikeHeader) {
      current = { title: line, lines: [] }
      sections.push(current)
    } else {
      current.lines.push(line)
    }
  }

  return sections
}

export default async function OfferingReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ week?: string }>
}) {
  const { token } = await params
  const { week } = await searchParams
  const weekId = week === undefined ? undefined : Number(week)
  if (weekId !== undefined && (!Number.isSafeInteger(weekId) || weekId < 1)) notFound()
  const report = await getActiveOfferingReportByToken(token, weekId)
  if (!report) notFound()

  const sections = splitOfferingContent(report.content)
  const weeks = await getActiveOfferingWeeks(token)
  const index = weeks.findIndex((w) => w.id === report.id)
  const isLatest = index === 0
  // The newest week lives at the bare link, so the shared address never changes.
  const weekHref = (i: number) => (i === 0 ? `/offering/${token}` : `/offering/${token}?week=${weeks[i].id}`)
  const older = index + 1 < weeks.length ? index + 1 : null
  const newer = index > 0 ? index - 1 : null
  const navClass = "inline-flex h-10 items-center gap-1 rounded-lg border border-white/30 px-3 text-sm font-medium text-white transition hover:bg-white/10"

  return (
    <main className="min-h-screen bg-muted px-4 py-8 text-foreground md:py-14">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <header className="border-b border-accent/30 bg-primary px-5 py-6 text-white md:px-8">
          <div className="flex items-center gap-2 text-sm text-white/85">
            <Church className="size-4" />
            원당교회
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{report.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/80">
            <CalendarDays className="size-4" />
            {new Date(report.updatedAt).toLocaleDateString("ko-KR")} 업데이트
          </p>
          {weeks.length > 1 && (
            <nav aria-label="주차 이동" className="mt-5 flex gap-2">
              {older !== null && <Link href={weekHref(older)} className={navClass}><ChevronLeft className="size-4" />이전 주</Link>}
              {newer !== null && <Link href={weekHref(newer)} className={navClass}>다음 주<ChevronRight className="size-4" /></Link>}
            </nav>
          )}
        </header>

        <div className="grid gap-5 p-5 md:p-8">
          {isLatest ? (
            <aside className="flex items-start gap-3 rounded-xl border border-accent/60 bg-accent p-4 text-sm leading-6 text-foreground">
              <Smartphone className="mt-0.5 size-5 shrink-0" />
              <p><strong>휴대폰 홈 화면에 추가할 수 있습니다.</strong><br />브라우저의 공유 또는 메뉴에서 ‘홈 화면에 추가’를 선택하면 이 전용 링크로 바로 열립니다.</p>
            </aside>
          ) : (
            <aside className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted p-4 text-sm leading-6 text-foreground">
              <p className="flex items-center gap-2"><History className="size-5 shrink-0" />지난 주차 기록입니다.</p>
              <Link href={weekHref(0)} className="font-semibold text-primary hover:underline">최신 현황 보기 →</Link>
            </aside>
          )}
          {sections.length > 0 ? (
            sections.map((section) => (
              <section key={section.title} className="rounded-xl border border-border bg-background">
                <h2 className="border-b border-border px-4 py-3 text-base font-bold text-primary md:text-lg">
                  {section.title}
                </h2>
                <div className="grid gap-2 px-4 py-4">
                  {section.lines.length > 0 ? (
                    section.lines.map((line, index) => (
                      <p key={`${section.title}-${index}`} className="break-keep rounded-lg bg-white px-3 py-2 text-sm leading-7 md:text-base">
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">등록된 항목이 없습니다.</p>
                  )}
                </div>
              </section>
            ))
          ) : (
            <pre className="whitespace-pre-wrap rounded-xl bg-muted p-5 text-sm leading-7">{report.content}</pre>
          )}
          {weeks.length > 1 && (
            <section aria-labelledby="weeks-heading" className="mt-4 border-t border-border pt-6">
              <h2 id="weeks-heading" className="flex items-center gap-2 text-base font-bold text-foreground md:text-lg">
                <History className="size-5 text-primary" />
                주차별 헌금 현황
              </h2>
              <ol className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border">
                {weeks.map((w, i) => (
                  <li key={w.id}>
                    <Link
                      href={weekHref(i)}
                      aria-current={i === index ? "page" : undefined}
                      className={`flex items-center justify-between gap-4 px-4 py-3 text-sm transition md:text-base ${i === index ? "bg-primary font-semibold text-white" : "bg-white hover:bg-muted"}`}
                    >
                      <span className="min-w-0 truncate">{w.title}{i === 0 && " (최신)"}</span>
                      <span className={`shrink-0 text-xs tabular-nums ${i === index ? "text-white/80" : "text-muted-foreground"}`}>
                        {new Date(w.createdAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </article>
    </main>
  )
}
