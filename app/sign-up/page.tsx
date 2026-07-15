import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { AuthForm } from "@/components/auth-form"

export const metadata = { title: "회원가입" }

export default async function SignUpPage() {
  const user = await getSessionUser()
  if (user) redirect("/")
  return <AuthForm mode="sign-up" />
}
