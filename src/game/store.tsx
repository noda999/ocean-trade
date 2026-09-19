import {
  createContext, useContext, useEffect, useMemo, useReducer, type ReactNode,
} from 'react'
import { CITIES, CITY_BY_ID } from './data'
import { assetsOf, initialState, reducer, type Action, type GameState } from './state'

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<Action>
  /** 当前总资产 */
  assets: number
  /** 清空存档并重开 */
  reset: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

const TICK_MS = 200
/** v2：城市/商品/市场结构大改（15 港 · 分区特产），旧存档自动作废 */
const SAVE_KEY = 'ocean-trade-save-v2'

/** 读取存档；结构不兼容时安全回退到新游戏，避免白屏 */
function loadSaved(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return initialState()
    const saved = JSON.parse(raw) as GameState
    const ok = saved
      && typeof saved.money === 'number'
      && typeof saved.cityId === 'string'
      && !!CITY_BY_ID[saved.cityId]
      && saved.markets
      // 市场必须覆盖全部城市，且每城至少挂着它经营的货物（防旧结构/半写入存档）
      && CITIES.every(c => saved.markets[c.id]
        && c.exports.every(g => saved.markets[c.id][g])
        && c.imports.every(g => saved.markets[c.id][g]))
      && saved.cargo
      && Array.isArray(saved.aiShips)
      && Array.isArray(saved.visited)
    if (!ok) return initialState()
    return { ...saved, toasts: [] }
  } catch {
    return initialState()
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadSaved)

  // 游戏主循环：200ms 一跳
  useEffect(() => {
    const id = window.setInterval(() => {
      dispatch({ type: 'TICK', dt: TICK_MS / 1000 })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  // 自动存档（去抖，避免每个 tick 都写 localStorage）
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state))
      } catch {
        /* 隐私模式下可能不可写，忽略 */
      }
    }, 500)
    return () => window.clearTimeout(id)
  }, [state])

  const assets = assetsOf(state)

  const value = useMemo<GameContextValue>(() => ({
    state,
    dispatch,
    assets,
    reset: () => {
      try { localStorage.removeItem(SAVE_KEY) } catch { /* ignore */ }
      dispatch({ type: 'RESTART' })
    },
  }), [state, assets])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame 必须在 GameProvider 内使用')
  return ctx
}
