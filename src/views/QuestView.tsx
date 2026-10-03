import { useState } from 'react'
import { ACHIEVEMENTS, CITIES, CREW, CREW_QUESTS, GOODS, LEGENDS, LEGEND_TITLE, MILESTONES, VOYAGE_EVENTS } from '../game/data'
import { nextTitle, rankFor, titleFor } from '../game/engine'
import {
  allLegendsDone, claimable, crewQuestClaimable, crewQuestProgress, crewQuestTarget,
  crewQuestValue, crewQuestVisible, legendClaimable, legendProgress, legendValue, milestoneProgress,
} from '../game/state'
import { useGame } from '../game/store'
import { fmt } from './CargoView'
import ShareCard from '../components/ShareCard'
import GoodsCodex from '../components/GoodsCodex'
import CityCodex from '../components/CityCodex'
import VoyageEventCodex from '../components/VoyageEventCodex'
import { CrewAvatar } from '../components/CrewAvatar'
import { Glyph, type GlyphName } from '../components/Glyph'

export default function QuestView() {
  const { state, dispatch, assets, reset } = useGame()
  const [shareOpen, setShareOpen] = useState(false)
  const [codexOpen, setCodexOpen] = useState(false)
  const [cityCodexOpen, setCityCodexOpen] = useState(false)
  const [voyageCodexOpen, setVoyageCodexOpen] = useState(false)
  const [legendOpen, setLegendOpen] = useState(false)
  const [crewOpen, setCrewOpen] = useState(false)
  const [achOpen, setAchOpen] = useState(false)
  const title = titleFor(assets)
  const next = nextTitle(assets)
  const rank = rankFor(assets)

  // 成就进度：到达城市 / 买过 / 卖过 / 交易过（买卖并集）
  const tradedCount = new Set([...state.goodsBought, ...state.goodsSold]).size
  const achCount = (kind: string) =>
    kind === 'visited' ? state.visited.length
      : kind === 'bought' ? state.goodsBought.length
        : kind === 'sold' ? state.goodsSold.length
          : tradedCount
  const unlocked = ACHIEVEMENTS.filter(a => achCount(a.kind) >= a.target).length
  const legendDone = state.legendsClaimed.length
  const legendComplete = allLegendsDone(state)
  const questDone = state.crewQuestsClaimed.length
  const hiredCrewList = CREW.filter(c => state.hiredCrew.includes(c.id))

  const stats: { label: string; value: string; icon: GlyphName }[] = [
    { label: '总资产', value: assets.toLocaleString(), icon: 'gem' },
    { label: '交易笔数', value: state.stats.trades.toString(), icon: 'swap' },
    { label: '累计盈亏', value: `${state.stats.profit >= 0 ? '+' : '−'}${Math.abs(Math.round(state.stats.profit)).toLocaleString()}`, icon: 'trendUp' },
    { label: '单笔最佳', value: state.stats.best > 0 ? `+${Math.round(state.stats.best).toLocaleString()}` : '—', icon: 'medal' },
    { label: '航行里程', value: `${state.stats.distance.toLocaleString()} 海里`, icon: 'compass' },
    { label: '海上事件', value: `${state.stats.events} 次`, icon: 'wave' },
    { label: '到达城市', value: `${state.visited.length}/${CITIES.length}`, icon: 'city' },
    { label: '买过商品', value: `${state.goodsBought.length}/${GOODS.length}`, icon: 'loadIn' },
    { label: '卖过商品', value: `${state.goodsSold.length}/${GOODS.length}`, icon: 'loadOut' },
  ]

  return (
    <div className="absolute inset-0 overflow-auto" style={{ background: '#f8f0e0' }}>
      <div className="px-4 pt-4 pb-6">
        <div className="font-900 text-xl mb-4 inline-flex items-center gap-2" style={{ color: '#3d2b10' }}>
          <Glyph name="trophy" size={22} />功勋
        </div>

        {/* 称号卡 */}
        <div className="rank-card p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.22)' }}>
              <Glyph name="fleur" size={30} color="#fff" />
            </div>
            <div className="flex-1">
              <div className="text-xs opacity-85">当前称号</div>
              <div className="font-900 text-xl">{legendComplete ? LEGEND_TITLE : title}</div>
              <div className="text-xs opacity-85 mt-0.5">
                {rank ? `全球排名 第 ${rank} 位` : '资产达到 12,000 即可上榜'}
              </div>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="font-900 text-2xl">{assets.toLocaleString()}</span>
            <span className="text-xs opacity-85">总资产</span>
          </div>
          {next ? (
            <>
              <div className="prog-track h-2.5" style={{ background: 'rgba(0,0,0,0.18)' }}>
                <div className="prog-fill" style={{ width: `${Math.min(100, (assets / next.min) * 100)}%`, background: 'linear-gradient(90deg,#ffd97a,#fff3c4)' }} />
              </div>
              <div className="text-xs mt-1.5 opacity-85">
                距离「{next.name}」还差 <b>{(next.min - assets).toLocaleString()}</b> 金
              </div>
            </>
          ) : (
            <div className="text-xs opacity-85">已达到最高称号，海上之王！</div>
          )}
        </div>

        {/* 阶段目标 */}
        <div className="font-800 text-sm mb-2" style={{ color: '#3d2b10' }}>阶段目标</div>
        <div className="flex flex-col gap-2 mb-4">
          {MILESTONES.map(m => {
            const done = state.claimed.includes(m.id)
            const can = claimable(state, m)
            const p = milestoneProgress(state, m)
            return (
              <div key={m.id} className="panel-white p-3" style={{ borderRadius: 14, opacity: done ? 0.72 : 1 }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: done ? '#e6f6e9' : '#fff5ec' }}>
                    <Glyph name={done ? 'checkCircle' : m.icon} size={28} color={done ? '#4cba6a' : '#c98a30'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-800 text-sm" style={{ color: '#3d2b10' }}>{m.label}</div>
                    <div className="text-xs" style={{ color: '#a07030' }}>
                      资产达 {m.target.toLocaleString()} · 奖励 {m.gold.toLocaleString()} 金 + 加速卡 ×{m.boost}
                    </div>
                  </div>
                  {can ? (
                    <button className="btn-orange text-xs px-3 py-1.5" onClick={() => dispatch({ type: 'CLAIM', id: m.id })}>
                      领取
                    </button>
                  ) : (
                    <span className="text-xs font-800" style={{ color: done ? '#4cba6a' : '#c0a070' }}>
                      {done ? '已领取' : `${Math.round(p * 100)}%`}
                    </span>
                  )}
                </div>
                <div className="prog-track h-2">
                  <div className="prog-fill" style={{ width: `${p * 100}%`, background: done ? '#4cba6a' : undefined }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* 传奇功勋（可折叠） */}
        <button
          className="panel-white p-3 mb-2 w-full text-left"
          style={{ borderRadius: 14 }}
          onClick={() => setLegendOpen(o => !o)}
        >
          <div className="flex items-center gap-2">
            <Glyph name="trophy" size={19} color="#c98a30" />
            <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>传奇功勋</span>
            <span className="ml-auto text-xs font-800" style={{ color: '#c0a070' }}>
              已达成 {legendDone}/{LEGENDS.length}
            </span>
            <Glyph name={legendOpen ? 'chevronDown' : 'chevronRight'} size={14} color="#c98a30" />
          </div>
          <div className="prog-track h-2 mt-2">
            <div
              className="prog-fill"
              style={{ width: `${(legendDone / LEGENDS.length) * 100}%`, background: legendDone === LEGENDS.length ? '#4cba6a' : 'linear-gradient(90deg,#f0a83c,#ffd97a)' }}
            />
          </div>
          <div className="text-xs mt-1.5" style={{ color: '#a07030' }}>
            通关后的长线目标 · 点开查看各项进度
          </div>
        </button>
        {legendOpen && legendComplete && (
          <div
            className="panel-white p-3 mb-2 flex items-center gap-3"
            style={{ borderRadius: 14, background: 'linear-gradient(135deg,#fff8e8,#ffefc9)', border: '1.5px solid #f0d89a' }}
          >
            <Glyph name="crown" size={26} color="#c98a30" />
            <div className="flex-1">
              <div className="font-900 text-sm" style={{ color: '#8a5a08' }}>{LEGEND_TITLE}</div>
              <div className="text-xs" style={{ color: '#a07030' }}>十项传奇功勋全数达成，你的名字将传遍七海</div>
            </div>
            <Glyph name="checkCircle" size={20} color="#4cba6a" />
          </div>
        )}
        {legendOpen && (
        <div className="flex flex-col gap-2 mb-4">
          {LEGENDS.map(l => {
            const done = state.legendsClaimed.includes(l.id)
            const can = legendClaimable(state, l)
            const cur = legendValue(state, l)
            const p = legendProgress(state, l)
            return (
              <div key={l.id} className="panel-white p-3" style={{ borderRadius: 14, opacity: done ? 0.72 : 1 }}>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: done ? '#e6f6e9' : can ? '#fff3d6' : '#fff5ec' }}
                  >
                    {done ? <Glyph name="checkCircle" size={20} color="#4cba6a" /> : <Glyph name={l.icon} size={20} color="#c98a30" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-800 text-sm" style={{ color: '#3d2b10' }}>{l.label}</div>
                    <div className="text-xs" style={{ color: '#a07030' }}>
                      {l.desc} · 奖励 {l.gold.toLocaleString()} 金 + 加速卡 ×{l.boost}
                    </div>
                  </div>
                  {can ? (
                    <button className="btn-orange text-xs px-3 py-1.5" onClick={() => dispatch({ type: 'CLAIM_LEGEND', id: l.id })}>
                      领取
                    </button>
                  ) : (
                    <span className="text-xs font-800 whitespace-nowrap" style={{ color: done ? '#4cba6a' : '#c0a070' }}>
                      {done ? '已领取' : `${Math.round(p * 100)}%`}
                    </span>
                  )}
                </div>
                <div className="prog-track h-2">
                  <div
                    className="prog-fill"
                    style={{ width: `${p * 100}%`, background: done ? '#4cba6a' : 'linear-gradient(90deg,#f0a83c,#ffd97a)' }}
                  />
                </div>
                {!done && (
                  <div className="text-[10px] mt-1 text-right font-700" style={{ color: '#c0a070' }}>
                    {cur.toLocaleString()} / {l.target.toLocaleString()}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        )}

        {/* 船员委托（可折叠） */}
        <button
          className="panel-white p-3 mb-2 w-full text-left"
          style={{ borderRadius: 14 }}
          onClick={() => setCrewOpen(o => !o)}
        >
          <div className="flex items-center gap-2">
            <Glyph name="beer" size={19} color="#4cba6a" />
            <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>船员委托</span>
            <span className="ml-auto text-xs font-800" style={{ color: '#c0a070' }}>
              已完成 {questDone}/{CREW_QUESTS.length}
            </span>
            <Glyph name={crewOpen ? 'chevronDown' : 'chevronRight'} size={14} color="#4cba6a" />
          </div>
          <div className="prog-track h-2 mt-2">
            <div
              className="prog-fill"
              style={{ width: `${(questDone / CREW_QUESTS.length) * 100}%`, background: questDone === CREW_QUESTS.length ? '#4cba6a' : 'linear-gradient(90deg,#f0a83c,#ffd97a)' }}
            />
          </div>
          <div className="text-xs mt-1.5" style={{ color: '#a07030' }}>
            招募船员解锁 · 点开查看各船员委托进度
          </div>
        </button>
        {crewOpen && (
        <>
        {hiredCrewList.length === 0 && (
          <div className="panel-white p-3 mb-4 text-xs" style={{ borderRadius: 14, color: '#a07030' }}>
            <span className="inline-flex items-center gap-1.5"><Glyph name="beer" size={14} />船坞 → 酒馆：12 位航海好手散布在世界各港，登船后每人带来 3 段专属委托</span>
          </div>
        )}
        {hiredCrewList.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {hiredCrewList.map(crew => {
              const crewQuests = CREW_QUESTS.filter(q => q.crewId === crew.id)
              const crewDone = crewQuests.filter(q => state.crewQuestsClaimed.includes(q.id)).length
              // 关键：crewQuestVisible 对第 1 段永远返回 true（即使已领取），
              // 必须排除已领取的段，否则领完第 1 段后卡片仍停在「第 1 段 100%」，
              // 已经解锁的第 2 段排在后面永远显示不出来。
              const current = crewQuests.filter(
                q => crewQuestVisible(state, q) && !state.crewQuestsClaimed.includes(q.id),
              )
              const q = current[0]
              const can = q ? crewQuestClaimable(state, q) : false
              const p = q ? crewQuestProgress(state, q) : 1
              return (
                <div key={crew.id} className="panel-white p-3" style={{ borderRadius: 14 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${crew.color}22`, overflow: 'hidden' }}
                    >
                      <CrewAvatar look={crew.look} size={32} icon={crew.id} />
                    </div>
                    <span className="font-800 text-xs" style={{ color: '#3d2b10' }}>{crew.name}</span>
                    <span className="text-[10px]" style={{ color: '#c0a070' }}>{crew.role}</span>
                    <span className="ml-auto text-[10px] font-800" style={{ color: crewDone === 3 ? '#4cba6a' : '#c0a070' }}>
                      {crewDone === 3
                        ? <span className="inline-flex items-center gap-1">全部完成 <Glyph name="check" size={11} /></span>
                        : `${crewDone}/3`}
                    </span>
                  </div>
                  {q ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-800 text-xs" style={{ color: can ? '#a06a10' : '#3d2b10' }}>
                            <span className="inline-flex items-center gap-1">第{q.stage}段 · {q.title}{can && <Glyph name="gift" size={12} />}</span>
                          </div>
                          <div className="text-[10px]" style={{ color: '#a07030' }}>{q.desc}</div>
                        </div>
                        {can ? (
                          <button
                            className="btn-orange text-xs px-3 py-1.5 flex-shrink-0"
                            onClick={() => dispatch({ type: 'CLAIM_CREW_QUEST', id: q.id })}
                          >领取</button>
                        ) : (
                          <span className="text-xs font-800 flex-shrink-0" style={{ color: '#c0a070' }}>
                            {Math.round(p * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="prog-track h-1.5 mt-2">
                        <div
                          className="prog-fill"
                          style={{ width: `${p * 100}%`, background: can ? '#f0a83c' : undefined }}
                        />
                      </div>
                      {!can && (
                        <div className="text-[10px] mt-1 text-right font-700" style={{ color: '#c0a070' }}>
                          {crewQuestValue(state, q).toLocaleString()} / {crewQuestTarget(q).toLocaleString()}
                          {' '}· 奖励 {q.gold.toLocaleString()} 金
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs inline-flex items-center gap-1.5" style={{ color: '#4cba6a' }}>
                      三段委托全部完成，{crew.name}向你举杯 <Glyph name="cheers" size={14} />
                    </div>
                  )}
                </div>
              )
            })}
            {hiredCrewList.length < CREW.length && (
              <div className="text-[10px] text-center" style={{ color: '#c0a070' }}>
                还有 {CREW.length - hiredCrewList.length} 位船员散布在各港酒馆，招募后解锁专属委托
              </div>
            )}
          </div>
        )}
        </>
        )}

        {/* 贸易成就（可折叠） */}
        <button
          className="panel-white p-3 mb-2 w-full text-left"
          style={{ borderRadius: 14 }}
          onClick={() => setAchOpen(o => !o)}
        >
          <div className="flex items-center gap-2">
            <Glyph name="medal" size={19} color="#2f8fb8" />
            <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>贸易成就</span>
            <span className="ml-auto text-xs font-800" style={{ color: '#c0a070' }}>
              已解锁 {unlocked}/{ACHIEVEMENTS.length}
            </span>
            <Glyph name={achOpen ? 'chevronDown' : 'chevronRight'} size={14} color="#2f8fb8" />
          </div>
          <div className="prog-track h-2 mt-2">
            <div
              className="prog-fill"
              style={{ width: `${(unlocked / ACHIEVEMENTS.length) * 100}%`, background: unlocked === ACHIEVEMENTS.length ? '#4cba6a' : 'linear-gradient(90deg,#f0a83c,#ffd97a)' }}
            />
          </div>
          <div className="text-xs mt-1.5" style={{ color: '#a07030' }}>
            买卖 / 到访的里程碑 · 点开查看全部成就
          </div>
        </button>
        {achOpen && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {ACHIEVEMENTS.map(a => {
            const cur = achCount(a.kind)
            const done = cur >= a.target
            const p = Math.min(1, cur / a.target)
            return (
              <div key={a.id} className="panel-white p-3" style={{ borderRadius: 14, opacity: done ? 1 : 0.88 }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: done ? '#fff3d6' : '#f5f0e6', filter: done ? undefined : 'grayscale(0.7)' }}>
                    <Glyph name={a.icon} size={26} color={done ? '#c98a30' : '#a8a090'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-800 text-xs truncate" style={{ color: done ? '#a06a10' : '#3d2b10' }}>{a.label}</div>
                    <div className="text-[10px] truncate" style={{ color: '#c0a070' }}>{a.desc}</div>
                  </div>
                  {done && <Glyph name="check" size={13} color="#4cba6a" />}
                </div>
                <div className="prog-track h-1.5">
                  <div className="prog-fill" style={{ width: `${p * 100}%`, background: done ? '#f0a83c' : undefined }} />
                </div>
                <div className="text-[10px] mt-1 text-right font-700" style={{ color: done ? '#4cba6a' : '#c0a070' }}>
                  {done ? '已达成' : `${cur}/${a.target}`}
                </div>
              </div>
            )
          })}
        </div>
        )}

        {/* 商品图鉴入口 */}
        <button
          className="panel-white p-3 mb-4 w-full text-left"
          style={{ borderRadius: 14 }}
          onClick={() => setCodexOpen(true)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Glyph name="book" size={19} color="#a07030" />
            <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>商品图鉴</span>
            <span className="ml-auto text-xs font-800" style={{ color: '#c0a070' }}>
              已收集 {tradedCount}/{GOODS.length}
            </span>
            <Glyph name="arrowRight" size={14} color="#c98a30" />
          </div>
          <div className="prog-track h-2">
            <div
              className="prog-fill"
              style={{ width: `${(tradedCount / GOODS.length) * 100}%`, background: 'linear-gradient(90deg,#f0a83c,#ffd97a)' }}
            />
          </div>
          <div className="text-xs mt-1.5" style={{ color: '#a07030' }}>
            点开查看买过 / 卖过的商品收集进度
          </div>
        </button>

        {/* 城市图鉴入口 */}
        <button
          className="panel-white p-3 mb-4 w-full text-left"
          style={{ borderRadius: 14 }}
          onClick={() => setCityCodexOpen(true)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Glyph name="city" size={19} color="#2f8fb8" />
            <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>城市图鉴</span>
            <span className="ml-auto text-xs font-800" style={{ color: '#c0a070' }}>
              已到达 {state.visited.length}/{CITIES.length}
            </span>
            <Glyph name="arrowRight" size={14} color="#2f8fb8" />
          </div>
          <div className="prog-track h-2">
            <div
              className="prog-fill"
              style={{ width: `${(state.visited.length / CITIES.length) * 100}%`, background: 'linear-gradient(90deg,#4ea0c9,#9ad6f0)' }}
            />
          </div>
          <div className="text-xs mt-1.5" style={{ color: '#a07030' }}>
            点开查看已抵达 / 尚未发现的港口
          </div>
        </button>

        {/* 海上事件图鉴入口 */}
        <button
          className="panel-white p-3 mb-4 w-full text-left"
          style={{ borderRadius: 14 }}
          onClick={() => setVoyageCodexOpen(true)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Glyph name="wave" size={19} color="#2f8fb8" />
            <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>海上事件图鉴</span>
            <span className="ml-auto text-xs font-800" style={{ color: '#c0a070' }}>
              已遭遇 {state.eventsSeen.length}/{VOYAGE_EVENTS.length}
            </span>
            <Glyph name="arrowRight" size={14} color="#2f8fb8" />
          </div>
          <div className="prog-track h-2">
            <div
              className="prog-fill"
              style={{ width: `${(state.eventsSeen.length / VOYAGE_EVENTS.length) * 100}%`, background: 'linear-gradient(90deg,#4ea0c9,#9ad6f0)' }}
            />
          </div>
          <div className="text-xs mt-1.5" style={{ color: '#a07030' }}>
            点开查看已遭遇 / 尚未遇见的航行奇遇
          </div>
        </button>
        <div className="font-800 text-sm mb-2" style={{ color: '#3d2b10' }}>航海统计</div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {stats.map(s => (
            <div key={s.label} className="panel-white p-3" style={{ borderRadius: 14 }}>
              <div className="mb-1"><Glyph name={s.icon} size={26} color="#c98a30" /></div>
              <div className="font-900 text-sm" style={{ color: '#3d2b10' }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#c0a070' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button
          className="btn-orange w-full py-3 text-sm font-900 mb-4"
          style={{ borderRadius: 14 }}
          onClick={() => setShareOpen(true)}
        >
          <span className="inline-flex items-center gap-1.5 justify-center"><Glyph name="camera" size={16} />生成我的航海生涯分享图</span>
        </button>
        {shareOpen && (
          <ShareCard state={state} assets={assets} title={legendComplete ? LEGEND_TITLE : title} onClose={() => setShareOpen(false)} />
        )}
        {codexOpen && (
          <GoodsCodex bought={state.goodsBought} sold={state.goodsSold} sellLog={state.sellLog} visited={state.visited} onClose={() => setCodexOpen(false)} />
        )}
        {cityCodexOpen && (
          <CityCodex visited={state.visited} onClose={() => setCityCodexOpen(false)} />
        )}
        {voyageCodexOpen && (
          <VoyageEventCodex seen={state.eventsSeen} onClose={() => setVoyageCodexOpen(false)} />
        )}

        <div className="panel-white p-3 mb-3" style={{ borderRadius: 14 }}>
          <div className="flex items-center gap-2 mb-1">
            <Glyph name="spyglass" size={19} color="#a07030" />
            <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>情报网络</span>
            <span className="ml-auto text-xs font-800" style={{ color: state.intelOwned ? '#4cba6a' : '#e05050' }}>
              {state.intelOwned ? '已开通' : '未开通（800 金）'}
            </span>
          </div>
          <div className="text-xs" style={{ color: '#a07030' }}>
            开通后可查看全球城市的实时价格与最赚商路
          </div>
        </div>

        <button
          className="w-full py-3 text-sm font-800 mb-2"
          style={{ borderRadius: 14, background: '#fff', color: '#c05050', border: '1.5px solid #f0d0c8' }}
          onClick={() => { if (confirm('确定要重新开始吗？当前存档将被清空。')) reset() }}
        >
          <span className="inline-flex items-center gap-1.5 justify-center"><Glyph name="refresh" size={15} />重新开始游戏</span>
        </button>
        <div className="text-xs text-center" style={{ color: '#c0a070' }}>
          游戏时长 {fmt(state.clock)}
        </div>
      </div>
    </div>
  )
}
