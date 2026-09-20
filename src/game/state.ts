// ─────────────────────────────────────────────────────────────────────────────
//  远洋贸易 · 游戏状态与 reducer（真正驱动玩法的核心逻辑）
// ─────────────────────────────────────────────────────────────────────────────

import {
  AI_SHIPS, CITY_BY_ID, GOOD_BY_ID, INTEL_PRICE, MARKET_CYCLE, MILESTONES,
  SHIPS, SPICE_CYCLE, START_CITY, START_MONEY, VOYAGE_EVENTS,
  type Milestone,
} from './data'
import {
  cargoUnits, clamp, createMarkets, evolveMarkets, rankFor, sellPrice, shipOf,
  totalAssets, voyageSeconds, type AllMarkets, type Cargo,
} from './engine'

export interface Toast {
  id: number
  icon: string
  text: string
  kind: 'good' | 'bad' | 'info'
  ttl: number
}

export interface LogEntry {
  id: number
  t: number
  text: string
  kind: 'good' | 'bad' | 'info'
}

export interface Voyage {
  from: string
  to: string
  elapsed: number
  duration: number
}

export interface AiShipState {
  id: string
  t: number
}

export interface GameState {
  money: number
  cargo: Cargo
  cityId: string
  voyage: Voyage | null
  markets: AllMarkets
  shipId: string
  ownedShips: string[]
  boost: number
  intelOwned: boolean
  visited: string[]
  claimed: string[]
  stats: { trades: number; profit: number; distance: number; events: number; best: number }
  toasts: Toast[]
  log: LogEntry[]
  aiShips: AiShipState[]
  clock: number
  marketTimer: number
  spiceTimer: number
  eventTimer: number
  seq: number
}

export type Action =
  | { type: 'TICK'; dt: number }
  | { type: 'SAIL'; cityId: string }
  | { type: 'BUY'; goodId: string; qty: number }
  | { type: 'SELL'; goodId: string; qty: number }
  | { type: 'SELL_ALL' }
  | { type: 'BUY_SHIP'; shipId: string }
  | { type: 'SELECT_SHIP'; shipId: string }
  | { type: 'USE_BOOST' }
  | { type: 'CLAIM'; id: string }
  | { type: 'BUY_INTEL' }
  | { type: 'DROP_TOAST'; id: number }
  | { type: 'RESTART' }

export function initialState(): GameState {
  return {
    money: START_MONEY,
    cargo: {},
    cityId: START_CITY,
    voyage: null,
    markets: createMarkets(),
    shipId: 'sloop',
    ownedShips: ['sloop'],
    boost: 3,
    intelOwned: false,
    visited: [START_CITY],
    claimed: [],
    stats: { trades: 0, profit: 0, distance: 0, events: 0, best: 0 },
    toasts: [],
    log: [{ id: 1, t: 0, text: '你在中国的港口接过了第一艘商船，远洋贸易开始了。', kind: 'info' }],
    aiShips: AI_SHIPS.map(s => ({ id: s.id, t: s.offset })),
    clock: 0,
    marketTimer: MARKET_CYCLE,
    spiceTimer: SPICE_CYCLE,
    eventTimer: 5,
    seq: 10,
  }
}

// ── 小工具 ───────────────────────────────────────────────────────────────────

function pushToast(s: GameState, icon: string, text: string, kind: Toast['kind']): void {
  s.seq += 1
  s.toasts = [...s.toasts, { id: s.seq, icon, text, kind, ttl: 4.2 }].slice(-4)
}

function pushLog(s: GameState, text: string, kind: LogEntry['kind']): void {
  s.seq += 1
  s.log = [{ id: s.seq, t: s.clock, text, kind }, ...s.log].slice(0, 40)
}

export function assetsOf(s: GameState): number {
  return totalAssets(s.money, s.cargo, s.cityId, s.markets, shipOf(s.shipId).bonus)
}

export function milestoneProgress(s: GameState, m: Milestone): number {
  return clamp(assetsOf(s) / m.target, 0, 1)
}

export function rank(s: GameState): number | null {
  return rankFor(assetsOf(s))
}

/** 是否可领取 */
export function claimable(s: GameState, m: Milestone): boolean {
  return !s.claimed.includes(m.id) && assetsOf(s) >= m.target
}

// ── 航行事件 ─────────────────────────────────────────────────────────────────

function rollEvent(s: GameState): void {
  const roll = Math.random()
  // 坏事件 45%，好事件 55%
  const badPool = VOYAGE_EVENTS.filter(e => e.kind === 'bad')
  const goodPool = VOYAGE_EVENTS.filter(e => e.kind === 'good')
  const def = roll < 0.45
    ? badPool[Math.floor(Math.random() * badPool.length)]
    : goodPool[Math.floor(Math.random() * goodPool.length)]

  s.stats.events += 1
  const v = s.voyage
  if (!v) return

  switch (def.id) {
    case 'pirate': {
      const held = Object.entries(s.cargo).filter(([, c]) => c.qty > 0)
      if (held.length) {
        const [gid, c] = held[Math.floor(Math.random() * held.length)]
        const lost = Math.max(1, Math.round(c.qty * 0.25))
        const remain = c.qty - lost
        const next = { ...s.cargo }
        if (remain <= 0) delete next[gid]
        else next[gid] = { qty: remain, cost: c.cost * (remain / c.qty) }
        s.cargo = next
        pushToast(s, '🏴‍☠️', `海盗劫走 ${GOOD_BY_ID[gid].name} ×${lost}`, 'bad')
        pushLog(s, `遭遇海盗：损失 ${GOOD_BY_ID[gid].name} ×${lost}`, 'bad')
      } else {
        const fee = Math.min(s.money, 300)
        s.money -= fee
        pushToast(s, '🏴‍☠️', `海盗索要过路费 ${Math.round(fee)} 金`, 'bad')
        pushLog(s, `遭遇海盗：被勒索 ${Math.round(fee)} 金`, 'bad')
      }
      break
    }
    case 'storm': {
      s.voyage = { ...v, elapsed: clamp(v.elapsed - v.duration * 0.12, 0, v.duration) }
      pushToast(s, '⛈️', '暴风雨：航程延误', 'bad')
      pushLog(s, '暴风雨：航程延误约 12%', 'bad')
      break
    }
    case 'quarantine': {
      s.voyage = { ...v, duration: v.duration + 4 }
      pushToast(s, '🚩', '港口检疫：进港延迟 4 秒', 'bad')
      pushLog(s, '港口检疫排队：延误 4 秒', 'bad')
      break
    }
    case 'wind': {
      s.voyage = { ...v, elapsed: v.elapsed + v.duration * 0.2 }
      pushToast(s, '💨', '顺风顺水：航程大幅缩短', 'good')
      pushLog(s, '顺风顺水：航程缩短 20%', 'good')
      break
    }
    case 'dolphin': {
      s.boost += 1
      pushToast(s, '🐬', '海豚引航：获得加速卡 ×1', 'good')
      pushLog(s, '海豚引航：获得加速卡 ×1', 'good')
      break
    }
    case 'cargo': {
      const pool = Object.keys(GOOD_BY_ID)
      const gid = pool[Math.floor(Math.random() * pool.length)]
      const qty = 2 + Math.floor(Math.random() * 5)
      const cap = shipOf(s.shipId).cap
      const room = cap - cargoUnits(s.cargo)
      const add = Math.max(0, Math.min(qty, room))
      if (add > 0) {
        const cur = s.cargo[gid]
        s.cargo = { ...s.cargo, [gid]: { qty: (cur?.qty ?? 0) + add, cost: cur?.cost ?? 0 } }
        pushToast(s, '📦', `捞起 ${GOOD_BY_ID[gid].name} ×${add}`, 'good')
        pushLog(s, `海上漂货：获得 ${GOOD_BY_ID[gid].name} ×${add}`, 'good')
      } else {
        pushToast(s, '📦', '发现漂货，但货舱已满', 'info')
        pushLog(s, '发现漂货，但货舱已满，只能放弃', 'info')
      }
      break
    }
    case 'deal':
    default: {
      const gain = 200 + Math.round(Math.random() * 600)
      s.money += gain
      pushToast(s, '🤝', `港口商机：+${gain} 金`, 'good')
      pushLog(s, `顺路做成一笔小生意：+${gain} 金`, 'good')
      break
    }
  }
}

// ── 主 reducer ───────────────────────────────────────────────────────────────

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    // ── 时间推进 ──────────────────────────────────────────────────────────────
    case 'TICK': {
      const dt = action.dt
      const s: GameState = {
        ...state,
        clock: state.clock + dt,
        cargo: state.cargo,
        stats: { ...state.stats },
        toasts: state.toasts
          .map(t => ({ ...t, ttl: t.ttl - dt }))
          .filter(t => t.ttl > 0),
        aiShips: state.aiShips.map(a => ({ ...a })),
      }

      // 其它商船沿航线循环
      for (const a of s.aiShips) {
        const def = AI_SHIPS.find(x => x.id === a.id)
        if (!def) continue
        const from = CITY_BY_ID[def.from]
        const to = CITY_BY_ID[def.to]
        const span = Math.max(8, Math.hypot(to.x - from.x, to.y - from.y) * 0.5)
        a.t += dt / span
        if (a.t >= 1) a.t -= 1
      }

      // 市场周期刷新
      s.marketTimer -= dt
      if (s.marketTimer <= 0) {
        s.marketTimer += MARKET_CYCLE
        s.markets = evolveMarkets(s.markets)
      }

      // 紧缺刷新：随机制造几个高价机会
      s.spiceTimer -= dt
      if (s.spiceTimer <= 0) {
        s.spiceTimer += SPICE_CYCLE
        const next: AllMarkets = {}
        for (const cid of Object.keys(s.markets)) next[cid] = { ...s.markets[cid] }
        const picks: string[] = []
        for (let i = 0; i < 3; i++) {
          const cityIds = Object.keys(next)
          const cid = cityIds[Math.floor(Math.random() * cityIds.length)]
          const gids = Object.keys(next[cid])
          const gid = gids[Math.floor(Math.random() * gids.length)]
          const m = next[cid][gid]
          next[cid] = { ...next[cid], [gid]: { ...m, spike: 0.55 + Math.random() * 0.7 } }
          picks.push(`${CITY_BY_ID[cid].name}·${GOOD_BY_ID[gid].name}`)
        }
        s.markets = next
        pushLog(s, `紧缺行情刷新：${picks.join('、')} 价格暴涨`, 'info')
      }

      // 航行推进
      if (s.voyage) {
        const v = { ...s.voyage, elapsed: s.voyage.elapsed + dt }
        if (v.elapsed >= v.duration) {
          const from = CITY_BY_ID[v.from]
          const to = CITY_BY_ID[v.to]
          s.voyage = null
          s.cityId = v.to
          if (!s.visited.includes(v.to)) s.visited = [...s.visited, v.to]
          s.stats.distance += Math.round(Math.hypot(to.x - from.x, to.y - from.y) * 37)
          pushToast(s, '⚓', `抵达 ${to.name}`, 'good')
          pushLog(s, `从 ${from.name} 抵达 ${to.name}`, 'info')
        } else {
          s.voyage = v
          s.eventTimer -= dt
          if (s.eventTimer <= 0) {
            s.eventTimer = 4 + Math.random() * 4
            if (Math.random() < 0.62) rollEvent(s)
          }
        }
      } else {
        s.eventTimer = 5
      }

      return s
    }

    // ── 起航 ──────────────────────────────────────────────────────────────────
    case 'SAIL': {
      const s: GameState = { ...state, cargo: state.cargo, stats: { ...state.stats }, toasts: [...state.toasts] }
      if (s.voyage) return state
      if (action.cityId === s.cityId) return state
      const from = CITY_BY_ID[s.cityId]
      const to = CITY_BY_ID[action.cityId]
      if (!from || !to) return state
      const dur = voyageSeconds(from, to, shipOf(s.shipId))
      s.voyage = { from: from.id, to: to.id, elapsed: 0, duration: dur }
      s.eventTimer = 4 + Math.random() * 3
      pushToast(s, '⚓', `起航前往 ${to.name}，预计 ${dur} 秒`, 'info')
      pushLog(s, `从 ${from.name} 起航前往 ${to.name}，预计航行 ${dur} 秒`, 'info')
      return s
    }

    // ── 买入 ──────────────────────────────────────────────────────────────────
    case 'BUY': {
      const s: GameState = { ...state, cargo: { ...state.cargo }, stats: { ...state.stats }, toasts: [...state.toasts], markets: { ...state.markets } }
      if (s.voyage) { pushToast(s, '⛔', '航行中无法交易', 'bad'); return s }
      const good = GOOD_BY_ID[action.goodId]
      const cm = s.markets[s.cityId]
      const m = cm?.[good.id]
      if (!m) { pushToast(s, '🚫', `${CITY_BY_ID[s.cityId].name} 不经营 ${good.name}，去原产地看看`, 'bad'); return s }
      const city = CITY_BY_ID[s.cityId]
      // 销地 = 本港是进口商：进口商只收货不出售（他们是来买货的，不是卖货的）。
      // 玩家应去产地 BUY 装船出海，再运到销地 SELL，这才是海上贸易的正确流向。
      if (city.imports.includes(good.id)) {
        pushToast(s, '🚫', `${city.name} 紧缺 ${good.name}，本港进口商只收货不出售`, 'bad'); return s
      }
      const ship = shipOf(s.shipId)
      const room = ship.cap - cargoUnits(s.cargo)
      if (m.stock <= 0) { pushToast(s, '📉', `${good.name} 本地已售罄`, 'bad'); return s }
      if (room <= 0) { pushToast(s, '📦', '货舱已满，先去卖出货物', 'bad'); return s }
      const afford = Math.max(0, Math.floor(s.money / m.price))
      // 数值校验：禁止负数 / NaN / 小数，再夹紧到 m.stock、room、afford 三者最小
      const raw = Number.isFinite(action.qty) ? Math.floor(action.qty) : 0
      const qty = Math.max(0, Math.min(raw, m.stock, room, afford))
      if (qty <= 0) { pushToast(s, '🪙', afford <= 0 ? '金币不足' : `本次最多只能买 ${afford} 件`, 'bad'); return s }

      const cost = qty * m.price
      s.money -= cost
      const cur = s.cargo[good.id]
      s.cargo[good.id] = { qty: (cur?.qty ?? 0) + qty, cost: (cur?.cost ?? 0) + cost }
      s.markets[s.cityId] = {
        ...cm,
        [good.id]: { ...m, stock: m.stock - qty, price: Math.round(m.price * (1 + qty * 0.012)) },
      }
      s.stats.trades += 1
      pushToast(s, '📥', `买入 ${good.name} ×${qty}，支出 ${cost.toLocaleString()} 金`, 'info')
      return s
    }

    // ── 卖出 ──────────────────────────────────────────────────────────────────
    case 'SELL': {
      const s: GameState = { ...state, cargo: { ...state.cargo }, stats: { ...state.stats }, toasts: [...state.toasts], markets: { ...state.markets } }
      if (s.voyage) { pushToast(s, '⛔', '航行中无法交易', 'bad'); return s }
      const good = GOOD_BY_ID[action.goodId]
      const cm = s.markets[s.cityId]
      const m = cm?.[good.id]
      if (!m) { pushToast(s, '🚫', `${CITY_BY_ID[s.cityId].name} 不收购 ${good.name}，运往别处看看`, 'bad'); return s }
      const city = CITY_BY_ID[s.cityId]
      // 销地 = 本港是进口商：不该让玩家把紧缺货卖回本港进口商（防止反向套利）
      if (city.imports.includes(good.id)) {
        pushToast(s, '🚫', `${city.name} 紧缺 ${good.name}，本港进口商不回购`, 'bad'); return s
      }
      // 产地 = 本港是出口商：出口商本身就在卖同种货，不会以本港价反向回购玩家货物
      // （防止玩家从销地运特产到本港，靠 spike 暴涨时套利）
      if (city.exports.includes(good.id)) {
        pushToast(s, '🚫', `${city.name} 是 ${good.name} 的产地，本港出口商不回购`, 'bad'); return s
      }
      const ship = shipOf(s.shipId)
      const held = s.cargo[good.id]
      if (!held || held.qty <= 0) { pushToast(s, '📦', `货舱里没有 ${good.name}`, 'bad'); return s }
      // 数值校验：禁止负数、NaN、非整数；并夹紧到货舱实际数量
      const raw = Number.isFinite(action.qty) ? Math.floor(action.qty) : 0
      const qty = Math.max(0, Math.min(raw, held.qty))
      const unit = sellPrice(good, cm, ship.bonus)
      const revenue = unit * qty
      const costPart = Math.round(held.cost * (qty / held.qty))
      const profit = revenue - costPart

      s.money += revenue
      const remain = held.qty - qty
      if (remain <= 0) {
        const next = { ...s.cargo }
        delete next[good.id]
        s.cargo = next
      } else {
        s.cargo[good.id] = { qty: remain, cost: held.cost - costPart }
      }
      s.markets[s.cityId] = {
        ...cm,
        [good.id]: { ...m, stock: m.stock + qty, price: Math.max(8, Math.round(m.price * Math.max(0.72, 1 - qty * 0.012))) },
      }
      s.stats.trades += 1
      s.stats.profit += profit
      s.stats.best = Math.max(s.stats.best, profit)
      pushToast(
        s,
        profit >= 0 ? '💰' : '💸',
        `${good.name} ×${qty} 卖出 +${revenue.toLocaleString()} 金（${profit >= 0 ? '盈利' : '亏损'} ${Math.abs(profit).toLocaleString()}）`,
        profit >= 0 ? 'good' : 'bad',
      )
      pushLog(s, `在 ${CITY_BY_ID[s.cityId].name} 卖出 ${good.name} ×${qty}，${profit >= 0 ? '盈利' : '亏损'} ${Math.abs(profit).toLocaleString()} 金`, profit >= 0 ? 'good' : 'bad')
      return s
    }

    // ── 一键清仓 ──────────────────────────────────────────────────────────────
    case 'SELL_ALL': {
      let s = state
      const ids = Object.keys(s.cargo)
      if (!ids.length) {
        const t = [...s.toasts]
        s = { ...s, toasts: t }
        pushToast(s, '📦', '货舱是空的', 'bad')
        return s
      }
      const sellable = ids.filter(gid => {
        if (!s.cargo[gid] || !s.markets[s.cityId]?.[gid]) return false
        // 销地不向本港进口商回购；产地不向本港出口商回购（同反向套利校验）
        const c = CITY_BY_ID[s.cityId]
        if (c.imports.includes(gid) || c.exports.includes(gid)) return false
        return true
      })
      const blocked = ids.filter(gid => !sellable.includes(gid))
      for (const gid of sellable) {
        s = reducer(s, { type: 'SELL', goodId: gid, qty: s.cargo[gid]?.qty ?? 0 })
      }
      if (blocked.length) {
        s = { ...s, toasts: [...s.toasts] }
        pushToast(s, '📦', `${blocked.map(g => GOOD_BY_ID[g].name).join('、')} 本港不收购，已保留`, 'info')
      }
      return s
    }

    // ── 买船 ──────────────────────────────────────────────────────────────────
    case 'BUY_SHIP': {
      const s: GameState = { ...state, ownedShips: [...state.ownedShips], toasts: [...state.toasts] }
      const ship = SHIPS.find(x => x.id === action.shipId)
      if (!ship || s.ownedShips.includes(ship.id)) return state
      if (s.money < ship.cost) { pushToast(s, '🪙', `金币不足，还差 ${(ship.cost - s.money).toLocaleString()} 金`, 'bad'); return s }
      s.money -= ship.cost
      s.ownedShips = [...s.ownedShips, ship.id]
      s.shipId = ship.id
      pushToast(s, '🚢', `购入 ${ship.name}！`, 'good')
      pushLog(s, `购入新船：${ship.name}（载重 ${ship.cap}，利润 +${ship.bonus}%）`, 'good')
      return s
    }

    case 'SELECT_SHIP': {
      if (!state.ownedShips.includes(action.shipId)) return state
      const ship = shipOf(action.shipId)
      const s: GameState = { ...state, shipId: action.shipId, toasts: [...state.toasts] }
      if (cargoUnits(s.cargo) > ship.cap) {
        pushToast(s, '📦', '该船载重不足，先清掉部分货物', 'bad')
        return state
      }
      pushToast(s, '⚓', `已换乘 ${ship.name}`, 'info')
      return s
    }

    // ── 加速 ──────────────────────────────────────────────────────────────────
    case 'USE_BOOST': {
      const s: GameState = { ...state, toasts: [...state.toasts] }
      if (!s.voyage) { pushToast(s, '⛔', '当前没有航行任务', 'bad'); return s }
      if (s.boost <= 0) { pushToast(s, '🎫', '加速卡不足', 'bad'); return s }
      const v = s.voyage
      const remain = Math.max(0, v.duration - v.elapsed)
      s.boost -= 1
      s.voyage = { ...v, elapsed: v.elapsed + remain * 0.5 }
      pushToast(s, '⚡', `使用加速卡，剩余航程减半`, 'good')
      return s
    }

    // ── 领取里程碑 ────────────────────────────────────────────────────────────
    case 'CLAIM': {
      const m = MILESTONES.find(x => x.id === action.id)
      if (!m || state.claimed.includes(m.id)) return state
      if (assetsOf(state) < m.target) return state
      const s: GameState = { ...state, claimed: [...state.claimed, m.id], toasts: [...state.toasts] }
      s.money += m.gold
      s.boost += m.boost
      pushToast(s, '🏆', `${m.label}：+${m.gold.toLocaleString()} 金，加速卡 ×${m.boost}`, 'good')
      pushLog(s, `达成阶段目标「${m.label}」`, 'good')
      return s
    }

    // ── 购买情报网络 ──────────────────────────────────────────────────────────
    case 'BUY_INTEL': {
      if (state.intelOwned) return state
      if (state.money < INTEL_PRICE) {
        const s: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s, '🔮', `情报网络需要 ${INTEL_PRICE} 金`, 'bad')
        return s
      }
      const s: GameState = { ...state, money: state.money - INTEL_PRICE, intelOwned: true, toasts: [...state.toasts] }
      pushToast(s, '🔮', '情报网络已开通，全球价格一览无余', 'good')
      pushLog(s, `花费 ${INTEL_PRICE} 金开通全球情报网络`, 'info')
      return s
    }

    case 'DROP_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }

    case 'RESTART':
      return initialState()

    default:
      return state
  }
}
