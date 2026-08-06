import Link from "next/link"
import { Play as Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDb } from "@/lib/db"
import { liveStream } from "@/lib/db/schema"

export async function LiveStream() {
  const current = await getDb().select().from(liveStream).limit(1).get()
  if (!current) return null
  return <section className="bg-primary py-16 text-primary-foreground md:py-20"><div className="mx-auto max-w-6xl px-4"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-widest text-white/75">Live Worship</p><h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">원당교회 생방송</h2><p className="mt-3 text-white/85">온라인으로 함께 예배드립니다.</p></div><Button render={<Link href="https://www.youtube.com/@wondang1964" target="_blank"/>} nativeButton={false} className="bg-white text-primary hover:bg-white/90"><Youtube/> YouTube 채널</Button></div><div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl"><iframe src={`https://www.youtube.com/embed/${current.youtubeId}`} title="원당교회 생방송" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full"/></div></div></section>
}
