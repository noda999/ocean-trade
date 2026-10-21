import { useEffect, useState, type CSSProperties } from 'react'
import { GOODS } from '../game/data'
import { Glyph } from './Glyph'

const STORAGE_KEY = 'ocean-trade-onboarding-done'

export type OnboardingStep =
  | 'welcome' | 'sail' | 'mapmode'
  | 'trade' | 'bank'
  | 'dock' | 'tavern' | 'hall' | 'navy'
  | 'quest' | 'codex' | 'finish'

interface Props {
  step?: OnboardingStep
  onDone?: () => void
  open?: boolean
  activeTab?: string
  setActiveTab?: (t: string) => void
}

const COPY: Record<OnboardingStep, { title: string; body: string; selector?: string | null; needTab?: string }> = {
  welcome: { title: '欢迎，船长', body: `地图上有 ${GOODS.length} 种货。便宜处买，贵处卖 —— 就这一条主线。跟我走一遍，很快。` },
  sail:    { title: '① 点港口出海', body: '点地图上亮起的港口就出发。到港后，右下角可以加速。', selector: '.city-hit', needTab: 'map' },
  mapmode: { title: '地图两种看法', body: '右上角切换平面 / 地球，随你习惯。', selector: '.map-mode-toggle', needTab: 'map' },
  trade:   { title: '② 低买高卖', body: '产地买特产，销地卖紧缺。看清价差，别把货舱塞满卖不掉。', selector: '.nav-btn:nth-of-type(2)', needTab: 'market' },
  bank:    { title: '缺钱找银行', body: '市场页可抵押资产借钱，随借随还；借太多会被清算。', selector: '.bank-bar', needTab: 'market' },
  dock:    { title: '③ 换条大船', body: '金币够了就换更大的船。舱位越多，一趟赚得越多。', selector: '.nav-btn:nth-of-type(4)', needTab: 'dock' },
  tavern:  { title: '④ 酒馆：招人 + 养成', body: '请船员永久加航速或利润。还能上课、送礼，好感高了会讲往事。', selector: '.tavern-toggle', needTab: 'dock' },
  hall:    { title: '⑤ 投资港口', body: '每港三个项目任选：进货更便宜、卖价更高，或躺着分红。投满关税全免。', selector: '.hall-toggle', needTab: 'dock' },
  navy:    { title: '⑥ 悬赏与藏宝', body: '派舰炮组打海盗拿赏金。集齐 4 张藏宝图，去挖沉船宝藏。', selector: '.navy-toggle', needTab: 'dock' },
  quest:   { title: '⑦ 领奖与图鉴', body: '功勋页领里程碑大奖；商品、城市、事件三本图鉴等你集齐。', selector: '.nav-btn:nth-of-type(5)', needTab: 'quest' },
  codex:   { title: '三本图鉴', body: '商品、城市、海上事件，没见过的先显示 ???。', selector: null, needTab: 'quest' },
  finish:  { title: '出发吧', body: '跑商攒钱，换船、投资、变强。货舱满了先卖货。风起了，船长！' },
}

const ORDER: OnboardingStep[] = ['welcome', 'sail', 'trade', 'dock', 'tavern', 'hall', 'navy', 'quest', 'finish']

function getRect(sel?: string | null): { top: number; left: number; width: number; height: number } | null {
  if (!sel) return null
  const el = document.querySelector(sel)
  if (!el) return null
  const r = (el as HTMLElement).getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

export default function OnboardingTour({ step, onDone, open = true, activeTab, setActiveTab }: Props) {
  const [internal, setInternal] = useState<OnboardingStep>(() => {
    if (step) return step
    try { return localStorage.getItem(STORAGE_KEY) ? 'finish' : 'welcome' }
    catch { return 'welcome' }
  })
  const [rect, setRect] = useState<ReturnType<typeof getRect>>(null)
  const cur = step ?? internal
  const idx = ORDER.indexOf(cur)
  const def = COPY[cur]
  const stepNo = idx + 1
  const totalSteps = ORDER.length - 1 // 不算 finish 页

  useEffect(() => {
    if (!open || cur === 'finish') return
    const update = () => setRect(getRect(def.selector))
    update()
    window.addEventListener('resize', update)
    const id = window.setTimeout(update, 400)
    return () => { window.removeEventListener('resize', update); window.clearTimeout(id) }
  }, [cur, def.selector, open])

  // 滚到 spotlight 元素
  useEffect(() => {
    if (!open || !def.selector) return
    const el = document.querySelector(def.selector)
    if (el && 'scrollIntoView' in el) {
      try { (el as HTMLElement).scrollIntoView({ block: 'center', behavior: 'smooth' }) } catch { /* ignore */ }
    }
  }, [cur, def.selector, open])

  // 切到该步骤需要的 tab（让 spotlight 真的渲染在 DOM 里）
  useEffect(() => {
    if (!open || !def.needTab || !setActiveTab) return
    if (activeTab !== def.needTab) setActiveTab(def.needTab)
  }, [cur, def.needTab, open, activeTab, setActiveTab])

  if (!open || cur === 'finish') return null

  const finish = () => {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
    if (!step) setInternal('finish')
    onDone?.()
  }

  const goNext = () => {
    const next = ORDER[idx + 1]
    // 走到结尾（finish 页不单独展示）：直接完成并写入「已看过」标记，避免下次再弹
    if (!next || next === 'finish') { finish(); return }
    if (!step) setInternal(next)
  }

  const pad = 12
  const sp = rect ? {
    x: rect.left - pad,
    y: rect.top - pad,
    w: rect.width + pad * 2,
    h: rect.height + pad * 2,
  } : null

  const w = typeof window !== 'undefined' ? window.innerWidth : 414
  const h = typeof window !== 'undefined' ? window.innerHeight : 896

  // 卡片位置：spotlight 在下半部 → 卡片放上；否则放下
  const cardTop = sp ? sp.y + sp.h / 2 < h * 0.5 : true
  const cardStyle: CSSProperties = cardTop
    ? { top: '60%', left: '50%', transform: 'translate(-50%, 0)' }
    : { top: '6%', left: '50%', transform: 'translate(-50%, 0)' }

  // 箭头位置：贴在 spotlight 一侧，指向中心
  const arrowStyle: CSSProperties | null = sp
    ? cardTop
      ? { left: sp.x + sp.w / 2 - 18, top: sp.y + sp.h + 8 }
      : { left: sp.x + sp.w / 2 - 18, top: sp.y - 56 }
    : null

  return (
    <div className="fixed inset-0" style={{ zIndex: 9998, pointerEvents: 'none' }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="ob-mask">
            <rect x="0" y="0" width={w} height={h} fill="white" />
            {sp && (
              <rect
                x={sp.x} y={sp.y} width={sp.w} height={sp.h}
                rx="14" fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width={w} height={h}
          fill="rgba(0,0,0,0.72)"
          mask="url(#ob-mask)"
        />
      </svg>

      {sp && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: sp.x - 4, top: sp.y - 4,
            width: sp.w + 8, height: sp.h + 8,
            border: '3px solid #f5913a',
            borderRadius: 16,
            boxShadow: '0 0 0 4px rgba(245,145,58,0.25), 0 0 32px rgba(245,145,58,0.55)',
            animation: 'ob-pulse 1.6s ease-in-out infinite',
          }}
        />
      )}

      {arrowStyle && (
        <div
          className="absolute"
          style={{
            ...arrowStyle,
            color: '#f5913a',
            pointerEvents: 'none',
          }}
        >
          <Glyph
            name="chevronDown"
            size={54}
            color="#f5913a"
            style={{ transform: cardTop ? 'rotate(180deg)' : 'none', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}
          />
        </div>
      )}

      <div
        className="absolute"
        style={{
          ...cardStyle,
          width: 'min(86vw, 340px)',
          background: '#fff8f0',
          borderRadius: 18,
          padding: '18px 18px 16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          border: '2px solid #f5913a',
          pointerEvents: 'auto',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Glyph name="compass" size={22} color="#d97320" />
          <span className="font-900 text-base" style={{ color: '#3d2b10' }}>
            {def.title}
          </span>
          <span
            className="ml-auto text-xs font-700"
            style={{ color: '#c0a070' }}
          >
            {stepNo}/{totalSteps}
          </span>
        </div>
        <div
          className="text-sm font-700"
          style={{ color: '#5a4525', lineHeight: 1.55, marginBottom: 14 }}
        >
          {def.body}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost-orange text-xs"
            style={{ borderRadius: 12, padding: '8px 14px' }}
            onClick={finish}
          >
            跳过
          </button>
          <button
            className="btn-orange text-sm ml-auto"
            style={{ borderRadius: 12, padding: '8px 18px' }}
            onClick={goNext}
          >
            {idx >= totalSteps - 1
              ? '开始跑商！'
              : <span className="inline-flex items-center gap-1.5">下一步 <Glyph name="arrowRight" size={14} /></span>}
          </button>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {ORDER.slice(0, totalSteps).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === idx ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: i === idx ? '#f5913a' : '#e8d5b8',
                transition: 'width 0.2s',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ob-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(245,145,58,0.25), 0 0 32px rgba(245,145,58,0.55); }
          50%      { box-shadow: 0 0 0 10px rgba(245,145,58,0.05), 0 0 48px rgba(245,145,58,0.75); }
        }
      `}</style>
    </div>
  )
}