// ─────────────────────────────────────────────────────────────────────────────
//  地理标注（v1.0.4）：海峡 / 大洋 / 海湾 / 沙漠 / 山脉
//  flat: 平面手绘世界坐标（0-100，与 CITIES 同坐标系）
//  geo:  真实经纬度（球形地球视图用）
//  flatText: 平面图是否显示文字 —— 平面图以地形图形为主，仅保留大洋与马六甲海峡
// ─────────────────────────────────────────────────────────────────────────────

export type GeoKind = 'ocean' | 'sea' | 'strait' | 'desert' | 'mountain'

export interface GeoFeature {
  name: string
  kind: GeoKind
  /** 平面图位置与倾斜角（deg） */
  flat: { x: number; y: number; rotate: number }
  /** 球形地球的经纬度 */
  geo: [lon: number, lat: number]
  /** 平面图上是否显示文字（false = 只用于球面视图 / 或由地形图形代替） */
  flatText?: boolean
}

export const GEO_FEATURES: GeoFeature[] = [
  // ── 大洋（平面图保留文字，但调淡） ──
  { name: '北大西洋', kind: 'ocean', flat: { x: 3, y: 16, rotate: -75 }, geo: [-38, 42], flatText: true },
  { name: '印度洋',   kind: 'ocean', flat: { x: 48, y: 62, rotate: -8 },  geo: [72, -24], flatText: true },
  { name: '太平洋',   kind: 'ocean', flat: { x: 95, y: 55, rotate: -75 }, geo: [-155, -8], flatText: true },
  // ── 海与海湾（仅球面视图显示文字；平面图不显示） ──
  { name: '北海',     kind: 'sea', flat: { x: 11, y: 19, rotate: -8 },   geo: [3, 57] },
  { name: '地中海',   kind: 'sea', flat: { x: 21, y: 46.5, rotate: -24 }, geo: [18, 35] },
  { name: '阿拉伯海', kind: 'sea', flat: { x: 47, y: 36, rotate: -6 },  geo: [63, 13] },
  { name: '孟加拉湾', kind: 'sea', flat: { x: 64, y: 34, rotate: -14 }, geo: [88, 14] },
  { name: '南海',     kind: 'sea', flat: { x: 86, y: 46, rotate: -10 },  geo: [114, 13] },
  { name: '东海',     kind: 'sea', flat: { x: 87, y: 21, rotate: -12 },  geo: [126, 29] },
  { name: '加勒比海', kind: 'sea', flat: { x: 80, y: 79, rotate: -8 },   geo: [-75, 14] },
  // ── 海峡：平面图只留马六甲，红海由地形（两岸夹水）自明 ──
  { name: '红海',       kind: 'strait', flat: { x: 33.5, y: 41, rotate: 55 }, geo: [36, 21] },
  { name: '马六甲海峡', kind: 'strait', flat: { x: 65, y: 53, rotate: -38 }, geo: [99, 3], flatText: true },
  // ── 陆上地形：平面图用图形（山峦 / 沙丘）表现，不写字 ──
  { name: '撒哈拉沙漠',   kind: 'desert',  flat: { x: 13, y: 57, rotate: -6 }, geo: [10, 21] },
  { name: '喜马拉雅山脉', kind: 'mountain', flat: { x: 70, y: 24, rotate: -10 }, geo: [86, 33] },
]

// ─────────────────────────────────────────────────────────────────────────────
//  球面地形贴纸（v1.0.4）：雪山 / 沙丘 / 丛林 / 针叶林 —— 投影到真实经纬度，
//  随视角缩放淡出，让球形地球的地貌丰富起来。平面图保持简洁不使用。
// ─────────────────────────────────────────────────────────────────────────────

export type TerrainKind = 'mountain' | 'dune' | 'jungle' | 'forest'

export interface TerrainSpot {
  kind: TerrainKind
  geo: [lon: number, lat: number]
  /** 相对大小（1 = 标准） */
  s?: number
}

export const TERRAIN_SPOTS: TerrainSpot[] = [
  // ── 山脉 ──
  { kind: 'mountain', geo: [86, 33], s: 1.15 },    // 喜马拉雅
  { kind: 'mountain', geo: [-110, 44] },           // 落基山
  { kind: 'mountain', geo: [-70, -24], s: 1.1 },   // 安第斯
  { kind: 'mountain', geo: [12, 46] },             // 阿尔卑斯
  // ── 沙漠 ──
  { kind: 'dune', geo: [10, 21], s: 1.25 },        // 撒哈拉
  { kind: 'dune', geo: [45, 22] },                 // 阿拉伯
  { kind: 'dune', geo: [133, -25] },               // 澳洲内陆
  // ── 丛林 ──
  { kind: 'jungle', geo: [-62, -5], s: 1.15 },     // 亚马逊
  { kind: 'jungle', geo: [114, 0] },               // 印尼群岛
  { kind: 'jungle', geo: [22, 0], s: 0.9 },        // 刚果
  // ── 针叶林 ──
  { kind: 'forest', geo: [95, 60], s: 1.2 },       // 西伯利亚
  { kind: 'forest', geo: [-120, 55] },             // 加拿大
  { kind: 'forest', geo: [30, 62] },               // 北欧
]
