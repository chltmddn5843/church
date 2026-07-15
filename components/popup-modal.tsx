"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

type Popup = {
  id: number
  title: string
  imageUrl: string | null
  linkUrl: string | null
  content: string | null
}

export function PopupModal({ popups }: { popups: Popup[] }) {
  const [visible, setVisible] = useState<Popup[]>([])

  useEffect(() => {
    const dismissed = popups.filter((p) => {
      const until = localStorage.getItem(`popup-${p.id}`)
      return !until || Number(until) < Date.now()
    })
    setVisible(dismissed)
  }, [popups])

  if (visible.length === 0) return null

  function close(id: number) {
    setVisible((prev) => prev.filter((p) => p.id !== id))
  }

  function hideForDay(id: number) {
    localStorage.setItem(`popup-${id}`, String(Date.now() + 24 * 60 * 60 * 1000))
    close(id)
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex flex-wrap items-start justify-center gap-4 p-4 pt-20 md:justify-start md:pl-8">
      {visible.map((p) => (
        <div
          key={p.id}
          className="pointer-events-auto w-72 overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        >
          <div className="flex items-center justify-between bg-primary px-4 py-2 text-primary-foreground">
            <span className="line-clamp-1 text-sm font-semibold">{p.title}</span>
            <button onClick={() => close(p.id)} aria-label="팝업 닫기" className="rounded p-1 hover:bg-primary-foreground/20">
              <X className="h-4 w-4" />
            </button>
          </div>
          {p.imageUrl &&
            (p.linkUrl ? (
              <Link href={p.linkUrl}>
                <div className="relative aspect-[4/3] w-full">
                  <Image src={p.imageUrl || "/placeholder.svg"} alt={p.title} fill className="object-cover" />
                </div>
              </Link>
            ) : (
              <div className="relative aspect-[4/3] w-full">
                <Image src={p.imageUrl || "/placeholder.svg"} alt={p.title} fill className="object-cover" />
              </div>
            ))}
          {p.content && <p className="px-4 py-3 text-sm leading-relaxed text-card-foreground">{p.content}</p>}
          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
            <button onClick={() => hideForDay(p.id)} className="hover:text-foreground">
              오늘 하루 보지 않기
            </button>
            <button onClick={() => close(p.id)} className="hover:text-foreground">
              닫기
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
