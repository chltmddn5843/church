from pathlib import Path
p=Path('lib/campus-model.ts');s=p.read_text().replace('import * as THREE from "three"','import * as THREE from "three"\nimport { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"\nimport { campusSigns } from "./campus-signs.ts"')
a=s.index('  box(campus, -5.5')
s=s[:a]+'''  function sign(parent: THREE.Group, text: keyof typeof campusSigns, x: number, y: number, z: number, width: number, color = "#f6f3e7") {
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
''' +s[a:]
s=s.replace('b.id === "love" ? [2, 6.5, 11]', 'b.id === "love" ? [6.5, 11]')
s=s.replace('b.id === "love" ? 4 : 1.7','b.id === "love" ? 6 / group.scale.x : 1.7').replace('b.id === "love" ? 3.7 : 1.4','b.id === "love" ? 5.7 / group.scale.x : 1.4')
a=s.index('    if (b.id !== "faith") {');e=s.index('    group.traverse',a)
s=s[:a]+'''    if (b.id === "love") {
      entrance(group, "love-main-entry", 1, front + .42, 8, 6)
      entrance(group, "love-tower-entry", 9, front + .42, 2.4, 2)
      entrance(group, "love-side-entry", -10, front + .42, 1.8, 1)
      box(group, 1, 3.2, front + .7, 19, .48, 1.3, "#d16b35")
      box(group, -10, 3.2, front + .7, 1.3, .48, 1.3, "#d16b35")
      const lettering = new THREE.Group()
      lettering.scale.x = 1 / group.scale.x
      group.add(lettering)
      sign(lettering, "LOVE", 21, 3.2, front + 1.38, 1.7)
      sign(lettering, "GOD is LOVE", 0, 13.2, front + .25, 10, "#b95c42")
      sign(lettering, "원당교회", 20, 17.3, -.4, 7)
      emblem(lettering, 15.5, 17.3, -.4)
    } else if (b.id === "hope") {
      entrance(group, "hope-main-entry", 2.5, front + .42, 3.8, 4)
      box(group, 2.5, 3.2, front + .7, 6, .48, 1.3, "#d16b35")
      sign(group, "HOPE", 2.5, 3.2, front + 1.38, 1.5)
    } else {
      box(group, -17, 2.7, -2, 8, 5.4, 14, "#dedfdc")
      entrance(group, "faith-main-entry", -17, 5.2, 4.8, 4)
      box(group, -17, 3.2, 5.6, 8.3, .48, 1.3, "#d16b35")
      sign(group, "FAITH", -17, 3.2, 6.3, 1.8)
      sign(group, "원당교회", 5, 10.5, front + .35, 7)
      emblem(group, .4, 10.5, front + .35)
      const side = new THREE.Group()
      side.position.set(13.2, 0, 0)
      side.rotation.y = Math.PI / 2
      group.add(side)
      sign(side, "원당교회", 0, 10.5, .1, 7)
      emblem(side, -4.6, 10.5, .1)
      for (let z = -11; z <= 11; z += .65) box(group, 13.19, 7.5, z, .07, 9, .065, "#a33f25")
      for (const x of [-20, -14]) {
        for (let z = 6.4; z <= 8.4; z += 1) box(group, x, .65, z, .06, 1.1, .06, "#88918e")
        box(group, x, 1.2, 7.4, .07, .07, 2, "#88918e")
      }
    }
''' +s[e:]
s=s.replace('box(landscape, 34.5, -.02, 24, 1, .12, 82, "#c0beb1").name = "road-sidewalk"','''for (const [z, length] of [[1, 36], [44.5, 41]]) box(landscape, 34.5, -.02, z, 1, .12, length, "#c0beb1").name = "road-sidewalk"
  box(landscape, 33, .005, 21.5, 5, .04, 5, "#c9c8ba").name = "driveway-threshold"
  box(landscape, 32, .9, 18.8, .65, 1.8, .65, "#d56d33").name = "entry-barrier-post"
  box(landscape, 32, 1.45, 21.3, .12, .16, 5, "#f4f3e9").name = "entry-barrier-arm"
  for (const z of [19.5, 21, 22.5]) box(landscape, 32, 1.45, z, .14, .18, .55, "#b94937")
  box(landscape, 32, 1.4, 16, .4, 2.8, 3.5, "#303b40").name = "entry-notice-board"
  for (const z of [14.1, 17.9]) box(landscape, 32, 1.55, z, .65, 3.1, .55, "#b65b3b")''')
p.write_text(s)
