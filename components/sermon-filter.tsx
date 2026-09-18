import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = ["전체", "주일예배", "금요예배", "새벽예배", "쉐키나찬양단", "할렐루야찬양대"]

export function SermonFilter({ active }: { active?: string }) {
  return (
    <nav className="overflow-x-auto rounded-[1.5rem] border border-border bg-card p-2 shadow-sm" aria-label="말씀과 찬양 게시판">
      <div className="flex min-w-max gap-2">
        {categories.map((cat) => {
          const isActive = (cat === "전체" && !active) || cat === active
          const href = cat === "전체" ? "/sermons" : `/sermons?category=${encodeURIComponent(cat)}`

          return (
            <Link
              key={cat}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-12 items-center justify-center rounded-2xl px-6 text-center text-base font-semibold transition-all active:scale-[0.98] active:bg-white/40",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-white/40 text-foreground hover:bg-secondary hover:text-primary",
              )}
            >
              {cat}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
