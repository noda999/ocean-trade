import {
  useCallback, useEffect, useMemo, useRef, useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { AI_SHIPS, CITIES, CITY_BY_ID, START_CITY, shipDisplayName } from '../game/data'
import { cargoUnits, shipOf } from '../game/engine'
import { useGame } from '../game/store'
import { CityLandmark } from '../components/Landmarks'
import { ShipSprite } from '../components/ShipSprite'
import {
  LAND, createSphere, geoOf, normLon, slerpLonLat, viewFor,
  type LonLat, type ScreenPoint,
} from '../game/geo'
import { globePill, placeLabels, type LabelRect } from '../game/labels'
import { GEO_FEATURES, TERRAIN_SPOTS, type TerrainKind } from '../game/geoFeatures'

// ─────────────────────────────────────────────────────────────────────────────
//  球形地球视图（v1.4.0）
//  正交投影的真·三维地球：拖动旋转（带惯性）、滚轮/双指缩放、
//  航线沿球面大圆走、城市标签自动避让不叠罗汉。
// ─────────────────────────────────────────────────────────────────────────────

const GZ_MIN = 0.75
const GZ_MAX = 2.6
const LAT_LIMIT = 80

/** 海面信风点缀：屏幕坐标随视角脉动，pointer-events: none 让点击穿透到下面的城市/船只 */
const WIND_ARROWS: { lat: number; lon: number }[] = [
  { lat: 18, lon: -30 },
  { lat: -22, lon: 65 },
  { lat: 35, lon: 130 },
  { lat: -38, lon: -85 },
  { lat: 8, lon: 95 },
  { lat: 50, lon: -160 },
]

interface Props {
  selected: string | null
  setSelected: (v: string | null) => void
}

/** 星空背景（只生成一次） */
const STARS = Array.from({ length: 70 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  return { x: r(1) * 100, y: r(2) * 100, s: 0.6 + r(3) * 1.6, o: 0.25 + r(4) * 0.6 }
})

/** 球面地形贴纸：手绘小图（连绵雪山 / 沙丘 / 阔叶丛林 / 针叶林） */
function TerrainSprite({ kind, w, h }: { kind: TerrainKind; w: number; h: number }) {
  const box = { width: w, height: h, viewBox: '0 0 100 50' } as const
  if (kind === 'mountain') {
    return (
      <svg {...box}>
        <path d="M4,48 L20,16 L32,34 L48,6 L62,32 L76,18 L96,48 Z" fill="#6f8a5c" stroke="#55703f" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14,48 L26,24 L38,42 L52,14 L66,40 L80,26 L94,48 Z" fill="#87a06e" opacity="0.85" />
        <path d="M44,13 L48,6 L52,13 Z" fill="#ffffff" />
        <path d="M18,21 L20,16 L22,21 Z" fill="#ffffff" opacity="0.8" />
        <path d="M74,24 L76,18 L78,24 Z" fill="#ffffff" opacity="0.8" />
      </svg>
    )
  }
  if (kind === 'dune') {
    return (
      <svg {...box}>
        <path d="M6,40 Q28,12 52,34 Q72,48 94,26 L94,48 L6,48 Z" fill="#ead9a8" stroke="#cdb67c" strokeWidth="1.2" />
        <path d="M14,34 Q32,16 52,32" fill="none" stroke="#cdb67c" strokeWidth="2" opacity="0.7" />
        <path d="M40,40 Q58,26 74,36" fill="none" stroke="#cdb67c" strokeWidth="2" opacity="0.5" />
        <circle cx="84" cy="14" r="4" fill="#f2e3b8" />
      </svg>
    )
  }
  if (kind === 'jungle') {
    return (
      <svg {...box}>
        <rect x="22" y="30" width="3.5" height="18" rx="1.5" fill="#7a5634" />
        <rect x="58" y="34" width="3.5" height="14" rx="1.5" fill="#7a5634" />
        <rect x="80" y="38" width="3" height="10" rx="1.5" fill="#7a5634" />
        <circle cx="24" cy="22" r="12" fill="#3e8a46" />
        <circle cx="34" cy="28" r="9" fill="#4fa057" />
        <circle cx="60" cy="28" r="10" fill="#4fa057" />
        <circle cx="82" cy="33" r="8" fill="#3e8a46" />
        <circle cx="14" cy="32" r="7" fill="#35793c" />
        <circle cx="48" cy="38" r="6" fill="#35793c" />
      </svg>
    )
  }
  return (
    <svg {...box}>
      <rect x="32" y="38" width="3" height="10" rx="1.5" fill="#6b4a2c" />
      <rect x="58" y="40" width="3" height="8" rx="1.5" fill="#6b4a2c" />
      <rect x="80" y="42" width="2.6" height="6" rx="1.3" fill="#6b4a2c" />
      <path d="M33.5,4 L44,38 L23,38 Z" fill="#2f7a44" />
      <path d="M59.5,12 L68,40 L51,40 Z" fill="#3c8a50" />
      <path d="M81.3,18 L88,42 L74.6,42 Z" fill="#2f7a44" />
      <path d="M31,10 L33.5,4 L36,10 Z" fill="#e8f4ec" opacity="0.9" />
    </svg>
  )
}

export default function GlobeWorld({ selected, setSelected }: Props) {
  const { state } = useGame()
  const rootRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  // 容器尺寸（标签避让需要像素坐标）
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect
      setSize({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── 视角状态：球心正对的经纬度 + 缩放 ────────────────────────────────────
  const [view, setView] = useState(() => {
    const g = geoOf(START_CITY)
    return viewFor(g[0], g[1])
  })
  const [zoomG, setZoomG] = useState(1)

  // 惯性旋转
  const inertiaRef = useRef({ vLon: 0, vLat: 0, raf: 0 })
  // 平滑聚焦动画目标
  const animRef = useRef<{ lon: number; lat: number; raf: number } | null>(null)
  // 指针手势
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map())
  const dragRef = useRef({
    lastX: 0, lastY: 0, moved: 0, isDragging: false,
    pinchDist: 0, pinchZoom: 1,
  })

  const stopInertia = useCallback(() => {
    cancelAnimationFrame(inertiaRef.current.raf)
    inertiaRef.current.vLon = 0
    inertiaRef.current.vLat = 0
  }, [])
  const stopAnim = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current.raf)
    animRef.current = null
  }, [])

  /** 平滑转到某个经纬度（走最短经度方向） */
  const animateTo = useCallback((lon: number, lat: number) => {
    stopAnim()
    const target = { lon, lat: Math.max(-LAT_LIMIT, Math.min(LAT_LIMIT, lat)), raf: 0 }
    animRef.current = target
    const step = () => {
      if (animRef.current !== target) return
      let done = false
      setView(v => {
        let dl = ((target.lon - v.lon0 + 540) % 360) - 180
        const dla = target.lat - v.lat0
        if (Math.abs(dl) < 0.4 && Math.abs(dla) < 0.4) { done = true; return { lon0: target.lon, lat0: target.lat } }
        return { lon0: normLon(v.lon0 + dl * 0.14), lat0: v.lat0 + dla * 0.14 }
      })
      if (done) { animRef.current = null; return }
      target.raf = requestAnimationFrame(step)
    }
    target.raf = requestAnimationFrame(step)
  }, [stopAnim])

  const kickInertia = useCallback((vLon: number, vLat: number) => {
    stopInertia()
    if (Math.abs(vLon) < 0.03 && Math.abs(vLat) < 0.03) return
    inertiaRef.current.vLon = vLon
    inertiaRef.current.vLat = vLat
    const step = () => {
      const it = inertiaRef.current
      it.vLon *= 0.93
      it.vLat *= 0.93
      if (Math.abs(it.vLon) < 0.015 && Math.abs(it.vLat) < 0.015) return
      setView(v => ({
        lon0: normLon(v.lon0 - it.vLon),
        lat0: Math.max(-LAT_LIMIT, Math.min(LAT_LIMIT, v.lat0 + it.vLat)),
      }))
      it.raf = requestAnimationFrame(step)
    }
    inertiaRef.current.raf = requestAnimationFrame(step)
  }, [stopInertia])

  // ── 投影几何 ──────────────────────────────────────────────────────────────
  const R = Math.min(size.w, size.h) * 0.46 * zoomG
  const cx = size.w / 2
  const cy = size.h / 2
  const sphere = useMemo(
    () => createSphere(view.lon0, view.lat0, R, cx, cy),
    [view.lon0, view.lat0, R, cx, cy],
  )

  // 每像素多少度（拖动灵敏度与球半径挂钩）
  const degPerPx = R > 0 ? 105 / R : 0.4

  // ── 指针手势：单指旋转 / 双指缩放 ─────────────────────────────────────────
  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    if (target.closest('.city-hit') || target.closest('.map-overlay')) return
    stopInertia()
    stopAnim()
    e.currentTarget.setPointerCapture(e.pointerId)
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size === 1) {
      dragRef.current = { lastX: e.clientX, lastY: e.clientY, moved: 0, isDragging: false, pinchDist: 0, pinchZoom: zoomG }
    } else if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()]
      dragRef.current.pinchDist = Math.hypot(a.x - b.x, a.y - b.y)
      dragRef.current.pinchZoom = zoomG
      dragRef.current.isDragging = true
    }
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const list = [...pointersRef.current.values()]

    if (list.length === 1) {
      const dx = e.clientX - dragRef.current.lastX
      const dy = e.clientY - dragRef.current.lastY
      dragRef.current.lastX = e.clientX
      dragRef.current.lastY = e.clientY
      dragRef.current.moved += Math.hypot(dx, dy)
      if (dragRef.current.moved > 5) dragRef.current.isDragging = true
      setView(v => ({
        lon0: normLon(v.lon0 - dx * degPerPx),
        lat0: Math.max(-LAT_LIMIT, Math.min(LAT_LIMIT, v.lat0 + dy * degPerPx)),
      }))
      inertiaRef.current.vLon = -dx * degPerPx * 0.7
      inertiaRef.current.vLat = dy * degPerPx * 0.7
    } else if (list.length === 2 && dragRef.current.pinchDist > 0) {
      const d = Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y)
      setZoomG(Math.max(GZ_MIN, Math.min(GZ_MAX, dragRef.current.pinchZoom * (d / dragRef.current.pinchDist))))
    }
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    // 不是从地球根节点起的手势（例如点中 .city-hit / .city-tag 后冒泡上来的 pointerup）→ 不处理
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.delete(e.pointerId)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
    if (pointersRef.current.size === 0) {
      if (!dragRef.current.isDragging) setSelected(null)
      else kickInertia(inertiaRef.current.vLon, inertiaRef.current.vLat)
      dragRef.current = { lastX: 0, lastY: 0, moved: 0, isDragging: false, pinchDist: 0, pinchZoom: zoomG }
    }
  }

  // 滚轮缩放
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    function onWheel(ev: WheelEvent) {
      ev.preventDefault()
      stopInertia()
      setZoomG(z => Math.max(GZ_MIN, Math.min(GZ_MAX, z * (ev.deltaY > 0 ? 0.9 : 1.11))))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [stopInertia])

  // 起航时把地球转到航线中点
  const voyageKey = state.voyage ? `${state.voyage.from}>${state.voyage.to}` : ''
  useEffect(() => {
    if (!state.voyage) return
    const a = geoOf(state.voyage.from)
    const b = geoOf(state.voyage.to)
    const mid = slerpLonLat(a, b, 0.5)
    animateTo(mid[0], mid[1])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voyageKey])

  useEffect(() => () => { stopInertia(); stopAnim() }, [stopInertia, stopAnim])

  // ── 游戏状态 ──────────────────────────────────────────────────────────────
  const ship = shipOf(state.shipId)
  const cur = CITY_BY_ID[state.cityId] ?? CITY_BY_ID[START_CITY]
  const sailing = state.voyage
  const fromCity = sailing ? CITY_BY_ID[sailing.from] : null
  const toCity = sailing ? CITY_BY_ID[sailing.to] : null
  const progress = sailing ? Math.min(1, sailing.elapsed / sailing.duration) : 0
  const hold = cargoUnits(state.cargo)
  const displayedShipName = shipDisplayName(state.shipName, ship.name)

  // ── 城市投影 ──────────────────────────────────────────────────────────────
  const cityPts = useMemo(() => CITIES.map(c => {
    const g = geoOf(c.id)
    const p = sphere.project(g[0], g[1])
    return { c, p, vis: p.z > 0.1 }
  }), [sphere])

  // ── 标签防重叠（full → compact，都放不下只画点） ───────────────────────────
  // 注意：依赖里不能放整个 state.voyage（航行中每 200ms 都是新对象，会白算一次防重叠）
  const voyageTo = state.voyage?.to
  const labels = useMemo(() => {
    if (!size.w || !size.h) return []
    const prio = (id: string) =>
      id === state.cityId || id === selected || id === voyageTo ? 1 : 0
    const order = [...cityPts].sort((a, b) =>
      (prio(b.c.id) - prio(a.c.id)) || (b.p.z - a.p.z))
    const cands: LabelRect[] = []
    for (const { c, p, vis } of order) {
      if (!vis) continue
      for (const variant of ['full', 'compact'] as const) {
        const { w, h } = globePill(c.name, c.sub, 1, variant)
        cands.push({ id: `${c.id}:${variant}:r`, group: c.id, x: p.x + 13, y: p.y - h / 2, w, h })
        cands.push({ id: `${c.id}:${variant}:l`, group: c.id, x: p.x - 13 - w, y: p.y - h / 2, w, h })
      }
    }
    const force = new Set<string>()
    for (const { c } of order) {
      if (prio(c.id)) force.add(`${c.id}:full:r`)
    }
    return placeLabels(cands, { x0: 6, y0: 56, x1: size.w - 6, y1: size.h - 60 }, { gap: 2, force })
  }, [cityPts, size.w, size.h, state.cityId, voyageTo, selected])

  // ── 球面航线（大圆弧，只画正面） ──────────────────────────────────────────
  const routeD = useCallback((a: LonLat, b: LonLat, steps = 44): string => {
    let d = ''
    let open = false
    for (let i = 0; i <= steps; i++) {
      const g = slerpLonLat(a, b, i / steps)
      const p = sphere.project(g[0], g[1])
      if (p.z >= 0.02) {
        d += `${open ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`
        open = true
      } else open = false
    }
    return d
  }, [sphere])

  const playerGeo: LonLat = useMemo(() => {
    if (sailing && fromCity && toCity) {
      return slerpLonLat(geoOf(sailing.from), geoOf(sailing.to), progress)
    }
    const g = geoOf(cur.id)
    return [g[0] + 4, g[1] - 4]
  }, [sailing, fromCity, toCity, progress, cur.id])

  const playerPt = sphere.project(playerGeo[0], playerGeo[1])

  // 采样球面路径成可见折线（经纬网用）
  function segments(pts: ScreenPoint[]): string {
    let d = ''
    let open = false
    for (const p of pts) {
      if (p.z >= 0) {
        d += `${open ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`
        open = true
      } else open = false
    }
    return d
  }

  const graticule = useMemo(() => {
    const parts: { d: string; eq: boolean }[] = []
    for (let lat = -60; lat <= 60; lat += 30) {
      parts.push({ d: segments(sphere.parallel(lat)), eq: lat === 0 })
    }
    for (let lon = -150; lon <= 180; lon += 30) {
      parts.push({ d: segments(sphere.meridian(lon)), eq: lon === 0 })
    }
    return parts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sphere])

  const landPaths = useMemo(() => LAND.map(l => {
    const pts = l.r.map(([lon, lat]) => sphere.project(lon, lat))
    const clipped = sphere.clip(pts)
    if (clipped.length < 3) return ''
    return clipped.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('') + 'Z'
  }), [sphere])

  function resetGlobe() {
    const g = geoOf(START_CITY)
    setZoomG(1)
    animateTo(g[0], g[1])
  }

  const labelById = new Map(labels.map(l => [l.id.split(':')[0], l]))

  return (
    <div
      ref={rootRef}
      className="globe-canvas"
      style={{ cursor: dragRef.current.isDragging ? 'grabbing' : 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* 星空 + 地球本体（SVG，像素坐标） */}
      <svg
        className="absolute inset-0"
        width={size.w}
        height={size.h}
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <radialGradient id="globeOcean" cx="0.36" cy="0.3" r="1">
            <stop offset="0%" stopColor="#8fd8f0" />
            <stop offset="45%" stopColor="#4fb3dc" />
            <stop offset="100%" stopColor="#2279ab" />
          </radialGradient>
          <linearGradient id="globeLand" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#a5dc8c" />
            <stop offset="55%" stopColor="#79c468" />
            <stop offset="100%" stopColor="#4f9c42" />
          </linearGradient>
          {/* 边缘暗化 + 高光，营造球体感 */}
          <radialGradient id="globeShade" cx="0.36" cy="0.3" r="0.95">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#062038" stopOpacity="0.42" />
          </radialGradient>
        </defs>

        {/* 星空 */}
        {STARS.map((s, i) => (
          <circle key={i} cx={(s.x / 100) * size.w} cy={(s.y / 100) * size.h} r={s.s} fill="#fff" opacity={s.o} />
        ))}

        {/* 大气光晕 */}
        <circle cx={cx} cy={cy} r={R + 18} fill="none" stroke="rgba(120,180,230,0.16)" strokeWidth="20" />
        <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="rgba(160,220,255,0.45)" strokeWidth="11" />
        <circle cx={cx} cy={cy} r={R + 2} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" />

        {/* 海洋球体 */}
        <circle cx={cx} cy={cy} r={R} fill="url(#globeOcean)" />

        {/* 经纬网 */}
        {graticule.map((g, i) => (
          <path key={i} d={g.d} fill="none"
            stroke={g.eq ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.13)'}
            strokeWidth={g.eq ? 1 : 0.7}
            strokeDasharray={g.eq ? undefined : '3,4'} />
        ))}

        {/* 大陆 */}
        {landPaths.map((d, i) => d ? (
          <g key={i}>
            <path d={d} fill="#f6e5ac" stroke="#f6e5ac" strokeWidth="3" strokeLinejoin="round" />
            <path d={d} fill="url(#globeLand)" stroke="#5f9c4e" strokeWidth="0.8" strokeLinejoin="round" />
          </g>
        ) : null)}

        {/* 球体光影 */}
        <circle cx={cx} cy={cy} r={R} fill="url(#globeShade)" />

        {/* 其他商船航线（球面大圆） */}
        {AI_SHIPS.map(s => {
          const a = CITY_BY_ID[s.from]
          const b = CITY_BY_ID[s.to]
          if (!a || !b) return null
          return (
            <path key={s.id} d={routeD(geoOf(a.id), geoOf(b.id))} fill="none"
              stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" strokeDasharray="3,3" />
          )
        })}

        {/* 玩家航线 */}
        {sailing && fromCity && toCity && (
          <path d={routeD(geoOf(sailing.from), geoOf(sailing.to), 56)} fill="none"
            stroke="rgba(245,145,58,0.9)" strokeWidth="1.8" strokeDasharray="4,3" />
        )}
      </svg>

      {/* ── 地球周围装饰：轨道小月亮 + N/S/E/W 罗盘 + 海面信风 ── */}
      {/* 小月亮：CSS keyframe 绕地心匀速公转 */}
      <div className="gw-orbit-pointer" style={{ left: cx, top: cy }}>
        <div className="gw-moon-orbit" style={{ '--gw-r': `${R + 14}px` } as React.CSSProperties}>
          <div className="gw-moon-dot" />
        </div>
      </div>

      {/* 罗盘字母：钉在地平线上，跟着视角永远显示在屏幕四边 */}
      <div className="gw-compass font-900 select-none">
        <span style={{ left: cx, top: cy - R - 14 }}>N</span>
        <span style={{ left: cx, top: cy + R + 14 }}>S</span>
        <span style={{ left: cx + R + 14, top: cy }}>E</span>
        <span style={{ left: cx - R - 14, top: cy }}>W</span>
      </div>

      {/* 海面信风箭头（点缀用，屏幕坐标随视角脉动） */}
      {WIND_ARROWS.map((a, i) => {
        const p = sphere.project(a.lon, a.lat)
        if (p.z < 0.05) return null
        return (
          <div key={`gw-wind-${i}`} className="gw-wind-pin" style={{ left: p.x, top: p.y }}>
            <div className="gw-wind-arrow" style={{ animationDelay: `${i * 0.7}s` }}>
              <svg width="24" height="9" viewBox="0 0 24 9">
                <path d="M0 4.5 L20 4.5 M16 1 L21 4.5 L16 8" stroke="rgba(255,255,255,0.85)" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )
      })}

      {/* 地理标注：海峡 / 大洋 / 沙漠 / 山脉（投影到球面，背面隐藏，近边缘淡出） */}
      {GEO_FEATURES.map(f => {
        const p = sphere.project(f.geo[0], f.geo[1])
        if (p.z < 0.12) return null
        const fade = Math.min(1, (p.z - 0.12) / 0.3)
        return (
          <div
            key={`gw-geo-${f.name}`}
            className={`geo-label geo-${f.kind}`}
            style={{ left: p.x, top: p.y, zIndex: 2, opacity: 0.4 + 0.6 * fade, fontSize: `${Math.round(11 * (0.7 + 0.3 * p.z) * Math.max(1, zoomG * 0.85))}px` }}
          >
            {f.name}
          </div>
        )
      })}

      {/* 球面地形贴纸：雪山 / 沙丘 / 丛林 / 针叶林（随视角缩放淡出） */}
      {TERRAIN_SPOTS.map((t, i) => {
        const p = sphere.project(t.geo[0], t.geo[1])
        if (p.z < 0.08) return null
        const depth = 0.45 + 0.55 * p.z
        const w = Math.round(46 * (t.s ?? 1) * depth * Math.max(1, zoomG * 0.8))
        const h = Math.round(w * (t.kind === 'mountain' ? 0.52 : 0.44))
        return (
          <div
            key={`gw-terrain-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: p.x, top: p.y,
              transform: `translate(-50%, -${t.kind === 'mountain' ? 88 : 55}%)`,
              zIndex: 3,
              opacity: 0.3 + 0.7 * Math.min(1, p.z / 0.55),
            }}
          >
            <TerrainSprite kind={t.kind} w={w} h={h} />
          </div>
        )
      })}

      {/* ── 城市地标（HTML 层，背面自动隐藏） ── */}
      {cityPts.map(({ c, p, vis }) => {
        if (!vis) return null
        const here = c.id === state.cityId
        const active = selected === c.id
        const depth = 0.55 + 0.45 * p.z
        const lmSize = Math.round(Math.max(20, Math.min(64, 40 * zoomG)) * depth)
        return (
          <div
            key={c.id}
            className="absolute city-hit"
            style={{ left: p.x, top: p.y, zIndex: 5 }}
            onPointerDown={e => {
              e.stopPropagation()
              setSelected(active ? null : c.id)
            }}
          >
            <div className="city-lm" style={{ opacity: here ? 1 : 0.68 + 0.24 * p.z }}>
              <CityLandmark id={c.id} size={lmSize} />
              <div
                className="city-pin-dot"
                style={{ background: here ? '#4cba6a' : active ? '#d97320' : '#f5913a' }}
              />
            </div>
          </div>
        )
      })}

      {/* ── 其他商船 ── */}
      {state.aiShips.map(a => {
        const def = AI_SHIPS.find(x => x.id === a.id)
        if (!def) return null
        const g = slerpLonLat(geoOf(def.from), geoOf(def.to), a.t)
        const p = sphere.project(g[0], g[1])
        if (p.z < 0.08) return null
        const gn = slerpLonLat(geoOf(def.from), geoOf(def.to), Math.min(1, a.t + 0.02))
        const pn = sphere.project(gn[0], gn[1])
        return (
          <div
            key={a.id}
            className="absolute pointer-events-none"
            style={{ left: p.x, top: p.y, transform: 'translate(-50%, -70%)', zIndex: 4 }}
          >
            <div className="flex flex-col items-center float-ship" style={{ animationDelay: `${(a.t * 3).toFixed(2)}s` }}>
              <div className="ship-name-tag">{def.name}</div>
              <ShipSprite color={def.color} size={Math.round(30 * zoomG)} flip={pn.x < p.x} />
            </div>
          </div>
        )
      })}

      {/* ── 我的商船 ── */}
      {playerPt.z > 0.05 && (
        <div
          className="absolute pointer-events-none"
          style={{ left: playerPt.x, top: playerPt.y, transform: 'translate(-50%, -70%)', zIndex: 8 }}
        >
          <div className="flex flex-col items-center float-ship2">
            <div className="my-ship-tag">{sailing ? `${Math.ceil(Math.max(0, (sailing.duration - sailing.elapsed)))}s` : `${hold}/${ship.cap}`}</div>
            <div className="relative my-ship-glow">
              <span className="my-ship-ping" />
              <span className="my-ship-ping is-late" />
              <ShipSprite color={ship.color} size={Math.round(38 * zoomG)} highlight />
            </div>
            <div className="my-ship-name" title={displayedShipName}>{displayedShipName}</div>
          </div>
        </div>
      )}

      {/* ── 城市标签（防重叠，点击可选港） ── */}
      <div className="map-label-layer">
        {cityPts.map(({ c, vis }) => {
          if (!vis) return null
          const here = c.id === state.cityId
          const active = selected === c.id
          const r = labelById.get(c.id)
          if (!r) return null // 放不下 → 只留地标圆点
          const variant = r.id.split(':')[1] as 'full' | 'compact'
          const onRight = r.id.endsWith(':r')
          return (
            <div
              key={`lb-${c.id}`}
              className={`city-tag ${variant}${active ? ' active' : ''}${here ? ' here' : ''}`}
              style={{ left: r.x, top: r.y }}
              onPointerDown={e => {
                e.stopPropagation()
                setSelected(active ? null : c.id)
              }}
            >
              {!onRight && <span className="tag-tick" />}
              <div className="pin-label">{c.name}</div>
              {variant === 'full' && <div className="pin-sub">{c.sub}</div>}
            </div>
          )
        })}
      </div>

      {/* 缩放控制（地球半径） */}
      <div className="map-overlay">
        <div className="map-zoom-controls">
          <button className="map-zoom-btn" onClick={() => setZoomG(z => Math.min(GZ_MAX, z * 1.2))} title="放大">＋</button>
          <div className="map-zoom-level" title="当前缩放">{(zoomG * 100).toFixed(0)}%</div>
          <button className="map-zoom-btn" onClick={() => setZoomG(z => Math.max(GZ_MIN, z / 1.2))} title="缩小">－</button>
          <button className="map-zoom-btn map-zoom-reset" onClick={resetGlobe} title="回到出发港">⌂</button>
        </div>
      </div>
    </div>
  )
}
