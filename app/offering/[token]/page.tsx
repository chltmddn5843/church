import { notFound } from "next/navigation"
import { CalendarDays, Church } from "lucide-react"
import { getActiveOfferingReportByToken } from "@/lib/queries"

export const dynamic = "force-dynamic"

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
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const report = await getActiveOfferingReportByToken(token)
  if (!report) notFound()

  const sections = splitOfferingContent(report.content)

  return (
    <main className="min-h-screen bg-[#f6fbff] px-4 py-8 text-[#183247] md:py-14">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#cfe6f4] bg-white shadow-sm">
        <header className="border-b border-[#cfe6f4] bg-[#2f8fc6] px-5 py-6 text-white md:px-8">
          <div className="flex items-center gap-2 text-sm text-white/85">
            <Church className="size-4" />
            원당교회
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">{report.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/80">
            <CalendarDays className="size-4" />
            {new Date(report.updatedAt).toLocaleDateString("ko-KR")} 업데이트
          </p>
        </header>

        <div className="grid gap-5 p-5 md:p-8">
          {sections.length > 0 ? (
            sections.map((section) => (
              <section key={section.title} className="rounded-xl border border-[#cfe6f4] bg-[#f8fcff]">
                <h2 className="border-b border-[#cfe6f4] px-4 py-3 text-base font-bold text-[#176b9f] md:text-lg">
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
                    <p className="text-sm text-[#5b7180]">등록된 항목이 없습니다.</p>
                  )}
                </div>
              </section>
            ))
          ) : (
            <pre className="whitespace-pre-wrap rounded-xl bg-[#f8fcff] p-5 text-sm leading-7">{report.content}</pre>
          )}
        </div>
      </article>
    </main>
  )
}
