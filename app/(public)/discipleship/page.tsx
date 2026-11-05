import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, GraduationCap, Sprout, Users } from "lucide-react"
import { PageBanner } from "@/components/page-banner"
import { SectionHeading } from "@/components/section-heading"
import { getGalleryAlbums, getPostThumbnails, getPosts, getSiteContent } from "@/lib/queries"
import { applyCourses } from "@/lib/site-content"
import { getSessionUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "제자훈련",
  description: "말씀 위에 세워지는 원당교회 제자훈련 과정과 전체 수료자 사진을 안내합니다.",
}

const courseIcons = [Sprout, BookOpen, Users, GraduationCap]

export default async function DiscipleshipPage() {
  // 새가족반 posts are members-only; getPosts already hides them from guests.
  const [albums, newFamily, user, c] = await Promise.all([getGalleryAlbums(undefined, undefined, "전체 수료자"), getPosts("새가족반"), getSessionUser(), getSiteContent()])
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
        subtitle={c["discipleship.banner.subtitle"]}
        image={c["discipleship.banner.image"]}
      />

      <section id="intro" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center lg:max-w-[1360px] lg:px-6">
          <div className="relative aspect-[4/3] overflow-hidden shadow-lg">
            <Image src={c["discipleship.intro.image"]} alt="제자훈련 사진" fill className="object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="Discipleship" title={c["discipleship.intro.title"]} />
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              {c["discipleship.intro.body"].split(/\n{2,}/).map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line break-keep">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="scroll-mt-24 bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <SectionHeading eyebrow="Courses" title={c["discipleship.courses.title"]} description={c["discipleship.courses.description"]} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {applyCourses(c).map((course, i) => {
              const Icon = courseIcons[i]
              return (
              <div key={course.title} className="flex flex-col border border-border bg-card p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {course.step}
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-foreground">{course.title}</h3>
                <p className="text-sm font-medium text-primary">{course.period}</p>
                <p className="mt-3 leading-relaxed text-muted-foreground">{course.desc}</p>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="graduates" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <SectionHeading eyebrow="Graduates" title={c["discipleship.graduates.title"]} description={c["discipleship.graduates.description"]} />
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
