import "server-only"
import { getCloudflareContext } from "@opennextjs/cloudflare"

// Worker vars/secrets live on the Cloudflare env. In production OpenNext mirrors them into process.env,
// but `next dev` only exposes .dev.vars through getCloudflareContext(), so read that first.
export function runtimeEnv(name: string) {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  return env[name] ?? process.env[name]
}
