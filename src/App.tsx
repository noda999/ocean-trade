import { Component, useEffect, useMemo, useState, type ErrorInfo, type ReactNode } from 'react'
import { CREW_QUESTS, LEGENDS, MILESTONES, seasonOf } from './game/data'
import { shipOf } from './game/engine'
import { claimable, crewQuestClaimable, legendClaimable } from './game/state'
import { GameProvider, useGame } from './game/store'
import MarketView from './views/MarketView'
import CargoView from './views/CargoView'
import DockView from './views/DockView'
import QuestView from './views/QuestView'
import MapView from './views/MapView'
import IntelView from './views/IntelView'
import OnboardingTour from './components/OnboardingTour'
import ChangelogModal from './components/ChangelogModal'
import PirateModal from './components/PirateModal'
import VictoryModal from './components/VictoryModal'
import DebugPanel from './components/DebugPanel'
import SettingsModal from './components/SettingsModal'
import SoundLayer from './components/SoundLayer'
import { Glyph, type GlyphName } from './components/Glyph'
import { audio } from './game/audio'

type Tab = 'map' | 'market' | 'cargo' | 'dock' | 'quest'

const NAV: { id: Tab; icon: GlyphName; label: string; emoji?: string }[] = [
  { id: 'map', icon: 'map', label: '地图' },
  { id: 'market', icon: 'market', label: '市场' },
  { id: 'cargo', icon: 'box', label: '货舱' },
  { id: 'dock', icon: 'anchor', label: '船坞' },
  // 功勋：用 emoji 奖杯替代 SVG 图标
  { id: 'quest', icon: 'trophy', label: '功勋', emoji: '🏆' },
]

function clockFmt(sec: number) {
  const s = Math.max(0, Math.floor(sec))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function TopBar({ onIntel, onSettings }: { onIntel: () => void; onSettings: () => void }) {
  const { state } = useGame()
  const ship = shipOf(state.shipId)

  return (
    <div className="top-bar relative z-30 px-3 pb-2" style={{ background: 'linear-gradient(180deg,#2f9ec9,#4fb8dc)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.25)' }}>
          <Glyph name="compass" size={22} color="#fff" />
        </div>
        <div className="app-title">远洋贸易</div>
        {(() => {
          const season = seasonOf(state.clock)
          return (
            <div
              className="text-[10px] font-800 px-1.5 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.22)', color: 'white', whiteSpace: 'nowrap', flexShrink: 0 }}
              title={`${season.name}｜${season.desc}`}
            >
              <Glyph name={season.icon} size={14} />
            </div>
          )
        })()}
        <div className="ml-auto flex items-center gap-1.5">
          <div className="stat-pill">
            <Glyph name="coin" size={16} color="#a07030" />
            <span className="font-900 text-xs" style={{ color: '#3d2b10' }}>{Math.floor(state.money).toLocaleString()}</span>
          </div>
          <button className="top-icon-btn" onClick={() => { audio.sfx('click'); onIntel() }} title="情报网络"><Glyph name="spyglass" size={24} /></button>
          <button className="top-icon-btn" onClick={() => { audio.sfx('click'); onSettings() }} title="存档设置"><Glyph name="gear" size={24} /></button>
        </div>
      </div>

      <div className="panel-white px-3 py-2">
        <div className="flex items-center gap-3 text-xs" style={{ color: '#a07030' }}>
          <span className="inline-flex items-center gap-1">
            <Glyph name="crate" size={18} />货物库存刷新: <b style={{ color: '#8a6a40' }}>{clockFmt(state.marketTimer)}</b>
          </span>
          <span className="ml-auto inline-flex items-center gap-1">
            <Glyph name="trendUp" size={22} />紧缺行情刷新: <b style={{ color: '#8a6a40' }}>{clockFmt(state.spiceTimer)}</b>
          </span>
        </div>
        <div className="text-xs mt-1 inline-flex items-center gap-1" style={{ color: '#a07030' }}>
          <Glyph name={seasonOf(state.clock).icon} size={18} /><b style={{ color: '#8a6a40' }}>{seasonOf(state.clock).name}</b>
          {' · '}{seasonOf(state.clock).desc}
        </div>
      </div>
    </div>
  )
}

function Toasts() {
  const { state, dispatch } = useGame()
  return (
    <div
      className="absolute left-0 right-0 z-50 flex flex-col items-center gap-1.5 pointer-events-none"
      style={{ top: 8, padding: '0 12px' }}
    >
      {state.toasts.map(t => (
        <div
          key={t.id}
          className={`toast toast-${t.kind} pointer-events-auto`}
          onClick={() => dispatch({ type: 'DROP_TOAST', id: t.id })}
        >
          <Glyph name={t.icon} size={17} className="flex-shrink-0" />
          <span className="text-xs font-800">{t.text}</span>
        </div>
      ))}
    </div>
  )
}

function NavBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const { state, dispatch } = useGame()
  const cargoCount = Object.values(state.cargo).reduce((s, c) => s + c.qty, 0)
  const canClaim = useMemo(
    () => MILESTONES.some(m => claimable(state, m))
      || LEGENDS.some(l => legendClaimable(state, l))
      || CREW_QUESTS.some(q => crewQuestClaimable(state, q)),
    [state],
  )
  void dispatch

  return (
    <div className="bottom-nav flex items-center justify-around flex-shrink-0" style={{ paddingBottom: 4 }}>
      {NAV.map(n => {
        const active = tab === n.id
        const badge = n.id === 'cargo' ? cargoCount : 0
        const dot = n.id === 'quest' && canClaim
        return (
          <button
            key={n.id}
            className={`nav-btn relative flex-1 ${active ? 'active' : ''}`}
            onClick={() => { audio.sfx('click'); setTab(n.id) }}
          >
            {n.emoji
              ? <span style={{ fontSize: 19, lineHeight: '22px' }}>{n.emoji}</span>
              : <Glyph name={n.icon} size={22} />}
            <span>{n.label}</span>
            {badge > 0 && <span className="nav-badge">{badge}</span>}
            {dot && <span className="nav-dot" />}
          </button>
        )
      })}
    </div>
  )
}

/** 单个视图崩溃时显示原因，而不是整页白屏 */
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[远洋贸易] 渲染异常：', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="absolute inset-0 overflow-auto p-5" style={{ background: '#fff8f0' }}>
          <div className="panel-white p-4" style={{ borderRadius: 16 }}>
            <div className="font-900 text-base mb-2 inline-flex items-center gap-1.5" style={{ color: '#c05050' }}>
              <Glyph name="warn" size={18} />这个界面出错了
            </div>
            <div className="text-xs mb-3" style={{ color: '#8a6a40', wordBreak: 'break-all' }}>
              {String(this.state.error?.message ?? this.state.error)}
            </div>
            <div className="flex gap-2">
              <button
                className="btn-orange px-4 py-2 text-sm"
                style={{ borderRadius: 12 }}
                onClick={() => this.setState({ error: null })}
              >
                重试
              </button>
              <button
                className="btn-ghost-orange px-4 py-2 text-sm"
                style={{ borderRadius: 12 }}
                onClick={() => location.reload()}
              >
                重新加载
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function Game() {
  const [tab, setTab] = useState<Tab>('map')
  const [intelOpen, setIntelOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // 首个用户手势解锁 Web Audio 并启动 BGM（浏览器自动播放策略要求）
  useEffect(() => {
    const unlock = () => audio.unlock()
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'radial-gradient(circle at 50% 20%, #2b5e75 0%, #12242f 70%)' }}
    >
      <div className="app-shell">
        <TopBar onIntel={() => setIntelOpen(true)} onSettings={() => setSettingsOpen(true)} />
        <div className={"relative flex-1 overflow-hidden" + (intelOpen || settingsOpen ? " world-off" : "")}>
          <ErrorBoundary>
            {tab === 'map' && <MapView onOpenIntel={() => setIntelOpen(true)} />}
            {tab === 'market' && <MarketView />}
            {tab === 'cargo' && <CargoView />}
            {tab === 'dock' && <DockView />}
            {tab === 'quest' && <QuestView />}
            {intelOpen && <IntelView onClose={() => setIntelOpen(false)} />}
                    </ErrorBoundary>
                    {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
          <Toasts />
        </div>
        <NavBar tab={tab} setTab={setTab} />
        <OnboardingTour activeTab={tab} setActiveTab={t => setTab(t as Tab)} />
        <ChangelogModal />
        <PirateModal />
        <VictoryModal />
        {/* 调试面板：仅开发环境，生产构建（含小红书包）会被剔除 */}
        {import.meta.env.DEV && <DebugPanel />}
        {/* 声音层：订阅状态触发音效，无 UI */}
        <SoundLayer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  )
}
