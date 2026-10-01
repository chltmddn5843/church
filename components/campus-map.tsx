"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpDown, Baby, ChevronDown, GlassWater, Map as MapIcon, Minus, Plus, RotateCcw, Search, Toilet } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { campusBuildings, campusFloorPlans, type BuildingId, type PlanCell, type PlanKind } from "@/lib/campus-model"
import styles from "./campus-map.module.css"

export function CampusMap({ selected, onSelect }: { selected: BuildingId | null; onSelect: (id: BuildingId | null) => void }) {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<{ highlight: (id: BuildingId | null) => void; view: (mode: string) => void } | null>(null)
  // The three.js setup runs once, so its handlers read the latest callback through a ref.
  const select = useRef(onSelect)
  useEffect(() => { select.current = onSelect })
  const setSelected = (id: BuildingId | null) => select.current(id)
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
      camera.position.set(54, 75, 116)
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(-5, 3, 22)
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
        label.setAttribute("aria-label", `${b.name} 위치 보기`)
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
          const y = THREE.MathUtils.clamp((-position.y * .5 + .5) * height + (b.id === "hope" ? -24 : b.id === "container" ? 24 : 0), label.offsetHeight + 17, height - 8)
          label.style.top = `${y}px`
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
          labels.forEach((label, i) => label.setAttribute("aria-pressed", String(campusBuildings[i].id === id)))
          render()
        },
        view(mode) {
          if (mode === "zoomIn" || mode === "zoomOut") {
            const offset = camera.position.clone().sub(controls.target)
            offset.setLength(THREE.MathUtils.clamp(offset.length() * (mode === "zoomIn" ? .8 : 1.25), 45, 280))
            camera.position.copy(controls.target).add(offset)
          } else {
            controls.target.set(-5, 3, 22)
            if (mode === "front") camera.position.set(-5, 35, 150)
            else if (mode === "top") camera.position.set(-5, 155, 22.1)
            else camera.position.set(54, 75, 116)
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
          setSelected(hit(e) ?? null)
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
    <div className={styles.map} onKeyDown={event => { if (event.key === "Escape") { setSelected(null); setHovered(null) } }}>
      <div ref={host} className={styles.canvas} />
      <p className={styles.note}>드래그해서 돌려 보고, 건물을 누르면 안내가 열려요.</p>
      <div className={styles.tools}>
        <button disabled={status !== "ready"} onClick={() => controller.current?.view("zoomIn")} aria-label="확대"><Plus size={19} aria-hidden /></button>
        <button disabled={status !== "ready"} onClick={() => controller.current?.view("zoomOut")} aria-label="축소"><Minus size={19} aria-hidden /></button>
        <button disabled={status !== "ready"} onClick={() => controller.current?.view("top")}>위에서</button>
        <button disabled={status !== "ready"} onClick={() => controller.current?.view("reset")} aria-label="시점 초기화"><RotateCcw size={18} aria-hidden /></button>
      </div>
      {status !== "ready" && <p className={styles.status} role="status">{status === "loading" ? "모형을 불러오고 있습니다…" : "3D 모형을 표시할 수 없어요. 아래 건물별 안내를 확인해 주세요."}</p>}
    </div>
  )
}

const floorName = (floor: string) => (floor === "외부" ? "야외" : `${floor.replace("F", "")}층`)

type Place = { name: string; sub?: string; building: (typeof campusBuildings)[number]; floor?: string; room?: string }

// Every plan cell plus every directory item ("드림홀 — 초등부 · 영어예배부" also yields each department), one row per building/floor/name.
const departments: Place[] = [{ name: "예배당", building: campusBuildings.find(b => b.id === "faith")!, floor: "1F", room: "비전홀" }]
const places = new Map<string, Place>()
// Plan cells go first and "(식당)"-style notes are ignored, so "만나 카페테리아 (식당)" folds into the drawn cell.
const addPlace = (place: Place) => { const key = `${place.building.id}|${place.floor}|${place.name.replace(/\s*\(.*\)$/, "")}`; if (!places.has(key)) places.set(key, place) }
for (const b of campusBuildings) {
  addPlace({ name: b.name, sub: b.english, building: b })
  for (const f of b.floors) {
    for (const [, name, , , , , sub] of campusFloorPlans[b.id]?.[f.floor]?.cells ?? []) addPlace({ name, sub, building: b, floor: f.floor, room: name })
    for (const line of f.rooms.split("\n")) {
      const [hall, depts] = line.split(" — ")
      if (depts) {
        addPlace({ name: hall, sub: depts, building: b, floor: f.floor, room: hall })
        for (const name of depts.split(" · ")) { departments.push({ name, building: b, floor: f.floor, room: hall }); addPlace(departments.at(-1)!) }
      } else for (const name of line.split(" · ")) addPlace({ name, building: b, floor: f.floor, room: name })
    }
  }
}
const placePath = (p: Place) => [p.building.name, p.floor && floorName(p.floor), p.room !== p.name && p.room].filter(Boolean).join(" · ")
const squash = (text: string) => text.replace(/\s+/g, "").toLowerCase()
// Every space-separated term must hit somewhere, so "소망관 화장실" or "2층 방" narrow down.
function searchPlaces(query: string) {
  const terms = query.trim().split(/\s+/).filter(Boolean).map(squash)
  return terms.length ? [...places.values()].filter(p => terms.every(t => squash(`${p.name} ${p.sub ?? ""} ${placePath(p)}`).includes(t))) : []
}

// lucide has no stairs glyph; same 24px stroke grid as its icons.
function Stairs({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}><path d="M3 21h5v-5h5v-5h5V6h3" /></svg>
}

const planIcons: Partial<Record<PlanKind, typeof Toilet>> = { toilet: Toilet, nursing: Baby, elevator: ArrowUpDown, water: GlassWater }
const planFill: Record<PlanKind, string> = {
  hall: "bg-[#e3f2e8]", room: "bg-[#fcf9df]", dining: "bg-[#e8e7f7]", toilet: "bg-[#fde6e8]", door: "bg-primary/10 text-primary",
  stairs: "bg-card text-muted-foreground", elevator: "bg-card text-muted-foreground", nursing: "bg-card", plain: "bg-card", water: "",
}
const planLegend: { kind: PlanKind; label: string }[] = [
  { kind: "hall", label: "예배실" }, { kind: "room", label: "소그룹방" }, { kind: "dining", label: "식당" },
  { kind: "toilet", label: "화장실" }, { kind: "nursing", label: "수유실" }, { kind: "elevator", label: "엘리베이터" },
  { kind: "stairs", label: "계단" }, { kind: "water", label: "정수기" }, { kind: "door", label: "출입문" },
]

function PlanSymbol({ kind, className }: { kind: PlanKind; className?: string }) {
  if (kind === "stairs") return <Stairs className={className} />
  const Icon = planIcons[kind]
  return Icon ? <Icon aria-hidden className={className} /> : null
}

// Text and icons scale with the plan's own width (cqw) so a phone shows the whole floor without sideways scrolling.
function FloorPlan({ plan, focus, label }: { plan: { ratio: number; cells: readonly PlanCell[] }; focus: string | null; label: string }) {
  return (
    <div role="img" aria-label={`${label} 도면: ${plan.cells.map(([, name, , , , , sub]) => (sub ? `${name}(${sub})` : name)).join(", ")}`} className="@container relative w-full border-2 border-foreground/40 bg-card" style={{ aspectRatio: plan.ratio }}>
      {plan.cells.map(([kind, name, left, top, width, height, sub], i) => {
        const box = { left: `${left}%`, top: `${top}%` }
        if (kind === "water") return <span key={i} title={name} className={`absolute -translate-x-1/2 -translate-y-1/2 p-0.5 ${focus === name ? "z-10 rounded-full bg-primary text-primary-foreground outline-2 outline-offset-2 outline-primary" : "text-muted-foreground"}`} style={box}><PlanSymbol kind={kind} className="size-[clamp(12px,2.2cqw,20px)]" /></span>
        const iconOnly = kind === "stairs" || kind === "elevator"
        const focused = focus === name
        return (
          <div
            key={i}
            title={iconOnly ? name : undefined}
            className={`absolute flex flex-col items-center justify-center gap-[0.4cqw] overflow-hidden border border-foreground/25 p-1 text-center leading-tight ${planFill[kind]} ${focused ? "z-10 shadow-[inset_0_0_0_9999px_rgb(39_105_165/0.14)] outline-[3px] -outline-offset-[3px] outline-primary" : ""}`}
            style={{ ...box, width: `${width}%`, height: `${height}%` }}
          >
            {kind !== "door" && <PlanSymbol kind={kind} className={iconOnly ? "size-[clamp(18px,4cqw,36px)]" : "size-[clamp(12px,2.2cqw,22px)]"} />}
            {!iconOnly && <span className={`break-keep text-[clamp(10px,1.9cqw,17px)] font-semibold ${kind === "door" && height > width * 3 ? "[writing-mode:vertical-rl]" : ""} ${focused ? "text-primary" : ""}`}>{name}</span>}
            {sub && <span className="break-keep text-[clamp(9px,1.5cqw,14px)] text-muted-foreground">{sub}</span>}
          </div>
        )
      })}
    </div>
  )
}

export function CampusGuide() {
  const [selected, setSelected] = useState<BuildingId | null>(null)
  const [floor, setFloor] = useState("")
  const [focus, setFocus] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const results = searchPlaces(query)
  const mapSection = useRef<HTMLElement>(null)
  const planSection = useRef<HTMLDivElement>(null)
  const cards = useRef(new Map<BuildingId, HTMLLIElement>())
  const building = campusBuildings.find(b => b.id === selected)
  const plans = selected ? campusFloorPlans[selected] : undefined
  const planFloor = plans?.[floor] ? floor : plans && Object.keys(plans)[0]

  function select(id: BuildingId | null, nextFloor = "", room: string | null = null) {
    setSelected(id)
    setFloor(nextFloor)
    setFocus(room)
  }

  function goTo(place: Place) {
    select(place.building.id, place.floor, place.room ?? null)
    const hasPlan = place.floor && campusFloorPlans[place.building.id]?.[place.floor]
    // Wait a frame so a newly shown plan exists before scrolling to it.
    requestAnimationFrame(() => (hasPlan ? planSection : mapSection).current?.scrollIntoView({ behavior: "smooth" }))
  }

  // Picking on the map keeps the matching card in view next to the sticky map (desktop only; on phones it would scroll the map away).
  function pickOnMap(id: BuildingId | null) {
    select(id)
    if (id && window.matchMedia("(min-width: 1024px)").matches) cards.current.get(id)?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <SectionHeading eyebrow="Find your place" title="어디로 가면 되나요?" description="찾는 장소나 부서를 검색해 보세요. 누르면 층별 도면에서 위치를 바로 보여드려요." />
          <div className="relative mt-8 max-w-2xl">
            <label htmlFor="campus-search" className="sr-only">장소·부서 검색</label>
            <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="campus-search"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="예: 화장실, 유아부, 로뎀방, 소망관 2층"
              autoComplete="off"
              className="h-14 w-full border border-border bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </div>
          <p role="status" className={query.trim() ? "mt-4 text-sm text-muted-foreground" : "sr-only"}>
            {query.trim() && (results.length ? `검색 결과 ${results.length}곳` : `"${query.trim()}"에 맞는 장소가 없어요. 다른 이름으로 찾아보세요.`)}
          </p>
          {!query.trim() && <p className="mt-6 text-sm font-semibold text-foreground">부서별 예배 장소</p>}
          <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${query.trim() ? "mt-4" : "mt-3"}`}>
            {(query.trim() ? results : departments).map(p => (
              <li key={`${p.building.id}-${p.floor}-${p.name}`}>
                <button
                  type="button"
                  onClick={() => goTo(p)}
                  className="group flex min-h-16 w-full items-center justify-between gap-3 border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground">{p.name}</span>
                    {query.trim() && p.sub && p.sub !== p.building.english && <span className="mt-0.5 block break-keep text-sm text-muted-foreground">{p.sub}</span>}
                  </span>
                  <span className="shrink-0 text-right text-sm text-muted-foreground transition-colors group-hover:text-primary">{placePath(p)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={mapSection} id="map" className="scroll-mt-20 bg-secondary py-16 md:scroll-mt-24 md:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <SectionHeading eyebrow="Campus" title="건물별 안내" description="사랑관·소망관·믿음관·믿음방과 마당, 다섯 공간으로 나뉘어 있어요." />
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div className="h-[55dvh] min-h-80 border border-border lg:sticky lg:top-32 lg:h-[calc(100dvh-10rem)]">
              <CampusMap selected={selected} onSelect={pickOnMap} />
            </div>
            <ul className="space-y-3">
              {campusBuildings.map(b => {
                const open = selected === b.id
                return (
                  <li key={b.id} ref={el => { if (el) cards.current.set(b.id, el); else cards.current.delete(b.id) }} className={`scroll-mt-32 border bg-card transition-colors ${open ? "border-primary" : "border-border"}`}>
                    <h3>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`campus-${b.id}`}
                        onClick={() => select(open ? null : b.id)}
                        className="flex w-full items-start justify-between gap-4 p-5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                      >
                        <span>
                          <span className="block text-xs font-semibold tracking-[0.2em] text-primary">{b.english}</span>
                          <span className={`mt-1 block text-lg font-semibold ${open ? "text-primary" : "text-foreground"}`}>{b.name}</span>
                          <span className="mt-1 block break-keep text-sm text-muted-foreground">{b.position}</span>
                        </span>
                        <ChevronDown aria-hidden className={`mt-1 size-5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
                      </button>
                    </h3>
                    <dl id={`campus-${b.id}`} hidden={!open} className="divide-y divide-border border-t border-border px-5">
                      {b.floors.map(f => (
                        <div key={f.floor} className="grid grid-cols-[3.5rem_1fr] gap-3 py-4">
                          <dt className="font-semibold tabular-nums text-primary">{floorName(f.floor)}</dt>
                          <dd className="space-y-1 break-keep text-[15px] leading-relaxed text-foreground">
                            {f.rooms.split("\n").map(line => {
                              const [hall, depts] = line.split(" — ")
                              return <p key={line}>{depts ? <><span className="font-semibold">{hall}</span> <span className="text-muted-foreground">{depts}</span></> : line}</p>
                            })}
                          </dd>
                        </div>
                      ))}
                      {campusFloorPlans[b.id] && (
                        <div className="py-4">
                          <button type="button" onClick={() => planSection.current?.scrollIntoView({ behavior: "smooth" })} className="inline-flex min-h-11 items-center gap-2 border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                            <MapIcon aria-hidden className="size-4" />층별 도면 보기
                          </button>
                        </div>
                      )}
                    </dl>
                  </li>
                )
              })}
            </ul>
          </div>
          {building && plans && planFloor && (
            <div ref={planSection} className="mt-10 scroll-mt-28 border border-border bg-card p-5 md:p-8">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary">FLOOR PLAN</p>
                    <h3 className="mt-1 text-xl font-semibold text-foreground md:text-2xl">{building.name} 층별 도면</h3>
                  </div>
                  <div className="flex gap-2" aria-label="층 선택" role="group">
                    {Object.keys(plans).map(f => (
                      <button
                        key={f}
                        type="button"
                        aria-pressed={f === planFloor}
                        onClick={() => { setFloor(f); setFocus(null) }}
                        className={`min-h-11 min-w-14 border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${f === planFloor ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary"}`}
                      >
                        {floorName(f)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <FloorPlan plan={plans[planFloor]} focus={focus} label={`${building.name} ${floorName(planFloor)}`} />
                </div>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  {planLegend.map(({ kind, label }) => (
                    <li key={kind} className="flex items-center gap-1.5">
                      {planIcons[kind] || kind === "stairs" ? <PlanSymbol kind={kind} className="size-4" /> : <span aria-hidden className={`size-3.5 border border-foreground/25 ${planFill[kind]}`} />}
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <p className="mt-6 text-sm text-muted-foreground">3D 모형은 사진을 바탕으로 만들어 실제 크기나 주차 구획과 조금 다를 수 있어요.</p>
        </div>
      </section>
    </>
  )
}
