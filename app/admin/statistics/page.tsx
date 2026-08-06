import { count, desc, sql, sum } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { posts } from "@/lib/db/schema"

export default async function AdminStatisticsPage() {
  const rows = await getDb().select({ category: posts.category, documents: count(), views: sum(posts.views) }).from(posts).groupBy(posts.category).orderBy(desc(sql`sum(${posts.views})`))
  const totals = rows.reduce((total, row) => ({ documents: total.documents + row.documents, views: total.views + Number(row.views ?? 0) }), { documents: 0, views: 0 })
  return <><h1 className="text-3xl font-bold">조회수 통계</h1><p className="mt-2 text-muted-foreground">게시글 상세 페이지가 열릴 때 조회수가 집계됩니다.</p><div className="mt-8 overflow-x-auto"><table className="w-full min-w-[600px] text-sm"><thead className="border-y bg-muted/40"><tr><th className="p-4 text-left">게시판</th><th className="p-4 text-right">문서 수</th><th className="p-4 text-right">조회 수</th></tr></thead><tbody>{rows.map(row => <tr key={row.category} className="border-b"><td className="p-4 font-medium">{row.category}</td><td className="p-4 text-right">{row.documents.toLocaleString("ko-KR")}</td><td className="p-4 text-right">{Number(row.views ?? 0).toLocaleString("ko-KR")}</td></tr>)}</tbody><tfoot className="border-y bg-muted/40 font-bold"><tr><td className="p-4">전체</td><td className="p-4 text-right">{totals.documents.toLocaleString("ko-KR")}</td><td className="p-4 text-right">{totals.views.toLocaleString("ko-KR")}</td></tr></tfoot></table></div></>
}
