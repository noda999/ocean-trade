import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ocean-trade-changelog-seen'
const CURRENT_VERSION = 'v1.4.0'

interface ChangeItem {
  icon: string
  title: string
  desc: string
}

const ITEMS: ChangeItem[] = [
  { icon: '🔓', title: '隐藏特产 · 21 件新货', desc: '每座港口都藏着一件投资 1 级「商会伙伴」（25,000 金）即解锁的独家特产：和田玉雕、锡兰蓝宝石、龙涎香、太阳金盘……产地价极低，名港高价求购。商品总数扩至 71 种，图鉴党的盛宴。' },
  { icon: '🛃', title: '进港关税', desc: '每次靠港按货值缴纳关税（30 金 + 货值 1%）：投资 2 级半价、3 级全免——「荣誉市民」从此免税通行。' },
  { icon: '🏴‍☠️', title: '海事署悬赏', desc: '船坞分区栏新增「海事署」：定期发布海盗通缉令，消耗舰炮组即可出击。战力 = 船级 + 舰炮组，出手前就能看到预估胜率；大捷领赏 + 声望，失利损失 8% 现金修船。' },
  { icon: '🗺️', title: '深海秘藏', desc: '交付委托、海上漂流瓶、击溃海盗都可能捡到藏宝图碎片。集齐 4 块指向某港外海，到「海事署」按图挖掘：金币 + 「沉没神殿珍宝」（名港超高价收购），越挖越富。' },
  { icon: '🏦', title: '港口银行', desc: '市场页新增「港口银行」（折叠一行，点开借贷）：按资产 50% 提供信用额度，随借随还。但债务每周期计息，超过资产 3 倍会被强制清算——刀尖上的滚雪球。' },
  { icon: '🔁', title: '老档完全兼容', desc: '新玩法全部为新增字段，历史存档读入自动补齐（含 21 件新货的行情），进度不受任何影响。' },
]

interface Props {
  /** 强制打开（用于手动查看更新日志） */
  forceOpen?: boolean
  onClose?: () => void
}

export default function ChangelogModal({ forceOpen = false, onClose }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (forceOpen) {
      setOpen(true)
      return
    }
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.get('clogseen') === '1') {
        localStorage.setItem(STORAGE_KEY, CURRENT_VERSION)
        return
      }
      const seen = localStorage.getItem(STORAGE_KEY)
      // 全新玩家：新手导览优先，跳过更新日志（避免两层遮罩叠住挡点击）
      if (!localStorage.getItem('ocean-trade-onboarding-done')) {
        localStorage.setItem(STORAGE_KEY, CURRENT_VERSION)
        return
      }
      if (seen !== CURRENT_VERSION) setOpen(true)
    } catch { setOpen(true) }
  }, [forceOpen])

  const close = () => {
    try { localStorage.setItem(STORAGE_KEY, CURRENT_VERSION) } catch { /* ignore */ }
    setOpen(false)
    onClose?.()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', zIndex: 9999 }}
      onClick={close}
    >
      <div
        className="panel-white relative"
        style={{
          width: 'min(88vw, 380px)',
          borderRadius: 22,
          padding: 0,
          overflow: 'hidden',
          background: '#fff8f0',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
          border: '2px solid #f5913a',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #f5913a 0%, #fdb870 100%)',
            padding: '20px 22px 16px',
            position: 'relative',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 28 }}>🎉</span>
            <div>
              <div className="font-900 text-lg" style={{ color: '#3d2b10' }}>
                新版本上线
              </div>
              <div className="text-xs font-700" style={{ color: 'rgba(61,43,16,0.75)' }}>
                {CURRENT_VERSION} · 隐藏特产 · 海事悬赏 · 深海秘藏 · 银行
              </div>
            </div>
          </div>
          <button
            aria-label="关闭"
            className="absolute"
            style={{
              top: 12, right: 12,
              width: 28, height: 28,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.4)',
              color: '#3d2b10',
              fontSize: 16, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={close}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '16px 20px 4px' }}>
          {ITEMS.map((it, i) => (
            <div
              key={i}
              className="flex gap-3"
              style={{
                padding: '10px 0',
                borderTop: i === 0 ? 'none' : '1px dashed #f5e0c0',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 36, height: 36,
                  borderRadius: 12,
                  background: '#fff5ec',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                {it.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-900 text-sm" style={{ color: '#3d2b10' }}>
                  {it.title}
                </div>
                <div
                  className="text-xs font-700"
                  style={{ color: '#8a6a40', marginTop: 2, lineHeight: 1.5 }}
                >
                  {it.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 20px 20px' }}>
          <button
            className="btn-orange w-full"
            style={{ borderRadius: 14, padding: '12px 0', fontSize: 15 }}
            onClick={close}
          >
            开始航行 🚢
          </button>
        </div>
      </div>
    </div>
  )
}