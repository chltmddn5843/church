// Same heading as the home sections: blue eyebrow + title, left-aligned by default.
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "left"
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
      <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
      {description && <p className="mt-3 break-keep text-muted-foreground">{description}</p>}
    </div>
  )
}
