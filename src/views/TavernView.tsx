import { CITY_BY_ID, CREW } from '../game/data'
import { crewBonusOf } from '../game/state'
import { useGame } from '../game/store'
import { CrewAvatar } from '../components/CrewAvatar'
import { Glyph } from '../components/Glyph'

// ─────────────────────────────────────────────────────────────────────────────
//  酒馆：招募散落在世界各港的航海家 / 水手长 / 水手 / 大厨…
//  每人只能在对应城市的酒馆里雇佣，提供航速或利润加成
// ─────────────────────────────────────────────────────────────────────────────

export default function TavernView() {
  const { state, dispatch } = useGame()
  const cb = crewBonusOf(state)
  const hiredCount = state.hiredCrew.length

  return (
    <>
      {/* 船员总览 */}
      <div className="panel-orange p-4 mb-4" style={{ borderRadius: 18 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.22)' }}>
            <Glyph name="beer" size={30} color="#fff" />
          </div>
          <div className="flex-1">
            <div className="text-xs opacity-85">在船船员</div>
            <div className="font-900 text-xl">{hiredCount} / {CREW.length}</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-85">金币</div>
            <div className="font-900 text-sm">{Math.floor(state.money).toLocaleString()}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="text-xs opacity-80">船员航速加成</div>
            <div className="font-900 text-sm">{cb.speed ? `+${cb.speed}%` : '—'}</div>
          </div>
          <div className="flex-1 text-center rounded-xl py-1.5" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="text-xs opacity-80">船员利润加成</div>
            <div className="font-900 text-sm">{cb.trade ? `+${cb.trade}%` : '—'}</div>
          </div>
        </div>
      </div>

      {/* 船员名录 */}
      <div className="flex flex-col gap-3">
        {CREW.map(c => {
          const hired = state.hiredCrew.includes(c.id)
          const here = state.cityId === c.cityId
          const city = CITY_BY_ID[c.cityId]
          const affordable = state.money >= c.cost
          return (
            <div
              key={c.id}
              className="panel-white p-4"
              style={{ borderRadius: 16, borderLeft: `4px solid ${c.color}`, opacity: !hired && !here ? 0.8 : 1 }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: '#fffdf8', border: `1.5px solid ${c.color}33` }}>
                  <CrewAvatar look={c.look} size={52} icon={c.id} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-900 text-base" style={{ color: '#3d2b10' }}>{c.name}</span>
                    <span
                      className="text-[10px] font-800 px-1.5 py-0.5 rounded-md"
                      style={{ background: `${c.color}22`, color: c.color }}
                    >{c.role}</span>
                    {hired && <span className="badge-green">在船上</span>}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#a07030' }}>{c.desc}</div>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {c.speed > 0 && (
                      <span className="text-[10px] font-800 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1" style={{ background: '#e8f4ff', color: '#2f7cb8' }}>
                        <Glyph name="wind" size={11} />航速 +{c.speed}%
                      </span>
                    )}
                    {c.trade > 0 && (
                      <span className="text-[10px] font-800 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1" style={{ background: '#fff4dd', color: '#c07a1a' }}>
                        <Glyph name="purse" size={11} />利润 +{c.trade}%
                      </span>
                    )}
                    <span
                      className="text-[10px] font-700 px-1.5 py-0.5 rounded-md"
                      style={{
                        background: here && !hired ? '#e6f6e9' : '#f5eee0',
                        color: here && !hired ? '#3a9a58' : '#a07030',
                      }}
                    >
                      <span className="inline-flex items-center gap-1">
                        <Glyph name={here ? 'pin' : 'map'} size={11} />
                        {hired ? `招募地 · ${city.name}` : here ? '就在本港酒馆' : `需前往 ${city.name}`}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {hired ? (
                <button className="btn-ghost-orange w-full py-2.5 text-sm" disabled style={{ opacity: 0.6 }}>
                  <span className="inline-flex items-center gap-1.5 justify-center"><Glyph name="check" size={15} />已在船上</span>
                </button>
              ) : here ? (
                <button
                  className="btn-orange w-full py-2.5 text-sm font-900"
                  style={{ opacity: affordable ? 1 : 0.55 }}
                  onClick={() => dispatch({ type: 'HIRE_CREW', crewId: c.id })}
                >
                  <span className="inline-flex items-center gap-1.5 justify-center">
                    <Glyph name="exchange" size={15} />雇佣 · {c.cost.toLocaleString()} 金{!affordable && '（金币不足）'}
                  </span>
                </button>
              ) : (
                <button
                  className="w-full py-2.5 text-sm font-800"
                  disabled
                  style={{ borderRadius: 12, background: '#f5eee0', color: '#b09868' }}
                >
                  <span className="inline-flex items-center gap-1.5 justify-center">
                    <Glyph name="map" size={15} />到 {city.name} 才能招募
                  </span>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
