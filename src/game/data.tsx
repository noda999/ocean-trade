// ─────────────────────────────────────────────────────────────────────────────
//  远洋贸易 · 静态配置数据
// ─────────────────────────────────────────────────────────────────────────────

import { GoldBar } from '../components/Landmarks'

export interface Good {
  id: string
  name: string
  icon: string | React.ReactElement
  base: number
}

/** 22 + 7 = 29 种可交易货物，base 为全球基准价；每种只在部分港口流通 */
export const GOODS: Good[] = [
  { id: 'silk', name: '丝绸', icon: '🧣', base: 280 },
  { id: 'porcelain', name: '瓷器', icon: '🏺', base: 200 },
  { id: 'tea', name: '茶叶', icon: '🍵', base: 60 },
  { id: 'spice', name: '香料', icon: '🌶️', base: 120 },
  { id: 'cotton', name: '棉花', icon: '☁️', base: 45 },
  { id: 'pearl', name: '珍珠', icon: '⚪', base: 350 },
  { id: 'gold', name: '黄金', icon: <GoldBar size={18} />, base: 520 },
  { id: 'clove', name: '丁香', icon: '🌿', base: 160 },
  { id: 'timber', name: '木材', icon: '🪵', base: 80 },
  { id: 'coffee', name: '咖啡', icon: '☕', base: 110 },
  { id: 'fur', name: '皮草', icon: '🦊', base: 260 },
  { id: 'wool', name: '羊毛', icon: '🐑', base: 55 },
  { id: 'whisky', name: '威士忌', icon: '🥃', base: 170 },
  { id: 'wine', name: '葡萄酒', icon: '🍷', base: 140 },
  { id: 'perfume', name: '香水', icon: '🧴', base: 240 },
  { id: 'grain', name: '谷物', icon: '🌾', base: 42 },
  { id: 'carpet', name: '波斯地毯', icon: '🧶', base: 210 },
  { id: 'rose', name: '玫瑰油', icon: '🌹', base: 190 },
  { id: 'gem', name: '宝石', icon: '💎', base: 620 },
  { id: 'sword', name: '东洋刀', icon: '⚔️', base: 300 },
  { id: 'silver', name: '白银', icon: '🥈', base: 420 },
  { id: 'cacao', name: '可可', icon: '🍫', base: 95 },
  // ── v1.3.0 新增 7 种商品 ──
  { id: 'cheese', name: '奶酪', icon: '🧀', base: 50 },
  { id: 'watch', name: '钟表', icon: '⌚', base: 480 },
  { id: 'nest', name: '燕窝', icon: '🪺', base: 280 },
  { id: 'vanilla', name: '香草', icon: '🌿', base: 220 },
  { id: 'frankincense', name: '乳香', icon: '🌳', base: 320 },
  { id: 'olive', name: '橄榄油', icon: '🫒', base: 75 },
  { id: 'tobacco', name: '烟草', icon: '🍂', base: 130 },
  // ── v1.2.0 新增 20 种商品（每城特产扩充） ──
  { id: 'amber', name: '琥珀', icon: '🟠', base: 260 },
  { id: 'truffle', name: '松露', icon: '🍄', base: 350 },
  { id: 'honey', name: '蜂蜜', icon: '🍯', base: 85 },
  { id: 'saffron', name: '藏红花', icon: '🌺', base: 380 },
  { id: 'caviar', name: '鱼子酱', icon: '🥫', base: 400 },
  { id: 'date', name: '椰枣', icon: '🌴', base: 70 },
  { id: 'indigo', name: '靛蓝', icon: '🫐', base: 150 },
  { id: 'cinnamon', name: '肉桂', icon: '🥮', base: 170 },
  { id: 'paper', name: '宣纸', icon: '📜', base: 130 },
  { id: 'lacquer', name: '漆器', icon: '🥢', base: 310 },
  { id: 'nutmeg', name: '肉豆蔻', icon: '🌰', base: 180 },
  { id: 'sugar', name: '蔗糖', icon: '🍬', base: 75 },
  { id: 'diamond', name: '钻石', icon: '💠', base: 750 },
  { id: 'leather', name: '皮革', icon: '🥾', base: 100 },
  { id: 'alpaca', name: '羊驼毛', icon: '🦙', base: 180 },
  { id: 'salt', name: '海盐', icon: '🧂', base: 55 },
  { id: 'tulip', name: '郁金香', icon: '🌷', base: 160 },
  { id: 'copper', name: '黄铜', icon: '🥉', base: 300 },
  { id: 'seashell', name: '珍珠母', icon: '🐚', base: 90 },
  { id: 'rum', name: '朗姆酒', icon: '🍹', base: 120 },
  // ── v1.4.0 隐藏特产（21 城 · 投资 1 级「商会伙伴」解锁）+ 秘藏珍宝 ──
  { id: 'rune', name: '符文石碑', icon: '🗿', base: 320 },
  { id: 'longbow', name: '英格兰长弓', icon: '🏹', base: 300 },
  { id: 'tapestry', name: '哥特壁毯', icon: '🖼️', base: 340 },
  { id: 'papyrus', name: '纸莎草卷', icon: '📜', base: 280 },
  { id: 'miniature', name: '波斯细密画', icon: '🎨', base: 360 },
  { id: 'scimitar', name: '大马士革弯刀', icon: '🗡️', base: 340 },
  { id: 'sitar', name: '西塔琴', icon: '🎸', base: 300 },
  { id: 'sapphire', name: '锡兰蓝宝石', icon: '🔷', base: 640 },
  { id: 'jade', name: '和田玉雕', icon: '🟩', base: 560 },
  { id: 'armor', name: '武士铠甲', icon: '🛡️', base: 480 },
  { id: 'agarwood', name: '沉香木', icon: '🪵', base: 520 },
  { id: 'batik', name: '巴迪克蜡染', icon: '👘', base: 300 },
  { id: 'mask', name: '部落黄金面具', icon: '🎭', base: 420 },
  { id: 'obsidian', name: '黑曜石镜', icon: '🖤', base: 400 },
  { id: 'sundisc', name: '太阳金盘', icon: '🌞', base: 680 },
  { id: 'guitar', name: '西班牙吉他', icon: '🪕', base: 300 },
  { id: 'delft', name: '代尔夫特蓝陶', icon: '🔵', base: 340 },
  { id: 'incenseburner', name: '阿拉伯香炉', icon: '🪔', base: 360 },
  { id: 'ambergris', name: '龙涎香', icon: '🐋', base: 600 },
  { id: 'elephantegg', name: '象鸟蛋', icon: '🥚', base: 500 },
  { id: 'emerald', name: '哥伦比亚祖母绿', icon: '💚', base: 700 },
  // 深海秘藏奖励品：无产地，只能靠挖掘获得，各名港高价求购
  { id: 'relic', name: '沉没神殿珍宝', icon: '🧿', base: 1_800 },
]

export const GOOD_BY_ID: Record<string, Good> = Object.fromEntries(
  GOODS.map(g => [g.id, g]),
)

export interface City {
  id: string
  name: string
  sub: string
  /** 地图坐标，百分比（0-100） */
  x: number
  y: number
  /** 名称标签放在建筑的哪一侧，避免遮挡 */
  side: 'left' | 'right'
  /** 特产（本地便宜，多为唯一产地） */
  exports: string[]
  /** 紧缺（本地昂贵，本港只买不卖 → 卖价高） */
  imports: string[]
  blurb: string
}

export const CITIES: City[] = [
  {
    id: 'norway', name: '挪威', sub: 'NORWAY', x: 17, y: 12, side: 'right',
    exports: ['timber', 'fur', 'amber'], imports: ['wine', 'coffee', 'tea', 'spice', 'salt', 'sugar'],
    blurb: '峡湾深处，盛产木材与皮草',
  },
  {
    id: 'england', name: '英国', sub: 'ENGLAND', x: 7, y: 30, side: 'right',
    exports: ['wool', 'whisky', 'cheese'], imports: ['tea', 'spice', 'fur', 'carpet', 'nest', 'frankincense', 'truffle', 'caviar', 'sugar', 'alpaca', 'lacquer'],
    blurb: '雾都港埠，羊毛与麦芽威士忌之乡',
  },
  {
    id: 'france', name: '法国', sub: 'FRANCE', x: 17, y: 43, side: 'right',
    exports: ['wine', 'perfume', 'truffle'], imports: ['wool', 'fur', 'silk', 'coffee', 'vanilla', 'olive', 'cinnamon', 'nutmeg', 'diamond', 'leather', 'tulip'],
    blurb: '塞纳河畔，葡萄酒与香水的国度',
  },
  {
    id: 'egypt', name: '埃及', sub: 'EGYPT', x: 29, y: 49, side: 'right',
    exports: ['cotton', 'grain', 'honey'], imports: ['timber', 'wine', 'silver', 'spice', 'frankincense', 'paper', 'rum', 'cinnamon'],
    blurb: '尼罗河畔的粮仓，长绒棉之乡',
  },
  {
    id: 'persia', name: '波斯', sub: 'PERSIA', x: 41, y: 20, side: 'left',
    exports: ['carpet', 'rose', 'saffron', 'caviar'], imports: ['grain', 'pearl', 'gold', 'seashell'],
    blurb: '丝路古国，玫瑰与地毯的故乡',
  },
  {
    id: 'arabia', name: '阿拉伯', sub: 'ARABIA', x: 38, y: 34, side: 'left',
    exports: ['pearl', 'coffee', 'date'], imports: ['timber', 'grain', 'silk', 'porcelain', 'paper'],
    blurb: '沙漠商路的中心，珍珠汇聚之地',
  },
  {
    id: 'india', name: '印度', sub: 'INDIA', x: 53, y: 29, side: 'right',
    exports: ['spice', 'cotton', 'indigo'], imports: ['carpet', 'gem', 'silver', 'clove', 'frankincense', 'date', 'diamond', 'seashell'],
    blurb: '香料与棉花的帝国',
  },
  {
    id: 'srilanka', name: '斯里兰卡', sub: 'SRI LANKA', x: 60, y: 44, side: 'right',
    exports: ['tea', 'gem', 'cinnamon'], imports: ['gold', 'whisky', 'wine', 'cacao', 'honey', 'date'],
    blurb: '印度洋上的宝石与红茶之岛',
  },
  {
    id: 'china', name: '中国', sub: 'CHINA', x: 76, y: 14, side: 'left',
    exports: ['silk', 'porcelain', 'tea', 'paper'], imports: ['pearl', 'clove', 'rose', 'wine', 'nest', 'watch', 'amber', 'saffron', 'copper'],
    blurb: '丝绸与瓷器之乡，海内最富',
  },
  {
    id: 'japan', name: '日本', sub: 'JAPAN', x: 94, y: 34, side: 'left',
    exports: ['sword', 'silver', 'lacquer'], imports: ['silk', 'tea', 'cotton', 'gem', 'watch', 'tobacco', 'caviar', 'salt', 'copper', 'tulip'],
    blurb: '樱花之国，锻造与白银之邦',
  },
  {
    id: 'malacca', name: '马六甲', sub: 'MALACCA', x: 73, y: 56, side: 'right',
    exports: ['clove', 'spice', 'nutmeg'], imports: ['porcelain', 'cotton', 'whisky'],
    blurb: '东西方咽喉，万国商船必经',
  },
  {
    id: 'java', name: '爪哇', sub: 'JAVA', x: 78, y: 75, side: 'left',
    exports: ['coffee', 'clove', 'sugar'], imports: ['silk', 'tea', 'sword'],
    blurb: '火山脚下的千岛之国，咖啡飘香',
  },
  {
    id: 'africa', name: '南非', sub: 'SOUTH AFRICA', x: 19, y: 66, side: 'right',
    exports: ['gold', 'coffee', 'diamond'], imports: ['porcelain', 'whisky', 'gem'],
    blurb: '好望角黄金与宝石海岸',
  },
  {
    id: 'aztec', name: '阿兹特克', sub: 'AZTEC', x: 85, y: 89, side: 'left',
    exports: ['silver', 'cacao', 'leather'], imports: ['silk', 'tea', 'wine', 'vanilla', 'saffron'],
    blurb: '新大陆的白银王国',
  },
  {
    id: 'inca', name: '印加', sub: 'INCA', x: 63, y: 97, side: 'left',
    exports: ['gold', 'gem', 'alpaca'], imports: ['sword', 'perfume', 'wool', 'watch', 'olive'],
    blurb: '云中之城，黄金与宝石之地',
  },
  // ── v1.3.0 新增 6 个港口 ──
  {
    id: 'spain', name: '西班牙', sub: 'SPAIN', x: 8, y: 53, side: 'right',
    exports: ['olive', 'wine', 'salt'], imports: ['spice', 'silk', 'gold', 'cheese', 'leather', 'lacquer'],
    blurb: '伊比利亚半岛，橄榄园与斗牛士的故土',
  },
  {
    id: 'netherlands', name: '荷兰', sub: 'NETHERLANDS', x: 22, y: 25, side: 'right',
    exports: ['cheese', 'watch', 'tulip'], imports: ['silk', 'tea', 'gem', 'wine', 'vanilla', 'tobacco', 'indigo', 'nutmeg', 'alpaca', 'rum'],
    blurb: '低地之国，风车与郁金香，钟表匠之都',
  },
  {
    id: 'oman', name: '阿曼', sub: 'OMAN', x: 42, y: 47, side: 'left',
    exports: ['frankincense', 'pearl', 'copper'], imports: ['timber', 'wine', 'porcelain', 'sword'],
    blurb: '阿拉伯海之门，乳香与珍珠的产地',
  },
  {
    id: 'borneo', name: '婆罗洲', sub: 'BORNEO', x: 79, y: 66, side: 'left',
    exports: ['nest', 'timber', 'seashell'], imports: ['silk', 'wine', 'perfume', 'silver'],
    blurb: '热带雨林深处，金丝燕燕窝与红木之乡',
  },
  {
    id: 'madagascar', name: '马达加斯加', sub: 'MADAGASCAR', x: 44, y: 82, side: 'left',
    exports: ['vanilla', 'coffee', 'rum'], imports: ['silk', 'tea', 'sword', 'whisky', 'honey'],
    blurb: '印度洋上的香草之岛，猴面包树与狐猴',
  },
  {
    id: 'panama', name: '巴拿马', sub: 'PANAMA', x: 72, y: 92, side: 'right',
    exports: ['tobacco', 'silver', 'sugar'], imports: ['silk', 'wine', 'perfume', 'gem'],
    blurb: '两洋咽喉，烟草与白银的新大陆港口',
  },
]

export const CITY_BY_ID: Record<string, City> = Object.fromEntries(
  CITIES.map(c => [c.id, c]),
)

// ── 隐藏特产（v1.4.0）：本港投资 ≥ 1 级解锁挂牌与购买；集中注入，避免散改 21 个城市定义 ──

/** 每座城市的隐藏特产（进 exports，产地价便宜） */
export const SECRET_OF_CITY: Record<string, string> = {
  norway: 'rune', england: 'longbow', france: 'tapestry', egypt: 'papyrus',
  persia: 'miniature', arabia: 'scimitar', india: 'sitar', srilanka: 'sapphire',
  china: 'jade', japan: 'armor', malacca: 'agarwood', java: 'batik',
  africa: 'mask', aztec: 'obsidian', inca: 'sundisc', spain: 'guitar',
  netherlands: 'delft', oman: 'incenseburner', borneo: 'ambergris',
  madagascar: 'elephantegg', panama: 'emerald',
}

/** 隐藏特产的销地（进 imports，高价收购） */
const SECRET_DEMAND: Record<string, string[]> = {
  norway: ['england', 'france', 'netherlands'],
  england: ['france', 'spain', 'netherlands'],
  france: ['england', 'spain', 'netherlands'],
  egypt: ['france', 'england', 'arabia'],
  persia: ['arabia', 'india', 'egypt'],
  arabia: ['persia', 'oman', 'egypt'],
  india: ['persia', 'china', 'srilanka'],
  srilanka: ['india', 'england', 'france'],
  china: ['japan', 'persia', 'netherlands'],
  japan: ['china', 'england', 'france'],
  malacca: ['china', 'arabia', 'japan'],
  java: ['malacca', 'srilanka', 'netherlands'],
  africa: ['france', 'england', 'spain'],
  aztec: ['spain', 'france', 'japan'],
  inca: ['spain', 'france', 'england'],
  spain: ['france', 'england', 'netherlands'],
  netherlands: ['england', 'france', 'japan'],
  oman: ['arabia', 'persia', 'india'],
  borneo: ['china', 'arabia', 'france'],
  madagascar: ['france', 'england', 'china'],
  panama: ['france', 'england', 'japan'],
}

for (const [cid, gid] of Object.entries(SECRET_OF_CITY)) {
  const c = CITY_BY_ID[cid]
  if (c && !c.exports.includes(gid)) c.exports.push(gid)
  for (const icid of SECRET_DEMAND[cid] ?? []) {
    const ic = CITY_BY_ID[icid]
    if (ic && !ic.imports.includes(gid)) ic.imports.push(gid)
  }
}
// 沉没神殿珍宝：只有名港求购，无产地
for (const cid of ['england', 'france', 'netherlands', 'japan', 'spain', 'inca']) {
  const c = CITY_BY_ID[cid]
  if (c && !c.imports.includes('relic')) c.imports.push('relic')
}

/** 是否为隐藏特产（投资门禁用） */
export function isSecretGood(goodId: string): boolean {
  return Object.values(SECRET_OF_CITY).includes(goodId)
}

export interface ShipClass {
  id: string
  name: string
  icon: string
  desc: string
  /** 载重上限 */
  cap: number
  /** 航速倍率 */
  speed: number
  /** 卖出利润加成（%） */
  bonus: number
  cost: number
  color: string
}

export const SHIPS: ShipClass[] = [
  { id: 'sloop', name: '小帆船', icon: '⛵', desc: '入门商船，轻便灵活', cap: 40, speed: 1.0, bonus: 0, cost: 0, color: '#5aaedc' },
  { id: 'schooner', name: '双桅商船', icon: '🚤', desc: '标准贸易船型，运力翻倍', cap: 90, speed: 1.25, bonus: 8, cost: 6000, color: '#4cba6a' },
  { id: 'clipper', name: '飞剪船', icon: '🛥️', desc: '极速船型，航程大幅缩短', cap: 120, speed: 1.7, bonus: 12, cost: 18000, color: '#9b6ee0' },
  { id: 'galleon', name: '大型商船', icon: '🚢', desc: '重型货运主力，利润加成高', cap: 200, speed: 1.15, bonus: 20, cost: 45000, color: '#e87070' },
  { id: 'royal', name: '皇家盖伦', icon: '⛴️', desc: '传说级旗舰，财富与荣耀的象征', cap: 360, speed: 1.35, bonus: 35, cost: 120000, color: '#f5913a' },
  // ── v1.1.0 终局目标：一亿金币的传奇宝船 ──
  { id: 'legend', name: '传奇宝船', icon: '👑', desc: '郑和宝船队旗舰复刻 · 一亿金币的海上巨无霸', cap: 600, speed: 1.5, bonus: 45, cost: 100_000_000, color: '#d4af37' },
]

export const SHIP_BY_ID: Record<string, ShipClass> = Object.fromEntries(
  SHIPS.map(s => [s.id, s]),
)

// ── 船具工坊（v1.2.0）──────────────────────────────────────────────────────────
// 装备：永久生效，每件只能买一次；补给：消耗品，事件中自动消耗或手动使用

export interface EquipDef {
  id: string
  name: string
  icon: string
  desc: string
  cost: number
  /** 航速 +% */
  speed?: number
  /** 卖出利润 +% */
  trade?: number
  /** 载重 +（绝对值） */
  cap?: number
  /** 声望获取 +% */
  repGain?: number
  /** 需先拥有该船（如传奇宝船专属龙骨） */
  requireShip?: string
}

export const EQUIPS: EquipDef[] = [
  { id: 'e_sail', name: '强化纵帆', icon: '⛵', desc: '全船航速 +8%', cost: 45_000, speed: 8 },
  { id: 'e_ledger', name: '商人账本', icon: '📒', desc: '卖出利润 +6%', cost: 55_000, trade: 6 },
  { id: 'e_hold', name: '扩容货舱', icon: '📦', desc: '货舱载重 +60', cost: 70_000, cap: 60 },
  { id: 'e_chart', name: '精致海图', icon: '🗺️', desc: '航速 +5%，利润 +3%', cost: 90_000, speed: 5, trade: 3 },
  { id: 'e_guild', name: '商会徽章', icon: '🎖️', desc: '各港声望获取 +50%', cost: 120_000, repGain: 50 },
  { id: 'e_keel', name: '金龙骨', icon: '🐉', desc: '航速 +12%、载重 +120、利润 +8% —— 传奇宝船专属', cost: 8_000_000, requireShip: 'legend', speed: 12, cap: 120, trade: 8 },
]

export const EQUIP_BY_ID: Record<string, EquipDef> = Object.fromEntries(
  EQUIPS.map(e => [e.id, e]),
)

export interface SupplyDef {
  id: string
  name: string
  icon: string
  desc: string
  /** 单价 */
  cost: number
  /** auto = 对应海上事件自动消耗；manual = 航行中手动使用 */
  use: 'auto' | 'manual'
}

export const SUPPLIES: SupplyDef[] = [
  { id: 's_cannon', name: '舰炮组', icon: '🎯', desc: '遭遇海盗时自动开火：击退海盗并缴获战利品', cost: 2_500, use: 'auto' },
  { id: 's_timber', name: '修理木料', icon: '🔨', desc: '暴风雨时自动加固船体：航程延误减半', cost: 800, use: 'auto' },
  { id: 's_charter', name: '通商特许状', icon: '🧾', desc: '港口检疫时自动出示：免排队直接进港', cost: 600, use: 'auto' },
  { id: 's_rum', name: '朗姆酒桶', icon: '🍶', desc: '航行中使用：船员士气大振，剩余航程 -40%', cost: 1_200, use: 'manual' },
]

export const SUPPLY_BY_ID: Record<string, SupplyDef> = Object.fromEntries(
  SUPPLIES.map(x => [x.id, x]),
)

// ── 港口商情 / 投资 / 委托（v1.3.0）──────────────────────────────────────────

export type CityEventKind = 'boom' | 'shortage' | 'blockade'

export const CITY_EVENT_INFO: Record<CityEventKind, { name: string; icon: string; desc: string }> = {
  boom: { name: '丰产季', icon: '🌾', desc: '特产大量上市，本港买入价 -45%' },
  shortage: { name: '抢购潮', icon: '🔥', desc: '全城抢购紧缺货，本港卖出价 ×2.2' },
  blockade: { name: '瘟疫封锁', icon: '🚑', desc: '市集关闭无法买卖（委托交付照常办理）' },
}

/** 商情调度间隔（秒）与单次持续时长范围（秒） */
export const CITY_EVENT_CYCLE = 32
export const CITY_EVENT_DURATION: [number, number] = [70, 110]
/** 全图同时最多几个商情事件 */
export const CITY_EVENT_MAX = 4

/** 港口投资：3 级，每级买入折扣 / 卖出加成 / 每个市场周期的分红 */
export interface InvestLevelDef {
  cost: number
  buy: number
  sell: number
  dividend: number
  title: string
}

export const INVEST_LEVELS: InvestLevelDef[] = [
  { cost: 25_000, buy: 4, sell: 4, dividend: 150, title: '商会伙伴' },
  { cost: 70_000, buy: 4, sell: 4, dividend: 450, title: '港口股东' },
  { cost: 160_000, buy: 4, sell: 4, dividend: 1_100, title: '荣誉市民' },
]

/** 限时委托：刷新周期 / 委托板容量 / 同时最多接单数 */
export const ORDER_CYCLE = 40
export const ORDER_BOARD_MAX = 6
export const ORDER_ACTIVE_MAX = 3
/** 委托奖励 = 需求货值 × (基础倍率 + 距离系数) */
export const ORDER_BASE_RATE = 1.75
export const ORDER_DIST_RATE = 0.012

// ── v1.4.0：进港关税 / 海事悬赏 / 深海秘藏 / 银行 ────────────────────────────

/** 进港关税 = 固定 + 货舱货值比例；投资 2 级半价、3 级全免 */
export const TARIFF_BASE = 30
export const TARIFF_RATE = 0.01

/** 通缉海盗：strength 越高赏金越多 */
export interface PirateDef {
  id: string
  name: string
  icon: string
  strength: number
}

export const PIRATES: PirateDef[] = [
  { id: 'p_rat', name: '独眼耗子', icon: '🐀', strength: 40 },
  { id: 'p_hook', name: '铁钩手·席德', icon: '🪝', strength: 55 },
  { id: 'p_kraken', name: '唤雾者·莫比', icon: '🐙', strength: 70 },
  { id: 'p_morgan', name: '血帆·摩根', icon: '🩸', strength: 85 },
  { id: 'p_barbarossa', name: '红胡子·巴巴罗萨', icon: '🧔', strength: 105 },
  { id: 'p_blackbeard', name: '黑胡子·蒂奇', icon: '🎩', strength: 125 },
  { id: 'p_dragonlady', name: '龙夫人·郑', icon: '🐉', strength: 150 },
  { id: 'p_davy', name: '深渊之王·戴维', icon: '👻', strength: 180 },
]

export const PIRATE_BY_ID: Record<string, PirateDef> = Object.fromEntries(
  PIRATES.map(p => [p.id, p]),
)

/** 悬赏刷新间隔 / 单张悬赏有效期（游戏时钟秒） */
export const BOUNTY_CYCLE = 75
export const BOUNTY_TTL = 260
/** 赏金 = strength × 随机系数 */
export const BOUNTY_RATE: [number, number] = [80, 130]

/** 出击战力 = 基础 + 船级×系数 + 舰炮组库存×系数 */
export const RAID_BASE_POWER = 15
export const RAID_SHIP_POWER = 18
export const RAID_CANNON_POWER = 12

/** 深海秘藏：集齐 4 块碎片后可在目标港挖掘 */
export const MAP_FRAGS_NEED = 4
export const DIG_BASE_REWARD = 30_000
export const DIG_STEP_REWARD = 15_000
export const DIG_RELIC_QTY = 4

/** 银行：每市场周期计息比例 / 信用额度（资产×比例，上下限）/ 破产清算线（债务 > 资产×比例） */
export const LOAN_INTEREST = 0.0015
export const LOAN_CREDIT_RATE = 0.5
export const LOAN_CREDIT_MIN = 8_000
export const LOAN_CREDIT_MAX = 250_000
export const LOAN_CRASH_RATIO = 3

// ── 船员（酒馆招募）──────────────────────────────────────────────────────────

/** Q 版形象配置（由 CrewAvatar 组件绘制） */
export interface CrewLook {
  skin: string
  hair: string
  hairStyle: 'short' | 'long' | 'bun' | 'bald'
  hat: 'tricorn' | 'sailor' | 'bandana' | 'turban' | 'chef' | 'feather' | 'none'
  hatColor: string
  /** 帽子副色（三角帽帽冠 / 头巾羽毛 / 缠头巾浅层） */
  hatColor2?: string
  beardStyle?: 'full' | 'mustache'
  beardColor?: string
  accessory?: 'eyepatch' | 'pipe' | 'earring' | 'scar'
}

export interface CrewMember {
  id: string
  name: string
  /** 职位：航海家 / 水手长 / 水手 / 大厨 / 炮手 / 瞭望手… */
  role: string
  /** 只能在这座城市招募 */
  cityId: string
  cost: number
  /** 航速加成 %（乘算在船速上） */
  speed: number
  /** 卖出利润加成 %（叠加在船只加成上） */
  trade: number
  desc: string
  look: CrewLook
  /** 卡片主色 */
  color: string
}

/** 18 位可雇佣的航海好手，散落在世界各港 */
export const CREW: CrewMember[] = [
  {
    id: 'c_zheng', name: '郑一嫂', role: '航海家', cityId: 'china', cost: 9_000, speed: 10, trade: 0,
    desc: '红旗帮当家，海图过目不忘，海盗见了都绕道',
    color: '#d94141',
    look: { skin: '#ffd9b3', hair: '#1a1a1a', hairStyle: 'long', hat: 'bandana', hatColor: '#d94141', accessory: 'earring' },
  },
  {
    id: 'c_mary', name: '玛丽·雷德', role: '航海家', cityId: 'england', cost: 12_000, speed: 0, trade: 8,
    desc: '曾是私掠船长，讨价还价从没输过',
    color: '#c1452b',
    look: { skin: '#ffd9b3', hair: '#c1452b', hairStyle: 'long', hat: 'tricorn', hatColor: '#3a2d20', hatColor2: '#241b13', accessory: 'eyepatch' },
  },
  {
    id: 'c_sinbad', name: '辛巴达', role: '航海家', cityId: 'arabia', cost: 10_000, speed: 8, trade: 0,
    desc: '七次远航的老船长，总能抢在风暴前进港',
    color: '#c9a24b',
    look: { skin: '#e0a878', hair: '#201510', hairStyle: 'short', hat: 'turban', hatColor: '#efe3c2', hatColor2: '#f8f0d8', beardStyle: 'full', beardColor: '#201510' },
  },
  {
    id: 'c_zhenghe', name: '郑和', role: '大航海家', cityId: 'malacca', cost: 30_000, speed: 10, trade: 6,
    desc: '七下西洋的舰队总帅，宝船队的传奇',
    color: '#f0a83c',
    look: { skin: '#ffd9b3', hair: '#1a1a1a', hairStyle: 'bun', hat: 'none', hatColor: '#f0a83c' },
  },
  {
    id: 'c_raja', name: '拉吉·辛', role: '水手长', cityId: 'india', cost: 6_000, speed: 0, trade: 4,
    desc: '装卸又快又稳，压舱货也能卖出好价钱',
    color: '#4c9e5f',
    look: { skin: '#b57a4a', hair: '#141414', hairStyle: 'short', hat: 'turban', hatColor: '#4c9e5f', hatColor2: '#7cc08d', accessory: 'earring' },
  },
  {
    id: 'c_kotaro', name: '小太郎', role: '水手', cityId: 'japan', cost: 5_000, speed: 5, trade: 0,
    desc: '桅杆上蹿下跳，收帆张帆只要一半时间',
    color: '#4a6fa5',
    look: { skin: '#ffd9b3', hair: '#141414', hairStyle: 'short', hat: 'bandana', hatColor: '#4a6fa5' },
  },
  {
    id: 'c_john', name: '老约翰', role: '老水手', cityId: 'norway', cost: 4_000, speed: 4, trade: 0,
    desc: '在北海漂了四十年，闭着眼都能认出洋流',
    color: '#2e4057',
    look: { skin: '#ffd9b3', hair: '#e8e8e8', hairStyle: 'bald', hat: 'tricorn', hatColor: '#2e4057', hatColor2: '#1f2d3d', beardStyle: 'full', beardColor: '#e8e8e8' },
  },
  {
    id: 'c_pierre', name: '皮埃尔', role: '大厨', cityId: 'france', cost: 5_500, speed: 0, trade: 5,
    desc: '一手好炖菜让港口官员心情大好，税费都少了',
    color: '#9b6ee0',
    look: { skin: '#ffd9b3', hair: '#6b4a2f', hairStyle: 'short', hat: 'chef', hatColor: '#9b6ee0', beardStyle: 'mustache', beardColor: '#6b4a2f' },
  },
  {
    id: 'c_diaz', name: '迪亚士', role: '航海家', cityId: 'spain', cost: 8_000, speed: 6, trade: 0,
    desc: '绕过好望角的狠人，最懂怎么走顺风航线',
    color: '#6b2737',
    look: { skin: '#e8b88a', hair: '#1d1710', hairStyle: 'short', hat: 'tricorn', hatColor: '#6b2737', hatColor2: '#4d1b27', accessory: 'pipe' },
  },
  {
    id: 'c_katalina', name: '卡塔丽娜', role: '炮手', cityId: 'aztec', cost: 7_000, speed: 3, trade: 5,
    desc: '红发炮神，商路安全她说了算',
    color: '#b23a48',
    look: { skin: '#c98a5a', hair: '#141414', hairStyle: 'long', hat: 'feather', hatColor: '#b23a48', hatColor2: '#e8542f', accessory: 'earring' },
  },
  {
    id: 'c_kwame', name: '夸梅', role: '水手', cityId: 'africa', cost: 4_500, speed: 4, trade: 2,
    desc: '好望角老水手，风浪越大他划得越欢',
    color: '#3f9e8e',
    look: { skin: '#8a5a3a', hair: '#141414', hairStyle: 'short', hat: 'bandana', hatColor: '#f5c830', accessory: 'scar' },
  },
  {
    id: 'c_daisy', name: '范黛西', role: '瞭望手', cityId: 'netherlands', cost: 6_500, speed: 6, trade: 0,
    desc: '站在桅顶就能望见十海里外的商机',
    color: '#e8874a',
    look: { skin: '#ffd9b3', hair: '#e8c96b', hairStyle: 'long', hat: 'sailor', hatColor: '#2b5e8f' },
  },
  // ── v1.2.0 新增 6 位船员（补齐此前没有船员的港口） ──
  {
    id: 'c_nefertari', name: '奈菲尔塔莉', role: '女商人', cityId: 'egypt', cost: 11_000, speed: 0, trade: 7,
    desc: '尼罗河畔的大商贾，货船排队等她验货',
    color: '#d4a017',
    look: { skin: '#c98a5a', hair: '#141414', hairStyle: 'long', hat: 'bandana', hatColor: '#d4a017', hatColor2: '#f5e6b8', accessory: 'earring' },
  },
  {
    id: 'c_rustam', name: '鲁斯塔姆', role: '护卫队长', cityId: 'persia', cost: 8_000, speed: 3, trade: 4,
    desc: '波斯史诗里的英雄后人，押过的货一趟没丢过',
    color: '#8a4f2d',
    look: { skin: '#e0a878', hair: '#201510', hairStyle: 'short', hat: 'turban', hatColor: '#8a4f2d', hatColor2: '#c98a50', beardStyle: 'full', beardColor: '#201510', accessory: 'scar' },
  },
  {
    id: 'c_vira', name: '维拉', role: '珠宝匠', cityId: 'srilanka', cost: 9_500, speed: 0, trade: 6,
    desc: '一眼辨真假宝石，卖价总能再抬一手',
    color: '#c05299',
    look: { skin: '#b57a4a', hair: '#141414', hairStyle: 'bun', hat: 'bandana', hatColor: '#c05299', accessory: 'earring' },
  },
  {
    id: 'c_bayu', name: '巴尤', role: '水手', cityId: 'java', cost: 5_500, speed: 5, trade: 0,
    desc: '火山海边长大，看云识风比看罗盘还准',
    color: '#5f8d4e',
    look: { skin: '#b57a4a', hair: '#141414', hairStyle: 'short', hat: 'bandana', hatColor: '#5f8d4e', accessory: 'pipe' },
  },
  {
    id: 'c_mira', name: '米拉', role: '药剂师', cityId: 'madagascar', cost: 6_500, speed: 2, trade: 3,
    desc: '香草与草药专家，船员不晕船，货也不坏',
    color: '#3aa6a0',
    look: { skin: '#8a5a3a', hair: '#141414', hairStyle: 'long', hat: 'feather', hatColor: '#3aa6a0', hatColor2: '#8fd4c8' },
  },
  {
    id: 'c_tupa', name: '图帕克', role: '星象舵手', cityId: 'inca', cost: 8_500, speed: 7, trade: 0,
    desc: '云中之城的舵手，夜里靠星星也能抄近路',
    color: '#b8860b',
    look: { skin: '#b57a4a', hair: '#141414', hairStyle: 'long', hat: 'feather', hatColor: '#b8860b', hatColor2: '#e8d44a', accessory: 'earring' },
  },
]

export const CREW_BY_ID: Record<string, CrewMember> = Object.fromEntries(
  CREW.map(c => [c.id, c]),
)

/** 船名未填写时的默认显示 */
export const DEFAULT_SHIP_NAME = '我的商船'
/** 显示用船名：玩家自定义为空时回退到默认名 */
export function shipDisplayName(shipName: string, shipClassName?: string): string {
  const n = shipName.trim()
  if (n) return n
  return shipClassName ? `${DEFAULT_SHIP_NAME}·${shipClassName}` : DEFAULT_SHIP_NAME
}
/** 取名最长字符数（中文/中文标点按 1 个字符计） */
export const SHIP_NAME_MAX = 12

/** 海面上其他商船 —— 沿固定航线循环航行 */
export interface AiShip {
  id: string
  name: string
  color: string
  from: string
  to: string
  /** 相位偏移 0-1，让船只错开 */
  offset: number
}

export const AI_SHIPS: AiShip[] = [
  { id: 'a1', name: '海洋之心', color: '#e87070', from: 'china', to: 'malacca', offset: 0.00 },
  { id: 'a2', name: '破浪号', color: '#5aaedc', from: 'norway', to: 'arabia', offset: 0.22 },
  { id: 'a3', name: '翡翠风帆', color: '#4cba6a', from: 'india', to: 'srilanka', offset: 0.55 },
  { id: 'a4', name: '星辉号', color: '#9b6ee0', from: 'africa', to: 'india', offset: 0.15 },
  { id: 'a5', name: '金羊毛号', color: '#f5c830', from: 'arabia', to: 'china', offset: 0.68 },
  { id: 'a6', name: '云帆号', color: '#f5913a', from: 'malacca', to: 'africa', offset: 0.42 },
  { id: 'a7', name: '银鸥号', color: '#8fd4e8', from: 'srilanka', to: 'norway', offset: 0.80 },
  { id: 'a8', name: '黑钻号', color: '#c9b394', from: 'aztec', to: 'france', offset: 0.33 },
  { id: 'a9', name: '武藏丸', color: '#e070a0', from: 'japan', to: 'java', offset: 0.10 },
  { id: 'a10', name: '尼罗之星', color: '#7fc8a0', from: 'egypt', to: 'persia', offset: 0.72 },
]

export interface Milestone {
  id: string
  label: string
  target: number
  gold: number
  boost: number
}

export const MILESTONES: Milestone[] = [
  { id: 'm1', label: '初出茅庐', target: 5_000, gold: 1_000, boost: 1 },
  { id: 'm2', label: '初级商人', target: 20_000, gold: 3_000, boost: 1 },
  { id: 'm3', label: '见习商人', target: 60_000, gold: 8_000, boost: 2 },
  { id: 'm4', label: '海上商人', target: 150_000, gold: 20_000, boost: 3 },
  { id: 'm5', label: '东方富商', target: 400_000, gold: 50_000, boost: 5 },
  { id: 'm6', label: '大航海王', target: 1_000_000, gold: 120_000, boost: 10 },
  // ── v1.1.0 通关后阶段 ──
  { id: 'm7', label: '七海豪商', target: 3_000_000, gold: 250_000, boost: 12 },
  { id: 'm8', label: '海上巨富', target: 10_000_000, gold: 800_000, boost: 20 },
  { id: 'm9', label: '七海霸主', target: 100_000_000, gold: 8_000_000, boost: 50 },
]

/** 贸易成就：按到达城市数 / 买过商品数 / 卖过商品数 / 交易过商品数（买卖并集）解锁 */
export interface AchievementDef {
  id: string
  label: string
  icon: string
  desc: string
  target: number
  kind: 'visited' | 'bought' | 'sold' | 'traded'
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ── 足迹 ──
  { id: 'av1', icon: '🧭', label: '初次远航', desc: '到达 2 座城市', target: 2, kind: 'visited' },
  { id: 'av2', icon: '🗺️', label: '见识渐广', desc: '到达 6 座城市', target: 6, kind: 'visited' },
  { id: 'av3', icon: '🌏', label: '环游四海', desc: '到达 12 座城市', target: 12, kind: 'visited' },
  { id: 'av4', icon: '🌐', label: '世界尽头', desc: '到达 18 座城市', target: 18, kind: 'visited' },
  { id: 'av5', icon: '🌍', label: '全球通', desc: '到达全部 21 座城市', target: 21, kind: 'visited' },
  // ── 采购 ──
  { id: 'ab1', icon: '📥', label: '尝鲜买家', desc: '买过 5 种商品', target: 5, kind: 'bought' },
  { id: 'ab2', icon: '🛒', label: '收购达人', desc: '买过 12 种商品', target: 12, kind: 'bought' },
  { id: 'ab3', icon: '📦', label: '万货通', desc: '买过 20 种商品', target: 20, kind: 'bought' },
  { id: 'ab4', icon: '💎', label: '全品收购家', desc: `买过全部 ${GOODS.length} 种商品`, target: GOODS.length, kind: 'bought' },
  // ── 出售 ──
  { id: 'as1', icon: '💰', label: '第一桶金', desc: '卖出过 5 种商品', target: 5, kind: 'sold' },
  { id: 'as2', icon: '🤝', label: '销售行家', desc: '卖出过 12 种商品', target: 12, kind: 'sold' },
  { id: 'as3', icon: '📈', label: '大批发商', desc: '卖出过 20 种商品', target: 20, kind: 'sold' },
  { id: 'as4', icon: '👑', label: '垄断商人', desc: `卖出过全部 ${GOODS.length} 种商品`, target: GOODS.length, kind: 'sold' },
  // ── 买过且卖过（并集）──
  { id: 'at1', icon: '⚖️', label: '两头通吃', desc: '交易过（买或卖）10 种商品', target: 10, kind: 'traded' },
  { id: 'at2', icon: '🔄', label: '全链路商人', desc: `交易过（买或卖）全部 ${GOODS.length} 种商品`, target: GOODS.length, kind: 'traded' },
]

/** 传奇功勋：通关（大航海王）之后的长线目标，全部基于已持久化的计数器，老存档自动结算 */
export interface LegendDef {
  id: string
  icon: string
  label: string
  desc: string
  kind: 'assets' | 'trades' | 'profit' | 'distance' | 'best' | 'ships' | 'crew' | 'cities' | 'atlas' | 'events'
  target: number
  gold: number
  boost: number
}

export const LEGENDS: LegendDef[] = [
  { id: 'lg-cities', icon: '🌐', label: '万国来朝', desc: `到访全部 ${CITIES.length} 座城市`, kind: 'cities', target: CITIES.length, gold: 80_000, boost: 4 },
  { id: 'lg-atlas', icon: '📖', label: '万货图鉴', desc: `买卖过全部 ${GOODS.length} 种商品`, kind: 'atlas', target: GOODS.length, gold: 80_000, boost: 4 },
  { id: 'lg-fleet', icon: '🛳️', label: '船队大亨', desc: `集齐全部 5 艘常规船（传奇宝船除外）`, kind: 'ships', target: 5, gold: 100_000, boost: 5 },
  { id: 'lg-crew', icon: '🍺', label: '众星云集', desc: `招募全部 ${CREW.length} 位船员`, kind: 'crew', target: CREW.length, gold: 120_000, boost: 5 },
  { id: 'lg-best', icon: '🏅', label: '世纪豪赌', desc: '单笔利润达到 10 万金', kind: 'best', target: 100_000, gold: 120_000, boost: 5 },
  { id: 'lg-trades', icon: '🔁', label: '商路不息', desc: '完成 500 笔交易', kind: 'trades', target: 500, gold: 150_000, boost: 6 },
  { id: 'lg-distance', icon: '🧭', label: '海上生涯', desc: '累计航行 10 万海里', kind: 'distance', target: 100_000, gold: 150_000, boost: 6 },
  { id: 'lg-profit', icon: '📈', label: '日进斗金', desc: '累计利润 200 万金', kind: 'profit', target: 2_000_000, gold: 200_000, boost: 8 },
  { id: 'lg-events', icon: '🌊', label: '命运弄人', desc: '经历 100 次海上事件', kind: 'events', target: 100, gold: 60_000, boost: 3 },
  { id: 'lg-wealth', icon: '👑', label: '富可敌国', desc: '总资产达到 500 万金', kind: 'assets', target: 5_000_000, gold: 300_000, boost: 10 },
]

/** 集齐全部传奇功勋后的终极称号 */
export const LEGEND_TITLE = '传奇船长'

export const TITLES: { min: number; name: string }[] = [
  { min: 0, name: '初出茅庐' },
  { min: 20_000, name: '初级商人' },
  { min: 60_000, name: '见习商人' },
  { min: 150_000, name: '海上商人' },
  { min: 400_000, name: '东方富商' },
  { min: 1_000_000, name: '大航海王' },
  // ── v1.1.0 通关后称号 ──
  { min: 3_000_000, name: '七海豪商' },
  { min: 10_000_000, name: '海上巨富' },
  { min: 100_000_000, name: '七海霸主' },
]

// ── 季节 / 季风（v1.1.0）──────────────────────────────────────────────────────
// 由 clock 推导（SEASON_LEN 一换），完全不落盘：旧档读进来天然继承当前季节

/** 每季时长（秒） */
export const SEASON_LEN = 300

export interface SeasonDef {
  id: string
  name: string
  icon: string
  /** 面向玩家的效果说明 */
  desc: string
  /** 该季风覆盖的海域：驶入这些港口航速 +20% */
  windCities: string[]
  /** 该季需求看涨的商品：紧缺刷新时优先挑它们 */
  boostGoods: string[]
}

export const SEASONS: SeasonDef[] = [
  {
    id: 'spring', name: '春季 · 东信风', icon: '🌸',
    desc: '东亚航线提速 20%，茶丝纸漆需求看涨',
    windCities: ['china', 'japan', 'malacca', 'java', 'borneo'],
    boostGoods: ['tea', 'silk', 'porcelain', 'nest', 'paper', 'lacquer'],
  },
  {
    id: 'summer', name: '夏季 · 西南季风', icon: '☀️',
    desc: '印度洋航线提速 20%，香料染料需求看涨',
    windCities: ['india', 'srilanka', 'arabia', 'oman', 'persia', 'madagascar'],
    boostGoods: ['spice', 'clove', 'coffee', 'pearl', 'frankincense', 'indigo', 'cinnamon'],
  },
  {
    id: 'autumn', name: '秋季 · 西风带', icon: '🍂',
    desc: '欧洲航线提速 20%，美食珍馐需求看涨',
    windCities: ['norway', 'england', 'france', 'netherlands', 'spain', 'egypt'],
    boostGoods: ['wine', 'wool', 'whisky', 'perfume', 'watch', 'cheese', 'truffle', 'caviar'],
  },
  {
    id: 'winter', name: '冬季 · 东北季风', icon: '❄️',
    desc: '新大陆航线提速 20%，矿产皮货需求看涨',
    windCities: ['africa', 'aztec', 'inca', 'panama'],
    boostGoods: ['gold', 'silver', 'gem', 'cacao', 'fur', 'tobacco', 'diamond', 'alpaca', 'leather'],
  },
]

/** 当前季节（由游戏时钟推导，无需存档） */
export function seasonOf(clock: number): SeasonDef {
  return SEASONS[Math.floor(clock / SEASON_LEN) % SEASONS.length]
}

// ── 港口声望（v1.1.0）─────────────────────────────────────────────────────────
// 靠港 +3、每笔交易 +2；声望换价格优惠（每 5 点 1%，上限 15%）

export const REP_MAX = 150
/** 每点声望的到达/交易增量 */
export const REP_GAIN_ARRIVE = 3
export const REP_GAIN_TRADE = 2

export const REP_TIERS: { min: number; name: string }[] = [
  { min: 0, name: '初来乍到' },
  { min: 10, name: '熟面孔' },
  { min: 30, name: '港口常客' },
  { min: 60, name: '城中名人' },
  { min: 100, name: '一城传奇' },
]

export function repTierName(rep: number): string {
  let name = REP_TIERS[0].name
  for (const t of REP_TIERS) if (rep >= t.min) name = t.name
  return name
}

/** 声望换算的价格优惠百分比（买入折扣 / 卖出加成，上限 15%） */
export function repBonusPct(rep: number): number {
  return Math.min(15, Math.floor(rep / 5))
}

// ── 船员委托（v1.1.0）─────────────────────────────────────────────────────────
// 每位船员 3 段小任务链：招募后解锁第 1 段，逐段领取。
// 判定全部基于已有计数器 / 新增 rep 字段，旧存档自动结算。

export type QuestCond =
  | { kind: 'visit'; cityId: string }
  | { kind: 'tradeGood'; goodId: string }
  | { kind: 'assets'; target: number }
  | { kind: 'trades'; target: number }
  | { kind: 'distance'; target: number }
  | { kind: 'best'; target: number }
  | { kind: 'cities'; target: number }
  | { kind: 'atlas'; target: number }
  | { kind: 'events'; target: number }
  | { kind: 'profit'; target: number }
  | { kind: 'crewCount'; target: number }
  | { kind: 'ship'; shipId: string }
  | { kind: 'rep'; cityId: string; target: number }

export interface CrewQuestDef {
  id: string
  crewId: string
  stage: 1 | 2 | 3
  title: string
  desc: string
  cond: QuestCond
  gold: number
  boost: number
}

export const CREW_QUESTS: CrewQuestDef[] = [
  // 郑一嫂（中国 · 航海家）
  { id: 'q_zheng_1', crewId: 'c_zheng', stage: 1, title: '红旗帮的考验', desc: '把丝绸装上船，见识一下海上的生意', cond: { kind: 'tradeGood', goodId: 'silk' }, gold: 8_000, boost: 1 },
  { id: 'q_zheng_2', crewId: 'c_zheng', stage: 2, title: '海图上的旧路', desc: '亲自去一趟马六甲，红旗帮的老巢就在那片海', cond: { kind: 'visit', cityId: 'malacca' }, gold: 20_000, boost: 2 },
  { id: 'q_zheng_3', crewId: 'c_zheng', stage: 3, title: '南海女王', desc: '累计航行 3 万海里，让整片南海记住你的帆', cond: { kind: 'distance', target: 30_000 }, gold: 60_000, boost: 5 },
  // 玛丽·雷德（英国 · 航海家）
  { id: 'q_mary_1', crewId: 'c_mary', stage: 1, title: '私掠者的直觉', desc: '做一笔利润 5,000 金的大买卖给她看看', cond: { kind: 'best', target: 5_000 }, gold: 10_000, boost: 1 },
  { id: 'q_mary_2', crewId: 'c_mary', stage: 2, title: '伦敦的老主顾', desc: '在英国混到「港口常客」的名声（声望 30）', cond: { kind: 'rep', cityId: 'england', target: 30 }, gold: 30_000, boost: 3 },
  { id: 'q_mary_3', crewId: 'c_mary', stage: 3, title: '讨价还价之王', desc: '累计利润 50 万金，让谈判桌对面闻风丧胆', cond: { kind: 'profit', target: 500_000 }, gold: 90_000, boost: 6 },
  // 辛巴达（阿拉伯 · 航海家）
  { id: 'q_sinbad_1', crewId: 'c_sinbad', stage: 1, title: '第七次远航', desc: '把船开到印度，那是辛巴达故事开始的地方', cond: { kind: 'visit', cityId: 'india' }, gold: 8_000, boost: 1 },
  { id: 'q_sinbad_2', crewId: 'c_sinbad', stage: 2, title: '风暴前方', desc: '完成 100 笔交易，老船长教你看云识风', cond: { kind: 'trades', target: 100 }, gold: 25_000, boost: 2 },
  { id: 'q_sinbad_3', crewId: 'c_sinbad', stage: 3, title: '七海传说', desc: '到访全部 21 座城市，走完辛巴达没走完的路', cond: { kind: 'cities', target: 21 }, gold: 80_000, boost: 6 },
  // 郑和（马六甲 · 大航海家）
  { id: 'q_zhenghe_1', crewId: 'c_zhenghe', stage: 1, title: '宝船队的遗产', desc: '购入大型商船，重现宝船的气势', cond: { kind: 'ship', shipId: 'galleon' }, gold: 30_000, boost: 3 },
  { id: 'q_zhenghe_2', crewId: 'c_zhenghe', stage: 2, title: '满剌加的旧盟', desc: '在马六甲攒下「港口常客」的名声（声望 40）', cond: { kind: 'rep', cityId: 'malacca', target: 40 }, gold: 50_000, boost: 4 },
  { id: 'q_zhenghe_3', crewId: 'c_zhenghe', stage: 3, title: '舰队总帅', desc: '招募 8 位船员，组建属于你的宝船队', cond: { kind: 'crewCount', target: 8 }, gold: 100_000, boost: 8 },
  // 拉吉·辛（印度 · 水手长）
  { id: 'q_raja_1', crewId: 'c_raja', stage: 1, title: '香料之路', desc: '经手一批香料，这是印度洋的硬通货', cond: { kind: 'tradeGood', goodId: 'spice' }, gold: 6_000, boost: 1 },
  { id: 'q_raja_2', crewId: 'c_raja', stage: 2, title: '压舱的艺术', desc: '资产达到 5 万金，压舱货也是钱', cond: { kind: 'assets', target: 50_000 }, gold: 20_000, boost: 2 },
  { id: 'q_raja_3', crewId: 'c_raja', stage: 3, title: '印度洋之主', desc: '资产达到 50 万金，孟买的码头为你让路', cond: { kind: 'assets', target: 500_000 }, gold: 60_000, boost: 5 },
  // 小太郎（日本 · 水手）
  { id: 'q_kotaro_1', crewId: 'c_kotaro', stage: 1, title: '东洋刀之路', desc: '经手一批东洋刀，见识岛国的锻造', cond: { kind: 'tradeGood', goodId: 'sword' }, gold: 6_000, boost: 1 },
  { id: 'q_kotaro_2', crewId: 'c_kotaro', stage: 2, title: '樱花航线', desc: '把船开到中国，师父说那里的瓷器最漂亮', cond: { kind: 'visit', cityId: 'china' }, gold: 15_000, boost: 1 },
  { id: 'q_kotaro_3', crewId: 'c_kotaro', stage: 3, title: '疾风收帆', desc: '累计航行 5 万海里，桅杆上再也没人比你快', cond: { kind: 'distance', target: 50_000 }, gold: 50_000, boost: 4 },
  // 老约翰（挪威 · 老水手）
  { id: 'q_john_1', crewId: 'c_john', stage: 1, title: '北海的老朋友', desc: '经手一批皮草，北海的硬通货', cond: { kind: 'tradeGood', goodId: 'fur' }, gold: 6_000, boost: 1 },
  { id: 'q_john_2', crewId: 'c_john', stage: 2, title: '四十年洋流', desc: '把船开到南非，老约翰当年就在好望角翻的船', cond: { kind: 'visit', cityId: 'africa' }, gold: 20_000, boost: 2 },
  { id: 'q_john_3', crewId: 'c_john', stage: 3, title: '老水手的罗盘', desc: '经历 80 次海上事件，什么风浪都见过了', cond: { kind: 'events', target: 80 }, gold: 60_000, boost: 5 },
  // 皮埃尔（法国 · 大厨）
  { id: 'q_pierre_1', crewId: 'c_pierre', stage: 1, title: '一锅好炖菜', desc: '经手一批葡萄酒，炖菜的秘密就在酒里', cond: { kind: 'tradeGood', goodId: 'wine' }, gold: 6_000, boost: 1 },
  { id: 'q_pierre_2', crewId: 'c_pierre', stage: 2, title: '米其林航海', desc: '在法国攒下「港口常客」的名声（声望 30）', cond: { kind: 'rep', cityId: 'france', target: 30 }, gold: 25_000, boost: 2 },
  { id: 'q_pierre_3', crewId: 'c_pierre', stage: 3, title: '美食家的环球梦', desc: `买卖过全部 ${GOODS.length} 种商品，凑齐一桌满汉全席`, cond: { kind: 'atlas', target: GOODS.length }, gold: 80_000, boost: 6 },
  // 迪亚士（西班牙 · 航海家）
  { id: 'q_diaz_1', crewId: 'c_diaz', stage: 1, title: '好望角的记忆', desc: '把船开到南非，替迪亚士再看一眼好望角', cond: { kind: 'visit', cityId: 'africa' }, gold: 10_000, boost: 1 },
  { id: 'q_diaz_2', crewId: 'c_diaz', stage: 2, title: '顺风航线', desc: '完成 200 笔交易，学会等风来', cond: { kind: 'trades', target: 200 }, gold: 40_000, boost: 3 },
  { id: 'q_diaz_3', crewId: 'c_diaz', stage: 3, title: '绕过世界之角', desc: '累计利润 100 万金，把好望角甩在身后', cond: { kind: 'profit', target: 1_000_000 }, gold: 80_000, boost: 6 },
  // 卡塔丽娜（阿兹特克 · 炮手）
  { id: 'q_katalina_1', crewId: 'c_katalina', stage: 1, title: '红发炮神', desc: '经手一批白银，新大陆的白色黄金', cond: { kind: 'tradeGood', goodId: 'silver' }, gold: 8_000, boost: 1 },
  { id: 'q_katalina_2', crewId: 'c_katalina', stage: 2, title: '新大陆的白银', desc: '把船开到印加，云中之城黄金遍地', cond: { kind: 'visit', cityId: 'inca' }, gold: 25_000, boost: 2 },
  { id: 'q_katalina_3', crewId: 'c_katalina', stage: 3, title: '商路护卫', desc: '单笔利润 5 万金，红发炮神护航的商队不愁卖', cond: { kind: 'best', target: 50_000 }, gold: 70_000, boost: 5 },
  // 夸梅（南非 · 水手）
  { id: 'q_kwame_1', crewId: 'c_kwame', stage: 1, title: '黄金海岸', desc: '经手一批黄金，几内亚湾的金砂', cond: { kind: 'tradeGood', goodId: 'gold' }, gold: 8_000, boost: 1 },
  { id: 'q_kwame_2', crewId: 'c_kwame', stage: 2, title: '好望角冲浪', desc: '把船开到马达加斯加，猴面包树下歇歇脚', cond: { kind: 'visit', cityId: 'madagascar' }, gold: 20_000, boost: 2 },
  { id: 'q_kwame_3', crewId: 'c_kwame', stage: 3, title: '风浪越大越欢', desc: '经历 120 次海上事件，好望角的浪也认得你', cond: { kind: 'events', target: 120 }, gold: 60_000, boost: 5 },
  // 范黛西（荷兰 · 瞭望手）
  { id: 'q_daisy_1', crewId: 'c_daisy', stage: 1, title: '桅顶之眼', desc: '把船开到挪威，从桅顶望一眼峡湾', cond: { kind: 'visit', cityId: 'norway' }, gold: 8_000, boost: 1 },
  { id: 'q_daisy_2', crewId: 'c_daisy', stage: 2, title: '十海里外的商机', desc: '经手一批钟表，荷兰人的精密手艺', cond: { kind: 'tradeGood', goodId: 'watch' }, gold: 20_000, boost: 2 },
  { id: 'q_daisy_3', crewId: 'c_daisy', stage: 3, title: '郁金香的国度', desc: '在荷兰攒下「城中名人」的名声（声望 60）', cond: { kind: 'rep', cityId: 'netherlands', target: 60 }, gold: 60_000, boost: 5 },
  // ── v1.2.0 新船员委托 ──
  { id: 'q_nefertari_1', crewId: 'c_nefertari', stage: 1, title: '尼罗河的验货单', desc: '经手一批长绒棉，埃及的白色黄金', cond: { kind: 'tradeGood', goodId: 'cotton' }, gold: 7_000, boost: 1 },
  { id: 'q_nefertari_2', crewId: 'c_nefertari', stage: 2, title: '宝石之岛的路子', desc: '亲自去一趟斯里兰卡，认识红宝石矿的行家', cond: { kind: 'visit', cityId: 'srilanka' }, gold: 22_000, boost: 2 },
  { id: 'q_nefertari_3', crewId: 'c_nefertari', stage: 3, title: '大商贾的名声', desc: '累计利润 75 万金，让整个地中海记住你', cond: { kind: 'profit', target: 750_000 }, gold: 75_000, boost: 5 },
  { id: 'q_rustam_1', crewId: 'c_rustam', stage: 1, title: '英雄的试炼', desc: '经历 40 次海上事件，鲁斯塔姆只服见过风浪的人', cond: { kind: 'events', target: 40 }, gold: 8_000, boost: 1 },
  { id: 'q_rustam_2', crewId: 'c_rustam', stage: 2, title: '藏红花的香气', desc: '经手一批藏红花，波斯最贵的香料', cond: { kind: 'tradeGood', goodId: 'saffron' }, gold: 20_000, boost: 2 },
  { id: 'q_rustam_3', crewId: 'c_rustam', stage: 3, title: '万里押镖', desc: '累计航行 4 万海里，货一趟没丢', cond: { kind: 'distance', target: 40_000 }, gold: 60_000, boost: 5 },
  { id: 'q_vira_1', crewId: 'c_vira', stage: 1, title: '宝石匠的火眼', desc: '经手一批宝石，看看你的眼力', cond: { kind: 'tradeGood', goodId: 'gem' }, gold: 7_000, boost: 1 },
  { id: 'q_vira_2', crewId: 'c_vira', stage: 2, title: '锡兰的熟人', desc: '在斯里兰卡攒下「港口常客」的名声（声望 30）', cond: { kind: 'rep', cityId: 'srilanka', target: 30 }, gold: 25_000, boost: 2 },
  { id: 'q_vira_3', crewId: 'c_vira', stage: 3, title: '一锤定音', desc: '单笔利润 3 万金，好石头也要会卖', cond: { kind: 'best', target: 30_000 }, gold: 65_000, boost: 5 },
  { id: 'q_bayu_1', crewId: 'c_bayu', stage: 1, title: '火山的馈赠', desc: '经手一批爪哇咖啡，火山灰养出的豆子', cond: { kind: 'tradeGood', goodId: 'coffee' }, gold: 6_000, boost: 1 },
  { id: 'q_bayu_2', crewId: 'c_bayu', stage: 2, title: '雨林的邻居', desc: '把船开到婆罗洲，看看雨林深处的大树', cond: { kind: 'visit', cityId: 'borneo' }, gold: 15_000, boost: 1 },
  { id: 'q_bayu_3', crewId: 'c_bayu', stage: 3, title: '千岛老水手', desc: '完成 300 笔交易，航线烂熟于心', cond: { kind: 'trades', target: 300 }, gold: 55_000, boost: 4 },
  { id: 'q_mira_1', crewId: 'c_mira', stage: 1, title: '香草的魔法', desc: '经手一批香草，马达加斯加的味道', cond: { kind: 'tradeGood', goodId: 'vanilla' }, gold: 6_000, boost: 1 },
  { id: 'q_mira_2', crewId: 'c_mira', stage: 2, title: '药师的行囊', desc: '经手一批丁香，船上药箱的常备', cond: { kind: 'tradeGood', goodId: 'clove' }, gold: 15_000, boost: 2 },
  { id: 'q_mira_3', crewId: 'c_mira', stage: 3, title: '不晕船的船员', desc: '经历 100 次海上事件，米拉的药箱从没空过', cond: { kind: 'events', target: 100 }, gold: 60_000, boost: 5 },
  { id: 'q_tupa_1', crewId: 'c_tupa', stage: 1, title: '云中之城的航路', desc: '把船开到巴拿马，认一认新大陆的海', cond: { kind: 'visit', cityId: 'panama' }, gold: 8_000, boost: 1 },
  { id: 'q_tupa_2', crewId: 'c_tupa', stage: 2, title: '太阳的金子', desc: '经手一批黄金，印加人管它叫太阳的汗水', cond: { kind: 'tradeGood', goodId: 'gold' }, gold: 20_000, boost: 2 },
  { id: 'q_tupa_3', crewId: 'c_tupa', stage: 3, title: '星星认识你', desc: '到访 15 座城市，北斗星会替你指路', cond: { kind: 'cities', target: 15 }, gold: 70_000, boost: 5 },
]

export interface VoyageEventDef {
  id: string
  icon: string
  title: string
  kind: 'good' | 'bad'
}

export const VOYAGE_EVENTS: VoyageEventDef[] = [
  { id: 'pirate', icon: '🏴‍☠️', title: '遭遇海盗船', kind: 'bad' },
  { id: 'storm', icon: '⛈️', title: '暴风雨来袭', kind: 'bad' },
  { id: 'quarantine', icon: '🚩', title: '港口检疫排队', kind: 'bad' },
  { id: 'wind', icon: '💨', title: '顺风顺水', kind: 'good' },
  { id: 'bottle', icon: '🍾', title: '捞起漂流瓶', kind: 'good' },
  { id: 'dolphin', icon: '🐬', title: '海豚引航', kind: 'good' },
  { id: 'cargo', icon: '📦', title: '海上漂货', kind: 'good' },
  { id: 'deal', icon: '🤝', title: '港口商机', kind: 'good' },
]

/** 市场刷新周期（秒） */
export const MARKET_CYCLE = 8
/** 紧缺天气刷新周期（秒） */
export const SPICE_CYCLE = 24
/** 情报网络解锁价格 */
export const INTEL_PRICE = 800
/** 初始资金 */
export const START_MONEY = 3000
/** 初始城市 */
export const START_CITY = 'china'
