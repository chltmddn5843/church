import Image from "next/image"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { contentPages } from "@/lib/db/schema"
import { canAccess, getViewerAccess } from "@/lib/access"

export const dynamic = "force-dynamic"

export default async function LegacyContentPage({ params }: { params: Promise<{ id: string }> }) {
  const legacyId = Number((await params).id)
  if (!Number.isSafeInteger(legacyId) || legacyId < 1) notFound()
  const page = await getDb().select().from(contentPages).where(eq(contentPages.legacyId, legacyId)).get()
  if (!page?.published || !canAccess(page.visibility, await getViewerAccess())) notFound()
  return <article className="py-16"><div className="mx-auto max-w-4xl px-4"><p className="text-sm font-semibold uppercase tracking-[.25em] text-primary">Wondang Church</p><h1 className="mt-3 font-serif text-4xl font-bold">{page.title}</h1><div className="mt-5 h-1 w-16 rounded-full bg-accent"/>{page.imageUrl && <div className="relative mt-10 aspect-[16/7] overflow-hidden rounded-3xl"><Image src={page.imageUrl} alt={page.title} fill className="object-cover"/></div>}<div className="mt-10 whitespace-pre-line text-lg leading-9 text-muted-foreground">{page.content}</div></div></article>
}
