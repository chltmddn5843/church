import Image from "next/image"
import { desc } from "drizzle-orm"
import { Eye, EyeOff, Trash2 } from "lucide-react"
import { deletePopup, togglePopup } from "@/app/actions/popups"
import { PopupForm } from "@/components/admin/popup-form"
import { Button } from "@/components/ui/button"
import { getDb } from "@/lib/db"
import { popups } from "@/lib/db/schema"

export default async function AdminPopupsPage() {
  const items = await getDb().select().from(popups).orderBy(desc(popups.createdAt))

  return (
    <>
      <div className="border-b border-[#dedede] pb-7">
        <p className="text-sm font-medium text-[#39715d]">POPUP MANAGEMENT</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">팝업 관리</h1>
        <p className="mt-2 text-sm text-[#777]">홈페이지에 표시할 팝업 이미지와 크기, 노출 상태를 관리합니다.</p>
      </div>

      <PopupForm />

      <section className="mt-14">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold">등록된 팝업</h2>
          <span className="text-xs text-[#999]">총 {items.length}개</span>
        </div>
        {items.length === 0 ? (
          <p className="border-y py-12 text-center text-sm text-[#999]">등록된 팝업이 없습니다.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="overflow-hidden border border-[#dedede] bg-white">
                <div className="relative aspect-[4/3] bg-[#f3f3f3]">
                  {item.imageUrl ? <Image src={item.imageUrl} alt={item.title} fill className="object-contain" /> : <div className="flex h-full items-center justify-center text-sm text-[#aaa]">이미지 없음</div>}
                  <span className={`absolute left-3 top-3 px-2 py-1 text-xs font-medium ${item.active ? "bg-[#39715d] text-white" : "bg-[#555] text-white"}`}>{item.active ? "노출 중" : "숨김"}</span>
                </div>
                <div className="p-4">
                  <h3 className="truncate font-semibold">{item.title}</h3>
                  <p className="mt-1 text-xs text-[#777]">크기 {item.width}px × {item.height}px</p>
                  {item.content && <p className="mt-1 line-clamp-2 text-sm text-[#777]">{item.content}</p>}
                  <div className="mt-4 flex gap-2 border-t pt-4">
                    <form action={togglePopup.bind(null, item.id, !item.active)} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        {item.active ? <EyeOff /> : <Eye />}
                        {item.active ? "숨기기" : "노출하기"}
                      </Button>
                    </form>
                    <form action={deletePopup.bind(null, item.id)}>
                      <Button size="sm" variant="destructive" aria-label={`${item.title} 삭제`}><Trash2 /></Button>
                    </form>
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
