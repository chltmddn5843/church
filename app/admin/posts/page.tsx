import { FileText, Pin, Save } from "lucide-react"
import { createPost, deletePost, updatePost } from "@/app/actions/posts"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { SubmitButton } from "@/components/admin/submit-button"
import { Pagination } from "@/components/pagination"
import { accessOptions } from "@/lib/access"
import { getPosts, getPostsCount } from "@/lib/queries"

const categories = ["교회소식", "공지사항", "새가족소개", "주보", "가정예배순서지", "봉사 섬김이", "자료실", "정관", "조직표"]
const PAGE_SIZE = 20

const fieldClass =
  "h-11 rounded-md border border-[#cbd9e3] bg-white px-3 outline-none transition focus:border-[#2F5D8A] focus:ring-2 focus:ring-[#9CC7E6]/40"
const textareaClass =
  "rounded-md border border-[#cbd9e3] bg-white p-3 outline-none transition focus:border-[#2F5D8A] focus:ring-2 focus:ring-[#9CC7E6]/40"

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const [items, total] = await Promise.all([
    getPosts(undefined, PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getPostsCount(),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <>
      <div className="border-b border-[#d7e5ee] pb-6">
        <p className="text-sm font-semibold text-[#2F5D8A]">POST MANAGEMENT</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#183247]">게시글 관리</h1>
        <p className="mt-2 text-sm text-[#526a7d]">교회 소식, 공지사항, 자료실 게시글을 등록하고 수정합니다.</p>
      </div>

      <form action={createPost} className="mt-8 rounded-lg border border-[#d7e5ee] bg-white p-6 shadow-sm">
        <input type="hidden" name="returnTo" value="/admin/posts" />
        <div className="grid gap-4 md:grid-cols-2">
          <input name="title" required placeholder="제목" className={`${fieldClass} md:col-span-2`} />
          <select name="category" className={fieldClass}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select name="visibility" className={fieldClass}>
            {accessOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <textarea
            name="content"
            required
            rows={8}
            placeholder="내용을 입력해 주세요. 봉사 신청 게시판은 구글폼 링크를 넣으면 제목 클릭 시 바로 이동합니다."
            className={`${textareaClass} md:col-span-2`}
          />
          <label className="grid gap-2 text-sm font-medium text-[#183247] md:col-span-2">
            첨부파일 <span className="font-normal text-[#6d7f8c]">이미지, PDF, MP3, M4A / 파일당 20MB</span>
            <input name="files" type="file" multiple accept="image/*,application/pdf,audio/mpeg,audio/mp4" className="rounded-md border border-[#cbd9e3] p-3" />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="flex h-10 items-center gap-2 rounded-md border border-[#cbd9e3] px-3 text-sm">
            <input type="checkbox" name="pinned" className="size-4" /> 상단 고정
          </label>
          <SubmitButton className="h-10 px-4" pendingLabel="등록 중...">
            <FileText className="size-4" />
            게시글 등록
          </SubmitButton>
        </div>
      </form>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold text-[#183247]">등록된 게시글</h2>
          <span className="text-xs text-[#6d7f8c]">총 {total}개</span>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <details key={item.id} className="overflow-hidden rounded-lg border border-[#d7e5ee] bg-white shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-[#f8fbfd] px-5 py-4">
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-semibold text-[#183247]">
                    {item.pinned && <Pin className="size-4 text-[#2F5D8A]" />}
                    <span className="truncate">{item.title}</span>
                  </span>
                  <span className="mt-1 block text-sm text-[#526a7d]">
                    {item.category} / {accessOptions.find(([value]) => value === item.visibility)?.[1] ?? "전체 공개"}
                  </span>
                </span>
              </summary>
              <div className="grid gap-4 p-5">
                <form action={updatePost.bind(null, item.id)} className="grid gap-3 md:grid-cols-2">
                  <input name="title" required defaultValue={item.title} className={`${fieldClass} md:col-span-2`} />
                  <select name="category" defaultValue={item.category} className={fieldClass}>
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                  <select name="visibility" defaultValue={item.visibility} className={fieldClass}>
                    {accessOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <textarea name="content" required rows={6} defaultValue={item.content} className={`${textareaClass} md:col-span-2`} />
                  <label className="flex h-10 items-center gap-2 rounded-md border border-[#cbd9e3] px-3 text-sm">
                    <input type="checkbox" name="pinned" defaultChecked={item.pinned} className="size-4" /> 상단 고정
                  </label>
                  <div className="flex items-center justify-end">
                    <SubmitButton size="sm" pendingLabel="저장 중...">
                      <Save className="size-4" />
                      수정 저장
                    </SubmitButton>
                  </div>
                </form>
                <form action={deletePost.bind(null, item.id)} className="flex justify-end border-t border-[#e5eef4] pt-4">
                  <ConfirmDeleteButton confirmMessage={`'${item.title}' 게시글을 삭제하시겠습니까?`} />
                </form>
              </div>
            </details>
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} hrefFor={(p) => (p > 1 ? `/admin/posts?page=${p}` : "/admin/posts")} />
      </section>
    </>
  )
}
