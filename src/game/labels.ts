// ─────────────────────────────────────────────────────────────────────────────
//  远洋贸易 · 标签排布（v1.4.0）
//  21 个港口的名字挤在一起会互相遮挡，这里做"分级 + 碰撞避让"：
//    full    → 中文名 + 英文副标
//    compact → 只留中文名
//    （都放不下就只画一个点，鼠标/手指点上去仍有响应）
// ─────────────────────────────────────────────────────────────────────────────

export interface LabelRect {
  /** 候选唯一 id，调用方用它反查具体样式（如左侧还是右侧） */
  id: string
  /** 同一 group 只会保留一个候选（避免一个城市出现两个标签） */
  group: string
  /** 左上角坐标 */
  x: number
  y: number
  w: number
  h: number
}

export interface Bounds { x0: number; y0: number; x1: number; y1: number }

let measureCtx: CanvasRenderingContext2D | null = null
const widthCache = new Map<string, number>()

/** 用离屏 canvas 精确测量文字宽度（比估算字符数准） */
export function textWidth(text: string, font: string): number {
  const key = `${font}\u0000${text}`
  const hit = widthCache.get(key)
  if (hit !== undefined) return hit
  if (!measureCtx) {
    try {
      measureCtx = document.createElement('canvas').getContext('2d')
    } catch {
      measureCtx = null
    }
  }
  let w: number
  if (measureCtx) {
    measureCtx.font = font
    w = measureCtx.measureText(text).width
  } else {
    w = text.length * parseFloat(font) * 0.62
  }
  widthCache.set(key, w)
  return w
}

export type LabelVariant = 'full' | 'compact'

/** 平面地图（手绘版）标签尺寸：名字 12px / 副标 8px */
export function flatPill(name: string, sub: string, scale: number, variant: LabelVariant) {
  const nw = textWidth(name, '800 12px Nunito, sans-serif')
  const sw = variant === 'full' ? textWidth(sub, '700 8px Nunito, sans-serif') + sub.length * 0.4 : 0
  const w = (Math.max(nw, sw) + 18 + 4) * scale
  const h = (variant === 'full' ? 34 : 25) * scale
  return { w, h }
}

/** 球形地球标签尺寸：名字 11px / 副标 7.5px，更紧凑 */
export function globePill(name: string, sub: string, scale: number, variant: LabelVariant) {
  const nw = textWidth(name, '800 11px Nunito, sans-serif')
  const sw = variant === 'full' ? textWidth(sub, '700 7.5px Nunito, sans-serif') + sub.length * 0.35 : 0
  const w = (Math.max(nw, sw) + 16 + 3) * scale
  const h = (variant === 'full' ? 28 : 20) * scale
  return { w, h }
}

/**
 * 依次尝试摆放标签，返回被采纳的矩形。
 * 规则：候选按传入顺序即优先级；同 group 只取第一个成功的；
 *      与已放置矩形重叠 / 越界 → 跳过（force 里的 id 无视重叠，但会被推回边界内）。
 */
export function placeLabels(
  cands: LabelRect[],
  bounds: Bounds,
  opts: { gap?: number; seed?: LabelRect[]; force?: Set<string> } = {},
): LabelRect[] {
  const gap = opts.gap ?? 3
  const placed: LabelRect[] = [...(opts.seed ?? [])]
  const force = opts.force
  const out: LabelRect[] = []
  const usedGroups = new Set<string>()

  for (const raw of cands) {
    if (usedGroups.has(raw.group)) continue
    const c = { ...raw }

    if (force?.has(c.id)) {
      c.x = Math.max(bounds.x0, Math.min(bounds.x1 - c.w, c.x))
      c.y = Math.max(bounds.y0, Math.min(bounds.y1 - c.h, c.y))
      placed.push(c)
      out.push(c)
      usedGroups.add(c.group)
      continue
    }

    if (c.x < bounds.x0 || c.y < bounds.y0 || c.x + c.w > bounds.x1 || c.y + c.h > bounds.y1) continue

    let hit = false
    for (const p of placed) {
      if (c.x < p.x + p.w + gap && c.x + c.w + gap > p.x
        && c.y < p.y + p.h + gap && c.y + c.h + gap > p.y) { hit = true; break }
    }
    if (hit) continue

    placed.push(c)
    out.push(c)
    usedGroups.add(c.group)
  }
  return out
}
