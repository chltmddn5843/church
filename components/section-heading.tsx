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
      <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </div>
  )
}
