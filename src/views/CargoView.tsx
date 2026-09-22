import { CITY_BY_ID, CITY_EVENT_INFO, GOOD_BY_ID } from '../game/data'
import { cargoUnits, cargoValue, eventSellMult, isBlockaded, sellPrice } from '../game/engine'
import { cityEventOf, investBonusOf, repBonusOf, shipNow } from '../game/state'
import { useGame } from '../game/store'

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function CargoView() {
  const { state, dispatch } = useGame()
  const ship = shipNow(state)
  const city = CITY_BY_ID[state.cityId]
  const cm = state.markets[state.cityId]
  const held = cargoUnits(state.cargo)
  const invested = Object.values(state.cargo).reduce((s, c) => s + c.cost, 0)
  const worth = cargoValue(state.cargo, state.cityId, state.markets, ship.bonus)
  const profit = worth - invested
  const sailing = !!state.voyage
  // 商情（v1.3.0）：封锁时市集关闭，本地卖价含抢购加成与声望/投资加成
  const cityEv = cityEventOf(state, state.cityId)
  const blockaded = isBlockaded(cityEv)
  const canTradeHere = !sailing && !blockaded
  const priceBonus = ship.bonus + repBonusOf(state, state.cityId) + investBonusOf(state, state.cityId).sell

  return (
    <div className="absolute inset-0 overflow-auto" style={{ background: '#f8f0e0' }}>
      <div className="px-4 pt-4 pb-6">
        <div className="font-900 text-xl mb-1" style={{ color: '#3d2b10' }}>📦 货舱清单</div>
        <div className="text-xs mb-4" style={{ color: '#a07030' }}>
          停靠 {city.name} · 卖出价格按本地行情结算
        </div>

        {/* 容量 */}
        <div className="panel-white p-3 mb-3" style={{ borderRadius: 14 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-700" style={{ color: '#3d2b10' }}>货舱容量</span>
            <span className="ml-auto text-sm font-800" style={{ color: '#f5913a' }}>{held} / {ship.cap}</span>
          </div>
          <div className="prog-track h-3">
            <div className="prog-fill" style={{ width: `${(held / ship.cap) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: '#a07030' }}>
            <span>{ship.name}（当前座舰）</span>
            <span>已用 {Math.round((held / ship.cap) * 100)}%</span>
          </div>
        </div>

        {/* 盈亏 */}
        <div className="panel-orange p-3 mb-4 flex items-center gap-3">
          <div className="text-center flex-1">
            <div className="text-xs opacity-80">进货成本</div>
            <div className="font-900 text-base">{invested.toLocaleString()}</div>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.3)' }} />
          <div className="text-center flex-1">
            <div className="text-xs opacity-80">当前货值</div>
            <div className="font-900 text-base">{worth.toLocaleString()}</div>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.3)' }} />
          <div className="text-center flex-1">
            <div className="text-xs opacity-80">浮动盈亏</div>
            <div className="font-900 text-base">
              {profit >= 0 ? '+' : '−'}{Math.abs(profit).toLocaleString()}
            </div>
          </div>
        </div>

        {/* 货物 */}
        <div className="font-800 text-sm mb-2" style={{ color: '#3d2b10' }}>持有货物</div>
        {held === 0 ? (
          <div className="panel-white p-5 text-center mb-3" style={{ borderRadius: 14 }}>
            <div className="text-3xl mb-2">🛒</div>
            <div className="text-sm font-700" style={{ color: '#8a6a40' }}>货舱空空如也</div>
            <div className="text-xs mt-1" style={{ color: '#c0a070' }}>去「市场」低价买入特产，再运到紧缺的城市卖出</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mb-3">
            {Object.entries(state.cargo).map(([gid, c]) => {
              const g = GOOD_BY_ID[gid]
              const mk = cm?.[gid]
              const unit = mk ? Math.round(sellPrice(g, cm, priceBonus) * eventSellMult(cityEv, gid)) : null
              const value = unit !== null ? unit * c.qty : null
              const itemProfit = value !== null ? value - c.cost : null
              // 核心规则：同一种货本港「只卖不买」（产地）或「只买不卖」（销地）
              // 卖出只在非产地成立 —— 销地（紧缺）本港买价高，正是该卖出赚钱的地方
              const isExportGood = city.exports.includes(gid)
              const isImportGood = city.imports.includes(gid)
              const canSellHere = unit !== null && !isExportGood
              return (
                <div key={gid} className="panel-white p-3" style={{ borderRadius: 14 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#fff5ec' }}>
                      {g.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-800 text-sm" style={{ color: '#3d2b10' }}>{g.name} ×{c.qty}</div>
                      <div className="text-xs" style={{ color: '#a07030' }}>
                        成本 {(c.cost / c.qty).toFixed(0)}
                        {canSellHere
                          ? <> · 本地卖价 <b style={{ color: '#f5913a' }}>{unit}</b>
                            {isImportGood && <span style={{ color: '#4cba6a' }}>（销地高价）</span>}</>
                          : isExportGood
                            ? <> · <span style={{ color: '#c9b394' }}>本港不买（产地）</span></>
                            : <> · <span style={{ color: '#c9b394' }}>本港不经营</span></>}
                      </div>
                    </div>
                    <div className="text-right">
                      {canSellHere ? (
                        <>
                          <div className="font-900 text-sm" style={{ color: itemProfit! >= 0 ? '#4cba6a' : '#e05050' }}>
                            {itemProfit! >= 0 ? '+' : '−'}{Math.abs(itemProfit!).toLocaleString()}
                          </div>
                          <button
                            className="btn-orange text-xs px-3 py-1 mt-1"
                            disabled={!canTradeHere}
                            style={{ opacity: canTradeHere ? 1 : 0.45 }}
                            onClick={() => dispatch({ type: 'SELL', goodId: gid, qty: c.qty })}
                          >
                            卖出
                          </button>
                        </>
                      ) : (
                        <div className="font-800 text-xs" style={{ color: '#c9b394' }}>
                          {isExportGood ? '本港不买（产地）' : unit === null ? '本港不经营' : '需运往别港'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <button
              className="btn-orange w-full py-3 text-base font-900"
              style={{ borderRadius: 16, opacity: canTradeHere ? 1 : 0.45 }}
              disabled={!canTradeHere}
              onClick={() => dispatch({ type: 'SELL_ALL' })}
            >
              💰 一键全部卖出
            </button>
            {blockaded && (
              <div className="text-xs text-center mt-1" style={{ color: '#c05050' }}>
                🚑 {city.name}在市集封锁期（{CITY_EVENT_INFO.blockade.name}），暂时无法卖出
              </div>
            )}
          </div>
        )}

        {/* 道具 */}
        <div className="font-800 text-sm mt-4 mb-2" style={{ color: '#3d2b10' }}>道具栏</div>
        <div className="panel-white p-3 mb-4" style={{ borderRadius: 14 }}>
          <div className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: '#fff5ec' }}>⚡</div>
            <span className="flex-1 font-700 text-sm" style={{ color: '#3d2b10' }}>加速卡</span>
            <span className="text-xs mr-2" style={{ color: '#c0a070' }}>航行中剩余时间减半</span>
            <span className="font-900 text-sm" style={{ color: '#f5c830' }}>×{state.boost}</span>
          </div>
          <div className="flex items-center gap-3 py-2" style={{ borderTop: '1.5px solid #f5e8d0' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: '#fff5ec' }}>🔮</div>
            <span className="flex-1 font-700 text-sm" style={{ color: '#3d2b10' }}>情报网络</span>
            <span className="text-xs mr-2" style={{ color: '#c0a070' }}>全球价格一览</span>
            <span className="font-900 text-xs" style={{ color: state.intelOwned ? '#4cba6a' : '#c0a070' }}>
              {state.intelOwned ? '已开通' : '未开通'}
            </span>
          </div>
        </div>

        {/* 航海日志 */}
        <div className="font-800 text-sm mb-2" style={{ color: '#3d2b10' }}>🧭 航海日志</div>
        <div className="panel-white overflow-hidden" style={{ borderRadius: 16 }}>
          {state.log.slice(0, 12).map((l, i) => (
            <div
              key={l.id}
              className="flex items-start gap-2 px-3 py-2"
              style={{ borderBottom: '1.5px solid #f5e8d0' }}
            >
              <span className="text-xs flex-shrink-0 pt-0.5" style={{ color: '#c9b394' }}>{fmt(l.t)}</span>
              <span
                className="text-xs flex-1"
                style={{ color: l.kind === 'good' ? '#3f9d52' : l.kind === 'bad' ? '#d64b3c' : '#8a6a40' }}
              >
                {l.text}
              </span>
            </div>
          ))}
          {state.log.length === 0 && (
            <div className="px-3 py-4 text-xs text-center" style={{ color: '#c0a070' }}>暂无记录</div>
          )}
        </div>
      </div>
    </div>
  )
}

export { fmt }
