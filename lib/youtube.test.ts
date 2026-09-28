// Run: node --test lib/youtube.test.ts
import { test } from "node:test"
import assert from "node:assert/strict"
import { parseYoutubeId } from "./youtube.ts"

const id = "dQw4w9WgXcQ"
test("accepts every link form admins paste", () => {
  for (const input of [
    id,
    `https://www.youtube.com/watch?v=${id}`,
    `https://www.youtube.com/watch?app=desktop&v=${id}&t=30s`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}?si=abc`,
    `https://www.youtube.com/live/${id}?si=abc`,
    `https://www.youtube.com/embed/${id}`,
    `https://youtube.com/shorts/${id}`,
    `youtube.com/live/${id}`,
    `  https://www.youtube.com/watch?v=${id}  `,
  ]) assert.equal(parseYoutubeId(input), id, input)
})

test("rejects non-YouTube or malformed input", () => {
  for (const input of ["", "hello", "https://vimeo.com/123456789", `https://example.com/watch?v=${id}`, "https://www.youtube.com/watch?v=short", "https://www.youtube.com/@wondang1964"]) {
    assert.equal(parseYoutubeId(input), null, input)
  }
})
