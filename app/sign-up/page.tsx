import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { getSessionUser } from "@/lib/session"

export const dynamic = "force-dynamic"
export const metadata = { title: "회원가입" }

export default async function SignUpPage() {
  const user = await getSessionUser()
  if (user) redirect("/")
  return <AuthForm mode="sign-up" emailEnabled={Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)} />
}
