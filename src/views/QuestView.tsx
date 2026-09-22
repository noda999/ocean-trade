import { useState } from 'react'
import { ACHIEVEMENTS, CITIES, CREW, CREW_QUESTS, GOODS, LEGENDS, LEGEND_TITLE, MILESTONES } from '../game/data'
import { nextTitle, rankFor, titleFor } from '../game/engine'
import {
  allLegendsDone, claimable, crewQuestClaimable, crewQuestProgress, crewQuestTarget,
  crewQuestValue, crewQuestVisible, legendClaimable, legendProgress, legendValue, milestoneProgress,
} from '../game/state'
import { useGame } from '../game/store'
import { fmt } from './CargoView'
import ShareCard from '../components/ShareCard'

export default function QuestView() {
  const { state, dispatch, assets, reset } = useGame()
  const [shareOpen, setShareOpen] = useState(false)
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

  const stats = [
    { label: '总资产', value: assets.toLocaleString(), icon: '💎' },
    { label: '交易笔数', value: state.stats.trades.toString(), icon: '🔁' },
    { label: '累计盈亏', value: `${state.stats.profit >= 0 ? '+' : '−'}${Math.abs(Math.round(state.stats.profit)).toLocaleString()}`, icon: '📈' },
    { label: '单笔最佳', value: state.stats.best > 0 ? `+${Math.round(state.stats.best).toLocaleString()}` : '—', icon: '🏅' },
    { label: '航行里程', value: `${state.stats.distance.toLocaleString()} 海里`, icon: '🧭' },
    { label: '海上事件', value: `${state.stats.events} 次`, icon: '🌊' },
    { label: '到达城市', value: `${state.visited.length}/${CITIES.length}`, icon: '🏙️' },
    { label: '买过商品', value: `${state.goodsBought.length}/${GOODS.length}`, icon: '📥' },
    { label: '卖过商品', value: `${state.goodsSold.length}/${GOODS.length}`, icon: '📤' },
  ]

  return (
    <div className="absolute inset-0 overflow-auto" style={{ background: '#f8f0e0' }}>
      <div className="px-4 pt-4 pb-6">
        <div className="font-900 text-xl mb-4" style={{ color: '#3d2b10' }}>🏆 功勋</div>

        {/* 称号卡 */}
        <div className="rank-card p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.22)' }}>
              ⚜️
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
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: done ? '#e6f6e9' : '#fff5ec' }}>
                    {done ? '✅' : can ? '🎁' : '🎯'}
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

        {/* 传奇功勋 */}
        <div className="font-800 text-sm mb-2 flex items-center gap-2" style={{ color: '#3d2b10' }}>
          传奇功勋
          <span className="text-xs font-700" style={{ color: '#c0a070' }}>通关后的长线目标 · 已达成 {legendDone}/{LEGENDS.length}</span>
        </div>
        {legendComplete && (
          <div
            className="panel-white p-3 mb-2 flex items-center gap-3"
            style={{ borderRadius: 14, background: 'linear-gradient(135deg,#fff8e8,#ffefc9)', border: '1.5px solid #f0d89a' }}
          >
            <span className="text-2xl">👑</span>
            <div className="flex-1">
              <div className="font-900 text-sm" style={{ color: '#8a5a08' }}>{LEGEND_TITLE}</div>
              <div className="text-xs" style={{ color: '#a07030' }}>十项传奇功勋全数达成，你的名字将传遍七海</div>
            </div>
            <span className="text-lg">✅</span>
          </div>
        )}
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
                    {done ? '✅' : l.icon}
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

        {/* 船员委托 */}
        <div className="font-800 text-sm mb-2 flex items-center gap-2" style={{ color: '#3d2b10' }}>
          船员委托
          <span className="text-xs font-700" style={{ color: '#c0a070' }}>招募船员解锁 · 已完成 {questDone}/{CREW_QUESTS.length}</span>
        </div>
        {hiredCrewList.length === 0 && (
          <div className="panel-white p-3 mb-4 text-xs" style={{ borderRadius: 14, color: '#a07030' }}>
            🍺 船坞 → 酒馆：12 位航海好手散布在世界各港，登船后每人带来 3 段专属委托
          </div>
        )}
        {hiredCrewList.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {hiredCrewList.map(crew => {
              const crewQuests = CREW_QUESTS.filter(q => q.crewId === crew.id)
              const crewDone = crewQuests.filter(q => state.crewQuestsClaimed.includes(q.id)).length
              const current = crewQuests.filter(q => crewQuestVisible(state, q))
              const q = current[0]
              const can = q ? crewQuestClaimable(state, q) : false
              const p = q ? crewQuestProgress(state, q) : 1
              return (
                <div key={crew.id} className="panel-white p-3" style={{ borderRadius: 14 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: `${crew.color}22`, color: crew.color, fontWeight: 900 }}
                    >
                      {crew.name.slice(0, 1)}
                    </div>
                    <span className="font-800 text-xs" style={{ color: '#3d2b10' }}>{crew.name}</span>
                    <span className="text-[10px]" style={{ color: '#c0a070' }}>{crew.role}</span>
                    <span className="ml-auto text-[10px] font-800" style={{ color: crewDone === 3 ? '#4cba6a' : '#c0a070' }}>
                      {crewDone === 3 ? '全部完成 ✅' : `${crewDone}/3`}
                    </span>
                  </div>
                  {q ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-800 text-xs" style={{ color: can ? '#a06a10' : '#3d2b10' }}>
                            第{q.stage}段 · {q.title}
                            {can && ' 🎁'}
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
                    <div className="text-xs" style={{ color: '#4cba6a' }}>三段委托全部完成，{crew.name}向你举杯 🍻</div>
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

        {/* 贸易成就 */}
        <div className="font-800 text-sm mb-2" style={{ color: '#3d2b10' }}>
          贸易成就
          <span className="ml-2 text-xs font-700" style={{ color: '#c0a070' }}>已解锁 {unlocked}/{ACHIEVEMENTS.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {ACHIEVEMENTS.map(a => {
            const cur = achCount(a.kind)
            const done = cur >= a.target
            const p = Math.min(1, cur / a.target)
            return (
              <div key={a.id} className="panel-white p-3" style={{ borderRadius: 14, opacity: done ? 1 : 0.88 }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: done ? '#fff3d6' : '#f5f0e6', filter: done ? undefined : 'grayscale(0.7)' }}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-800 text-xs truncate" style={{ color: done ? '#a06a10' : '#3d2b10' }}>{a.label}</div>
                    <div className="text-[10px] truncate" style={{ color: '#c0a070' }}>{a.desc}</div>
                  </div>
                  {done && <span className="text-xs">✅</span>}
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

        {/* 统计 */}
        <div className="font-800 text-sm mb-2" style={{ color: '#3d2b10' }}>航海统计</div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {stats.map(s => (
            <div key={s.label} className="panel-white p-3" style={{ borderRadius: 14 }}>
              <div className="text-lg mb-1">{s.icon}</div>
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
          📸 生成我的航海生涯分享图
        </button>
        {shareOpen && (
          <ShareCard state={state} assets={assets} title={legendComplete ? LEGEND_TITLE : title} onClose={() => setShareOpen(false)} />
        )}

        <div className="panel-white p-3 mb-3" style={{ borderRadius: 14 }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">📡</span>
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
          🔄 重新开始游戏
        </button>
        <div className="text-xs text-center" style={{ color: '#c0a070' }}>
          游戏时长 {fmt(state.clock)}
        </div>
      </div>
    </div>
  )
}
