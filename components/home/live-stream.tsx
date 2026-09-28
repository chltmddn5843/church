import Link from "next/link"
import { Play as Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoFacade } from "@/components/home/video-facade"
import { getDb } from "@/lib/db"
import { liveStream } from "@/lib/db/schema"

export async function LiveStream() {
  const current = await getDb().select().from(liveStream).limit(1).get()
  if (!current) return null
  return <section className="bg-white py-20 text-foreground md:py-28"><div className="scroll-reveal mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-widest text-primary">Live Worship</p><h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">원당교회 생방송</h2></div><Button render={<Link href="https://www.youtube.com/@wondang1964" target="_blank" rel="noopener noreferrer"/>} nativeButton={false} className="bg-primary text-primary-foreground hover:bg-primary/90"><Youtube/> YouTube 채널</Button></div><div className="aspect-video overflow-hidden bg-black shadow-2xl"><VideoFacade youtubeId={current.youtubeId} title="원당교회 생방송"><span className="font-serif text-2xl font-bold text-white md:text-3xl">원당교회 생방송</span></VideoFacade></div></div></section>
}
