import { createGalleryItem, deleteGalleryItem } from "@/app/actions/gallery"
import { getGallery } from "@/lib/queries"
import { Button } from "@/components/ui/button"

export default async function AdminGalleryPage() {
  const items = await getGallery()
  return <><h1 className="text-3xl font-bold">갤러리 관리</h1><form action={createGalleryItem} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6"><input name="title" required placeholder="사진 제목" className="h-11 rounded-lg border px-3"/><input name="imageUrl" required placeholder="/images/gallery-1.png 또는 이미지 URL" className="h-11 rounded-lg border px-3"/><textarea name="description" rows={3} placeholder="설명" className="rounded-lg border p-3"/><Button className="w-fit">사진 등록</Button></form><div className="mt-8 grid gap-3 sm:grid-cols-2">{items.map(item=><div key={item.id} className="flex items-center justify-between rounded-xl border bg-card p-4"><div><p className="font-semibold">{item.title}</p><p className="max-w-64 truncate text-sm text-muted-foreground">{item.imageUrl}</p></div><form action={deleteGalleryItem.bind(null,item.id)}><Button size="sm" variant="destructive">삭제</Button></form></div>)}</div></>
}
