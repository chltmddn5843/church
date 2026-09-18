import Image from "next/image"

export function PageBanner({
  title,
  subtitle,
  image = "/images/cross-light.png",
}: {
  title: string
  subtitle?: string
  image?: string
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image src={image || "/placeholder.svg"} alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-primary/75 to-ring/70" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-20 text-center text-primary-foreground md:py-28">
        <h1 className="font-serif text-3xl font-bold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-pretty opacity-90">{subtitle}</p>}
      </div>
    </section>
  )
}
