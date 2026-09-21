// ─────────────────────────────────────────────────────────────────────────────
//  远洋贸易 · 地理数据与球面投影（v1.4.0 球形地球视图）
//  经度 lon: -180 ~ 180（东经为正）  纬度 lat: -90 ~ 90（北纬为正）
// ─────────────────────────────────────────────────────────────────────────────

export type LonLat = [number, number]
/** 多边形环：[经度, 纬度] 数组 */
export type Ring = LonLat[]

/** 21 个港口的真实地理坐标（与平面手绘图各自独立，互不影响航行计算） */
export const CITY_GEO: Record<string, LonLat> = {
  norway: [6, 60],
  england: [-2, 53],
  france: [2, 47],
  spain: [-4, 40],
  netherlands: [5, 52.5],
  egypt: [31, 28],
  persia: [53, 32],
  arabia: [46, 24],
  oman: [57, 23],
  india: [78, 20],
  srilanka: [81, 7],
  china: [121, 30],
  japan: [139, 35],
  malacca: [102, 2],
  java: [110, -7],
  borneo: [114, 1],
  madagascar: [47, -19],
  africa: [20, -30],
  aztec: [-99, 19],
  inca: [-75, -14],
  panama: [-79, 9],
}

export function geoOf(cityId: string): LonLat {
  return CITY_GEO[cityId] ?? [0, 0]
}

/** 简化的大陆轮廓（卡通风格，够用即可，按环绘制） */
export const LAND: { n: string; r: Ring }[] = [
  // ── 北半球 ──
  {
    n: '格陵兰', r: [[-45, 59], [-32, 66], [-24, 70], [-20, 76], [-22, 81], [-38, 83], [-55, 82], [-58, 74], [-52, 64], [-45, 59]],
  },
  {
    n: '北美',
    r: [
      [-166, 66], [-150, 70], [-125, 72], [-95, 73], [-75, 68], [-58, 60], [-52, 47], [-66, 43],
      [-75, 36], [-81, 26], [-90, 29], [-97, 26], [-105, 23], [-113, 31], [-124, 40], [-130, 52],
      [-140, 58], [-155, 58], [-166, 66],
    ],
  },
  {
    n: '中美地峡',
    r: [[-105, 22], [-96, 17], [-88, 17], [-83, 10], [-77, 8], [-78, 10], [-84, 14], [-90, 18], [-100, 21], [-105, 22]],
  },
  {
    n: '南美',
    r: [
      [-79, 8], [-70, 11], [-60, 11], [-52, 5], [-35, -6], [-38, -16], [-48, -25], [-58, -35],
      [-62, -41], [-66, -55], [-72, -53], [-72, -40], [-71, -25], [-75, -15], [-81, -5], [-79, 8],
    ],
  },
  {
    n: '欧洲',
    r: [
      [-9, 43], [-9, 37], [-6, 36], [0, 39], [3, 42], [8, 44], [13, 45], [16, 42], [19, 40],
      [24, 41], [28, 41], [30, 46], [28, 55], [24, 58], [20, 60], [15, 57], [10, 54], [7, 52],
      [3, 51], [-2, 50], [-5, 48], [-9, 43],
    ],
  },
  { n: '不列颠', r: [[-8, 50], [-6, 55], [-3, 59], [1, 54], [0, 51], [-4, 50], [-8, 50]] },
  { n: '北欧', r: [[4, 58], [6, 62], [11, 68], [20, 70], [29, 70], [31, 66], [30, 60], [24, 58], [18, 56], [12, 57], [7, 58], [4, 58]] },
  { n: '冰岛', r: [[-24, 64], [-14, 65], [-14, 66], [-22, 67], [-24, 64]] },
  {
    n: '非洲',
    r: [
      [36, 37], [40, 38], [48, 30], [57, 26], [59, 22], [55, 17], [44, 12.6], [43, 12.6], [44, 11],
      [42, -1], [40, -15], [35, -25], [26, -34], [18, -34], [12, -18], [9, -1], [9, 4], [3, 6],
      [-8, 5], [-17, 15], [-17, 21], [-10, 30], [-6, 36], [10, 37], [20, 32], [32, 32], [36, 37],
    ],
  },
  { n: '马达加斯加', r: [[47, -12], [50, -15], [48, -25], [44, -25], [43, -20], [45, -15], [47, -12]] },
  {
    n: '亚洲',
    r: [
      [75, 36], [85, 40], [95, 44], [105, 47], [115, 49], [125, 52], [133, 48], [128, 44],
      [122, 40], [122, 31], [117, 23], [110, 21], [105, 22], [100, 22], [96, 26], [91, 28],
      [85, 28], [78, 32], [75, 36],
    ],
  },
  { n: '印度', r: [[68, 24], [73, 20], [77, 9], [81, 9], [87, 21], [90, 23], [88, 27], [80, 29], [74, 31], [68, 24]] },
  { n: '斯里兰卡', r: [[80, 6], [82, 7], [82, 9.5], [80, 10], [79, 8], [80, 6]] },
  { n: '日本', r: [[130, 32], [134, 34], [139, 35], [142, 40], [145, 44], [141, 45], [137, 37], [133, 33], [130, 32]] },
  { n: '中南半岛', r: [[97, 17], [100, 20], [105, 22], [109, 21], [110, 15], [107, 11], [104, 2], [101, 3], [100, 7], [98, 12], [97, 17]] },
  { n: '苏门答腊', r: [[95, 5], [104, -2], [106, -6], [101, -3], [97, 2], [95, 5]] },
  { n: '爪哇', r: [[105, -6], [114, -8], [116, -9], [112, -9], [106, -7], [105, -6]] },
  { n: '婆罗洲', r: [[109, 2], [117, 4], [119, 1], [116, -4], [110, -3], [109, 2]] },
  { n: '菲律宾', r: [[120, 14], [124, 16], [126, 9], [122, 6], [119, 10], [120, 14]] },
  { n: '新几内亚', r: [[119, -1], [125, -2], [130, -1], [141, -3], [147, -8], [140, -9], [132, -4], [124, -5], [119, -1]] },
  { n: '澳洲', r: [[113, -22], [122, -17], [130, -12], [137, -11], [143, -11], [146, -19], [151, -25], [153, -31], [149, -38], [143, -39], [137, -35], [130, -32], [120, -34], [114, -34], [113, -22]] },
  { n: '新西兰', r: [[172, -34], [176, -38], [174, -42], [170, -46], [166, -46], [168, -41], [172, -34]] },
  { n: '安的列斯', r: [[-84, 21], [-77, 20], [-74, 20], [-78, 22], [-84, 21]] },
  { n: '南极', r: [[-180, -70], [-120, -72], [-60, -68], [0, -68], [60, -66], [120, -68], [180, -70], [180, -90], [-180, -90]] },
]

// ── 球面数学 ────────────────────────────────────────────────────────────────

const D2R = Math.PI / 180
const R2D = 180 / Math.PI

export interface Vec3 { x: number; y: number; z: number }

/** 经纬度 → 单位球向量 */
export function toVec(lonDeg: number, latDeg: number): Vec3 {
  const lon = lonDeg * D2R
  const lat = latDeg * D2R
  const cl = Math.cos(lat)
  return { x: cl * Math.cos(lon), y: cl * Math.sin(lon), z: Math.sin(lat) }
}

export function toLonLat(v: Vec3): LonLat {
  return [Math.atan2(v.y, v.x) * R2D, Math.atan2(v.z, Math.hypot(v.x, v.y)) * R2D]
}

/** 球面线性插值：让航线贴着地球表面走 */
export function slerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  let d = a.x * b.x + a.y * b.y + a.z * b.z
  d = d > 1 ? 1 : d < -1 ? -1 : d
  const om = Math.acos(d)
  if (om < 1e-6) return a
  const s = Math.sin(om)
  const k1 = Math.sin((1 - t) * om) / s
  const k2 = Math.sin(t * om) / s
  return { x: a.x * k1 + b.x * k2, y: a.y * k1 + b.y * k2, z: a.z * k1 + b.z * k2 }
}

export function slerpLonLat(a: LonLat, b: LonLat, t: number): LonLat {
  return toLonLat(slerp3(toVec(a[0], a[1]), toVec(b[0], b[1]), t))
}

/** 两点球面夹角（度） —— 用于判断远近 */
export function angularDistance(a: LonLat, b: LonLat): number {
  const va = toVec(a[0], a[1])
  const vb = toVec(b[0], b[1])
  let d = va.x * vb.x + va.y * vb.y + va.z * vb.z
  d = d > 1 ? 1 : d < -1 ? -1 : d
  return Math.acos(d) * R2D
}

export interface ScreenPoint { x: number; y: number; z: number }

export interface Sphere {
  /** 经纬度 → 屏幕坐标（z 为朝向观察者的深度，>0 表示在正面可见） */
  project: (lon: number, lat: number) => ScreenPoint
  /** 把多边形裁剪到可见半球（返回屏幕坐标点集，可安全 fill） */
  clip: (pts: ScreenPoint[]) => ScreenPoint[]
  /** 采样整条经纬线：lat 固定（纬线）或 lon 固定（经线） */
  parallel: (lat: number) => ScreenPoint[]
  meridian: (lon: number) => ScreenPoint[]
  center: { x: number; y: number }
  radius: number
}

/** 创建正交投影球：视图中心 (lon0, lat0)，半径 R，屏幕圆心 (cx, cy) */
export function createSphere(lon0: number, lat0: number, R: number, cx: number, cy: number): Sphere {
  const lo = lon0 * D2R
  const la0 = lat0 * D2R
  const sl0 = Math.sin(la0)
  const cl0 = Math.cos(la0)

  function project(lon: number, lat: number): ScreenPoint {
    const l = lon * D2R
    const a = lat * D2R
    const cl = Math.cos(a)
    const sl = Math.sin(a)
    const dl = l - lo
    const cdl = Math.cos(dl)
    const sdl = Math.sin(dl)
    // 视空间：X 右 / Y 上 / Z 朝向观察者
    const X = cl * sdl
    const Y = cl0 * sl - sl0 * cl * cdl
    const Z = sl0 * sl + cl0 * cl * cdl
    return { x: cx + R * X, y: cy - R * Y, z: Z }
  }

  function onLimb(p: ScreenPoint): ScreenPoint {
    const dx = p.x - cx
    const dy = p.y - cy
    const len = Math.hypot(dx, dy) || 1
    return { x: cx + (dx / len) * R, y: cy + (dy / len) * R, z: 0 }
  }

  function clip(pts: ScreenPoint[]): ScreenPoint[] {
    const out: ScreenPoint[] = []
    const n = pts.length
    for (let i = 0; i < n; i++) {
      const a = pts[i]
      const b = pts[(i + 1) % n]
      const ain = a.z >= 0
      const bin = b.z >= 0
      if (ain) out.push(a)
      if (ain !== bin) {
        const t = a.z / (a.z - b.z)
        out.push(onLimb({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: 0 }))
      }
    }
    return out
  }

  function parallel(lat: number): ScreenPoint[] {
    const pts: ScreenPoint[] = []
    for (let lon = -180; lon <= 180; lon += 4) pts.push(project(lon, lat))
    return pts
  }

  function meridian(lon: number): ScreenPoint[] {
    const pts: ScreenPoint[] = []
    for (let lat = -90; lat <= 90; lat += 4) pts.push(project(lon, lat))
    return pts
  }

  return { project, clip, parallel, meridian, center: { x: cx, y: cy }, radius: R }
}

/** 让 (lon, lat) 落到视图中心的旋转角（用于"聚焦到某港口"） */
export function viewFor(lon: number, lat: number): { lon0: number; lat0: number } {
  return { lon0: lon, lat0: Math.max(-72, Math.min(72, lat * 0.85)) }
}

/** 归一化经度到 -180~180 */
export function normLon(lon: number): number {
  let l = lon
  while (l > 180) l -= 360
  while (l < -180) l += 360
  return l
}
