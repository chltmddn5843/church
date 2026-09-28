import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { captcha } from "better-auth/plugins"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { authKvStorage } from "@/lib/auth-kv"
import { getDb } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { runtimeEnv } from "@/lib/runtime-env"

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
    // Cloudflare Turnstile on the forms bots target. The token arrives as x-captcha-response and is checked with
    // siteverify (success, action, hostname) before better-auth runs; a missing secret fails closed with 500.
    plugins: [
      captcha({
        provider: "cloudflare-turnstile",
        secretKey: runtimeEnv("TURNSTILE_SECRET")?.trim() ?? "", // trim: a pasted newline makes siteverify reject the secret
        endpoints: ["/sign-in/email", "/sign-up/email", "/request-password-reset"],
        expectedAction: runtimeEnv("TURNSTILE_ACTION") || undefined,
        allowedHostnames: (runtimeEnv("TURNSTILE_HOSTNAMES") ?? "").split(",").map((host) => host.trim()).filter(Boolean),
      }),
    ],
    // Brute-force limits per client IP, counted in D1 so they hold across Worker isolates.
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60 * 60, max: 5 },
        "/request-password-reset": { window: 60 * 60, max: 3 },
        "/send-verification-email": { window: 60 * 60, max: 3 },
        "/reset-password": { window: 10 * 60, max: 5 },
      },
    },
    advanced: {
      // Cloudflare overwrites cf-connecting-ip; x-forwarded-for can carry client-supplied values.
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
      ...(process.env.NODE_ENV === "development"
        ? { defaultCookieAttributes: { sameSite: "lax" as const, secure: false } }
        : {}),
    },
  })
}
