"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

type GalleryItem = {
  id: number
  title: string
  imageUrl: string
  description: string | null
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  if (items.length === 0) {
    return <p className="py-16 text-center text-muted-foreground">등록된 사진이 없습니다.</p>
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border"
          >
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-left text-sm font-medium text-primary-foreground">{item.title}</span>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {selected && (
            <>
              <DialogTitle className="sr-only">{selected.title}</DialogTitle>
              <div className="relative aspect-video w-full">
                <Image src={selected.imageUrl || "/placeholder.svg"} alt={selected.title} fill className="object-contain" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-foreground">{selected.title}</h3>
                {selected.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
