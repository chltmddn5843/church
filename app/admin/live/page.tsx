import { saveLiveStream } from "@/app/actions/live-stream"
import { Button } from "@/components/ui/button"
import { getDb } from "@/lib/db"
import { liveStream } from "@/lib/db/schema"

export default async function AdminLivePage() {
  const current = await getDb().select().from(liveStream).limit(1).get()
  return <><h1 className="text-3xl font-bold">생방송 관리</h1><p className="mt-2 text-muted-foreground">YouTube 생방송 또는 예약 영상 URL을 저장하면 메인 페이지에 표시됩니다.</p><form action={saveLiveStream} className="mt-8 grid gap-4 border bg-card p-6"><label className="grid gap-2 font-medium">YouTube URL<input name="url" type="url" required defaultValue={current ? `https://www.youtube.com/watch?v=${current.youtubeId}` : ""} placeholder="https://www.youtube.com/watch?v=..." className="h-12 border bg-background px-4 font-normal"/></label><Button className="w-fit">메인 생방송 저장</Button></form>{current && <div className="mt-8 aspect-video overflow-hidden rounded-xl bg-black"><iframe src={`https://www.youtube.com/embed/${current.youtubeId}`} title="현재 생방송 미리보기" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full"/></div>}</>
}
