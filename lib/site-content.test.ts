// Run: node --test lib/site-content.test.ts
import { test } from "node:test"
import assert from "node:assert/strict"
import { applyDepartments, applyHeroSlides, editablePages, findContentGroup, mergeContent } from "./site-content.ts"

test("keys and group ids are unique, every default is filled, every group has one image at most", () => {
  const groups = editablePages.flatMap((page) => page.groups)
  const keys = groups.flatMap((group) => group.fields.map((field) => field.key))
  assert.equal(new Set(keys).size, keys.length)
  assert.equal(new Set(groups.map((group) => group.id)).size, groups.length)
  for (const group of groups) {
    assert.ok(group.fields.every((field) => field.value), group.id)
    assert.ok(group.fields.filter((field) => field.kind === "image").length <= 1, group.id)
  }
})

test("saved rows override defaults; unknown keys are dropped", () => {
  const c = mergeContent([{ key: "hero.1.image", value: "/api/uploads/hero/a.jpg" }, { key: "nope", value: "x" }])
  assert.equal(applyHeroSlides(c)[1].src, "/api/uploads/hero/a.jpg")
  assert.equal(applyHeroSlides(c)[0].src, "/images/worship-praise.jpg")
  assert.equal(c.nope, undefined)
})

test("department edits reach the page data and keep the rest", () => {
  const edited = applyDepartments(mergeContent([{ key: "dept.high.time", value: "주일 오전 9시" }])).find((d) => d.id === "high")
  assert.equal(edited?.time, "주일 오전 9시")
  assert.equal(edited?.name, "고등부")
})

test("groups are found by id", () => {
  assert.equal(findContentGroup("dept-awana")?.page.id, "next-generation")
  assert.equal(findContentGroup("nope"), undefined)
})
