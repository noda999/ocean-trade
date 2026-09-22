import { useState } from 'react'
import { SHIPS, SHIP_NAME_MAX, shipDisplayName } from '../game/data'
import { shipOf } from '../game/engine'
import { crewBonusOf, shipNow } from '../game/state'
import { useGame } from '../game/store'
import { ShipSprite } from '../components/ShipSprite'
import TavernView from './TavernView'
import WorkshopView from './WorkshopView'
import HallView from './HallView'
import AdmiraltyView from './AdmiraltyView'

/** 港口内的 5 个设施分区：船坞 / 酒馆 / 工坊 / 市政厅 / 海事署 */
const SECTIONS = [
  { id: 'ships', icon: '⚓', label: '船坞', hint: '更快的船省时间，更大的舱赚更多，更高的加成提高利润率' },
  { id: 'tavern', icon: '🍺', label: '酒馆', hint: '招募航海好手：永久加成 + 每人 3 段专属委托（去功勋页领取奖励）' },
  { id: 'workshop', icon: '🛠️', label: '工坊', hint: '船具永久生效，补给在海上事件里自动派上用场' },
  { id: 'hall', icon: '🏛️', label: '市政厅', hint: '投资港口享永久折扣与分红，2 级起关税减半；委托板限期送货，报酬丰厚' },
  { id: 'navy', icon: '🏴‍☠️', label: '海事署', hint: '接通缉令出击海盗领赏金；集齐藏宝图碎片挖掘深海秘藏' },
] as const

type SectionId = typeof SECTIONS[number]['id']

export default function DockView() {
  const { state, dispatch } = useGame()
  const current = shipOf(state.shipId)
  const eff = shipNow(state)
  const cb = crewBonusOf(state)
  const [section, setSection] = useState<SectionId>('ships')
  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(state.shipName)
  const cur = SECTIONS.find(x => x.id === section) ?? SECTIONS[0]

  function commitName() {
    dispatch({ type: 'SET_SHIP_NAME', name: draftName })
    setEditingName(false)
  }
  function startEdit() {
    setDraftName(state.shipName)
    setEditingName(true)
  }

  return (
    <div className="absolute inset-0 overflow-auto" style={{ background: '#f8f0e0' }}>
      <div className="px-4 pt-4 pb-6">
        <div className="font-900 text-xl mb-2" style={{ color: '#3d2b10' }}>
          {cur.icon} {cur.label}
        </div>
        {/* 设施切换：5 个分区，窄屏可横向滚动 */}
        <div className="flex gap-0.5 p-1 rounded-xl mb-2 overflow-x-auto" style={{ background: '#efe2c8' }}>
          {SECTIONS.map(x => {
            const badge = x.id === 'tavern' ? state.hiredCrew.length : x.id === 'workshop' ? state.equipOwned.length : 0
            const active = section === x.id
            return (
              <button
                key={x.id}
                className={`${x.id}-toggle flex-shrink-0 text-xs font-800 px-2.5 py-1.5 rounded-lg`}
                style={{
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#d97320' : '#a07030',
                }}
                onClick={() => setSection(x.id)}
              >
                {x.icon} {x.label}{badge > 0 ? ` ${badge}` : ''}
              </button>
            )
          })}
        </div>
        <div className="text-xs mb-4" style={{ color: '#a07030' }}>{cur.hint}</div>

        {section === 'tavern' && <TavernView />}

        {section === 'workshop' && <WorkshopView />}

        {section === 'hall' && <HallView />}

        {section === 'navy' && <AdmiraltyView />}

        {section === 'ships' && (<>
        {/* 当前座舰 */}
        <div className="panel-orange p-4 mb-4" style={{ borderRadius: 18 }}>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs opacity-85 mb-0.5">当前座舰 · {current.name}</div>
              {editingName ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-900 text-lg" style={{ color: 'white' }}>「</span>
                  <input
                    autoFocus
                    type="text"
                    maxLength={SHIP_NAME_MAX}
                    value={draftName}
                    placeholder="给船取个名字"
                    onChange={e => setDraftName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitName()
                      if (e.key === 'Escape') setEditingName(false)
                    }}
                    className="font-900 text-lg bg-transparent border-b-2 outline-none flex-1 min-w-0"
                    style={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)' }}
                  />
                  <span className="font-900 text-lg" style={{ color: 'white' }}>」</span>
                </div>
              ) : (
                <button
                  className="font-900 text-lg text-left flex items-center gap-1.5"
                  onClick={startEdit}
                  title="点我给船改名"
                >
                  「{shipDisplayName(state.shipName, current.name)}」
                  <span className="text-xs opacity-80 font-700">✏️</span>
                </button>
              )}
              <div className="text-xs opacity-85 mt-1">
                载重 {eff.cap} · 航速 {eff.speed}x · 利润 +{eff.bonus}%
                {(cb.speed > 0 || cb.trade > 0 || eff.cap !== current.cap) && (
                  <span className="ml-1" style={{ color: '#fff3c4' }}>（含船员与船具加成）</span>
                )}
              </div>
            </div>
            <div style={{ transform: 'scale(0.9)' }}>
              <ShipSprite color={current.color} size={64} highlight />
            </div>
          </div>
          {editingName && (
            <div className="flex items-center gap-2 mt-3">
              <div className="text-[11px] opacity-85">
                {draftName.length}/{SHIP_NAME_MAX} · 留空恢复默认名
              </div>
              <button
                className="ml-auto text-xs font-800 px-3 py-1.5"
                style={{ borderRadius: 10, background: 'rgba(255,255,255,0.92)', color: '#d97320' }}
                onClick={() => setEditingName(false)}
              >取消</button>
              <button
                className="text-xs font-800 px-3 py-1.5"
                style={{ borderRadius: 10, background: 'white', color: '#d97320' }}
                onClick={commitName}
              >✓ 确定</button>
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <div className="flex-1 text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <div className="text-xs opacity-80">已拥有船只</div>
              <div className="font-900 text-sm">{state.ownedShips.length} / {SHIPS.length}</div>
            </div>
            <div className="flex-1 text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <div className="text-xs opacity-80">在船船员</div>
              <div className="font-900 text-sm">{state.hiredCrew.length} 人</div>
            </div>
            <div className="flex-1 text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <div className="text-xs opacity-80">金币</div>
              <div className="font-900 text-sm">{Math.floor(state.money).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {SHIPS.map(s => {
            const owned = state.ownedShips.includes(s.id)
            const active = state.shipId === s.id
            const affordable = state.money >= s.cost
            const speedGain = Math.round((s.speed / current.speed - 1) * 100)
            return (
              <div
                key={s.id}
                className="panel-white p-4"
                style={{ borderRadius: 16, borderLeft: `4px solid ${s.color}`, opacity: !owned && !affordable ? 0.72 : 1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}22` }}>
                    <ShipSprite color={s.color} size={48} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-900 text-base" style={{ color: '#3d2b10' }}>{s.name}</span>
                      {active && <span className="badge-orange">使用中</span>}
                      {owned && !active && <span className="badge-green">已拥有</span>}
                    </div>
                    <div className="text-xs" style={{ color: '#a07030' }}>{s.desc}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: '载货量', value: `${s.cap}`, icon: '📦', good: s.cap > current.cap },
                    { label: '航速', value: `${s.speed}x`, icon: '💨', good: s.speed > current.speed },
                    { label: '利润加成', value: s.bonus ? `+${s.bonus}%` : '无', icon: '💰', good: s.bonus > current.bonus },
                  ].map(st => (
                    <div key={st.label} className="text-center p-2 rounded-xl" style={{ background: '#fff8f0' }}>
                      <div className="text-base mb-0.5">{st.icon}</div>
                      <div className="font-900 text-xs" style={{ color: st.good ? '#4cba6a' : '#3d2b10' }}>{st.value}</div>
                      <div style={{ color: '#c0a070', fontSize: 10 }}>{st.label}</div>
                    </div>
                  ))}
                </div>

                {!owned && speedGain !== 0 && (
                  <div className="text-xs mb-2 px-2 py-1 rounded-lg" style={{ background: '#fff5ec', color: '#8a6a40' }}>
                    相比当前座舰：航程 {speedGain > 0 ? `缩短 ${speedGain}%` : `延长 ${Math.abs(speedGain)}%`}
                    {' · '}单趟载重 {s.cap > current.cap ? `+${s.cap - current.cap}` : s.cap - current.cap}
                  </div>
                )}

                {owned ? (
                  <button
                    className={active ? 'btn-ghost-orange w-full py-2.5 text-sm' : 'btn-orange w-full py-2.5 text-sm'}
                    disabled={active}
                    style={{ opacity: active ? 0.5 : 1 }}
                    onClick={() => dispatch({ type: 'SELECT_SHIP', shipId: s.id })}
                  >
                    {active ? '✓ 正在使用' : '⚓ 换乘此船'}
                  </button>
                ) : (
                  <button
                    className="btn-orange w-full py-2.5 text-sm font-900"
                    style={{ opacity: affordable ? 1 : 0.55 }}
                    onClick={() => dispatch({ type: 'BUY_SHIP', shipId: s.id })}
                  >
                    🪙 购买 · {s.cost.toLocaleString()} 金
                  </button>
                )}
              </div>
            )
          })}
        </div>
        </>)}
      </div>
    </div>
  )
}
