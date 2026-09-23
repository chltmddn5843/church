import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Eye, ExternalLink, User, ChevronRight, Home, List, LayoutGrid, ImageIcon } from "lucide-react"
import { createPost } from "@/app/actions/posts"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import { cn } from "@/lib/utils"
import { getPosts, getPostsCount, getPostThumbnails } from "@/lib/queries"
import { getSessionUser } from "@/lib/session"

const PAGE_SIZE = 15

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "원당교회의 공지사항, 교회소식, 새가족소개와 봉사 섬김이 신청을 확인하세요.",
}

const categories = ["전체", "공지사항", "교회소식", "주보", "새가족소개", "가정예배순서지", "봉사 섬김이", "자료실"]
const serviceFormUrl = "https://forms.gle/AmDQV5ukLCm3x5gV6"

function externalUrl(content: string) {
  const match = content.trim().match(/https?:\/\/[^\s]+|forms\.gle\/[^\s]+/)
  if (!match) return null
  return match[0].startsWith("http") ? match[0] : `https://${match[0]}`
}

function excerpt(content: string, max = 70) {
  const clean = content.replace(/\s+/g, " ").trim()
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

const NEW_WINDOW_MS = 3 * 24 * 60 * 60 * 1000
function isNewPost(createdAt: Date) {
  return Date.now() - new Date(createdAt).getTime() < NEW_WINDOW_MS
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; q?: string; field?: string; view?: string }>
}) {
  const { category, page: pageParam, q: qParam, field: fieldParam, view: viewParam } = await searchParams
  const selected = category && categories.includes(category) ? category : undefined
  const field: "title" | "author" = fieldParam === "author" ? "author" : "title"
  const q = (qParam ?? "").trim()
  const search = q ? { field, q } : undefined
  const view = viewParam === "gallery" ? "gallery" : "list"
  const page = Math.max(1, Number(pageParam) || 1)
  const [posts, total] = await Promise.all([
    getPosts(selected, PAGE_SIZE, (page - 1) * PAGE_SIZE, search),
    getPostsCount(selected, search),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const user = await getSessionUser()
  const thumbnails = view === "gallery" ? await getPostThumbnails(posts.map((p) => p.id)) : new Map<number, string>()
  const newCount = posts.filter((p) => isNewPost(p.createdAt)).length
  const numberedPosts = posts.map((post, i) => ({ ...post, num: total - ((page - 1) * PAGE_SIZE + i) }))
  const visiblePosts =
    selected === "봉사 섬김이" && page === 1
      ? [
          {
            id: -1,
            title: "봉사 섬김이 신청서",
            content: serviceFormUrl,
            category: "봉사 섬김이",
            authorName: "관리자",
            pinned: true,
            views: 0,
            createdAt: new Date(),
            num: null as number | null,
          },
          ...numberedPosts,
        ]
      : numberedPosts
  const writeHref = `/admin/posts${selected ? `?category=${encodeURIComponent(selected)}` : ""}`

  function baseParams() {
    const params = new URLSearchParams()
    if (selected) params.set("category", selected)
    if (q) {
      params.set("q", q)
      if (field !== "title") params.set("field", field)
    }
    return params
  }
  function pageHref(p: number) {
    const params = baseParams()
    if (view !== "list") params.set("view", view)
    if (p > 1) params.set("page", String(p))
    const qs = params.toString()
    return qs ? `/community?${qs}` : "/community"
  }
  function viewHref(v: string) {
    const params = baseParams()
    if (v !== "list") params.set("view", v)
    const qs = params.toString()
    return qs ? `/community?${qs}` : "/community"
  }

  return (
    <>
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <nav aria-label="이동 경로" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="flex items-center hover:text-primary">
              <Home className="size-4" />
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
            <Link href="/community" className="hover:text-primary">커뮤니티</Link>
            <ChevronRight className="size-3.5 shrink-0" />
            <span className="font-medium text-foreground">{selected ?? "전체"}</span>
          </nav>

          <div className="md:flex md:items-start md:gap-8">
            {/* 데스크톱: 섹션 타이틀 + 세로 메뉴 */}
            <nav aria-label="커뮤니티 게시판" className="hidden shrink-0 overflow-hidden border border-border md:sticky md:top-24 md:block md:w-52">
              <div className="bg-primary py-4 text-center text-lg font-bold text-primary-foreground">커뮤니티</div>
              <div className="divide-y divide-border bg-card">
                {categories.map((cat) => {
                  const isActive = (cat === "전체" && !selected) || cat === selected
                  const href = cat === "전체" ? "/community" : `/community?category=${encodeURIComponent(cat)}`
                  return (
                    <Link
                      key={cat}
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between gap-2 px-5 py-3.5 text-sm transition-colors",
                        isActive ? "font-semibold text-primary" : "text-foreground hover:bg-secondary hover:text-primary",
                      )}
                    >
                      {cat}
                      {isActive && <ChevronRight className="size-4 shrink-0" />}
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* 모바일: 가로 스크롤 탭 */}
            <nav aria-label="커뮤니티 게시판" className="shrink-0 md:hidden">
              <div className="flex gap-2 overflow-x-auto border border-border bg-card p-2">
                {categories.map((cat) => {
                  const isActive = (cat === "전체" && !selected) || cat === selected
                  const href = cat === "전체" ? "/community" : `/community?category=${encodeURIComponent(cat)}`
                  return (
                    <Link
                      key={cat}
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex h-12 shrink-0 items-center justify-center rounded-sm px-6 text-center text-base font-semibold transition-all active:scale-[0.98] active:bg-white/40",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/40 text-foreground hover:bg-secondary hover:text-primary",
                      )}
                    >
                      {cat}
                    </Link>
                  )
                })}
              </div>
            </nav>

            <div className="mt-6 min-w-0 flex-1 md:mt-0">
              {user?.role === "admin" && selected === "새가족소개" && (
                <details className="mb-6 border border-border bg-card p-5">
                  <summary className="cursor-pointer font-semibold text-primary">새가족소개 글쓰기</summary>
                  <form action={createPost} className="mt-5 grid gap-3">
                    <input type="hidden" name="category" value="새가족소개" />
                    <input type="hidden" name="visibility" value="public" />
                    <input type="hidden" name="returnTo" value="/community?category=새가족소개" />
                    <input name="title" required placeholder="제목" className="h-11 rounded-sm border bg-background px-3" />
                    <textarea name="content" required rows={6} placeholder="내용" className="rounded-sm border bg-background p-3" />
                    <Button type="submit" className="w-fit rounded-sm">등록</Button>
                  </form>
                </details>
              )}

              <div className="mb-4 flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-foreground">{selected ?? "전체"}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">총 {total.toLocaleString("ko-KR")}건</span>
                  {user?.role === "admin" && selected !== "새가족소개" && (
                    <Button render={<Link href={writeHref} />} nativeButton={false} size="sm" className="rounded-sm">글쓰기</Button>
                  )}
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-sm border border-border p-1" role="group" aria-label="보기 방식">
                    <Link
                      href={viewHref("list")}
                      aria-current={view === "list" ? "page" : undefined}
                      aria-label="목록형으로 보기"
                      className={cn(
                        "flex size-8 items-center justify-center rounded-sm transition-colors",
                        view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      <List className="size-4" />
                    </Link>
                    <Link
                      href={viewHref("gallery")}
                      aria-current={view === "gallery" ? "page" : undefined}
                      aria-label="갤러리형으로 보기"
                      className={cn(
                        "flex size-8 items-center justify-center rounded-sm transition-colors",
                        view === "gallery" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      <LayoutGrid className="size-4" />
                    </Link>
                  </div>
                  <span className="text-sm text-muted-foreground">새글 {newCount}/{total.toLocaleString("ko-KR")}</span>
                </div>

                <form action="/community" className="flex items-center gap-2">
                  {selected && <input type="hidden" name="category" value={selected} />}
                  {view !== "list" && <input type="hidden" name="view" value={view} />}
                  <select name="field" defaultValue={field} className="h-9 rounded-sm border border-border bg-background px-2 text-sm">
                    <option value="title">제목</option>
                    <option value="author">작성자</option>
                  </select>
                  <input
                    type="search"
                    name="q"
                    defaultValue={q}
                    placeholder="검색어를 입력하세요"
                    className="h-9 w-36 rounded-sm border border-border bg-background px-3 text-sm sm:w-52"
                  />
                  <Button type="submit" size="sm" className="rounded-sm">검색</Button>
                </form>
              </div>

              {/* 데스크톱: 게시판 표 */}
              <div className={cn("hidden overflow-hidden border border-border bg-card", view === "list" && "md:block")}>
                <table className="w-full table-fixed text-sm">
                  <colgroup>
                    <col className="w-16" />
                    <col className="w-24" />
                    <col />
                    <col className="w-28" />
                    <col className="w-28" />
                    <col className="w-20" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-xs font-semibold text-muted-foreground">
                      <th className="px-4 py-3 text-center font-semibold">번호</th>
                      <th className="px-4 py-3 text-left font-semibold">구분</th>
                      <th className="px-4 py-3 text-left font-semibold">제목</th>
                      <th className="px-4 py-3 text-center font-semibold">작성자</th>
                      <th className="px-4 py-3 text-center font-semibold">등록일</th>
                      <th className="px-4 py-3 text-center font-semibold">조회수</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visiblePosts.length > 0 ? (
                      visiblePosts.map((post) => {
                        const href = post.category === "봉사 섬김이" ? externalUrl(post.content) : null
                        return (
                          <tr key={post.id} className="hover:bg-secondary/40">
                            <td className="px-4 py-3 text-center">
                              {post.pinned ? (
                                <span className="inline-flex h-6 items-center rounded-sm bg-primary/10 px-2 text-xs font-bold text-primary">공지</span>
                              ) : (
                                <span className="text-muted-foreground">{post.num}</span>
                              )}
                            </td>
                            <td className="truncate px-4 py-3 text-muted-foreground">{post.category}</td>
                            <td className="px-4 py-3">
                              <span className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
                                {href ? (
                                  <a href={href} target="_blank" rel="noreferrer" className="truncate hover:text-primary hover:underline">{post.title}</a>
                                ) : (
                                  <Link href={`/community/${post.id}`} className="truncate hover:text-primary hover:underline">{post.title}</Link>
                                )}
                                {href && <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />}
                                {isNewPost(post.createdAt) && <span className="shrink-0 text-xs font-bold text-primary">N</span>}
                              </span>
                            </td>
                            <td className="truncate px-4 py-3 text-center text-muted-foreground">{post.authorName}</td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{new Date(post.createdAt).toLocaleDateString("ko-KR")}</td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{post.id > 0 ? post.views.toLocaleString("ko-KR") : "-"}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">등록된 게시글이 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 모바일: 카드 목록 */}
              <div className={cn("divide-y divide-border overflow-hidden border border-border bg-card", view === "list" ? "md:hidden" : "hidden")}>
                {visiblePosts.length > 0 ? (
                  visiblePosts.map((post) => {
                    const href = post.category === "봉사 섬김이" ? externalUrl(post.content) : null
                    const row = (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 flex-wrap items-baseline gap-2 text-xs font-medium text-muted-foreground">
                            <span>[{post.category}]</span>
                            {post.pinned && <span className="font-bold text-primary">공지</span>}
                            {isNewPost(post.createdAt) && <span className="font-bold text-primary">N</span>}
                            {href && <ExternalLink className="size-3.5 shrink-0" />}
                          </div>
                          <div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground sm:flex">
                            <time dateTime={new Date(post.createdAt).toISOString()}>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</time>
                            {post.id > 0 && (
                              <span className="flex items-center gap-1">
                                <Eye className="size-3.5" /> {post.views.toLocaleString("ko-KR")}
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="mt-1.5 truncate text-lg font-semibold text-foreground">{post.title}</h3>
                        {!href && (
                          <p className="mt-1 truncate text-sm text-muted-foreground">{excerpt(post.content)}</p>
                        )}

                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground sm:hidden">
                          <span className="flex items-center gap-1">
                            <User className="size-3.5" /> {post.authorName}
                          </span>
                          <time dateTime={new Date(post.createdAt).toISOString()}>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</time>
                          {post.id > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="size-3.5" /> {post.views.toLocaleString("ko-KR")}
                            </span>
                          )}
                        </div>
                      </>
                    )

                    const rowClass = "block px-5 py-5 transition-colors hover:bg-secondary/60"

                    return href ? (
                      <a key={post.id} href={href} target="_blank" rel="noreferrer" className={rowClass}>
                        {row}
                      </a>
                    ) : (
                      <Link key={post.id} href={`/community/${post.id}`} className={rowClass}>
                        {row}
                      </Link>
                    )
                  })
                ) : (
                  <p className="px-6 py-16 text-center text-muted-foreground">등록된 게시글이 없습니다.</p>
                )}
              </div>

              {/* 갤러리형 */}
              {view === "gallery" && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {visiblePosts.length > 0 ? (
                    visiblePosts.map((post) => {
                      const href = post.category === "봉사 섬김이" ? externalUrl(post.content) : null
                      const thumb = thumbnails.get(post.id)
                      const inner = (
                        <>
                          <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-border bg-secondary">
                            {thumb ? (
                              <Image src={thumb} alt="" fill className="object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-muted-foreground">
                                <ImageIcon className="size-8" />
                              </div>
                            )}
                            {post.pinned && (
                              <span className="absolute left-2 top-2 rounded-sm bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">공지</span>
                            )}
                            {isNewPost(post.createdAt) && (
                              <span className="absolute right-2 top-2 rounded-sm bg-card px-1.5 py-0.5 text-xs font-bold text-primary">N</span>
                            )}
                          </div>
                          <h3 className="mt-2 truncate text-sm font-semibold text-foreground">{post.title}</h3>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {post.authorName} · {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                          </p>
                        </>
                      )
                      return href ? (
                        <a key={post.id} href={href} target="_blank" rel="noreferrer" className="block">{inner}</a>
                      ) : (
                        <Link key={post.id} href={`/community/${post.id}`} className="block">{inner}</Link>
                      )
                    })
                  ) : (
                    <p className="col-span-full px-6 py-16 text-center text-muted-foreground">등록된 게시글이 없습니다.</p>
                  )}
                </div>
              )}

              <Pagination page={page} totalPages={totalPages} hrefFor={pageHref} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
