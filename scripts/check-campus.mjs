// Run: node --experimental-strip-types scripts/check-campus.mjs
import assert from "node:assert/strict"
import { Box3, Raycaster, Vector3 } from "three"
import { createCampus, campusBuildings, campusFloorGuide, campusFloorPlans } from "../lib/campus-model.ts"
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
const hope = new Box3().setFromObject(groups.get("hope").children[0])
assert.ok(love.max.z - love.min.z > love.max.x - love.min.x, "Love must run front-to-back")
assert.ok(love.max.z > hope.max.z + 8, "Love must extend forward from the horizontal wing")
const container = new Box3().setFromObject(groups.get("container"))
// Roof overhangs may touch; verify the wall contact below using its actual mesh.
assert.ok(container.max.x < hope.min.x, "Container must fit before Hope")
assert.ok(groups.get("hope").getObjectByName("hope-cafe"), "Hope must have its ground-floor cafe frontage")
assert.match(campusFloorGuide("love", "1F").rooms, /만나 카페테리아/)
assert.match(campusFloorGuide("love", "2F").rooms, /드림홀 — 초등부 · 영어예배부 · 어와나/)
assert.match(campusFloorGuide("love", "3F").rooms, /디모데홀 — 중등부 · 청년부/)
assert.match(campusFloorGuide("hope", "1F").rooms, /사무엘홀 — 유아부/)
assert.match(campusFloorGuide("hope", "2F").rooms, /다니엘홀 — 고등부\n요셉홀 — 유년부\n다윗홀 — 유치부/)
assert.equal(campusFloorGuide("hope", "3F").floor, "1F", "Switching from Love 3F must not leave Hope on a nonexistent floor")
assert.equal(campusFloorGuide("parking", "2F").floor, "외부")
assert.equal(campusBuildings[2].floors[0].rooms, "비전홀 (예배당)")
console.log("Campus: all five areas have geometry and correct pointer hit targets.")

const parking = new Box3().setFromObject(groups.get("parking"))
assert.ok(Math.abs((parking.max.x - parking.min.x) - (parking.max.z - parking.min.z)) < 4, "Aerial courtyard must be approximately square")
assert.ok(parking.max.x - parking.min.x >= 50, "Courtyard must provide broad parking space")
assert.ok(parking.min.x > love.max.x, "Parking must clear Love")
assert.ok(parking.max.x <= new Box3().setFromObject(groups.get("faith")).max.x + 1)
for (const part of ["roof", "floor", "door", "wall-front", "wall-back", "wall-left", "wall-right"])
  assert.ok(groups.get("container").getObjectByName(`container-${part}`))
assert.ok(container.min.x > love.min.x && container.max.x < love.max.x + 1, "Faith Room must align with the right end of Love")
assert.ok(!hope.intersectsBox(love), "Love and Hope must remain separate after the leftward move")

// Verify the actual editable asset consumed by the website, too.
const { readFile } = await import("node:fs/promises")
const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js")
const bytes = await readFile(new URL("../public/models/church-campus.glb", import.meta.url))
const { scene: loaded } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), "")
for (const building of campusBuildings) {
  const group = loaded.getObjectByName(building.id)
  assert.ok(group, `Editable GLB must preserve ${building.id}`)
  assert.deepEqual(group.userData.floors, building.floors, "GLB must include the current floor directory")
  const bounds = new Box3().setFromObject(group)
  assert.ok(!bounds.isEmpty())
}
assert.ok(loaded.getObjectByName("container-door"))
console.log("Editable GLB loads and preserves all area groups and container parts.")

const faith = new Box3().setFromObject(groups.get("faith"))
const gap = faith.min.x - new Box3().setFromObject(groups.get("hope")).max.x
assert.ok(gap > 2.5 && gap < 3.5, "Faith must move closer to Hope while retaining an open passage")
assert.ok(container.max.y >= 6.4, "Container must have two levels")
assert.ok(groups.get("container").getObjectByName("container-stair-step-12"))
assert.ok(groups.get("container").getObjectByName("container-window-glass-1"))
assert.ok(groups.get("hope").getObjectByName("koinonia-cafe-side-glazing"))

assert.ok(groups.get("parking").getObjectByName("parking-central-pavers"))
assert.ok(groups.get("parking").getObjectByName("parking-building-pavers"))
assert.ok(campus.getObjectByName("landscape").children.filter(o => o.name.startsWith("landscape-tree-")).length >= 20)
const central = new Box3().setFromObject(groups.get("parking").getObjectByName("parking-central-pavers"))
const buildingRow = new Box3().setFromObject(groups.get("parking").getObjectByName("parking-building-pavers"))
assert.ok(central.min.z - buildingRow.max.z >= 8, "Driving aisle between parking rows must remain open")
assert.ok(parking.max.z - central.max.z >= 15, "Front courtyard must retain turning space")
console.log("Aerial parking layout: paired central rows, building-side row, open aisles and boundary trees verified.")

const loveBody = new Box3().setFromObject(groups.get("love").children[0])
assert.ok(parking.max.z - loveBody.max.z >= 0 && parking.max.z - loveBody.max.z <= 2, "Love must reach the front with only a narrow setback")
assert.ok(loveBody.min.z >= hope.max.z - .01, "Love rear and Hope front must meet the same courtyard corner")
const attachedWall = new Box3().setFromObject(groups.get("container").getObjectByName("container-wall-left"))
assert.ok(Math.abs(attachedWall.max.z - loveBody.min.z) < .01, "Faith Room wall must touch Love right end wall")
assert.ok(!container.intersectsBox(hope), "Faith Room must remain separate from Hope")
const dirt = new Box3().setFromObject(groups.get("parking").getObjectByName("parking-dirt-apron"))
assert.ok(dirt.max.z > central.max.z, "Dirt surface must connect the outer edges")
assert.ok(!groups.get("parking").getObjectByName("parking-front-pavers"), "Unpaved apron must not have invented parking bays")
assert.ok(central.max.x - central.min.x >= 36, "Central parking markings must fill the courtyard width")
console.log("Love proportions and expanded parking rows preserve setbacks and driving aisles.")

for (const [id, width] of [["love", 8.7], ["hope", 4.3], ["faith", 4.1]]) {
 const entry = loaded.getObjectByName(`${id}-main-entry`)
 assert.ok(entry, `${id} entrance must be present in the exported model`)
 const size = new Box3().setFromObject(entry).getSize(new Vector3())
 assert.ok(Math.abs((id === "love" ? size.z : size.x) - width) < .02, "Door width must not stretch with the building")
}
assert.ok(loaded.getObjectByName("sign-원당교회"))
assert.ok(loaded.getObjectByName("entry-barrier-arm"))
console.log("Entrance proportions, church signage and vehicle gate verified in GLB.")

for (const [id, floors] of Object.entries(campusFloorPlans)) {
  const building = campusBuildings.find(b => b.id === id)
  for (const [floor, { cells }] of Object.entries(floors)) {
    for (const [, label, left, top, width, height] of cells)
      assert.ok(left >= 0 && top >= 0 && left + width <= 100.05 && top + height <= 100.05, `${id} ${floor} ${label} must stay inside the plan`)
    // The department finder highlights the hall by name, so every "홀 — 부서" line needs a matching cell.
    for (const line of building.floors.find(f => f.floor === floor).rooms.split("\n"))
      if (line.includes(" — ")) assert.ok(cells.some(c => c[1] === line.split(" — ")[0]), `${id} ${floor} plan must draw ${line}`)
  }
  assert.deepEqual(Object.keys(floors), building.floors.map(f => f.floor), `${id} plans must cover every floor`)
}
console.log("Floor plans stay in bounds and draw every department hall.")

assert.ok(loaded.getObjectByName("love-end-window-glass"))
assert.ok(loaded.getObjectByName("love-outer-entry"))
assert.ok(loaded.getObjectByName("parking-accessible-symbol"))
assert.equal(groups.get("parking").children.filter(o => o.name.endsWith("wheel-stop")).length, 34)
console.log("Love rear setback, side facade and parking markings verified.")

assert.ok(hope.max.z - hope.min.z >= 21, "Hope must extend deeply alongside the rear recess")
assert.ok(Math.abs(hope.max.x - hope.min.x - 17) < .01, "Hope footprint must match the broader satellite roof")
assert.ok(!loaded.getObjectByName("parking-dirt-edge"), "Dirt must be a single surface")
assert.equal(campusBuildings.find(b => b.id === "container").name, "믿음방")

assert.equal(groups.get("container").rotation.y, groups.get("love").rotation.y, "Faith Room must face the same direction as Love")
const hopeWing = new Box3().setFromObject(groups.get("hope").getObjectByName("hope-left-wing"))
assert.ok(hopeWing.min.x < hope.min.x - 5, "Hope left wing must extend leftward")
assert.ok(!hopeWing.intersectsBox(container), "Hope wing must clear Faith Room")
assert.ok(loaded.getObjectByName("love-folding-door-track"))
assert.ok(loaded.getObjectByName("parking-hope-front-pavers"))

const exportedWall = new Box3().setFromObject(loaded.getObjectByName("container-wall-left"))
assert.ok(Math.abs(exportedWall.max.z - loveBody.min.z) < .01, "Exported GLB must retain wall contact")

const driveway = new Box3().setFromObject(loaded.getObjectByName("love-driveway"))
assert.ok(driveway.min.x > loveBody.max.x, "Love driveway must be beside the building")
assert.ok(driveway.min.z < loveBody.max.z && driveway.max.z >= 66, "Driveway must connect the building apron to the road")
assert.ok(driveway.max.x <= dirt.min.x + .01, "Dirt apron must not cover the driveway")
assert.ok(loaded.getObjectByName("love-barrier-arm"))
for (const tree of loaded.getObjectByName("landscape").children.filter(o => o.name.startsWith("landscape-tree-")))
 assert.ok(!new Box3().setFromObject(tree).intersectsBox(driveway), "Entrance must remain clear of trees")
console.log("Love-side driveway, barrier and clear entrance verified.")

assert.ok(Math.abs(container.min.x - loveBody.min.x) < 1.2, "Faith Room must sit at Love rear wall line")
assert.ok(hopeWing.min.x >= -31 && hopeWing.max.z === hope.max.z, "Hope must fill the marked rear expansion")
assert.ok(hopeWing.min.x - container.max.x > 4 && hopeWing.min.x - container.max.x < 6, "A clear gap must remain beside Faith Room stairs")
assert.ok(!loaded.getObjectByName("front-open-ground"), "Remove the unwanted front paved patch")
const dirtRay = new Raycaster(new Vector3(28, 10, 49), new Vector3(0, -1, 0))
assert.equal(dirtRay.intersectObject(loaded, true)[0]?.object.name, "parking-dirt-apron", "Dirt corner must be continuous")

const gate = new Box3().setFromObject(loaded.getObjectByName("love-barrier-arm"))
assert.ok(gate.min.z > loveBody.max.z + 2 && gate.max.z < driveway.max.z, "Vehicle barrier must stand at the road end of the driveway")
const cafeFrames = []
loaded.getObjectByName("hope-cafe").traverse(o => { if (o.name.startsWith("cafe-folding-door-frame")) cafeFrames.push(new Box3().setFromObject(o)) })
assert.equal(cafeFrames.length, 13)
assert.ok(cafeFrames.every(b => Math.abs(b.max.z - cafeFrames[0].max.z) < .001), "Cafe folding doors must form one straight facade")
assert.ok(Math.abs(hope.max.z - hopeWing.max.z) < .001, "Hope and its cafe wing must share one front wall line")
console.log("Roadside barrier and continuous cafe folding-door facade verified.")

const faithBody = new Box3().setFromObject(groups.get("faith").children[0])
assert.ok(Math.abs(faithBody.max.z - hope.max.z) < .01, "Hope must align with Faith along the courtyard front")
assert.ok(hope.max.x - hopeWing.min.x < 25, "Hope frontage must remain compact")
const tables = groups.get("hope").children.filter(o => o.name === "cafe-picnic-table")
assert.equal(tables.length, 2)
for (const table of tables) {
 assert.equal(table.rotation.y, Math.PI / 2)
 const bounds = new Box3().setFromObject(table)
 for (const body of [hope, hopeWing, container, loveBody]) assert.ok(!bounds.intersectsBox(body), "Rotated tables must clear buildings and Faith Room")
}

const entryWing = new Box3().setFromObject(loaded.getObjectByName("faith-entry-wing"))
assert.ok(Math.abs(entryWing.max.z - faithBody.max.z) < .01, "Faith entrance wing must align with the main hall facade")
assert.ok(entryWing.max.y >= 9 && entryWing.max.y < faithBody.max.y, "White entrance wing must sit below the red hall roof")
for (const name of ["faith-entry-canopy", "faith-entry-landing", "faith-entry-ramp", "faith-entry-step-2", "faith-ramp-handrail"])
 assert.ok(loaded.getObjectByName(name), `Faith entrance must include ${name}`)
const rampBounds = new Box3().setFromObject(loaded.getObjectByName("faith-entry-ramp"))
assert.ok(rampBounds.max.z < buildingRow.min.z, "Entrance ramp must clear the parking bays")
console.log("Faith entrance frontage, raised approach, stairs and side ramp verified.")

const exportedHopeWing = new Box3().setFromObject(loaded.getObjectByName("hope-left-wing"))
const exportedContainer = new Box3().setFromObject(loaded.getObjectByName("container"))
const passageWidth = exportedHopeWing.min.x - exportedContainer.max.x
assert.ok(passageWidth > 4 && passageWidth < 6, "Exported Faith Room stair passage must keep the clearance after narrowing Hope")
console.log("Faith Room–Hope passage width verified in source and exported model.")

const roomWindow = new Box3().setFromObject(loaded.getObjectByName("container-window-glass-1")).getCenter(new Vector3())
const roomSightline = new Raycaster(new Vector3(hope.max.x + .5, roomWindow.y, roomWindow.z), new Vector3(-1, 0, 0))
assert.equal(roomSightline.intersectObject(loaded, true)[0]?.object.userData.buildingId, "container", "Hope must not obscure Faith Room upper window from the courtyard side")
for (const table of tables) assert.ok([8.2, 12.2].some(z => Math.abs(z - table.getWorldPosition(new Vector3()).z) < .01), "Tables must follow Faith Room toward the road")
console.log("Faith Room courtyard sightline and stationary tables verified.")

const loveCanopy = new Box3().setFromObject(loaded.getObjectByName("love-main-canopy"))
assert.ok(loveCanopy.getSize(new Vector3()).z < 23, "Love canopy must cover only the folding doors through the right entry")
const groundWindows = []
loaded.getObjectByName("love").traverse(o => { if (o.name.startsWith("love-ground-window-frame")) groundWindows.push(o) })
assert.equal(groundWindows.length, 4)
assert.ok(loaded.getObjectByName("love-entry-railing"))

assert.ok(Math.abs(loveBody.max.z - 59.7) < .01, "Love must shift slightly toward the front road")
const exportedLoveBody = new Box3().setFromObject(loaded.getObjectByName("love").children[0])
assert.ok(Math.abs(exportedLoveBody.max.z - loveBody.max.z) < .01, "Exported Love must retain the roadward move")

const frontTree = new Box3().setFromObject(loaded.getObjectByName("landscape-tree-1"))
const loveOutline = new Box3().setFromObject(loaded.getObjectByName("love"))
const treeClearance = frontTree.min.z - loveOutline.max.z
assert.ok(treeClearance > 1 && treeClearance < 1.5, "Love must stop just short of the roadside tree canopy")

assert.ok(!loaded.getObjectByName("koinonia-cafe-signboard"), "Remove the unwanted red cafe signboard")
assert.ok(!loaded.getObjectByName("courtyard-edge"), "Remove the mismatched raised courtyard strip")
const apron = loaded.getObjectByName("love-courtyard-paving")
const parkingPaving = loaded.getObjectByName("parking-paved-boundary")
for (const surface of [apron, loaded.getObjectByName("love-driveway")]) {
 assert.equal(surface.material.color.getHex(), parkingPaving.material.color.getHex(), "Entrance paving must match the courtyard color")
 assert.equal(surface.material.roughness, parkingPaving.material.roughness)
}
const apronBounds = new Box3().setFromObject(apron)
assert.ok(Math.abs(apronBounds.max.x - parking.min.x) < .01, "Love paving must meet the parking boundary without a gap")
assert.ok(apronBounds.min.z <= loveBody.min.z && apronBounds.max.z >= loveBody.max.z, "Paving must cover the full relocated Love frontage")

const hopeParts = []
loaded.getObjectByName("hope").traverse(o => hopeParts.push(o))
assert.equal(hopeParts.filter(o => o.name.startsWith("hope-upper-window")).length, 4)
assert.equal(hopeParts.filter(o => o.name.startsWith("hope-ground-window")).length, 2)
assert.ok(new Box3().setFromObject(loaded.getObjectByName("hope-entry-canopy")).getSize(new Vector3()).x < 7.4, "Hope canopy must fit the redistributed facade")

for (const window of hopeParts.filter(o => o.name.startsWith("hope-upper-window") || o.name.startsWith("hope-ground-window"))) assert.ok(new Box3().setFromObject(window).getSize(new Vector3()).x < .9, "Hope window frames must remain narrow")

const hopeDoor = new Box3().setFromObject(loaded.getObjectByName("hope-main-entry"))
const cafeGlass = new Box3().setFromObject(loaded.getObjectByName("koinonia-cafe-side-glazing"))
assert.ok(hopeDoor.min.x - cafeGlass.max.x > .5 && hopeDoor.min.x - cafeGlass.max.x < 2.5, "Hope entry must sit close to the folding doors")
const roomPaving = loaded.getObjectByName("faith-room-courtyard-paving")
assert.equal(roomPaving.material.color.getHex(), parkingPaving.material.color.getHex())
for (const [x, z] of [[-36, 11], [-30, 13], [-26, 14], [-24, 8.75]]) {
 const ray = new Raycaster(new Vector3(x, .1, z), new Vector3(0, -1, 0))
 assert.ok(["faith-room-courtyard-paving", "cafe-courtyard-connection"].includes(ray.intersectObject(loaded, true)[0]?.object.name), "Faith Room courtyard must have continuous paving instead of green ground")
}

assert.ok(Math.abs(hope.max.x + 5) < .01, "Hope must move three units toward Faith Room")
for (const table of tables) assert.ok(Math.abs(table.getWorldPosition(new Vector3()).x + 32.9) < .01, "Narrowing Hope must not drag the courtyard tables")

const upperWindows = hopeParts.filter(o => o.name.startsWith("hope-upper-window")).map(o => new Box3().setFromObject(o))
const rightWindowEdge = Math.max(...upperWindows.map(b => b.max.x))
assert.ok(hope.max.x - rightWindowEdge < .7, "Hope must not retain a broad windowless strip on the right")
assert.ok(Math.abs(hope.max.x - hopeWing.min.x - 24.65) < .01, "Facade redistribution must preserve Hope overall width")

const buildingStops = groups.get("parking").children.filter(o => o.name === "parking-building-wheel-stop")
assert.equal(buildingStops.length, 5, "Fill the right-hand parking strip with five ordinary bays")
const accessibleBay = new Box3().setFromObject(loaded.getObjectByName("parking-accessible-bay"))
assert.ok(Math.abs(buildingRow.min.x - accessibleBay.max.x - 6) < .01, "Leave exactly two bays between accessible and existing ordinary parking")
const accessibleSymbol = new Box3().setFromObject(loaded.getObjectByName("parking-accessible-symbol"))
assert.ok(accessibleSymbol.min.x > accessibleBay.min.x && accessibleSymbol.max.x < accessibleBay.max.x, "Accessible symbol must move with the bay")
for (const x of [0, 3]) {
 const clearedRay = new Raycaster(new Vector3(x, 1, 15.5), new Vector3(0, -1, 0))
 assert.equal(clearedRay.intersectObject(loaded, true)[0]?.object.name, "parking-paved-boundary", "Deleted parking bays must leave plain paving")
}

const infill = new Box3().setFromObject(loaded.getObjectByName("parking-infill-pavers"))
const infillStops = []
loaded.getObjectByName("parking").traverse(o => { if (o.name.startsWith("parking-infill-wheel-stop")) infillStops.push(o) })
assert.equal(infillStops.length, 2)
assert.ok(Math.abs(infill.min.x - accessibleBay.max.x) < .01 && Math.abs(infill.max.x - buildingRow.min.x) < .01, "New bays must connect accessible and existing ordinary parking")
assert.ok(infill.min.z === buildingRow.min.z && infill.max.z === buildingRow.max.z, "New bays must remain within the existing row depth")
for (const stop of infillStops) {
 const bounds = new Box3().setFromObject(stop)
 assert.ok(bounds.max.z < infill.getCenter(new Vector3()).z, "Wheel stops must match the existing row direction")
}
assert.ok(Math.abs(buildingRow.max.x - 30) < .01, "Existing right-hand bays must stay in place")
