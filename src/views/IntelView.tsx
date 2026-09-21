import { useMemo, useState } from 'react'
import { CITIES, CITY_BY_ID, GOODS, GOOD_BY_ID, INTEL_PRICE } from '../game/data'
import { cityTrades, estBuyPrice, estSellPrice, sellPrice, shipOf } from '../game/engine'
import { useGame } from '../game/store'

interface Route {
  goodId: string
  fromId: string
  toId: string
  buy: number
  sell: number
  profit: number
  pct: number
  /** 商路两端存在未探明城市，价格按特产倍率推算 */
  estimated: boolean
}

export default function IntelView({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame()
  const [tab, setTab] = useState<'routes' | 'prices'>('routes')
  const [goodId, setGoodId] = useState(GOODS[0].id)

  const ship = shipOf(state.shipId)
  const known = (cid: string) => state.intelOwned || state.visited.includes(cid)

  /** 计算真实最赚商路（买入 → 卖出），只统计经营该货且已知的城市 */
  const routes = useMemo<Route[]>(() => {
    const out: Route[] = []
    for (const g of GOODS) {
      for (const a of CITIES) {
        if (!cityTrades(a, g.id)) continue
        const buyKnown = state.intelOwned || state.visited.includes(a.id)
        const buy = buyKnown ? state.markets[a.id][g.id].price : estBuyPrice(g.id, a.id)
        if (buyKnown && state.markets[a.id][g.id].stock < 5) continue
        for (const b of CITIES) {
          if (a.id === b.id) continue
          if (!cityTrades(b, g.id)) continue
          const sellKnown = state.intelOwned || state.visited.includes(b.id)
          const sell = sellKnown
            ? sellPrice(g, state.markets[b.id], ship.bonus)
            : estSellPrice(g.id, b.id, ship.bonus)
          if (sell <= buy) continue
          out.push({
            goodId: g.id,
            fromId: a.id,
            toId: b.id,
            buy,
            sell,
            profit: sell - buy,
            pct: ((sell - buy) / buy) * 100,
            estimated: !buyKnown || !sellKnown,
          })
        }
      }
    }
    // 真实行情优先展示，其次按单件利润排序
    return out
      .sort((x, y) => (Number(x.estimated) - Number(y.estimated)) || (y.profit - x.profit))
      .slice(0, 6)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.markets, state.visited, state.intelOwned, ship.bonus])

  const g = GOOD_BY_ID[goodId]

  // 比价：只统计「经营该货 + 已知」的港口
  const poolPrices = CITIES
    .filter(x => known(x.id) && state.markets[x.id]?.[goodId])
    .map(x => state.markets[x.id][goodId].price)
  const pmin = poolPrices.length ? Math.min(...poolPrices) : 0
  const pmax = poolPrices.length ? Math.max(...poolPrices) : 0

  return (
    <div className="absolute inset-0 z-40 flex items-end" onPointerDown={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(20,10,0,0.42)' }} />
      <div
        className="relative w-full sheet"
        style={{ maxHeight: '88%', display: 'flex', flexDirection: 'column', animation: 'slideUp .28s ease' }}
        onPointerDown={e => e.stopPropagation()}
      >
        {/* 顶部 */}
        <div className="p-4 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📡</span>
            <span className="font-900 text-lg" style={{ color: '#3d2b10' }}>情报网络</span>
            <span className="ml-auto text-lg" style={{ color: '#c9b394' }} onClick={onClose}>✕</span>
          </div>

          <div className="flex gap-2 mb-3">
            {([['routes', '🔥 最赚商路'], ['prices', '💰 全球比价']] as const).map(([k, label]) => (
              <button
                key={k}
                className="flex-1 py-2 text-xs font-800 rounded-xl"
                style={tab === k
                  ? { background: '#f5913a', color: 'white', boxShadow: '0 3px 8px rgba(245,145,58,0.35)' }
                  : { background: '#fff5ec', color: '#a07030' }}
                onClick={() => setTab(k)}
              >
                {label}
              </button>
            ))}
          </div>

          {!state.intelOwned && (
            <div className="panel-orange p-3 flex items-center gap-2">
              <span className="text-lg">🔮</span>
              <div className="flex-1">
                <div className="text-xs font-800">未开通全球情报</div>
                <div className="text-xs opacity-85">未探明城市仅显示按特产推算的预估价</div>
              </div>
              <button
                className="px-3 py-2 text-xs font-900 rounded-xl"
                style={{ background: 'white', color: '#d97320' }}
                onClick={() => dispatch({ type: 'BUY_INTEL' })}
              >
                开通 {INTEL_PRICE} 金
              </button>
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="px-4 pb-5 overflow-auto flex-shrink-1" style={{ minHeight: 0 }}>
          {tab === 'routes' ? (
            <div className="flex flex-col gap-2">
              <div className="text-xs mb-1" style={{ color: '#a07030' }}>
                根据当前实时行情计算，商路会随市场波动变化
              </div>
              {routes.length === 0 && (
                <div className="panel-white p-4 text-center text-xs" style={{ borderRadius: 14, color: '#a07030' }}>
                  暂时没有明显套利机会，先跑一趟已到访城市，或等行情刷新
                </div>
              )}
              {routes.map((r, i) => {
                const from = CITY_BY_ID[r.fromId]
                const to = CITY_BY_ID[r.toId]
                const good = GOOD_BY_ID[r.goodId]
                return (
                  <div key={i} className="panel-white p-3" style={{ borderRadius: 14 }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#fff5ec' }}>
                        {good.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-800 text-sm" style={{ color: '#3d2b10' }}>
                          {from.name} <span style={{ color: '#f5913a' }}>→</span> {to.name}
                          {r.estimated && <span className="est-tag">预估</span>}
                        </div>
                        <div className="text-xs" style={{ color: '#a07030' }}>{good.name} · 单件利润 {r.profit} 金</div>
                      </div>
                      <div className="text-right">
                        <div className="font-900 text-sm" style={{ color: '#4cba6a' }}>+{r.pct.toFixed(0)}%</div>
                        <div className="text-xs" style={{ color: '#c0a070' }}>利润率</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="price-chip buy">买入 {r.buy}</span>
                      <span style={{ color: '#c9b394' }}>→</span>
                      <span className="price-chip sell">卖出 {r.sell}</span>
                      {state.cityId === r.fromId && <span className="badge-green ml-auto">就在此处</span>}
                      {state.cityId !== r.fromId && state.cityId === r.toId && <span className="badge-orange ml-auto">已经在目的地</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
                {GOODS.map(x => (
                  <button
                    key={x.id}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-800 rounded-full"
                    style={x.id === goodId
                      ? { background: '#f5913a', color: 'white' }
                      : { background: '#fff5ec', color: '#a07030' }}
                    onClick={() => setGoodId(x.id)}
                  >
                    {x.icon} {x.name}
                  </button>
                ))}
              </div>
              <div className="panel-white overflow-hidden" style={{ borderRadius: 14 }}>
                {CITIES.map(c => {
                  const trades = cityTrades(c, goodId)
                  const m = state.markets[c.id]?.[goodId]
                  const isKnown = known(c.id)
                  const here = c.id === state.cityId
                  const isExp = c.exports.includes(goodId)
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 px-3 py-2.5"
                      style={{ borderBottom: '1.5px solid #f5e8d0', background: here ? '#fff8f0' : undefined, opacity: trades ? 1 : 0.62 }}
                    >
                      <span className="text-xs font-800 flex-1 flex items-center gap-1" style={{ color: '#3d2b10' }}>
                        {isKnown ? c.name : '???'}
                        {isExp && <span className="badge-green">特产</span>}
                        {c.imports.includes(goodId) && <span className="badge-orange">紧缺</span>}
                        {here && <span className="badge-orange">当前</span>}
                      </span>
                      {!trades ? (
                        <span className="text-xs" style={{ color: '#c9bda8' }}>不流通</span>
                      ) : isKnown && m ? (
                        <>
                          <span className="text-xs" style={{ color: '#a07030' }}>库存 {m.stock}</span>
                          {/* 交易方向：特产＝此处可买入；紧缺＝此处可卖出（v1.5.0 规则） */}
                          <span
                            className="text-xs font-800"
                            style={{ color: isExp ? '#4cba6a' : '#d97320', minWidth: 26, textAlign: 'center' }}
                          >
                            {isExp ? '买入' : '卖出'}
                          </span>
                          <span
                            className="text-sm font-900"
                            style={{ color: m.price === pmin ? '#4cba6a' : m.price === pmax ? '#e05050' : '#3d2b10' }}
                          >
                            {m.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs" style={{ color: '#c9bda8' }}>
                          未探明 · 预估 ≈{estSellPrice(goodId, c.id, ship.bonus)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="text-xs mt-2" style={{ color: '#a07030' }}>
                <span style={{ color: '#4cba6a' }}>买入</span> ＝ 特产港（本港只卖不买）·
                <span style={{ color: '#d97320' }}> 卖出</span> ＝ 紧缺港（本港只收不卖，高价收购）·
                <span style={{ color: '#4cba6a' }}> 绿色</span> 最低买价 ·
                <span style={{ color: '#e05050' }}> 红色</span> 最高卖价 ·
                <span style={{ color: '#c9bda8' }}> 不流通 = 该港不经营此货</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
