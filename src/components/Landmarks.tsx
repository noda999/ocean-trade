// ─────────────────────────────────────────────────────────────────────────────
//  各城市标志性建筑（纯 SVG 手绘，统一画风）
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactElement } from 'react'

interface Props {
  size?: number
}

/** 通用底影 */
function Shadow({ cx = 48, cy = 99, rx = 32, ry = 5 }: { cx?: number; cy?: number; rx?: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(0,0,0,0.18)" />
}

/** 🇨🇳 中国 · 中式楼阁（三层飞檐宝塔） */
export function LandmarkChina({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={34} />
      {/* 台基 */}
      <rect x="14" y="90" width="68" height="8" rx="3" fill="#c8b48c" />
      <rect x="18" y="86" width="60" height="6" rx="3" fill="#e0cfa8" />
      {/* 一层 */}
      <rect x="24" y="66" width="48" height="20" rx="2" fill="#f2dfc0" />
      <rect x="22" y="62" width="52" height="6" rx="2" fill="#e0c9a2" />
      <rect x="28" y="70" width="9" height="16" rx="2" fill="#a8763f" />
      <rect x="43" y="70" width="9" height="16" rx="2" fill="#a8763f" />
      <rect x="58" y="70" width="9" height="16" rx="2" fill="#a8763f" />
      {/* 一层飞檐 */}
      <path d="M10 62 Q48 44 86 62 L80 60 Q48 48 16 60 Z" fill="#c62f26" />
      <path d="M12 61 Q48 45 84 61 Q48 52 12 61 Z" fill="#e64a3a" />
      <path d="M8 62 Q48 50 88 62" stroke="#a02a22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="8" cy="62" r="2.5" fill="#f5c830" />
      <circle cx="88" cy="62" r="2.5" fill="#f5c830" />
      {/* 二层 */}
      <rect x="32" y="44" width="32" height="14" rx="2" fill="#f6e6cb" />
      <rect x="38" y="48" width="7" height="10" rx="1.5" fill="#a8763f" />
      <rect x="51" y="48" width="7" height="10" rx="1.5" fill="#a8763f" />
      <path d="M22 45 Q48 30 74 45 Q48 37 22 45 Z" fill="#e64a3a" />
      <path d="M20 45 Q48 33 76 45" stroke="#a02a22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="45" r="2.2" fill="#f5c830" />
      <circle cx="76" cy="45" r="2.2" fill="#f5c830" />
      {/* 三层 */}
      <rect x="38" y="30" width="20" height="10" rx="2" fill="#f6e6cb" />
      <path d="M32 31 Q48 20 64 31 Q48 25 32 31 Z" fill="#e64a3a" />
      <path d="M30 31 Q48 23 66 31" stroke="#a02a22" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* 宝顶 */}
      <rect x="46" y="18" width="4" height="8" rx="1.5" fill="#e0b040" />
      <circle cx="48" cy="16" r="3.4" fill="#f5c830" />
      <circle cx="48" cy="16" r="1.4" fill="#fff6cc" />
      {/* 灯笼 */}
      <ellipse cx="16" cy="68" rx="3.4" ry="4.2" fill="#e64a3a" />
      <line x1="16" y1="63" x2="16" y2="60" stroke="#a8763f" strokeWidth="1.4" />
      <ellipse cx="80" cy="68" rx="3.4" ry="4.2" fill="#e64a3a" />
      <line x1="80" y1="63" x2="80" y2="60" stroke="#a8763f" strokeWidth="1.4" />
      {/* 云 */}
      <ellipse cx="16" cy="30" rx="10" ry="4" fill="white" opacity="0.55" />
      <ellipse cx="80" cy="24" rx="9" ry="3.5" fill="white" opacity="0.45" />
    </svg>
  )
}

/** 🇮🇳 印度 · 泰姬陵 */
export function LandmarkIndia({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={36} />
      <rect x="10" y="90" width="76" height="8" rx="3" fill="#d9c8a4" />
      <rect x="14" y="86" width="68" height="5" rx="2.5" fill="#eddfbe" />
      {/* 主殿基座 */}
      <rect x="24" y="62" width="48" height="24" rx="3" fill="#faf3e4" />
      <rect x="24" y="78" width="48" height="8" rx="3" fill="#ece0c8" />
      {/* 大拱门 */}
      <path d="M40 86 L40 70 Q48 60 56 70 L56 86 Z" fill="#8d6a4a" opacity="0.85" />
      <path d="M42 86 L42 71 Q48 63 54 71 L54 86 Z" fill="#5c4028" opacity="0.6" />
      {/* 侧拱窗 */}
      <path d="M28 86 L28 74 Q32 69 36 74 L36 86 Z" fill="#b99a72" opacity="0.8" />
      <path d="M60 86 L60 74 Q64 69 68 74 L68 86 Z" fill="#b99a72" opacity="0.8" />
      {/* 洋葱穹顶 */}
      <path d="M48 24 Q68 34 60 54 Q54 64 48 64 Q42 64 36 54 Q28 34 48 24 Z" fill="#fdf8ee" />
      <path d="M48 24 Q60 32 58 48 Q54 58 48 60 Q42 58 38 48 Q36 32 48 24 Z" fill="#fffdf7" />
      <ellipse cx="42" cy="44" rx="5" ry="10" fill="white" opacity="0.5" />
      {/* 顶部小穹 + 尖顶 */}
      <path d="M48 12 Q54 17 51 24 Q49 27 48 27 Q47 27 45 24 Q42 17 48 12 Z" fill="#fdf8ee" />
      <rect x="47" y="6" width="2" height="7" rx="1" fill="#e8c877" />
      <circle cx="48" cy="5" r="2.4" fill="#f5c830" />
      {/* 四座尖塔 */}
      {[16, 80].map((x, i) => (
        <g key={i}>
          <rect x={x - 4} y="46" width="8" height="44" rx="2" fill="#f6efdd" />
          <rect x={x - 6} y="68" width="12" height="4" rx="2" fill="#e6dbc2" />
          <rect x={x - 6} y="56" width="12" height="4" rx="2" fill="#e6dbc2" />
          <ellipse cx={x} cy="46" rx="6" ry="7" fill="#fbf5e8" />
          <path d={`M${x} 34 Q${x + 5} 39 ${x + 3} 46 Q${x} 49 ${x - 3} 46 Q${x - 5} 39 ${x} 34 Z`} fill="#fdf8ee" />
          <circle cx={x} cy="33" r="2" fill="#f5c830" />
        </g>
      ))}
      {/* 水池倒影 */}
      <rect x="12" y="96" width="72" height="3" rx="1.5" fill="#7ec8e0" opacity="0.55" />
      <rect x="26" y="100" width="44" height="2" rx="1" fill="#7ec8e0" opacity="0.35" />
    </svg>
  )
}

/** 🇱🇰 斯里兰卡 · 佛塔与椰林 */
export function LandmarkSriLanka({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={30} />
      {/* 阶梯基座 */}
      <rect x="18" y="86" width="60" height="8" rx="3" fill="#c9a978" />
      <rect x="22" y="80" width="52" height="7" rx="3" fill="#dcbe8c" />
      <rect x="27" y="74" width="42" height="7" rx="3" fill="#ecd3a4" />
      {/* 塔身 */}
      <path d="M34 74 L34 48 Q48 40 62 48 L62 74 Z" fill="#f4e4c2" />
      <path d="M34 74 L34 48 Q41 44 48 44 L48 74 Z" fill="#fbf0d8" />
      <rect x="42" y="60" width="12" height="14" rx="2" fill="#b98f58" opacity="0.75" />
      {/* 覆钵 */}
      <path d="M30 48 Q48 26 66 48 Z" fill="#f7e8cc" />
      <ellipse cx="48" cy="46" rx="18" ry="6" fill="#e9d3ae" />
      {/* 相轮塔尖 */}
      <rect x="45" y="20" width="6" height="14" rx="2" fill="#e3b566" />
      <ellipse cx="48" cy="26" rx="8" ry="2.4" fill="#f0c878" />
      <ellipse cx="48" cy="32" rx="10" ry="2.6" fill="#f0c878" />
      <ellipse cx="48" cy="38" rx="11" ry="2.8" fill="#f0c878" />
      <circle cx="48" cy="18" r="3" fill="#f5c830" />
      <circle cx="48" cy="18" r="1.2" fill="#fff8d8" />
      {/* 椰树 */}
      {[
        { x: 10, h: 30 }, { x: 88, h: 34 },
      ].map((t, i) => (
        <g key={i}>
          <path d={`M${t.x} 88 Q${t.x - 3} ${88 - t.h * 0.6} ${t.x + 1} ${88 - t.h}`} stroke="#96603a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d={`M${t.x + 1} ${88 - t.h} Q${t.x - 12} ${82 - t.h} ${t.x - 14} ${88 - t.h}`} fill="#3f9d52" />
          <path d={`M${t.x + 1} ${88 - t.h} Q${t.x + 14} ${80 - t.h} ${t.x + 17} ${88 - t.h}`} fill="#4bb462" />
          <path d={`M${t.x + 1} ${88 - t.h} Q${t.x - 4} ${70 - t.h} ${t.x + 2} ${66 - t.h}`} fill="#57c46e" />
          <path d={`M${t.x + 1} ${88 - t.h} Q${t.x + 10} ${74 - t.h} ${t.x + 8} ${68 - t.h}`} fill="#3f9d52" />
          <circle cx={t.x + 1} cy={88 - t.h + 1} r="2.6" fill="#c08a50" />
        </g>
      ))}
      {/* 海面 */}
      <path d="M0 96 Q24 92 48 96 Q72 100 96 96 L96 104 L0 104 Z" fill="#5fc0e0" opacity="0.5" />
    </svg>
  )
}

/** 🇸🇦 阿拉伯 · 清真寺 + 沙金色大穹顶 + 大新月（区别于印度纯白圆顶） */
export function LandmarkArabia({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={36} />
      {/* 沙地 */}
      <rect x="6" y="90" width="84" height="8" rx="4" fill="#e6cd96" />
      {/* 主体 */}
      <rect x="20" y="58" width="56" height="32" rx="3" fill="#fbf3e2" />
      <rect x="20" y="58" width="56" height="6" rx="3" fill="#ece0c6" />
      {/* 拱门 */}
      <path d="M42 90 L42 72 Q48 64 54 72 L54 90 Z" fill="#8d6a4a" opacity="0.85" />
      <path d="M28 90 L28 78 Q31 74 34 78 L34 90 Z" fill="#b99a72" opacity="0.75" />
      <path d="M62 90 L62 78 Q65 74 68 78 L68 90 Z" fill="#b99a72" opacity="0.75" />
      {/* 大穹顶（沙金色，区别于印度纯白） */}
      <path d="M48 22 Q72 34 66 58 L30 58 Q24 34 48 22 Z" fill="#c98c45" />
      <path d="M48 22 Q64 32 62 52 L48 55 Z" fill="#e0a560" opacity="0.85" />
      <path d="M36 48 Q40 36 48 30" stroke="#fff5cc" strokeWidth="3.5" strokeLinecap="round" opacity="0.4" fill="none" />
      {/* 穹顶底金边 + 几何纹带 */}
      <rect x="30" y="57" width="36" height="3" fill="#7a5a2a" />
      <rect x="30" y="60" width="36" height="1.4" fill="#7a5a2a" opacity="0.55" />
      {/* 大新月（伊斯兰标志） */}
      <circle cx="48" cy="13" r="7.5" fill="#fff5cc" />
      <circle cx="51.5" cy="11" r="5.5" fill="#c98c45" />
      {/* 顶金光柱 */}
      <rect x="47" y="2" width="2" height="6" rx="1" fill="#e3b566" />
      <circle cx="48" cy="2" r="1.8" fill="#f5c830" />
      {/* 双宣礼塔（沙白塔身 + 金色塔尖） */}
      {[12, 84].map((x, i) => (
        <g key={i}>
          <rect x={x - 5} y="38" width="10" height="52" rx="2" fill="#f8efdb" />
          <rect x={x - 7} y="72" width="14" height="4" rx="2" fill="#e8dbc0" />
          <rect x={x - 7} y="58" width="14" height="4" rx="2" fill="#e8dbc0" />
          <rect x={x - 7} y="44" width="14" height="4" rx="2" fill="#e8dbc0" />
          {/* 塔顶小金顶（区别于印度纯白塔尖） */}
          <path d={`M${x} 30 Q${x + 7} 34 ${x + 5} 40 L${x - 5} 40 Q${x - 7} 34 ${x} 30 Z`} fill="#c98c45" />
          <path d={`M${x} 22 Q${x + 5} 26 ${x + 4} 31 L${x - 4} 31 Q${x - 5} 26 ${x} 22 Z`} fill="#e0a560" />
          {/* 塔尖新月 */}
          <rect x={x - 1} y="14" width="2" height="8" rx="1" fill="#e3b566" />
          <circle cx={x} cy="14" r="3" fill="#fff5cc" />
          <circle cx={x + 1.2} cy="13" r="2.2" fill="#c98c45" />
        </g>
      ))}
    </svg>
  )
}

/** 🇿🇦 南非 · 桌山与好望角灯塔 */
export function LandmarkAfrica({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={36} />
      {/* 天空暖阳 */}
      <circle cx="78" cy="20" r="9" fill="#f5c830" opacity="0.9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <line
          key={i}
          x1={78 + Math.cos((a * Math.PI) / 180) * 11}
          y1={20 + Math.sin((a * Math.PI) / 180) * 11}
          x2={78 + Math.cos((a * Math.PI) / 180) * 15}
          y2={20 + Math.sin((a * Math.PI) / 180) * 15}
          stroke="#f5c830" strokeWidth="2" strokeLinecap="round"
        />
      ))}
      {/* 桌山（平顶山） */}
      <path d="M4 92 L10 46 L34 44 L38 92 Z" fill="#8aa06a" />
      <path d="M10 46 L34 44 L36 60 L12 62 Z" fill="#9bb077" />
      <path d="M10 46 L34 44 L34 48 L10 50 Z" fill="#b8c894" />
      <path d="M38 92 L42 58 L60 56 L64 92 Z" fill="#7d9560" />
      <path d="M42 58 L60 56 L61 66 L43 68 Z" fill="#8ea66c" />
      {/* 海 */}
      <path d="M0 92 Q24 88 48 92 Q72 96 96 92 L96 104 L0 104 Z" fill="#5fc0e0" />
      <path d="M0 96 Q24 93 48 96 Q72 99 96 96 L96 104 L0 104 Z" fill="#48b0d4" />
      {/* 灯塔（好望角） */}
      <rect x="66" y="52" width="14" height="40" rx="2" fill="#f6efe0" />
      <rect x="66" y="62" width="14" height="7" fill="#d64b3c" />
      <rect x="66" y="76" width="14" height="7" fill="#d64b3c" />
      <rect x="64" y="46" width="18" height="7" rx="2" fill="#c9d4dd" />
      <rect x="68" y="40" width="10" height="7" rx="1.5" fill="#ffe9a8" />
      <rect x="68" y="40" width="10" height="7" rx="1.5" fill="none" stroke="#c9a24a" strokeWidth="1" />
      <path d="M62 42 L64 44 M84 42 L82 44" stroke="#ffe9a8" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66 34 L87 34 Q83 30 76 30 L66 32 Z" fill="#e64a3a" />
      <line x1="66" y1="34" x2="66" y2="40" stroke="#a02a22" strokeWidth="1.5" />
      {/* 岸边灌木 */}
      <ellipse cx="14" cy="92" rx="12" ry="4" fill="#5d8447" />
      <ellipse cx="82" cy="93" rx="9" ry="3" fill="#5d8447" />
      {/* 小船 */}
      <path d="M40 97 L52 97 L50 101 L42 101 Z" fill="#f4f0e4" />
    </svg>
  )
}

/** 🇳🇴 挪威 · 峡湾雪山与维京长屋 */
export function LandmarkNorway({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={34} />
      {/* 极光 */}
      <path d="M0 12 Q16 4 26 14 Q34 4 48 10 Q58 3 72 11 Q84 5 96 10" stroke="#8fe0b4" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M0 22 Q14 15 26 24 Q38 15 52 21 Q64 15 78 22" stroke="#7fc8f0" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* 雪山 */}
      <path d="M0 74 L18 34 L30 56 L42 24 L56 52 L68 36 L96 74 Z" fill="#7c9ab4" />
      <path d="M0 74 L18 34 L24 47 L12 60 Z" fill="#8aa8c0" />
      <path d="M42 24 L50 40 L34 42 Z" fill="#8aa8c0" />
      <path d="M14 40 L18 34 L23 42 Z" fill="white" />
      <path d="M39 31 L42 24 L46 33 Z" fill="white" />
      <path d="M64 42 L68 36 L73 45 Z" fill="white" />
      {/* 峡湾水面 */}
      <path d="M0 74 Q24 70 48 74 Q72 78 96 74 L96 104 L0 104 Z" fill="#4fb4d8" />
      <path d="M0 82 Q24 79 48 82 Q72 85 96 82 L96 104 L0 104 Z" fill="#3fa2c6" opacity="0.8" />
      {/* 维京长屋 */}
      <rect x="26" y="74" width="44" height="16" rx="2" fill="#95602f" />
      <path d="M20 74 L48 52 L76 74 Z" fill="#6d4120" />
      <path d="M20 74 L48 55 L76 74 Z" fill="#83502a" />
      <path d="M20 74 L48 52 L76 74" stroke="#5a3418" strokeWidth="2.5" fill="none" />
      {/* 龙头装饰 */}
      <path d="M20 74 Q12 70 14 62 Q17 68 20 66" fill="#5a3418" />
      <circle cx="13" cy="61" r="2" fill="#e87030" />
      <path d="M76 74 Q84 70 82 62 Q79 68 76 66" fill="#5a3418" />
      <circle cx="83" cy="61" r="2" fill="#e87030" />
      {/* 窗 */}
      <rect x="33" y="80" width="8" height="8" rx="1.5" fill="#f7cf7a" />
      <rect x="46" y="78" width="8" height="10" rx="1.5" fill="#8fd0e8" />
      <rect x="58" y="80" width="8" height="8" rx="1.5" fill="#f7cf7a" />
      {/* 松树 */}
      <path d="M8 88 L12 74 L16 88 Z" fill="#2f7c42" />
      <path d="M7 82 L12 70 L17 82 Z" fill="#37904e" />
      <rect x="11" y="88" width="2" height="5" fill="#6d4120" />
      <path d="M84 90 L88 76 L92 90 Z" fill="#2f7c42" />
      <path d="M83 84 L88 72 L93 84 Z" fill="#37904e" />
    </svg>
  )
}

/** 🇲🇾 马六甲 · 海港要塞与商船 */
export function LandmarkMalacca({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={32} />
      {/* 城墙 */}
      <rect x="16" y="70" width="64" height="20" rx="2" fill="#e3d5ae" />
      <rect x="16" y="64" width="64" height="7" rx="3" fill="#d2c299" />
      {/* 雉堞 */}
      {[18, 30, 42, 54, 66].map((x, i) => (
        <rect key={i} x={x} y="59" width="9" height="7" rx="1.5" fill="#c8b78d" />
      ))}
      {/* 城门 */}
      <path d="M42 90 L42 74 Q48 68 54 74 L54 90 Z" fill="#6d4a26" opacity="0.85" />
      <path d="M44 90 L44 76 Q48 71 52 76 L52 90 Z" fill="#3a2412" opacity="0.7" />
      {/* 主塔 */}
      <rect x="38" y="34" width="20" height="30" rx="2" fill="#efe3c4" />
      <rect x="36" y="54" width="24" height="5" rx="2" fill="#dccdA4" />
      <rect x="44" y="40" width="8" height="10" rx="3" fill="#7faecc" opacity="0.8" />
      <path d="M34 34 L48 18 L62 34 Z" fill="#c8552a" />
      <path d="M34 34 L48 20 L62 34 Z" fill="#e06a34" />
      <circle cx="48" cy="17" r="3" fill="#f5c830" />
      <line x1="48" y1="14" x2="48" y2="6" stroke="#8d6a4a" strokeWidth="2" />
      <path d="M48 6 L60 10 L48 14 Z" fill="#e03a30" />
      {/* 侧塔 */}
      {[14, 82].map((x, i) => (
        <g key={i}>
          <rect x={x - 8} y="48" width="16" height="32" rx="2" fill="#e9dcbc" />
          <rect x={x - 10} y="44" width="20" height="6" rx="2" fill="#d6c79f" />
          <path d={`M${x - 10} 44 L${x} 32 L${x + 10} 44 Z`} fill="#c8552a" />
          <circle cx={x} cy="31" r="2.4" fill="#f5c830" />
          <rect x={x - 3} y="58" width="6" height="9" rx="1.5" fill="#7faecc" opacity="0.75" />
        </g>
      ))}
      {/* 炮台 */}
      <ellipse cx="30" cy="60" rx="5" ry="3.4" fill="#7a7a7a" />
      <rect x="24" y="58" width="9" height="4" rx="2" fill="#949494" />
      <ellipse cx="66" cy="60" rx="5" ry="3.4" fill="#7a7a7a" />
      <rect x="60" y="58" width="9" height="4" rx="2" fill="#949494" />
      {/* 海与帆船 */}
      <path d="M0 92 Q24 88 48 92 Q72 96 96 92 L96 104 L0 104 Z" fill="#5fc0e0" />
      <path d="M0 97 Q24 94 48 97 Q72 100 96 97 L96 104 L0 104 Z" fill="#4aaac8" opacity="0.8" />
      <path d="M6 94 L18 94 L16 99 L8 99 Z" fill="#f4f0e4" />
      <path d="M12 94 L12 84 L18 90 Z" fill="#fdf8ee" />
      <path d="M78 95 L90 95 L88 100 L80 100 Z" fill="#f6e2c0" />
      <path d="M84 95 L84 86 L90 92 Z" fill="#fdf8ee" />
    </svg>
  )
}

/** 🇬🇧 英国 · 大本钟与议会大厦 */
export function LandmarkEngland({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={36} />
      {/* 泰晤士河 */}
      <path d="M0 92 Q24 88 48 92 Q72 96 96 92 L96 104 L0 104 Z" fill="#5fc0e0" opacity="0.6" />
      {/* 议会大厦 */}
      <rect x="4" y="64" width="52" height="26" rx="2" fill="#d8c8a8" />
      <rect x="2" y="60" width="56" height="6" rx="2" fill="#c4b090" />
      {[8, 18, 28, 38].map((x, i) => (
        <g key={i}>
          <rect x={x} y="66" width="7" height="9" rx="1.5" fill="#7faecc" opacity="0.8" />
          <path d={`M${x + 3.5} 60 L${x + 3.5} 56`} stroke="#b09a70" strokeWidth="2" />
          <path d={`M${x + 3.5} 56 L${x + 8} 57.5 L${x + 3.5} 59 Z`} fill="#4a7a5a" />
        </g>
      ))}
      {/* 大本钟塔 */}
      <rect x="58" y="32" width="22" height="58" rx="2" fill="#e8d8b8" />
      <rect x="56" y="28" width="26" height="6" rx="2" fill="#cdb890" />
      <rect x="60" y="38" width="18" height="16" rx="2" fill="#f4ecd8" stroke="#c9a24a" strokeWidth="1.5" />
      {/* 钟面 */}
      <circle cx="69" cy="46" r="7.5" fill="#fdf6e4" stroke="#c9a24a" strokeWidth="1.5" />
      <path d="M69 46 L69 41 M69 46 L73 48" stroke="#5c4028" strokeWidth="1.6" strokeLinecap="round" />
      {/* 塔身窗 */}
      <rect x="63" y="58" width="5" height="9" rx="1.5" fill="#7faecc" opacity="0.8" />
      <rect x="71" y="58" width="5" height="9" rx="1.5" fill="#7faecc" opacity="0.8" />
      <rect x="63" y="72" width="5" height="9" rx="1.5" fill="#7faecc" opacity="0.8" />
      <rect x="71" y="72" width="5" height="9" rx="1.5" fill="#7faecc" opacity="0.8" />
      {/* 塔尖 */}
      <path d="M58 28 L69 10 L80 28 Z" fill="#4a7a5a" />
      <path d="M58 28 L69 12 L80 28 Z" fill="#5d9070" />
      <rect x="68" y="4" width="2" height="8" rx="1" fill="#e3b566" />
      <circle cx="69" cy="3" r="2.2" fill="#f5c830" />
      {/* 雾与鸥 */}
      <ellipse cx="18" cy="34" rx="13" ry="4" fill="white" opacity="0.5" />
      <ellipse cx="34" cy="26" rx="10" ry="3.2" fill="white" opacity="0.4" />
      <path d="M40 44 Q43 41 46 44 Q49 41 52 44" stroke="#8fa8b8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** 🇫🇷 法国 · 埃菲尔铁塔 */
export function LandmarkFrance({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={26} />
      {/* 太阳 */}
      <circle cx="78" cy="20" r="8" fill="#f5c830" opacity="0.9" />
      {/* 塔双腿 */}
      <path d="M22 92 C28 72 38 56 44 40 L48 10 L48 92 Z" fill="#d4aa58" />
      <path d="M74 92 C68 72 58 56 52 40 L48 10 L48 92 Z" fill="#c89848" />
      {/* 平台 */}
      <rect x="30" y="62" width="36" height="6" rx="2" fill="#a87f42" />
      <rect x="37" y="40" width="22" height="5" rx="2" fill="#a87f42" />
      <rect x="43" y="24" width="10" height="4" rx="2" fill="#a87f42" />
      <rect x="46.6" y="8" width="2.8" height="12" rx="1.4" fill="#a87f42" />
      <circle cx="48" cy="7" r="2.4" fill="#f5c830" />
      {/* 底拱 */}
      <path d="M34 92 Q48 74 62 92" stroke="#a87f42" strokeWidth="3.5" fill="none" />
      {/* 灯与草坡 */}
      <ellipse cx="48" cy="94" rx="32" ry="4" fill="#5d8447" opacity="0.6" />
      <path d="M0 92 Q24 89 48 92 Q72 95 96 92 L96 104 L0 104 Z" fill="#7cc48e" opacity="0.5" />
      <path d="M6 95 L16 95 L14 100 L8 100 Z" fill="#f4f0e4" />
      <path d="M80 95 L90 95 L88 100 L82 100 Z" fill="#f4f0e4" />
    </svg>
  )
}

/** 🇪🇬 埃及 · 金字塔与棕榈 */
export function LandmarkEgypt({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={36} />
      {/* 沙漠落日 */}
      <circle cx="80" cy="24" r="9" fill="#f5a530" opacity="0.9" />
      <ellipse cx="80" cy="24" rx="16" ry="6" fill="#f5c830" opacity="0.3" />
      {/* 大金字塔 */}
      <path d="M10 90 L36 32 L62 90 Z" fill="#e0c070" />
      <path d="M36 32 L50 90 L36 90 Z" fill="#c8a558" />
      <path d="M30 74 L42 74 L41 78 L31 78 Z" fill="#b89450" opacity="0.6" />
      {/* 小金字塔 */}
      <path d="M52 90 L68 52 L84 90 Z" fill="#d4b468" />
      <path d="M68 52 L78 90 L68 90 Z" fill="#bd9a50" />
      {/* 棕榈树 */}
      <path d="M14 90 Q11 76 15 66" stroke="#96603a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M15 66 Q3 58 2 66" fill="#3f9d52" />
      <path d="M15 66 Q27 58 28 66" fill="#4bb462" />
      <path d="M15 66 Q10 54 16 50" fill="#57c46e" />
      <path d="M15 66 Q22 56 20 51" fill="#3f9d52" />
      <circle cx="15" cy="67" r="2.4" fill="#c08a50" />
      {/* 沙丘与河 */}
      <path d="M0 90 Q24 86 48 90 Q72 94 96 90 L96 104 L0 104 Z" fill="#e6cd96" />
      <path d="M0 96 Q24 93 48 96 Q72 99 96 96 L96 104 L0 104 Z" fill="#5fc0e0" opacity="0.55" />
    </svg>
  )
}

/** 🇮🇷 波斯 · 青绿穹顶清真寺 */
export function LandmarkPersia({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={36} />
      {/* 地台 */}
      <rect x="8" y="88" width="80" height="8" rx="3" fill="#d9c8a4" />
      {/* 主体 */}
      <rect x="22" y="56" width="52" height="32" rx="3" fill="#f6ecd4" />
      {/* 伊万拱门 */}
      <path d="M40 88 L40 68 Q48 58 56 68 L56 88 Z" fill="#3f8a80" />
      <path d="M42 88 L42 69 Q48 61 54 69 L54 88 Z" fill="#2f7068" />
      {/* 拱门金边 */}
      <path d="M40 88 L40 68 Q48 58 56 68 L56 88" stroke="#e3b566" strokeWidth="1.6" fill="none" />
      {/* 青绿大穹顶 */}
      <path d="M48 20 Q70 30 64 56 L32 56 Q26 30 48 20 Z" fill="#3fa8a0" />
      <path d="M48 20 Q62 28 60 48 L48 52 Z" fill="#57c4ba" opacity="0.85" />
      {/* 穹顶花纹带 */}
      <ellipse cx="48" cy="46" rx="17" ry="5" fill="#2f8880" />
      <ellipse cx="48" cy="46" rx="17" ry="5" fill="none" stroke="#e3b566" strokeWidth="1" />
      {/* 尖顶 */}
      <rect x="47" y="8" width="2" height="12" rx="1" fill="#e3b566" />
      <circle cx="48" cy="7" r="2.4" fill="#f5c830" />
      {/* 双宣礼塔（青绿塔顶） */}
      {[12, 84].map((x, i) => (
        <g key={i}>
          <rect x={x - 4} y="42" width="8" height="46" rx="2" fill="#f6ecd4" />
          <rect x={x - 6} y="66" width="12" height="4" rx="2" fill="#e8dcc0" />
          <rect x={x - 6} y="54" width="12" height="4" rx="2" fill="#e8dcc0" />
          <path d={`M${x} 34 Q${x + 7} 38 ${x + 5} 44 L${x - 5} 44 Q${x - 7} 38 ${x} 34 Z`} fill="#3fa8a0" />
          <rect x={x - 1} y="26" width="2" height="9" rx="1" fill="#e3b566" />
          <circle cx={x} cy="25" r="2.2" fill="#f5c830" />
        </g>
      ))}
      {/* 鸽子 */}
      <path d="M24 42 Q27 39 30 42 Q33 39 36 42" stroke="#8fa8b8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** 🇯🇵 日本 · 富士山与鸟居 */
export function LandmarkJapan({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={34} />
      {/* 富士山 */}
      <path d="M4 90 C22 62 34 44 48 34 C62 44 74 62 92 90 Z" fill="#7c9ab4" />
      <path d="M48 34 C58 42 68 56 80 74 L70 74 L64 66 L58 74 L48 62 L40 74 L32 66 L24 74 C32 56 40 42 48 34 Z" fill="#8aa8c0" opacity="0.6" />
      {/* 雪冠 */}
      <path d="M36 56 C40 44 44 38 48 36 C52 38 56 44 60 56 L54 54 L50 49 L46 55 Z" fill="white" />
      {/* 樱花 */}
      <circle cx="14" cy="40" r="2.6" fill="#f4a0b8" />
      <circle cx="19" cy="46" r="2" fill="#f7b8c8" />
      <circle cx="11" cy="47" r="2" fill="#f4a0b8" />
      <circle cx="84" cy="36" r="2.6" fill="#f4a0b8" />
      <circle cx="89" cy="43" r="2" fill="#f7b8c8" />
      {/* 鸟居 */}
      <rect x="30" y="56" width="8" height="34" rx="2" fill="#d64b3c" />
      <rect x="58" y="56" width="8" height="34" rx="2" fill="#d64b3c" />
      <path d="M24 54 Q48 46 72 54 L72 58 Q48 51 24 58 Z" fill="#c04030" />
      <path d="M22 52 Q48 44 74 52" stroke="#c04030" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <rect x="27" y="62" width="42" height="5" rx="2" fill="#d64b3c" />
      <circle cx="48" cy="58" r="3" fill="#f5c830" />
      {/* 地面 */}
      <path d="M0 90 Q24 86 48 90 Q72 94 96 90 L96 104 L0 104 Z" fill="#5fc0e0" opacity="0.55" />
      <path d="M8 96 L20 96 L18 101 L10 101 Z" fill="#f4f0e4" />
    </svg>
  )
}

/** 🇮🇩 爪哇 · 火山与婆罗浮屠 */
export function LandmarkJava({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={36} />
      {/* 火山 */}
      <path d="M6 90 L34 32 L62 90 Z" fill="#7a8a6a" />
      <path d="M34 32 L48 90 L34 90 Z" fill="#6a7a5c" />
      <path d="M28 44 L34 32 L40 44 L37 47 L33 44 Z" fill="#8a9a7a" />
      {/* 喷汽 */}
      <ellipse cx="34" cy="24" rx="7" ry="4" fill="white" opacity="0.7" />
      <ellipse cx="40" cy="16" rx="6" ry="3.5" fill="white" opacity="0.55" />
      <ellipse cx="30" cy="10" rx="4.5" ry="3" fill="white" opacity="0.4" />
      {/* 婆罗浮屠（阶梯佛塔） */}
      <rect x="50" y="74" width="42" height="14" rx="2" fill="#e8d8b0" />
      <rect x="54" y="64" width="34" height="10" rx="2" fill="#f0e2be" />
      <rect x="59" y="55" width="24" height="9" rx="2" fill="#f6ecc8" />
      {/* 钟形小塔 */}
      <path d="M71 42 Q78 48 75 55 L67 55 Q64 48 71 42 Z" fill="#f2e4c0" />
      <rect x="70" y="55" width="2" height="4" fill="#c9a978" />
      <circle cx="71" cy="41" r="2" fill="#f5c830" />
      {/* 塔龛 */}
      <rect x="56" y="67" width="6" height="6" rx="1" fill="#c9a978" opacity="0.7" />
      <rect x="80" y="67" width="6" height="6" rx="1" fill="#c9a978" opacity="0.7" />
      <rect x="62" y="77" width="6" height="7" rx="1" fill="#c9a978" opacity="0.7" />
      <rect x="76" y="77" width="6" height="7" rx="1" fill="#c9a978" opacity="0.7" />
      {/* 稻田水面 */}
      <path d="M0 90 Q24 87 48 90 Q72 93 96 90 L96 104 L0 104 Z" fill="#5fc0e0" opacity="0.55" />
      <path d="M8 95 L20 95 L18 100 L10 100 Z" fill="#f4f0e4" />
    </svg>
  )
}

/** 🇲🇽 阿兹特克 · 阶梯神庙 */
export function LandmarkAztec({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={36} />
      {/* 太阳 */}
      <circle cx="14" cy="20" r="8" fill="#f5c830" opacity="0.9" />
      {[20, 65, 110, 155, 200, 245, 290, 335].map((a, i) => (
        <line
          key={i}
          x1={14 + Math.cos((a * Math.PI) / 180) * 10}
          y1={20 + Math.sin((a * Math.PI) / 180) * 10}
          x2={14 + Math.cos((a * Math.PI) / 180) * 14}
          y2={20 + Math.sin((a * Math.PI) / 180) * 14}
          stroke="#f5c830" strokeWidth="2" strokeLinecap="round"
        />
      ))}
      {/* 阶梯金字塔 */}
      <rect x="12" y="80" width="72" height="10" rx="2" fill="#c9a978" />
      <rect x="20" y="70" width="56" height="10" rx="2" fill="#d6b384" />
      <rect x="28" y="60" width="40" height="10" rx="2" fill="#e0c094" />
      <rect x="36" y="50" width="24" height="10" rx="2" fill="#eacaa0" />
      {/* 顶殿 */}
      <rect x="38" y="40" width="20" height="10" rx="2" fill="#d64b3c" />
      <rect x="43" y="43" width="10" height="7" rx="1" fill="#3a2412" opacity="0.75" />
      {/* 中央阶梯 */}
      <path d="M46 90 L46 50" stroke="#a8875a" strokeWidth="8" />
      <path d="M46 90 L46 50" stroke="#e0c094" strokeWidth="3" strokeDasharray="3,3" />
      {/* 旗帜 */}
      <line x1="48" y1="40" x2="48" y2="28" stroke="#8d6a4a" strokeWidth="2" />
      <path d="M48 28 L62 32 L48 36 Z" fill="#e03a30" />
      {/* 丛林 */}
      <ellipse cx="8" cy="88" rx="10" ry="5" fill="#4a7a3a" />
      <ellipse cx="88" cy="89" rx="9" ry="4.5" fill="#4a7a3a" />
      <path d="M0 90 Q24 87 48 90 Q72 93 96 90 L96 104 L0 104 Z" fill="#6a9a4a" opacity="0.45" />
    </svg>
  )
}

/** 🇵🇪 印加 · 马丘比丘梯田与羊驼 */
export function LandmarkInca({ size = 96 }: Props) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 96 104" fill="none">
      <Shadow rx={38} />
      {/* 远山 */}
      <path d="M2 92 L22 38 L44 92 Z" fill="#7d9560" />
      <path d="M22 38 L33 62 L12 62 Z" fill="#8ea66c" />
      <path d="M18 50 L22 38 L28 50 L24 47 Z" fill="white" opacity="0.8" />
      {/* 主山与梯田 */}
      <path d="M46 92 L60 54 L94 92 Z" fill="#8a9a6a" />
      <path d="M56 80 L80 80 L83 86 L54 86 Z" fill="#b8c894" />
      <path d="M59 70 L78 70 L81 76 L56 76 Z" fill="#c8d4a4" />
      <path d="M62 60 L75 60 L77 66 L60 66 Z" fill="#d4deac" />
      {/* 石屋 */}
      <rect x="62" y="50" width="11" height="9" rx="1" fill="#e8dcc0" />
      <path d="M60 50 L67.5 44 L75 50 Z" fill="#c9b48c" />
      <rect x="75" y="52" width="10" height="8" rx="1" fill="#e8dcc0" />
      <path d="M73 52 L80 46.5 L87 52 Z" fill="#c9b48c" />
      {/* 羊驼 */}
      <ellipse cx="26" cy="82" rx="7" ry="4.5" fill="#f2ead8" />
      <rect x="21" y="76" width="4" height="8" rx="2" fill="#f2ead8" />
      <circle cx="21" cy="74" r="2.8" fill="#f2ead8" />
      <circle cx="20" cy="73.5" r="0.8" fill="#5c4028" />
      <rect x="21.5" y="84" width="2" height="6" rx="1" fill="#e0d4bc" />
      <rect x="25" y="84" width="2" height="6" rx="1" fill="#e0d4bc" />
      <rect x="29" y="84" width="2" height="6" rx="1" fill="#e0d4bc" />
      <rect x="32" y="84" width="2" height="6" rx="1" fill="#e0d4bc" />
      {/* 云雾 */}
      <ellipse cx="70" cy="30" rx="13" ry="4" fill="white" opacity="0.6" />
      <ellipse cx="46" cy="24" rx="9" ry="3" fill="white" opacity="0.45" />
      <path d="M0 92 Q24 89 48 92 Q72 95 96 92 L96 104 L0 104 Z" fill="#6a9a4a" opacity="0.4" />
    </svg>
  )
}

export const LANDMARKS: Record<string, (p: Props) => ReactElement> = {
  china: LandmarkChina,
  india: LandmarkIndia,
  srilanka: LandmarkSriLanka,
  arabia: LandmarkArabia,
  africa: LandmarkAfrica,
  norway: LandmarkNorway,
  malacca: LandmarkMalacca,
  england: LandmarkEngland,
  france: LandmarkFrance,
  egypt: LandmarkEgypt,
  persia: LandmarkPersia,
  japan: LandmarkJapan,
  java: LandmarkJava,
  aztec: LandmarkAztec,
  inca: LandmarkInca,
}

/** 🪙→🔶 黄金货物图标：纯 SVG 金条（区别于 🪙 硬币） */
export function GoldBar({ size = 18 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ verticalAlign: '-3px' }}>
      {/* 高光面 */}
      <rect x="2" y="7" width="20" height="12" rx="2.5" fill="#f5c830" stroke="#a87520" strokeWidth="1.4" />
      <rect x="2" y="7" width="20" height="3.4" fill="#fff0b0" />
      <rect x="2" y="15.6" width="20" height="3.4" fill="#c98c45" />
      {/* 999 钢印 */}
      <text x="12" y="15.4" fontSize="6" fontWeight="900" textAnchor="middle" fill="#7a5a1a" fontFamily="Georgia, serif" letterSpacing="0.5">999</text>
      {/* 高光 */}
      <rect x="4" y="8.4" width="3" height="1.4" rx="0.7" fill="#fff8d8" opacity="0.85" />
    </svg>
  )
}

export function CityLandmark({ id, size = 96 }: { id: string; size?: number }) {
  const L = LANDMARKS[id]
  if (!L) return null
  return <L size={size} />
}
