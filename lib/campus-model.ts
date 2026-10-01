import * as THREE from "three"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"
import campusSigns from "./campus-signs.json" with { type: "json" }

// ponytail: photo-estimated exterior dimensions; replace these with surveyed footprints when available.
export const campusBuildings = [
  { id: "love", name: "사랑관", english: "LOVE", position: "마당 왼쪽의 3층 건물이에요. 식당과 초등부·중등부·청년부 예배실이 있어요.", floors: [
    { floor: "1F", rooms: "만나 카페테리아 (식당) · 주방\n화장실 · 엘리베이터" },
    { floor: "2F", rooms: "드림홀 — 초등부 · 영어예배부 · 어와나\n소그룹방 · 사역자실" },
    { floor: "3F", rooms: "디모데홀 — 중등부 · 청년부\n열매방 · 지혜방 · 로뎀방\n재정부실 · 목양실" },
  ], color: "#2677aa", x: -34, z: 37.7, width: 44, depth: 18, height: 15, rotation: Math.PI / 2 },
  { id: "hope", name: "소망관", english: "HOPE", position: "사랑관과 믿음관 사이의 2층 건물이에요. 유아부부터 고등부까지 교회학교가 모여 있어요.", floors: [
    { floor: "1F", rooms: "사무엘홀 — 유아부\n사랑방 · 온유방 · 화평방 · 희락방\n수유실 · 화장실 · 코이노니아 카페" },
    { floor: "2F", rooms: "다니엘홀 — 고등부\n요셉홀 — 유년부\n다윗홀 — 유치부\n충성방 · 양선방 · 자비방" },
  ], color: "#b77b25", x: -13.5, z: -2, width: 17, depth: 21, height: 8, rotation: 0 },
  { id: "faith", name: "믿음관", english: "FAITH", position: "십자가가 있는 오른쪽 주황색 건물이에요. 함께 예배드리는 예배당이 있어요.", floors: [
    { floor: "1F", rooms: "비전홀 (예배당)" },
  ], color: "#bb502f", x: 19, z: -3, width: 26, depth: 23, height: 12, rotation: 0 },
  { id: "container", name: "믿음방", english: "FAITH ROOM", position: "사랑관 우측 끝 벽에 붙어 있는 믿음방이에요. 소망관과는 떨어져 있고, 정면은 사랑관과 같은 마당 방향이에요.", floors: [
    { floor: "1F", rooms: "앞쪽 카페 야외 공간" },
    { floor: "2F", rooms: "오른쪽 바깥 계단으로 올라가는 위층" },
  ], color: "#687e84", x: -40, z: 12.64, width: 6, depth: 4, height: 6.4, rotation: Math.PI / 2 },
  { id: "parking", name: "마당 · 주차장", english: "PARKING", position: "건물들 앞에 펼쳐진 마당이에요. 마당이 곧 주차장이에요.", floors: [
    { floor: "외부", rooms: "회색 포장 구역에 주차해요. 마당 앞쪽과 가장자리 일부는 흙길이에요." },
  ], color: "#6a8473", x: 5, z: 34.5, width: 54, depth: 51, height: .1, rotation: 0 },
] as const
export type BuildingId = (typeof campusBuildings)[number]["id"]

// Floor plans traced from the church's 층별 배치도, as % boxes of each floor's outline: [kind, label, left, top, width, height, sub?].
// Later cells paint over earlier ones (stairs over the corner of 디모데홀). "water" is an icon pinned at left/top.
export type PlanKind = "hall" | "room" | "dining" | "toilet" | "stairs" | "elevator" | "door" | "nursing" | "plain" | "water"
export type PlanCell = readonly [kind: PlanKind, label: string, left: number, top: number, width: number, height: number, sub?: string]
export const campusFloorPlans: Partial<Record<BuildingId, Record<string, { ratio: number; cells: readonly PlanCell[] }>>> = {
  love: {
    "1F": { ratio: 904 / 350, cells: [
      ["plain", "주방", 0, 0, 19.4, 67.4], ["stairs", "계단", 0, 67.4, 12.7, 20.3], ["door", "후문", 0, 87.7, 12.7, 12.3],
      ["dining", "만나 카페테리아", 19.4, 0, 53.8, 100, "식당"], ["water", "정수기", 70.4, 88, 0, 0],
      ["toilet", "화장실", 73.2, 0, 26.8, 37.1],
      ["elevator", "엘리베이터", 73.2, 54.6, 15.5, 33.1], ["door", "정문", 73.2, 87.7, 15.5, 12.3], ["stairs", "계단", 88.7, 54.6, 11.3, 45.4]
    ] },
    "2F": { ratio: 904 / 354, cells: [
      ["room", "소그룹방", 0, 0, 13.6, 72], ["stairs", "계단", 0, 72, 13.6, 28],
      ["hall", "드림홀", 13.6, 0, 51.3, 100, "초등부 · 영어예배부 · 어와나"],
      ["plain", "사역자실", 64.9, 0, 35.1, 53.1],
      ["elevator", "엘리베이터", 73.4, 53.1, 14.5, 46.9], ["stairs", "계단", 87.9, 53.1, 12.1, 46.9]
    ] },
    "3F": { ratio: 904 / 354, cells: [
      ["hall", "디모데홀", 0, 0, 22.6, 100, "중등부 · 청년부"], ["stairs", "계단", 0, 72, 12.7, 28],
      ["room", "열매방", 22.6, 0, 31.2, 40.4], ["plain", "재정부실", 53.8, 0, 14.1, 40.4],
      ["room", "지혜방", 29.4, 40.4, 24.4, 40.1], ["room", "로뎀방", 53.8, 40.4, 14.1, 40.1],
      ["plain", "목양실", 67.9, 0, 32.1, 53.7],
      ["elevator", "엘리베이터", 73.7, 53.7, 15.5, 46.3], ["stairs", "계단", 89.2, 53.7, 10.8, 46.3]
    ] },
  },
  hope: {
    "1F": { ratio: 900 / 415, cells: [
      ["stairs", "계단", 0, 0, 16.4, 32.5], ["door", "후문", 16.4, 0, 9, 8.4],
      ["room", "온유방", 25.4, 0, 18.7, 32.5], ["room", "화평방", 44.1, 0, 19.3, 32.5], ["room", "희락방", 63.4, 0, 20.2, 32.5], ["stairs", "계단", 83.6, 0, 16.4, 32.5],
      ["room", "사랑방", 0, 32.5, 16.4, 35], ["toilet", "화장실", 0, 67.5, 16.4, 32.5],
      ["hall", "사무엘홀", 25.4, 50.8, 38, 49.2, "유아부"],
      ["nursing", "수유실", 63.4, 67.5, 13.3, 32.5], ["water", "정수기", 79, 88, 0, 0],
      ["door", "정문", 93.4, 32.5, 6.6, 67.5]
    ] },
    "2F": { ratio: 900 / 415, cells: [
      ["stairs", "계단", 0, 0, 16.4, 32.5], ["room", "충성방", 16.4, 0, 22.5, 32.5], ["room", "양선방", 38.9, 0, 22.4, 32.5], ["room", "자비방", 61.3, 0, 22.3, 32.5], ["stairs", "계단", 83.6, 0, 16.4, 32.5],
      ["hall", "다니엘홀", 0, 50.8, 33.3, 49.2, "고등부"], ["hall", "요셉홀", 33.3, 50.8, 33.4, 49.2, "유년부"], ["hall", "다윗홀", 66.7, 50.8, 33.3, 49.2, "유치부"]
    ] },
  },
}

// Unknown/stale floor selections fall back to the first floor of the current building.
export function campusFloorGuide(id: BuildingId, floor = "") {
  const building = campusBuildings.find(b => b.id === id)!
  return building.floors.find(f => f.floor === floor) ?? building.floors[0]
}

export function createCampus() {
  const campus = new THREE.Group()
  campus.name = "wondang-campus"
  const groups = new Map<BuildingId, THREE.Group>()
  const materials = new Map<string, THREE.MeshStandardMaterial>()
  function box(parent: THREE.Group, x: number, y: number, z: number, w: number, h: number, d: number, color: string) {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .82 }))
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), materials.get(color))
    mesh.name = `${parent.name || "site"}-part-${parent.children.length + 1}`
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  function sign(parent: THREE.Group, text: keyof typeof campusSigns, x: number, y: number, z: number, width: number, color = "#f6f3e7") {
    const glyph = campusSigns[text], scale = width / glyph.width
    const pieces = glyph.runs.map(([left, top, length]) => new THREE.BoxGeometry(length * scale, scale, .035).translate((left + length / 2) * scale - width / 2, (glyph.height / 2 - top) * scale, 0))
    const mesh = new THREE.Mesh(mergeGeometries(pieces), new THREE.MeshStandardMaterial({ color }))
    pieces.forEach(piece => piece.dispose())
    mesh.name = `sign-${text}`
    mesh.position.set(x, y, z)
    parent.add(mesh)
  }
  function emblem(parent: THREE.Group, x: number, y: number, z: number) {
    box(parent, x - .3, y, z, .6, 1.5, .12, "#237ca2")
    box(parent, x + .3, y, z, .6, 1.5, .12, "#78a850")
    box(parent, x, y, z + .09, .1, 1.1, .06, "#ffffff")
    box(parent, x, y + .18, z + .09, .65, .1, .06, "#ffffff")
  }
  function entrance(parent: THREE.Group, name: string, x: number, z: number, width: number, panes: number) {
    const entry = new THREE.Group()
    entry.name = name
    entry.position.set(x, 0, z)
    entry.scale.x = 1 / parent.scale.x
    parent.add(entry)
    box(entry, 0, .1, .45, width + .5, .2, 1.4, "#b5b4a9")
    box(entry, 0, 1.5, 0, width, 2.8, .18, "#365664")
    for (let i = 0; i <= panes; i++) box(entry, -width / 2 + i * width / panes, 1.5, .13, .075, 2.8, .09, "#dddcd3")
    for (const y of [.15, 2.45, 2.92]) box(entry, 0, y, .13, width, .075, .09, "#dddcd3")
    for (const dx of [-.14, .14]) box(entry, dx, 1.2, .23, .04, .48, .055, "#d2d4d1")
    return entry
  }
  box(campus, -5.5, -.65, 20.5, 79, 1, 90, "#899577").name = "site-base"
  for (const building of campusBuildings) {
    // Preserve the photographed facade divisions while keeping Love’s front setback and recessed rear passage.
    const b = building.id === "love" ? { ...building, width: 25 } : building.id === "hope" ? { ...building, width: 20 } : building
    const group = new THREE.Group()
    group.name = b.id
    group.userData.floors = b.floors
    group.userData.name = b.name
    group.position.set(b.x, 0, b.z)
    group.rotation.y = b.rotation
    group.scale.x = building.width / b.width
    campus.add(group)
    groups.set(b.id, group)
    const front = b.depth / 2
    if (b.id === "parking") {
      // ponytail: aerial-image proportions, not surveyed boundaries or certified parking dimensions.
      const footprint = new THREE.Shape()
      const corners = [[-27, -25.5], [27, -25.5], [27, 19.5], [21, 25.5], [-27, 25.5]]
      corners.forEach(([x, z], i) => i ? footprint.lineTo(x, -z) : footprint.moveTo(x, -z))
      footprint.closePath()
      const paving = new THREE.Mesh(new THREE.ShapeGeometry(footprint), new THREE.MeshStandardMaterial({ color: "#c9c8ba", roughness: .82 }))
      paving.rotation.x = -Math.PI / 2
      paving.position.y = -.01
      paving.receiveShadow = true
      paving.name = "parking-paved-boundary"
      group.add(paving)
      // The central paired rows and the building-side row leave continuous driving aisles.
      for (const [name, x, z, width, depth, bays] of [
        ["central", -2, -1, 36, 12, 12],
        ["building", 17.5, -19, 15, 6, 5],
        ["hope-front", -15.5, -19, 9, 6, 3],
        ["infill", 7, -19, 6, 6, 2],
      ] as const) {
        box(group, x, .025, z, width, .05, depth, "#a5aca2").name = `parking-${name}-pavers`
        for (let offset = -width / 2; offset <= width / 2; offset += width / bays)
          box(group, x + offset, .065, z, .16, .03, depth, "#fffdf1").name = `parking-${name}-bay-line`
        for (let dz = -depth / 2; dz <= depth / 2; dz += 6)
          box(group, x, .065, z + dz, width, .03, .16, "#fffdf1")
        for (let bay = 0; bay < bays; bay++) {
          const bayX = x - width / 2 + (bay + .5) * width / bays
          for (const stopZ of depth === 12 ? [z - .55, z + .55] : [z - 2.4]) {
            box(group, bayX, .16, stopZ, 1.6, .2, .23, "#41494a").name = `parking-${name}-wheel-stop`
            box(group, bayX, .27, stopZ, .5, .025, .24, "#e6c86a")
          }
        }
        for (let dx = -width / 2 + .5; dx < width / 2; dx += .75)
          box(group, x + dx, .058, z, .035, .018, depth, "#bcc0a9")

      }
      box(group, 2.5, .08, -19, 3, .04, 6, "#3b88a7").name = "parking-accessible-bay"
      for (const dx of [-1.5, 1.5]) box(group, 2.5 + dx, .11, -19, .13, .025, 6, "#f4f2e9")
      // Satellite image: the open outer apron is unpaved, not another row of marked bays.
      const dirtShape = new THREE.Shape()
      const dirtCorners = [[-22, 13], [20, 13], [20, -9], [26.5, -9], [26.5, 19.5], [21, 25], [-22, 25]]
      dirtCorners.forEach(([x, z], i) => i ? dirtShape.lineTo(x, -z) : dirtShape.moveTo(x, -z))
      dirtShape.closePath()
      const dirtSurface = new THREE.Mesh(new THREE.ShapeGeometry(dirtShape), new THREE.MeshStandardMaterial({ color: "#a59c7d", roughness: 1 }))
      dirtSurface.name = "parking-dirt-apron"
      dirtSurface.rotation.x = -Math.PI / 2
      dirtSurface.position.y = .02
      dirtSurface.receiveShadow = true
      group.add(dirtSurface)
      const accessibleMark = new THREE.Group()
      accessibleMark.name = "parking-accessible-symbol"
      accessibleMark.position.set(2.5, .14, -19)
      group.add(accessibleMark)
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(.6, .07, 6, 24, Math.PI * 1.7), new THREE.MeshStandardMaterial({ color: "#ffffff" }))
      wheel.rotation.x = -Math.PI / 2
      wheel.position.z = .4
      accessibleMark.add(wheel)
      box(accessibleMark, .1, 0, -.3, .12, .03, 1.1, "#ffffff")
      box(accessibleMark, .45, 0, .2, .75, .03, .12, "#ffffff")
      box(accessibleMark, .8, 0, .5, .12, .03, .7, "#ffffff")
      const head = new THREE.Mesh(new THREE.CircleGeometry(.18, 16), wheel.material)
      head.rotation.x = -Math.PI / 2
      head.position.set(.1, .01, -1)
      accessibleMark.add(head)
      // Direction marks stay in the driving aisles, outside the parking rectangles.
      for (const z of [-10.5, 10.5]) {
        box(group, 0, .025, z, 3, .025, .18, "#fffdf1").name = "parking-aisle-arrow"
        for (const angle of [-Math.PI / 4, Math.PI / 4]) {
          const tip = box(group, 1.2, .025, z + (angle > 0 ? .32 : -.32), 1, .025, .15, "#fffdf1")
          tip.rotation.y = angle
        }
      }
      // Road-side apron is kept open for entry; the far corner follows the clipped site boundary.
      box(group, 25, .005, -10, 4, .025, 10, "#c9c8ba").name = "parking-entry"
      group.traverse(object => { object.userData.buildingId = b.id })
      continue
    }
    if (b.id === "container") {
      // ponytail: dimensions are estimated from the two supplied facade photographs; replace with measured sizes.
      const concrete = "#aaa390", steel = "#293b41"
      box(group, 0, .08, 0, b.width, .16, b.depth, steel).name = "container-floor"
      box(group, 0, 3.2, 0, b.width, .22, b.depth, steel).name = "container-upper-floor"
      box(group, 0, b.height + .1, 0, b.width + .2, .2, b.depth + .2, steel).name = "container-roof"
      box(group, 0, b.height / 2, -front, b.width, b.height, .12, concrete).name = "container-wall-back"
      for (const [side, x] of [["left", -b.width / 2], ["right", b.width / 2]] as const)
        box(group, x, b.height / 2, 0, .12, b.height, b.depth, concrete).name = `container-wall-${side}`
      box(group, 0, b.height / 2, front, b.width, b.height, .12, concrete).name = "container-wall-front"
      for (const level of [0, 1]) {
        const y = level * 3.2
        box(group, -.45, y + 1.65, front + .12, 3.2, 1.85, .14, "#e2e1d7").name = `container-window-frame-${level}`
        box(group, -.45, y + 1.65, front + .21, 2.94, 1.6, .08, "#45636f").name = `container-window-glass-${level}`
        box(group, -.45, y + 1.65, front + .27, .09, 1.6, .04, "#e2e1d7")
        for (let panelX = -3; panelX <= 3; panelX += 1) {
          box(group, panelX, y + 1.6, front + .07, .018, 3.05, .025, "#898577")
        }
        for (const panelY of [.55, 2.8]) box(group, 0, y + panelY, front + .075, 6, .02, .025, "#898577")
        box(group, 2.35, y + 1.5, front + .09, 1.3, 3, .1, steel).name = `container-dark-panel-${level}`
      }
      for (const y of [4.25, 4.8, 5.35]) box(group, -.45, y, front + .4, 3.2, .07, .07, steel).name = `container-window-guard-${y}`
      box(group, 2.25, 1.2, front + .19, 1.2, 2.4, .12, steel).name = "container-door"
      box(group, 3.05, 4.4, 1, .14, 2.4, 1.15, steel).name = "container-upper-door"
      box(group, 3.75, 3.2, 1, 1.5, .15, 1.2, steel).name = "container-stair-landing"
      for (let step = 0; step < 12; step++) {
        box(group, 3.75, (step + 1) * 3.2 / 12, 5 - step * .3, 1.4, .12, .33, steel).name = `container-stair-step-${step + 1}`
        if (step % 3 === 0) box(group, 4.45, (step + 1) * 3.2 / 12 + .5, 5 - step * .3, .06, 1, .06, steel)
      }
      const rail = box(group, 4.45, 2.7, 3.3, .07, .07, 4.65, steel)
      rail.rotation.x = Math.atan(3.2 / 3.6)
      rail.name = "container-stair-handrail"
      group.traverse(object => { object.userData.buildingId = b.id })
      continue
    }
    box(group, 0, b.height / 2, 0, b.width, b.height, b.depth, "#dedfdc")
    box(group, 0, b.height + .1, 0, b.width + .3, .22, b.depth + .3, "#babfbe")
    if (b.id !== "love") {
      const width = b.id === "hope" ? 6 : b.width
      box(group, (width - b.width) / 2, (b.height + 3) / 2, front + .06, width, b.height - 3, .18, "#bd522e")
      for (let x = -b.width / 2; x < -b.width / 2 + width; x += .65)
        box(group, x, (b.height + 3) / 2, front + .18, .065, b.height - 3, .07, "#a33f25")
      if (b.id === "faith") {
        box(group, b.width / 2 + .06, 7.5, 0, .18, 9, b.depth, "#b3492a")
        box(group, 4, 15, 0, .25, 6, .25, "#fafbf7")
        box(group, 4, 16.1, 0, 2.8, .25, .25, "#fafbf7")
      }
    }
    const floors = b.id === "love" ? [6.5, 11] : b.id === "hope" ? [] : [1.5, 5]
    for (const y of floors) {
      for (let x = -b.width / 2 + 2.6; x < b.width / 2 - 1; x += b.id === "faith" ? 4.8 : 5.5) {
        box(group, x, y, front + .21, b.id === "love" ? 6 / group.scale.x : 1.7, 1.5, .16, "#f4f3eb")
        box(group, x, y + .08, front + .31, b.id === "love" ? 5.7 / group.scale.x : 1.4, 1.17, .08, "#457c93")
        if (b.id === "love") box(group, x, y, front + .38, .1, 1.4, .06, "#e8eee9")
      }
    }
    if (b.id === "love") {
      for (let y = 3.8; y < 15; y += 3.6) box(group, 0, y, front + .025, 25, .035, .02, "#b7bfbd")
      for (let x = -10; x < 13; x += 4) box(group, x, 7.5, front + .026, .035, 15, .02, "#b7bfbd")
      box(group, 8, 16.5, -4, 6, 3, 7, "#d4d6d3")
      // Rooftop court frame, visible in all supplied photographs.
      for (const z of [-7, 7]) {
        for (let x = -11; x <= 5; x += 4) box(group, x, 17, z, .09, 4, .09, "#50615f")
        box(group, -3, 19, z, 16, .09, .09, "#50615f")
        box(group, -3, 16.5, z, 16, .04, .04, "#879390")
        for (let x = -11; x <= 5; x += .8) box(group, x, 17, z, .018, 4, .018, "#879390")
      }
      for (const x of [-11, 5]) box(group, x, 19, 0, .09, .09, 14, "#50615f")
    }
    if (b.id === "hope") {
      // One continuous cafe facade; the rear footprint and Faith Room passage stay clear.
      box(group, -14.5, 4, 0, 9, 8, 21, "#dedfdc").name = "hope-left-wing"
      box(group, -14.5, 8.1, 0, 9.3, .22, 21.3, "#babfbe").name = "hope-left-wing-roof"
      box(group, -14.5, 5.5, front + .06, 9, 5, .18, "#bd522e")
      for (let x = -19; x < -10; x += .65)
        box(group, x, 5.5, front + .18, .065, 5, .07, "#a33f25")
      for (const x of [-16.5, -12]) {
        box(group, x, 5.5, front + .25, 3.1, 2.3, .16, "#efeee5")
        box(group, x, 5.5, front + .35, 2.85, 2.05, .08, "#466472")
        box(group, x, 5.5, front + .41, .08, 2.05, .05, "#efeee5")
        box(group, x, 4.95, front + .41, 2.85, .08, .05, "#efeee5")
      }
      const cafe = new THREE.Group()
      cafe.name = "hope-cafe"
      group.add(cafe)
      box(cafe, -11.5, 1.45, front + .42, 14, 2.9, .2, "#3d6570").name = "koinonia-cafe-side-glazing"
      for (let i = 0; i <= 12; i++)
        box(cafe, -18.5 + i * 14 / 12, 1.45, front + .55, .09, 2.9, .1, "#263b40").name = "cafe-folding-door-frame"
      for (const y of [.06, 2.88]) box(cafe, -11.5, y, front + .55, 14, .12, .1, "#263b40")
      box(group, -11.5, .02, front + 1, 14, .05, 1.1, "#638053").name = "koinonia-cafe-turf"
      for (const z of [10.2, 14.2]) {
        const table = new THREE.Group()
        table.name = "cafe-picnic-table"
        table.position.set((-32.9 - b.x) / group.scale.x, 0, z)
        table.rotation.y = Math.PI / 2
        table.scale.z = 1 / group.scale.x
        group.add(table)
        box(table, 0, .95, 0, 2.2, .14, 1.5, "#6f6656")
        for (const dz of [-1, 1]) {
          box(table, 0, .5, dz, 2.5, .12, .4, "#6f6656")
          for (const dx of [-.8, .8]) box(table, dx, .3, dz, .12, .6, .12, "#354240")
        }
        for (const dx of [-.8, .8]) box(table, dx, .48, 0, .12, .95, .12, "#354240")
      }

    }
    if (b.id === "love") {
      // Street-facing short wall: two tall window stacks, independent of the long facade scale.
      for (const z of [-4.5, 3]) {
        box(group, -12.57, 9, z, .1, 6.8, 1.8, "#efeee5").name = "love-end-window-frame"
        box(group, -12.64, 9, z, .08, 6.5, 1.5, "#466472").name = "love-end-window-glass"
        for (const y of [6.3, 7.7, 9.1, 10.5, 11.9]) box(group, -12.7, y, z, .035, .09, 1.55, "#e5e4db")
      }
      // The outer left facade has its own door; the courtyard-side door remains at the corner.
      const outer = new THREE.Group()
      outer.name = "love-outer-facade"
      outer.rotation.y = Math.PI
      group.add(outer)
      outer.scale.x = 1 / group.scale.x
      entrance(outer, "love-outer-entry", 15, front + .25, 1.8, 1).scale.x = 1
      box(outer, 15, 3.2, front + .6, 2.8, .45, 1.3, "#d16b35")
      for (const y of [6.5, 11]) {
        box(outer, 15, y, front + .16, 1.8, 1.8, .1, "#efeee5")
        box(outer, 15, y, front + .24, 1.55, 1.55, .08, "#466472")
      }
      const folding = entrance(group, "love-main-entry", 1, front + .42, 8.2, 8)
      box(folding, 0, 2.98, .18, 8.5, .12, .23, "#747e80").name = "love-folding-door-track"
      for (let panel = 1; panel < 8; panel++) {
        const x = -4.1 + panel * 8.2 / 8
        for (const y of [.5, 1.5, 2.5]) box(folding, x, y, .2, .12, .14, .08, "#717c7f").name = "love-folding-door-hinge"
      }
      entrance(group, "love-tower-entry", 9, front + .42, 2.4, 2)
      entrance(group, "love-side-entry", -8.2, front + .42, 1.8, 1)
      box(group, 4.5, 3.2, front + .7, 12.5, .48, 1.3, "#d16b35").name = "love-main-canopy"
      box(group, -8.2, 3.2, front + .7, 2, .48, 1.3, "#d16b35")
      for (const [x, width] of [[-5.5, 1], [-3, 1], [6.1, 2.8], [11, .7]]) {
        box(group, x, 1.7, front + .16, width, 1.65, .14, "#efeee5").name = "love-ground-window-frame"
        box(group, x, 1.7, front + .25, width - .12, 1.43, .08, "#466472")
        box(group, x, 1.4, front + .31, width, .08, .05, "#efeee5")
        if (width > 2) box(group, x, 1.7, front + .31, .06, 1.5, .05, "#efeee5")
      }
      for (const x of [8, 8.8, 9.6, 10.4])
        box(group, x, .6, front + 1.55, .04, 1.05, .05, "#697675").name = "love-entry-railing"
      box(group, 9.2, 1.12, front + 1.55, 2.4, .06, .06, "#697675")
      const lettering = new THREE.Group()
      lettering.scale.x = 1 / group.scale.x
      group.add(lettering)
      sign(lettering, "LOVE", 9 * group.scale.x, 3.2, front + 1.38, 1.7)
      sign(lettering, "GOD is LOVE", 0, 13.2, front + .25, 10, "#b95c42")
      sign(lettering, "원당교회", 8 * group.scale.x, 17.3, -.4, 7)
      emblem(lettering, 8 * group.scale.x - 4.5, 17.3, -.4)
    } else if (b.id === "hope") {
      // Photo: four tall upper windows and two smaller windows beside the entry.
      for (const [x, y, height] of [[-1.2, 5.6, 2], [2.1, 5.6, 2], [5.5, 5.6, 2], [8.9, 5.6, 2], [5.2, 1.7, 1.7], [8.3, 1.7, 1.7]]) {
        box(group, x, y, front + .16, .85, height, .14, "#efeee5").name = y > 3 ? "hope-upper-window" : "hope-ground-window"
        box(group, x, y, front + .26, .63, height - .22, .08, "#466472")
        box(group, x, y - height * .22, front + .32, .85, .09, .04, "#efeee5")
      }
      box(group, -7, 5.5, front + .25, 3.1, 2.3, .16, "#efeee5")
      box(group, -7, 5.5, front + .35, 2.85, 2.05, .08, "#466472")
      box(group, -7, 5.5, front + .41, .08, 2.05, .05, "#efeee5")
      box(group, -7, 4.95, front + .41, 2.85, .08, .05, "#efeee5")
      for (const y of [1, 2.2, 4, 5.3, 6.6, 7.8]) box(group, 3, y, front + .025, 14, .025, .025, "#b4bcba")
      for (const x of [-4, -.5, 3, 6.5, 10]) box(group, x, 4, front + .025, .025, 8, .025, "#b4bcba")
      entrance(group, "hope-main-entry", .3, front + .42, 3.8, 4)
      box(group, .3, 3.2, front + .7, 8.6, .48, 1.3, "#d16b35").name = "hope-entry-canopy"
      sign(group, "HOPE", .3, 3.2, front + 1.38, 1.5)
    } else {
      // The white entrance wing shares the hall's front line, below the taller red volume.
      box(group, -17, 4.5, 1.25, 8, 9, 20.5, "#dedfdc").name = "faith-entry-wing"
      box(group, -17, 9.1, 1.25, 8.2, .2, 20.7, "#babfbe")
      for (const y of [4.8, 6.2, 7.6]) box(group, -17, y, front + .025, 8, .035, .03, "#b4bcba")
      for (const x of [-19, -17, -15]) box(group, x, 6.4, front + .025, .035, 5.1, .03, "#b4bcba")
      const entry = entrance(group, "faith-main-entry", -18.3, front + .22, 3.6, 4)
      entry.position.y = .5
      box(group, -17, 3.8, front + .65, 8.3, .48, 1.3, "#d16b35").name = "faith-entry-canopy"
      sign(group, "FAITH", -17, 3.8, front + 1.33, 1.8)
      box(group, -14.3, 2.2, front + .14, 1.15, 1.8, .18, "#efeee5")
      box(group, -14.3, 2.35, front + .25, .95, 1.27, .08, "#466472")
      box(group, -14.3, 1.55, front + .25, .95, .25, .08, "#466472")
      box(group, -17, .3, front + .8, 7.8, .6, 1.6, "#b5b4a9").name = "faith-entry-landing"
      for (let i = 0; i < 3; i++)
        box(group, -18.3, .1 * (3 - i), front + 1.8 + i * .4, 4.1, .2 * (3 - i), .4, "#b5b4a9").name = `faith-entry-step-${i}`
      const ramp = box(group, -9.1, .32, front + .8, 8, .12, 1.6, "#b5b4a9")
      ramp.name = "faith-entry-ramp"
      ramp.rotation.z = -Math.atan(.6 / 8)
      for (const z of [front + .08, front + 1.52]) {
        for (let i = 0; i <= 8; i++)
          box(group, -13.1 + i, 1.1 - i * .075, z, .065, 1, .065, "#697675")
        const rail = box(group, -9.1, 1.3, z, 8, .07, .07, "#697675")
        rail.rotation.z = ramp.rotation.z
        rail.name = "faith-ramp-handrail"
      }
      sign(group, "원당교회", 5, 10.5, front + .35, 7)
      emblem(group, .4, 10.5, front + .35)
      const side = new THREE.Group()
      side.position.set(13.2, 0, 0)
      side.rotation.y = Math.PI / 2
      group.add(side)
      sign(side, "원당교회", 0, 10.5, .1, 7)
      emblem(side, -4.6, 10.5, .1)
      for (let z = -11; z <= 11; z += .65) box(group, 13.19, 7.5, z, .07, 9, .065, "#a33f25")

    }
    group.traverse(object => { object.userData.buildingId = b.id })
  }
  const landscape = new THREE.Group()
  landscape.name = "landscape"
  campus.add(landscape)
  box(landscape, 39, -.09, 24, 8, .12, 82, "#686e6b").name = "boundary-road"
  for (const [z, length] of [[1, 36], [44.5, 41]]) box(landscape, 34.5, -.02, z, 1, .12, length, "#c0beb1").name = "road-sidewalk"
  box(landscape, 33, .005, 21.5, 5, .04, 5, "#c9c8ba").name = "driveway-threshold"
  box(landscape, 32, .9, 18.8, .65, 1.8, .65, "#d56d33").name = "entry-barrier-post"
  box(landscape, 32, 1.45, 21.3, .12, .16, 5, "#f4f3e9").name = "entry-barrier-arm"
  for (const z of [19.5, 21, 22.5]) box(landscape, 32, 1.45, z, .14, .18, .55, "#b94937")
  box(landscape, 32, 1.4, 16, .4, 2.8, 3.5, "#303b40").name = "entry-notice-board"
  for (const z of [14.1, 17.9]) box(landscape, 32, 1.55, z, .65, 3.1, .55, "#b65b3b")
  for (const z of [-10, 0, 10, 30, 40, 50, 60]) box(landscape, 39, -.018, z, .12, .025, 4, "#dedcc5")
  box(landscape, -23.5, -.03, 34.5, 3, .04, 51, "#c9c8ba").name = "love-courtyard-paving"
  box(landscape, -31.5, -.03, 10.85, 13, .04, 9.7, "#c9c8ba").name = "faith-room-courtyard-paving"
  box(landscape, -23.5, -.03, 8.75, 3, .04, .5, "#c9c8ba").name = "cafe-courtyard-connection"
  // Love-side vehicle entrance connects the front road to the existing paved aisle.
  box(landscape, -5.5, -.1, 69, 79, .15, 6, "#686e6b").name = "front-road"
  for (const [x, width] of [[-34.9, 20.2], [8.5, 51]]) box(landscape, x, -.01, 65, width, .12, 2, "#b7afa0")
  box(landscape, -20.9, .025, 56, 7.8, .08, 20, "#c9c8ba").name = "love-driveway"
  for (const x of [-24.65, -17.15]) box(landscape, x, .075, 55, .15, .025, 18, "#fffdf1").name = "love-driveway-line"
  box(landscape, -20.9, .07, 64, 7.8, .035, 1.1, "#bf9676").name = "love-driveway-crossing"
  box(landscape, -24.65, .85, 62.5, .65, 1.7, .65, "#d56d33").name = "love-barrier-post"
  box(landscape, -25.01, 1.25, 62.5, .09, .65, .38, "#354247")
  box(landscape, -21, 1.45, 62.5, 7.3, .15, .12, "#f8f6ee").name = "love-barrier-arm"
  for (const x of [-22, -20.5, -19]) box(landscape, x, 1.45, 62.5, .5, .17, .14, "#b84632")
  box(landscape, -20.25, 1.15, 62.5, 1.2, .4, .08, "#f8f6ee").name = "love-barrier-notice"
  const treePositions = [
    ...[-38, -28, -8, 2, 12, 22, 30].map(x => [x, 63]),
    ...[-10, 0, 32, 42, 52].map(z => [33, z]),
    ...[-12, 0, 12, 25, 38, 52].map(z => [-44, z]),
    ...[-34, -20, -6, 8, 22, 33].map(x => [x, -27]),
  ]
  const crownGeometry = new THREE.IcosahedronGeometry(1, 1)
  const leafMaterials = ["#526e47", "#6b8052", "#789060"].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1 }))
  treePositions.forEach(([x, z], i) => {
    const tree = new THREE.Group()
    tree.name = `landscape-tree-${i + 1}`
    tree.position.set(x, 0, z)
    landscape.add(tree)
    const height = 3.6 + (i % 4) * .4
    box(tree, 0, height / 2, 0, .25, height, .25, "#796b51")
    for (const [dx, dy, dz, scale] of [[0, 0, 0, 1.8], [-.8, -.4, .3, 1.3], [.7, -.3, -.4, 1.45]]) {
      const crown = new THREE.Mesh(crownGeometry, leafMaterials[i % 3])
      crown.position.set(dx, height + dy, dz)
      crown.scale.set(scale, scale * 1.15, scale)
      crown.castShadow = true
      tree.add(crown)
    }
    box(tree, 0, .18, 0, 1.9, .36, 1.6, "#72805b").name = "shrub-bed"
  })
  return { campus, groups }
}
