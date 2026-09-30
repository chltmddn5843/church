import * as THREE from "three"

// ponytail: photo-estimated exterior dimensions; replace these with surveyed footprints when available.
export const campusBuildings = [
  { id: "love", name: "사랑관", english: "LOVE", position: "왼쪽 · 앞뒤로 길게 놓인 3층 건물 · 소망관 사이에 컨테이너", floors: [
    { floor: "1F", rooms: "식당 · 화장실" },
    { floor: "2F", rooms: "초등부 예배실" },
    { floor: "3F", rooms: "디모데홀 · 로뎀방 · 지혜방 · 열매방" },
  ], color: "#2677aa", x: -34, z: 22.5, width: 60, depth: 18, height: 15, rotation: Math.PI / 2 },
  { id: "hope", name: "소망관", english: "HOPE", position: "정면 · 사랑관 옆 · 믿음관과 좁은 틈으로 분리된 건물", floors: [
    { floor: "1F", rooms: "코이노니아 카페 · 유아부 예배실" },
    { floor: "2F", rooms: "다윗홀 · 요셉홀 · 다니엘홀" },
  ], color: "#b77b25", x: -8, z: -3, width: 12, depth: 14, height: 8, rotation: 0 },
  { id: "faith", name: "믿음관", english: "FAITH", position: "제일 오른쪽 · 십자가가 있는 주황색 건물", floors: [
    { floor: "1F", rooms: "비전홀 (예배당)" },
  ], color: "#bb502f", x: 20.5, z: -3, width: 26, depth: 23, height: 12, rotation: 0 },
  { id: "container", name: "컨테이너", english: "CONTAINER", position: "사랑관과 소망관 사이 · 두 건물 사이의 공간", floors: [
    { floor: "1F", rooms: "컨테이너 하층 · 앞쪽 카페 야외 공간" },
    { floor: "2F", rooms: "컨테이너 상층 · 오른쪽 외부 계단" },
  ], color: "#687e84", x: -20, z: -6, width: 6, depth: 4, height: 6.4, rotation: 0 },
  { id: "parking", name: "마당 · 주차장", english: "PARKING", position: "사랑관 옆 · 소망관과 믿음관 앞의 부지 안쪽 마당", floors: [
    { floor: "외부", rooms: "중앙 두 줄 주차 · 건물 앞·마당 앞쪽 주차 · 차량 통행로" },
  ], color: "#6a8473", x: 5, z: 34.5, width: 54, depth: 51, height: .1, rotation: 0 },
] as const
export type BuildingId = (typeof campusBuildings)[number]["id"]

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
  box(campus, -5.5, -.65, 24.5, 79, 1, 82, "#899577").name = "site-base"
  for (const building of campusBuildings) {
    // Preserve the photographed facade divisions while extending Love to the front setback.
    const b = building.id === "love" ? { ...building, width: 25 } : building
    const group = new THREE.Group()
    group.name = b.id
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
      const paving = new THREE.Mesh(new THREE.ShapeGeometry(footprint), new THREE.MeshStandardMaterial({ color: "#c9c8ba", roughness: 1 }))
      paving.rotation.x = -Math.PI / 2
      paving.position.y = -.01
      paving.receiveShadow = true
      paving.name = "parking-paved-boundary"
      group.add(paving)
      // The central paired rows and the building-side row leave continuous driving aisles.
      for (const [name, x, z, width, depth, bays] of [
        ["central", -2, -1, 36, 12, 12],
        ["building", 10, -19, 30, 6, 10],
        ["front", -3, 19, 42, 6, 14],
      ] as const) {
        box(group, x, .025, z, width, .05, depth, "#8c9b7c").name = `parking-${name}-pavers`
        for (let offset = -width / 2; offset <= width / 2; offset += width / bays)
          box(group, x + offset, .065, z, .16, .03, depth, "#fffdf1").name = `parking-${name}-bay-line`
        for (let dz = -depth / 2; dz <= depth / 2; dz += 6)
          box(group, x, .065, z + dz, width, .03, .16, "#fffdf1")
        for (let dx = -width / 2 + .5; dx < width / 2; dx += .75)
          box(group, x + dx, .058, z, .035, .018, depth, "#bcc0a9")
      }
      box(group, -6.5, .08, -19, 3, .04, 6, "#3b88a7").name = "parking-accessible-bay"
      for (const dx of [-1.5, 1.5]) box(group, -6.5 + dx, .11, -19, .13, .025, 6, "#f4f2e9")
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
    const floors = b.id === "love" ? [2, 6.5, 11] : b.id === "hope" ? [5.5] : [1.5, 5]
    for (const y of floors) {
      for (let x = -b.width / 2 + 2.6; x < b.width / 2 - 1; x += b.id === "faith" ? 4.8 : 5.5) {
        box(group, x, y, front + .21, b.id === "love" ? 4 : 1.7, 1.5, .16, "#f4f3eb")
        box(group, x, y + .08, front + .31, b.id === "love" ? 3.7 : 1.4, 1.17, .08, "#457c93")
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
      const cafe = box(group, -3.2, 1.45, front + .42, 5.3, 2.9, .2, "#3d6570")
      cafe.name = "hope-cafe"
      for (let x = -5.8; x <= -.6; x += 1.3) box(group, x, 1.45, front + .55, .09, 2.9, .1, "#263b40")
      box(group, -6.1, 1.45, 1, .18, 2.9, 11, "#3d6570").name = "koinonia-cafe-side-glazing"
      for (let z = -4.5; z <= 6.5; z += 1.1) box(group, -6.23, 1.45, z, .1, 2.9, .07, "#263b40")
      box(group, -6.7, .02, 1, 1.1, .05, 11, "#638053").name = "koinonia-cafe-turf"
      for (const [x, z] of [[-12, 4], [-9, 7]] as const) {
        box(group, x, .95, z, 2.2, .14, 1.5, "#6f6656").name = "cafe-picnic-table"
        for (const dz of [-1, 1]) {
          box(group, x, .5, z + dz, 2.5, .12, .4, "#6f6656")
          for (const dx of [-.8, .8]) box(group, x + dx, .3, z + dz, .12, .6, .12, "#354240")
        }
        for (const dx of [-.8, .8]) box(group, x + dx, .48, z, .12, .95, .12, "#354240")
      }
      box(group, -7.1, 1.2, 5.4, .12, 2.4, .8, "#a34245").name = "koinonia-cafe-signboard"

    }
    if (b.id !== "faith") {
      box(group, 1, 1.4, front + .42, 5, 2.8, .2, "#3d6570")
      for (let x = -1.5; x <= 3.5; x += 1) box(group, x, 1.4, front + .55, .09, 2.8, .1, "#e4e4db")
      box(group, 1, 3.2, front + .7, b.id === "love" ? 17 : 10, .48, 1.3, "#d16b35")
    } else {
      box(group, -17, 2.7, -2, 8, 5.4, 14, "#dedfdc")
      box(group, -17, 1.4, 5.1, 5, 2.8, .2, "#3d6570")
      box(group, -17, 3.2, 5.6, 8.3, .48, 1.3, "#d16b35")
    }
    group.traverse(object => { object.userData.buildingId = b.id })
  }
  const landscape = new THREE.Group()
  landscape.name = "landscape"
  campus.add(landscape)
  box(landscape, 39, -.09, 24, 8, .12, 82, "#686e6b").name = "boundary-road"
  box(landscape, 34.5, -.02, 24, 1, .12, 82, "#c0beb1").name = "road-sidewalk"
  for (const z of [-10, 0, 10, 30, 40, 50, 60]) box(landscape, 39, -.018, z, .12, .025, 4, "#dedcc5")
  box(landscape, -33, -.06, 57, 20, .1, 8, "#c9c8ba").name = "front-open-ground"
  box(landscape, -22.8, -.015, 28, 1.1, .15, 35, "#bfbeaa").name = "courtyard-edge"
  const treePositions = [
    ...[-38, -28, -18, -8, 2, 12, 22, 30].map(x => [x, 63]),
    ...[-10, 0, 32, 42, 52].map(z => [33, z]),
    ...[-12, 0, 12, 25, 38, 52].map(z => [-44, z]),
    ...[-34, -20, -6, 8, 22, 33].map(x => [x, -17]),
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
