// Run: node --experimental-strip-types scripts/check-campus.mjs
import assert from "node:assert/strict"
import { Box3, Raycaster, Vector3 } from "three"
import { createCampus, campusBuildings } from "../lib/campus-model.ts"
const { campus, groups } = createCampus()
campus.updateMatrixWorld(true)
assert.equal(groups.size, 5)
for (const building of campusBuildings) {
  const group = groups.get(building.id)
  const bounds = new Box3().setFromObject(group)
  assert.ok(!bounds.isEmpty())
  const ray = new Raycaster(new Vector3(building.x, 40, building.z), new Vector3(0, -1, 0))
  assert.equal(ray.intersectObject(campus, true)[0]?.object.userData.buildingId, building.id, `${building.name} front must be selectable`)
  group.traverse(object => assert.equal(object.userData.buildingId, building.id))
}
const love = new Box3().setFromObject(groups.get("love"))
const hope = new Box3().setFromObject(groups.get("hope"))
assert.ok(love.max.z - love.min.z > love.max.x - love.min.x, "Love must run front-to-back")
assert.ok(love.max.z > hope.max.z + 8, "Love must extend forward from the horizontal wing")
const container = new Box3().setFromObject(groups.get("container"))
assert.ok(container.min.x > love.max.x, "Container must clear Love including its canopy")
assert.ok(container.max.x < hope.min.x, "Container must fit before Hope")
assert.ok(groups.get("hope").getObjectByName("hope-cafe"), "Hope must have its ground-floor cafe frontage")
assert.deepEqual(campusBuildings[0].floors.map(f => f.rooms), ["식당 · 화장실", "초등부 예배실", "디모데홀 · 로뎀방 · 지혜방 · 열매방"])
assert.equal(campusBuildings[1].floors[0].rooms, "카페 · 유아부 예배실")
assert.equal(campusBuildings[2].floors[0].rooms, "비전홀 (예배당)")
console.log("Campus: all five areas have geometry and correct pointer hit targets.")

const parking = new Box3().setFromObject(groups.get("parking"))
assert.ok(parking.max.z - parking.min.z <= 14, "Parking must fit the building-sized site")
assert.ok(parking.min.z < love.max.z, "Parking must sit beside Love inside the courtyard")
assert.ok(parking.max.z <= love.max.z + 5, "Parking must not project far beyond Love")
assert.ok(parking.min.x > love.max.x, "Parking must clear Love")
assert.ok(parking.max.x <= new Box3().setFromObject(groups.get("faith")).max.x + 1)
for (const part of ["roof", "floor", "door", "wall-front", "wall-back", "wall-left", "wall-right"])
  assert.ok(groups.get("container").getObjectByName(`container-${part}`))
assert.ok(hope.max.z - container.max.z > 8, "Container must be recessed behind the open gap")
assert.ok(hope.min.x - love.max.x > 8, "Love and Hope need a visible open gap")

// Verify the actual editable asset consumed by the website, too.
const { readFile } = await import("node:fs/promises")
const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js")
const bytes = await readFile(new URL("../public/models/church-campus.glb", import.meta.url))
const { scene: loaded } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), "")
for (const building of campusBuildings) {
  const group = loaded.getObjectByName(building.id)
  assert.ok(group, `Editable GLB must preserve ${building.id}`)
  const bounds = new Box3().setFromObject(group)
  assert.ok(!bounds.isEmpty())
}
assert.ok(loaded.getObjectByName("container-door"))
console.log("Editable GLB loads and preserves all area groups and container parts.")
