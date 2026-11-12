// Pure Web Crypto helpers (no server-only) so lib/board-password.test.ts runs under plain node.
// Board read passwords: PBKDF2 hashes in D1, and a cookie holding one HMAC token per unlocked board.
// The token covers the stored hash, so changing or clearing a board's password revokes every old unlock.

const ITERATIONS = 100_000 // Workers caps PBKDF2 at 100k.
const enc = new TextEncoder()
const b64 = (bytes: ArrayBuffer | Uint8Array) => Buffer.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)).toString("base64url")

async function derive(password: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"])
  return b64(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS }, key, 256))
}

export async function hashBoardPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return `${b64(salt)}:${await derive(password, salt)}`
}

export async function verifyBoardPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":")
  return Boolean(salt && hash) && (await derive(password, Buffer.from(salt, "base64url"))) === hash
}

export async function boardToken(secret: string, category: string, stored: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  return b64(await crypto.subtle.sign("HMAC", key, enc.encode(`${category}\n${stored}`)))
}

export const BOARD_COOKIE = "board_access"
// Tokens are base64url, so "." never appears inside one.
export const readTokens = (cookie: string | undefined) => new Set((cookie ?? "").split(".").filter(Boolean))
