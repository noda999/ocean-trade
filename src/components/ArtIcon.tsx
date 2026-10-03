import type { CSSProperties } from 'react'
import { ICON_VER } from './iconVer'
import { UI_SPRITE, UI_SPRITE_COLS, UI_SPRITE_ROWS } from './uiSprite'

interface Props {
  /** 图标名（对应 public/icons/<name>.png） */
  name: string
  /** 边长（px），默认 40 */
  size?: number
  className?: string
  style?: CSSProperties
  /** 位图加载失败时的回调（用于回落到 SVG 等备用渲染） */
  onError?: () => void
}

/** AI 生成的全彩扁平插画图标：优先命中精灵图（ui-sprite.png，省文件数），
 *  否则直接引用 public/icons 下的单张位图 */
export function ArtIcon({ name, size = 40, className, style, onError }: Props) {
  const cell = UI_SPRITE[name]
  if (cell) {
    // 精灵图整张按 size 等比缩放后平移取格，任意尺寸都清晰
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          flexShrink: 0,
          width: size,
          height: size,
          backgroundImage: `url(./icons/ui-sprite.png?v=${ICON_VER})`,
          backgroundSize: `${UI_SPRITE_COLS * size}px ${UI_SPRITE_ROWS * size}px`,
          backgroundPosition: `-${cell[0] * size}px -${cell[1] * size}px`,
          backgroundRepeat: 'no-repeat',
          ...style,
        }}
      />
    )
  }
  return (
    <img
      src={`./icons/${name}.png?v=${ICON_VER}`}
      width={size}
      height={size}
      alt=""
      draggable={false}
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, objectFit: 'contain', ...style }}
      onError={onError}
    />
  )
}
