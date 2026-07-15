import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const links = [
  {
    title: "제자훈련",
    desc: "말씀으로 세워지는 제자의 삶, 체계적인 양육 과정에 참여하세요.",
    href: "/discipleship",
    image: "/images/discipleship.png",
  },
  {
    title: "다음세대",
    desc: "영유아부터 청년까지, 믿음의 다음세대를 함께 키워갑니다.",
    href: "/next-generation",
    image: "/images/next-generation.png",
  },
  {
    title: "교회소식",
    desc: "원당교회의 다양한 소식과 공지사항을 확인하세요.",
    href: "/community",
    image: "/images/gallery-2.png",
  },
]

export function QuickLinks() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group relative overflow-hidden rounded-2xl border border-border shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={link.image || "/placeholder.svg"}
                  alt={link.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                <h3 className="font-serif text-2xl font-bold">{link.title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-90">{link.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  자세히 보기
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
