// ─────────────────────────────────────────────────────────────────────────────
//  调试面板（仅 dev 环境）
//
//  用途：一键跳到中后期状态，方便复现只在特定进度才出现的 bug
//  （船员委托第 2/3 段、传奇功勋、后期船、投资等级、悬赏…）。
//
//  只在 App.tsx 里以 `import.meta.env.DEV && <DebugPanel />` 挂载，
//  生产构建下整块代码会被 tree-shake 掉，不会出现在小红书正式包里。
// ─────────────────────────────────────────────────────────────────────────────

import { useState, type CSSProperties } from 'react'
import { CITIES, CREW, CREW_QUESTS, EQUIPS, GOODS, LEGENDS, SHIPS, SUPPLIES } from '../game/data'
import { crewQuestClaimable, legendClaimable, type GameState } from '../game/state'
import { useGame } from '../game/store'
import { Glyph } from './Glyph'

export default function DebugPanel() {
  const { state, dispatch, reset } = useGame()
  const [open, setOpen] = useState(false)

  const patch = (p: Partial<GameState>, stats?: Partial<GameState['stats']>) =>
    dispatch({ type: 'DEBUG_PATCH', patch: p, stats })

  function addMoney(n: number) {
    patch({ money: state.money + n })
  }

  function hireAllCrew() {
    patch({ hiredCrew: CREW.map(c => c.id) })
  }

  function unlockAllShips() {
    patch({ ownedShips: SHIPS.map(s => s.id) })
  }

  function switchToLegendShip() {
    patch({ ownedShips: SHIPS.map(s => s.id), shipId: 'legend' })
  }

  function visitAllCities() {
    patch({ visited: [...new Set([...state.visited, ...CITIES.map(c => c.id)])] })
  }

  function tradeAllGoods() {
    patch({
      goodsBought: [...new Set([...state.goodsBought, ...GOODS.map(g => g.id)])],
      goodsSold: [...new Set([...state.goodsSold, ...GOODS.map(g => g.id)])],
    })
  }

  function maxStats() {
    patch({}, {
      trades: state.stats.trades + 500,
      distance: state.stats.distance + 50_000,
      events: state.stats.events + 50,
      best: Math.max(state.stats.best, 100_000),
      profit: state.stats.profit + 10_000_000,
    })
  }

  function maxRep() {
    const rep: Record<string, number> = { ...state.rep }
    for (const c of CITIES) rep[c.id] = 100
    patch({ rep })
  }

  function maxInvest() {
    const invest: Record<string, number> = { ...state.invest }
    for (const c of CITIES) invest[c.id] = 3
    patch({ invest })
  }

  function giveAllEquipAndSupply() {
    const supplies: Record<string, number> = { ...state.supplies }
    for (const s of SUPPLIES) supplies[s.id] = (supplies[s.id] ?? 0) + 10
    patch({ equipOwned: EQUIPS.map(e => e.id), supplies, intelOwned: true })
  }

  /** 一键领取当前所有可领的委托与传奇 */
  function claimAll() {
    for (const q of CREW_QUESTS) {
      if (crewQuestClaimable(state, q)) dispatch({ type: 'CLAIM_CREW_QUEST', id: q.id })
    }
    for (const l of LEGENDS) {
      if (legendClaimable(state, l)) dispatch({ type: 'CLAIM_LEGEND', id: l.id })
    }
  }

  /** 时间快进：连续 TICK */
  function fastForward(seconds: number) {
    for (let i = 0; i < seconds; i++) dispatch({ type: 'TICK', dt: 1 })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="调试面板（仅开发环境）"
        style={{
          position: 'absolute', right: 8, top: '50%', zIndex: 60,
          transform: 'translateY(-50%)',
          width: 26, height: 46, borderRadius: '10px 0 0 10px',
          background: 'rgba(20,30,40,0.72)', color: '#7fe0b4',
          border: '1px solid rgba(127,224,180,0.35)', borderRight: 'none',
          fontSize: 11, fontWeight: 900, cursor: 'pointer',
          writingMode: 'vertical-rl', letterSpacing: 2,
        }}
      >
        调试
      </button>
    )
  }

  const btn: CSSProperties = {
    display: 'block', width: '100%', textAlign: 'left',
    padding: '7px 10px', marginBottom: 6, borderRadius: 9,
    background: '#fff8ec', border: '1px solid #f0dcb4',
    color: '#5a4418', fontSize: 11, fontWeight: 800, cursor: 'pointer',
  }
  const group = (label: string) => (
    <div style={{ fontSize: 10, fontWeight: 900, color: '#a08050', margin: '10px 0 5px' }}>{label}</div>
  )

  return (
    <div
      style={{
        position: 'absolute', right: 6, top: 60, bottom: 90, width: 172, zIndex: 70,
        background: 'rgba(255,252,244,0.97)', border: '1.5px solid #e0c894',
        borderRadius: 14, padding: 10, overflow: 'auto',
        boxShadow: '0 12px 32px rgba(60,40,10,0.28)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <Glyph name="hammer" size={14} color="#a07030" />
        <span style={{ fontSize: 12, fontWeight: 900, color: '#3d2b10' }}>调试面板</span>
        <button
          onClick={() => setOpen(false)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#a08050', fontSize: 14, lineHeight: 1 }}
        >×</button>
      </div>
      <div style={{ fontSize: 10, color: '#a08050', marginBottom: 4 }}>仅开发环境，打包后自动消失</div>

      {group('资金')}
      <button style={btn} onClick={() => addMoney(1_000_000)}>+100 万金</button>
      <button style={btn} onClick={() => addMoney(100_000_000)}>+1 亿金（传奇宝船）</button>

      {group('船员 / 委托')}
      <button style={btn} onClick={hireAllCrew}>招募全部 {CREW.length} 位船员</button>
      <button style={btn} onClick={visitAllCities}>到访全部 {CITIES.length} 城</button>
      <button style={btn} onClick={maxStats}>统计拉满（里程/交易/事件）</button>
      <button style={btn} onClick={tradeAllGoods}>买过卖过全部商品</button>
      <button style={btn} onClick={claimAll}>一键领取全部可领奖励</button>

      {group('船只 / 装备')}
      <button style={btn} onClick={unlockAllShips}>解锁全部船只</button>
      <button style={btn} onClick={switchToLegendShip}>换成传奇宝船</button>
      <button style={btn} onClick={giveAllEquipAndSupply}>全部船具 + 补给 + 情报</button>

      {group('声望 / 投资')}
      <button style={btn} onClick={maxRep}>各港声望拉满</button>
      <button style={btn} onClick={maxInvest}>各港投资 3 级</button>

      {group('时间')}
      <button style={btn} onClick={() => fastForward(60)}>快进 60 秒</button>
      <button style={btn} onClick={() => fastForward(600)}>快进 10 分钟</button>

      {group('危险操作')}
      <button
        style={{ ...btn, background: '#fff0ec', border: '1px solid #f0c0b4', color: '#c05050' }}
        onClick={() => { if (confirm('清空存档重新开始？')) reset() }}
      >清空存档重来</button>

      <div style={{ fontSize: 10, color: '#b09868', marginTop: 8, lineHeight: 1.5 }}>
        当前：{state.money.toLocaleString()} 金 · 船员 {state.hiredCrew.length} · 委托 {state.crewQuestsClaimed.length}/{CREW_QUESTS.length}
      </div>
    </div>
  )
}
