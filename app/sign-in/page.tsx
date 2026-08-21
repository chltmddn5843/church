import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { getSessionUser } from "@/lib/session"

export const dynamic = "force-dynamic"
export const metadata = { title: "로그인" }

export default async function SignInPage() {
  const user = await getSessionUser()
  if (user) redirect("/")
  return <AuthForm mode="sign-in" emailEnabled={Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)} />
}
