import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { getSessionUser } from "@/lib/session"
import { runtimeEnv } from "@/lib/runtime-env"

export const dynamic = "force-dynamic"
export const metadata = { title: "로그인" }

export default async function SignInPage() {
  const user = await getSessionUser()
  if (user) redirect("/")
  return <AuthForm mode="sign-in" emailEnabled={Boolean(runtimeEnv("RESEND_API_KEY") && runtimeEnv("EMAIL_FROM"))} turnstileSiteKey={runtimeEnv("TURNSTILE_SITE_KEY") ?? ""} />
}
