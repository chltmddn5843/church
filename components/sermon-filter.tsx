import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = ["전체", "주일예배", "금요예배", "찬양대", "특별예배"]

export function SermonFilter({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((cat) => {
        const isActive = (cat === "전체" && !active) || cat === active
        const href = cat === "전체" ? "/sermons" : `/sermons?category=${encodeURIComponent(cat)}`
        return (
          <Link
            key={cat}
            href={href}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
            )}
          >
            {cat}
          </Link>
        )
      })}
    </div>
  )
}
