// Run: node lib/uploads.test.ts
import assert from "node:assert/strict"
import { contentTypeOf } from "./upload-types.ts"

assert.equal(contentTypeOf({ name: "a.m4a", type: "audio/x-m4a" }), "audio/mp4")
assert.equal(contentTypeOf({ name: "a.mp3", type: "audio/mp3" }), "audio/mpeg")
assert.equal(contentTypeOf({ name: "주보.JPEG", type: "" }), "image/jpeg")
assert.equal(contentTypeOf({ name: "x.pdf", type: "application/octet-stream" }), "application/pdf")
assert.equal(contentTypeOf({ name: "a.png", type: "image/png" }), "image/png")
assert.equal(contentTypeOf({ name: "자료.hwp", type: "" }), undefined)
assert.equal(contentTypeOf({ name: "photo.heic", type: "image/heic" }), undefined)
console.log("uploads ok")
