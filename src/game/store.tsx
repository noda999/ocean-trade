import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState,
  type ReactNode,
} from 'react'
import { assetsOf, initialState, reducer, type Action, type GameState } from './state'
import { clearSave, loadSave, saveGame } from './save'

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<Action>
  /** 当前总资产 */
  assets: number
  /** 重新开始（清掉当前 state + 清空存档） */
  reset: () => void
  /** 手动存档，成功返回时间戳，失败返回 null */
  save: () => number | null
  /** 用存档覆盖当前进度，成功返回 true */
  loadFromSave: () => boolean
  /** 删除存档（不动当前进度） */
  removeSave: () => void
  /** 最近一次存档时间戳（null = 本局还没存过） */
  lastSaved: number | null
}

const GameContext = createContext<GameContextValue | null>(null)

const TICK_MS = 200
/** 自动存档间隔：TICK 是 200ms 一跳，不能每跳都写盘 */
const SAVE_EVERY_MS = 3000

/** 启动：有可用存档就用存档，否则新开局 */
function boot(): { state: GameState; savedAt: number | null } {
  const save = loadSave()
  return save
    ? { state: save.state, savedAt: save.savedAt || null }
    : { state: initialState(), savedAt: null }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const booted = useMemo(boot, [])
  const [state, dispatch] = useReducer(reducer, booted.state)
  const [lastSaved, setLastSaved] = useState<number | null>(booted.savedAt)

  // 游戏主循环：200ms 一跳
  useEffect(() => {
    const id = window.setInterval(() => {
      dispatch({ type: 'TICK', dt: TICK_MS / 1000 })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  // ── 自动存档 ────────────────────────────────────────────────────────────────
  const lastSaveRef = useRef(booted.savedAt ?? 0)
  const stateRef = useRef(state)
  stateRef.current = state

  const flush = useCallback((): number | null => {
    const at = saveGame(stateRef.current)
    if (at) {
      lastSaveRef.current = at
      setLastSaved(at)
    }
    return at
  }, [])

  // 状态变化时节流写盘（每隔 SAVE_EVERY_MS 最多写一次）
  useEffect(() => {
    if (Date.now() - lastSaveRef.current < SAVE_EVERY_MS) return
    flush()
  }, [state, flush])

  // 切后台 / 离开页面：立刻补写一次（webview 被挂起时这是最后的落盘机会）
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('pagehide', flush)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('pagehide', flush)
    }
  }, [flush])

  const assets = assetsOf(state)

  const reset = useCallback(() => {
    clearSave()
    lastSaveRef.current = 0
    setLastSaved(null)
    dispatch({ type: 'RESTART' })
  }, [])

  const loadFromSave = useCallback(() => {
    const save = loadSave()
    if (!save) return false
    lastSaveRef.current = save.savedAt || 0
    setLastSaved(save.savedAt || null)
    dispatch({ type: 'HYDRATE', state: save.state })
    return true
  }, [])

  const removeSave = useCallback(() => {
    clearSave()
    lastSaveRef.current = 0
    setLastSaved(null)
  }, [])

  const value = useMemo<GameContextValue>(() => ({
    state,
    dispatch,
    assets,
    reset,
    save: flush,
    loadFromSave,
    removeSave,
    lastSaved,
  }), [state, assets, reset, flush, loadFromSave, removeSave, lastSaved])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame 必须在 GameProvider 内使用')
  return ctx
}
