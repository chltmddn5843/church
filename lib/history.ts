// 교회발자취 date text and decade grouping, shared by the about page and the admin page.

/** "2026", "9", "6" → "2026. 09. 06"; month-only → "1970. 01." */
export function formatHistoryDate(year: string, month: string, day: string) {
  const [y, m, d] = [year, month, day].map((v) => v.trim())
  if (!/^\d{4}$/.test(y) || !/^\d{1,2}$/.test(m) || +m < 1 || +m > 12) return null
  if (!d) return `${y}. ${m.padStart(2, "0")}.`
  if (!/^\d{1,2}$/.test(d) || +d < 1 || +d > 31) return null
  return `${y}. ${m.padStart(2, "0")}. ${d.padStart(2, "0")}`
}

export function parseHistoryDate(date: string) {
  const [year = "", month = "", day = ""] = date.match(/\d+/g) ?? []
  return { year, month, day }
}

/** Buckets "1971~1980년" style; the first starts at the earliest year, the latest is open-ended ("2021년~"). */
export function groupHistory<T extends { date: string }>(items: T[]) {
  const groups: { start: number; label: string; items: T[] }[] = []
  for (const item of items) {
    const start = Math.floor((parseInt(item.date) - 1) / 10) * 10 + 1
    let group = groups.at(-1)
    if (group?.start !== start) groups.push((group = { start, label: "", items: [] }))
    group.items.push(item)
  }
  groups.forEach((group, i) => {
    const from = i === 0 ? parseInt(group.items[0].date) : group.start
    group.label = i === groups.length - 1 && groups.length > 1 ? `${from}년~` : `${from}~${group.start + 9}년`
  })
  return groups
}
