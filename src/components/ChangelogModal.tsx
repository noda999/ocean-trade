import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ocean-trade-changelog-seen'
const CURRENT_VERSION = 'v1.1.0'

interface ChangeItem {
  icon: string
  title: string
  desc: string
}

const ITEMS: ChangeItem[] = [
  { icon: '🧹', title: '移除存档功能', desc: '复杂移动 webview 容器里复制/导入/二维码都不够稳，砍掉所有存档相关代码 —— 现在每次进来都是全新一局，体验更干净。' },
  { icon: '🛡️', title: '小红书容器适配', desc: '顶栏避开容器胶囊/状态栏遮挡；favicon 不再 404；脚本 IIFE + TDZ 修复；离线字体栈。' },
  { icon: '⛵', title: '核心玩法上线', desc: '15 座大航海港口 × 22 种货物 × 5 艘船升级树。' },
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
                {CURRENT_VERSION} · 正式版 · 精简版本（移除存档）
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