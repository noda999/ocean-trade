// ─────────────────────────────────────────────────────────────────────────────
//  商船 SVG（集装箱货轮画风，可换配色 / 朝向 / 高亮）
// ─────────────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** 调亮 / 调暗一个颜色，amt: -1 ~ 1 */
export function shade(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex)
  const f = (v: number) => Math.round(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))
  return `rgb(${f(r)},${f(g)},${f(b)})`
}

const CONTAINER_COLORS = ['#e0533f', '#3f8fd0', '#e0a83f', '#48a86a', '#7f68c8', '#d8688f']

interface Props {
  color: string
  size?: number
  /** 玩家船高亮：金光环 + 更大尾迹 */
  highlight?: boolean
  /** 水平翻转（向左航行） */
  flip?: boolean
  /** 船体倾斜角度（度） */
  tilt?: number
}

export function ShipSprite({ color, size = 46, highlight = false, flip = false, tilt = 0 }: Props) {
  const h = size * 0.68
  const dark = shade(color, -0.34)
  const mid = shade(color, -0.14)
  const light = shade(color, 0.34)

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 56 38"
      fill="none"
      style={{
        transform: `scaleX(${flip ? -1 : 1}) rotate(${tilt}deg)`,
        transition: 'transform .4s ease',
        overflow: 'visible',
      }}
    >
      {highlight && (
        <ellipse cx="28" cy="31" rx="26" ry="7" fill="#f5c830" opacity="0.28" />
      )}
      {/* 尾迹浪花 */}
      <ellipse cx={flip ? 44 : 12} cy="31" rx={highlight ? 16 : 12} ry="3.4" fill="white" opacity="0.5" />
      <ellipse cx={flip ? 47 : 9} cy="32.5" rx={highlight ? 10 : 7} ry="2.2" fill="white" opacity="0.32" />

      {/* 船体 */}
      <path d="M3 19.5 L53 19.5 L48 31.5 Q28 35.6 8 31.5 Z" fill={mid} />
      <path d="M3 24.5 L53 24.5 L50.5 29.5 Q28 33.2 5.5 29.5 Z" fill={dark} />
      <path d="M3 19.5 L53 19.5 L52 22 L4 22 Z" fill={light} />
      {/* 船艏斜切 */}
      <path d="M50 19.5 L54 19.5 L50.5 26 Z" fill={dark} opacity="0.7" />

      {/* 甲板 */}
      <rect x="6" y="16.5" width="44" height="3.2" rx="1.4" fill={light} />

      {/* 集装箱（下排 4 + 上排 2） */}
      {[0, 1, 2, 3].map(i => (
        <rect
          key={i}
          x={6.5 + i * 9.4}
          y={10.4}
          width={8.4}
          height={6}
          rx={0.8}
          fill={CONTAINER_COLORS[(i + 1) % CONTAINER_COLORS.length]}
        />
      ))}
      {[0, 1].map(i => (
        <rect
          key={i}
          x={15 + i * 9.4}
          y={4.6}
          width={8.4}
          height={5.6}
          rx={0.8}
          fill={CONTAINER_COLORS[(i + 3) % CONTAINER_COLORS.length]}
        />
      ))}

      {/* 舰桥 */}
      <rect x="42.5" y="8.6" width="9.5" height="8" rx="1.4" fill={shade(color, 0.72)} />
      <rect x="43.6" y="10.4" width="7.3" height="2.4" rx="0.8" fill="#8fd0e8" />
      <rect x="43.6" y="13.6" width="7.3" height="1.6" rx="0.6" fill="#cfeaf5" opacity="0.8" />
      {/* 桅杆与旗 */}
      <line x1="47" y1="8.6" x2="47" y2="1.4" stroke={dark} strokeWidth="1.3" />
      <path d="M47 1.4 L53 3.2 L47 5.2 Z" fill={highlight ? '#f5913a' : '#e2483a'} />
      <circle cx="47" cy="1.2" r="1.1" fill={highlight ? '#f5c830' : '#e0d0b0'} />

      {/* 水线泡沫 */}
      <path d="M6 30.5 Q16 28.6 28 30.5 Q40 32.4 50 30.2" stroke="white" strokeWidth="1.2" opacity="0.55" fill="none" />
    </svg>
  )
}

/** 小型船只（用于地图上的点缀渔船） */
export function TinyBoat({ color = '#f0e0c0', size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 30 18" fill="none">
      <ellipse cx="15" cy="14.5" rx="11" ry="2.6" fill="white" opacity="0.45" />
      <path d="M2 9 L28 9 L25 15 Q15 17.4 5 15 Z" fill={color} />
      <path d="M2 12 L28 12 L26.5 14.6 Q15 16.8 3.5 14.6 Z" fill={shade(color, -0.3)} />
      <line x1="15" y1="9" x2="15" y2="1" stroke={shade(color, -0.4)} strokeWidth="1.2" />
      <path d="M15 1 L22 4 L15 7 Z" fill="white" opacity="0.9" />
    </svg>
  )
}
