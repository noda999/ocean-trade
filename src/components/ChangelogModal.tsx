import { useEffect, useState } from 'react'
import { Glyph, type GlyphName } from './Glyph'

const STORAGE_KEY = 'ocean-trade-changelog-seen'
const CURRENT_VERSION = 'v1.5.0'

interface ChangeItem {
  icon: GlyphName
  title: string
  desc: string
}

const ITEMS: ChangeItem[] = [
  { icon: 'book', title: '三大图鉴上线', desc: '商品图鉴（83 种货的产地 / 销地推荐航线）、城市图鉴（每座港换成招牌特产插画）、海上事件图鉴（20 种奇遇集齐解锁「命运弄人」）全部入册，没见过的先留 ???，是收藏党的长线目标。' },
  { icon: 'trophy', title: '功勋页卡片化折叠', desc: '传奇功勋、船员委托、贸易成就三大长列表改为可点开的卡片式折叠栏，每张都带图标、计数与进度条，默认收起——页面清爽，想看哪块点哪块。' },
  { icon: 'horn', title: '背景音乐 BGM', desc: '首次操作后自动播放程序化合成的大航海轻音乐（海浪 + 古筝 / 乌德拨弦 + 笛 + 弦乐铺底，中东 Hijaz 异域音阶 × 中国五声），零音频文件。可在「设置」里开关并调音量。' },
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
            <Glyph name="sparkles" size={28} color="#3d2b10" />
            <div>
              <div className="font-900 text-lg" style={{ color: '#3d2b10' }}>
                新版本上线
              </div>
              <div className="text-xs font-700" style={{ color: 'rgba(61,43,16,0.75)' }}>
                {CURRENT_VERSION} · 船坞界面精简 · 商品图鉴补全 · 海上事件图鉴
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
                }}
              >
                <Glyph name={it.icon} size={21} color="#c98a30" />
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
            <span className="inline-flex items-center gap-1.5 justify-center">开始航行 <Glyph name="ship" size={17} /></span>
          </button>
        </div>
      </div>
    </div>
  )
}