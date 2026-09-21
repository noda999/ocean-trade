// ─────────────────────────────────────────────────────────────────────────────
//  存档（单槽 · localStorage）
//  设计原则：
//   1. 只用一个 key，整局状态序列化成一段 JSON（几 KB，远低于配额）
//   2. 所有读写都包 try/catch —— 小工具环境可能禁用存储或配额已满，失败就静默降级（当无存档）
//   3. key 里带版本号，数据结构大改时换个 key，旧档自然失效，不做迁移
//   4. 读到脏数据不崩：校验失败直接丢弃，回到新开局
// ─────────────────────────────────────────────────────────────────────────────

import { CITIES, CITY_BY_ID, SHIPS } from './data'
import { initialState, type GameState } from './state'

const SAVE_KEY = 'ocean-trade-save-v1'
const SAVE_VERSION = 1

/** 存档里不放瞬时数据：toasts 是几秒就消失的提示气泡 */
type SavedGame = Omit<GameState, 'toasts'>

interface SavePayload {
  v: number
  savedAt: number
  state: SavedGame
}

/** 基本结构校验：只认关键字段，防止脏数据导致渲染白屏 */
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

/** 把存档补齐成完整 state：缺的字段用初始值兜底，非法船 id 换成初始船 */
function sanitize(raw: any): GameState | null {
  if (!isValidSave(raw)) return null
  const base = initialState()
  const shipId = SHIPS.some(s => s.id === raw.shipId) ? raw.shipId : base.shipId
  const owned = Array.isArray(raw.ownedShips)
    ? raw.ownedShips.filter((id: unknown) => SHIPS.some(s => s.id === id))
    : []
  const strList = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])

  return {
    ...base,
    ...raw,
    shipId,
    ownedShips: owned.includes(shipId) ? owned : [...owned, shipId],
    hiredCrew: strList(raw.hiredCrew),
    goodsBought: strList(raw.goodsBought),
    goodsSold: strList(raw.goodsSold),
    claimed: strList(raw.claimed),
    visited: strList(raw.visited).length ? strList(raw.visited) : [raw.cityId],
    stats: { ...base.stats, ...(raw.stats ?? {}) },
    toasts: [],
    log: Array.isArray(raw.log) ? raw.log.slice(0, 40) : base.log,
  }
}

/** 读档；没有 / 坏了 / 存储不可用 都返回 null */
export function loadSave(): { state: GameState; savedAt: number } | null {
  try {
    const text = localStorage.getItem(SAVE_KEY)
    if (!text) return null
    const payload = JSON.parse(text) as SavePayload
    if (!payload || payload.v !== SAVE_VERSION) return null
    const state = sanitize(payload.state)
    if (!state) return null
    return { state, savedAt: Number(payload.savedAt) || 0 }
  } catch {
    return null
  }
}

/** 写档；成功返回时间戳，失败返回 null（配额满 / 存储被禁用） */
export function saveGame(state: GameState): number | null {
  try {
    const savedAt = Date.now()
    const persisted: SavedGame = { ...state, toasts: [] } as SavedGame
    const payload: SavePayload = { v: SAVE_VERSION, savedAt, state: persisted }
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
    return savedAt
  } catch {
    return null
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    /* 存储不可用，忽略 */
  }
}

/** 存档时间的人话描述 */
export function agoLabel(savedAt: number): string {
  if (!savedAt) return '尚未存档'
  const sec = Math.max(0, Math.floor((Date.now() - savedAt) / 1000))
  if (sec < 5) return '刚刚'
  if (sec < 60) return `${sec} 秒前`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} 分钟前`
  const hour = Math.floor(min / 60)
  if (hour < 24) return `${hour} 小时前`
  return `${Math.floor(hour / 24)} 天前`
}
