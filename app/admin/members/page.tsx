import { getDb } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

export default async function AdminMembersPage() {
  const members = await getDb().select({id:user.id,name:user.name,email:user.email,role:user.role,createdAt:user.createdAt}).from(user).orderBy(desc(user.createdAt))
  return <><h1 className="text-3xl font-bold">회원 조회</h1><div className="mt-6 overflow-hidden rounded-2xl border bg-card"><table className="w-full text-left text-sm"><thead className="bg-muted"><tr><th className="p-4">이름</th><th className="p-4">이메일</th><th className="p-4">권한</th></tr></thead><tbody>{members.map(member=><tr key={member.id} className="border-t"><td className="p-4">{member.name}</td><td className="p-4">{member.email}</td><td className="p-4">{member.role}</td></tr>)}</tbody></table></div></>
}
