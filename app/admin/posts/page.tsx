import { createPost, deletePost, updatePost } from "@/app/actions/posts"
import { Button } from "@/components/ui/button"
import { accessOptions } from "@/lib/access"
import { getPosts } from "@/lib/queries"

const categories = ["교회소식", "공지사항", "새가족소개", "가정예배순서지", "봉사 섬김이", "자료실", "정관", "제직회"]

export default async function AdminPostsPage() {
  const items = await getPosts()

  return (
    <>
      <h1 className="text-3xl font-bold">소식·공지 관리</h1>
      <form action={createPost} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 shadow-sm">
        <input type="hidden" name="returnTo" value="/admin/posts" />
        <input name="title" required placeholder="제목" className="h-11 rounded-lg border bg-background px-3" />
        <select name="category" className="h-11 rounded-lg border bg-background px-3">
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <select name="visibility" className="h-11 rounded-lg border bg-background px-3">
          {accessOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <textarea
          name="content"
          required
          rows={8}
          placeholder="내용을 입력하세요. 봉사 섬김이 게시판은 구글폼 링크를 입력하면 제목 클릭 시 바로 이동합니다."
          className="rounded-lg border bg-background p-3"
        />
        <label className="grid gap-2 text-sm">
          첨부파일 (이미지, PDF, MP3, M4A / 파일당 20MB)
          <input name="files" type="file" multiple accept="image/*,application/pdf,audio/mpeg,audio/mp4" className="rounded-lg border p-3" />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="pinned" /> 상단 고정
        </label>
        <Button type="submit" className="w-fit">게시글 등록</Button>
      </form>

      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <details key={item.id} className="rounded-xl border bg-card p-4">
            <summary className="cursor-pointer font-semibold">
              {item.pinned && "[고정] "}{item.title}
              <span className="text-sm font-normal text-muted-foreground"> · {item.category} · {accessOptions.find(([value]) => value === item.visibility)?.[1]}</span>
            </summary>
            <form action={updatePost.bind(null, item.id)} className="mt-4 grid gap-3">
              <input name="title" required defaultValue={item.title} className="h-11 rounded-lg border bg-background px-3" />
              <select name="category" defaultValue={item.category} className="h-11 rounded-lg border bg-background px-3">
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
              <select name="visibility" defaultValue={item.visibility} className="h-11 rounded-lg border bg-background px-3">
                {accessOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <textarea name="content" required rows={6} defaultValue={item.content} className="rounded-lg border bg-background p-3" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="pinned" defaultChecked={item.pinned} /> 상단 고정
              </label>
              <div className="flex gap-2">
                <Button type="submit" size="sm">수정 저장</Button>
                <Button formAction={deletePost.bind(null, item.id)} variant="destructive" size="sm">삭제</Button>
              </div>
            </form>
          </details>
        ))}
      </div>
    </>
  )
}
