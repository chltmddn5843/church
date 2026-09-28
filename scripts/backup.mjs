// Full backup of production: D1 as SQL + every R2 object the database points at.
// Usage: npm run backup [-- --out=/path]   (default ~/church-backups, outside the repo on purpose:
// the dump holds member data and must never be committed).
import { mkdir, rm, stat, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { dirname, join } from "node:path"
import { spawnSync } from "node:child_process"

const out = process.argv.find(arg => arg.startsWith("--out="))?.slice(6) || join(homedir(), "church-backups")
const stamp = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }).replace(/[: ]/g, "-")
const wrangler = (...args) => {
  const result = spawnSync("npx", ["wrangler", ...args], { encoding: "utf8" })
  if (result.status !== 0) throw new Error(`wrangler ${args.join(" ")}\n${result.stderr}`)
  return result.stdout
}

// 1. Database
const dbFile = join(out, "db", `church-db-${stamp}.sql`)
await mkdir(dirname(dbFile), { recursive: true })
wrangler("d1", "export", "church-db", "--remote", "--output", dbFile)
console.log(`DB → ${dbFile} (${((await stat(dbFile)).size / 1024).toFixed(0)}KB)`)

// 2. Files. Keys are random or per-legacy-id and never overwritten, so a key already on disk is skipped.
const query = ["attachments.url", "gallery.imageUrl", "popups.imageUrl", "content_pages.imageUrl"]
  .map(column => { const [table, field] = column.split("."); return `SELECT ${field} AS u FROM ${table} WHERE ${field} LIKE '/api/uploads/%'` })
  .join(" UNION ")
const raw = wrangler("d1", "execute", "church-db", "--remote", "--json", "--command", query)
const keys = JSON.parse(raw.slice(raw.indexOf("[")))[0].results.map(row => row.u.slice("/api/uploads/".length))
let fetched = 0
const missing = []
for (const key of keys) {
  if (key.includes("..")) continue
  const file = join(out, "r2", key)
  if (await stat(file).then((info) => info.size > 0, () => false)) continue
  await mkdir(dirname(file), { recursive: true })
  // A row pointing at a deleted object is a data problem to report, not a reason to stop the backup.
  try { wrangler("r2", "object", "get", `church/${key}`, "--remote", "--file", file); fetched++ } catch { missing.push(key); await rm(file, { force: true }) }
}
await writeFile(join(out, "r2", `manifest-${stamp}.txt`), keys.join("\n") + "\n")
console.log(`R2 → ${join(out, "r2")}: ${keys.length} files referenced, ${fetched} newly downloaded`)
if (missing.length) {
  console.warn(`Missing in R2 (DB rows point at files that no longer exist):\n  ${missing.join("\n  ")}`)
  process.exitCode = 1
}
