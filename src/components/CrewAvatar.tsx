import { useId } from 'react'
import type { CrewLook } from '../game/data'

// ─────────────────────────────────────────────────────────────────────────────
//  Q 版船员头像：纯 SVG 绘制的大头水手小人
//  依据 CrewLook 配置组合 发型 / 帽子 / 胡子 / 配件，人人长得不一样
// ─────────────────────────────────────────────────────────────────────────────

export function CrewAvatar({ look, size = 56, bg = '#fffdf8' }: {
  look: CrewLook
  size?: number
  bg?: string
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const clip = `crew-body-${uid}`
  const { skin, hair, hairStyle, hat, hatColor, hatColor2, beardStyle, beardColor, accessory } = look
  const beardC = beardColor ?? hair
  const eyepatch = accessory === 'eyepatch'
  const bodyPath = 'M13 60 Q13 46.5 32 45 Q51 46.5 51 60 Z'

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block' }}>
      <defs>
        <clipPath id={clip}>
          <path d={bodyPath} />
        </clipPath>
      </defs>

      <circle cx={32} cy={32} r={31} fill={bg} />

      {/* 后层长发 / 发髻 */}
      {hairStyle === 'long' && (
        <>
          <rect x={12.5} y={25} width={6.5} height={21} rx={3.2} fill={hair} />
          <rect x={45} y={25} width={6.5} height={21} rx={3.2} fill={hair} />
        </>
      )}
      {hairStyle === 'bun' && <circle cx={32} cy={13.5} r={5.5} fill={hair} />}

      {/* 身体：条纹水手衫 + 领巾 */}
      <path d={bodyPath} fill="#fdfaf3" />
      <g clipPath={`url(#${clip})`}>
        <rect x={10} y={49.5} width={44} height={3.4} fill={hatColor} opacity={0.85} />
        <rect x={10} y={55} width={44} height={3.4} fill={hatColor} opacity={0.85} />
      </g>
      <path d="M26 44.5 Q32 51 38 44.5 Q32 47.5 26 44.5 Z" fill={hatColor} />

      {/* 头 */}
      <circle cx={17.8} cy={31} r={2.6} fill={skin} />
      <circle cx={46.2} cy={31} r={2.6} fill={skin} />
      <circle cx={32} cy={30} r={15} fill={skin} stroke="rgba(0,0,0,0.10)" strokeWidth={0.8} />

      {/* 头发（刘海） */}
      {hairStyle !== 'bald' && (
        <path
          d="M16.8 29.5 A15.2 15.2 0 0 1 47.2 29.5 Q43 24.5 38 23.8 Q35 23 32 23.4 Q29 23 26 23.8 Q21 24.5 16.8 29.5 Z"
          fill={hair}
        />
      )}

      {/* 眼睛（大而圆的豆豆眼） */}
      <ellipse cx={26} cy={31} rx={2.3} ry={3.1} fill="#2d2016" />
      <circle cx={26.9} cy={29.9} r={0.9} fill="#fff" />
      {!eyepatch && (
        <>
          <ellipse cx={38} cy={31} rx={2.3} ry={3.1} fill="#2d2016" />
          <circle cx={38.9} cy={29.9} r={0.9} fill="#fff" />
        </>
      )}

      {/* 腮红 */}
      <circle cx={22.5} cy={35.5} r={2.3} fill="#ff9d9d" opacity={0.5} />
      <circle cx={41.5} cy={35.5} r={2.3} fill="#ff9d9d" opacity={0.5} />

      {/* 眼罩（在海盗界这叫时尚单品） */}
      {eyepatch && (
        <>
          <path d="M18 25 L46 23" stroke="#1d1710" strokeWidth={1.5} fill="none" />
          <circle cx={38} cy={31} r={4.2} fill="#1d1710" />
          <circle cx={39.2} cy={29.8} r={1.1} fill="#4a4a4a" />
        </>
      )}

      {/* 胡子 */}
      {beardStyle === 'full' && (
        <path
          d="M20.5 33.5 Q21 45.5 32 45.5 Q43 45.5 43.5 33.5 Q40 42.5 32 42.8 Q24 42.5 20.5 33.5 Z"
          fill={beardC}
        />
      )}
      {beardStyle === 'mustache' && (
        <path
          d="M26.5 36 Q29 34 31.7 35.8 Q32 36 32.3 35.8 Q35 34 37.5 36 Q35 38.2 32.2 37 Q29.4 38.2 26.5 36 Z"
          fill={beardC}
        />
      )}

      {/* 嘴（憨憨微笑） */}
      <path d="M29.5 37.5 Q32 40 34.5 37.5" stroke="#a05a3c" strokeWidth={1.4} fill="none" strokeLinecap="round" />

      {/* 配件 */}
      {accessory === 'earring' && (
        <circle cx={47.8} cy={34.2} r={1.7} fill="#f5c830" stroke="#c9932a" strokeWidth={0.5} />
      )}
      {accessory === 'scar' && (
        <g stroke="#c97a5a" strokeWidth={1.1} strokeLinecap="round">
          <path d="M22.5 33.5 L25.5 38" />
          <path d="M22.3 35.2 L24.9 34.4" />
          <path d="M23.9 37 L26 36" />
        </g>
      )}
      {accessory === 'pipe' && (
        <g>
          <path d="M34.5 38 L38 39.5 L38.6 42" stroke="#6b4a2f" strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <circle cx={38.7} cy={43} r={2} fill="#6b4a2f" />
          <circle cx={41.5} cy={45.8} r={1.6} fill="#fff" opacity={0.55} />
          <circle cx={43.5} cy={48.8} r={1.1} fill="#fff" opacity={0.45} />
        </g>
      )}

      {/* 帽子 */}
      {hat === 'tricorn' && (
        <g>
          <path d="M20 20 Q32 4 44 20 Z" fill={hatColor2 ?? hatColor} />
          <ellipse cx={32} cy={20.5} rx={24} ry={4.6} fill={hatColor} />
          <path d="M20 20 Q32 15.5 44 20" stroke="#f0c860" strokeWidth={1.2} fill="none" />
        </g>
      )}
      {hat === 'sailor' && (
        <g>
          <path d="M19 21 Q32 7.5 45 21 Z" fill="#fdfdfd" stroke="#d9dde2" strokeWidth={0.8} />
          <rect x={18} y={19} width={28} height={4.4} rx={2.2} fill={hatColor} />
          <path d="M45 20.5 L50 24 L46 24.5 Z" fill={hatColor} />
        </g>
      )}
      {(hat === 'bandana' || hat === 'feather') && (
        <g>
          <path d="M17.5 26 Q32 7.5 46.5 26 Q40 22.5 32 23.2 Q24 22.5 17.5 26 Z" fill={hatColor} />
          <circle cx={45.8} cy={25.2} r={2.8} fill={hatColor} />
          <path d="M46.5 26 L52.5 29.5 L47.8 31 Z" fill={hatColor} />
          <path d="M47 27 L51 34.5 L46.2 33.2 Z" fill={hatColor} opacity={0.9} />
          {hat === 'bandana' ? (
            <>
              <circle cx={26} cy={19.5} r={1.3} fill="#fff" opacity={0.85} />
              <circle cx={34} cy={16.5} r={1.3} fill="#fff" opacity={0.85} />
              <circle cx={40.5} cy={21} r={1.3} fill="#fff" opacity={0.85} />
            </>
          ) : (
            <>
              <path d="M42 20 Q47 8 56 5.5 Q54.5 14 46 22.5 Z" fill={hatColor2 ?? '#e8542f'} />
              <path d="M44.5 20 Q49 11.5 53.5 7.5" stroke="rgba(0,0,0,0.25)" strokeWidth={0.7} fill="none" />
            </>
          )}
        </g>
      )}
      {hat === 'turban' && (
        <g>
          <ellipse cx={32} cy={17.5} rx={15} ry={8.6} fill={hatColor} />
          <ellipse cx={32} cy={12.8} rx={10.5} ry={6} fill={hatColor2 ?? '#ffffff'} opacity={0.55} />
          <path d="M18 19 Q32 23 46 19" stroke="rgba(0,0,0,0.14)" strokeWidth={1.2} fill="none" />
          <circle cx={32} cy={16} r={2.1} fill="#f5c830" stroke="#c9932a" strokeWidth={0.6} />
        </g>
      )}
      {hat === 'chef' && (
        <g>
          <circle cx={27} cy={8.5} r={4.2} fill="#fff" />
          <circle cx={37} cy={8.5} r={4.2} fill="#fff" />
          <circle cx={32} cy={6.5} r={4.6} fill="#fff" />
          <rect x={23} y={8} width={18} height={12} rx={3} fill="#fff" stroke="#e4e4ea" strokeWidth={0.7} />
          <rect x={21.5} y={18.5} width={21} height={5} rx={2.5} fill="#ececf2" />
        </g>
      )}
    </svg>
  )
}
