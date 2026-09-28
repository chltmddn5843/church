import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { getSessionUser } from "@/lib/session"
import { runtimeEnv } from "@/lib/runtime-env"

export const dynamic = "force-dynamic"
export const metadata = { title: "회원가입" }

export default async function SignUpPage() {
  const user = await getSessionUser()
  if (user) redirect("/")
  return <AuthForm mode="sign-up" emailEnabled={Boolean(runtimeEnv("RESEND_API_KEY") && runtimeEnv("EMAIL_FROM"))} turnstileSiteKey={runtimeEnv("TURNSTILE_SITE_KEY") ?? ""} />
}
