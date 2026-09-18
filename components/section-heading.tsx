export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "left"
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
      <span className={`mt-3 block h-[3px] w-10 rounded-full bg-[#C9A15A] ${align === "center" ? "mx-auto" : ""}`} />
      <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </div>
  )
}
