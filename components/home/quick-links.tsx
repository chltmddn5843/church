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
  {
    title: "갤러리",
    desc: "원당교회의 예배와 공동체 이야기를 사진으로 만나보세요.",
    href: "/gallery",
    image: "/images/gallery-1.png",
  },
]

export function QuickLinks() {
  return (
    <section>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group relative min-h-[360px] overflow-hidden bg-black md:min-h-[480px]"
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={link.image || "/placeholder.svg"}
                  alt={link.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/65" />
              </div>
              <div className="relative flex min-h-[360px] flex-col items-center justify-center px-8 text-center text-white md:min-h-[480px]">
                <h3 className="font-serif text-3xl font-bold md:text-4xl">{link.title}</h3>
                <span className="my-6 h-px w-12 bg-white/80" />
                <p className="max-w-xs text-base leading-relaxed text-white/90">{link.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-base font-medium text-white">
                  자세히 보기
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
      </div>
    </section>
  )
}
