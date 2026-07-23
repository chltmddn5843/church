import { getCloudflareContext } from "@opennextjs/cloudflare"
import type { SecondaryStorage } from "@better-auth/core/db"

function getAuthKv() {
  return getCloudflareContext().env.AUTH_KV
}

export const authKvStorage: SecondaryStorage = {
  async get(key) {
    return getAuthKv().get(key)
  },
  async set(key, value, ttl) {
    await getAuthKv().put(
      key,
      value,
      ttl ? { expirationTtl: Math.max(ttl, 60) } : undefined,
    )
  },
  async delete(key) {
    await getAuthKv().delete(key)
  },
}
