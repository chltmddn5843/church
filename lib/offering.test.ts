// Run: node --test lib/offering.test.ts
import { test } from "node:test"
import assert from "node:assert/strict"
import { splitOfferingContent } from "./offering.ts"

test("a lone name under a bracket header stays an entry", () => {
  assert.deepEqual(splitOfferingContent("[주일헌금]\n강해일 김미경 무명 27명\n\n[생일감사헌금] \n박루빈\n\n[선교헌금]\n김미선"), [
    { title: "주일헌금", lines: ["강해일 김미경 무명 27명"] },
    { title: "생일감사헌금", lines: ["박루빈"] },
    { title: "선교헌금", lines: ["김미선"] },
  ])
})

test("text without bracket headers keeps the old rule", () => {
  assert.deepEqual(splitOfferingContent("십일조\n홍길동 100,000\n\n감사헌금\n김원당 50,000"), [
    { title: "십일조", lines: ["홍길동 100,000"] },
    { title: "감사헌금", lines: ["김원당 50,000"] },
  ])
})
