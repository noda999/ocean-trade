// ─────────────────────────────────────────────────────────────────────────────
//  远洋贸易 · 游戏状态与 reducer（真正驱动玩法的核心逻辑）
// ─────────────────────────────────────────────────────────────────────────────

import {
  AI_SHIPS, BOUNTY_CYCLE, BOUNTY_RATE, BOUNTY_TTL, CITIES, CITY_BY_ID, CITY_EVENT_CYCLE, CITY_EVENT_DURATION, CITY_EVENT_INFO, CITY_EVENT_MAX, CREW_BY_ID, CREW_COURSES, CREW_GIFTS, CREW_FAVOR_BONUS_PER, CREW_FAVOR_BONUS_STEP, CREW_FAVOR_MAX, CREW_MAX_LEVEL, CREW_STORIES, CREW_TRAIN_BASE, CREW_TRAIN_RATE, CREW_QUESTS, DIG_BASE_REWARD, HOUSE_BONUS_PER_LEVEL, HOUSES, HOUSE_COSTS, HOUSE_STAGE_NAMES, DIG_RELIC_QTY, DIG_STEP_REWARD, EQUIP_BY_ID, GOOD_BY_ID, INTEL_PRICE, INVEST_LEVELS, INVEST_PROJECTS, LEGENDS, LEGEND_TITLE, LOAN_CRASH_RATIO, LOAN_CREDIT_MAX, LOAN_CREDIT_MIN, LOAN_CREDIT_RATE, LOAN_INTEREST, MAP_FRAGS_NEED, MARKET_CYCLE, MILESTONES,
  ORDER_ACTIVE_MAX, ORDER_BASE_RATE, ORDER_BOARD_MAX, ORDER_CYCLE, ORDER_DIST_RATE, PIRATES, PIRATE_BY_ID, RAID_BASE_POWER, RAID_CANNON_POWER, RAID_SHIP_POWER, REP_GAIN_ARRIVE, REP_GAIN_TRADE, REP_MAX, SECRET_OF_CITY, SEASONS, SHIPS, SPICE_CYCLE, START_CITY, START_MONEY, SUPPLY_BY_ID, TARIFF_BASE, TARIFF_RATE, VOYAGE_EVENTS,
  isSecretGood,
  seasonOf,
  type City, type CityEventKind, type CrewQuestDef, type EquipDef, type Good, type LegendDef, type Milestone, type QuestCond, type ShipClass,
} from './data'
import {
  cargoUnits, cargoValue, clamp, createMarkets, distance, eventBuyMult, eventSellMult, evolveMarkets, isBlockaded, rankFor, sellPrice, shipOf,
  totalAssets, voyageSeconds, type AllMarkets, type Cargo, type CityEvent,
} from './engine'
import type { GlyphName } from '../components/Glyph'

export interface Toast {
  id: number
  /** 矢量图标名（见 components/Glyph.tsx） */
  icon: GlyphName
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

/** 卖出流水（v1.5.1）：图鉴「出售记录」分页用，最近在前，最多保留 120 条 */
export interface SellRecord {
  id: number
  /** 卖出时刻（游戏时钟秒） */
  t: number
  cityId: string
  goodId: string
  qty: number
  /** 成交单价 */
  unit: number
  revenue: number
  profit: number
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

/** 限时委托单（v1.3.0）：从 A 港接单 → 装货 → 限期运到 B 港交付 */
export interface TradeOrder {
  id: string
  fromCity: string
  toCity: string
  goodId: string
  qty: number
  reward: number
  /** 过期时刻（游戏时钟秒） */
  deadline: number
  /** 是否已被玩家接下 */
  taken: boolean
  /** 委托理由文案（纯文本，丰富可读性） */
  reason: string
}

/** 海事悬赏（v1.4.0）：出击海盗巢穴，胜则领赏 */
export interface Bounty {
  pirateId: string
  /** 悬赏发布港（领声望的地方） */
  cityId: string
  reward: number
  /** 过期时刻（游戏时钟秒） */
  deadline: number
}

/** 每日目标（v1.6.0）：真实日历日内的小任务，进度按当日 stats 增量计算 */
export interface DailyGoal {
  id: string
  /** 统计项：trades / profit / distance / ordersDelivered / events / raidsWon */
  kind: string
  label: string
  target: number
  /** 当日开始时的统计基线，进度 = 当前值 - base */
  base: number
  claimed: boolean
}

export interface DailyState {
  /** 目标所属日期（YYYY-MM-DD），跨天自动刷新 */
  date: string
  goals: DailyGoal[]
}

export interface CheckinState {
  /** 最近签到日期（YYYY-MM-DD） */
  last: string
  /** 连续签到天数 */
  streak: number
}

export interface GameState {
  money: number
  cargo: Cargo
  cityId: string
  voyage: Voyage | null
  /** 航行中待裁决的事件（v1.5）：遇海盗时暂停并弹窗让玩家抉择，清空后继续 */
  pendingEvent: { type: 'pirate' } | null
  markets: AllMarkets
  shipId: string
  ownedShips: string[]
  /** 已雇佣的船员（id 列表，见 data.tsx CREW） */
  hiredCrew: string[]
  /** 船员修习的课程等级（v1.7）：crewId → { courseId → 0..CREW_MAX_LEVEL } */
  crewCourses: Record<string, Record<string, number>>
  /** 船员好感（v1.6）：crewId → 0-100，送礼累积 */
  crewFavor: Record<string, number>
  /** 各地宅邸（v1.6）：cityId → 0-3 级，缺省 0 级 */
  houses: Record<string, number>
  /** 玩家给船取的名字（空字符串 = 显示默认名） */
  shipName: string
  boost: number
  intelOwned: boolean
  visited: string[]
  /** 买过的商品（去重） */
  goodsBought: string[]
  /** 卖出过的商品（去重） */
  goodsSold: string[]
  /** 卖出流水（最近在前，最多 120 条）—— 图鉴「出售记录」分页用 */
  sellLog: SellRecord[]
  claimed: string[]
  /** 已领取的传奇功勋（id 列表，见 data.tsx LEGENDS） */
  legendsClaimed: string[]
  /** 已提示过「可领取」的传奇功勋（防重复弹气泡；与 claimed 分开存，避免影响领取判定） */
  legendsSeen: string[]
  /** 通关庆祝页是否已看过（集齐全部传奇功勋后弹一次） */
  victorySeen: boolean
  /** 海上事件图鉴：已遭遇过的航行事件 id（去重）；旧档读入自动补齐 */
  eventsSeen: string[]
  /** 港口声望：cityId → 声望值（靠港/交易累积，换价格优惠） */
  rep: Record<string, number>
  /** 已领取的船员委托（id 列表，见 data.tsx CREW_QUESTS） */
  crewQuestsClaimed: string[]
  /** 已提示过「可领取」的船员委托（防重复弹气泡） */
  crewQuestsSeen: string[]
  /** 已安装的船具（id 列表，见 data.tsx EQUIPS，永久生效） */
  equipOwned: string[]
  /** 补给库存：id → 数量（见 data.tsx SUPPLIES，事件自动消耗 / 手动使用） */
  supplies: Record<string, number>
  /** 港口商情事件（v1.3.0）：cityId → 丰产/抢购/封锁 */
  cityEvents: Record<string, CityEvent>
  /** 港口投资（v1.7）：cityId → { projectId → 1 }，每港 3 个可选项目 */
  invest: Record<string, Record<string, number>>
  /** 委托板订单（v1.3.0），含未接与进行中 */
  orders: TradeOrder[]
  /** 银行债务（v1.4.0）：本金 + 已计利息 */
  debt: number
  /** 海事悬赏（v1.4.0）：null = 当前无悬赏 */
  bounty: Bounty | null
  /** 悬赏刷新计时（v1.4.0） */
  bountyTimer: number
  /** 藏宝图碎片 0..MAP_FRAGS_NEED（v1.4.0） */
  mapFrags: number
  /** 碎片集齐后指向的目标港；null = 尚未集齐（v1.4.0） */
  digCity: string | null
  /** 每日目标（v1.6.0） */
  daily: DailyState
  /** 每日签到（v1.6.0） */
  checkin: CheckinState
  stats: { trades: number; profit: number; distance: number; events: number; best: number; ordersDelivered: number; raidsWon: number; treasures: number }
  toasts: Toast[]
  log: LogEntry[]
  aiShips: AiShipState[]
  clock: number
  marketTimer: number
  spiceTimer: number
  eventTimer: number
  /** 商情事件调度计时（v1.3.0） */
  newsTimer: number
  /** 委托板刷新计时（v1.3.0） */
  orderTimer: number
  seq: number
}

export type Action =
  | { type: 'TICK'; dt: number }
  | { type: 'SAIL'; cityId: string }
  | { type: 'BUY'; goodId: string; qty: number }
  | { type: 'SELL'; goodId: string; qty: number }
  | { type: 'SELL_ALL' }
  | { type: 'BUY_SHIP'; shipId: string }
  | { type: 'HIRE_CREW'; crewId: string }
  | { type: 'TRAIN_CREW'; crewId: string; courseId: string }
  | { type: 'GIFT_CREW'; crewId: string; giftId: string }
  | { type: 'SELECT_SHIP'; shipId: string }
  | { type: 'SET_SHIP_NAME'; name: string }
  | { type: 'USE_BOOST' }
  | { type: 'CLAIM'; id: string }
  | { type: 'CLAIM_LEGEND'; id: string }
  | { type: 'CLAIM_CREW_QUEST'; id: string }
  | { type: 'BUY_EQUIP'; id: string }
  | { type: 'BUY_SUPPLY'; id: string; qty: number }
  | { type: 'USE_SUPPLY'; id: string }
  | { type: 'INVEST'; projectId: string }
  | { type: 'BUY_HOUSE'; cityId: string }
  | { type: 'ACCEPT_ORDER'; id: string }
  | { type: 'DELIVER_ORDER'; id: string }
  | { type: 'ABANDON_ORDER'; id: string }
  | { type: 'BUY_INTEL' }
  | { type: 'LOAN_BORROW'; amount: number }
  | { type: 'LOAN_REPAY'; amount: number }
  | { type: 'RAID' }
  | { type: 'DIG_TREASURE' }
  | { type: 'RESOLVE_PIRATE'; choice: 'cannon' | 'bribe' | 'fight' }
  | { type: 'DROP_TOAST'; id: number }
  | { type: 'CHECK_IN' }
  | { type: 'CLAIM_DAILY'; id: string }
  | { type: 'RESTART' }
  /** 用存档覆盖整局状态（读档） */
  | { type: 'HYDRATE'; state: GameState }
  | { type: 'CLOSE_VICTORY' }
  /** 调试面板专用：直接改写状态（仅 dev 生效，生产构建里整段被剔除） */
  | { type: 'DEBUG_PATCH'; patch: Partial<GameState>; stats?: Partial<GameState['stats']> }
  /** 看广告奖励（TapTap 激励视频），amount 为发放金币数 */
  | { type: 'AD_REWARD'; amount: number }
  /** 看广告立即刷新全市场行情（跳过 marketTimer 等待） */
  | { type: 'AD_REFRESH_MARKET' }
  /** 看广告加速航行：剩余航程减半 */
  | { type: 'AD_ACCEL_VOYAGE' }

export function initialState(): GameState {
  return {
    money: START_MONEY,
    cargo: {},
    cityId: START_CITY,
    voyage: null,
    pendingEvent: null,
    markets: createMarkets(),
    shipId: 'sloop',
    ownedShips: ['sloop'],
    hiredCrew: [],
    crewCourses: {},
    crewFavor: {},
    houses: {},
    shipName: '',
    boost: 3,
    intelOwned: false,
    visited: [START_CITY],
    goodsBought: [],
    goodsSold: [],
    sellLog: [],
    claimed: [],
    legendsClaimed: [],
    legendsSeen: [],
    victorySeen: false,
    eventsSeen: [],
    rep: {},
    crewQuestsClaimed: [],
    crewQuestsSeen: [],
    equipOwned: [],
    supplies: {},
    cityEvents: {},
    invest: {},
    orders: [],
    debt: 0,
    bounty: null,
    bountyTimer: 20,
    mapFrags: 0,
    digCity: null,
    daily: { date: '', goals: [] },
    checkin: { last: '', streak: 0 },
    stats: { trades: 0, profit: 0, distance: 0, events: 0, best: 0, ordersDelivered: 0, raidsWon: 0, treasures: 0 },
    toasts: [],
    log: [{ id: 1, t: 0, text: '你在中国的港口接过了第一艘商船，远洋贸易开始了。', kind: 'info' }],
    aiShips: AI_SHIPS.map(s => ({ id: s.id, t: s.offset })),
    clock: 0,
    marketTimer: MARKET_CYCLE,
    spiceTimer: SPICE_CYCLE,
    eventTimer: 5,
    newsTimer: 20,
    orderTimer: 15,
    seq: 10,
  }
}

// ── 小工具 ───────────────────────────────────────────────────────────────────

function pushToast(s: GameState, icon: GlyphName, text: string, kind: Toast['kind']): void {
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

/** 船员带来的总加成：speed = 航速 %，trade = 利润 %（含修习课程 + 好感加成） */
export function crewBonusOf(s: GameState): { speed: number; trade: number } {
  let speed = 0
  let trade = 0
  for (const id of s.hiredCrew) {
    const c = CREW_BY_ID[id]
    if (!c) continue
    const courses = s.crewCourses[id] ?? {}
    for (const cid in courses) {
      const def = CREW_COURSES[cid]
      const lv = courses[cid]
      if (!def || !lv) continue
      speed += lv * def.speed
      trade += lv * def.trade
    }
    const favor = Math.min(s.crewFavor[id] ?? 0, CREW_FAVOR_MAX)
    const favorBonus = Math.floor(favor / CREW_FAVOR_BONUS_STEP) * CREW_FAVOR_BONUS_PER
    speed += c.speed
    trade += c.trade + favorBonus
  }
  return { speed, trade }
}

/** 船员修习某课程当前等级（缺省 0） */
export function crewCourseLevelOf(s: GameState, id: string, courseId: string): number {
  return s.crewCourses[id]?.[courseId] ?? 0
}
/** 船员总养成等级（所有课程之和），封顶 CREW_MAX_LEVEL，决定下一课学费 */
export function crewTotalLevelOf(s: GameState, id: string): number {
  const courses = s.crewCourses[id] ?? {}
  return Math.min(CREW_MAX_LEVEL, Object.values(courses).reduce((a, b) => a + b, 0))
}
/** 升到下一级所需金币（lv = 当前总等级，0 起，指数递增） */
export function crewTrainCost(lv: number): number {
  return Math.round(CREW_TRAIN_BASE * Math.pow(CREW_TRAIN_RATE, lv))
}

/** 船员好感带来的额外利润加成 %（每满 CREW_FAVOR_BONUS_STEP 好感 +CREW_FAVOR_BONUS_PER%） */
export function crewFavorProfitOf(s: GameState, id: string): number {
  const favor = Math.min(s.crewFavor[id] ?? 0, CREW_FAVOR_MAX)
  return Math.floor(favor / CREW_FAVOR_BONUS_STEP) * CREW_FAVOR_BONUS_PER
}

/** 某城宅邸等级（缺省 0） */
export function houseLevelOf(s: GameState, cityId: string): number {
  return s.houses[cityId] ?? 0
}

/** 某城宅邸带来的 buy / sell 价格加成 %（每级 HOUSE_BONUS_PER_LEVEL，取整到 0.1 防浮点长尾） */
export function houseBonusOf(s: GameState, cityId: string): { buy: number; sell: number } {
  const lv = houseLevelOf(s, cityId)
  const v = Math.round(lv * HOUSE_BONUS_PER_LEVEL * 10) / 10
  return { buy: v, sell: v }
}

/** 已安装船具的总加成 */
export function equipBonusOf(s: GameState): { speed: number; trade: number; cap: number; repGain: number } {
  let speed = 0
  let trade = 0
  let cap = 0
  let repGain = 0
  for (const id of s.equipOwned) {
    const e: EquipDef | undefined = EQUIP_BY_ID[id]
    if (!e) continue
    speed += e.speed ?? 0
    trade += e.trade ?? 0
    cap += e.cap ?? 0
    repGain += e.repGain ?? 0
  }
  return { speed, trade, cap, repGain }
}

/** 补给数量（0 = 没囤） */
export function supplyCount(s: GameState, id: string): number {
  return s.supplies[id] ?? 0
}

/** 消耗 1 个补给（在已复制的 state 上调用） */
function useSupply(s: GameState, id: string): boolean {
  const n = supplyCount(s, id)
  if (n <= 0) return false
  s.supplies = { ...s.supplies, [id]: n - 1 }
  return true
}

/** 含船员 + 船具加成的「有效座舰」：航速 × (1 + speed%)，利润 + trade%，载重 + cap */
export function shipNow(s: GameState): ShipClass {
  const ship = shipOf(s.shipId)
  const cb = crewBonusOf(s)
  const eq = equipBonusOf(s)
  return {
    ...ship,
    cap: ship.cap + eq.cap,
    speed: Math.round(ship.speed * (1 + (cb.speed + eq.speed) / 100) * 100) / 100,
    bonus: ship.bonus + cb.trade + eq.trade,
  }
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

// ── 传奇功勋 ──────────────────────────────────────────────────────────────────

/** 传奇功勋的当前进度值（全部来自已持久化的计数器，老存档自动结算） */
export function legendValue(s: GameState, l: LegendDef): number {
  switch (l.kind) {
    case 'assets': return assetsOf(s)
    case 'trades': return s.stats.trades
    case 'profit': return Math.max(0, Math.round(s.stats.profit))
    case 'distance': return s.stats.distance
    case 'best': return Math.max(0, Math.round(s.stats.best))
    case 'ships': return s.ownedShips.length
    case 'crew': return s.hiredCrew.length
    case 'cities': return s.visited.length
    case 'atlas': return new Set([...s.goodsBought, ...s.goodsSold]).size
    case 'events': return s.stats.events
  }
}

export function legendProgress(s: GameState, l: LegendDef): number {
  return clamp(legendValue(s, l) / l.target, 0, 1)
}

export function legendClaimable(s: GameState, l: LegendDef): boolean {
  return !s.legendsClaimed.includes(l.id) && legendValue(s, l) >= l.target
}

/** 是否已集齐全部传奇功勋（用于终极称号） */
export function allLegendsDone(s: GameState): boolean {
  return LEGENDS.every(l => s.legendsClaimed.includes(l.id))
}

// ── 港口声望 ──────────────────────────────────────────────────────────────────

export function repOf(s: GameState, cityId: string): number {
  return s.rep[cityId] ?? 0
}

/** 声望换算的本港价格优惠百分比（买入折扣 = 卖出加成） */
export function repBonusOf(s: GameState, cityId: string): number {
  return Math.min(15, Math.floor(repOf(s, cityId) / 5))
}

/** 声望 +n（夹上限；商会徽章等船具按比例放大），返回新的 rep 对象 */
function gainRep(s: GameState, cityId: string, n: number): void {
  const cur = repOf(s, cityId)
  const mult = 1 + equipBonusOf(s).repGain / 100
  const gain = Math.max(1, Math.round(n * mult))
  s.rep = { ...s.rep, [cityId]: Math.min(REP_MAX, cur + gain) }
}

// ── 港口商情 / 投资 / 委托（v1.3.0）──────────────────────────────────────────

/** 本港当前商情事件 */
export function cityEventOf(s: GameState, cityId: string): CityEvent | undefined {
  return s.cityEvents[cityId]
}

/** 港口已投项目数（0-3），沿用旧的"投资等级"口径 */
export function investLevelOf(s: GameState, cityId: string): number {
  const projects = s.invest[cityId] ?? {}
  let n = 0
  for (const d of INVEST_PROJECTS[cityId] ?? []) if ((projects[d.id] ?? 0) > 0) n++
  return Math.min(3, n)
}

/** 投资累计效果：汇总该港已投项目的买入折扣 / 卖出加成 / 分红 */
export function investBonusOf(s: GameState, cityId: string): { buy: number; sell: number; dividend: number } {
  const projects = s.invest[cityId] ?? {}
  let buy = 0
  let sell = 0
  let dividend = 0
  for (const def of INVEST_PROJECTS[cityId] ?? []) {
    const lv = projects[def.id] ?? 0
    if (!lv) continue
    buy += def.buy * lv
    sell += def.sell * lv
    dividend += def.dividend * lv
  }
  return { buy, sell, dividend }
}

// ── v1.4.0 辅助：隐藏特产门禁 / 进港关税 / 银行 / 出击战力 ────────────────────

/** 隐藏特产是否已在本港解锁（投资 ≥ 1 级「商会伙伴」） */
export function secretUnlocked(s: GameState, cityId: string): boolean {
  return investLevelOf(s, cityId) >= 1
}

/** 进港关税：固定 + 货值比例；投资 2 级半价、3 级全免 */
export function dockingFee(s: GameState, cityId: string, cargoVal: number): number {
  const lvl = investLevelOf(s, cityId)
  if (lvl >= 3) return 0
  let fee = TARIFF_BASE + Math.round(cargoVal * TARIFF_RATE)
  if (lvl === 2) fee = Math.round(fee / 2)
  return fee
}

/** 银行信用额度（可再借上限 = 总额度 - 现有债务） */
export function creditLimit(s: GameState): number {
  const total = clamp(
    Math.round(assetsOf(s) * LOAN_CREDIT_RATE), LOAN_CREDIT_MIN, LOAN_CREDIT_MAX,
  )
  return Math.max(0, total - s.debt)
}

/** 出击战力：基础 + 船级 + 舰炮组库存 */
export function raidPower(s: GameState): number {
  const idx = SHIPS.findIndex(x => x.id === shipNow(s).id)
  return RAID_BASE_POWER + Math.max(0, idx) * RAID_SHIP_POWER
    + supplyCount(s, 's_cannon') * RAID_CANNON_POWER
}

/** 出击预估胜率（0-1，夹在 10%-90%） */
export function raidWinRate(s: GameState): number {
  const b = s.bounty
  if (!b) return 0
  const p = raidPower(s)
  const str = PIRATE_BY_ID[b.pirateId]?.strength ?? 100
  return clamp(p / (p + str), 0.1, 0.9)
}

/** 碎片来源钩子：交付委托 / 漂流瓶 / 击溃海盗 */
function maybeFindFrag(s: GameState, chance: number): void {
  if (s.mapFrags >= MAP_FRAGS_NEED || Math.random() > chance) return
  const first = s.mapFrags === 0
  s.mapFrags += 1
  if (s.mapFrags >= MAP_FRAGS_NEED) {
    const pool = CITIES.filter(c => c.id !== s.cityId)
    s.digCity = pool[Math.floor(Math.random() * pool.length)].id
    pushToast(s, 'map', '藏宝图集齐了！去海事署（船坞）查看沉宝地点', 'good')
    pushLog(s, `藏宝图碎片集齐（${MAP_FRAGS_NEED}/${MAP_FRAGS_NEED}）：图中指向 ${CITY_BY_ID[s.digCity].name} 外海`, 'good')
  } else if (first) {
    pushToast(s, 'map', `捞起藏宝图碎片（${s.mapFrags}/${MAP_FRAGS_NEED}）！交付委托 / 漂流瓶 / 击溃海盗也能获得`, 'good')
    pushLog(s, `获得藏宝图碎片（${s.mapFrags}/${MAP_FRAGS_NEED}）。碎片来源：交付限时委托 · 海上漂流瓶 · 击溃悬赏海盗`, 'good')
  } else {
    pushToast(s, 'map', `捞起藏宝图碎片（${s.mapFrags}/${MAP_FRAGS_NEED}）`, 'good')
    pushLog(s, `获得藏宝图碎片（${s.mapFrags}/${MAP_FRAGS_NEED}）`, 'good')
  }
}

// ── 每日目标 / 签到（v1.6.0）─────────────────────────────────────────────────

/** 每日目标模板：随机抽 3 个，进度按当日 stats 增量计算 */
const DAILY_GOAL_TEMPLATES: { kind: string; label: string; target: number }[] = [
  { kind: 'trades', label: '完成 8 笔交易', target: 8 },
  { kind: 'profit', label: '赚取 4,000 金利润', target: 4000 },
  { kind: 'distance', label: '航行 1,000 海里', target: 1000 },
  { kind: 'ordersDelivered', label: '交付 2 张限时委托', target: 2 },
  { kind: 'events', label: '经历 4 次海上事件', target: 4 },
  { kind: 'raidsWon', label: '击溃 1 次海盗', target: 1 },
]

/** 每个每日目标的奖励（金币 + 加速卡） */
const DAILY_REWARD_GOLD = 600
const DAILY_REWARD_BOOST = 1

function dayString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function today(): string {
  return dayString(new Date())
}

function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return dayString(d)
}

/** 签到奖励：基础 100 金，连续天数越多越多，封顶 7 天 */
function checkinReward(streak: number): number {
  return 100 + (Math.min(streak, 7) - 1) * 50
}

function dailyStat(s: GameState, kind: string): number {
  switch (kind) {
    case 'trades': return s.stats.trades
    case 'profit': return Math.max(0, Math.round(s.stats.profit))
    case 'distance': return s.stats.distance
    case 'ordersDelivered': return s.stats.ordersDelivered ?? 0
    case 'events': return s.stats.events
    case 'raidsWon': return s.stats.raidsWon ?? 0
    default: return 0
  }
}

/** 按当日基线计算目标进度值（供 UI 实时显示） */
export function dailyGoalValue(s: GameState, g: DailyGoal): number {
  return Math.max(0, dailyStat(s, g.kind) - g.base)
}

/** 目标完成比例 0-1 */
export function dailyGoalProgress(s: GameState, g: DailyGoal): number {
  return Math.min(1, dailyGoalValue(s, g) / g.target)
}

/** 今天是否已签到 */
export function checkinDone(s: GameState): boolean {
  return s.checkin.last === today()
}

/** 随机生成当天的 3 个每日目标（互不重复） */
function rollDailyGoals(s: GameState): DailyState {
  const date = today()
  const pool = [...DAILY_GOAL_TEMPLATES]
  const goals: DailyGoal[] = []
  for (let i = 0; i < 3 && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    const t = pool.splice(idx, 1)[0]
    goals.push({
      id: `${date}-${t.kind}`,
      kind: t.kind,
      label: t.label,
      target: t.target,
      base: dailyStat(s, t.kind),
      claimed: false,
    })
  }
  return { date, goals }
}

/** 委托板：本港可接的单（未接、未过期、发布港 = 当前港） */
export function boardOrders(s: GameState): TradeOrder[] {
  return s.orders.filter(o => !o.taken && o.fromCity === s.cityId && o.deadline > s.clock)
}

/** 进行中的委托（已接下） */
export function activeOrders(s: GameState): TradeOrder[] {
  return s.orders.filter(o => o.taken)
}

/** 委托是否满足交付条件（人在目的地 + 货够 + 未过期） */
export function orderDeliverable(s: GameState, o: TradeOrder): boolean {
  return s.cityId === o.toCity && s.clock <= o.deadline && (s.cargo[o.goodId]?.qty ?? 0) >= o.qty
}

type ReasonTpl = (g: string, from: string, to: string) => string

/** 商品 → 货色类别（用于按类别生成专属委托理由；共 83 种全覆盖） */
const GOOD_CATEGORY: Record<string, string> = {
  // 织物服饰
  silk: 'textile', cotton: 'textile', wool: 'textile', fur: 'textile', leather: 'textile',
  alpaca: 'textile', carpet: 'textile', tapestry: 'textile', batik: 'textile', indigo: 'textile',
  // 香料调味
  spice: 'spice', clove: 'spice', nutmeg: 'spice', cinnamon: 'spice', vanilla: 'spice', saffron: 'spice',
  // 酒水饮品
  whisky: 'drink', wine: 'drink', rum: 'drink', tea: 'drink', coffee: 'drink', cacao: 'drink',
  // 食品食材
  grain: 'food', cheese: 'food', honey: 'food', sugar: 'food', salt: 'food', olive: 'food', date: 'food',
  caviar: 'food', truffle: 'food', pineapple: 'food', jasmine: 'food', nest: 'food',
  // 珠宝贵金
  pearl: 'gem', gold: 'gem', gem: 'gem', silver: 'gem', diamond: 'gem', amber: 'gem',
  sapphire: 'gem', jade: 'gem', emerald: 'gem', seashell: 'gem',
  // 香氛花卉
  perfume: 'aroma', rose: 'aroma', frankincense: 'aroma', agarwood: 'aroma', ambergris: 'aroma',
  incenseburner: 'aroma', tulip: 'aroma',
  // 兵器军械
  sword: 'weapon', longbow: 'weapon', scimitar: 'weapon', armor: 'weapon', kris: 'weapon',
  tumi: 'weapon', obsidian: 'weapon',
  // 嗜好品（烟、槟榔等提神解乏之物）
  tobacco: 'indulgence', betel: 'indulgence',
  // 原料建材
  timber: 'material', teak: 'material', marble: 'material', copper: 'material',
  // 工艺器物（含隐藏特产与奇珍秘藏）
  porcelain: 'craft', watch: 'craft', paper: 'craft', lacquer: 'craft', miniature: 'craft',
  sitar: 'craft', guitar: 'craft', violin: 'craft', murano: 'craft', delft: 'craft', book: 'craft',
  fleur: 'craft', scroll: 'craft', rune: 'craft', papyrus: 'craft', sundisc: 'craft', mask: 'craft',
  elephantegg: 'craft', relic: 'craft',
}

/** 各类别专属委托理由文案池 */
const CATEGORY_REASONS: Record<string, ReasonTpl[]> = {
  textile: [
    (g, from, to) => `${to}的裁缝行会求购上等${g}，赶制今冬华服`,
    (g, from, to) => `商队带回样布，${to}的贵妇们抢着要${from}的${g}`,
    (g, from, to) => `${g}在${to}卖得起价，御寒体面两相宜`,
  ],
  spice: [
    (g, from, to) => `${to}的厨房缺${g}调味，主厨催单催得紧`,
    (g, from, to) => `一船${g}从${from}出发，还没到${to}就被订走大半`,
    (g, from, to) => `听闻${to}人把${g}当宝，价比黄金`,
  ],
  drink: [
    (g, from, to) => `${to}的酒馆闹酒荒，老板急寻${from}的${g}`,
    (g, from, to) => `一场大宴在${to}候着，${g}是压轴的体面`,
    (g, from, to) => `远航的人最懂${g}的好，${to}码头正缺货`,
  ],
  food: [
    (g, from, to) => `${to}粮价看涨，快把这批${g}运过去`,
    (g, from, to) => `${from}收成丰裕，${g}正好解${to}的燃眉之急`,
    (g, from, to) => `${to}大厨点名要${from}的${g}，宴席等米下锅`,
  ],
  gem: [
    (g, from, to) => `${to}的珠宝匠在找原料，${g}有多少收多少`,
    (g, from, to) => `贵族婚期将近，${to}急着凑一批${g}作聘礼`,
    (g, from, to) => `${g}在${to}是硬通货，出手不愁买家`,
  ],
  aroma: [
    (g, from, to) => `${to}的香氛铺子缺货，点名要${from}的${g}`,
    (g, from, to) => `神庙与闺阁都爱${g}，${to}的订单催得急`,
    (g, from, to) => `半城都飘着${g}的香，${to}还嫌不够`,
  ],
  weapon: [
    (g, from, to) => `${to}的军械库下订${g}，军情如火`,
    (g, from, to) => `${from}锻出的${g}声名在外，${to}出重金求购`,
    (g, from, to) => `商路不太平，${to}商队急着添置${g}护身`,
  ],
  material: [
    (g, from, to) => `${to}船坞开工，${g}是下水的关键料`,
    (g, from, to) => `铸炮与营建都要用${g}，${to}正在大采购`,
    (g, from, to) => `${from}的${g}成色好，${to}工坊排队来取`,
  ],
  craft: [
    (g, from, to) => `${to}的收藏家看中了${from}的${g}，不惜重金`,
    (g, from, to) => `一件${g}在${to}能进博物馆，行家抢着要`,
    (g, from, to) => `${from}匠人的${g}独此一家，${to}慕名求购`,
  ],
  indulgence: [
    (g, from, to) => `${to}的老主顾们馋这口${g}，货一到就被抢光`,
    (g, from, to) => `水手们在${to}码头翘首以盼，就等${from}的${g}`,
    (g, from, to) => `${g}在${to}是有名的解乏好物，回头客成群`,
  ],
}

/** 未命中分类时的通用文案池（兜底，避免未来新增商品无文案） */
const FALLBACK_REASONS: ReasonTpl[] = [
  (g, from, to) => `${to}的商行急寻货源，愿出高价收购${g}`,
  (g, from, to) => `${from}商会托付：把这批${g}平安送到${to}`,
  (g, from, to) => `听闻${to}的${g}行情连日看涨，机不可失`,
  (g, from, to) => `${to}总督府筹办节庆，点名要${from}的${g}`,
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** 按货色类别随机抽取一条专属委托理由文案 */
export function orderReason(from: City, to: City, good: Good): string {
  const cat = GOOD_CATEGORY[good.id]
  const pool = (cat && CATEGORY_REASONS[cat]) || FALLBACK_REASONS
  return pick(pool)(good.name, from.name, to.name)
}

/** 随机生成一张委托单（从已探明的港口出发） */
function genOrder(s: GameState): TradeOrder | null {
  const fromPool = CITIES.filter(c => s.visited.includes(c.id))
  const from = fromPool[Math.floor(Math.random() * fromPool.length)]
  if (!from) return null
  // 隐藏特产未解锁时买不到，不能进委托（否则会出现无法完成的单子）
  const exportPool = from.exports.filter(gid => !isSecretGood(gid) || secretUnlocked(s, from.id))
  const goodId = exportPool[Math.floor(Math.random() * exportPool.length)]
  const good = GOOD_BY_ID[goodId]
  if (!good) return null
  const toPool = CITIES.filter(c => c.id !== from.id && !c.exports.includes(goodId))
  const to = toPool[Math.floor(Math.random() * toPool.length)]
  if (!to) return null
  const qty = Math.max(6, Math.min(40, Math.round(1500 / good.base) + 4))
  const dist = distance(from, to)
  const reward = Math.round(qty * good.base * (ORDER_BASE_RATE + dist * ORDER_DIST_RATE))
  const sail = voyageSeconds(from, to, shipOf('sloop'))
  const deadline = s.clock + Math.max(80, sail * 2.6 + 40)
  s.seq += 1
  return { id: `o${s.seq}`, fromCity: from.id, toCity: to.id, goodId, qty, reward, deadline, taken: false, reason: orderReason(from, to, good) }
}

// ── 船员委托 ──────────────────────────────────────────────────────────────────

function questCondValue(s: GameState, cond: QuestCond): number {
  switch (cond.kind) {
    case 'visit': return s.visited.includes(cond.cityId) ? 1 : 0
    case 'tradeGood': return (s.goodsBought.includes(cond.goodId) || s.goodsSold.includes(cond.goodId)) ? 1 : 0
    case 'assets': return assetsOf(s)
    case 'trades': return s.stats.trades
    case 'distance': return s.stats.distance
    case 'best': return Math.max(0, Math.round(s.stats.best))
    case 'cities': return s.visited.length
    case 'atlas': return new Set([...s.goodsBought, ...s.goodsSold]).size
    case 'events': return s.stats.events
    case 'profit': return Math.max(0, Math.round(s.stats.profit))
    case 'crewCount': return s.hiredCrew.length
    case 'ship': return s.ownedShips.includes(cond.shipId) ? 1 : 0
    case 'rep': return repOf(s, cond.cityId)
  }
}

function questCondTarget(cond: QuestCond): number {
  return cond.kind === 'visit' || cond.kind === 'tradeGood' || cond.kind === 'ship' ? 1
    : cond.kind === 'rep' ? cond.target
      : (cond as { target: number }).target
}

/** 委托条件进度描述（当前值 / 目标值） */
export function crewQuestValue(s: GameState, q: CrewQuestDef): number {
  return questCondValue(s, q.cond)
}
export function crewQuestTarget(q: CrewQuestDef): number {
  return questCondTarget(q.cond)
}
export function crewQuestProgress(s: GameState, q: CrewQuestDef): number {
  return clamp(questCondValue(s, q.cond) / questCondTarget(q.cond), 0, 1)
}

/** 该委托是否已解锁（船员在船上 && 前序段已领） */
export function crewQuestVisible(s: GameState, q: CrewQuestDef): boolean {
  if (!s.hiredCrew.includes(q.crewId)) return false
  if (q.stage === 1) return true
  const prev = CREW_QUESTS.find(x => x.crewId === q.crewId && x.stage === q.stage - 1)
  return !!prev && s.crewQuestsClaimed.includes(prev.id)
}

export function crewQuestClaimable(s: GameState, q: CrewQuestDef): boolean {
  return !s.crewQuestsClaimed.includes(q.id)
    && crewQuestVisible(s, q)
    && questCondValue(s, q.cond) >= questCondTarget(q.cond)
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
  // 记录已遭遇事件，供「海上事件图鉴」标记发现
  s.eventsSeen = Array.from(new Set([...s.eventsSeen, def.id]))
  const v = s.voyage
  if (!v) return

  switch (def.id) {
    case 'pirate': {
      // v1.5：改用待裁决弹窗，让玩家自行决定如何应对（舰炮迎战 / 破财消灾 / 硬拼）
      s.pendingEvent = { type: 'pirate' }
      break
    }
    case 'storm': {
      // 修理木料：自动加固船体，延误减半
      if (supplyCount(s, 's_timber') > 0) {
        useSupply(s, 's_timber')
        s.voyage = { ...v, elapsed: clamp(v.elapsed - v.duration * 0.06, 0, v.duration) }
        pushToast(s, 'hammer', '暴风雨！木料加固船体，延误减半', 'good')
        pushLog(s, '暴风雨：消耗修理木料，延误仅 6%', 'good')
        break
      }
      s.voyage = { ...v, elapsed: clamp(v.elapsed - v.duration * 0.12, 0, v.duration) }
      pushToast(s, 'storm', '暴风雨：航程延误', 'bad')
      pushLog(s, '暴风雨：航程延误约 12%', 'bad')
      break
    }
    case 'quarantine': {
      // 通商特许状：免排队直接进港
      if (supplyCount(s, 's_charter') > 0) {
        useSupply(s, 's_charter')
        pushToast(s, 'receipt', '出示通商特许状：检疫免排队', 'good')
        pushLog(s, '港口检疫：出示特许状，免排队进港', 'good')
        break
      }
      s.voyage = { ...v, duration: v.duration + 4 }
      pushToast(s, 'flag', '港口检疫：进港延迟 4 秒', 'bad')
      pushLog(s, '港口检疫排队：延误 4 秒', 'bad')
      break
    }
    case 'wind': {
      s.voyage = { ...v, elapsed: v.elapsed + v.duration * 0.2 }
      pushToast(s, 'wind', '顺风顺水：航程大幅缩短', 'good')
      pushLog(s, '顺风顺水：航程缩短 20%', 'good')
      break
    }
    case 'bottle': {
      // 漂流瓶：藏宝图碎片来源之一（图未集齐时 60% 概率藏有碎片）
      if (s.mapFrags < MAP_FRAGS_NEED) {
        maybeFindFrag(s, 0.6)
        break
      }
      const tip = 80 + Math.round(Math.random() * 220)
      s.money += tip
      pushToast(s, 'bottle', `漂流瓶里有几枚旧金币：+${tip} 金`, 'good')
      pushLog(s, `捞起漂流瓶：兑换旧金币 +${tip} 金`, 'good')
      break
    }
    case 'dolphin': {
      s.boost += 1
      pushToast(s, 'dolphin', '海豚引航：获得加速卡 ×1', 'good')
      pushLog(s, '海豚引航：获得加速卡 ×1', 'good')
      break
    }
    case 'cargo': {
      // 隐藏特产（投资门禁）与神殿珍宝（仅秘藏产出）不进漂货池
      const pool = Object.keys(GOOD_BY_ID).filter(g => g !== 'relic' && !isSecretGood(g))
      const gid = pool[Math.floor(Math.random() * pool.length)]
      const qty = 2 + Math.floor(Math.random() * 5)
      const cap = shipNow(s).cap
      const room = cap - cargoUnits(s.cargo)
      const add = Math.max(0, Math.min(qty, room))
      if (add > 0) {
        const cur = s.cargo[gid]
        s.cargo = { ...s.cargo, [gid]: { qty: (cur?.qty ?? 0) + add, cost: cur?.cost ?? 0 } }
        pushToast(s, 'box', `捞起 ${GOOD_BY_ID[gid].name} ×${add}`, 'good')
        pushLog(s, `海上漂货：获得 ${GOOD_BY_ID[gid].name} ×${add}`, 'good')
      } else {
        pushToast(s, 'box', '发现漂货，但货舱已满', 'info')
        pushLog(s, '发现漂货，但货舱已满，只能放弃', 'info')
      }
      break
    }
    case 'reef': {
      // 修理木料：快速补舱，延误压到最小
      if (supplyCount(s, 's_timber') > 0) {
        useSupply(s, 's_timber')
        s.voyage = { ...v, duration: v.duration + 1.5 }
        pushToast(s, 'hammer', '暗礁！木料修补船体，仅延误 1.5 秒', 'good')
        pushLog(s, '暗礁搁浅：木料加固，延误 1.5 秒', 'good')
        break
      }
      s.voyage = { ...v, duration: v.duration + 5 }
      pushToast(s, 'barrier', '暗礁搁浅：绕行延误 5 秒', 'bad')
      pushLog(s, '暗礁搁浅：绕行延误 5 秒', 'bad')
      break
    }
    case 'mutiny': {
      const loss = Math.min(s.money, 200 + Math.round(Math.random() * 400))
      s.money -= loss
      pushToast(s, 'skull', `船员哗变：被勒索 ${loss} 金`, 'bad')
      pushLog(s, `船员哗变：损失 ${loss} 金`, 'bad')
      break
    }
    case 'fog': {
      s.voyage = { ...v, duration: v.duration + 3 }
      pushToast(s, 'compass', '浓雾迷航：绕路延误 3 秒', 'bad')
      pushLog(s, '浓雾迷航：延误 3 秒', 'bad')
      break
    }
    case 'fire': {
      // 修理木料：即时扑灭，免遭损失
      if (supplyCount(s, 's_timber') > 0) {
        useSupply(s, 's_timber')
        pushToast(s, 'hammer', '船舱失火！木料扑灭', 'good')
        pushLog(s, '船舱失火：木料扑灭', 'good')
        break
      }
      const ids = Object.keys(s.cargo).filter(g => (s.cargo[g]?.qty ?? 0) > 0)
      if (ids.length) {
        const gid = ids[Math.floor(Math.random() * ids.length)]
        const cur = s.cargo[gid]
        const lose = Math.max(1, Math.ceil(cur.qty * 0.3))
        s.cargo = { ...s.cargo, [gid]: { ...cur, qty: cur.qty - lose } }
        pushToast(s, 'flame', `船舱失火：烧毁 ${GOOD_BY_ID[gid].name} ×${lose}`, 'bad')
        pushLog(s, `船舱失火：烧毁 ${GOOD_BY_ID[gid].name} ×${lose}`, 'bad')
        break
      }
      s.voyage = { ...v, duration: v.duration + 3 }
      pushToast(s, 'flame', '船舱失火：延误 3 秒', 'bad')
      pushLog(s, '船舱失火：延误 3 秒', 'bad')
      break
    }
    case 'doldrums': {
      s.voyage = { ...v, elapsed: clamp(v.elapsed - v.duration * 0.18, 0, v.duration) }
      pushToast(s, 'anchor', '陷入无风带：航程大幅拉长', 'bad')
      pushLog(s, '无风带：航程变慢约 18%', 'bad')
      break
    }
    case 'whirl': {
      s.voyage = { ...v, duration: v.duration + 3 }
      pushToast(s, 'wave', '漩涡暗流：绕行延误 3 秒', 'bad')
      pushLog(s, '漩涡暗流：绕行延误 3 秒', 'bad')
      break
    }
    case 'merchant': {
      const gain = 250 + Math.round(Math.random() * 550)
      s.money += gain
      pushToast(s, 'ship', `偶遇商船：顺路倒卖 +${gain} 金`, 'good')
      pushLog(s, `偶遇商船：+${gain} 金`, 'good')
      break
    }
    case 'festival': {
      const gain = 150 + Math.round(Math.random() * 350)
      s.money += gain
      s.boost += 1
      pushToast(s, 'cheers', `海上节庆：+${gain} 金，获加速卡 ×1`, 'good')
      pushLog(s, `海上节庆：+${gain} 金，加速卡 ×1`, 'good')
      break
    }
    case 'whale': {
      s.voyage = { ...v, elapsed: v.elapsed + v.duration * 0.15 }
      pushToast(s, 'crystal', '巨鲸护航：航程缩短', 'good')
      pushLog(s, '巨鲸护航：航程缩短 15%', 'good')
      break
    }
    case 'spring': {
      s.boost += 1
      pushToast(s, 'beer', '甘泉补给：获加速卡 ×1', 'good')
      pushLog(s, '甘泉补给：加速卡 ×1', 'good')
      break
    }
    case 'wreck': {
      const gain = 300 + Math.round(Math.random() * 600)
      s.money += gain
      pushToast(s, 'gem', `海难遗财：拾得 ${gain} 金`, 'good')
      pushLog(s, '海难遗财：+${gain} 金', 'good')
      break
    }
    case 'current': {
      s.voyage = { ...v, elapsed: v.elapsed + v.duration * 0.22 }
      pushToast(s, 'bolt', '幸运洋流：航程大幅缩短', 'good')
      pushLog(s, '幸运洋流：航程缩短 22%', 'good')
      break
    }
    case 'corsair': {
      s.voyage = { ...v, duration: v.duration + 4 }
      pushToast(s, 'helm', '私掠船追袭：被迫改道，延误 4 秒', 'bad')
      pushLog(s, '私掠船追袭：被迫改道，延误 4 秒', 'bad')
      break
    }
    case 'kraken': {
      s.voyage = { ...v, elapsed: clamp(v.elapsed - v.duration * 0.12, 0, v.duration) }
      pushToast(s, 'hourglass', '海怪惊扰：航速骤降，航程变慢', 'bad')
      pushLog(s, '海怪惊扰：航程变慢约 12%', 'bad')
      break
    }
    case 'sirens': {
      const loss = Math.min(s.money, 150 + Math.round(Math.random() * 250))
      s.money -= loss
      pushToast(s, 'purse', `海妖之歌：花 ${loss} 金安抚船员`, 'bad')
      pushLog(s, `海妖之歌：安抚船员损失 ${loss} 金`, 'bad')
      break
    }
    case 'oasis': {
      const gain = 150 + Math.round(Math.random() * 200)
      s.money += gain
      s.boost += 1
      pushToast(s, 'coin', `无名小岛：补给 +${gain} 金，获加速卡 ×1`, 'good')
      pushLog(s, `无名小岛补给：+${gain} 金，加速卡 ×1`, 'good')
      break
    }
    case 'envoy': {
      const gain = 400 + Math.round(Math.random() * 500)
      s.money += gain
      pushToast(s, 'crown', `王国使节船：赏金 +${gain} 金`, 'good')
      pushLog(s, `王国使节船：赏金 +${gain} 金`, 'good')
      break
    }
    case 'lighthouse': {
      s.voyage = { ...v, elapsed: v.elapsed + v.duration * 0.12 }
      pushToast(s, 'spyglass', '灯塔引航：航程缩短', 'good')
      pushLog(s, '灯塔引航：航程缩短 12%', 'good')
      break
    }
    case 'smuggle': {
      const gain = 400 + Math.round(Math.random() * 500)
      s.money += gain
      pushToast(s, 'gift', `走私黑市：暴利 +${gain} 金`, 'good')
      pushLog(s, `走私黑市：暴利 +${gain} 金`, 'good')
      break
    }
    case 'seabird': {
      s.voyage = { ...v, elapsed: v.elapsed + v.duration * 0.1 }
      pushToast(s, 'sparkles', '海鸟指路：抄了近道，航程缩短', 'good')
      pushLog(s, '海鸟指路：航程缩短 10%', 'good')
      break
    }
    case 'dehydrate': {
      s.voyage = { ...v, elapsed: clamp(v.elapsed - v.duration * 0.12, 0, v.duration) }
      pushToast(s, 'sun', '暴晒脱水：船员体力不支，航程变慢', 'bad')
      pushLog(s, '暴晒脱水：航程变慢约 12%', 'bad')
      break
    }
    case 'iceberg': {
      s.voyage = { ...v, duration: v.duration + 4 }
      pushToast(s, 'snow', '冰山漂近：改道绕行，延误 4 秒', 'bad')
      pushLog(s, '冰山漂近：改道绕行，延误 4 秒', 'bad')
      break
    }
    case 'deal':
    default: {
      const gain = 200 + Math.round(Math.random() * 600)
      s.money += gain
      pushToast(s, 'exchange', `港口商机：+${gain} 金`, 'good')
      pushLog(s, `顺路做成一笔小生意：+${gain} 金`, 'good')
      break
    }
  }
}

// ── 主 reducer ───────────────────────────────────────────────────────────────

function coreReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    // ── 时间推进 ──────────────────────────────────────────────────────────────
    case 'TICK': {
      // 待裁决事件（如海盗）期间冻结模拟，等玩家抉择后再继续
      if (state.pendingEvent) return state
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

      // 季节 / 季风更替（由 clock 推导，不落盘）
      if (seasonOf(state.clock).id !== seasonOf(s.clock).id) {
        const season = seasonOf(s.clock)
        pushToast(s, season.icon, `${season.name}：${season.desc}`, 'info')
        pushLog(s, `${season.name}到来：${season.desc}`, 'info')
      }

      // 每日目标：跨天刷新（真实日历日，不随游戏内 clock 走）
      if (s.daily.date !== today()) s.daily = rollDailyGoals(s)

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

      // 市场周期刷新（v1.3.0：顺带结算投资分红）
      s.marketTimer -= dt
      if (s.marketTimer <= 0) {
        s.marketTimer += MARKET_CYCLE
        s.markets = evolveMarkets(s.markets)
        let dividend = 0
        for (const cid of Object.keys(s.invest)) {
          if (!CITY_BY_ID[cid]) continue
          dividend += investBonusOf(s, cid).dividend
        }
        // 被动分红设每周期总上限，避免后期滚雪球（满投资约 4460 金/秒）碾压主动跑商、弱化 1 亿终局挑战
        const DIVIDEND_CAP = 2500
        if (dividend > 0) {
          const paid = Math.min(dividend, DIVIDEND_CAP)
          s.money += paid
          // 每 8 秒结算一次，日志按 40 秒节流，避免把商情/委托消息挤出日志
          if (Math.floor(s.clock / 40) !== Math.floor(state.clock / 40)) {
            pushLog(s, `港口投资持续分红：每市场周期 +${paid.toLocaleString()} 金${paid < dividend ? '（已达上限）' : ''}`, 'good')
          }
        }
        // 银行计息（v1.4.0）；债务超过资产安全线 → 强制清算
        if (s.debt > 0) {
          s.debt = Math.round(s.debt * (1 + LOAN_INTEREST))
          if (s.debt > assetsOf(s) * LOAN_CRASH_RATIO) {
            const seized = s.money + cargoValue(s.cargo, s.cityId, s.markets, shipNow(s).bonus)
            const remain = Math.max(0, s.debt - seized)
            s.money = 0
            s.cargo = {}
            s.debt = remain
            pushToast(s, 'scale', `债主查封！货物与金币充公抵债 ${seized.toLocaleString()} 金`, 'bad')
            pushLog(s, `银行强制清算：没收全部货物与现金抵债 ${seized.toLocaleString()} 金，剩余债务 ${remain.toLocaleString()} 金`, 'bad')
          }
        }
      }

      // 紧缺刷新：随机制造几个高价机会（55% 概率偏向当季商品）
      s.spiceTimer -= dt
      if (s.spiceTimer <= 0) {
        s.spiceTimer += SPICE_CYCLE
        const season = seasonOf(s.clock)
        const next: AllMarkets = {}
        for (const cid of Object.keys(s.markets)) next[cid] = { ...s.markets[cid] }
        const picks: string[] = []
        for (let i = 0; i < 3; i++) {
          let cid: string | undefined
          let gid: string | undefined
          if (Math.random() < 0.55) {
            // 当季商品池：挑一个确有城市经营的
            const gPool = season.boostGoods.filter(g => CITIES.some(c => next[c.id]?.[g]))
            const g = gPool[Math.floor(Math.random() * gPool.length)]
            if (g) {
              const cPool = CITIES.filter(c => next[c.id]?.[g])
              const c = cPool[Math.floor(Math.random() * cPool.length)]
              if (c) { cid = c.id; gid = g }
            }
          }
          if (!cid || !gid) {
            const cityIds = Object.keys(next)
            cid = cityIds[Math.floor(Math.random() * cityIds.length)]
            const gids = Object.keys(next[cid])
            gid = gids[Math.floor(Math.random() * gids.length)]
          }
          const m = next[cid][gid]
          next[cid] = { ...next[cid], [gid]: { ...m, spike: 0.55 + Math.random() * 0.7 } }
          picks.push(`${CITY_BY_ID[cid].name}·${GOOD_BY_ID[gid].name}`)
        }
        s.markets = next
        pushLog(s, `紧缺行情刷新：${picks.join('、')} 价格暴涨`, 'info')
      }

      // 商情事件：到期解除 / 定时制造丰产·抢购·封锁（v1.3.0）
      s.newsTimer -= dt
      {
        let evChanged = false
        const evNext: Record<string, CityEvent> = {}
        for (const [cid, ev] of Object.entries(s.cityEvents)) {
          if (ev.until > s.clock) evNext[cid] = ev
          else {
            evChanged = true
            pushLog(s, `${CITY_BY_ID[cid]?.name ?? '某港'}的${CITY_EVENT_INFO[ev.kind]?.name ?? '商情'}结束，市场恢复平常`, 'info')
          }
        }
        if (evChanged) s.cityEvents = evNext
      }
      if (s.newsTimer <= 0) {
        s.newsTimer += CITY_EVENT_CYCLE * (0.8 + Math.random() * 0.4)
        if (Object.keys(s.cityEvents).length < CITY_EVENT_MAX && Math.random() < 0.75) {
          const pool = CITIES.filter(c => c.id !== s.cityId && !s.cityEvents[c.id])
          const city = pool[Math.floor(Math.random() * pool.length)]
          if (city) {
            const r = Math.random()
            const kind: CityEventKind = r < 0.4 ? 'boom' : r < 0.75 ? 'shortage' : r < 0.9 ? 'blockade' : 'festival'
            const goodId = kind === 'boom'
              ? city.exports[Math.floor(Math.random() * city.exports.length)] ?? ''
              : kind === 'shortage' || kind === 'festival'
                ? city.imports[Math.floor(Math.random() * city.imports.length)] ?? ''
                : ''
            const until = s.clock + CITY_EVENT_DURATION[0] + Math.random() * (CITY_EVENT_DURATION[1] - CITY_EVENT_DURATION[0])
            s.cityEvents = { ...s.cityEvents, [city.id]: { kind, goodId, until } }
            const info = CITY_EVENT_INFO[kind]
            const label = goodId ? `：${GOOD_BY_ID[goodId].name}` : ''
            pushToast(s, info.icon, `${city.name} ${info.name}${label}`, kind === 'blockade' ? 'bad' : 'good')
            pushLog(s, `【商情快报】${city.name}进入${info.name}${label} —— ${info.desc}`, 'info')
          }
        }
      }

      // 限时委托：过期清理 / 定时补充委托板（v1.3.0）
      s.orderTimer -= dt
      {
        let expired = false
        const alive: TradeOrder[] = []
        for (const o of s.orders) {
          if (o.deadline > s.clock) { alive.push(o); continue }
          expired = true
          if (o.taken) {
            pushToast(s, 'hourglass', `委托超时：${GOOD_BY_ID[o.goodId]?.name ?? '货物'}未能送到 ${CITY_BY_ID[o.toCity]?.name ?? '目的地'}`, 'bad')
            pushLog(s, `委托超时失效：${GOOD_BY_ID[o.goodId]?.name} → ${CITY_BY_ID[o.toCity]?.name}`, 'bad')
          }
        }
        if (expired) s.orders = alive
      }
      if (s.orderTimer <= 0) {
        s.orderTimer += ORDER_CYCLE * (0.8 + Math.random() * 0.4)
        // 委托板容量只按「未接的单」计算，已接单不占板位
        let boardCount = s.orders.filter(o => !o.taken).length
        const fresh: TradeOrder[] = []
        for (let i = 0; i < 2 && boardCount + fresh.length < ORDER_BOARD_MAX; i++) {
          const o = genOrder(s)
          if (o) fresh.push(o)
        }
        if (fresh.length) {
          boardCount += fresh.length
          s.orders = [...s.orders, ...fresh]
          pushLog(s, `委托板更新：新增 ${fresh.length} 张限时委托（板上共 ${boardCount} 张）`, 'info')
        }
      }

      // 海事悬赏（v1.4.0）：过期作废 / 定时发布新悬赏
      s.bountyTimer -= dt
      if (s.bounty) {
        if (s.bounty.deadline <= s.clock) {
          const gone = PIRATE_BY_ID[s.bounty.pirateId]?.name ?? '海盗'
          s.bounty = null
          s.bountyTimer = BOUNTY_CYCLE * 0.5
          pushLog(s, `海事悬赏过期：${gone}逃之夭夭，赏金作废`, 'info')
        }
      } else if (s.bountyTimer <= 0) {
        s.bountyTimer += BOUNTY_CYCLE * (0.8 + Math.random() * 0.4)
        const pirate = PIRATES[Math.floor(Math.random() * PIRATES.length)]
        const cityPool = CITIES.filter(c => s.visited.includes(c.id))
        const city = cityPool[Math.floor(Math.random() * cityPool.length)] ?? CITY_BY_ID[s.cityId]
        const rate = BOUNTY_RATE[0] + Math.random() * (BOUNTY_RATE[1] - BOUNTY_RATE[0])
        s.bounty = {
          pirateId: pirate.id,
          cityId: city.id,
          reward: Math.round(pirate.strength * rate),
          deadline: s.clock + BOUNTY_TTL,
        }
        pushToast(s, 'pirate', `海事悬赏：${pirate.name}（战力 ${pirate.strength}），赏金 ${s.bounty.reward.toLocaleString()} 金`, 'info')
        pushLog(s, `${city.name}海事署发布悬赏：缉拿 ${pirate.name}，赏金 ${s.bounty.reward.toLocaleString()} 金（${BOUNTY_TTL} 秒内有效，工坊·舰炮组可提升胜率）`, 'info')
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
          gainRep(s, v.to, REP_GAIN_ARRIVE)
          pushToast(s, 'anchor', `抵达 ${to.name}（声望 +${REP_GAIN_ARRIVE}）`, 'good')
          pushLog(s, `从 ${from.name} 抵达 ${to.name}`, 'info')
          // 委托交付引导（v1.5）：抵达城市时若手上有目的地在此的委托，主动提示
          const hereOrders = s.orders.filter(o => o.taken && o.toCity === v.to)
          if (hereOrders.length) {
            const ready = hereOrders.filter(o => (s.cargo[o.goodId]?.qty ?? 0) >= o.qty)
            if (ready.length) pushToast(s, 'truck', `抵达 ${to.name}：${ready.length} 张委托可立即交付`, 'good')
            else pushToast(s, 'truck', `抵达 ${to.name}：${hereOrders.length} 张委托目的地在此，记得备货交付`, 'info')
          }
          // 进港关税（v1.4.0）：投资 2 级半价、3 级全免；现金不足则倾囊缴纳
          const fee = Math.min(s.money, dockingFee(s, v.to, cargoValue(s.cargo, v.to, s.markets, shipNow(s).bonus)))
          if (fee > 0) {
            s.money -= fee
            pushToast(s, 'stamp', `缴纳进港关税 ${fee.toLocaleString()} 金`, 'info')
            pushLog(s, `在${to.name}缴纳进港关税 ${fee.toLocaleString()} 金`, 'info')
          }
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
      // 季风：目的地在当季风覆盖海域 → 航速 +20%
      const season = seasonOf(s.clock)
      const wind = season.windCities.includes(to.id)
      let dur = voyageSeconds(from, to, shipNow(s))
      if (wind) dur = Math.max(5, Math.round(dur / 1.2))
      s.voyage = { from: from.id, to: to.id, elapsed: 0, duration: dur }
      s.eventTimer = 4 + Math.random() * 3
      pushToast(s, wind ? 'ship' : 'anchor', `${wind ? `${season.icon} 乘${season.name}，航速 +20% · ` : ''}起航前往 ${to.name}，预计 ${dur} 秒`, 'info')
      pushLog(s, `从 ${from.name} 起航前往 ${to.name}${wind ? `（${season.name}提速）` : ''}，预计航行 ${dur} 秒`, 'info')
      return s
    }

    // ── 买入 ──────────────────────────────────────────────────────────────────
    case 'BUY': {
      const s: GameState = { ...state, cargo: { ...state.cargo }, stats: { ...state.stats }, toasts: [...state.toasts], markets: { ...state.markets }, goodsBought: state.goodsBought }
      if (s.voyage) { pushToast(s, 'ban', '航行中无法交易', 'bad'); return s }
      const evHere = s.cityEvents[s.cityId]
      if (isBlockaded(evHere)) { pushToast(s, 'barrier', '港口封锁中，暂时无法交易', 'bad'); return s }
      const good = GOOD_BY_ID[action.goodId]
      const cm = s.markets[s.cityId]
      const m = cm?.[good.id]
      if (!m) { pushToast(s, 'ban', `${CITY_BY_ID[s.cityId].name} 不经营 ${good.name}，去原产地看看`, 'bad'); return s }
      const city = CITY_BY_ID[s.cityId]
      // 销地 = 本港是进口商：只买不卖 —— 紧缺即卖价高，玩家只能在此卖出；买入请去产地。
      // 玩家应去产地 BUY 装船出海，再运到销地 SELL，这才是海上贸易的正确流向。
      if (city.imports.includes(good.id)) {
        pushToast(s, 'ban', `${city.name} 紧缺 ${good.name}，本港只买不卖，此处只能卖出`, 'bad'); return s
      }
      // 隐藏特产（v1.4.0）：本港投资 ≥ 1 级才开放购买
      if (isSecretGood(good.id) && SECRET_OF_CITY[s.cityId] === good.id && !secretUnlocked(s, s.cityId)) {
        pushToast(s, 'lock', '隐藏特产：投资本港 1 级「商会伙伴」即可解锁购买', 'bad'); return s
      }
      // 载重按「含船员与船具加成」的有效座舰计算（扩容货舱等因素必须计入）
      const ship = shipNow(s)
      const room = ship.cap - cargoUnits(s.cargo)
      if (m.stock <= 0) { pushToast(s, 'trendDown', `${good.name} 本地已售罄`, 'bad'); return s }
      if (room <= 0) { pushToast(s, 'box', '货舱已满，先去卖出货物', 'bad'); return s }

      const repDisc = repBonusOf(s, s.cityId)
      const invBuy = investBonusOf(s, s.cityId).buy
      const unit = Math.max(8, Math.round(m.price * eventBuyMult(evHere, good.id) * (1 - repDisc / 100) * (1 - invBuy / 100)))
      // 可买数量按「折后单价」计算，否则丰产/声望/投资折扣会被白白浪费
      const afford = Math.max(0, Math.floor(s.money / unit))
      // 数值校验：禁止负数 / NaN / 小数，再夹紧到 m.stock、room、afford 三者最小
      const raw = Number.isFinite(action.qty) ? Math.floor(action.qty) : 0
      const qty = Math.max(0, Math.min(raw, m.stock, room, afford))
      if (qty <= 0) { pushToast(s, 'coin', afford <= 0 ? '金币不足' : `本次最多只能买 ${afford} 件`, 'bad'); return s }

      const cost = qty * unit
      s.money -= cost
      const cur = s.cargo[good.id]
      s.cargo[good.id] = { qty: (cur?.qty ?? 0) + qty, cost: (cur?.cost ?? 0) + cost }
      s.markets[s.cityId] = {
        ...cm,
        [good.id]: { ...m, stock: m.stock - qty, price: Math.round(m.price * (1 + qty * 0.012)) },
      }
      s.stats.trades += 1
      gainRep(s, s.cityId, REP_GAIN_TRADE)
      if (!s.goodsBought.includes(good.id)) s.goodsBought = [...s.goodsBought, good.id]
      pushToast(s, 'loadIn', `买入 ${good.name} ×${qty}，支出 ${cost.toLocaleString()} 金${repDisc > 0 ? `（声望 -${repDisc}%）` : ''}`, 'info')
      return s
    }

    // ── 卖出 ──────────────────────────────────────────────────────────────────
    case 'SELL': {
      const s: GameState = { ...state, cargo: { ...state.cargo }, stats: { ...state.stats }, toasts: [...state.toasts], markets: { ...state.markets }, goodsSold: state.goodsSold, sellLog: state.sellLog }
      if (s.voyage) { pushToast(s, 'ban', '航行中无法交易', 'bad'); return s }
      const evSell = s.cityEvents[s.cityId]
      if (isBlockaded(evSell)) { pushToast(s, 'barrier', '港口封锁中，暂时无法交易', 'bad'); return s }
      const good = GOOD_BY_ID[action.goodId]
      const cm = s.markets[s.cityId]
      const m = cm?.[good.id]
      if (!m) { pushToast(s, 'ban', `${CITY_BY_ID[s.cityId].name} 不经营 ${good.name}，运往别处看看`, 'bad'); return s }
      const city = CITY_BY_ID[s.cityId]
      // ── 核心贸易规则：同一种货，本港要么「只卖不买」（产地），要么「只买不卖」（销地）──
      // 1) 产地（特产）：本港出口商自己就在卖这种货 → 只卖不买，不买玩家手里的货
      //    （否则可在产地「买入 → 原地卖回」，白嫖船只利润加成）
      if (city.exports.includes(good.id)) {
        pushToast(s, 'ban', `${city.name} 是 ${good.name} 的产地，本港只卖不买`, 'bad'); return s
      }
      // 2) 销地（紧缺）：本港进口商买价高 → 只买不卖，玩家到这里就是要卖出赚钱
      //    （BUY 已在销地被拦截，所以不存在「同港买入再卖回」的套利空间）
      const ship = shipNow(s)
      const held = s.cargo[good.id]
      if (!held || held.qty <= 0) { pushToast(s, 'box', `货舱里没有 ${good.name}`, 'bad'); return s }
      // 数值校验：禁止负数、NaN、非整数；并夹紧到货舱实际数量
      const raw = Number.isFinite(action.qty) ? Math.floor(action.qty) : 0
      const qty = Math.max(0, Math.min(raw, held.qty))
      const repBonus = repBonusOf(s, s.cityId)
      const invSell = investBonusOf(s, s.cityId).sell
      const unit = Math.round(sellPrice(good, cm, ship.bonus + repBonus + invSell) * eventSellMult(evSell, good.id))
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
      gainRep(s, s.cityId, REP_GAIN_TRADE)
      if (!s.goodsSold.includes(good.id)) s.goodsSold = [...s.goodsSold, good.id]
      s.stats.profit += profit
      s.stats.best = Math.max(s.stats.best, profit)
      // ── 记录卖出流水（图鉴「出售记录」用）──
      s.seq += 1
      s.sellLog = [{ id: s.seq, t: s.clock, cityId: s.cityId, goodId: good.id, qty, unit, revenue, profit }, ...s.sellLog].slice(0, 120)
      pushToast(
        s,
        profit >= 0 ? 'purse' : 'purse',
        `${good.name} ×${qty} 卖出 +${revenue.toLocaleString()} 金（${profit >= 0 ? '盈利' : '亏损'} ${Math.abs(profit).toLocaleString()}${repBonus > 0 ? `，声望 +${repBonus}%` : ''}）`,
        profit >= 0 ? 'good' : 'bad',
      )
      pushLog(s, `在 ${CITY_BY_ID[s.cityId].name} 卖出 ${good.name} ×${qty}，${profit >= 0 ? '盈利' : '亏损'} ${Math.abs(profit).toLocaleString()} 金`, profit >= 0 ? 'good' : 'bad')
      return s
    }

    // ── 一键清仓 ──────────────────────────────────────────────────────────────
    case 'SELL_ALL': {
      let s = state
      if (isBlockaded(state.cityEvents[state.cityId])) {
        s = { ...s, toasts: [...s.toasts] }
        pushToast(s, 'barrier', '港口封锁中，暂时无法交易', 'bad')
        return s
      }
      const ids = Object.keys(s.cargo)
      if (!ids.length) {
        const t = [...s.toasts]
        s = { ...s, toasts: t }
        pushToast(s, 'box', '货舱是空的', 'bad')
        return s
      }
      const sellable = ids.filter(gid => {
        if (!s.cargo[gid] || !s.markets[s.cityId]?.[gid]) return false
        // 只有产地不回购（本港只卖不买）；销地是紧缺高价收购地，能卖就卖
        const c = CITY_BY_ID[s.cityId]
        if (c.exports.includes(gid)) return false
        return true
      })
      const blocked = ids.filter(gid => !sellable.includes(gid))
      for (const gid of sellable) {
        s = reducer(s, { type: 'SELL', goodId: gid, qty: s.cargo[gid]?.qty ?? 0 })
      }
      if (blocked.length) {
        s = { ...s, toasts: [...s.toasts] }
        pushToast(s, 'box', `${blocked.map(g => GOOD_BY_ID[g].name).join('、')} 本港不买（产地），已保留`, 'info')
      }
      return s
    }

    // ── 买船 ──────────────────────────────────────────────────────────────────
    case 'BUY_SHIP': {
      const s: GameState = { ...state, ownedShips: [...state.ownedShips], toasts: [...state.toasts] }
      const ship = SHIPS.find(x => x.id === action.shipId)
      if (!ship || s.ownedShips.includes(ship.id)) return state
      if (s.money < ship.cost) { pushToast(s, 'coin', `金币不足，还差 ${(ship.cost - s.money).toLocaleString()} 金`, 'bad'); return s }
      s.money -= ship.cost
      s.ownedShips = [...s.ownedShips, ship.id]
      s.shipId = ship.id
      pushToast(s, 'ship', `购入 ${ship.name}！`, 'good')
      pushLog(s, `购入新船：${ship.name}（载重 ${ship.cap}，利润 +${ship.bonus}%）`, 'good')
      return s
    }

    // ── 雇佣船员 ──────────────────────────────────────────────────────────────
    case 'HIRE_CREW': {
      const c = CREW_BY_ID[action.crewId]
      if (!c || state.hiredCrew.includes(c.id)) return state
      // 招募限制：人必须亲自到对应港口的酒馆
      if (state.cityId !== c.cityId) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s0, 'ban', `${c.name} 只在 ${CITY_BY_ID[c.cityId].name} 的酒馆招募`, 'bad')
        return s0
      }
      if (state.money < c.cost) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s0, 'coin', `金币不足，还差 ${(c.cost - state.money).toLocaleString()} 金`, 'bad')
        return s0
      }
      const s: GameState = {
        ...state,
        money: state.money - c.cost,
        hiredCrew: [...state.hiredCrew, c.id],
        toasts: [...state.toasts],
      }
      pushToast(s, 'exchange', `${c.name} 登船了！${c.speed ? `航速+${c.speed}% ` : ''}${c.trade ? `利润+${c.trade}%` : ''}`.trim(), 'good')
      pushLog(s, `在 ${CITY_BY_ID[c.cityId].name} 雇佣了${c.role}「${c.name}」`, 'good')
      return s
    }

    // ── 进修课程（v1.7）：在所选课程间分配养成等级，总等级封顶 CREW_MAX_LEVEL ──
    case 'TRAIN_CREW': {
      const c = CREW_BY_ID[action.crewId]
      const course = CREW_COURSES[action.courseId]
      if (!c || !course || !state.hiredCrew.includes(c.id) || !c.courses.includes(action.courseId)) return state
      const total = crewTotalLevelOf(state, c.id)
      if (total >= CREW_MAX_LEVEL) return state
      const cur = crewCourseLevelOf(state, c.id, action.courseId)
      const cost = crewTrainCost(total)
      if (state.money < cost) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s0, 'coin', `金币不足，还差 ${(cost - state.money).toLocaleString()} 金`, 'bad')
        return s0
      }
      const s: GameState = {
        ...state,
        money: state.money - cost,
        crewCourses: { ...state.crewCourses, [c.id]: { ...state.crewCourses[c.id], [action.courseId]: cur + 1 } },
        toasts: [...state.toasts],
      }
      pushToast(s, 'sparkles', `${c.name} 修习「${course.name}」至 Lv.${cur + 1}（${course.speed ? `航速+${course.speed}% ` : ''}${course.trade ? `利润+${course.trade}%` : ''}）`.trim(), 'good')
      pushLog(s, `在酒馆让${c.role}「${c.name}」修习「${course.name}」（Lv.${cur + 1}）`, 'good')
      return s
    }

    // ── 赠送礼物（v1.7）：买性格定制礼物，送对大涨、送错下跌 ──────────────────
    case 'GIFT_CREW': {
      const c = CREW_BY_ID[action.crewId]
      const gift = CREW_GIFTS.find(g => g.id === action.giftId)
      if (!c || !gift || !state.hiredCrew.includes(c.id)) return state
      if (state.money < gift.cost) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s0, 'coin', `金币不足，还差 ${(gift.cost - state.money).toLocaleString()} 金`, 'bad')
        return s0
      }
      const favor = state.crewFavor[action.crewId] ?? 0
      const likeHit = gift.tags.filter(t => c.likes.includes(t)).length
      const hateHit = gift.tags.filter(t => c.dislikes.includes(t)).length
      let delta: number
      let note: string
      if (hateHit > 0) { delta = -3; note = '似乎不太对胃口' }
      else if (likeHit > 0) { delta = 2 + likeHit; note = likeHit >= 2 ? '正合心意！' : '眉开眼笑' }
      else { delta = 1; note = '礼貌收下' }
      const nf = Math.max(0, Math.min(CREW_FAVOR_MAX, favor + delta))
      const s: GameState = {
        ...state,
        money: state.money - gift.cost,
        crewFavor: { ...state.crewFavor, [action.crewId]: nf },
        toasts: [...state.toasts],
      }
      const tag = nf >= CREW_FAVOR_MAX ? '情同手足' : delta > 0 ? `好感 +${delta}` : `好感 ${delta}`
      pushToast(s, 'gift', `送给 ${c.name}「${gift.name}」，${note}（${tag}）`, delta > 0 ? 'good' : 'bad')
      pushLog(s, `在酒馆赠${c.role}「${c.name}」${gift.name}（${note}）`, delta > 0 ? 'good' : 'bad')
      // 好感跨过故事阈值：解锁一段往事（酒馆卡片可读全文）
      const def = CREW_STORIES[c.id]
      if (def && delta > 0) {
        const unlocked = def.stories.find(st => favor < st.at && nf >= st.at)
        if (unlocked) {
          pushToast(s, 'book', `${c.name} 说起了一段往事……（酒馆卡片可读）`, 'info')
          pushLog(s, `【${c.name}·往事】${unlocked.text}`, 'info')
        }
      }
      return s
    }

    // ── 购置宅邸（v1.6）：长期金币消耗口，按城提供交易优惠 ──────────────────
    case 'BUY_HOUSE': {
      const def = HOUSES[action.cityId]
      const lv = state.houses[action.cityId] ?? 0
      if (!def || lv >= HOUSE_STAGE_NAMES.length || state.cityId !== action.cityId) return state
      const cost = HOUSE_COSTS[lv]
      if (state.money < cost) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s0, 'coin', `金币不足，还差 ${(cost - state.money).toLocaleString()} 金`, 'bad')
        return s0
      }
      const city = CITY_BY_ID[action.cityId]
      const s: GameState = {
        ...state,
        money: state.money - cost,
        houses: { ...state.houses, [action.cityId]: lv + 1 },
        toasts: [...state.toasts],
      }
      pushToast(s, 'city', `${city.name}·${def.base}（${HOUSE_STAGE_NAMES[lv]}）置办完成`, 'good')
      pushLog(s, `在 ${city.name} 置办了${def.base}（${HOUSE_STAGE_NAMES[lv]}）`, 'good')
      return s
    }

    case 'SELECT_SHIP': {
      if (!state.ownedShips.includes(action.shipId)) return state
      const s: GameState = { ...state, shipId: action.shipId, toasts: [...state.toasts] }
      if (cargoUnits(s.cargo) > shipNow(s).cap) {
        pushToast(s, 'box', '该船载重不足，先清掉部分货物', 'bad')
        return state
      }
      pushToast(s, 'anchor', `已换乘 ${shipOf(action.shipId).name}`, 'info')
      return s
    }

    // ── 给船取名 ─────────────────────────────────────────────────────────────
    case 'SET_SHIP_NAME': {
      // 去掉前后空白，夹紧到 12 字符，过滤掉 HTML/控制字符
      const cleaned = action.name
        .replace(/[ -]/g, '')   // 控制字符
        .replace(/[<>"'&\\]/g, '') // 防止注入/引号
        .trim()
        .slice(0, 12)
      if (cleaned === state.shipName) return state
      const s: GameState = { ...state, shipName: cleaned }
      if (cleaned) pushLog(s, `你给船取了个新名字：${cleaned}`, 'info')
      return s
    }

    // ── 加速 ──────────────────────────────────────────────────────────────────
    case 'USE_BOOST': {
      const s: GameState = { ...state, toasts: [...state.toasts] }
      if (!s.voyage) { pushToast(s, 'ban', '当前没有航行任务', 'bad'); return s }
      if (s.boost <= 0) { pushToast(s, 'ticket', '加速卡不足', 'bad'); return s }
      const v = s.voyage
      const remain = Math.max(0, v.duration - v.elapsed)
      s.boost -= 1
      s.voyage = { ...v, elapsed: v.elapsed + remain * 0.5 }
      pushToast(s, 'bolt', `使用加速卡，剩余航程减半`, 'good')
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
      pushToast(s, 'trophy', `${m.label}：+${m.gold.toLocaleString()} 金，加速卡 ×${m.boost}`, 'good')
      pushLog(s, `达成阶段目标「${m.label}」`, 'good')
      return s
    }

    // ── 领取传奇功勋 ──────────────────────────────────────────────────────────
    case 'CLAIM_LEGEND': {
      const l = LEGENDS.find(x => x.id === action.id)
      if (!l || state.legendsClaimed.includes(l.id)) return state
      if (legendValue(state, l) < l.target) return state
      const s: GameState = {
        ...state,
        legendsClaimed: [...state.legendsClaimed, l.id],
        legendsSeen: state.legendsSeen.includes(l.id) ? state.legendsSeen : [...state.legendsSeen, l.id],
        toasts: [...state.toasts],
      }
      s.money += l.gold
      s.boost += l.boost
      if (allLegendsDone(s)) {
        s.victorySeen = false
        pushToast(s, 'crown', `传奇功勋全数达成！加冕「${LEGEND_TITLE}」`, 'good')
        pushLog(s, `集齐全部传奇功勋，加冕「${LEGEND_TITLE}」`, 'good')
      } else {
        pushToast(s, 'trophy', `${l.label}：+${l.gold.toLocaleString()} 金，加速卡 ×${l.boost}`, 'good')
        pushLog(s, `达成传奇功勋「${l.label}」`, 'good')
      }
      return s
    }

    // ── 领取船员委托 ──────────────────────────────────────────────────────────
    case 'CLAIM_CREW_QUEST': {
      const q = CREW_QUESTS.find(x => x.id === action.id)
      if (!q || !crewQuestClaimable(state, q)) return state
      const s: GameState = {
        ...state,
        crewQuestsClaimed: [...state.crewQuestsClaimed, q.id],
        crewQuestsSeen: state.crewQuestsSeen.includes(q.id) ? state.crewQuestsSeen : [...state.crewQuestsSeen, q.id],
        toasts: [...state.toasts],
      }
      s.money += q.gold
      s.boost += q.boost
      const crew = CREW_BY_ID[q.crewId]
      pushToast(s, 'scroll', `${crew.name}：「${q.title}」完成，+${q.gold.toLocaleString()} 金`, 'good')
      pushLog(s, `完成 ${crew.name} 的委托「${q.title}」`, 'good')
      return s
    }

    // ── 购买船具（永久装备） ───────────────────────────────────────────────────
    case 'BUY_EQUIP': {
      const e = EQUIP_BY_ID[action.id]
      if (!e || state.equipOwned.includes(e.id)) return state
      if (e.requireShip && !state.ownedShips.includes(e.requireShip)) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        const shipName = SHIPS.find(x => x.id === e.requireShip)?.name ?? '指定船只'
        pushToast(s0, 'lock', `${e.name} 需要 ${shipName}才能安装`, 'bad')
        return s0
      }
      if (state.money < e.cost) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s0, 'coin', `金币不足，还差 ${(e.cost - state.money).toLocaleString()} 金`, 'bad')
        return s0
      }
      const s: GameState = {
        ...state,
        money: state.money - e.cost,
        equipOwned: [...state.equipOwned, e.id],
        toasts: [...state.toasts],
      }
      pushToast(s, 'anvil', `${e.name}安装完毕：${e.desc}`, 'good')
      pushLog(s, `船坞工坊购入船具「${e.name}」（${e.desc}）`, 'good')
      return s
    }

    // ── 购买补给（消耗品，可叠加） ─────────────────────────────────────────────
    case 'BUY_SUPPLY': {
      const def = SUPPLY_BY_ID[action.id]
      if (!def) return state
      const raw = Number.isFinite(action.qty) ? Math.floor(action.qty) : 0
      const qty = Math.max(0, Math.min(raw, 20))
      if (qty <= 0) return state
      const cost = def.cost * qty
      if (state.money < cost) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s0, 'coin', `金币不足，还差 ${(cost - state.money).toLocaleString()} 金`, 'bad')
        return s0
      }
      const s: GameState = {
        ...state,
        money: state.money - cost,
        supplies: { ...state.supplies, [def.id]: Math.min(99, supplyCount(state, def.id) + qty) },
        toasts: [...state.toasts],
      }
      pushToast(s, def.icon, `${def.name} ×${qty} 已装船（现存 ${s.supplies[def.id]}）`, 'good')
      pushLog(s, `补给上船：${def.name} ×${qty}`, 'info')
      return s
    }

    // ── 使用补给（手动类：朗姆酒桶 → 剩余航程 -40%） ───────────────────────────
    case 'USE_SUPPLY': {
      const s: GameState = { ...state, toasts: [...state.toasts] }
      const def = SUPPLY_BY_ID[action.id]
      if (!def || def.use !== 'manual') return state
      if (!s.voyage) { pushToast(s, 'ban', '当前没有航行任务', 'bad'); return s }
      if (supplyCount(s, def.id) <= 0) { pushToast(s, 'box', `${def.name}库存不足`, 'bad'); return s }
      useSupply(s, def.id)
      const v = s.voyage
      const remain = Math.max(0, v.duration - v.elapsed)
      s.voyage = { ...v, elapsed: v.elapsed + remain * 0.4 }
      pushToast(s, 'supRum', '朗姆酒开桶！船员士气大振，剩余航程 -40%', 'good')
      pushLog(s, '使用朗姆酒桶：剩余航程缩短 40%', 'good')
      return s
    }

    // ── 港口投资（v1.7）：每港 3 个地区专属项目，自由选择先投哪个 ──────────────
    case 'INVEST': {
      const s: GameState = { ...state, invest: { ...state.invest }, toasts: [...state.toasts] }
      if (s.voyage) { pushToast(s, 'ban', '航行途中无法办理投资，靠港后再来', 'bad'); return s }
      const def = (INVEST_PROJECTS[s.cityId] ?? []).find(d => d.id === action.projectId)
      if (!def) return state
      if ((s.invest[s.cityId]?.[def.id] ?? 0) > 0) { pushToast(s, 'hall', `「${def.name}」已经投过了`, 'info'); return s }
      if (s.money < def.cost) {
        pushToast(s, 'coin', `金币不足，还差 ${(def.cost - s.money).toLocaleString()} 金`, 'bad')
        return s
      }
      const lvlBefore = investLevelOf(s, s.cityId)
      s.money -= def.cost
      s.invest = { ...s.invest, [s.cityId]: { ...s.invest[s.cityId], [def.id]: 1 } }
      const bonus = investBonusOf(s, s.cityId)
      gainRep(s, s.cityId, 10)
      const secret = SECRET_OF_CITY[s.cityId]
      const unlockNote = lvlBefore === 0 && secret ? `，解锁隐藏特产「${GOOD_BY_ID[secret].name}」` : ''
      pushToast(s, 'hall', `${CITY_BY_ID[s.cityId].name}「${def.name}」投资落定${unlockNote}`, 'good')
      pushLog(s, `在${CITY_BY_ID[s.cityId].name}投资「${def.name}」（${def.cost.toLocaleString()} 金）：买入 -${bonus.buy}% · 卖出 +${bonus.sell}% · 每周期分红 ${bonus.dividend} 金${unlockNote}`, 'good')
      return s
    }

    // ── 接取限时委托（v1.3.0）────────────────────────────────────────────────
    case 'ACCEPT_ORDER': {
      const o = state.orders.find(x => x.id === action.id)
      if (!o || o.taken) return state
      const s: GameState = { ...state, toasts: [...state.toasts] }
      if (s.voyage) { pushToast(s, 'ban', '航行途中无法接单，靠港后到市政厅办理', 'bad'); return s }
      if (o.fromCity !== s.cityId) { pushToast(s, 'ban', '委托只能在其发布的港口接取', 'bad'); return s }
      if (s.clock > o.deadline) { pushToast(s, 'clock', '该委托已过期', 'bad'); return s }
      if (s.orders.filter(x => x.taken).length >= ORDER_ACTIVE_MAX) {
        pushToast(s, 'scroll', `同时最多接 ${ORDER_ACTIVE_MAX} 张委托`, 'bad')
        return s
      }
      s.orders = s.orders.map(x => x.id === action.id ? { ...x, taken: true } : x)
      pushToast(s, 'scroll', `接下委托：${GOOD_BY_ID[o.goodId].name} ×${o.qty} → ${CITY_BY_ID[o.toCity].name}`, 'good')
      pushLog(s, `接下限时委托：在${CITY_BY_ID[o.fromCity].name}装运 ${GOOD_BY_ID[o.goodId].name} ×${o.qty}，限期送往 ${CITY_BY_ID[o.toCity].name}`, 'info')
      return s
    }

    // ── 交付委托（v1.3.0）────────────────────────────────────────────────────
    case 'DELIVER_ORDER': {
      const o = state.orders.find(x => x.id === action.id)
      if (!o || !o.taken) return state
      // 先校验再动状态：任何一项不满足都必须原样保留委托单（否则会在错误港口把单子弄丢）
      if (state.cityId !== o.toCity) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s0, 'ban', `需在 ${CITY_BY_ID[o.toCity].name} 交付`, 'bad')
        return s0
      }
      if (state.clock > o.deadline) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s0, 'clock', '委托已过期', 'bad')
        return s0
      }
      const held = state.cargo[o.goodId]
      if (!held || held.qty < o.qty) {
        const s0: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s0, 'box', `需要 ${GOOD_BY_ID[o.goodId].name} ×${o.qty}（货舱现有 ${held?.qty ?? 0}）`, 'bad')
        return s0
      }
      const s: GameState = {
        ...state,
        cargo: { ...state.cargo },
        orders: state.orders.filter(x => x.id !== action.id),
        stats: { ...state.stats },
        toasts: [...state.toasts],
      }
      const costPart = Math.round(held.cost * (o.qty / held.qty))
      const remain = held.qty - o.qty
      if (remain <= 0) {
        const next = { ...s.cargo }
        delete next[o.goodId]
        s.cargo = next
      } else {
        s.cargo[o.goodId] = { qty: remain, cost: held.cost - costPart }
      }
      s.money += o.reward
      const profit = o.reward - costPart
      s.stats.profit += profit
      s.stats.best = Math.max(s.stats.best, profit)
      s.stats.ordersDelivered = (s.stats.ordersDelivered ?? 0) + 1
      gainRep(s, o.toCity, 12)
      pushToast(s, 'box', `委托完成！${GOOD_BY_ID[o.goodId].name} ×${o.qty} 交付，+${o.reward.toLocaleString()} 金`, 'good')
      pushLog(s, `在${CITY_BY_ID[o.toCity].name}交付委托：${GOOD_BY_ID[o.goodId].name} ×${o.qty}，报酬 ${o.reward.toLocaleString()} 金（盈利 ${profit.toLocaleString()}）`, 'good')
      // 委托方一高兴，塞给你一张残破的海图（v1.4.0）
      maybeFindFrag(s, 0.25)
      return s
    }

    // ── 放弃委托（v1.3.0）────────────────────────────────────────────────────
    case 'ABANDON_ORDER': {
      const o = state.orders.find(x => x.id === action.id)
      if (!o || !o.taken) return state
      const s: GameState = {
        ...state,
        orders: state.orders.filter(x => x.id !== action.id),
        toasts: [...state.toasts],
      }
      pushToast(s, 'trash', `已放弃委托：${GOOD_BY_ID[o.goodId].name} → ${CITY_BY_ID[o.toCity].name}`, 'info')
      pushLog(s, `放弃委托：${GOOD_BY_ID[o.goodId].name} → ${CITY_BY_ID[o.toCity].name}`, 'info')
      return s
    }

    // ── 银行：借款（v1.4.0）──────────────────────────────────────────────────
    case 'LOAN_BORROW': {
      const s: GameState = { ...state, toasts: [...state.toasts] }
      if (s.voyage) { pushToast(s, 'ban', '航行途中无法办理银行业务，靠港后再来', 'bad'); return s }
      const limit = creditLimit(s)
      const raw = Number.isFinite(action.amount) ? Math.floor(action.amount) : 0
      const amt = Math.min(raw, limit)
      if (amt <= 0) { pushToast(s, 'bank', '信用额度不足，先偿还部分债务或积累资产', 'bad'); return s }
      s.money += amt
      s.debt += amt
      pushToast(s, 'bank', `借入 ${amt.toLocaleString()} 金，当前债务 ${s.debt.toLocaleString()} 金`, 'info')
      pushLog(s, `银行借款 ${amt.toLocaleString()} 金，债务合计 ${s.debt.toLocaleString()} 金（每市场周期计息 0.15%，债台高筑会被强制清算）`, 'info')
      return s
    }

    // ── 银行：还款（v1.4.0）──────────────────────────────────────────────────
    case 'LOAN_REPAY': {
      const s: GameState = { ...state, toasts: [...state.toasts] }
      if (s.voyage) { pushToast(s, 'ban', '航行途中无法办理银行业务，靠港后再来', 'bad'); return s }
      if (s.debt <= 0) return state
      const raw = Number.isFinite(action.amount) ? Math.floor(action.amount) : 0
      const amt = Math.max(0, Math.min(raw, s.debt, s.money))
      if (amt <= 0) { pushToast(s, 'coin', '金币不足，无法偿还', 'bad'); return s }
      s.money -= amt
      s.debt -= amt
      pushToast(s, 'bank', `偿还 ${amt.toLocaleString()} 金${s.debt === 0 ? '，债务已清空！' : `，剩余债务 ${s.debt.toLocaleString()} 金`}`, s.debt === 0 ? 'good' : 'info')
      pushLog(s, `银行还款 ${amt.toLocaleString()} 金${s.debt === 0 ? '，债务全部结清' : `，剩余 ${s.debt.toLocaleString()} 金`}`, 'good')
      return s
    }

    // ── 出击海盗悬赏（v1.4.0）────────────────────────────────────────────────
    case 'RAID': {
      const s: GameState = {
        ...state,
        stats: { ...state.stats },
        toasts: [...state.toasts],
        supplies: { ...state.supplies },
      }
      if (s.voyage) { pushToast(s, 'ban', '航行途中无法出击，靠港后再来', 'bad'); return s }
      const b = s.bounty
      if (!b || b.deadline <= state.clock) return state
      const pirate = PIRATE_BY_ID[b.pirateId]
      if (!pirate) return state
      if (supplyCount(s, 's_cannon') <= 0) {
        pushToast(s, 'target', '出击需要至少 1 组舰炮组（船坞·工坊有售）', 'bad')
        return s
      }
      // 先按满弹药估算胜率，再消耗一组舰炮（弹药物资打光了）
      const rate = raidWinRate(s)
      useSupply(s, 's_cannon')
      const atCity = CITY_BY_ID[b.cityId]
      // 宅邸交融（v1.6）：在悬赏港置办的宅邸提供海盗情报 / 事后打点
      const houseLv = houseLevelOf(state, b.cityId)
      const houseBonus = Math.round(b.reward * houseLv * 0.12)
      if (Math.random() < rate) {
        s.money += b.reward + houseBonus
        s.stats.raidsWon = (s.stats.raidsWon ?? 0) + 1
        gainRep(s, b.cityId, 15)
        s.bounty = null
        s.bountyTimer = BOUNTY_CYCLE
        pushToast(s, pirate.icon, `大捷！击溃 ${pirate.name}，缴获赏金 ${(b.reward + houseBonus).toLocaleString()} 金`, 'good')
        const houseNote = houseBonus > 0 ? `（行馆总管的海盗情报加成 +${houseBonus.toLocaleString()} 金）` : ''
        pushLog(s, `出击 ${pirate.name}（战力 ${pirate.strength}）大捷：领取${atCity.name}赏金 ${b.reward.toLocaleString()} 金${houseNote}，声望 +15`, 'good')
        maybeFindFrag(s, 0.6)
      } else {
        const raw = Math.round(s.money * 0.08 * (1 - houseLv * 0.15))
        const loss = Math.min(raw, 30_000)
        s.money -= loss
        const houseNote = houseLv > 0 ? `（行馆管家事后打点，修理费减了 ${houseLv * 15}%）` : ''
        pushToast(s, 'explode', `出击失利！${pirate.name} 击伤船舷，修理费 ${loss.toLocaleString()} 金`, 'bad')
        pushLog(s, `出击 ${pirate.name} 失利：付修理费 ${loss.toLocaleString()} 金${houseNote}，悬赏仍在`, 'bad')
      }
      return s
    }

    // ── 深海秘藏：按图挖掘（v1.4.0）──────────────────────────────────────────
    case 'DIG_TREASURE': {
      const s: GameState = {
        ...state,
        cargo: { ...state.cargo },
        stats: { ...state.stats },
        toasts: [...state.toasts],
      }
      if (s.voyage) { pushToast(s, 'ban', '航行途中无法挖掘，靠港后再来', 'bad'); return s }
      if (s.mapFrags < MAP_FRAGS_NEED || !s.digCity) return state
      if (s.digCity !== s.cityId) {
        pushToast(s, 'map', `沉宝在 ${CITY_BY_ID[s.digCity].name} 外海，先把船开过去`, 'bad')
        return s
      }
      const nth = (s.stats.treasures ?? 0) + 1
      const gold = DIG_BASE_REWARD + (nth - 1) * DIG_STEP_REWARD
      s.money += gold
      s.stats.treasures = nth
      // 神殿珍宝入舱；舱位不够的部分按 1500 金/件就地折现
      const room = shipNow(s).cap - cargoUnits(s.cargo)
      const take = Math.min(DIG_RELIC_QTY, Math.max(0, room))
      if (take > 0) {
        const cur = s.cargo['relic']
        s.cargo['relic'] = { qty: (cur?.qty ?? 0) + take, cost: cur?.cost ?? 0 }
      }
      const cashed = DIG_RELIC_QTY - take
      if (cashed > 0) s.money += cashed * 1_500
      s.mapFrags = 0
      s.digCity = null
      gainRep(s, s.cityId, 20)
      pushToast(s, 'amphora', `挖出沉没神殿宝藏！+${gold.toLocaleString()} 金${take > 0 ? `，珍宝 ×${take} 入舱` : ''}`, 'good')
      pushLog(
        s,
        `在${CITY_BY_ID[s.cityId].name}外海挖出第 ${nth} 处深海秘藏：金币 ${gold.toLocaleString()} + 沉没神殿珍宝 ×${DIG_RELIC_QTY}（${cashed > 0 ? `${cashed} 件舱满折现` : '全部入舱'}），声望 +20`,
        'good',
      )
      return s
    }

    // ── 海盗遭遇抉择（v1.5）──────────────────────────────────────────────────
    case 'RESOLVE_PIRATE': {
      if (!state.pendingEvent) return state
      const s: GameState = {
        ...state,
        stats: { ...state.stats },
        toasts: [...state.toasts],
        supplies: { ...state.supplies },
      }
      if (action.choice === 'cannon') {
        if (supplyCount(s, 's_cannon') <= 0) return state
        useSupply(s, 's_cannon')
        const loot = 600 + Math.round(Math.random() * 1400)
        s.money += loot
        pushToast(s, 'target', `舰炮齐鸣！吓退海盗，缴获 ${loot.toLocaleString()} 金`, 'good')
        pushLog(s, `遭遇海盗：舰炮击退，缴获 ${loot.toLocaleString()} 金`, 'good')
      } else if (action.choice === 'bribe') {
        const fee = Math.min(s.money, Math.max(300, Math.round(s.money * 0.1)))
        s.money -= fee
        pushToast(s, 'coin', `缴纳过路费 ${fee.toLocaleString()} 金，平安通过`, 'info')
        pushLog(s, `遭遇海盗：缴纳过路费 ${fee.toLocaleString()} 金脱身`, 'info')
      } else {
        // 硬拼：无补给，五五开
        if (Math.random() < 0.5) {
          const held = Object.entries(s.cargo).filter(([, c]) => c.qty > 0)
          if (held.length) {
            const [gid, c] = held[Math.floor(Math.random() * held.length)]
            const lost = Math.max(1, Math.round(c.qty * 0.25))
            const remain = c.qty - lost
            const next = { ...s.cargo }
            if (remain <= 0) delete next[gid]
            else next[gid] = { qty: remain, cost: c.cost * (remain / c.qty) }
            s.cargo = next
            pushToast(s, 'pirate', `硬拼失利！海盗劫走 ${GOOD_BY_ID[gid].name} ×${lost}`, 'bad')
            pushLog(s, `遭遇海盗：硬拼失利，损失 ${GOOD_BY_ID[gid].name} ×${lost}`, 'bad')
          } else {
            const fee = Math.min(s.money, 300)
            s.money -= fee
            pushToast(s, 'pirate', `硬拼失利！海盗索要过路费 ${Math.round(fee)} 金`, 'bad')
            pushLog(s, `遭遇海盗：硬拼失利，被勒索 ${Math.round(fee)} 金`, 'bad')
          }
        } else {
          pushToast(s, 'target', '硬拼脱身！船员奋勇击退海盗，货物无损', 'good')
          pushLog(s, '遭遇海盗：硬拼一番，成功脱身', 'good')
        }
      }
      s.pendingEvent = null
      return s
    }

    // ── 购买情报网络 ──────────────────────────────────────────────────────────
    case 'BUY_INTEL': {
      if (state.intelOwned) return state
      if (state.money < INTEL_PRICE) {
        const s: GameState = { ...state, toasts: [...state.toasts] }
        pushToast(s, 'crystal', `情报网络需要 ${INTEL_PRICE} 金`, 'bad')
        return s
      }
      const s: GameState = { ...state, money: state.money - INTEL_PRICE, intelOwned: true, toasts: [...state.toasts] }
      pushToast(s, 'crystal', '情报网络已开通，全球价格一览无余', 'good')
      pushLog(s, `花费 ${INTEL_PRICE} 金开通全球情报网络`, 'info')
      return s
    }

    // ── 每日签到（v1.6.0）─────────────────────────────────────────────────────
    case 'CHECK_IN': {
      const s: GameState = { ...state, stats: { ...state.stats }, toasts: [...state.toasts] }
      if (s.checkin.last === today()) {
        pushToast(s, 'gift', '今天已经签到过了，明天再来', 'info')
        return s
      }
      const streak = s.checkin.last === yesterday() ? s.checkin.streak + 1 : 1
      const reward = checkinReward(streak)
      s.money += reward
      s.checkin = { last: today(), streak }
      pushToast(s, 'gift', `签到成功！连续 ${streak} 天，+${reward} 金`, 'good')
      pushLog(s, `每日签到：连续 ${streak} 天，奖励 ${reward} 金`, 'good')
      return s
    }

    // ── 领取每日目标（v1.6.0）─────────────────────────────────────────────────
    case 'CLAIM_DAILY': {
      const g = state.daily.goals.find(x => x.id === action.id)
      if (!g || g.claimed) return state
      if (dailyGoalValue(state, g) < g.target) return state
      const s: GameState = { ...state, stats: { ...state.stats }, toasts: [...state.toasts] }
      s.money += DAILY_REWARD_GOLD
      s.boost += DAILY_REWARD_BOOST
      s.daily = { ...s.daily, goals: s.daily.goals.map(x => x.id === action.id ? { ...x, claimed: true } : x) }
      pushToast(s, 'gift', `每日目标完成：+${DAILY_REWARD_GOLD} 金，加速卡 ×${DAILY_REWARD_BOOST}`, 'good')
      pushLog(s, `完成每日目标「${g.label}」：+${DAILY_REWARD_GOLD} 金，加速卡 ×${DAILY_REWARD_BOOST}`, 'good')
      return s
    }

    case 'AD_REWARD': {
      const s: GameState = { ...state, toasts: [...state.toasts] }
      s.money += action.amount
      pushToast(s, 'coin', `看广告得奖励 +${action.amount} 金`, 'good')
      pushLog(s, `看广告奖励 ${action.amount} 金`, 'good')
      return s
    }

    case 'AD_REFRESH_MARKET': {
      const s: GameState = {
        ...state,
        markets: evolveMarkets(state.markets),
        marketTimer: MARKET_CYCLE,
        toasts: [...state.toasts],
      }
      pushToast(s, 'gift', '看广告：市场行情已刷新', 'good')
      pushLog(s, '看广告刷新市场行情', 'good')
      return s
    }

    case 'AD_ACCEL_VOYAGE': {
      const s: GameState = { ...state, toasts: [...state.toasts] }
      if (!s.voyage) { pushToast(s, 'ban', '当前没有航行任务', 'bad'); return s }
      const v = s.voyage
      const remain = Math.max(0, v.duration - v.elapsed)
      s.voyage = { ...v, elapsed: v.elapsed + remain * 0.5 }
      pushToast(s, 'bolt', '看广告：剩余航程减半', 'good')
      pushLog(s, '看广告加速航行（剩余航程减半）', 'good')
      return s
    }

    case 'DROP_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }

    case 'RESTART':
      return initialState()

    // ── 读档：直接换成存档里的状态（气泡清空，避免弹出旧提示） ─────────────────
    case 'HYDRATE':
      return { ...action.state, toasts: [] }

    // ── 调试面板：直接改写状态（只在 dev 构建生效） ────────────────────────────
    case 'DEBUG_PATCH': {
      if (!import.meta.env.DEV) return state
      return {
        ...state,
        ...action.patch,
        stats: { ...state.stats, ...(action.stats ?? {}) },
        toasts: [...state.toasts],
      }
    }

    // ── 通关庆祝页关闭（v1.5）─────────────────────────────────────────────────
    case 'CLOSE_VICTORY':
      return { ...state, victorySeen: true }

    default:
      return state
  }
}

// ── 传奇功勋达成提醒（包装 reducer：进度只在这些 action 里变化） ────────────────

const LEGEND_NOTIFY_ACTIONS = new Set<Action['type']>([
  'TICK', 'BUY', 'SELL', 'SELL_ALL', 'BUY_SHIP', 'HIRE_CREW', 'CLAIM', 'HYDRATE',
])

/** 新达成的传奇功勋 / 船员委托弹一次气泡（seen 持久化防重复；一次最多播报 2 条，其余靠导航红点） */
function notifyLegends(s: GameState): GameState {
  const freshLegends = LEGENDS.filter(l => legendClaimable(s, l) && !s.legendsSeen.includes(l.id))
  const freshQuests = CREW_QUESTS.filter(q => crewQuestClaimable(s, q) && !s.crewQuestsSeen.includes(q.id))
  if (!freshLegends.length && !freshQuests.length) return s
  const out: GameState = {
    ...s,
    legendsSeen: [...s.legendsSeen, ...freshLegends.map(l => l.id)],
    crewQuestsSeen: [...s.crewQuestsSeen, ...freshQuests.map(q => q.id)],
    toasts: [...s.toasts],
  }
  const notes: { icon: GlyphName; text: string }[] = [
    ...freshLegends.map((l): { icon: GlyphName; text: string } => ({ icon: 'trophy', text: `传奇功勋「${l.label}」达成，可前往功勋页领取` })),
    ...freshQuests.map((q): { icon: GlyphName; text: string } => ({ icon: 'scroll', text: `${CREW_BY_ID[q.crewId].name}的委托可领取：「${q.title}」` })),
  ]
  for (const n of notes.slice(0, 2)) {
    pushToast(out, n.icon, n.text, 'good')
  }
  return out
}

export function reducer(state: GameState, action: Action): GameState {
  const s = coreReducer(state, action)
  return LEGEND_NOTIFY_ACTIONS.has(action.type) ? notifyLegends(s) : s
}
