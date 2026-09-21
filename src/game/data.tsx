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
    exports: ['timber', 'fur'], imports: ['wine', 'coffee', 'tea', 'spice'],
    blurb: '峡湾深处，盛产木材与皮草',
  },
  {
    id: 'england', name: '英国', sub: 'ENGLAND', x: 7, y: 30, side: 'right',
    exports: ['wool', 'whisky'], imports: ['tea', 'spice', 'fur', 'carpet', 'nest', 'frankincense'],
    blurb: '雾都港埠，羊毛与麦芽威士忌之乡',
  },
  {
    id: 'france', name: '法国', sub: 'FRANCE', x: 17, y: 43, side: 'right',
    exports: ['wine', 'perfume'], imports: ['wool', 'fur', 'silk', 'coffee', 'vanilla', 'olive'],
    blurb: '塞纳河畔，葡萄酒与香水的国度',
  },
  {
    id: 'egypt', name: '埃及', sub: 'EGYPT', x: 29, y: 49, side: 'right',
    exports: ['cotton', 'grain'], imports: ['timber', 'wine', 'silver', 'spice', 'frankincense'],
    blurb: '尼罗河畔的粮仓，长绒棉之乡',
  },
  {
    id: 'persia', name: '波斯', sub: 'PERSIA', x: 41, y: 20, side: 'left',
    exports: ['carpet', 'rose'], imports: ['grain', 'pearl', 'gold'],
    blurb: '丝路古国，玫瑰与地毯的故乡',
  },
  {
    id: 'arabia', name: '阿拉伯', sub: 'ARABIA', x: 38, y: 34, side: 'left',
    exports: ['pearl', 'coffee'], imports: ['timber', 'grain', 'silk', 'porcelain'],
    blurb: '沙漠商路的中心，珍珠汇聚之地',
  },
  {
    id: 'india', name: '印度', sub: 'INDIA', x: 53, y: 29, side: 'right',
    exports: ['spice', 'cotton'], imports: ['carpet', 'gem', 'silver', 'clove', 'frankincense'],
    blurb: '香料与棉花的帝国',
  },
  {
    id: 'srilanka', name: '斯里兰卡', sub: 'SRI LANKA', x: 60, y: 44, side: 'right',
    exports: ['tea', 'gem'], imports: ['gold', 'whisky', 'wine', 'cacao'],
    blurb: '印度洋上的宝石与红茶之岛',
  },
  {
    id: 'china', name: '中国', sub: 'CHINA', x: 76, y: 14, side: 'left',
    exports: ['silk', 'porcelain', 'tea'], imports: ['pearl', 'clove', 'rose', 'wine', 'nest', 'watch'],
    blurb: '丝绸与瓷器之乡，海内最富',
  },
  {
    id: 'japan', name: '日本', sub: 'JAPAN', x: 94, y: 34, side: 'left',
    exports: ['sword', 'silver'], imports: ['silk', 'tea', 'cotton', 'gem', 'watch', 'tobacco'],
    blurb: '樱花之国，锻造与白银之邦',
  },
  {
    id: 'malacca', name: '马六甲', sub: 'MALACCA', x: 73, y: 56, side: 'right',
    exports: ['clove', 'spice'], imports: ['porcelain', 'cotton', 'whisky'],
    blurb: '东西方咽喉，万国商船必经',
  },
  {
    id: 'java', name: '爪哇', sub: 'JAVA', x: 78, y: 75, side: 'left',
    exports: ['coffee', 'clove'], imports: ['silk', 'tea', 'sword'],
    blurb: '火山脚下的千岛之国，咖啡飘香',
  },
  {
    id: 'africa', name: '南非', sub: 'SOUTH AFRICA', x: 19, y: 66, side: 'right',
    exports: ['gold', 'coffee'], imports: ['porcelain', 'whisky', 'gem'],
    blurb: '好望角黄金与宝石海岸',
  },
  {
    id: 'aztec', name: '阿兹特克', sub: 'AZTEC', x: 85, y: 89, side: 'left',
    exports: ['silver', 'cacao'], imports: ['silk', 'tea', 'wine', 'vanilla'],
    blurb: '新大陆的白银王国',
  },
  {
    id: 'inca', name: '印加', sub: 'INCA', x: 63, y: 97, side: 'left',
    exports: ['gold', 'gem'], imports: ['sword', 'perfume', 'wool', 'watch', 'olive'],
    blurb: '云中之城，黄金与宝石之地',
  },
  // ── v1.3.0 新增 6 个港口 ──
  {
    id: 'spain', name: '西班牙', sub: 'SPAIN', x: 8, y: 53, side: 'right',
    exports: ['olive', 'wine'], imports: ['spice', 'silk', 'gold', 'cheese'],
    blurb: '伊比利亚半岛，橄榄园与斗牛士的故土',
  },
  {
    id: 'netherlands', name: '荷兰', sub: 'NETHERLANDS', x: 22, y: 25, side: 'right',
    exports: ['cheese', 'watch'], imports: ['silk', 'tea', 'gem', 'wine', 'vanilla', 'tobacco'],
    blurb: '低地之国，风车与郁金香，钟表匠之都',
  },
  {
    id: 'oman', name: '阿曼', sub: 'OMAN', x: 42, y: 47, side: 'left',
    exports: ['frankincense', 'pearl'], imports: ['timber', 'wine', 'porcelain', 'sword'],
    blurb: '阿拉伯海之门，乳香与珍珠的产地',
  },
  {
    id: 'borneo', name: '婆罗洲', sub: 'BORNEO', x: 79, y: 66, side: 'left',
    exports: ['nest', 'timber'], imports: ['silk', 'wine', 'perfume', 'silver'],
    blurb: '热带雨林深处，金丝燕燕窝与红木之乡',
  },
  {
    id: 'madagascar', name: '马达加斯加', sub: 'MADAGASCAR', x: 44, y: 82, side: 'left',
    exports: ['vanilla', 'coffee'], imports: ['silk', 'tea', 'sword', 'whisky'],
    blurb: '印度洋上的香草之岛，猴面包树与狐猴',
  },
  {
    id: 'panama', name: '巴拿马', sub: 'PANAMA', x: 72, y: 92, side: 'right',
    exports: ['tobacco', 'silver'], imports: ['silk', 'wine', 'perfume', 'gem'],
    blurb: '两洋咽喉，烟草与白银的新大陆港口',
  },
]

export const CITY_BY_ID: Record<string, City> = Object.fromEntries(
  CITIES.map(c => [c.id, c]),
)

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
]

export const SHIP_BY_ID: Record<string, ShipClass> = Object.fromEntries(
  SHIPS.map(s => [s.id, s]),
)

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

/** 12 位可雇佣的航海好手，散落在世界各港 */
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
  { id: 'ab4', icon: '💎', label: '全品收购家', desc: '买过全部 29 种商品', target: 29, kind: 'bought' },
  // ── 出售 ──
  { id: 'as1', icon: '💰', label: '第一桶金', desc: '卖出过 5 种商品', target: 5, kind: 'sold' },
  { id: 'as2', icon: '🤝', label: '销售行家', desc: '卖出过 12 种商品', target: 12, kind: 'sold' },
  { id: 'as3', icon: '📈', label: '大批发商', desc: '卖出过 20 种商品', target: 20, kind: 'sold' },
  { id: 'as4', icon: '👑', label: '垄断商人', desc: '卖出过全部 29 种商品', target: 29, kind: 'sold' },
  // ── 买过且卖过（并集）──
  { id: 'at1', icon: '⚖️', label: '两头通吃', desc: '交易过（买或卖）10 种商品', target: 10, kind: 'traded' },
  { id: 'at2', icon: '🔄', label: '全链路商人', desc: '交易过（买或卖）全部 29 种商品', target: 29, kind: 'traded' },
]

export const TITLES: { min: number; name: string }[] = [
  { min: 0, name: '初出茅庐' },
  { min: 20_000, name: '初级商人' },
  { min: 60_000, name: '见习商人' },
  { min: 150_000, name: '海上商人' },
  { min: 400_000, name: '东方富商' },
  { min: 1_000_000, name: '大航海王' },
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
