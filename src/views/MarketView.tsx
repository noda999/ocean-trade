import { useEffect, useState } from 'react'
import { CITIES, CITY_BY_ID, GOOD_BY_ID } from '../game/data'
import {
  anchorPrice, bestSellHint, cargoUnits, isScarce, sellPrice, shipOf,
} from '../game/engine'
import { useGame } from '../game/store'
import { CityLandmark } from '../components/Landmarks'

export default function MarketView() {
  const { state, dispatch } = useGame()
  const [open, setOpen] = useState<string | null>(null)
  const [qty, setQty] = useState(10)

  const [viewCityId, setViewCityId] = useState(state.cityId)

  // 派生量必须先于 useEffect 声明 —— effect deps 是同步求值的数组字面量，
  // 若 cm 等在后面声明会被 ESBuild minify 后暴露成 TDZ（ReferenceError）。
  const ship = shipOf(state.shipId)
  const city = CITY_BY_ID[viewCityId]
  const cm = state.markets[viewCityId]
  const here = viewCityId === state.cityId
  const held = cargoUnits(state.cargo)
  const room = ship.cap - held
  const sailing = state.voyage
  const canTrade = here && !sailing

  // 自动夹住 qty：市场刷新或货舱变化导致可用上限缩小时，UI 数量跟着缩
  useEffect(() => {
    if (!open) return
    const m = cm?.[open]
    if (!m) return
    const maxRoom = Math.max(0, Math.min(room, m.stock))
    if (qty > maxRoom) setQty(Math.max(1, maxRoom))
  }, [open, cm, room, qty])

  // 抵达新港口时自动切回本港
  useEffect(() => { setViewCityId(state.cityId) }, [state.cityId])

  // 每个港口只经营自己的特产 + 紧缺货，其余不挂牌
  const tradedIds = [...city.exports, ...city.imports.filter(x => !city.exports.includes(x))]

  /** 是否掌握该城市实时行情 */
  const isKnown = (cid: string) => state.intelOwned || state.visited.includes(cid)

  const refreshIn = Math.ceil(state.marketTimer)

  function trade(goodId: string, kind: 'BUY' | 'SELL', max: number) {
    if (!canTrade) return
    const m = cm?.[goodId]
    if (!m) return
    // 统一数值校验：禁止 NaN / 负数 / 小数；并按当前行情（最新 m.stock / 货舱余量 / 金钱）
    // 夹紧，防止市场刷新后用陈旧的 qty state 提交超出上限的请求
    let cap = max
    if (kind === 'BUY') {
      const afford = Math.max(0, Math.floor(state.money / m.price))
      cap = Math.min(cap, m.stock, afford, room)
    } else {
      const held = state.cargo[goodId]?.qty ?? 0
      cap = Math.min(cap, held)
    }
    const n = Math.max(0, Math.min(Math.floor(Number.isFinite(qty) ? qty : 0), Math.max(1, cap)))
    dispatch({ type: kind, goodId, qty: n })
  }

  return (
    <div className="absolute inset-0 overflow-auto" style={{ background: '#f8f0e0' }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: '#f8f0e0' }}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl flex items-end justify-center flex-shrink-0" style={{ background: '#fff5ec', overflow: 'hidden' }}>
            <div style={{ marginBottom: -5 }}>
              <CityLandmark id={city.id} size={48} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-900 text-xl" style={{ color: '#3d2b10' }}>{city.name} 市场</span>
              {here
                ? <span className="badge-green">本港</span>
                : <span className="badge-orange">仅查看</span>}
            </div>
            <div className="text-xs" style={{ color: '#a07030' }}>
              特产 <b style={{ color: '#4cba6a' }}>{city.exports.map(g => GOOD_BY_ID[g].name).join('·')}</b>
              {' · '}行情 <b style={{ color: '#e05050' }}>{refreshIn}s</b> 后刷新
            </div>
          </div>
          <div className="stat-pill flex-shrink-0">
            <span style={{ fontSize: 14 }}>🪙</span>
            <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>{Math.floor(state.money).toLocaleString()}</span>
          </div>
        </div>

        {/* 载重 */}
        <div className="panel-white p-2.5 mb-3" style={{ borderRadius: 14 }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-700" style={{ color: '#3d2b10' }}>货舱 {held}/{ship.cap}</span>
            <span className="text-xs ml-auto" style={{ color: '#a07030' }}>{ship.name} · 利润 +{ship.bonus}%</span>
          </div>
          <div className="prog-track h-2.5">
            <div className="prog-fill" style={{ width: `${(held / ship.cap) * 100}%` }} />
          </div>
        </div>

        {/* 城市行情切换：本港可交易，其他已探明城市仅可查看 */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CITIES.map(c => {
            const known = isKnown(c.id)
            const isCurrentPort = c.id === state.cityId
            const viewing = c.id === viewCityId
            return (
              <button
                key={c.id}
                disabled={!known}
                onClick={() => known && setViewCityId(c.id)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-800 rounded-full"
                style={viewing
                  ? { background: '#f5913a', color: 'white', boxShadow: '0 2px 6px rgba(245,145,58,0.4)' }
                  : known
                    ? { background: 'white', color: '#a07030', border: '1.5px solid #f5c87a', cursor: 'pointer' }
                    : { background: '#f4eee1', color: '#b8ab94', border: '1.5px dashed #ddd0b8' }}
              >
                {isCurrentPort && <span style={{ marginRight: 2 }}>📍</span>}
                {c.name}
                {!known && <span style={{ marginLeft: 4, fontSize: 9 }}>未探明</span>}
              </button>
            )
          })}
        </div>

        {!here && (
          <div className="panel-cream px-3 py-2 mt-2 flex items-center gap-2 text-xs font-800" style={{ color: '#8a6a40' }}>
            🔍 正在查看 <b style={{ color: '#3d2b10' }}>{city.name}</b> 行情
            <button
              className="btn-ghost-orange ml-auto px-2.5 py-1 text-xs"
              style={{ borderRadius: 10 }}
              onClick={() => setViewCityId(state.cityId)}
            >
              回到本港
            </button>
          </div>
        )}
      </div>

      {sailing && (
        <div className="px-4 pb-2">
          <div className="panel-orange px-3 py-2 text-xs font-800 flex items-center gap-2">
            ⛔ 航行途中无法交易，抵达 {CITY_BY_ID[sailing.to].name} 后即可开市
          </div>
        </div>
      )}
      {!sailing && !here && (
        <div className="px-4 pb-2">
          <div className="panel-orange px-3 py-2 text-xs font-800 flex items-center gap-2">
            ⛔ 只能在停靠的港口交易，此处仅可查看行情比价
          </div>
        </div>
      )}

      {/* 货物列表：仅本港经营的商品 */}
      <div className="px-4 pb-6 flex flex-col gap-2">
        {tradedIds.map(id => {
          const g = GOOD_BY_ID[id]
          const m = cm[g.id]
          const anchor = anchorPrice(city, g)
          const ratio = m.price / anchor
          const scarce = isScarce(m)
          const isExport = city.exports.includes(g.id)
          const isImport = city.imports.includes(g.id)
          const mine = state.cargo[g.id]
          const best = bestSellHint(g.id, state.markets, ship.bonus, isKnown, state.cityId)
          const unit = sellPrice(g, cm, ship.bonus)
          const margin = Math.round(((best.price - m.price) / m.price) * 100)
          const expanded = open === g.id
          const roomUse = Math.max(0, Math.min(room, m.stock))

          return (
            <div key={g.id} className="panel-white" style={{ borderRadius: 14, overflow: 'hidden' }}>
              <div
                className="p-3 cursor-pointer"
                onClick={() => { setOpen(expanded ? null : g.id); setQty(10) }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#fff5ec' }}>
                    {g.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>{g.name}</span>
                      {isExport && <span className="badge-green">特产</span>}
                      {isImport && <span className="badge-orange">紧缺</span>}
                      {scarce && <span className="badge-red">行情暴涨</span>}
                      {m.momentum > 0.02 && <span className="text-xs" style={{ color: '#4cba6a' }}>▲</span>}
                      {m.momentum < -0.02 && <span className="text-xs" style={{ color: '#e05050' }}>▼</span>}
                    </div>
                    <div className="flex gap-2 text-xs flex-wrap" style={{ color: '#a07030' }}>
                      <span>均价 <b style={{ color: '#8a6a40' }}>{anchor}</b></span>
                      <span>
                        性价比
                        <b style={{ color: ratio < 0.9 ? '#4cba6a' : ratio > 1.25 ? '#e05050' : '#8a6a40' }}>
                          {ratio < 0.9 ? ' 划算' : ratio > 1.25 ? ' 偏贵' : ' 持平'}
                        </b>
                      </span>
                      <span>库存 <b style={{ color: '#8a6a40' }}>{m.stock}</b></span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-900 text-base" style={{ color: '#f5913a' }}>{m.price}</div>
                    <div className="text-xs" style={{ color: '#a07030' }}>金/件</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: '1.5px dashed #f0e2c8' }}>
                  {mine ? (
                    <span className="text-xs font-700" style={{ color: '#4cba6a' }}>货舱中 {mine.qty} · 成本 {(mine.cost / mine.qty).toFixed(0)}/件</span>
                  ) : (
                    <span className="text-xs" style={{ color: '#c0a070' }}>未持有</span>
                  )}
                  <span className="ml-auto text-xs" style={{ color: '#a07030' }}>
                    销往 <b style={{ color: '#3d2b10' }}>{best.city.name}</b>
                    {best.estimated && <span className="est-tag">预估</span>}
                    {' '}可卖 <b style={{ color: '#4cba6a' }}>{best.price}</b>
                    <b style={{ color: margin > 0 ? '#4cba6a' : '#e05050' }}> ({margin > 0 ? '+' : ''}{margin}%)</b>
                  </span>
                </div>
              </div>

              {expanded && (
                <div className="px-3 pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-700" style={{ color: '#8a6a40' }}>数量</span>
                    <div className="flex items-center gap-1.5 ml-auto">
                      {[1, 10, 50].map(n => (
                        <button
                          key={n}
                          onClick={() => setQty(n)}
                          className="text-xs font-800 px-2.5 py-1 rounded-lg"
                          style={qty === n
                            ? { background: '#f5913a', color: 'white' }
                            : { background: '#fff5ec', color: '#a07030' }}
                        >{n}</button>
                      ))}
                      <button
                        onClick={() => setQty(Math.max(1, Math.min(roomUse, Math.floor(state.money / m.price))))}
                        className="text-xs font-800 px-2.5 py-1 rounded-lg"
                        style={{ background: '#fff5ec', color: '#a07030' }}
                      >MAX</button>
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          className="w-6 h-6 rounded-lg text-sm font-900"
                          style={{ background: '#f8f0e0', color: '#8a6a40' }}
                          onClick={() => setQty(q => Math.max(1, q - 5))}
                        >−</button>
                        <span className="w-9 text-center text-sm font-900" style={{ color: '#3d2b10' }}>{qty}</span>
                        <button
                          className="w-6 h-6 rounded-lg text-sm font-900"
                          style={{ background: '#f8f0e0', color: '#8a6a40' }}
                          onClick={() => setQty(q => q + 5)}
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: '#8a6a40' }}>
                    {isImport
                      ? <span style={{ color: '#c9b394' }}>本港不卖（销地）</span>
                      : <span>买入需 <b style={{ color: '#3d2b10' }}>{(Math.min(qty, roomUse) * m.price).toLocaleString()}</b> 金</span>}
                    <span className="ml-auto">
                      {isExport
                        ? <span style={{ color: '#c9b394' }}>本港不回购（产地）</span>
                        : <>卖出得 <b style={{ color: '#4cba6a' }}>{(Math.min(qty, mine?.qty ?? 0) * unit).toLocaleString()}</b> 金</>}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* 产地（特产）：本港只卖不买 → 玩家只能买入（出口商不回购自己的货） */}
                    {!isImport && (
                      <button
                        className="btn-green flex-1 py-2.5 text-sm"
                        disabled={!canTrade || roomUse <= 0 || m.stock <= 0}
                        style={{ opacity: !canTrade || roomUse <= 0 || m.stock <= 0 ? 0.45 : 1 }}
                        onClick={() => trade(g.id, 'BUY', roomUse)}
                      >
                        📥 买入 {Math.min(qty, roomUse)}
                      </button>
                    )}
                    {/* 销地（紧缺）：本港只收不卖 → 玩家只能卖出，且本港高价收购 */}
                    {!isExport && (
                      <button
                        className="btn-red flex-1 py-2.5 text-sm"
                        disabled={!canTrade || !mine || (mine?.qty ?? 0) <= 0}
                        style={{ opacity: !canTrade || !mine || (mine?.qty ?? 0) <= 0 ? 0.45 : 1 }}
                        onClick={() => trade(g.id, 'SELL', mine?.qty ?? 0)}
                      >
                        📤 卖出 {Math.min(qty, mine?.qty ?? 0)}
                      </button>
                    )}
                  </div>

                  {/* 规则提示：同一种货，本港只卖不买（产地）或只收不卖（销地） */}
                  {(isExport || isImport) && (
                    <div
                      className="mt-2 py-2 text-xs text-center rounded-xl"
                      style={{ background: '#fff5ec', color: '#a07030', border: '1.5px dashed #f0e2c8' }}
                    >
                      {isExport && !isImport && '🏭 产地：本港只卖不买 —— 你只买不卖（特产＝低价出货）'}
                      {isImport && !isExport && '🚢 销地：本港只收不卖 —— 你只卖不买（紧缺＝高价收购）'}
                      {isExport && isImport && '⚓ 本港既产也销：仅供查看'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        <div className="text-xs text-center mt-1 mb-1" style={{ color: '#c0a070' }}>
          本港只经营 {tradedIds.length} 种货物 · 规则：产地买特产、销地卖紧缺（缺口货物）
        </div>

        {held > 0 && (
          <button
            className="btn-orange w-full py-3 text-base font-900 mt-1"
            style={{ borderRadius: 16, opacity: canTrade ? 1 : 0.45 }}
            disabled={!canTrade}
            onClick={() => dispatch({ type: 'SELL_ALL' })}
          >
            💰 一键全部卖出（{held} 件）
          </button>
        )}
      </div>
    </div>
  )
}
