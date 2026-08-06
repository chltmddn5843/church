interface CloudflareEnv {
  DB: D1Database
  AUTH_KV: KVNamespace
  POPUP_IMAGES: R2Bucket
  BETTER_AUTH_SECRET: string
  RESEND_API_KEY: string
  EMAIL_FROM: string
}
