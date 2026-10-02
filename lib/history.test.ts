// Run: node --test lib/history.test.ts
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { formatHistoryDate, groupHistory, parseHistoryDate } from "./history.ts"

test("formats and round-trips admin date input", () => {
  assert.equal(formatHistoryDate("2026", "9", "6"), "2026. 09. 06")
  assert.equal(formatHistoryDate("1970", "1", ""), "1970. 01.")
  assert.equal(formatHistoryDate("1970", "13", ""), null)
  assert.equal(formatHistoryDate("70", "1", "1"), null)
  assert.deepEqual(parseHistoryDate("1966. 09"), { year: "1966", month: "09", day: "" })
})

test("seed data sorted by date keeps the original decade labels", () => {
  const sql = readFileSync(new URL("../migrations/0011_history_events.sql", import.meta.url), "utf8")
  const rows = [...sql.matchAll(/\('([^']*)', '/g)].map((m, id) => ({ id, date: m[1] }))
  // Same order the pages query: date, then id.
  const sorted = rows.toSorted((a, b) => a.date.localeCompare(b.date) || a.id - b.id)
  assert.deepEqual(groupHistory(sorted).map((g) => g.label), [
    "1963~1970년", "1971~1980년", "1981~1990년", "1991~2000년", "2001~2010년", "2011~2020년", "2021년~",
  ])
})
