import { useEffect, useState, type CSSProperties } from 'react'

const STORAGE_KEY = 'ocean-trade-onboarding-done'

export type OnboardingStep = 'welcome' | 'sail' | 'trade' | 'dock' | 'quest' | 'finish'

interface Props {
  step?: OnboardingStep
  onDone?: () => void
  open?: boolean
  activeTab?: string
  setActiveTab?: (t: string) => void
}

const COPY: Record<OnboardingStep, { title: string; body: string; selector?: string | null; needTab?: string }> = {
  welcome: { title: '欢迎船长', body: '你是新一任远洋贸易船长。地图上 15 座港口、6 种货物 —— 接下来 4 步带你跑通整条贸易回路。' },
  sail:    { title: '① 点城市启航',    body: '点地图上任意一座亮起的城市即可起航。航行途中不可买卖，抵达新港后右下角有"加速"按钮。',    selector: '.city-hit',                       needTab: 'map'    },
  trade:   { title: '② 市场低买高卖',   body: '切到「市场」：本港只经营特产 + 紧缺货。特产价低、紧缺价高—— 跨城倒卖赚差价。',   selector: '.nav-btn:nth-of-type(2)',         needTab: 'market' },
  dock:    { title: '③ 船坞升级船只',    body: '切到「船坞」：赚够金币就换更大的船 —— 货舱容量翻倍，单趟利润暴涨。',    selector: '.nav-btn:nth-of-type(4)',         needTab: 'dock'   },
  quest:   { title: '④ 功勋目标',   body: '切到「功勋」：达成总资产里程碑能领大奖（免费船 + 满载金币），红点亮起即可领取。',   selector: '.nav-btn:nth-of-type(5)',         needTab: 'quest'  },
  finish:  { title: '准备就绪',  body: '到这里：你的开局就是地图上跑商，别忘了盯紧货舱容量 —— 满载后买不了新货。' },
}

const ORDER: OnboardingStep[] = ['welcome', 'sail', 'trade', 'dock', 'quest', 'finish']

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
    if (!next) { finish(); return }
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
            fontSize: 56,
            lineHeight: 1,
            color: '#f5913a',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            transform: cardTop ? 'rotate(180deg)' : 'none',
            pointerEvents: 'none',
          }}
        >
          ⬇
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
          <span style={{ fontSize: 22 }}>🧭</span>
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
            {idx >= totalSteps - 1 ? '开始跑商！' : '下一步 →'}
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