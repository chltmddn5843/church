import { createPost, deletePost } from "@/app/actions/posts"
import { getPosts } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { accessOptions } from "@/lib/access"

const categories = ["교회소식", "공지사항", "가정예배순서지", "새가족소개", "자료실", "정관", "헌금 내역", "제직회"]

export default async function AdminPostsPage() {
  const items = await getPosts()
  return <><h1 className="text-3xl font-bold">소식·공지 관리</h1><form action={createPost} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 shadow-sm"><input name="title" required placeholder="제목" className="h-11 rounded-lg border bg-background px-3"/><select name="category" className="h-11 rounded-lg border bg-background px-3">{categories.map(category => <option key={category}>{category}</option>)}</select><select name="visibility" className="h-11 rounded-lg border bg-background px-3">{accessOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><textarea name="content" required rows={8} placeholder="내용" className="rounded-lg border bg-background p-3"/><label className="grid gap-2">첨부파일 (이미지, PDF, MP3, M4A / 파일당 20MB)<input name="files" type="file" multiple accept="image/*,application/pdf,audio/mpeg,audio/mp4" className="rounded-lg border p-3"/></label><label className="flex items-center gap-2"><input type="checkbox" name="pinned"/> 상단 고정</label><Button type="submit" className="w-fit">게시글 등록</Button></form><div className="mt-8 space-y-3">{items.map(item=><div key={item.id} className="flex items-center justify-between rounded-xl border bg-card p-4"><div><p className="font-semibold">{item.pinned && "[고정] "}{item.title}</p><p className="text-sm text-muted-foreground">{item.category} · {accessOptions.find(([value]) => value === item.visibility)?.[1]}</p></div><form action={deletePost.bind(null,item.id)}><Button type="submit" variant="destructive" size="sm">삭제</Button></form></div>)}</div></>
}
