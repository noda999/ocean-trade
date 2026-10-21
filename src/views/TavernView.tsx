import { useState } from 'react'
import { CITY_BY_ID, CREW, CREW_COURSES, CREW_FAVOR_MAX, CREW_GIFTS, CREW_MAX_LEVEL, CREW_STORIES } from '../game/data'
import { crewBonusOf, crewCourseLevelOf, crewTrainCost, crewTotalLevelOf } from '../game/state'
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
  const [openId, setOpenId] = useState<string | null>(null)
  const [openCourseFor, setOpenCourseFor] = useState<string | null>(null)
  const [openGiftFor, setOpenGiftFor] = useState<string | null>(null)

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
          const lv = crewTotalLevelOf(state, c.id)
          const crewSpeed = c.speed + c.courses.reduce((s, cid) => s + (CREW_COURSES[cid]?.speed ?? 0) * crewCourseLevelOf(state, c.id, cid), 0)
          const crewTrade = c.trade + c.courses.reduce((s, cid) => s + (CREW_COURSES[cid]?.trade ?? 0) * crewCourseLevelOf(state, c.id, cid), 0)
          return (
            <div
              key={c.id}
              className="panel-white p-4"
              style={{ borderRadius: 16, borderLeft: `4px solid ${c.color}`, opacity: !hired && !here ? 0.8 : 1 }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center cursor-pointer"
                  style={{ background: '#fffdf8', border: `1.5px solid ${c.color}33` }}
                  onClick={() => setOpenId(openId === c.id ? null : c.id)}
                  title="点击翻开 TA 的人物志"
                >
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
                  <button
                    className="text-[11px] mt-1 inline-flex items-center gap-1 font-700"
                    style={{ color: '#c07a1a' }}
                    onClick={() => setOpenId(openId === c.id ? null : c.id)}
                  >
                    <Glyph name="book" size={12} />{openId === c.id ? '收起人物志' : '点此翻开 TA 的人物志'}
                  </button>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {c.speed > 0 && (
                      <span className="text-[10px] font-800 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1" style={{ background: '#e8f4ff', color: '#2f7cb8' }}>
                        <Glyph name="wind" size={11} />航速 +{crewSpeed}%
                      </span>
                    )}
                    {c.trade > 0 && (
                      <span className="text-[10px] font-800 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1" style={{ background: '#fff4dd', color: '#c07a1a' }}>
                        <Glyph name="purse" size={11} />利润 +{crewTrade}%
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

              {/* 人物志详情：点头像触发一句独白，再展开完整志与已解锁的往事（不直接摊开） */}
              {openId === c.id && CREW_STORIES[c.id] && (() => {
                const def = CREW_STORIES[c.id]
                const whisper = def.bio.split('。')[0] + '。'
                const favor0 = state.crewFavor[c.id] ?? 0
                const tales = def.stories.filter(st => favor0 >= st.at)
                return (
                  <div className="mb-3 rounded-xl px-3 py-2.5" style={{ background: '#faf5e8', border: '1px solid #ecdfc4' }}>
                    <div className="text-[11px] italic leading-relaxed" style={{ color: '#b08a55' }}>「{whisper}」</div>
                    <div className="text-[11px] mt-1.5 leading-relaxed" style={{ color: '#7a5a30' }}>{def.bio}</div>
                    {tales.length > 0 && (
                      <div className="mt-2 pt-2" style={{ borderTop: '1px dashed #e0cfa8' }}>
                        <div className="text-[10px] font-800 mb-1" style={{ color: '#a07030' }}>已解锁的往事</div>
                        {tales.map(t => (
                          <div key={t.at} className="text-[11px] leading-relaxed mb-1" style={{ color: '#7a5a30' }}>「{t.text}」</div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })()}

              {hired ? (
                (() => {
                  const total = lv
                  const maxed = total >= CREW_MAX_LEVEL
                  const favor = state.crewFavor[c.id] ?? 0
                  const favorMaxed = favor >= CREW_FAVOR_MAX
                  const courseCost = crewTrainCost(total)
                  const courseCan = !maxed && state.money >= courseCost
                  return (
                    <div className="flex flex-col gap-2">
                      {/* 养成行 */}
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-800 px-1.5 py-0.5 rounded-md flex-shrink-0"
                          style={{ background: '#efe7f5', color: '#7b4bc4' }}
                        >养成 Lv.{total}/{CREW_MAX_LEVEL}</span>
                        <button
                          className="btn-orange flex-1 py-2.5 text-sm font-900"
                          style={{ opacity: courseCan ? 1 : 0.55 }}
                          onClick={() => setOpenCourseFor(openCourseFor === c.id ? null : c.id)}
                        >
                          <span className="inline-flex items-center gap-1.5 justify-center">
                            <Glyph name="sparkles" size={15} />进修课程
                          </span>
                        </button>
                      </div>
                      {/* 已修课程标签 */}
                      <div className="flex flex-wrap gap-1">
                        {c.courses.map(cid => {
                          const def = CREW_COURSES[cid]
                          const clv = crewCourseLevelOf(state, c.id, cid)
                          if (!def || !clv) return null
                          return (
                            <span key={cid} className="text-[10px] font-800 px-1.5 py-0.5 rounded-md" style={{ background: '#f3ecf8', color: '#7b4bc4' }}>
                              {def.name} Lv.{clv}
                            </span>
                          )
                        })}
                      </div>
                      {/* 课程选择浮层 */}
                      {openCourseFor === c.id && (
                        <div className="rounded-xl p-2.5 flex flex-col gap-1.5" style={{ background: '#f6f1fb', border: '1px solid #e3d4f0' }}>
                          {c.courses.map(cid => {
                            const def = CREW_COURSES[cid]
                            const clv = crewCourseLevelOf(state, c.id, cid)
                            if (!def) return null
                            return (
                              <div key={cid} className="flex items-center gap-2">
                                <Glyph name={def.icon as any} size={15} color="#7b4bc4" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-800" style={{ color: '#5a3b85' }}>{def.name} <span className="font-700 opacity-70">Lv.{clv}</span></div>
                                  <div className="text-[10px]" style={{ color: '#a07030' }}>{def.desc} · 下一级 {def.speed ? `航速+${def.speed}% ` : ''}{def.trade ? `利润+${def.trade}%` : ''}</div>
                                </div>
                                <button
                                  className="text-xs font-900 px-2 py-1.5 rounded-lg"
                                  style={{ background: maxed ? '#e9e0f0' : '#8a5bc4', color: maxed ? '#a99bc4' : '#fff', opacity: maxed ? 1 : (courseCan ? 1 : 0.55) }}
                                  disabled={maxed}
                                  onClick={() => dispatch({ type: 'TRAIN_CREW', crewId: c.id, courseId: cid })}
                                >
                                  {maxed ? '圆满' : `${courseCost.toLocaleString()} 金`}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                      {/* 好感行 */}
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-800 px-1.5 py-0.5 rounded-md flex-shrink-0"
                          style={{ background: '#ffe9ee', color: '#d23a5a' }}
                        >❤ {favor}/{CREW_FAVOR_MAX}</span>
                        <button
                          className="btn-ghost-orange flex-1 py-2.5 text-sm font-900"
                          onClick={() => setOpenGiftFor(openGiftFor === c.id ? null : c.id)}
                        >
                          <span className="inline-flex items-center gap-1.5 justify-center">
                            <Glyph name="gift" size={15} />送礼
                          </span>
                        </button>
                      </div>
                      {/* 好感提示 */}
                      <div className="text-[10px] leading-relaxed" style={{ color: '#b08a55' }}>
                        {favorMaxed
                          ? '好感已满 · 往事故事已全部解锁（点头像回看）'
                          : `好感越高越可能谈起往事 · 送礼至 ${CREW_FAVOR_MAX} 解锁全部（点头像查看）`}
                      </div>
                      {/* 礼物浮层 */}
                      {openGiftFor === c.id && (
                        <div className="rounded-xl p-2.5 flex flex-col gap-1.5" style={{ background: '#fdf3f6', border: '1px solid #f3d6e0' }}>
                          <div className="text-[10px] font-800 mb-0.5" style={{ color: '#c06a86' }}>挑一件投其所好：💚喜欢 · 😐一般 · 💔触雷</div>
                          {CREW_GIFTS.map(g => {
                            const like = g.tags.some(t => c.likes.includes(t))
                            const hate = g.tags.some(t => c.dislikes.includes(t))
                            const can = state.money >= g.cost
                            const react = hate ? '💔 讨厌' : like ? '💚 喜欢' : '😐 一般'
                            const rc = hate ? '#d23a5a' : like ? '#3a9a58' : '#a07030'
                            return (
                              <div key={g.id} className="flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-800" style={{ color: '#7a3a50' }}>{g.name}</div>
                                  <div className="text-[10px]" style={{ color: rc }}>{react} · {g.desc}</div>
                                </div>
                                <button
                                  className="text-xs font-900 px-2 py-1.5 rounded-lg"
                                  style={{ background: '#d23a5a', color: '#fff', opacity: can ? 1 : 0.55 }}
                                  disabled={!can}
                                  onClick={() => dispatch({ type: 'GIFT_CREW', crewId: c.id, giftId: g.id })}
                                >
                                  {g.cost.toLocaleString()} 金
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })()
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
