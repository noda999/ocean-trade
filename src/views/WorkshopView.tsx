import { EQUIPS, SUPPLIES } from '../game/data'
import { equipBonusOf, shipNow, supplyCount } from '../game/state'
import { useGame } from '../game/store'

// ─────────────────────────────────────────────────────────────────────────────
//  船坞工坊：船具（永久装备）+ 补给（消耗品）
//  装备给全船永久加成；补给在海上事件中自动消耗，朗姆酒在航行中手动使用
// ─────────────────────────────────────────────────────────────────────────────

export default function WorkshopView() {
  const { state, dispatch } = useGame()
  const eq = equipBonusOf(state)
  const eff = shipNow(state)

  return (
    <>
      {/* 装备总览 */}
      <div className="panel-orange p-4 mb-4" style={{ borderRadius: 18 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.22)' }}>
            🛠️
          </div>
          <div className="flex-1">
            <div className="text-xs opacity-85">已装船具</div>
            <div className="font-900 text-xl">{state.equipOwned.length} / {EQUIPS.length}</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-85">金币</div>
            <div className="font-900 text-sm">{Math.floor(state.money).toLocaleString()}</div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="text-xs opacity-80">航速</div>
            <div className="font-900 text-sm">{eq.speed ? `+${eq.speed}%` : '—'}</div>
          </div>
          <div className="text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="text-xs opacity-80">利润</div>
            <div className="font-900 text-sm">{eq.trade ? `+${eq.trade}%` : '—'}</div>
          </div>
          <div className="text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="text-xs opacity-80">载重</div>
            <div className="font-900 text-sm">{eq.cap ? `+${eq.cap}` : '—'}</div>
          </div>
          <div className="text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="text-xs opacity-80">声望获取</div>
            <div className="font-900 text-sm">{eq.repGain ? `+${eq.repGain}%` : '—'}</div>
          </div>
        </div>
        <div className="text-xs mt-2 opacity-85">当前有效座舰：载重 {eff.cap} · 航速 {eff.speed}x · 利润 +{eff.bonus}%（含船员与船具）</div>
      </div>

      {/* 船具（永久） */}
      <div className="font-800 text-sm mb-2" style={{ color: '#3d2b10' }}>船具 · 永久生效</div>
      <div className="flex flex-col gap-2 mb-4">
        {EQUIPS.map(e => {
          const owned = state.equipOwned.includes(e.id)
          const shipLocked = !!e.requireShip && !state.ownedShips.includes(e.requireShip)
          const affordable = state.money >= e.cost
          return (
            <div
              key={e.id}
              className="panel-white p-3"
              style={{ borderRadius: 14, opacity: owned ? 0.78 : 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#fff5ec' }}>
                  {e.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-800 text-sm" style={{ color: '#3d2b10' }}>{e.name}</div>
                  <div className="text-xs" style={{ color: '#a07030' }}>{e.desc}</div>
                </div>
                {owned ? (
                  <span className="badge-green flex-shrink-0">已安装</span>
                ) : shipLocked ? (
                  <span className="text-[10px] font-800 px-2 py-1 rounded-lg flex-shrink-0" style={{ background: '#f5eee0', color: '#b09868' }}>
                    🔒 需传奇宝船
                  </span>
                ) : (
                  <button
                    className="btn-orange text-xs px-3 py-1.5 flex-shrink-0 font-900"
                    style={{ opacity: affordable ? 1 : 0.55 }}
                    onClick={() => dispatch({ type: 'BUY_EQUIP', id: e.id })}
                  >
                    🪙 {e.cost.toLocaleString()}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 补给（消耗品） */}
      <div className="font-800 text-sm mb-2" style={{ color: '#3d2b10' }}>补给 · 海上消耗品</div>
      <div className="flex flex-col gap-2 mb-2">
        {SUPPLIES.map(x => {
          const n = supplyCount(state, x.id)
          const affordable = state.money >= x.cost
          return (
            <div key={x.id} className="panel-white p-3" style={{ borderRadius: 14 }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#fff5ec' }}>
                  {x.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>{x.name}</span>
                    <span
                      className="text-[10px] font-800 px-1.5 py-0.5 rounded-md"
                      style={{ background: n > 0 ? '#e6f6e9' : '#f5eee0', color: n > 0 ? '#3a9a58' : '#b09868' }}
                    >×{n}</span>
                    {x.use === 'auto' && <span className="text-[10px] font-700" style={{ color: '#c0a070' }}>自动</span>}
                  </div>
                  <div className="text-xs" style={{ color: '#a07030' }}>{x.desc}</div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    className="text-xs font-800 px-2 py-1.5 rounded-lg"
                    style={{ background: '#fff5ec', color: '#a07030', opacity: affordable ? 1 : 0.5 }}
                    disabled={!affordable}
                    onClick={() => dispatch({ type: 'BUY_SUPPLY', id: x.id, qty: 1 })}
                  >+1</button>
                  <button
                    className="text-xs font-900 px-2 py-1.5 rounded-lg"
                    style={state.money >= x.cost * 5
                      ? { background: '#f5913a', color: 'white' }
                      : { background: '#f5eee0', color: '#b09868' }}
                    disabled={state.money < x.cost * 5}
                    onClick={() => dispatch({ type: 'BUY_SUPPLY', id: x.id, qty: 5 })}
                  >+5</button>
                </div>
              </div>
              {x.use === 'manual' && n > 0 && (
                <button
                  className="btn-orange w-full py-2 mt-2 text-xs font-900"
                  style={{ opacity: state.voyage ? 1 : 0.5 }}
                  disabled={!state.voyage}
                  onClick={() => dispatch({ type: 'USE_SUPPLY', id: x.id })}
                >
                  🍶 {state.voyage ? '开桶！剩余航程 -40%' : '航行中才能使用'}
                </button>
              )}
            </div>
          )
        })}
      </div>
      <div className="text-[10px] text-center mb-1" style={{ color: '#c0a070' }}>
        舰炮 / 木料 / 特许状会在对应事件中自动消耗 · 朗姆酒航行中手动使用
      </div>
    </>
  )
}
