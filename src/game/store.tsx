import {
  createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode,
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

/** 把一段存档 JSON 文本编码为 URL 安全 base64（UTF-8 安全）
 *  v2 紧凑格式：去掉 log/toasts、markets/cargo 数字串化、紧凑单字母 key
 *  体积比直接 base64 小 70%+，便于手机一次性复制
 */
export function encodeSaveToUrl(json: string): string {
  let text = json
  try {
    const state = JSON.parse(json)
    if (state && typeof state === 'object' && state.markets) {
      text = JSON.stringify(compactForUrl(state))
    }
  } catch { /* parse 失败就用原文 */ }
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** 把 URL 里的 base64 片段（或完整 URL）解码回完整 state JSON；解析失败返回 null
 *  自动识别 v2 紧凑格式 / 兼容老格式
 */
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
    if (!parsed || typeof parsed !== 'object') return null
    // v2 紧凑格式：还原完整 state 再返回
    if (parsed.v === 2) {
      const full = expandFromUrl(parsed)
      if (!isValidSave(full)) return null
      return JSON.stringify(full)
    }
    // 兼容老格式
    if (!isValidSave(parsed)) return null
    return json
  } catch {
    return null
  }
}

// ── v2 紧凑格式 ────────────────────────────────────────────────────────
// 把 GameState 压缩为最小 URL 友好的对象（体积估算 5000→1100 字节，base64 ~1500 字符）

function compactForUrl(state: any) {
  // 压缩 markets —— 90 条 {price,stock,momentum,spike} → "p,s,m,sp" 字符串
  const mk: Record<string, Record<string, string>> = {}
  for (const cid of Object.keys(state.markets || {})) {
    const cm: Record<string, string> = {}
    const cityMarket = state.markets[cid] || {}
    for (const gid of Object.keys(cityMarket)) {
      const m = cityMarket[gid]
      cm[gid] = `${Math.round(m.price)},${Math.round(m.stock)},${(+m.momentum).toFixed(2)},${(+m.spike).toFixed(2)}`
    }
    mk[cid] = cm
  }
  // 压缩 cargo —— {qty,cost} → "qty,cost"
  const ca: Record<string, string> = {}
  for (const gid of Object.keys(state.cargo || {})) {
    const c = state.cargo[gid]
    ca[gid] = `${c.qty | 0},${Math.round(c.cost)}`
  }
  // stats 5 个数字逗号拼接
  const st0 = state.stats || { trades: 0, profit: 0, distance: 0, events: 0, best: 0 }
  const st = `${st0.trades | 0},${Math.round(st0.profit)},${st0.distance | 0},${st0.events | 0},${Math.round(st0.best)}`
  // aiShips: "id:t;id:t"
  const ai = (state.aiShips || []).map((a: any) => `${a.id}:${Math.floor(a.t)}`).join(';')
  // voyage: 4 字段逗号拼接，无则空串
  const vo = state.voyage
    ? `${state.voyage.from},${state.voyage.to},${Math.round(state.voyage.startedAt)},${state.voyage.duration | 0}`
    : ''
  return {
    v: 2,
    m: Math.round(state.money),
    c: state.cityId,
    s: state.shipId,
    o: (state.ownedShips || []).join(','),
    b: state.boost | 0,
    f: state.intelOwned ? 1 : 0,
    vi: (state.visited || []).join(','),
    cl: (state.claimed || []).join(','),
    st,
    ai,
    mk,
    ca,
    vo,
    ck: Math.round(state.clock || 0),
    mt: Math.round(state.marketTimer || 0),
    sp: Math.round(state.spiceTimer || 0),
    et: Math.round(state.eventTimer || 0),
    sq: state.seq | 0,
  }
}

function expandFromUrl(c: any): any {
  // 还原 markets —— "p,s,m,sp" → {price,stock,momentum,spike}
  const markets: Record<string, Record<string, any>> = {}
  for (const cid of Object.keys(c.mk)) {
    const cm: Record<string, any> = {}
    for (const gid of Object.keys(c.mk[cid])) {
      const parts = c.mk[cid][gid].split(',')
      cm[gid] = {
        price: +parts[0],
        stock: +parts[1],
        momentum: +(parts[2] || 0),
        spike: +(parts[3] || 0),
      }
    }
    markets[cid] = cm
  }
  // 还原 cargo
  const cargo: Record<string, any> = {}
  for (const gid of Object.keys(c.ca)) {
    const parts = c.ca[gid].split(',')
    cargo[gid] = { qty: +parts[0], cost: +(parts[1] || 0) }
  }
  // 还原 stats
  const stParts = (c.st || '0,0,0,0,0').split(',')
  const stats = {
    trades: +stParts[0],
    profit: +stParts[1],
    distance: +stParts[2],
    events: +stParts[3],
    best: +stParts[4],
  }
  // 还原 aiShips
  const aiShips = c.ai
    ? c.ai.split(';').map((s: string) => { const [id, t] = s.split(':'); return { id, t: +(t || 0) } })
    : []
  // 还原 voyage
  let voyage: any = null
  if (c.vo) {
    const parts = c.vo.split(',')
    voyage = { from: parts[0], to: parts[1], startedAt: +(parts[2] || 0), duration: +(parts[3] || 0) }
  }
  return {
    money: c.m,
    cityId: c.c,
    shipId: c.s,
    ownedShips: c.o ? c.o.split(',') : [],
    boost: c.b,
    intelOwned: c.f === 1,
    visited: c.vi ? c.vi.split(',') : [],
    claimed: c.cl ? c.cl.split(',') : [],
    stats,
    aiShips,
    markets,
    cargo,
    voyage,
    clock: c.ck,
    marketTimer: c.mt,
    spiceTimer: c.sp,
    eventTimer: c.et,
    seq: c.sq,
    // 不存的字段 —— 给默认值（log 用初始欢迎语；toasts 清空）
    toasts: [],
    log: [{ id: 1, t: 0, text: '你在中国的港口接过了第一艘商船，远洋贸易开始了。', kind: 'info' }],
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
  // 注意：TICK 每 200ms 触发，state 频繁变化。若 timeout 设为 500ms 会被 TICK 反复清掉、永远到不了，
  // 导致 localStorage 永远空、导出链也只是初始状态。这里 timeout 设 1500ms，并在 cleanup 兜底写一次。
  const lastWrittenRef = useRef<string>('')
  useEffect(() => {
    const write = () => {
      try {
        const snap = JSON.stringify(state)
        if (snap === lastWrittenRef.current) return
        lastWrittenRef.current = snap
        localStorage.setItem(SAVE_KEY, snap)
      } catch {
        /* 隐私模式下可能不可写，忽略 */
      }
    }
    const id = window.setTimeout(write, 1500)
    return () => {
      window.clearTimeout(id)
      write() // 兜底：若被频繁 TICK 清掉、timeout 还没触发，cleanup 时先写一次
    }
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
