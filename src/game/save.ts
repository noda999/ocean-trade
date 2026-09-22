// ─────────────────────────────────────────────────────────────────────────────
//  存档（单槽 · localStorage）
//  设计原则：
//   1. 只用一个 key，整局状态序列化成一段 JSON（几 KB，远低于配额）
//   2. 所有读写都包 try/catch —— 小工具环境可能禁用存储或配额已满，失败就静默降级（当无存档）
//   3. key 里带版本号，数据结构大改时换个 key，旧档自然失效，不做迁移
//   4. 读到脏数据不崩：校验失败直接丢弃，回到新开局
// ─────────────────────────────────────────────────────────────────────────────

import { CITIES, CITY_BY_ID, EQUIP_BY_ID, GOOD_BY_ID, INVEST_LEVELS, MAP_FRAGS_NEED, ORDER_ACTIVE_MAX, ORDER_BOARD_MAX, PIRATE_BY_ID, REP_MAX, SHIPS, SUPPLY_BY_ID } from './data'
import { ensureMarkets, type CityEvent } from './engine'
import { initialState, type Bounty, type GameState, type TradeOrder } from './state'

const SAVE_KEY = 'ocean-trade-save-v1'
const SAVE_VERSION = 1

/** 存档里不放瞬时数据：toasts 是几秒就消失的提示气泡 */
type SavedGame = Omit<GameState, 'toasts'>

interface SavePayload {
  v: number
  savedAt: number
  state: SavedGame
}

/** 基本结构校验：只认关键字段，防止脏数据导致渲染白屏。
 *  注意：不校验每个进出口商品的市场条目——版本更新新增商品时由 sanitize 里的
 *  ensureMarkets 自动补齐，避免旧存档被误判为脏档而丢弃。 */
function isValidSave(saved: any): saved is GameState {
  return !!saved
    && typeof saved.money === 'number'
    && typeof saved.cityId === 'string'
    && !!CITY_BY_ID[saved.cityId]
    && saved.markets
    && CITIES.every(c => saved.markets[c.id])
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
  /** 声望对象：只留合法城市 id 和有限数字，夹到 [0, REP_MAX] */
  const repMap = (v: unknown): Record<string, number> => {
    const out: Record<string, number> = {}
    if (v && typeof v === 'object') {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (CITY_BY_ID[k] && typeof val === 'number' && Number.isFinite(val)) {
          out[k] = Math.max(0, Math.min(REP_MAX, Math.round(val)))
        }
      }
    }
    return out
  }
  /** 补给数量：只留合法补给 id，夹到 [0, 99] */
  const supplyMap = (v: unknown): Record<string, number> => {
    const out: Record<string, number> = {}
    if (v && typeof v === 'object') {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (SUPPLY_BY_ID[k] && typeof val === 'number' && Number.isFinite(val)) {
          out[k] = Math.max(0, Math.min(99, Math.round(val)))
        }
      }
    }
    return out
  }
  /** 船具：只留合法装备 id */
  const equipList = (v: unknown) =>
    (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])
      .filter(id => !!EQUIP_BY_ID[id])
  /** 商情事件：只留合法城市 / 类型 / 商品，until 必须是有限数字（v1.3.0） */
  const eventMap = (v: unknown): Record<string, CityEvent> => {
    const out: Record<string, CityEvent> = {}
    if (v && typeof v === 'object') {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (!CITY_BY_ID[k] || !val || typeof val !== 'object') continue
        const e = val as Record<string, unknown>
        const kind = e.kind
        const rawGood = typeof e.goodId === 'string' ? e.goodId : ''
        const until = e.until
        if ((kind !== 'boom' && kind !== 'shortage' && kind !== 'blockade')) continue
        // 封锁没有目标商品：强制清空，防止非法 goodId 在界面上被索引
        if (kind === 'blockade') {
          if (typeof until !== 'number' || !Number.isFinite(until) || until <= 0) continue
          out[k] = { kind, goodId: '', until: Math.round(until) }
          continue
        }
        if (!GOOD_BY_ID[rawGood]) continue
        if (typeof until !== 'number' || !Number.isFinite(until) || until <= 0) continue
        out[k] = { kind, goodId: rawGood, until: Math.round(until) }
      }
    }
    return out
  }
  /** 投资等级：0-3（v1.3.0） */
  const investMap = (v: unknown): Record<string, number> => {
    const out: Record<string, number> = {}
    if (v && typeof v === 'object') {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (!CITY_BY_ID[k] || typeof val !== 'number' || !Number.isFinite(val)) continue
        out[k] = Math.max(0, Math.min(INVEST_LEVELS.length, Math.round(val)))
      }
    }
    return out
  }
  /** 委托单：逐张校验字段 + 去重 + 数量封顶（v1.3.0） */
  const orderList = (v: unknown): TradeOrder[] => {
    if (!Array.isArray(v)) return []
    const out: TradeOrder[] = []
    const seen = new Set<string>()
    let taken = 0
    for (const x of v.slice(0, 12)) {
      if (!x || typeof x !== 'object') continue
      const o = x as Record<string, unknown>
      if (typeof o.id !== 'string' || typeof o.fromCity !== 'string' || typeof o.toCity !== 'string') continue
      if (typeof o.goodId !== 'string' || !CITY_BY_ID[o.fromCity] || !CITY_BY_ID[o.toCity] || !GOOD_BY_ID[o.goodId]) continue
      if (o.fromCity === o.toCity || seen.has(o.id)) continue
      const qty = Math.round(Number(o.qty))
      const reward = Math.round(Number(o.reward))
      const deadline = Number(o.deadline)
      if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(reward) || reward <= 0) continue
      if (!Number.isFinite(deadline) || deadline <= 0) continue
      const isTaken = o.taken === true
      // 进行中委托数量必须封顶，否则坏档会让玩家再也接不到新单
      if (isTaken) {
        if (taken >= ORDER_ACTIVE_MAX) continue
        taken += 1
      } else if (out.filter(y => !y.taken).length >= ORDER_BOARD_MAX) continue
      seen.add(o.id)
      out.push({ id: o.id, fromCity: o.fromCity, toCity: o.toCity, goodId: o.goodId, qty, reward, deadline, taken: isTaken })
    }
    return out
  }

  /** 海事悬赏（v1.4.0）：逐项校验，坏数据直接当无悬赏 */
  const bountyOf = (v: unknown): Bounty | null => {
    if (!v || typeof v !== 'object') return null
    const b = v as Record<string, unknown>
    if (typeof b.pirateId !== 'string' || !PIRATE_BY_ID[b.pirateId]) return null
    if (typeof b.cityId !== 'string' || !CITY_BY_ID[b.cityId]) return null
    const reward = Math.round(Number(b.reward))
    const deadline = Number(b.deadline)
    if (!Number.isFinite(reward) || reward <= 0) return null
    if (!Number.isFinite(deadline) || deadline <= 0) return null
    return { pirateId: b.pirateId, cityId: b.cityId, reward, deadline }
  }
  /** 藏宝图（v1.4.0）：碎片数夹紧；集齐但目标港非法 → 整图作废重新收集 */
  const digCity = typeof raw.digCity === 'string' && CITY_BY_ID[raw.digCity] ? raw.digCity : null
  let mapFrags = Math.max(0, Math.min(MAP_FRAGS_NEED, Math.round(Number(raw.mapFrags) || 0)))
  if (mapFrags >= MAP_FRAGS_NEED && !digCity) mapFrags = 0

  return {
    ...base,
    ...raw,
    shipId,
    ownedShips: owned.includes(shipId) ? owned : [...owned, shipId],
    hiredCrew: strList(raw.hiredCrew),
    goodsBought: strList(raw.goodsBought),
    goodsSold: strList(raw.goodsSold),
    claimed: strList(raw.claimed),
    legendsClaimed: strList(raw.legendsClaimed),
    legendsSeen: strList(raw.legendsSeen),
    rep: repMap(raw.rep),
    crewQuestsClaimed: strList(raw.crewQuestsClaimed),
    crewQuestsSeen: strList(raw.crewQuestsSeen),
    equipOwned: equipList(raw.equipOwned),
    supplies: supplyMap(raw.supplies),
    cityEvents: eventMap(raw.cityEvents),
    invest: investMap(raw.invest),
    orders: orderList(raw.orders),
    debt: typeof raw.debt === 'number' && Number.isFinite(raw.debt) && raw.debt > 0 ? Math.round(raw.debt) : 0,
    bounty: bountyOf(raw.bounty),
    bountyTimer: typeof raw.bountyTimer === 'number' && Number.isFinite(raw.bountyTimer)
      ? Math.max(0, Math.round(raw.bountyTimer))
      : 20,
    mapFrags,
    digCity: mapFrags >= MAP_FRAGS_NEED ? digCity : null,
    markets: ensureMarkets(raw.markets),
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
