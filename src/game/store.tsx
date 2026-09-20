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
    // ① 优先读 URL 上的 ?save= 存档链接（玩家从小红书私信/收藏里点回来的场景）
    const fromUrl = readUrlSave()
    if (fromUrl) {
      // 写入 localStorage 持久化，然后清掉 URL 参数避免刷新重复载入
      try { localStorage.setItem(SAVE_KEY, fromUrl) } catch { /* ignore */ }
      try {
        const u = new URL(window.location.href)
        u.searchParams.delete('save')
        window.history.replaceState({}, '', u.toString())
      } catch { /* ignore */ }
      const parsed = JSON.parse(fromUrl) as GameState
      if (isValidSave(parsed)) return { ...parsed, toasts: [] }
    }
    // ② 读 localStorage 里的存档
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return initialState()
    const saved = JSON.parse(raw) as GameState
    if (!isValidSave(saved)) return initialState()
    return { ...saved, toasts: [] }
  } catch {
    return initialState()
  }
}

/** 严格的存档结构校验 —— 字段不全 / 城市对不上 / markets 不齐都拒绝 */
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

/** 从 URL ?save=xxx 提取存档文本，校验后返回 JSON 字符串；格式不对返回 null */
function readUrlSave(): string | null {
  try {
    const u = new URL(window.location.href)
    const enc = u.searchParams.get('save')
    if (!enc) return null
    // 容错：去掉可能的换行/空格
    const clean = enc.replace(/\s+/g, '')
    if (!clean) return null
    // base64 → UTF-8 JSON
    const bin = atob(clean)
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
    const json = new TextDecoder('utf-8').decode(bytes)
    // 校验能 parse 且结构合法
    const parsed = JSON.parse(json)
    if (!isValidSave(parsed)) return null
    return json
  } catch {
    return null
  }
}

/** 把一段存档 JSON 文本编码为 URL 安全 base64（UTF-8 安全） */
export function encodeSaveToUrl(json: string): string {
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** 把 URL 里的 base64 片段（或完整 URL）解码回 JSON 文本；解析失败返回 null */
export function decodeSaveFromUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  // 如果玩家粘了完整 URL，先抠出 ?save= 后面的部分
  let enc = trimmed
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const u = new URL(trimmed)
      const v = u.searchParams.get('save')
      if (v) enc = v
    }
  } catch { /* 不是 URL，按纯 base64 处理 */ }
  // URL 安全 base64 → 标准 base64
  const std = enc.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - enc.length % 4) % 4)
  try {
    const bin = atob(std)
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
    const json = new TextDecoder('utf-8').decode(bytes)
    const parsed = JSON.parse(json)
    if (!isValidSave(parsed)) return null
    return json
  } catch {
    return null
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
