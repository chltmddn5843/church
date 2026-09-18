import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [...new Set([1, total, current - 2, current - 1, current, current + 1, current + 2])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)
  const result: (number | "…")[] = []
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) result.push("…")
    result.push(p)
  })
  return result
}

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number
  totalPages: number
  hrefFor: (page: number) => string
}) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="페이지" className="mt-8 flex items-center justify-center gap-1">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground",
          page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-secondary hover:text-foreground",
        )}
      >
        <ChevronLeft className="size-4" />
      </Link>
      {pageList(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">…</span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold",
              p === page ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
            )}
          >
            {p}
          </Link>
        ),
      )}
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground",
          page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-secondary hover:text-foreground",
        )}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  )
}
