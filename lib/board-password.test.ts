// Run: node lib/board-password.test.ts
import assert from "node:assert/strict"
import { boardToken, hashBoardPassword, readTokens, verifyBoardPassword } from "./board-password.ts"

const stored = await hashBoardPassword("1234")
assert.equal(await verifyBoardPassword("1234", stored), true)
assert.equal(await verifyBoardPassword("12345", stored), false)
assert.equal(await verifyBoardPassword("1234", "garbage"), false)
assert.notEqual(stored, await hashBoardPassword("1234")) // salted

const token = await boardToken("secret", "주보", stored)
assert.equal(token, await boardToken("secret", "주보", stored))
assert.notEqual(token, await boardToken("secret", "자료실", stored)) // per board
assert.notEqual(token, await boardToken("secret", "주보", await hashBoardPassword("1234"))) // new password revokes
assert.notEqual(token, await boardToken("other", "주보", stored))
assert.ok(readTokens(`a.${token}`).has(token))
assert.equal(readTokens(undefined).size, 0)
console.log("ok")
