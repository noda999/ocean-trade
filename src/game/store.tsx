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
  /** 重新开始（清掉当前 state，回到初始） */
  reset: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

const TICK_MS = 200

/** 严格校验 state 结构（防止渲染时炸白屏） */
function isValidSave(saved: any): saved is GameState {
  return !!saved
    && typeof saved.money === 'number'
    && typeof saved.cityId === 'string'
    && !!CITY_BY_ID[saved.cityId]
    && saved.markets
    && CITIES.every(c => saved.markets[c.id]
      && c.exports.every(g => saved.markets[c.id][g])
      && c.imports.every(g => saved.markets[c.id][g]))
    && saved.cargo
    && Array.isArray(saved.aiShips)
    && Array.isArray(saved.visited)
}

export function GameProvider({ children }: { children: ReactNode }) {
  // ⚠️ 当前版本：游戏无存档——每次刷新都是全新一局。
  // 玩家离开小红书 webview 后进度就丢失，属于已知体验限制。
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  // 游戏主循环：200ms 一跳
  useEffect(() => {
    const id = window.setInterval(() => {
      dispatch({ type: 'TICK', dt: TICK_MS / 1000 })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  const assets = assetsOf(state)

  const value = useMemo<GameContextValue>(() => ({
    state,
    dispatch,
    assets,
    reset: () => dispatch({ type: 'RESTART' }),
  }), [state, assets])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame 必须在 GameProvider 内使用')
  return ctx
}

// 保留 isValidSave 以便未来恢复存档功能时直接复用
export { isValidSave }