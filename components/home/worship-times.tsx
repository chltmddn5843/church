import { church } from "@/lib/church"
import { Clock, MapPin } from "lucide-react"

export function WorshipTimes() {
  return (
    <section id="worship" className="scroll-mt-24 bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Worship</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">예배 안내</h2>
          <p className="mt-3 text-muted-foreground">함께 드리는 예배로 하나님께 나아갑니다.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {church.worship.map((w) => (
            <div
              key={w.name}
              className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="font-serif text-lg font-bold text-foreground">{w.name}</h3>
              <div className="mt-3 flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{w.time}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{w.place}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
