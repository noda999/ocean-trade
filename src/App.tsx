import { Component, useMemo, useState, type ErrorInfo, type ReactNode } from 'react'
import { MILESTONES } from './game/data'
import { shipOf } from './game/engine'
import { claimable } from './game/state'
import { GameProvider, useGame } from './game/store'
import MarketView from './views/MarketView'
import CargoView from './views/CargoView'
import DockView from './views/DockView'
import QuestView from './views/QuestView'
import MapView from './views/MapView'
import IntelView from './views/IntelView'
import OnboardingTour from './components/OnboardingTour'
import ChangelogModal from './components/ChangelogModal'
import SettingsModal from './components/SettingsModal'

type Tab = 'map' | 'market' | 'cargo' | 'dock' | 'quest'

const NAV: { id: Tab; icon: string; label: string }[] = [
  { id: 'map', icon: '🗺️', label: '地图' },
  { id: 'market', icon: '🏪', label: '市场' },
  { id: 'cargo', icon: '📦', label: '货舱' },
  { id: 'dock', icon: '⚓', label: '船坞' },
  { id: 'quest', icon: '🏆', label: '功勋' },
]

function clockFmt(sec: number) {
  const s = Math.max(0, Math.floor(sec))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function TopBar({ onIntel, onSettings }: { onIntel: () => void; onSettings: () => void }) {
  const { state, assets } = useGame()
  const ship = shipOf(state.shipId)
  const rank = assets >= 12_000 ? Math.max(1, Math.round(680 - Math.log10(assets) * 78)) : null
  const nextTarget = MILESTONES.find(m => assets < m.target)?.target

  return (
    <div className="top-bar relative z-30 px-3 pb-2" style={{ background: 'linear-gradient(180deg,#2f9ec9,#4fb8dc)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(255,255,255,0.25)' }}>
          🧭
        </div>
        <div className="app-title">远洋贸易</div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="stat-pill">
            <span style={{ fontSize: 13 }}>🪙</span>
            <span className="font-900 text-xs" style={{ color: '#3d2b10' }}>{Math.floor(state.money).toLocaleString()}</span>
          </div>
          <button className="top-icon-btn" onClick={onIntel}>📡</button>
          <button className="top-icon-btn" onClick={onSettings} title="存档设置">⚙️</button>
        </div>
      </div>

      <div className="panel-white px-3 py-2">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs">🏆</span>
          <span className="font-900 text-xs" style={{ color: '#3d2b10' }}>{assets.toLocaleString()}</span>
          {nextTarget && (
            <span className="text-xs" style={{ color: '#c0a070' }}>/ {nextTarget.toLocaleString()}</span>
          )}
          <span className="ml-auto text-xs font-700" style={{ color: '#8a6a40' }}>
            个人排名: {rank ? `第 ${rank} 位` : '未上榜'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: '#a07030' }}>
          <span>🍱 货物库存刷新: <b style={{ color: '#8a6a40' }}>{clockFmt(state.marketTimer)}</b></span>
          <span className="ml-auto">📈 紧缺行情刷新: <b style={{ color: '#8a6a40' }}>{clockFmt(state.spiceTimer)}</b></span>
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
      style={{ top: 120, padding: '0 12px' }}
    >
      {state.toasts.map(t => (
        <div
          key={t.id}
          className={`toast toast-${t.kind} pointer-events-auto`}
          onClick={() => dispatch({ type: 'DROP_TOAST', id: t.id })}
        >
          <span className="text-base flex-shrink-0">{t.icon}</span>
          <span className="text-xs font-800">{t.text}</span>
        </div>
      ))}
    </div>
  )
}

function NavBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const { state, dispatch } = useGame()
  const cargoCount = Object.values(state.cargo).reduce((s, c) => s + c.qty, 0)
  const canClaim = useMemo(() => MILESTONES.some(m => claimable(state, m)), [state])
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
            onClick={() => setTab(n.id)}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{n.icon}</span>
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
            <div className="font-900 text-base mb-2" style={{ color: '#c05050' }}>⚠️ 这个界面出错了</div>
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

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'radial-gradient(circle at 50% 20%, #2b5e75 0%, #12242f 70%)' }}
    >
      <div className="app-shell">
        <TopBar onIntel={() => setIntelOpen(true)} onSettings={() => setSettingsOpen(true)} />
        <div className="relative flex-1 overflow-hidden">
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
        <OnboardingTour activeTab={tab} setActiveTab={setTab} />
        <ChangelogModal />
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
