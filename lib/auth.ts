import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { authKvStorage } from "@/lib/auth-kv"
import { getDb } from "@/lib/db"
import { sendEmail } from "@/lib/email"

function sendLater(promise: Promise<void>) {
  getCloudflareContext().ctx.waitUntil(promise.catch((error) => console.error("Failed to send auth email:", error)))
}

export function getAuth() {
  const emailEnabled = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
  const baseURL =
    process.env.BETTER_AUTH_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.V0_RUNTIME_URL)

  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: "sqlite",
    }),
    secondaryStorage: authKvStorage,
    baseURL,
    emailAndPassword: {
      enabled: true,
      autoSignIn: !emailEnabled,
      requireEmailVerification: emailEnabled,
      revokeSessionsOnPasswordReset: true,
      ...(emailEnabled
        ? {
            sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
              sendLater(sendEmail(user.email, "원당교회 비밀번호 재설정", `아래 링크에서 비밀번호를 재설정해 주세요.\n\n${url}\n\n본인이 요청하지 않았다면 이 메일을 무시해 주세요.`))
            },
          }
        : {}),
    },
    ...(emailEnabled
      ? {
          emailVerification: {
            sendOnSignUp: true,
            sendOnSignIn: true,
            autoSignInAfterVerification: true,
            sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
              sendLater(sendEmail(user.email, "원당교회 이메일 인증", `아래 링크를 눌러 이메일 주소를 인증해 주세요.\n\n${url}`))
            },
          },
        }
      : {}),
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "pending",
          input: false,
        },
      },
    },
    trustedOrigins: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:8787",
      "http://127.0.0.1:8787",
      ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
      ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
      ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
    ],
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    ...(process.env.NODE_ENV === "development"
      ? {
          advanced: {
            defaultCookieAttributes: {
              sameSite: "lax" as const,
              secure: false,
            },
          },
        }
      : {}),
  })
}
