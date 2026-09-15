import { writeFile } from "node:fs/promises"
import { spawnSync } from "node:child_process"

const origin = "https://www.wdchurch.com"
const output = "/tmp/church-legacy-import.sql"
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
      const date = decode(between(html, '<div class="document-regdate">', "</div>"))
      return title && content ? `INSERT OR IGNORE INTO posts (title,content,category,authorName,pinned,visibility,legacyBoard,legacyId,createdAt,updatedAt) VALUES (${quote(title)},${quote(content)},${quote(category)},'관리자',0,${quote(visibility)},${boardId},${id},unixepoch(${quote(date)}),unixepoch(${quote(date)}));` : null
    }))
    statements.push(...records.filter(Boolean))
  }
  return statements
}
const selectedBoards = onlyBoard ? [...boards].filter(([id]) => id === onlyBoard) : [...boards]
if (!selectedBoards.length) throw new Error(`Unknown board: ${onlyBoard}`)
sql.push(...(await Promise.all(selectedBoards.map(importBoard))).flat())

await writeFile(output, `${sql.join("\n")}\n`)
console.log(`Generated ${sql.length - 1} records: ${output}`)
if (process.argv.includes("--apply")) {
  const result = spawnSync("npx", ["wrangler", "d1", "execute", "church-db", "--remote", "--file", output], { stdio: "inherit" })
  process.exitCode = result.status ?? 1
} else {
  console.log("Review the SQL, then run: npm run content:import -- --apply")
}
