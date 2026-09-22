import { CITY_BY_ID, MAP_FRAGS_NEED, PIRATE_BY_ID } from '../game/data'
import { raidPower, raidWinRate } from '../game/state'
import { useGame } from '../game/store'

// ─────────────────────────────────────────────────────────────────────────────
// 海事署（v1.4.0）：通缉悬赏（出击海盗巢穴）+ 深海秘藏（藏宝图挖掘）
// 从「市政厅」拆出 —— 打海盗 / 探宝属于出海冒险，与市政投资、商业委托分开更合理
// ─────────────────────────────────────────────────────────────────────────────

function timeLeft(sec: number): string {
  const t = Math.max(0, Math.ceil(sec))
  const m = Math.floor(t / 60)
  return `${m}:${String(t % 60).padStart(2, '0')}`
}

export default function AdmiraltyView() {
  const { state, dispatch } = useGame()

  const bounty = state.bounty
  const pirate = bounty ? PIRATE_BY_ID[bounty.pirateId] : null
  const cannons = state.supplies['s_cannon'] ?? 0
  const power = raidPower(state)
  const winRate = Math.round(raidWinRate(state) * 100)
  const canRaid = cannons > 0 && !state.voyage

  const frags = Math.min(state.mapFrags, MAP_FRAGS_NEED)
  const digTarget = frags >= MAP_FRAGS_NEED ? state.digCity : null
  const atTarget = !!digTarget && digTarget === state.cityId

  return (
    <>
      {/* ── 通缉悬赏 ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>🏴‍☠️ 通缉悬赏</span>
        <span className="text-xs ml-auto" style={{ color: '#a07030' }}>累计大捷 {state.stats.raidsWon ?? 0} 次</span>
      </div>
      <div className="panel-white p-3 mb-4" style={{ borderRadius: 14 }}>
        {!bounty || !pirate ? (
          <div className="text-center text-xs py-2" style={{ color: '#c0a070' }}>
            暂无悬赏 —— 海事署正在打探海盗动向，稍后再来
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#fdeaea' }}>
                {pirate.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-800 text-sm" style={{ color: '#3d2b10' }}>
                  {pirate.name} <span className="text-xs font-700" style={{ color: '#a07030' }}>· 悬赏港 {CITY_BY_ID[bounty.cityId]?.name}</span>
                </div>
                <div className="text-xs" style={{ color: '#a07030' }}>
                  赏金 <b style={{ color: '#4cba6a' }}>{bounty.reward.toLocaleString()} 金</b>
                  {' · '}海盗战力 <b style={{ color: '#e05050' }}>{pirate.strength}</b>
                  {' · '}剩 <b style={{ color: bounty.deadline - state.clock < 60 ? '#e05050' : '#8a6a40' }}>{timeLeft(bounty.deadline - state.clock)}</b>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs mb-2 flex-wrap" style={{ color: '#8a6a40' }}>
              <span className="px-2 py-1 rounded-lg font-800" style={{ background: '#fff5ec' }}>
                我方战力 <b style={{ color: '#3d2b10' }}>{power}</b>（船级 + 舰炮组 ×{cannons}）
              </span>
              <span className="px-2 py-1 rounded-lg font-800" style={{ background: winRate >= 60 ? '#e8f7ec' : winRate >= 40 ? '#fff3d6' : '#fdeaea', color: winRate >= 60 ? '#3a8a52' : winRate >= 40 ? '#a06a10' : '#c05050' }}>
                预估胜率 {winRate}%
              </span>
            </div>
            <button
              className="btn-orange w-full py-2.5 text-sm font-900"
              disabled={!canRaid}
              style={{ opacity: canRaid ? 1 : 0.5 }}
              onClick={() => dispatch({ type: 'RAID' })}
            >
              ⚔️ 出击巢穴（消耗舰炮组 ×1 · 失利损失 8% 现金）
            </button>
            {!canRaid && (
              <div className="text-[10px] mt-1.5 text-center" style={{ color: '#c05050' }}>
                {state.voyage ? '航行途中无法出击，靠港后再来' : '需要 1 组舰炮组（工坊有售），战力不足时胜率很低'}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── 深海秘藏 ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>🗺️ 深海秘藏</span>
        <span className="text-xs ml-auto" style={{ color: '#a07030' }}>已挖出 {state.stats.treasures ?? 0} 处宝藏</span>
      </div>
      <div className="panel-white p-3" style={{ borderRadius: 14 }}>
        <div className="flex items-center gap-1.5 mb-2">
          {Array.from({ length: MAP_FRAGS_NEED }).map((_, i) => (
            <span
              key={i}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-900"
              style={{ background: i < frags ? '#f5c87a' : '#f4eee1', color: i < frags ? '#7a4a10' : '#c9bda8' }}
            >
              {i < frags ? '🗺' : '?'}
            </span>
          ))}
          <span className="text-xs ml-2 font-800" style={{ color: '#8a6a40' }}>{frags} / {MAP_FRAGS_NEED} 碎片</span>
        </div>
        {digTarget ? (
          <>
            <div className="text-xs mb-2" style={{ color: '#8a6a40' }}>
              藏宝图指向 <b style={{ color: '#3d2b10' }}>{CITY_BY_ID[digTarget]?.name} 外海</b>
              {!atTarget && ' —— 把船开过去才能挖掘'}
            </div>
            <button
              className="btn-green w-full py-2.5 text-sm font-900"
              disabled={!atTarget || !!state.voyage}
              style={{ opacity: atTarget && !state.voyage ? 1 : 0.5 }}
              onClick={() => dispatch({ type: 'DIG_TREASURE' })}
            >
              {atTarget ? '⛏️ 出海挖掘沉没神殿' : `航行至 ${CITY_BY_ID[digTarget]?.name}`}
            </button>
          </>
        ) : (
          <div className="text-xs text-center py-1" style={{ color: '#c0a070' }}>
            碎片来源：交付限时委托 · 海上捞起漂流瓶 · 击溃悬赏海盗
          </div>
        )}
      </div>
    </>
  )
}
