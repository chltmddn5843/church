import * as THREE from "three"

// ponytail: photo-estimated exterior dimensions; replace these with surveyed footprints when available.
export const campusBuildings = [
  { id: "love", name: "사랑관", english: "LOVE", position: "왼쪽 · 앞뒤로 길게 놓인 3층 건물 · 소망관 사이에 컨테이너", floors: [
    { floor: "1F", rooms: "식당 · 화장실" },
    { floor: "2F", rooms: "초등부 예배실" },
    { floor: "3F", rooms: "디모데홀 · 요셉홀 · 지혜방 · 열매방" },
  ], color: "#2677aa", x: -34, z: 5, width: 25, depth: 18, height: 15, rotation: Math.PI / 2 },
  { id: "hope", name: "소망관", english: "HOPE", position: "정면 · 사랑관 옆에서 믿음관으로 이어지는 건물", floors: [
    { floor: "1F", rooms: "카페 · 유아부 · 유년부 예배실" },
    { floor: "2F", rooms: "다윗홀 · 요셉홀 · 다니엘홀" },
  ], color: "#b77b25", x: -8, z: -3, width: 12, depth: 14, height: 8, rotation: 0 },
  { id: "faith", name: "믿음관", english: "FAITH", position: "제일 오른쪽 · 십자가가 있는 주황색 건물", floors: [
    { floor: "1F", rooms: "비전홀 (예배당)" },
  ], color: "#bb502f", x: 19, z: -3, width: 26, depth: 23, height: 12, rotation: 0 },
  { id: "container", name: "컨테이너", english: "CONTAINER", position: "사랑관과 소망관 사이 · 두 건물 사이의 공간", floors: [
    { floor: "외부", rooms: "사랑관과 소망관 사이 컨테이너" },
  ], color: "#687e84", x: -20, z: -7, width: 4.4, depth: 4, height: 3, rotation: 0 },
  { id: "parking", name: "마당 · 주차장", english: "PARKING", position: "교회 앞 · 넓은 사각형 마당", floors: [
    { floor: "외부", rooms: "주차 공간 · 가운데 차량 통행 공간" },
  ], color: "#6a8473", x: 0, z: 44, width: 90, depth: 48, height: .1, rotation: 0 },
] as const
export type BuildingId = (typeof campusBuildings)[number]["id"]

export function createCampus() {
  const campus = new THREE.Group()
  const groups = new Map<BuildingId, THREE.Group>()
  const materials = new Map<string, THREE.MeshStandardMaterial>()
  function box(parent: THREE.Group, x: number, y: number, z: number, w: number, h: number, d: number, color: string) {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .82 }))
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), materials.get(color))
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  box(campus, 0, -.65, 24, 98, 1, 98, "#d9dedc")
  for (const b of campusBuildings) {
    const group = new THREE.Group()
    group.name = b.id
    group.position.set(b.x, 0, b.z)
    group.rotation.y = b.rotation
    campus.add(group)
    groups.set(b.id, group)
    const front = b.depth / 2
    if (b.id === "parking") {
      box(group, 0, -.08, 0, b.width, .12, b.depth, "#cecfca")
      // ponytail: parking bay counts are schematic until a measured parking plan is supplied.
      for (const z of [-15, 15]) {
        for (const x of [-30, -10, 10, 30]) {
          box(group, x, .01, z, 16, .08, 9, "#9eaf92")
          for (let dx = -8; dx <= 8; dx += 4) box(group, x + dx, .07, z, .13, .04, 9, "#f3f1e7")
          for (const dz of [-4.5, 4.5]) box(group, x, .07, z + dz, 16, .04, .13, "#f3f1e7")
          for (let dx = -7; dx < 8; dx += 1) box(group, x + dx, .06, z, .035, .02, 9, "#d1d5c6")
        }
      }
      group.traverse(object => { object.userData.buildingId = b.id })
      continue
    }
    if (b.id === "container") {
      // ponytail: obscured in the reference photo; use a simple shell until exterior details are supplied.
      box(group, 0, 1.5, 0, b.width, 3, b.depth, "#aab9b6")
      box(group, 0, 3.1, 0, b.width + .2, .2, b.depth + .2, "#6f8282")
      for (let x = -2; x <= 2; x += .4) box(group, x, 1.5, front + .03, .045, 2.9, .06, "#819594")
      box(group, 1, 1.2, front + .1, 1.15, 2.4, .12, "#546c71")
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
      for (let x = -5.8; x <= -.6; x += 1.3) box(group, x, 1.45, front + .55, .09, 2.9, .1, "#e4e4db")
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
  // Landscaping is schematic; it is not a navigable path or a surveyed boundary.
  for (const x of [-40, -34, 32, 39]) {
    box(campus, x, 1, 71, .3, 2, .3, "#786854")
    const tree = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1), new THREE.MeshStandardMaterial({ color: "#668b69", roughness: 1 }))
    tree.position.set(x, 3, 71)
    tree.castShadow = true
    campus.add(tree)
  }
  return { campus, groups }
}
