"use client"

import { useEffect, useRef, useState } from "react"
import { RotateCcw, Plus, Minus } from "lucide-react"
import { campusBuildings, type BuildingId } from "@/lib/campus-model"
import styles from "@/app/campus/campus.module.css"

export function CampusMap() {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<{ highlight: (id: BuildingId | null) => void; view: (mode: string) => void } | null>(null)
  const [selected, setSelected] = useState<BuildingId | null>(null)
  const [hovered, setHovered] = useState<BuildingId | null>(null)
  const [status, setStatus] = useState("loading")
  const active = hovered ?? selected

  useEffect(() => {
    const container = host.current!
    let cancelled = false
    let cleanup = () => {}
    async function setup() {
      const [THREE, { OrbitControls }, { GLTFLoader }] = await Promise.all([
        import("three"), import("three/addons/controls/OrbitControls.js"), import("three/addons/loaders/GLTFLoader.js"),
      ])
      if (cancelled) return
      const { scene: campus } = await new GLTFLoader().loadAsync("/models/church-campus.glb")
      if (cancelled) return
      const groups = new Map<BuildingId, import("three").Object3D>()
      for (const building of campusBuildings) {
        const group = campus.getObjectByName(building.id)
        if (!group) throw new Error(`Missing model group: ${building.id}`)
        group.traverse(object => { object.userData.buildingId = building.id })
        groups.set(building.id, group)
      }
      campus.traverse(object => {
        if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true }
      })
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.setClearColor(0xeef3f5, 0)
      container.appendChild(renderer.domElement)
      renderer.domElement.setAttribute("aria-label", "원당교회 3D 건물 모형. 공간 선택 메뉴로도 탐색할 수 있습니다.")
      renderer.domElement.setAttribute("role", "img")
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(36, 1, .1, 500)
      camera.position.set(42, 48, 76)
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(-5, 3, 3)
      controls.minDistance = 45
      controls.maxDistance = 280
      controls.maxPolarAngle = Math.PI / 2.15
      controls.enablePan = false
      controls.update()
      scene.add(new THREE.HemisphereLight(0xffffff, 0x8eaaa3, 1.8))
      const sun = new THREE.DirectionalLight(0xfff8e9, 2)
      sun.position.set(-30, 70, 40)
      sun.castShadow = true
      sun.shadow.mapSize.set(2048, 2048)
      Object.assign(sun.shadow.camera, { left: -65, right: 65, top: 55, bottom: -90, near: 1, far: 240 })
      sun.shadow.normalBias = .06
      scene.add(sun)
      scene.add(campus)
      const buildingMaterials = new Map<BuildingId, import("three").MeshStandardMaterial[]>()
      groups.forEach((group, id) => {
        const copies = new Map<import("three").MeshStandardMaterial, import("three").MeshStandardMaterial>()
        group.traverse(object => {
          if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
            if (!copies.has(object.material)) copies.set(object.material, object.material.clone())
            object.material = copies.get(object.material)!
          }
        })
        buildingMaterials.set(id, [...copies.values()])
      })
      const labels: HTMLButtonElement[] = []
      campusBuildings.forEach((b) => {
        const label = document.createElement("button")
        label.className = styles.marker
        label.textContent = b.name
        const detail = document.createElement("span")
        detail.className = styles.detail
        detail.id = `campus-info-${b.id}`
        detail.textContent = `${b.position}\n\n${b.floors.map(f => `${f.floor}  ${f.rooms}`).join("\n")}`
        label.appendChild(detail)
        label.setAttribute("aria-label", `${b.name} 공간 안내 보기`)
        label.onclick = () => setSelected(b.id)
        label.onpointerenter = () => setHovered(b.id)
        label.onpointerleave = () => setHovered(null)
        label.onfocus = () => setHovered(b.id)
        label.onblur = () => setHovered(null)
        container.appendChild(label)
        labels.push(label)
      })
      const outline = new THREE.BoxHelper(groups.get("faith")!, 0x2677aa)
      scene.add(outline)
      outline.visible = false
      function render() {
        renderer.render(scene, camera)
        const width = container.clientWidth, height = container.clientHeight
        campusBuildings.forEach((b, i) => {
          const bounds = new THREE.Box3().setFromObject(groups.get(b.id)!)
          const position = bounds.getCenter(new THREE.Vector3())
          position.y = bounds.max.y + 2
          position.project(camera)
          const label = labels[i]
          const halfWidth = label.offsetWidth / 2
          label.style.left = `${THREE.MathUtils.clamp((position.x * .5 + .5) * width, halfWidth + 8, width - halfWidth - 8)}px`
          const y = THREE.MathUtils.clamp((-position.y * .5 + .5) * height + (b.id === "hope" ? -24 : b.id === "container" ? 24 : 0), label.offsetHeight + 8, height - 8)
          label.style.top = `${y}px`
          const detail = label.firstElementChild as HTMLSpanElement
          const x = parseFloat(label.style.left)
          detail.style.left = `${THREE.MathUtils.clamp(x - 130, 8, width - 268) - x + halfWidth}px`
          detail.style.top = y + detail.offsetHeight + 12 < height ? "calc(100% + 8px)" : "auto"
          detail.style.bottom = detail.style.top === "auto" ? "calc(100% + 8px)" : "auto"
          labels[i].hidden = position.z > 1 || Math.abs(position.x) > .95 || Math.abs(position.y) > .94
        })
      }
      controller.current = {
        highlight(id) {
          outline.visible = id !== null
          if (id) outline.setFromObject(groups.get(id)!)
          buildingMaterials.forEach((materials, key) => materials.forEach(material => {
            material.emissive.setHex(key === id ? 0x1a648e : 0x000000)
            material.emissiveIntensity = .22
          }))
          labels.forEach((label, i) => {
            label.setAttribute("aria-pressed", String(campusBuildings[i].id === id))
            if (campusBuildings[i].id === id) label.setAttribute("aria-describedby", `campus-info-${id}`)
            else label.removeAttribute("aria-describedby")
          })
          render()
        },
        view(mode) {
          if (mode === "zoomIn" || mode === "zoomOut") {
            const offset = camera.position.clone().sub(controls.target)
            offset.setLength(THREE.MathUtils.clamp(offset.length() * (mode === "zoomIn" ? .8 : 1.25), 45, 280))
            camera.position.copy(controls.target).add(offset)
          } else {
            controls.target.set(-5, 3, 3)
            if (mode === "front") camera.position.set(-5, 24, 110)
            else if (mode === "top") camera.position.set(-5, 110, 3.1)
            else camera.position.set(42, 48, 76)
          }
          controls.update()
          render()
        },
      }
      const raycaster = new THREE.Raycaster()
      function hit(event: PointerEvent) {
        const rect = renderer.domElement.getBoundingClientRect()
        raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera)
        return raycaster.intersectObject(campus, true)[0]?.object.userData.buildingId as BuildingId | undefined
      }
      let start: { x: number; y: number } | null = null
      const down = (e: PointerEvent) => { start = { x: e.clientX, y: e.clientY }; setHovered(null) }
      const move = (e: PointerEvent) => {
        if (e.buttons) return
        const id = hit(e)
        setHovered(id ?? null)
        renderer.domElement.style.cursor = id ? "pointer" : "grab"
      }
      const up = (e: PointerEvent) => {
        if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 6) {
          const id = hit(e)
          setSelected(id ?? null)
        }
        start = null
      }
      const leave = () => { setHovered(null); start = null }
      const lost = (e: Event) => { e.preventDefault(); setStatus("error") }
      renderer.domElement.addEventListener("pointerdown", down)
      renderer.domElement.addEventListener("pointermove", move)
      renderer.domElement.addEventListener("pointerup", up)
      renderer.domElement.addEventListener("pointerleave", leave)
      renderer.domElement.addEventListener("pointercancel", leave)
      renderer.domElement.addEventListener("webglcontextlost", lost)
      controls.addEventListener("change", render)
      const observer = new ResizeObserver(() => {
        const w = container.clientWidth, h = container.clientHeight
        camera.aspect = w / h
        // Preserve the full campus on narrow screens.
        camera.fov = Math.max(38, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(48) / 2) / camera.aspect)))
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
        render()
      })
      observer.observe(container)
      controller.current.highlight(null)
      setStatus("ready")
      cleanup = () => {
        observer.disconnect()
        controls.dispose()
        controller.current = null
        labels.forEach(label => label.remove())
        renderer.domElement.removeEventListener("pointerdown", down)
        renderer.domElement.removeEventListener("pointermove", move)
        renderer.domElement.removeEventListener("pointerup", up)
        renderer.domElement.removeEventListener("pointerleave", leave)
        renderer.domElement.removeEventListener("pointercancel", leave)
        renderer.domElement.removeEventListener("webglcontextlost", lost)
        const materials = new Set<import("three").Material>()
        scene.traverse(object => {
          if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
            object.geometry.dispose()
            for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material)
          }
        })
        materials.forEach(material => material.dispose())
        renderer.dispose()
        renderer.domElement.remove()
      }
    }
    setup().catch(() => { if (!cancelled) setStatus("error") })
    return () => { cancelled = true; cleanup() }
  }, [])

  useEffect(() => { controller.current?.highlight(active) }, [active, status])

  return (
    <section className={styles.map} aria-label="원당교회 3D 공간 안내" onKeyDown={event => { if (event.key === "Escape") { setSelected(null); setHovered(null) } }}>
      <div className={styles.heading}><h1>원당교회 공간 안내</h1><p>건물을 가리키거나 눌러 공간을 확인하세요.</p></div>
      <div ref={host} className={styles.canvas} />
      <div className={styles.tools}>
        <label className={styles.select}>공간 선택<select value={active ?? ""} onChange={event => { setSelected(event.target.value as BuildingId || null); setHovered(null) }}><option value="">전체 보기</option>{campusBuildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
        <button disabled={status !== "ready"} onClick={() => controller.current?.view("zoomIn")} aria-label="확대"><Plus size={19} /></button>
        <button disabled={status !== "ready"} onClick={() => controller.current?.view("zoomOut")} aria-label="축소"><Minus size={19} /></button>
        <button disabled={status !== "ready"} onClick={() => controller.current?.view("reset")} aria-label="시점 초기화"><RotateCcw size={18} /></button>
        <button onClick={() => controller.current?.view("top")}>위에서</button>
        <button onClick={() => { setSelected(null); setHovered(null) }}>안내 닫기</button>
      </div>
      {status !== "ready" && <p className={styles.status} role="status">{status === "loading" ? "모형을 불러오고 있습니다…" : "3D를 표시할 수 없습니다. 아래 공간 안내를 확인해 주세요."}</p>}
      {status === "error" && <div className={styles.fallback}>{campusBuildings.map(b => <div key={b.id}><h2>{b.name}</h2>{b.floors.map(f => <p key={f.floor}>{f.floor} {f.rooms}</p>)}</div>)}</div>}
      <p className={styles.note}>드래그: 회전 · 휠 / 두 손가락: 확대 · Esc: 안내 닫기<br />사진 기반 추정 모형 · 주차 구획과 치수는 실측과 다를 수 있습니다.</p>
    </section>
  )
}
