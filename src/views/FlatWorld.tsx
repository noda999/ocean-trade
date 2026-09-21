import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { AI_SHIPS, CITIES, CITY_BY_ID, START_CITY, shipDisplayName } from '../game/data'
import { cargoUnits, routePath, routePoint, shipOf } from '../game/engine'
import { useGame } from '../game/store'
import { CityLandmark } from '../components/Landmarks'
import { ShipSprite, TinyBoat } from '../components/ShipSprite'
import { flatPill, placeLabels, type LabelRect } from '../game/labels'
import { GEO_FEATURES } from '../game/geoFeatures'

// ─────────────────────────────────────────────────────────────────────────────
//  平面手绘世界地图（v1.3.0 引入，v1.4.0 增加标签防重叠）
//  21 港在城市密集区（欧洲 / 东南亚）标签不再叠罗汉：
//  放不下英文副标就只显示中文名，再放不下就只留地标圆点。
// ─────────────────────────────────────────────────────────────────────────────

// ── 世界地图形状（x/y 均为 0-100，与城市坐标同一坐标系） ──────────────────────

const CONTINENTS = [
  // 斯堪的纳维亚（挪威）
  'M-8,-8 C8,-14 26,-12 32,-4 C36,4 30,12 22,16 C14,20 4,22 -4,24 C-10,20 -12,6 -8,-8 Z',
  // 英伦三岛（英国）
  'M-2,26 C3,22 10,23 12,28 C14,33 9,37 3,37 C-3,37 -6,32 -2,26 Z',
  // 西欧（法国）
  'M10,34 C18,30 28,32 30,38 C32,44 26,49 18,48 C10,47 6,40 10,34 Z',
  // 亚洲东部（中国）
  'M49,-9 C68,-14 92,-11 101,-4 C106,2 104,14 96,22 C90,29 80,42 70,39 C62,36 56,27 52,22 C46,16 43,4 49,-9 Z',
  // 日本列岛
  'M88,29 C93,25 99,27 100,32 C101,37 96,41 91,40 C87,39 85,32 88,29 Z',
  // 中东 + 印度（波斯 / 阿拉伯 / 印度）
  'M13,24 C22,16 33,22 40,18 C49,14 58,19 62,26 C66,33 60,41 53,46 C46,51 38,49 31,46 C23,43 15,42 12,37 C9,32 10,28 13,24 Z',
  // 斯里兰卡
  'M52,42 C56,38 63,39 65,44 C67,49 62,54 57,53 C51,52 48,46 52,42 Z',
  // 马来半岛（马六甲）
  'M67,49 C72,45 79,47 82,53 C85,59 81,66 75,66 C69,66 64,58 67,49 Z',
  // 爪哇岛
  'M70,70 C77,66 85,68 87,73 C89,78 83,81 76,80 C70,79 66,74 70,70 Z',
  // 非洲（埃及 / 南非）
  'M-8,47 C8,40 25,42 33,52 C41,62 44,73 40,83 C36,91 22,95 11,93 C0,91 -9,82 -9,68 Z',
  // 马达加斯加
  'M36,79 C39,76 44,78 44,82 C44,86 39,88 36,85 C34,83 34,81 36,79 Z',
  // 新大陆（阿兹特克 / 印加）
  'M58,88 C70,82 86,84 94,91 C100,97 96,104 86,105 C72,107 56,103 52,96 C49,90 53,90 58,88 Z',
]

/** 陆地纹理（草坡） */
const TUFT = [
  [6, 6], [20, 14], [10, 22], [28, 2], [72, 4], [86, 12], [95, 24], [62, 8],
  [22, 30], [34, 34], [44, 26], [56, 32], [4, 60], [16, 58], [30, 62], [12, 78], [26, 84],
  [7, 29], [18, 40], [45, 25], [94, 33], [78, 74], [75, 90], [62, 95], [31, 55],
]

/** 山脉 */
const MOUNTAINS = [
  [13, 6], [24, 10], [84, 8], [70, 30], [45, 25], [18, 56],
  [70, 90], [86, 92], [63, 92],
]

/** 海面礁石 / 小岛 */
const REEF = [
  [40, 62], [46, 68], [34, 74], [58, 68], [88, 62], [6, 42], [92, 40], [47, 86],
  [56, 60], [8, 96], [96, 52], [42, 15], [36, 55], [50, 90],
]

/** 渔船点缀 */
const BOAT_DOTS: [number, number][] = [[44, 58], [50, 74], [62, 78]]

const ZOOM_MIN = 0.6
const ZOOM_MAX = 2.5

interface Props {
  selected: string | null
  setSelected: (v: string | null) => void
}

export default function FlatWorld({ selected, setSelected }: Props) {
  const { state } = useGame()
  const rootRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  // ── 地图平移 / 缩放状态 ───────────────────────────────────────────────────
  const [pan, setPan] = useState({ x: 0, y: 0 }) // 平移，屏幕像素
  const [zoom, setZoom] = useState(1)             // 缩放 0.6 .. 2.5
  const worldRef = useRef<HTMLDivElement>(null)
  // 活动指针集合：pointerId → {x, y}，支持双指缩放
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map())
  const dragRef = useRef<{
    startX: number; startY: number
    moved: number
    isDragging: boolean
    pinchStartDist: number | null
    pinchStartZoom: number
    pinchCenter: { x: number; y: number } | null
  }>({ startX: 0, startY: 0, moved: 0, isDragging: false, pinchStartDist: null, pinchStartZoom: 1, pinchCenter: null })

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

  function setZoomAround(newZoom: number, anchorX: number, anchorY: number) {
    setZoom(prev => {
      const z = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZoom))
      if (z === prev) return prev
      // 以 anchorX/Y 为锚点缩放（保持该点在世界坐标下不动）
      setPan(p => ({
        x: anchorX - (anchorX - p.x) * (z / prev),
        y: anchorY - (anchorY - p.y) * (z / prev),
      }))
      return z
    })
  }
  function resetView() {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    // 命中城市锚点 / 叠加层 → 不开始拖动（让城市自己的事件处理）
    if (target.closest('.city-hit')) return
    if (target.closest('.map-overlay')) return
    if (target.closest('.city-tag')) return

    e.currentTarget.setPointerCapture(e.pointerId)
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size === 1) {
      dragRef.current = {
        startX: e.clientX, startY: e.clientY,
        moved: 0, isDragging: false,
        pinchStartDist: null, pinchStartZoom: zoom, pinchCenter: null,
      }
    } else if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      const cx = (a.x + b.x) / 2
      const cy = (a.y + b.y) / 2
      const rect = worldRef.current?.getBoundingClientRect()
      const localCx = rect ? cx - rect.left : cx
      const localCy = rect ? cy - rect.top : cy
      dragRef.current.pinchStartDist = d
      dragRef.current.pinchStartZoom = zoom
      dragRef.current.pinchCenter = { x: localCx, y: localCy }
      dragRef.current.isDragging = true
    }
  }
  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(e.pointerId)) return
    const prev = pointersRef.current.get(e.pointerId)!
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    const list = [...pointersRef.current.values()]
    if (list.length === 1) {
      const ddx = e.clientX - prev.x
      const ddy = e.clientY - prev.y
      if (!dragRef.current.isDragging) {
        const total = Math.hypot(
          e.clientX - dragRef.current.startX,
          e.clientY - dragRef.current.startY,
        )
        if (total < 6) return
        dragRef.current.isDragging = true
      }
      setPan(p => ({ x: p.x + ddx, y: p.y + ddy }))
    } else if (list.length === 2 && dragRef.current.pinchStartDist) {
      const d = Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y)
      const newZoom = dragRef.current.pinchStartZoom * (d / dragRef.current.pinchStartDist)
      const c = dragRef.current.pinchCenter!
      setZoomAround(newZoom, c.x, c.y)
    }
  }
  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    // 不是从地图根节点起的手势（例如点中 .city-hit / .city-tag 后冒泡上来的 pointerup）→ 不处理
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.delete(e.pointerId)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
    if (pointersRef.current.size === 0) {
      if (!dragRef.current.isDragging) {
        // 算作点击空海：取消高亮
        setSelected(null)
      }
      dragRef.current = {
        startX: 0, startY: 0, moved: 0, isDragging: false,
        pinchStartDist: null, pinchStartZoom: zoom, pinchCenter: null,
      }
    }
  }

  // 滚轮缩放：必须用原生事件以便 preventDefault
  useEffect(() => {
    const el = worldRef.current
    if (!el) return
    function onWheel(ev: WheelEvent) {
      ev.preventDefault()
      const rect = el!.getBoundingClientRect()
      const cx = ev.clientX - rect.left
      const cy = ev.clientY - rect.top
      const factor = ev.deltaY > 0 ? 0.88 : 1.14
      // 通过 setZoomAround 的双闭包间接调用——直接拿当前 zoom
      setZoom(prev => {
        const z = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, prev * factor))
        if (z === prev) return prev
        setPan(p => ({
          x: cx - (cx - p.x) * (z / prev),
          y: cy - (cy - p.y) * (z / prev),
        }))
        return z
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // 键盘 +/- 重置 也方便桌面端调试
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.target instanceof HTMLInputElement) return
      if (ev.key === '+' || ev.key === '=') setZoomAround(zoom * 1.15, window.innerWidth / 2, window.innerHeight / 2)
      else if (ev.key === '-' || ev.key === '_') setZoomAround(zoom / 1.15, window.innerWidth / 2, window.innerHeight / 2)
      else if (ev.key === '0') resetView()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  const ship = shipOf(state.shipId)
  // 兜底：存档城市缺失时不崩，回到出生点
  const cur = CITY_BY_ID[state.cityId] ?? CITY_BY_ID[START_CITY]
  const sailing = state.voyage
  const fromCity = sailing ? CITY_BY_ID[sailing.from] : null
  const toCity = sailing ? CITY_BY_ID[sailing.to] : null
  const progress = sailing ? Math.min(1, sailing.elapsed / sailing.duration) : 0
  const hold = cargoUnits(state.cargo)

  const playerPos = sailing && fromCity && toCity
    ? routePoint(fromCity, toCity, progress)
    : { x: cur.x + 3.5, y: cur.y + 4 }

  const displayedShipName = shipDisplayName(state.shipName, ship.name)

  // ── 城市锚点（视口像素坐标） ──────────────────────────────────────────────
  const anchors = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>()
    if (!size.w || !size.h) return map
    for (const c of CITIES) {
      map.set(c.id, {
        x: (c.x / 100) * size.w * zoom + pan.x,
        y: (c.y / 100) * size.h * zoom + pan.y,
      })
    }
    return map
  }, [size.w, size.h, zoom, pan])

  // ── 标签防重叠：full（中英文） → compact（仅中文） → 只留圆点 ─────────────
  const labels = useMemo(() => {
    if (!size.w || !size.h) return []
    const prio = (id: string) =>
      id === state.cityId || id === selected || id === state.voyage?.to ? 1 : 0
    const order = [...CITIES].sort((a, b) => prio(b.id) - prio(a.id))
    const cands: LabelRect[] = []
    for (const c of order) {
      const a = anchors.get(c.id)
      if (!a) continue
      // 视口外（留 80px 余量）不摆标签
      if (a.x < -80 || a.y < -80 || a.x > size.w + 80 || a.y > size.h + 80) continue
      for (const variant of ['full', 'compact'] as const) {
        const { w, h } = flatPill(c.name, c.sub, 1, variant)
        cands.push({ id: `${c.id}:${variant}:r`, group: c.id, x: a.x + 13, y: a.y - h / 2, w, h })
        cands.push({ id: `${c.id}:${variant}:l`, group: c.id, x: a.x - 13 - w, y: a.y - h / 2, w, h })
      }
    }
    const force = new Set<string>()
    for (const c of order) {
      if (prio(c.id)) force.add(`${c.id}:full:r`)
    }
    return placeLabels(cands, { x0: 4, y0: 52, x1: size.w - 4, y1: size.h - 56 }, { gap: 3, force })
  }, [anchors, size.w, size.h, state.cityId, state.voyage, selected])

  const labelById = new Map(labels.map(l => [l.id.split(':')[0], l]))

  // 地标实际大小随缩放适配：缩小时图标跟着变小，避免堆叠
  const lmEff = Math.max(26, Math.min(110, 58 * zoom))
  const lmWorld = Math.round(lmEff / zoom)
  // 圆点在 world 层会随 zoom 放大，做反向补偿
  const dotSize = Math.max(5, Math.round(9 / zoom))

  return (
    <div ref={rootRef} className="absolute inset-0">
      {/* ── 可拖动可缩放的世界地图层 ── */}
      <div
        ref={worldRef}
        className="map-world"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          willChange: 'transform',
          touchAction: 'none',
          cursor: dragRef.current.isDragging ? 'grabbing' : 'grab',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* ── 背景世界地图 ── */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <linearGradient id="seaGrad" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0%" stopColor="#a5e6f7" />
              <stop offset="38%" stopColor="#63c9ea" />
              <stop offset="100%" stopColor="#2f9ec9" />
            </linearGradient>
            <linearGradient id="landGrad" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#b3e39c" />
              <stop offset="45%" stopColor="#7fcd6b" />
              <stop offset="100%" stopColor="#55a746" />
            </linearGradient>
            <radialGradient id="sunGlint" cx="0.86" cy="0.1" r="0.5">
              <stop offset="0%" stopColor="white" stopOpacity="0.42" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill="url(#seaGrad)" />

          {/* 海浪纹 */}
          {Array.from({ length: 9 }, (_, i) => {
            const y = 7 + i * 11
            return (
              <path
                key={i}
                d={`M-4,${y} q7,-2 14,0 t14,0 t14,0 t14,0 t14,0 t14,0 t14,0 t14,0`}
                stroke="white"
                strokeWidth="0.28"
                fill="none"
                opacity="0.28"
              />
            )
          })}

          {/* 大陆：先描沙边，再铺陆地渐变 */}
          {CONTINENTS.map((d, i) => (
            <g key={i}>
              <path d={d} fill="#f6e5ac" stroke="#f6e5ac" strokeWidth="2.4" strokeLinejoin="round" />
              <path d={d} fill="url(#landGrad)" />
            </g>
          ))}

          {/* 陆地纹理 */}
          {TUFT.map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={2.4} ry={1.4} fill="#4e9c40" opacity="0.22" />
          ))}
          {/* 山脉 */}
          {MOUNTAINS.map(([x, y], i) => (
            <path key={i} d={`M${x},${y} l1.4,-2.6 l1.4,2.6 Z`} fill="#8a9a7a" opacity="0.55" />
          ))}

          {/* 礁石 */}
          {REEF.map(([x, y], i) => (
            <g key={i} opacity="0.55">
              <ellipse cx={x} cy={y} rx={1.5} ry={0.9} fill="white" opacity="0.5" />
              <ellipse cx={x} cy={y + 0.6} rx={1} ry={0.6} fill="#f6e5ac" />
            </g>
          ))}

          {/* 阳光反光 */}
          <rect x="0" y="0" width="100" height="100" fill="url(#sunGlint)" />

          {/* 其他商船航线 */}
          {AI_SHIPS.map(s => {
            const a = CITY_BY_ID[s.from]
            const b = CITY_BY_ID[s.to]
            if (!a || !b) return null
            return (
              <path
                key={s.id}
                d={routePath(a, b)}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="0.3"
                strokeDasharray="1.6,1.4"
                fill="none"
              />
            )
          })}

          {/* 玩家当前航线 */}
          {sailing && fromCity && toCity && (
            <path
              d={routePath(fromCity, toCity)}
              stroke="rgba(245,145,58,0.75)"
              strokeWidth="0.5"
              strokeDasharray="2,1.6"
              fill="none"
            />
          )}
        </svg>

        {/* ── 地理标注：平面图只留大洋与马六甲海峡（调淡），地形用图形 ── */}
        {GEO_FEATURES.filter(f => f.flatText).map(f => (
          <div
            key={`geo-${f.name}`}
            className={`geo-label geo-${f.kind}`}
            style={{
              left: `${f.flat.x}%`,
              top: `${f.flat.y}%`,
              transform: `translate(-50%, -50%) rotate(${f.flat.rotate}deg)`,
              zIndex: 2,
              opacity: 0.6,
            }}
          >
            {f.name}
          </div>
        ))}

        {/* ── 城市锚点：建筑塔（标签移到不随缩放的浮层，自动避让） ── */}
        {CITIES.map(c => {
          const here = c.id === state.cityId
          const active = selected === c.id
          return (
            <div
              key={c.id}
              className="absolute city-hit"
              style={{ left: `${c.x}%`, top: `${c.y}%`, zIndex: 5 }}
              onPointerDown={e => {
                e.stopPropagation()
                setSelected(active ? null : c.id)
              }}
            >
              {/* 建筑塔：底部中心对准城市锚点 */}
              <div className="city-lm" style={{ opacity: here ? 1 : 0.92 }}>
                <CityLandmark id={c.id} size={lmWorld} />
                <div
                  className="city-pin-dot"
                  style={{
                    width: dotSize, height: dotSize,
                    background: here ? '#4cba6a' : active ? '#d97320' : '#f5913a',
                  }}
                />
              </div>
            </div>
          )
        })}

        {/* ── 其他商船 ── */}
        {state.aiShips.map(a => {
          const def = AI_SHIPS.find(x => x.id === a.id)
          if (!def) return null
          const from = CITY_BY_ID[def.from]
          const to = CITY_BY_ID[def.to]
          const p = routePoint(from, to, a.t)
          return (
            <div
              key={a.id}
              className="absolute pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: 'translate(-50%, -70%)',
                zIndex: 4,
                transition: 'left .2s linear, top .2s linear',
              }}
            >
              <div
                className="flex flex-col items-center float-ship"
                style={{ animationDelay: `${(a.t * 3).toFixed(2)}s` }}
              >
                <div className="ship-name-tag">{def.name}</div>
                <ShipSprite color={def.color} size={38} flip={to.x < from.x} />
              </div>
            </div>
          )
        })}

        {/* ── 我的商船 ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            transform: 'translate(-50%, -70%)',
            zIndex: 8,
            transition: 'left .2s linear, top .2s linear',
          }}
        >
          <div className="flex flex-col items-center float-ship2">
            <div className="my-ship-tag">{sailing ? `${Math.ceil(Math.max(0, sailing.duration - sailing.elapsed))}s` : `${hold}/${ship.cap}`}</div>
            <div className="relative my-ship-glow">
              <span className="my-ship-ping" />
              <span className="my-ship-ping is-late" />
              <ShipSprite color={ship.color} size={52} highlight />
            </div>
            <div className="my-ship-name" title={displayedShipName}>{displayedShipName}</div>
            {sailing && (
              <div className="wake-dots">
                <span /><span /><span />
              </div>
            )}
          </div>
        </div>

        {/* 渔船点缀 */}
        {BOAT_DOTS.map(([x, y], i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', zIndex: 3 }}
          >
            <div className="float-ship" style={{ animationDelay: `${i * 0.9}s` }}>
              <TinyBoat size={20} />
            </div>
          </div>
        ))}
      </div>{/* ── /map-world ── */}

      {/* ── 城市标签浮层：不随缩放，自动避让（v1.4.0） ── */}
      <div className="map-label-layer">
        {CITIES.map(c => {
          const a = anchors.get(c.id)
          const r = labelById.get(c.id)
          if (!a || !r) return null
          const here = c.id === state.cityId
          const target = state.voyage?.to === c.id
          const active = selected === c.id
          const variant = r.id.split(':')[1] as 'full' | 'compact'
          const onRight = r.id.endsWith(':r')
          return (
            <div key={`lb-${c.id}`}>
              {/* 标签 */}
              <div
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
              {/* 顶部徽标（所在位置 / 前往中） */}
              {(here || target) && (
                <div
                  className={`city-badge ${here ? 'here-badge' : 'target-badge'}`}
                  style={{ left: a.x, top: a.y - lmEff - 14, transform: 'translate(-50%, 0)' }}
                >
                  {here ? '所在位置' : '前往中'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 缩放控制条 */}
      <div className="map-overlay">
        <div className="map-zoom-controls">
          <button
            className="map-zoom-btn"
            onClick={() => setZoomAround(zoom * 1.2, window.innerWidth / 2, window.innerHeight / 2)}
            title="放大 (+)"
          >＋</button>
          <div className="map-zoom-level" title="点击重置视图">{(zoom * 100).toFixed(0)}%</div>
          <button
            className="map-zoom-btn"
            onClick={() => setZoomAround(zoom / 1.2, window.innerWidth / 2, window.innerHeight / 2)}
            title="缩小 (-)"
          >－</button>
          <button
            className="map-zoom-btn map-zoom-reset"
            onClick={resetView}
            title="重置视图 (0)"
          >⟳</button>
        </div>
      </div>
    </div>
  )
}
