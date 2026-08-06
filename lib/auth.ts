import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getDb } from "@/lib/db"
import { authKvStorage } from "@/lib/auth-kv"

export function getAuth() {
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
      autoSignIn: true,
    },
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
