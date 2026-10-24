import { useEffect, useState, type ReactNode } from 'react'
import { canFollowAuthor, followAuthor, getAuthorFollowStatus } from '../game/xhs'

/**
 * 关注作者入口。仅在小红书小工具容器内（canFollowAuthor 为 true）渲染；
 * 网页版 / Vercel / dev 下直接返回 null，不参与任何渲染。
 */
export default function FollowAuthor(): ReactNode {
  const [status, setStatus] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!canFollowAuthor()) return
    getAuthorFollowStatus().then(s => setStatus(s))
  }, [])

  if (!canFollowAuthor()) return null

  const isSelf = status === 2
  const followed = status === 1

  async function handleClick() {
    if (busy || isSelf) return
    setBusy(true)
    setMsg(null)
    const r = await followAuthor()
    setBusy(false)
    if (r === null) {
      setMsg('未发生变化，可稍后再试')
    } else {
      setStatus(r)
      setMsg(null)
    }
  }

  return (
    <div className="panel-white p-3 mb-3" style={{ borderRadius: 14, border: '1.5px solid #f0e2c8', background: '#fff8f0' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm leading-none" style={{ color: '#ff2e4d' }}>❤</span>
        <span className="text-xs font-800" style={{ color: '#8a6a40' }}>关注作者</span>
      </div>
      <div className="text-[11px] mb-2" style={{ color: '#a07030', lineHeight: 1.5 }}>
        喜欢这款游戏？在小红书关注作者，第一时间获取版本更新与航海攻略。
      </div>
      {isSelf ? (
        <button
          disabled
          className="w-full py-2 text-xs font-800"
          style={{ borderRadius: 10, background: '#eee', color: '#a08050', border: '1.5px solid #e0d2b8' }}
        >你是作者本人</button>
      ) : followed ? (
        <button
          disabled
          className="w-full py-2 text-xs font-800 inline-flex items-center justify-center gap-1.5"
          style={{ borderRadius: 10, background: '#e8f6ec', color: '#3f9d52', border: '1.5px solid #cce8d4' }}
        >✓ 已关注</button>
      ) : (
        <button
          disabled={busy}
          onClick={handleClick}
          className="w-full py-2 text-xs font-800"
          style={{
            borderRadius: 10,
            background: '#ff2e4d',
            color: '#fff',
            border: '1.5px solid #ff2e4d',
            opacity: busy ? 0.6 : 1,
          }}
        >{busy ? '处理中…' : '＋ 关注作者'}</button>
      )}
      {msg && <div className="text-[11px] mt-2" style={{ color: '#c08030' }}>{msg}</div>}
    </div>
  )
}
