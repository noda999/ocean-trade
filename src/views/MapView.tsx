import { useEffect, useState } from 'react'
import { CITY_BY_ID, GOOD_BY_ID, START_CITY } from '../game/data'
import { cargoUnits, voyageSeconds, shipOf } from '../game/engine'
import { useGame } from '../game/store'
import { CityLandmark } from '../components/Landmarks'
import FlatWorld from './FlatWorld'
import GlobeWorld from './GlobeWorld'

// ─────────────────────────────────────────────────────────────────────────────
//  地图容器（v1.4.0）：平面手绘图 ⇄ 球形地球 双模式切换
//  航行横幅 / 选港抽屉 / 停靠提示等叠加层在这里共享。
// ─────────────────────────────────────────────────────────────────────────────

type MapMode = 'flat' | 'globe'
const MODE_KEY = 'ocean-trade-map-mode'

export default function MapView({ onOpenIntel }: { onOpenIntel: () => void }) {
  const { state, dispatch } = useGame()
  const [selected, setSelected] = useState<string | null>(null)
  const [mode, setMode] = useState<MapMode>(() => {
    try { return localStorage.getItem(MODE_KEY) === 'globe' ? 'globe' : 'flat' } catch { return 'flat' }
  })

  // 切模式时收起抽屉、记住选择
  function switchMode(m: MapMode) {
    if (m === mode) return
    setMode(m)
    setSelected(null)
    try { localStorage.setItem(MODE_KEY, m) } catch { /* ignore */ }
  }

  const ship = shipOf(state.shipId)
  // 兜底：存档城市缺失时不崩，回到出生点
  const cur = CITY_BY_ID[state.cityId] ?? CITY_BY_ID[START_CITY]
  const sel = selected ? CITY_BY_ID[selected] : null
  const sailing = state.voyage
  const fromCity = sailing ? CITY_BY_ID[sailing.from] : null
  const toCity = sailing ? CITY_BY_ID[sailing.to] : null
  const progress = sailing ? Math.min(1, sailing.elapsed / sailing.duration) : 0
  const remain = sailing ? Math.max(0, sailing.duration - sailing.elapsed) : 0
  const hold = cargoUnits(state.cargo)
  const cm = state.markets[state.cityId]

  function sailTo(cityId: string) {
    dispatch({ type: 'SAIL', cityId })
    setSelected(null)
  }

  // ESC 关抽屉
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="map-canvas">
      {/* ── 世界层：平面手绘图 / 球形地球 ── */}
      {mode === 'globe'
        ? <GlobeWorld selected={selected} setSelected={setSelected} />
        : <FlatWorld selected={selected} setSelected={setSelected} />}

      {/* ── 叠加层：模式切换 / 航行横幅 / 选港抽屉 / 停靠提示（不随地图变换） ── */}
      <div className="map-overlay">
        {/* ── 平面 ⇄ 地球 模式切换 ── */}
        <div className="map-mode-toggle" onPointerDown={e => e.stopPropagation()}>
          <button
            className={`map-mode-btn${mode === 'globe' ? ' on' : ''}`}
            onClick={() => switchMode('globe')}
            title="球形地球"
          >🌍</button>
          <button
            className={`map-mode-btn${mode === 'flat' ? ' on' : ''}`}
            onClick={() => switchMode('flat')}
            title="平面地图"
          >🗺️</button>
        </div>

        {/* ── 航行中横幅（保持在视口顶部，不缩放） ── */}
        {sailing && fromCity && toCity && (
          <div className="absolute left-3 right-3 z-20" style={{ top: 10, pointerEvents: 'auto' }}>
            <div className="voyage-banner">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">🧭</span>
                <span className="text-xs font-800" style={{ color: '#ffe6c0' }}>
                  {fromCity.name} <span style={{ color: '#f5913a' }}>···→</span> {toCity.name}
                </span>
                <span className="ml-auto text-xs font-800" style={{ color: '#fdb870' }}>
                  剩余 {Math.ceil(remain)} 秒
                </span>
              </div>
              <div className="voyage-track">
                <div className="voyage-fill" style={{ width: `${progress * 100}%` }} />
                <span className="voyage-ship" style={{ left: `calc(${progress * 100}% - 9px)` }}>🚢</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs" style={{ color: 'rgba(255,220,150,0.75)' }}>
                  载货 {hold}/{ship.cap}
                </span>
                <button
                  className="speed-up-btn ml-auto px-3 py-1 text-xs"
                  onPointerDown={e => { e.stopPropagation(); dispatch({ type: 'USE_BOOST' }) }}
                >
                  ⚡ 加速 · 剩 {state.boost}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 已选港口底部抽屉 ── */}
        {sel && !sailing && (
          <div
            className="absolute left-0 right-0 bottom-0 z-20"
            onPointerDown={e => e.stopPropagation()}
          >
            <div className="sheet p-4 pb-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 rounded-2xl flex items-end justify-center flex-shrink-0" style={{ background: '#fff5ec', overflow: 'hidden' }}>
                  <div style={{ marginBottom: -6 }}>
                    <CityLandmark id={sel.id} size={56} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-900 text-lg" style={{ color: '#3d2b10' }}>{sel.name}</span>
                    {sel.id === state.cityId && <span className="badge-green">当前港口</span>}
                  </div>
                  <div className="text-xs mb-1" style={{ color: '#a07030' }}>{sel.blurb}</div>
                  <div className="text-xs" style={{ color: '#8a6a40' }}>
                    特产（可买入） <b style={{ color: '#4cba6a' }}>{sel.exports.map(g => GOOD_BY_ID[g].name).join('·')}</b>
                    {' · '}
                    紧缺（可卖出） <b style={{ color: '#e05050' }}>{sel.imports.slice(0, 3).map(g => GOOD_BY_ID[g].name).join('·')}</b>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-lg leading-none px-1"
                  style={{ color: '#c9b394' }}
                >✕</button>
              </div>

              {/* 快速行情预览（本港未经营时按全球基准价对比） */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {sel.exports.slice(0, 3).map(gid => {
                  const m = state.markets[sel.id]?.[gid]
                  if (!m) return null
                  const local = state.markets[state.cityId]?.[gid]
                  const cheaper = local ? m.price < local.price : m.price < GOOD_BY_ID[gid].base
                  return (
                    <div key={gid} className="flex-shrink-0 px-2.5 py-1.5 rounded-xl" style={{ background: '#fff8f0', border: '1.5px solid #f5e0c0' }}>
                      <div className="text-xs font-700" style={{ color: '#3d2b10' }}>
                        {GOOD_BY_ID[gid].icon} {GOOD_BY_ID[gid].name}
                      </div>
                      <div className="text-xs font-900" style={{ color: cheaper ? '#4cba6a' : '#e05050' }}>
                        {m.price} <span style={{ fontSize: 9, color: '#a07030' }}>金</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: '#fff5ec' }}>
                <span>⏱️</span>
                <span className="text-xs font-700" style={{ color: '#3d2b10' }}>预计航行时间</span>
                <span className="ml-auto font-900 text-sm" style={{ color: '#f5913a' }}>
                  {sel.id === state.cityId ? '已在港内' : `${voyageSeconds(cur, sel, ship)} 秒`}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn-orange flex-1 py-2.5 text-sm"
                  style={{ borderRadius: 14, opacity: sel.id === state.cityId ? 0.5 : 1 }}
                  disabled={sel.id === state.cityId}
                  onClick={() => sailTo(sel.id)}
                >
                  {sel.id === state.cityId ? '⚓ 当前所在港口' : '⚓ 起航前往'}
                </button>
                <button
                  className="btn-ghost-orange px-3 py-2 text-xs"
                  style={{ borderRadius: 14 }}
                  onClick={() => { onOpenIntel(); setSelected(null) }}
                >
                  📡 看情报
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 货舱提示条（未选港时） */}
        {!sel && !sailing && (
          <div className="absolute left-3 right-3 z-10" style={{ bottom: 10 }}>
            <div className="panel-white px-3 py-2 flex items-center gap-2" style={{ borderRadius: 14 }}>
              <span className="text-lg">📍</span>
              <span className="text-xs font-700" style={{ color: '#3d2b10' }}>
                已停靠 <b style={{ color: '#f5913a' }}>{cur.name}</b> · 点击地图上的城市即可起航
              </span>
              <span className="ml-auto text-xs font-800" style={{ color: cm ? '#4cba6a' : '#a07030' }}>
                {hold}/{ship.cap} 载
              </span>
            </div>
          </div>
        )}
      </div>{/* /map-overlay */}
    </div>
  )
}
