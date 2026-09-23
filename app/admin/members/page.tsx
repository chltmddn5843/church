import { desc } from "drizzle-orm"
import { setMemberGroup, setMemberRole } from "@/app/actions/members"
import { Button } from "@/components/ui/button"
import { requireAdmin } from "@/lib/admin"
import { getDb } from "@/lib/db"
import { user, userGroups } from "@/lib/db/schema"

const groupLabels = { offering: "헌금" } as const
const roleLabels = { pending: "승인 대기", member: "회원", admin: "관리자" } as const

export default async function AdminMembersPage() {
  const admin = await requireAdmin()
  const members = await getDb()
    .select({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt })
    .from(user)
    .orderBy(desc(user.createdAt))
  const memberships = await getDb().select().from(userGroups)

  return (
    <>
      <h1 className="text-3xl font-bold">회원 승인 관리</h1>
      <p className="mt-2 text-muted-foreground">
        회원가입한 계정은 승인 대기 상태로 등록됩니다. 승인 후 회원 전용 자료를 볼 수 있습니다.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-4">이름</th>
              <th className="p-4">이메일</th>
              <th className="p-4">상태</th>
              <th className="p-4">가입일</th>
              <th className="p-4">자료 그룹</th>
              <th className="p-4">관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const groups = memberships.filter((item) => item.userId === member.id).map((item) => item.group)
              return (
                <tr key={member.id} className="border-t">
                  <td className="p-4 font-medium">{member.name}</td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4">{roleLabels[member.role as keyof typeof roleLabels] ?? member.role}</td>
                  <td className="p-4">{new Date(member.createdAt).toLocaleDateString("ko-KR")}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(groupLabels).map(([group, label]) => {
                        const enabled = groups.includes(group)
                        return (
                          <form key={group} action={setMemberGroup.bind(null, member.id, group as keyof typeof groupLabels, !enabled)}>
                            <Button type="submit" size="sm" variant={enabled ? "default" : "outline"}>{label}</Button>
                          </form>
                        )
                      })}
                    </div>
                  </td>
                  <td className="p-4">
                    {member.id === admin.id ? (
                      <span className="text-muted-foreground">현재 계정</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {member.role !== "member" && (
                          <form action={setMemberRole.bind(null, member.id, "member")}>
                            <Button type="submit" size="sm" variant="outline">회원 승인</Button>
                          </form>
                        )}
                        {member.role !== "admin" && (
                          <form action={setMemberRole.bind(null, member.id, "admin")}>
                            <Button type="submit" size="sm">관리자 지정</Button>
                          </form>
                        )}
                        {member.role !== "pending" && (
                          <form action={setMemberRole.bind(null, member.id, "pending")}>
                            <Button type="submit" size="sm" variant="ghost">승인 취소</Button>
                          </form>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
