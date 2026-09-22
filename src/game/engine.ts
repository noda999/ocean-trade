// ─────────────────────────────────────────────────────────────────────────────
//  远洋贸易 · 经济与航行引擎
// ─────────────────────────────────────────────────────────────────────────────

import {
  CITIES, CITY_BY_ID, GOOD_BY_ID, GOODS, SHIP_BY_ID, TITLES,
  type City, type Good, type ShipClass,
} from './data'

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/** 稳定哈希，用于让「非特产/非紧缺」货品的城市差异固定下来 */
function hash01(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967296
}

export interface Market {
  /** 当前单价 */
  price: number
  /** 市场库存 */
  stock: number
  /** 短期动能 */
  momentum: number
  /** 紧缺程度 0-1+，>0.3 视为紧缺 */
  spike: number
}

export type CityMarket = Record<string, Market>
export type AllMarkets = Record<string, CityMarket>

/** 城市对某货品的长期价格倍率 */
export function cityMult(city: City, goodId: string): number {
  if (city.exports.includes(goodId)) return 0.62
  if (city.imports.includes(goodId)) return 1.55
  return 0.94 + hash01(city.id + goodId) * 0.18
}

/** 该城市该货品的锚定价格（价格围绕它波动） */
export function anchorPrice(city: City, good: Good): number {
  return Math.round(good.base * cityMult(city, good.id))
}

export function isScarce(m: Market): boolean {
  return m.spike > 0.3
}

export function stockBase(city: City, goodId: string): number {
  if (city.exports.includes(goodId)) return 140
  if (city.imports.includes(goodId)) return 30
  return 70
}

/** 城市是否经营某货物（特产或紧缺）——不经营的市场不挂牌、不可交易 */
export function cityTrades(city: City, goodId: string): boolean {
  return city.exports.includes(goodId) || city.imports.includes(goodId)
}

export function createMarkets(): AllMarkets {
  const all: AllMarkets = {}
  for (const city of CITIES) {
    const cm: CityMarket = {}
    for (const good of GOODS) {
      if (!cityTrades(city, good.id)) continue
      const anchor = anchorPrice(city, good)
      cm[good.id] = {
        price: Math.round(anchor * (0.92 + Math.random() * 0.16)),
        stock: Math.round(stockBase(city, good.id) * (0.7 + Math.random() * 0.6)),
        momentum: (Math.random() - 0.5) * 0.1,
        spike: 0,
      }
    }
    all[city.id] = cm
  }
  return all
}

/** 存档市场补齐：版本更新给城市新增的进出口商品，在旧存档里没有市场条目——按初始规则补上。
 *  没有缺失时原样返回（引用不变），避免无谓的新对象。 */
export function ensureMarkets(prev: AllMarkets): AllMarkets {
  let changed = false
  const next: AllMarkets = {}
  for (const city of CITIES) {
    const cm: CityMarket = { ...(prev[city.id] ?? {}) }
    const ids = new Set([...city.exports, ...city.imports])
    for (const gid of ids) {
      if (cm[gid]) continue
      changed = true
      const good = GOOD_BY_ID[gid]
      const anchor = anchorPrice(city, good)
      cm[gid] = {
        price: Math.round(anchor * (0.92 + Math.random() * 0.16)),
        stock: Math.round(stockBase(city, gid) * (0.7 + Math.random() * 0.6)),
        momentum: (Math.random() - 0.5) * 0.1,
        spike: 0,
      }
    }
    next[city.id] = cm
  }
  return changed ? next : prev
}

/** 推进一个市场周期：随机游走 + 均值回归 + 紧缺衰减 */
export function evolveMarkets(prev: AllMarkets): AllMarkets {
  const next: AllMarkets = {}
  for (const city of CITIES) {
    const cm: CityMarket = {}
    for (const good of GOODS) {
      const m = prev[city.id]?.[good.id]
      if (!m) continue // 本港不经营该货物
      const anchor = anchorPrice(city, good)

      // 紧缺随机发生 / 缓慢消退
      let spike = m.spike * 0.86
      if (Math.random() < 0.022) spike = 0.45 + Math.random() * 0.75

      const target = anchor * (1 + spike)
      let momentum = m.momentum * 0.6 + (Math.random() - 0.5) * 0.2
      let price = m.price * (1 + momentum)
      price += (target - price) * 0.42
      price = clamp(price, anchor * 0.55, anchor * 2.3)

      const sb = stockBase(city, good.id)
      let stock = m.stock + (sb - m.stock) * 0.35 + (Math.random() - 0.5) * 10
      stock = clamp(stock, 4, 420)

      cm[good.id] = {
        price: Math.max(8, Math.round(price)),
        stock: Math.round(stock),
        momentum,
        spike,
      }
    }
    next[city.id] = cm
  }
  return next
}

/** 买入单价 */
export function buyPrice(city: City, good: Good, cm: CityMarket): number {
  void city
  return cm[good.id].price
}

/** 卖出单价（含船只利润加成） */
export function sellPrice(good: Good, cm: CityMarket, shipBonus: number): number {
  return Math.round(cm[good.id].price * (1 + shipBonus / 100))
}

// ── 港口商情（v1.3.0）：丰产 / 抢购 / 封锁 ────────────────────────────────────

export interface CityEvent {
  kind: 'boom' | 'shortage' | 'blockade'
  /** 受影响的商品（封锁无目标商品，为空串） */
  goodId: string
  /** 结束时刻（游戏时钟秒） */
  until: number
}

/** 丰产季：该商品在本港的买入价乘数 */
export function eventBuyMult(ev: CityEvent | undefined, goodId: string): number {
  if (ev && ev.kind === 'boom' && ev.goodId === goodId) return 0.55
  return 1
}

/** 抢购潮：该商品在本港的卖出价乘数 */
export function eventSellMult(ev: CityEvent | undefined, goodId: string): number {
  if (ev && ev.kind === 'shortage' && ev.goodId === goodId) return 2.2
  return 1
}

/** 封锁中：本港禁止交易 */
export function isBlockaded(ev: CityEvent | undefined): boolean {
  return ev?.kind === 'blockade'
}

/** 某货品在全球的最高卖价城市（用于情报与利润提示） */
export function bestMarketFor(goodId: string, markets: AllMarkets, shipBonus: number) {
  let best: { city: City; price: number } | null = null
  for (const city of CITIES) {
    const cm = markets[city.id]
    if (!cm?.[goodId]) continue
    const p = sellPrice(GOOD_BY_ID[goodId], cm, shipBonus)
    if (!best || p > best.price) best = { city, price: p }
  }
  return best
}

// ── 未探明城市：按特产 / 紧缺倍率推算的预估价 ────────────────────────────────
//  这些信息在地图上本来就是公开的（每个城市的特产与紧缺品类），
//  所以未开通情报时给出「预估价」，让新手也能找到第一条赚钱的航线。

export interface PriceHint {
  city: City
  price: number
  /** true 表示是推算的预估价，false 表示真实行情 */
  estimated: boolean
}

export function estBuyPrice(goodId: string, cityId: string): number {
  return anchorPrice(CITY_BY_ID[cityId], GOOD_BY_ID[goodId])
}

export function estSellPrice(goodId: string, cityId: string, shipBonus: number): number {
  return Math.round(estBuyPrice(goodId, cityId) * (1 + shipBonus / 100))
}

/** 全城最优买价（已探明用真实价，未探明用预估价，真实价优先） */
export function bestBuyHint(
  goodId: string, markets: AllMarkets, isKnown: (cid: string) => boolean,
): PriceHint {
  let best: PriceHint | null = null
  for (const city of CITIES) {
    if (!cityTrades(city, goodId)) continue
    const known = isKnown(city.id)
    const price = known ? markets[city.id][goodId].price : estBuyPrice(goodId, city.id)
    if (!best) { best = { city, price, estimated: !known }; continue }
    const better = price < best.price
    const tieButReal = price === best.price && best.estimated && known
    if (better || tieButReal) best = { city, price, estimated: !known }
  }
  return best!
}

/** 全城最优卖价（排除本港：玩家已在 s.cityId，卖出结算价就是本港价，无所谓"最优"） */
export function bestSellHint(
  goodId: string, markets: AllMarkets, shipBonus: number, isKnown: (cid: string) => boolean,
  hereId?: string,
): PriceHint {
  let best: PriceHint | null = null
  for (const city of CITIES) {
    if (!cityTrades(city, goodId)) continue
    // 排除本港：本地的卖出结算价就是本港价，没必要显示"销往本港"
    if (hereId && city.id === hereId) continue
    const known = isKnown(city.id)
    const price = known
      ? sellPrice(GOOD_BY_ID[goodId], markets[city.id], shipBonus)
      : estSellPrice(goodId, city.id, shipBonus)
    if (!best) { best = { city, price, estimated: !known }; continue }
    const better = price > best.price
    const tieButReal = price === best.price && best.estimated && known
    if (better || tieButReal) best = { city, price, estimated: !known }
  }
  return best!
}

// ── 航行 ─────────────────────────────────────────────────────────────────────

export function distance(a: City, b: City): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/** 航行所需秒数 */
export function voyageSeconds(a: City, b: City, ship: ShipClass): number {
  return Math.max(6, Math.round((distance(a, b) * 0.52) / ship.speed))
}

/** 航线二次贝塞尔控制点（向上拱起，像真实航线） */
export function routeControl(a: City, b: City): { x: number; y: number } {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const bend = Math.min(12, len * 0.22)
  // 垂直于航线方向偏移
  return { x: mx - (dy / len) * bend, y: my + (dx / len) * bend }
}

export function routePoint(a: City, b: City, t: number): { x: number; y: number } {
  const c = routeControl(a, b)
  const u = 1 - t
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  }
}

export function routePath(a: City, b: City): string {
  const c = routeControl(a, b)
  return `M${a.x},${a.y} Q${c.x},${c.y} ${b.x},${b.y}`
}

// ── 资产 / 称号 / 排名 ───────────────────────────────────────────────────────

export type Cargo = Record<string, { qty: number; cost: number }>

export function cargoUnits(cargo: Cargo): number {
  return Object.values(cargo).reduce((s, c) => s + c.qty, 0)
}

/** 按当前城市卖价估算货值；本港不经营的按全球基准价折算 */
export function cargoValue(cargo: Cargo, cityId: string, markets: AllMarkets, shipBonus: number): number {
  let v = 0
  for (const [gid, c] of Object.entries(cargo)) {
    const cm = markets[cityId]
    const good = GOOD_BY_ID[gid]
    if (!good) continue
    const mk = cm?.[gid]
    v += (mk ? sellPrice(good, cm, shipBonus) : good.base) * c.qty
  }
  return v
}

export function totalAssets(
  money: number, cargo: Cargo, cityId: string, markets: AllMarkets, shipBonus: number,
): number {
  return money + cargoValue(cargo, cityId, markets, shipBonus)
}

export function titleFor(assets: number): string {
  let name = TITLES[0].name
  for (const t of TITLES) if (assets >= t.min) name = t.name
  return name
}

export function nextTitle(assets: number) {
  return TITLES.find(t => t.min > assets) ?? null
}

/** 模拟排行榜名次（资产越高排名越前） */
export function rankFor(assets: number): number | null {
  if (assets < 12_000) return null
  return Math.max(1, Math.round(680 - Math.log10(assets) * 78))
}

export function shipOf(id: string): ShipClass {
  return SHIP_BY_ID[id] ?? SHIP_BY_ID.sloop
}
