import { mkdir, writeFile } from "node:fs/promises"
import { spawnSync } from "node:child_process"

const origin = "https://www.wdchurch.com"
const output = "/tmp/church-legacy-import.sql"
const fileDir = "/tmp/church-legacy-files"
// --local targets the dev D1/R2 state so an import can be checked before touching production.
const target = process.argv.includes("--local") ? "--local" : "--remote"
const onlyBoard = Number(process.argv.find(arg => arg.startsWith("--board="))?.split("=")[1]) || null
const maxPages = Number(process.argv.find(arg => arg.startsWith("--pages="))?.split("=")[1]) || 50
const boards = new Map([
  [59, ["공지사항", "public"]],
  [60, ["교회소식", "public"]],
  [61, ["새가족소개", "member"]],
  [332, ["가정예배순서지", "public"]],
  [976, ["자료실", "member"]],
  [4820, ["헌금 내역", "offering"]],
])

const decode = (value) => value.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replaceAll("&nbsp;", " ").replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&#39;", "'").replaceAll("&quot;", '"').replace(/[ \t]+/g, " ").replace(/\n\s+/g, "\n").trim()
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`
const between = (html, start, end) => {
  const from = html.indexOf(start)
  const to = html.indexOf(end, from + start.length)
  return from < 0 || to < 0 ? "" : html.slice(from + start.length, to)
}
const uploads = []
const extensions = { "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/webp": "webp", "application/pdf": "pdf" }

// Old notices are mostly poster images: keep every attached file (and any body image without one),
// copy it into our R2 bucket, and link it to the post by its legacy id.
function legacyFiles(html) {
  const files = [...html.matchAll(/data-href="(\/File\/Download\?paramFileU=\d+)"[^>]*filename='([^']*)'/g)]
    .map(([, href, name]) => ({ url: `${origin}${href}`, name: decode(name) }))
  const names = new Set(files.map(file => file.name))
  const body = between(html, '<div class="detail-content">', '<div class="board-share">')
  for (const [, alt, src] of body.matchAll(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"/g)) {
    if (!names.has(decode(alt))) files.push({ url: src.replace(/^http:/, "https:"), name: decode(alt) || src.split("/").pop() })
  }
  return files
}

async function copyFiles(prefix, files) {
  const stored = []
  for (const [n, file] of files.entries()) {
    const response = await fetch(file.url)
    if (!response.ok) { console.warn(`skip ${file.url}: ${response.status}`); continue }
    const contentType = (response.headers.get("content-type") || "application/octet-stream").split(";")[0]
    const bytes = Buffer.from(await response.arrayBuffer())
    const ext = extensions[contentType] || file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin"
    const key = `${prefix}/${n + 1}.${ext}`
    const localPath = `${fileDir}/${key.replaceAll("/", "_")}`
    await writeFile(localPath, bytes)
    uploads.push({ key, localPath, contentType })
    stored.push({ n: n + 1, name: file.name, url: `/api/uploads/${key}`, contentType, size: bytes.length })
  }
  return stored
}

async function get(path) {
  const response = await fetch(`${origin}${path}`)
  if (!response.ok) throw new Error(`${path}: ${response.status}`)
  return response.text()
}

const sql = ["PRAGMA foreign_keys=ON;"]
if (!onlyBoard) {
  const home = await get("/")
  const pageIds = [...new Set([...home.matchAll(/\/Page\/Index\/(\d+)/g)].map(match => Number(match[1])))]
  for (const id of pageIds) {
    let html
    try { html = await get(`/Page/Index/${id}`) } catch { continue }
    if (html.includes("권한 없음")) continue
    const title = decode(between(html, '<p id="sub_title">', "</p>"))
    const content = decode(between(html, '<div id="dimodePage">', '<!-- footer start -->'))
    if (title && content) sql.push(`INSERT INTO content_pages (legacyId,title,content,published,visibility,updatedAt) VALUES (${id},${quote(title)},${quote(content)},1,'public',unixepoch()) ON CONFLICT(legacyId) DO NOTHING;`)
  }
}

async function importBoard([boardId, [category, visibility]]) {
  const statements = []
  const seen = new Set()
  for (let page = 1; page <= maxPages; page++) {
    let index
    try { index = await get(`/Board/Index/${boardId}?page=${page}`) } catch { break }
    if (boardId === 61) {
      for (const match of index.matchAll(/<a href="\/Board\/Detail\/61\/(\d+)[^"]*"[^>]*>(.*?)<\/a>/g)) {
        const id = Number(match[1])
        if (seen.has(id)) continue
        seen.add(id)
        const title = decode(match[2])
        const date = title.match(/\b(20\d{2}|\d{2})\.\s*(\d{1,2})\.\s*(\d{1,2})\b/)
        const createdAt = date ? `unixepoch('${date[1].length === 2 ? `20${date[1]}` : date[1]}-${date[2].padStart(2, "0")}-${date[3].padStart(2, "0")}')` : "unixepoch()"
        statements.push(`INSERT OR IGNORE INTO posts (title,content,category,authorName,pinned,visibility,legacyBoard,legacyId,createdAt,updatedAt) VALUES (${quote(title)},${quote(title)},'새가족소개','관리자',0,'member',61,${id},${createdAt},${createdAt});`)
      }
      continue
    }
    const ids = [...new Set([...index.matchAll(new RegExp(`/Board/Detail/${boardId}/(\\d+)`, "g"))].map(match => Number(match[1])))]
    const fresh = ids.filter(id => !seen.has(id))
    if (!fresh.length) break
    const records = await Promise.all(fresh.map(async (id) => {
      seen.add(id)
      let html
      try { html = await get(`/Board/Detail/${boardId}/${id}`) } catch { return null }
      const title = decode(between(html, '<div class="document-title">', "</div>"))
      const content = decode(between(html, '<div class="detail-content">', '<div class="board-share">'))
      const files = legacyFiles(html)
      if (!title || (!content && !files.length)) return null
      // The old site shows Korea time; store it as the real instant.
      const date = `unixepoch(${quote(decode(between(html, '<div class="document-regdate">', "</div>")))},'-9 hours')`
      return [
        `INSERT OR IGNORE INTO posts (title,content,category,authorName,pinned,visibility,legacyBoard,legacyId,createdAt,updatedAt) VALUES (${quote(title)},${quote(content)},${quote(category)},'관리자',0,${quote(visibility)},${boardId},${id},${date},${date});`,
        ...(await copyFiles(`attachments/legacy/${boardId}/${id}`, files)).map(file => `INSERT INTO attachments (postId,name,url,contentType,size,createdAt) SELECT id,${quote(file.name)},${quote(file.url)},${quote(file.contentType)},${file.size},${date} FROM posts WHERE legacyBoard=${boardId} AND legacyId=${id} AND NOT EXISTS (SELECT 1 FROM attachments WHERE url=${quote(file.url)});`),
      ]
    }))
    statements.push(...records.filter(Boolean).flat())
  }
  return statements
}
// Old gallery posts become gallery_albums rows (keyed by legacyId); their photos keep the old order via insert order.
async function importGallery() {
  const statements = []
  const seen = new Set()
  for (let page = 1; page <= maxPages; page++) {
    let index
    try { index = await get(`/Board/Index/62?page=${page}`) } catch { break }
    const fresh = [...new Set([...index.matchAll(/\/Board\/Detail\/62\/(\d+)/g)].map(match => Number(match[1])))].filter(id => !seen.has(id))
    if (!fresh.length) break
    const records = await Promise.all(fresh.map(async (id) => {
      seen.add(id)
      let html
      try { html = await get(`/Board/Detail/62/${id}`) } catch { return [] }
      const title = decode(between(html, '<div class="document-title">', "</div>"))
      const date = `unixepoch(${quote(decode(between(html, '<div class="document-regdate">', "</div>")))},'-9 hours')`
      if (!title) return []
      return [
        `INSERT OR IGNORE INTO gallery_albums (title,category,legacyId,createdAt) VALUES (${quote(title)},'교회',${id},${date});`,
        ...(await copyFiles(`gallery/legacy/${id}`, legacyFiles(html))).map(file => `INSERT INTO gallery (albumId,title,imageUrl,category,createdAt) SELECT id,${quote(title)},${quote(file.url)},'교회',${date} FROM gallery_albums WHERE legacyId=${id} AND NOT EXISTS (SELECT 1 FROM gallery WHERE imageUrl=${quote(file.url)});`),
      ]
    }))
    statements.push(...records.flat())
  }
  return statements
}

await mkdir(fileDir, { recursive: true })
const selectedBoards = onlyBoard ? [...boards].filter(([id]) => id === onlyBoard) : [...boards]
const withGallery = !onlyBoard || onlyBoard === 62
if (!selectedBoards.length && !withGallery) throw new Error(`Unknown board: ${onlyBoard}`)
sql.push(...(await Promise.all([...selectedBoards.map(importBoard), ...(withGallery ? [importGallery()] : [])])).flat())

await writeFile(output, `${sql.join("\n")}\n`)
console.log(`Generated ${sql.length - 1} statements and ${uploads.length} files: ${output}, ${fileDir}`)
if (process.argv.includes("--apply")) {
  // Files first, so no attachment row ever points at a missing object.
  for (const { key, localPath, contentType } of uploads) {
    const put = spawnSync("npx", ["wrangler", "r2", "object", "put", `church/${key}`, "--file", localPath, "--content-type", contentType, target], { stdio: "inherit" })
    if (put.status !== 0) { process.exitCode = put.status ?? 1; throw new Error(`upload failed: ${key}`) }
  }
  const result = spawnSync("npx", ["wrangler", "d1", "execute", "church-db", target, "--file", output], { stdio: "inherit" })
  process.exitCode = result.status ?? 1
} else {
  console.log("Review the SQL, then run: npm run content:import -- --apply (add --local to try it on the dev database)")
}
