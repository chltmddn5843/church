import Image from "next/image"
import { desc } from "drizzle-orm"
import { Eye, EyeOff } from "lucide-react"
import { deletePopup, togglePopup } from "@/app/actions/popups"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { PopupForm } from "@/components/admin/popup-form"
import { Button } from "@/components/ui/button"
import { getDb } from "@/lib/db"
import { popups } from "@/lib/db/schema"

export default async function AdminPopupsPage() {
  const items = await getDb().select().from(popups).orderBy(desc(popups.createdAt))

  return (
    <>
      <div className="border-b border-[#d7e5ee] pb-6">
        <p className="text-sm font-semibold text-[#2F5D8A]">POPUP MANAGEMENT</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#183247]">팝업 관리</h1>
        <p className="mt-2 text-sm text-[#526a7d]">홈 화면에 표시할 팝업 이미지, 연결 주소, 노출 상태를 관리합니다.</p>
      </div>

      <PopupForm />

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold text-[#183247]">등록된 팝업</h2>
          <span className="text-xs text-[#6d7f8c]">총 {items.length}개</span>
        </div>
        {items.length === 0 ? (
          <p className="rounded-lg border border-[#d7e5ee] bg-white py-12 text-center text-sm text-[#6d7f8c]">등록된 팝업이 없습니다.</p>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {items.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-lg border border-[#d7e5ee] bg-white shadow-sm">
                <div className="grid gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
                  <div className="relative min-h-[220px] bg-[#f8fbfd]">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-4" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#6d7f8c]">이미지 없음</div>
                    )}
                    <span className={`absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-medium ${item.active ? "bg-[#123A63] text-white" : "bg-[#526a7d] text-white"}`}>
                      {item.active ? "노출 중" : "숨김"}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="truncate text-lg font-semibold text-[#183247]">{item.title}</h3>
                      <p className="mt-1 text-xs text-[#6d7f8c]">크기 {item.width}px x {item.height}px</p>
                      {item.content && <p className="mt-2 line-clamp-2 text-sm text-[#526a7d]">{item.content}</p>}
                    </div>
                    <details className="rounded-lg border border-[#e5eef4] bg-[#fbfdfe]">
                      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[#183247]">수정하기</summary>
                      <div className="border-t border-[#e5eef4] p-4">
                        <PopupForm
                          popup={{
                            id: item.id,
                            title: item.title,
                            imageUrl: item.imageUrl,
                            linkUrl: item.linkUrl,
                            content: item.content,
                            width: item.width,
                            height: item.height,
                            active: item.active,
                          }}
                          compact
                        />
                      </div>
                    </details>
                    <div className="mt-4 flex gap-2 border-t border-[#e5eef4] pt-4">
                      <form action={togglePopup.bind(null, item.id, !item.active)} className="flex-1">
                        <Button type="submit" size="sm" variant="outline" className="w-full">
                          {item.active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          {item.active ? "숨기기" : "노출하기"}
                        </Button>
                      </form>
                      <form action={deletePopup.bind(null, item.id)}>
                        <ConfirmDeleteButton label="삭제" confirmMessage={`'${item.title}' 팝업을 삭제하시겠습니까?`} />
                      </form>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
