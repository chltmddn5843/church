import Link from "next/link"
import { asc } from "drizzle-orm"
import { ChevronDown, ExternalLink, Pencil, Plus, Save } from "lucide-react"
import { createHistoryEvent, deleteHistoryEvent, updateHistoryEvent } from "@/app/actions/history"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { SubmitButton } from "@/components/admin/submit-button"
import { getDb } from "@/lib/db"
import { historyEvents } from "@/lib/db/schema"
import { groupHistory, parseHistoryDate } from "@/lib/history"

const inputClass =
  "h-11 w-full rounded-md border border-border bg-white px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"

function HistoryFields({ date = "", event = "" }: { date?: string; event?: string }) {
  const { year, month, day } = parseHistoryDate(date)
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">날짜</legend>
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2">
          <label className="grid gap-1 text-xs text-muted-foreground">
            연도
            <input name="year" required inputMode="numeric" pattern="\d{4}" maxLength={4} defaultValue={year} placeholder="2026" className={inputClass} />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            월
            <input name="month" required type="number" min={1} max={12} defaultValue={month ? +month : ""} placeholder="9" className={inputClass} />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            일 (선택)
            <input name="day" type="number" min={1} max={31} defaultValue={day ? +day : ""} placeholder="6" className={inputClass} />
          </label>
        </div>
      </fieldset>
      <label className="grid gap-2 text-sm font-medium text-foreground">
        내용
        <textarea
          name="event"
          required
          maxLength={500}
          rows={3}
          defaultValue={event}
          placeholder="예) 1부 8시, 2부 10시, 3부 12시 예배를 드리다."
          className="min-h-[76px] w-full rounded-md border border-border bg-white px-3 py-2.5 font-normal leading-relaxed outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
        />
      </label>
    </div>
  )
}

export default async function AdminHistoryPage() {
  const items = await getDb().select().from(historyEvents).orderBy(asc(historyEvents.date), asc(historyEvents.id))
  const groups = groupHistory(items)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-sm font-semibold text-primary">HISTORY MANAGEMENT</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">교회발자취 관리</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            교회소개 페이지의 &lsquo;교회발자취&rsquo;를 관리합니다. 저장하면 홈페이지에 바로 반영되고, 날짜순으로 자동 정렬됩니다.
          </p>
        </div>
        <Link href="/about#history" target="_blank" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          홈페이지에서 보기 <ExternalLink className="size-4" />
        </Link>
      </div>

      <form action={createHistoryEvent} className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-foreground">새 발자취 등록</h2>
        <HistoryFields />
        <div className="mt-5 flex justify-end">
          <SubmitButton pendingLabel="등록 중...">
            <Plus className="size-4" /> 등록하기
          </SubmitButton>
        </div>
      </form>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold text-foreground">등록된 발자취</h2>
          <span className="text-xs text-muted-foreground">총 {items.length}건</span>
        </div>
        {groups.length === 0 ? (
          <p className="rounded-lg border border-border bg-white py-12 text-center text-sm text-muted-foreground">등록된 발자취가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {groups.toReversed().map((group, i) => (
              <details key={group.label} open={i === 0} className="group/decade overflow-hidden rounded-lg border border-border bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-muted px-5 py-4">
                  <span className="font-semibold text-foreground">{group.label}</span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    {group.items.length}건
                    <ChevronDown className="size-4 transition-transform group-open/decade:rotate-180" />
                  </span>
                </summary>
                <ol className="divide-y divide-border">
                  {group.items.toReversed().map((item) => (
                    <li key={item.id} className="px-5 py-4">
                      <details className="group/row">
                        <summary className="flex cursor-pointer list-none flex-wrap items-start gap-x-4 gap-y-2 sm:flex-nowrap">
                          <span className="w-28 shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-primary">{item.date}</span>
                          <span className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">{item.event}</span>
                          <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition group-open/row:border-primary group-open/row:text-primary">
                            <Pencil className="size-3.5" /> <span className="group-open/row:hidden">수정</span><span className="hidden group-open/row:inline">닫기</span>
                          </span>
                        </summary>
                        <div className="mt-4 rounded-md border border-border bg-muted p-4">
                          <form action={updateHistoryEvent.bind(null, item.id)}>
                            <HistoryFields date={item.date} event={item.event} />
                            <div className="mt-4 flex justify-end">
                              <SubmitButton size="sm" pendingLabel="저장 중...">
                                <Save className="size-4" /> 저장하기
                              </SubmitButton>
                            </div>
                          </form>
                          <form action={deleteHistoryEvent.bind(null, item.id)} className="mt-3 flex justify-end border-t border-border pt-3">
                            <ConfirmDeleteButton label="이 발자취 삭제" confirmMessage={`'${item.date}' 발자취를 삭제하시겠습니까?`} />
                          </form>
                        </div>
                      </details>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
