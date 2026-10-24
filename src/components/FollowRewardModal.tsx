import { useEffect, useState, type ReactNode } from 'react'
import { Glyph } from './Glyph'
import { useGame } from '../game/store'
import { canFollowAuthor, followAuthor, getAuthorFollowStatus } from '../game/xhs'
import { FOLLOW_BOOST_REWARD } from '../game/state'

interface Slide {
  img: string
  emoji: string
  title: string
  caption: string
  gradient: string
}

// 画廊三屏：真实 AI 图放在 public/promo/ai1.png ~ ai3.png（相对路径，沙箱内可加载）；
// 若图片缺失，自动回退到主题渐变 + emoji，照样好看。
const SLIDES: Slide[] = [
  { img: 'ai1', emoji: '⛵', title: '启航 · 黄金航线', caption: '扬帆穿越晨雾，驶向远方的丰饶之港。', gradient: 'linear-gradient(155deg,#ffb46b,#ff7e5f 55%,#3a6ea5)' },
  { img: 'ai2', emoji: '🏝️', title: '宝藏 · 失落海湾', caption: '传说中的无人海湾，沉睡着上个世纪的珍宝。', gradient: 'linear-gradient(155deg,#7be0c8,#2bb6a0 55%,#0e6b7a)' },
  { img: 'ai3', emoji: '🏯', title: '盛世 · 东方商港', caption: '千帆竞渡、万货云集的世界级商埠。', gradient: 'linear-gradient(155deg,#ffd56b,#ff9a5a 55%,#b5522e)' },
]

/**
 * 关注作者福利弹窗（AI 画廊 + 关注领加速卡）。
 * 仅在小工具容器内（canFollowAuthor 为 true）渲染；网页端 / Vercel 直接返回 null。
 */
export default function FollowRewardModal({ onClose }: { onClose: () => void }): ReactNode {
  const { state, dispatch } = useGame()
  const [status, setStatus] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [claimed, setClaimed] = useState(state.followBoostClaimed ?? false)
  const [slide, setSlide] = useState(0)
  const [failed, setFailed] = useState<boolean[]>([false, false, false])

  useEffect(() => {
    if (!canFollowAuthor()) return
    getAuthorFollowStatus().then((s) => setStatus(s))
  }, [])

  if (!canFollowAuthor()) return null

  const followed = status === 1
  const isSelf = status === 2

  async function handleFollow() {
    if (busy || isSelf) return
    setBusy(true)
    const r = await followAuthor()
    setBusy(false)
    if (r !== null) setStatus(r)
  }

  function handleClaim() {
    if (claimed || !followed) return
    dispatch({ type: 'GRANT_FOLLOW_BOOST' })
    setClaimed(true)
  }

  const cur = SLIDES[slide]

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(15,28,38,.62)' }}
      onClick={onClose}
    >
      <div
        className="panel-white mx-4 w-full max-w-md overflow-hidden"
        style={{ borderRadius: 18 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="relative px-4 pt-4 pb-2 flex items-center gap-2">
          <Glyph name="gift" size={18} color="#e0863a" />
          <button
            onClick={onClose}
            aria-label="关闭"
            className="absolute right-3 top-3 w-7 h-7 flex items-center justify-center rounded-full"
            style={{ background: '#f0e2c8', color: '#8a6a40', fontSize: 14 }}
          >✕</button>
        </div>

        <div className="px-4 pb-4 overflow-auto" style={{ maxHeight: '74vh' }}>
          {/* 画廊舞台 */}
          <div
            className="relative rounded-2xl overflow-hidden mb-2"
            style={{ aspectRatio: '4 / 3', background: cur.gradient }}
          >
            {!failed[slide] && (
              <img
                src={`${import.meta.env.BASE_URL}promo/${cur.img}.jpg`}
                alt={cur.title}
                onError={() => setFailed((f) => { const n = [...f]; n[slide] = true; return n })}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
            {failed[slide] && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ fontSize: 64 }}>{cur.emoji}</div>
            )}
            <div
              className="absolute inset-x-0 bottom-0 px-3 py-2"
              style={{ background: 'linear-gradient(transparent,rgba(0,0,0,.55))' }}
            >
              <div className="font-900 text-sm" style={{ color: '#fff' }}>{cur.title}</div>
              <div className="text-[11px]" style={{ color: 'rgba(255,255,255,.85)' }}>{cur.caption}</div>
            </div>
            {/* 左右切换 */}
            <button
              className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,.75)', color: '#3d2b10', fontSize: 16 }}
              onClick={() => setSlide((s) => (s + SLIDES.length - 1) % SLIDES.length)}
            >‹</button>
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,.75)', color: '#3d2b10', fontSize: 16 }}
              onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
            >›</button>
          </div>
          {/* 圆点指示器 */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className="rounded-full"
                style={{ width: i === slide ? 18 : 7, height: 7, background: i === slide ? '#e0863a' : '#e0d2b8', transition: 'width .2s' }}
              />
            ))}
          </div>

          {/* 福利文案 */}
          <div
            className="rounded-xl px-3 py-2 mb-3"
            style={{ background: '#fff8f0', border: '1.5px solid #f0e2c8' }}
          >
            <div className="text-xs font-800 mb-0.5" style={{ color: '#8a6a40' }}>🎁 关注作者，领加速卡</div>
            <div className="text-[11px] leading-relaxed" style={{ color: '#a07030' }}>
              在小红书关注作者，即可免费领取 <b style={{ color: '#c05050' }}>加速卡 ×{FOLLOW_BOOST_REWARD}</b>，
              让每次远航的航程直接减半，快人一步赚大钱！不关注就没有哦～
            </div>
          </div>

          {/* 关注按钮 */}
          {isSelf ? (
            <button
              disabled
              className="w-full py-2.5 text-sm font-800 rounded-xl mb-2"
              style={{ background: '#eee', color: '#a08050', border: '1.5px solid #e0d2b8' }}
            >你是作者本人</button>
          ) : followed ? (
            <button
              disabled
              className="w-full py-2.5 text-sm font-800 rounded-xl mb-2 inline-flex items-center justify-center gap-1.5"
              style={{ background: '#e8f6ec', color: '#3f9d52', border: '1.5px solid #cce8d4' }}
            >✓ 已关注</button>
          ) : (
            <button
              disabled={busy}
              onClick={handleFollow}
              className="w-full py-2.5 text-sm font-800 rounded-xl mb-2"
              style={{ background: '#ff2e4d', color: '#fff', border: '1.5px solid #ff2e4d', opacity: busy ? 0.6 : 1 }}
            >{busy ? '处理中…' : '＋ 关注作者'}</button>
          )}

          {/* 领取按钮（关注后才可领） */}
          <button
            disabled={claimed || !followed}
            onClick={handleClaim}
            className="w-full py-2.5 text-sm font-800 rounded-xl"
            style={{
              background: claimed ? '#e8f6ec' : followed ? '#e0863a' : '#d9cdb6',
              color: claimed ? '#3f9d52' : followed ? '#fff' : '#8a7a5a',
              border: '1.5px solid ' + (claimed ? '#cce8d4' : followed ? '#e0863a' : '#e0d2b8'),
            }}
          >
            {claimed ? `✓ 已领取 加速卡 ×${FOLLOW_BOOST_REWARD}` : followed ? `领取 加速卡 ×${FOLLOW_BOOST_REWARD}` : '先关注作者才能领取'}
          </button>
        </div>
      </div>
    </div>
  )
}
