const BRACKET_HEADER = /^\[(.+)\]$/

/**
 * Splits the weekly offering text into sections. Admins write headers as "[감사헌금]"; when any
 * bracket header exists only those are headers, so a lone name line like "박루빈" stays an entry.
 * Older text without brackets falls back to "short line without digits" headers.
 */
export function splitOfferingContent(content: string) {
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const bracketed = lines.some((line) => BRACKET_HEADER.test(line))
  const sections: { title: string; lines: string[] }[] = []

  for (const line of lines) {
    const isHeader = bracketed ? BRACKET_HEADER.test(line) : !/\d/.test(line) && line.length <= 24
    if (isHeader || sections.length === 0) sections.push({ title: line.replace(BRACKET_HEADER, "$1"), lines: [] })
    else sections.at(-1)!.lines.push(line)
  }

  return sections
}
