// ─────────────────────────────────────────────────────────────────────────────
//  地理标注（v1.0.4）：海峡 / 大洋 / 海湾 / 沙漠 / 山脉
//  v1.5.1：flat 增加 minZoom 分层 —— 平面图小图只放常显层（四大洋 + 马六甲），
//  1.3× 浮现大洲与大海名，1.6× 浮现海峡 / 沙漠 / 山脉，2.0× 再浮现细节地貌。
//  分层足够密，保证放大后任何视野里都有 3-5 个标注可看。
//  flat: 平面手绘世界坐标（0-100，与 CITIES 同坐标系）
//  geo:  真实经纬度（球形地球视图用）
// ─────────────────────────────────────────────────────────────────────────────

export type GeoKind = 'ocean' | 'sea' | 'strait' | 'desert' | 'mountain' | 'region'

export interface GeoFeature {
  name: string
  kind: GeoKind
  /** 平面图位置与倾斜角；minZoom = 平面图开始显示的缩放等级（缺省 = 常显） */
  flat: { x: number; y: number; rotate: number; minZoom?: number }
  /** 球形地球的经纬度 */
  geo: [lon: number, lat: number]
  /** 平面图上是否显示文字 */
  flatText?: boolean
}

export const GEO_FEATURES: GeoFeature[] = [
  // ── 常显层：四大洋 + 马六甲（任何缩放级别都在） ──
  { name: '北大西洋', kind: 'ocean', flat: { x: 3, y: 16, rotate: -75 }, geo: [-38, 42], flatText: true },
  { name: '北冰洋',   kind: 'ocean', flat: { x: 40, y: 2, rotate: -6 },   geo: [60, 80],  flatText: true },
  { name: '印度洋',   kind: 'ocean', flat: { x: 48, y: 62, rotate: -8 },  geo: [72, -24], flatText: true },
  { name: '太平洋',   kind: 'ocean', flat: { x: 97, y: 45, rotate: -75 }, geo: [-155, -8], flatText: true },
  { name: '马六甲海峡', kind: 'strait', flat: { x: 65, y: 53, rotate: -38 }, geo: [99, 3], flatText: true },
  // ── 1.3×：大洲名 + 大海名 ──
  { name: '亚洲',   kind: 'region', flat: { x: 57, y: 17, rotate: -12, minZoom: 1.3 }, geo: [90, 50], flatText: true },
  { name: '欧洲',   kind: 'region', flat: { x: 13, y: 32, rotate: -80, minZoom: 1.3 }, geo: [15, 50], flatText: true },
  { name: '非洲',   kind: 'region', flat: { x: 12, y: 69, rotate: -78, minZoom: 1.3 }, geo: [20, 5],  flatText: true },
  { name: '北美洲', kind: 'region', flat: { x: 74, y: 76, rotate: -8,  minZoom: 1.3 }, geo: [-100, 45], flatText: true },
  { name: '新大陆', kind: 'region', flat: { x: 68, y: 86, rotate: -8,  minZoom: 1.3 }, geo: [-75, -10], flatText: true },
  { name: '大洋洲', kind: 'region', flat: { x: 92, y: 62, rotate: -10, minZoom: 1.3 }, geo: [134, -25], flatText: true },
  { name: '地中海',   kind: 'sea', flat: { x: 21, y: 46.5, rotate: -24, minZoom: 1.3 }, geo: [18, 35], flatText: true },
  { name: '阿拉伯海', kind: 'sea', flat: { x: 47, y: 36, rotate: -6,  minZoom: 1.3 }, geo: [63, 13], flatText: true },
  { name: '孟加拉湾', kind: 'sea', flat: { x: 64, y: 34, rotate: -14, minZoom: 1.3 }, geo: [88, 14], flatText: true },
  { name: '南海',     kind: 'sea', flat: { x: 88, y: 47, rotate: -10, minZoom: 1.3 }, geo: [114, 13], flatText: true },
  { name: '日本海',   kind: 'sea', flat: { x: 95, y: 20, rotate: -75, minZoom: 1.3 }, geo: [135, 40], flatText: true },
  { name: '波罗的海', kind: 'sea', flat: { x: 25, y: 3,  rotate: -8,  minZoom: 1.3 }, geo: [19, 58], flatText: true },
  { name: '黑海',     kind: 'sea', flat: { x: 31, y: 29, rotate: -15, minZoom: 1.3 }, geo: [34, 43], flatText: true },
  // ── 1.6×：海域细节 + 陆上地形 ──
  { name: '北海',     kind: 'sea',    flat: { x: 11, y: 19, rotate: -8,  minZoom: 1.6 }, geo: [3, 57],  flatText: true },
  { name: '东海',     kind: 'sea',    flat: { x: 87, y: 21, rotate: -12, minZoom: 1.6 }, geo: [126, 29], flatText: true },
  { name: '爪哇海',   kind: 'sea',    flat: { x: 71, y: 64, rotate: -8,  minZoom: 1.6 }, geo: [111, -5], flatText: true },
  { name: '波斯湾',   kind: 'sea',    flat: { x: 44, y: 33, rotate: -20, minZoom: 1.6 }, geo: [51, 27], flatText: true },
  { name: '珊瑚海',   kind: 'sea',    flat: { x: 97, y: 77, rotate: -10, minZoom: 1.6 }, geo: [152, -16], flatText: true },
  { name: '加勒比海', kind: 'sea',    flat: { x: 80, y: 86, rotate: -8,  minZoom: 1.6 }, geo: [-75, 14], flatText: true },
  { name: '红海',       kind: 'strait', flat: { x: 33.5, y: 41, rotate: 55, minZoom: 1.6 }, geo: [36, 21], flatText: true },
  { name: '撒哈拉沙漠',   kind: 'desert',  flat: { x: 13, y: 57, rotate: -6,  minZoom: 1.6 }, geo: [10, 21], flatText: true },
  { name: '喜马拉雅山脉', kind: 'mountain', flat: { x: 70, y: 24, rotate: -10, minZoom: 1.6 }, geo: [86, 33], flatText: true },
  // ── 2.0×：细节地貌（深放大才浮现） ──
  { name: '阿尔卑斯山脉',   kind: 'mountain', flat: { x: 23, y: 38, rotate: -70, minZoom: 2 }, geo: [9, 46],   flatText: true },
  { name: '阿特拉斯山脉',   kind: 'mountain', flat: { x: 4,  y: 61, rotate: -55, minZoom: 2 }, geo: [-5, 31],  flatText: true },
  { name: '落基山脉',       kind: 'mountain', flat: { x: 87, y: 73, rotate: -75, minZoom: 2 }, geo: [-110, 44], flatText: true },
  { name: '安第斯山脉',     kind: 'mountain', flat: { x: 58, y: 93, rotate: -70, minZoom: 2 }, geo: [-70, -24], flatText: true },
  { name: '阿拉伯沙漠',     kind: 'desert',   flat: { x: 43, y: 28, rotate: -10, minZoom: 2 }, geo: [45, 22],  flatText: true },
  { name: '戈壁沙漠',       kind: 'desert',   flat: { x: 71, y: 6,  rotate: -8,  minZoom: 2 }, geo: [105, 43], flatText: true },
  { name: '直布罗陀海峡',   kind: 'strait',   flat: { x: 3,  y: 49, rotate: -75, minZoom: 2 }, geo: [-5, 36],  flatText: true },
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
