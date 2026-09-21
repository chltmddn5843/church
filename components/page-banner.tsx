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
      <div className="absolute inset-x-0 bottom-0 leading-none">
        <svg viewBox="0 0 1440 74" preserveAspectRatio="none" className="h-10 w-full md:h-16" aria-hidden="true">
          <path
            d="M0,32L80,37.3C160,43,320,53,480,50.7C640,48,800,32,960,26.7C1120,21,1280,27,1360,29.3L1440,32L1440,74L1360,74C1280,74,1120,74,960,74C800,74,640,74,480,74C320,74,160,74,80,74L0,74Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
