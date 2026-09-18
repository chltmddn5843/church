import Link from "next/link"
import { ArrowRight, BookOpen, Users, Newspaper, Image as ImageIcon, HandCoins, type LucideIcon } from "lucide-react"

const links: { title: string; desc: string; href: string; icon: LucideIcon }[] = [
  {
    title: "제자훈련",
    desc: "말씀으로 세워지는 제자의 삶, 체계적인 양육 과정에 참여하세요.",
    href: "/discipleship",
    icon: BookOpen,
  },
  {
    title: "다음세대",
    desc: "영유아부터 청년까지, 믿음의 다음세대를 함께 키워갑니다.",
    href: "/next-generation",
    icon: Users,
  },
  {
    title: "교회소식",
    desc: "원당교회의 다양한 소식과 공지사항을 확인하세요.",
    href: "/community",
    icon: Newspaper,
  },
  {
    title: "갤러리",
    desc: "원당교회의 예배와 공동체 이야기를 사진으로 만나보세요.",
    href: "/gallery",
    icon: ImageIcon,
  },
  {
    title: "스마트 헌금",
    desc: "일반 헌금, 건축헌금과 식권을 온라인으로 편리하게 이용하세요.",
    href: "/offering",
    icon: HandCoins,
  },
]

export function QuickLinks() {
  return (
    <section className="bg-gradient-to-br from-[#0B1D39] via-[#123A63] to-[#2F5D8A] py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-5">
        {links.map(({ title, desc, href, icon: Icon }) => (
          <Link
            key={title}
            href={href}
            className="group flex min-h-64 flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/95 px-6 py-8 text-center text-foreground shadow-lg shadow-black/20 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl active:scale-[0.98]"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-[#C9A15A]/15 text-[#9a7527] transition-colors group-hover:bg-[#C9A15A]/25">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-5 font-serif text-xl font-bold md:text-2xl">{title}</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{desc}</p>
            <span className="mt-6 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-muted px-4 py-2 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              자세히 보기
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
