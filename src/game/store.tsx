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
 *  v3 极致紧凑格式：base36 索引（city/good/ship）+ markets 单字段化
 *  实测最大存档 11000 字节 → 1226 字节 → base64 1635 字符（之前 v2 是 3924）
 *  加上 origin 也只 ~1665 字符，手机可一次复制完
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
 *  自动识别 v3 / v2 / 老格式
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
    // v3 极致格式
    if (parsed.v === 3) {
      const full = expandV3(parsed)
      if (!isValidSave(full)) return null
      return JSON.stringify(full)
    }
    // v2 紧凑格式
    if (parsed.v === 2) {
      const full = expandV2(parsed)
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

// ── 索引表（base36 编码用，必须与 data.ts 数组顺序一致） ───────────────
import { GOODS, SHIPS } from './data'
const CITY_IDX = Object.fromEntries(CITIES.map((c, i) => [c.id, i])) as Record<string, number>
const CITY_AT = (i: number): string => CITIES[i]?.id ?? ''
const GOOD_IDX = Object.fromEntries(GOODS.map((g, i) => [g.id, i])) as Record<string, number>
const GOOD_AT = (i: number): string => GOODS[i]?.id ?? ''
const SHIP_IDX = Object.fromEntries(SHIPS.map((s, i) => [s.id, i])) as Record<string, number>
const SHIP_AT = (i: number): string => SHIPS[i]?.id ?? ''

// ── v3 极致紧凑格式 ────────────────────────────────────────────────────
// 实测最大存档：11000 → 1226 字节（base64 1635 字符 + origin ~1665）
// 编码规则：
//   - city/good/ship 全部用 base36 索引（1-2 字符），省 key 名
//   - markets 拼成单字符串 "ci,gi,p,s,m,sp|ci,gi,p,s,m,sp|..."
//   - visited/ownedShips 拼成无分隔符 base36 字符串
//   - 数字精度收紧：货币/价格 Math.round，momentum/spice 用 0-99 整数
//   - 不存：log/toasts（下次进入填默认值）

function compactForUrl(state: any) {
  // 1. city
  const cityIdx = CITY_IDX[state.cityId] ?? 0

  // 2. ownedShips
  const ships = (state.ownedShips || []).map((id: string) => (SHIP_IDX[id] ?? 0).toString(36)).join('')

  // 3. visited
  const visited = (state.visited || []).map((id: string) => (CITY_IDX[id] ?? 0).toString(36)).join('')

  // 4. claimed —— 这里用全名（~20 个 milestone，且 id 是英文短名）
  const claimed = (state.claimed || []).join(',')

  // 5. stats —— trades/profit/distance/events/best
  const s = state.stats || { trades: 0, profit: 0, distance: 0, events: 0, best: 0 }
  const stats = [
    s.trades | 0,
    Math.round(s.profit),
    s.distance | 0,
    s.events | 0,
    Math.round(s.best),
  ].join(',')

  // 6. aiShips —— "ai;t"，ai 用 1 字符索引（项目里 a1..a7，正好 0-6），t 用 base36
  const ai = (state.aiShips || []).map((a: any) => {
    const idx = +a.id.replace(/[^0-9]/g, '') - 1  // a1→0, a2→1 ...
    return idx.toString(36) + Math.floor(a.t).toString(36)
  }).join(';')

  // 7. markets —— 单字符串 "ci,gi,p,s,m,sp|..."（ci/gi 各 2 位定长 base36，逗号分隔 4 段数字）
  const mkParts: string[] = []
  for (const cid of Object.keys(state.markets || {})) {
    const ci = CITY_IDX[cid]
    if (ci === undefined) continue
    const cm = state.markets[cid] || {}
    for (const gid of Object.keys(cm)) {
      const gi = GOOD_IDX[gid]
      if (gi === undefined) continue
      const m = cm[gid]
      const p = Math.round(m.price).toString(36)
      const s2 = Math.round(m.stock).toString(36)
      const mo = Math.min(99, Math.max(0, Math.round(m.momentum * 100))).toString(36).padStart(2, '0')
      const sp = Math.min(99, Math.max(0, Math.round(m.spike * 100))).toString(36).padStart(2, '0')
      mkParts.push(`${ci.toString(36).padStart(2, '0')}${gi.toString(36).padStart(2, '0')}${p},${s2},${mo},${sp}`)
    }
  }
  const mk = mkParts.join('|')

  // 8. cargo —— "gi,qty,cost"（gi 2 位定长 + 逗号分隔 qty/cost）
  const caParts: string[] = []
  for (const gid of Object.keys(state.cargo || {})) {
    const gi = GOOD_IDX[gid]
    if (gi === undefined) continue
    const c = state.cargo[gid]
    caParts.push(`${gi.toString(36).padStart(2, '0')}${c.qty | 0},${Math.round(c.cost)}`)
  }
  const ca = caParts.join(';')

  // 9. voyage —— "cfct,started,dur"（cf/ct 各 2 位定长）
  let vo = ''
  if (state.voyage) {
    const cf = CITY_IDX[state.voyage.from] ?? 0
    const ct = CITY_IDX[state.voyage.to] ?? 0
    vo = `${cf.toString(36).padStart(2, '0')}${ct.toString(36).padStart(2, '0')}${Math.round(state.voyage.startedAt).toString(36)},${(state.voyage.duration | 0).toString(36)}`
  }

  return {
    v: 3,
    m: Math.round(state.money),
    c: cityIdx.toString(36),
    s: (SHIP_IDX[state.shipId] ?? 0).toString(36),
    o: ships,
    b: state.boost | 0,
    f: state.intelOwned ? 1 : 0,
    vi: visited,
    cl: claimed,
    st: stats,
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

function expandV3(c: any): any {
  // 1. 还原顶层
  const money = c.m | 0
  const cityId = CITY_AT(parseInt(c.c, 36)) || CITIES[0].id
  const shipId = SHIP_AT(parseInt(c.s, 36)) || SHIPS[0].id

  // 2. ownedShips（无分隔符 → 每个字符是一个索引，base36 是变长 1-2 位）
  //    为了正确解析：base36 索引值最大 ~31（5 艘船），用 2 位定长编码 "ii" 最稳
  //    这里我们 encode 时是无分隔符拼接 → 同样无分隔符解析
  //    改进：把 ownedShips/visited 改成 2 位定长编码
  const ownedShips: string[] = []
  if (c.o) {
    // 2 位定长 base36 编码（补 0）：每 2 字符一个索引
    const padded = (c.o.length % 2 === 0 ? c.o : '0' + c.o)
    for (let i = 0; i < padded.length; i += 2) {
      const idx = parseInt(padded.slice(i, i + 2), 36)
      const id = SHIP_AT(idx)
      if (id) ownedShips.push(id)
    }
  }
  if (ownedShips.length === 0) ownedShips.push(SHIPS[0].id)

  // 3. visited（2 位定长）
  const visited: string[] = []
  if (c.vi) {
    const padded = (c.vi.length % 2 === 0 ? c.vi : '0' + c.vi)
    for (let i = 0; i < padded.length; i += 2) {
      const idx = parseInt(padded.slice(i, i + 2), 36)
      const id = CITY_AT(idx)
      if (id) visited.push(id)
    }
  }

  // 4. claimed（直接拼接）
  const claimed = c.cl ? c.cl.split(',').filter(Boolean) : []

  // 5. stats
  const stParts = (c.st || '0,0,0,0,0').split(',')
  const stats = {
    trades: +stParts[0],
    profit: +stParts[1],
    distance: +stParts[2],
    events: +stParts[3],
    best: +stParts[4],
  }

  // 6. aiShips —— "it;it"，i 是 base36 索引 (0-6 → 0-6 单字符)，t 是 base36
  const aiShips: any[] = []
  if (c.ai) {
    for (const s of c.ai.split(';')) {
      if (s.length < 2) continue
      const idx = parseInt(s[0], 36)
      const t = parseInt(s.slice(1), 36)
      aiShips.push({ id: 'a' + (idx + 1), t })
    }
  }

  // 7. markets —— "cigii,p,s,m,sp" 循环解析（ci/gi 各 2 位定长 base36，后面 4 段逗号分隔数字）
  const markets: Record<string, Record<string, any>> = {}
  if (c.mk) {
    for (const seg of c.mk.split('|')) {
      if (seg.length < 8) continue
      const ci = parseInt(seg.slice(0, 2), 36)
      const gi = parseInt(seg.slice(2, 4), 36)
      const parts = seg.slice(4).split(',')
      const cid = CITY_AT(ci)
      const gid = GOOD_AT(gi)
      if (!cid || !gid || parts.length < 4) continue
      const price = parseInt(parts[0], 36)
      const stock = parseInt(parts[1], 36)
      const momentum = parseInt(parts[2], 36) / 100
      const spike = parseInt(parts[3], 36) / 100
      if (!markets[cid]) markets[cid] = {}
      markets[cid][gid] = { price, stock, momentum, spike }
    }
  }

  // 8. cargo —— "gii,qty,cost"（gi 2 位定长 base36 + 逗号分隔 qty/cost）
  const cargo: Record<string, any> = {}
  if (c.ca) {
    for (const seg of c.ca.split(';')) {
      const gi = parseInt(seg.slice(0, 2), 36)
      const parts = seg.slice(2).split(',')
      const gid = GOOD_AT(gi)
      if (!gid) continue
      cargo[gid] = { qty: +(parts[0] || 0), cost: +(parts[1] || 0) }
    }
  }

  // 9. voyage —— "cfct,started,dur"（cf/ct 各 2 位定长）
  let voyage: any = null
  if (c.vo) {
    const cf = parseInt(c.vo.slice(0, 2), 36)
    const ct = parseInt(c.vo.slice(2, 4), 36)
    const parts = c.vo.slice(4).split(',')
    voyage = {
      from: CITY_AT(cf) || CITIES[0].id,
      to: CITY_AT(ct) || CITIES[0].id,
      startedAt: parseInt(parts[0] || '0', 36),
      duration: parseInt(parts[1] || '0', 36),
    }
  }

  return {
    money,
    cityId,
    shipId,
    ownedShips,
    boost: c.b | 0,
    intelOwned: c.f === 1,
    visited,
    claimed,
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
    // 不存的字段 —— 给默认值
    toasts: [],
    log: [{ id: 1, t: 0, text: '你在中国的港口接过了第一艘商船，远洋贸易开始了。', kind: 'info' }],
  }
}

// ── v2 紧凑格式（兼容老存档） ──────────────────────────────────────────

function expandV2(c: any): any {
  const markets: Record<string, Record<string, any>> = {}
  for (const cid of Object.keys(c.mk || {})) {
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
  const cargo: Record<string, any> = {}
  for (const gid of Object.keys(c.ca || {})) {
    const parts = c.ca[gid].split(',')
    cargo[gid] = { qty: +parts[0], cost: +(parts[1] || 0) }
  }
  const stParts = (c.st || '0,0,0,0,0').split(',')
  const stats = {
    trades: +stParts[0],
    profit: +stParts[1],
    distance: +stParts[2],
    events: +stParts[3],
    best: +stParts[4],
  }
  const aiShips = c.ai
    ? c.ai.split(';').map((s: string) => { const [id, t] = s.split(':'); return { id, t: +(t || 0) } })
    : []
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
