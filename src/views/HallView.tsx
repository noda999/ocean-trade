import { CITY_BY_ID, GOOD_BY_ID, INVEST_LEVELS, INVEST_PROJECTS, INVEST_VOICES, ORDER_ACTIVE_MAX, SECRET_OF_CITY } from '../game/data'
import {
  activeOrders, boardOrders, investBonusOf, investLevelOf, orderDeliverable,
} from '../game/state'
import { useGame } from '../game/store'
import { Glyph } from '../components/Glyph'
import { ArtIcon } from '../components/ArtIcon'

// ─────────────────────────────────────────────────────────────────────────────
// 市政厅（v1.3.0）：港口投资 + 限时委托板
// v1.4.0 拆分：悬赏出击 / 深海秘藏 → 海事署（dock 独立分区）；
//              港口银行 → 市场页（借贷与交易同属"钱"的场所）
// ─────────────────────────────────────────────────────────────────────────────

function timeLeft(sec: number): string {
  const s = Math.max(0, Math.ceil(sec))
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

export default function HallView() {
  const { state, dispatch } = useGame()
  const city = CITY_BY_ID[state.cityId]
  const lvl = investLevelOf(state, state.cityId)
  const bonus = investBonusOf(state, state.cityId)
  const maxed = lvl >= INVEST_LEVELS.length
  const projects = INVEST_PROJECTS[state.cityId] ?? []
  const invested = state.invest[state.cityId] ?? {}

  const board = boardOrders(state)
  const active = activeOrders(state)

  // 隐藏特产（v1.4.0）：本港 1 级解锁
  const secretId = SECRET_OF_CITY[state.cityId]

  return (
    <>
      {/* 港口投资 */}
      <div className="panel-orange p-4 mb-4" style={{ borderRadius: 18 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.22)' }}>
            <Glyph name="hall" size={30} color="#fff" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs opacity-85">{city.name} · 投资等级</div>
            <div className="font-900 text-xl">{lvl} / {INVEST_LEVELS.length}{lvl > 0 && <span className="text-xs font-800 ml-1 opacity-90">「{INVEST_LEVELS[lvl - 1].title}」</span>}</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-85">金币</div>
            <div className="font-900 text-sm">{Math.floor(state.money).toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="text-xs opacity-80">买入折扣</div>
            <div className="font-900 text-sm">{bonus.buy ? `-${bonus.buy}%` : '—'}</div>
          </div>
          <div className="text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="text-xs opacity-80">卖出加成</div>
            <div className="font-900 text-sm">{bonus.sell ? `+${bonus.sell}%` : '—'}</div>
          </div>
          <div className="text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="text-xs opacity-80">周期分红</div>
            <div className="font-900 text-sm">{bonus.dividend ? `${bonus.dividend} 金` : '—'}</div>
          </div>
        </div>

        <div className="text-xs mb-3 flex flex-wrap gap-x-3 gap-y-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
          <span className="inline-flex items-center gap-1">
            <Glyph name="stamp" size={13} />进港关税：<b>{lvl >= 3 ? '全免' : lvl === 2 ? '半价' : '照缴（30 金 + 货值 1%）'}</b>
          </span>
          {secretId && (
            <span className="inline-flex items-center gap-1">
              <Glyph name={lvl >= 1 ? 'unlock' : 'lock'} size={13} />隐藏特产「{GOOD_BY_ID[secretId].name}」{lvl >= 1 ? '已解锁' : '1 级解锁'}
            </span>
          )}
        </div>

        {/* 港务官寄语（v1.7）：投资后按等级出现，满级是专属感谢词 */}
        {(() => {
          const voices = INVEST_VOICES[city.id]
          if (!voices) return null
          const said = maxed ? voices[2] : lvl > 0 ? voices[lvl - 1] : null
          if (!said) return null
          return (
            <div className="text-xs italic leading-relaxed mb-3 px-2.5 py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.12)', color: 'rgba(255,255,255,0.95)' }}>
              「{said}」
            </div>
          )
        })()}

        {/* 投资项目（v1.7）：3 个地区专属方向，可自由选择先投哪个 */}
        <div className="flex flex-col gap-2">
          {projects.map(p => {
            const done = (invested[p.id] ?? 0) > 0
            const can = !done && state.money >= p.cost
            const eff = [p.buy ? `买入 -${p.buy}%` : '', p.sell ? `卖出 +${p.sell}%` : '', p.dividend ? `分红 ${p.dividend} 金` : ''].filter(Boolean).join(' · ')
            return (
              <div key={p.id} className="flex items-center gap-2 rounded-xl px-2.5 py-2" style={{ background: 'rgba(0,0,0,0.12)' }}>
                <Glyph name={p.icon as any} size={18} color="#fff" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-900">{p.name}</div>
                  <div className="text-[11px] opacity-85">{p.desc}</div>
                  <div className="text-[10px] opacity-80">{eff}</div>
                </div>
                {done ? (
                  <span className="text-xs font-900 px-2 py-1 rounded-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.25)' }}>已投</span>
                ) : (
                  <button
                    className="text-xs font-900 px-2 py-1.5 rounded-lg flex-shrink-0"
                    style={{ background: 'white', color: '#d97320', opacity: can ? 1 : 0.55 }}
                    disabled={!can}
                    onClick={() => dispatch({ type: 'INVEST', projectId: p.id })}
                  >
                    {p.cost.toLocaleString()} 金
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {maxed && (
          <div className="text-xs text-center py-2 rounded-xl mt-2" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <span className="inline-flex items-center gap-1 justify-center">
              <Glyph name="check" size={13} />本港投资已满级「{INVEST_LEVELS[INVEST_LEVELS.length - 1].title}」，此港永远为你留一盏灯
            </span>
          </div>
        )}
      </div>

      {/* 委托板：本港可接 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-800 text-sm inline-flex items-center gap-1.5" style={{ color: '#3d2b10' }}>
          <Glyph name="scroll" size={15} />委托板 · {city.name}
        </span>
        <span className="text-xs ml-auto" style={{ color: '#a07030' }}>进行中 {active.length}/{ORDER_ACTIVE_MAX} · 累计完成 {state.stats.ordersDelivered ?? 0}</span>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        {board.length === 0 && (
          <div className="panel-white p-4 text-center text-xs" style={{ borderRadius: 14, color: '#c0a070' }}>
            委托板暂时没有新单，稍后再来看看
          </div>
        )}
        {board.map(o => {
          const good = GOOD_BY_ID[o.goodId]
          const left = o.deadline - state.clock
          return (
            <div key={o.id} className="panel-white p-3" style={{ borderRadius: 14 }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F7F0E1' }}>
                  <ArtIcon name={good.icon} size={38} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-800 text-sm" style={{ color: '#3d2b10' }}>
                    {good.name} ×{o.qty} <span className="text-xs font-700 inline-flex items-center gap-1" style={{ color: '#a07030' }}><Glyph name="arrowRight" size={12} /> {CITY_BY_ID[o.toCity].name}</span>
                  </div>
                  <div className="text-xs" style={{ color: '#a07030' }}>
                    报酬 <b style={{ color: '#4cba6a' }}>{o.reward.toLocaleString()} 金</b>
                    {' · '}剩余 <b style={{ color: left < 30 ? '#e05050' : '#8a6a40' }}>{timeLeft(left)}</b>
                  </div>
                  {o.reason && (
                    <div className="text-[11px] mt-1 leading-snug" style={{ color: '#b08a50', fontStyle: 'italic' }}>
                      「{o.reason}」
                    </div>
                  )}
                </div>
                <button
                  className="btn-orange flex-shrink-0 px-3 py-2 text-xs font-900"
                  onClick={() => dispatch({ type: 'ACCEPT_ORDER', id: o.id })}
                >
                  接单
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 进行中的委托 */}
      <div className="font-800 text-sm mb-2 inline-flex items-center gap-1.5" style={{ color: '#3d2b10' }}>
        <Glyph name="truck" size={15} />进行中的委托
      </div>
      <div className="flex flex-col gap-2">
        {active.length === 0 && (
          <div className="panel-white p-4 text-center text-xs" style={{ borderRadius: 14, color: '#c0a070' }}>
            没有进行中的委托。去各港委托板看看，接单后限期送货报酬翻倍
          </div>
        )}
        {active.map(o => {
          const good = GOOD_BY_ID[o.goodId]
          const held = state.cargo[o.goodId]?.qty ?? 0
          const deliverable = orderDeliverable(state, o)
          const left = o.deadline - state.clock
          return (
            <div
              key={o.id}
              className="panel-white p-3"
              style={{ borderRadius: 14, borderLeft: deliverable ? '4px solid #4cba6a' : '4px solid #f5c87a' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F7F0E1' }}>
                  <ArtIcon name={good.icon} size={38} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-800 text-sm" style={{ color: '#3d2b10' }}>
                    {good.name} ×{o.qty}
                    <span className="text-xs font-700 inline-flex items-center gap-1" style={{ color: '#a07030' }}><Glyph name="arrowRight" size={12} /> {CITY_BY_ID[o.toCity].name}</span>
                  </div>
                  <div className="text-xs" style={{ color: '#a07030' }}>
                    货舱 {held}/{o.qty} · 送达得 <b style={{ color: '#4cba6a' }}>{o.reward.toLocaleString()} 金</b>
                    {' · '}剩余 <b style={{ color: left < 30 ? '#e05050' : '#8a6a40' }}>{timeLeft(left)}</b>
                  </div>
                  {o.reason && (
                    <div className="text-[11px] mt-1 leading-snug" style={{ color: '#b08a50', fontStyle: 'italic' }}>
                      「{o.reason}」
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {deliverable && (
                    <button
                      className="btn-green px-3 py-1.5 text-xs font-900"
                      onClick={() => dispatch({ type: 'DELIVER_ORDER', id: o.id })}
                    >
                      <span className="inline-flex items-center gap-1"><Glyph name="check" size={12} />交付</span>
                    </button>
                  )}
                  <button
                    className="px-3 py-1.5 text-xs font-800 rounded-xl"
                    style={{ background: '#fff5ec', color: '#a07030' }}
                    onClick={() => dispatch({ type: 'ABANDON_ORDER', id: o.id })}
                  >
                    放弃
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 迁移引导：v1.4.0 把冒险与金融业务挪到了更合适的分区 */}
      <div className="text-[10px] text-center mt-3" style={{ color: '#c0a070' }}>
        通缉悬赏与深海秘藏已移至「船坞 › 海事署」· 借贷业务请到「市场 › 港口银行」
      </div>
    </>
  )
}
