import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, GraduationCap, Sprout, Users } from "lucide-react"
import { PageBanner } from "@/components/page-banner"
import { SectionHeading } from "@/components/section-heading"
import { getGalleryAlbums, getPostThumbnails, getPosts } from "@/lib/queries"
import { getSessionUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "제자훈련",
  description: "말씀 위에 세워지는 원당교회 제자훈련 과정과 전체 수료자 사진을 안내합니다.",
}

const courses = [
  {
    icon: Sprout,
    step: "STEP 1",
    title: "새가족반",
    period: "4주 과정",
    desc: "교회에 처음 오신 분들을 위한 신앙의 기초와 교회 생활 안내 과정입니다.",
  },
  {
    icon: BookOpen,
    step: "STEP 2",
    title: "양육반",
    period: "10주 과정",
    desc: "성경의 흐름과 핵심 진리를 체계적으로 배우며 신앙의 뿌리를 세웁니다.",
  },
  {
    icon: Users,
    step: "STEP 3",
    title: "제자반",
    period: "27주 과정",
    desc: "예수님의 제자로 살아가기 위한 말씀 훈련과 삶의 변화를 배워갑니다.",
  },
  {
    icon: GraduationCap,
    step: "STEP 4",
    title: "사역반",
    period: "26주 과정",
    desc: "훈련된 제자를 사역자로 세우는 리더십과 봉사 실천 과정입니다.",
  },
]

export default async function DiscipleshipPage() {
  // 새가족반 posts are members-only; getPosts already hides them from guests.
  const [albums, newFamily, user] = await Promise.all([getGalleryAlbums(undefined, undefined, "전체 수료자"), getPosts("새가족반"), getSessionUser()])
  const thumbnails = await getPostThumbnails(newFamily.map((post) => post.id))
  // 새가족반 posts and 전체 수료자 albums share one newest-first list.
  const graduates = [
    ...newFamily.map((post) => ({ key: `post-${post.id}`, href: `/community/${post.id}`, title: post.title, cover: thumbnails.get(post.id), createdAt: post.createdAt })),
    ...albums.map((album) => ({ key: `album-${album.id}`, href: `/gallery/${album.id}`, title: album.title, cover: album.coverUrl, createdAt: album.createdAt })),
  ].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

  return (
    <>
      <PageBanner
        title="제자훈련"
        subtitle="배워서 남 주는 제자, 예수님을 닮아가는 훈련"
        image="/images/discipleship/newfamily-sanctuary.jpg"
      />

      <section id="intro" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center lg:max-w-[1360px] lg:px-6">
          <div className="relative aspect-[4/3] overflow-hidden shadow-lg">
            <Image src="/images/discipleship/newfamily-graduation.jpg" alt="새가족반 수료식 단체 사진" fill className="object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="Discipleship" title="제자훈련 안내" />
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                원당교회 제자훈련은 한 사람이 예수 그리스도의 온전한 제자로 세워지는 것을 목표로 합니다.
                말씀과 기도, 그리고 공동체 훈련을 통해 신앙이 삶으로 이어지도록 돕습니다.
              </p>
              <p>
                단계별 양육 과정을 통해 신앙의 기초부터 사역자로 성장하는 여정을 함께 걸어갑니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="scroll-mt-24 bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <SectionHeading eyebrow="Courses" title="훈련 과정" description="단계별로 성장하는 양육 시스템" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <div key={course.title} className="flex flex-col border border-border bg-card p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground">
                  <course.icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {course.step}
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-foreground">{course.title}</h3>
                <p className="text-sm font-medium text-primary">{course.period}</p>
                <p className="mt-3 leading-relaxed text-muted-foreground">{course.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="graduates" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <SectionHeading eyebrow="Graduates" title="전체 수료자 사진" description="새가족반, 양육반, 제자반, 사역반 수료 사진을 통합해 볼 수 있습니다." />
          {newFamily.length === 0 && (
            <p className="mt-6 text-sm text-muted-foreground">
              {user ? (
                "새가족반 수료 사진은 승인된 회원에게만 공개돼요."
              ) : (
                <>
                  새가족반 수료 사진은 회원에게만 공개돼요.{" "}
                  <Link href="/sign-in" className="inline-flex min-h-6 items-center font-semibold text-primary hover:underline">
                    로그인하고 보기
                  </Link>
                </>
              )}
            </p>
          )}
          {graduates.length === 0 ? (
            <p className="mt-10 border-y border-border py-16 text-center text-muted-foreground">등록된 사진이 없습니다.</p>
          ) : (
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {graduates.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    <span className="relative block aspect-[4/3] overflow-hidden bg-muted">
                      {item.cover && (
                        // eslint-disable-next-line @next/next/no-img-element -- R2 file of unknown size, images are unoptimized anyway
                        <img src={item.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
                      )}
                    </span>
                    <span className="mt-3 line-clamp-2 break-keep font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">{item.title}</span>
                    <time dateTime={new Date(item.createdAt).toISOString()} className="mt-1 block text-sm tabular-nums text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
