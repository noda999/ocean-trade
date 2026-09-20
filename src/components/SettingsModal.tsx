import { useState, type ReactNode } from 'react'
import { useGame } from '../game/store'

interface Props {
  onClose: () => void
}

/** 最小化的设置面板 —— 仅保留"重置进度" + 玩法简介（存档功能已移除） */
export default function SettingsModal({ onClose }: Props): ReactNode {
  const { state, reset } = useGame()
  const [status, setStatus] = useState<{ kind: 'ok' | 'bad'; msg: string } | null>(null)

  function handleReset() {
    if (!window.confirm('确定要清空当前进度，重新开始吗？')) return
    reset()
    setStatus({ kind: 'ok', msg: '已重新开始' })
  }

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center"
      style={{ background: 'rgba(20,40,55,.55)' }}
      onClick={onClose}
    >
      <div
        className="panel-white mx-4 my-6 w-full max-w-md overflow-hidden"
        style={{ borderRadius: 18, maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 顶部 */}
        <div className="px-4 pt-4 pb-3 flex items-center" style={{ borderBottom: '1.5px solid #f5e8d0' }}>
          <div className="font-900 text-base" style={{ color: '#3d2b10' }}>⚙️ 关于</div>
          <button className="ml-auto top-icon-btn" style={{ width: 28, height: 28 }} onClick={onClose}>✕</button>
        </div>

        {/* 正文 */}
        <div className="px-4 py-3 overflow-auto" style={{ flex: 1 }}>
          {/* 当前进度 */}
          <div className="panel-orange p-3 mb-3" style={{ borderRadius: 14 }}>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,.92)' }}>
              <span>📍 当前进度</span>
              <span className="ml-auto font-900" style={{ color: 'white' }}>
                🪙 {Math.floor(state.money).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1.5" style={{ color: 'rgba(255,255,255,.85)' }}>
              <span>📦 货舱 {Object.values(state.cargo).reduce((s, c) => s + c.qty, 0)} 件</span>
            </div>
          </div>

          {/* 玩法简介 */}
          <div className="mb-4">
            <div className="text-xs font-800 mb-2" style={{ color: '#8a6a40' }}>📖 玩法简介</div>
            <div
              className="text-xs leading-relaxed p-3"
              style={{
                borderRadius: 10,
                background: '#fff8f0',
                border: '1.5px solid #f0e2c8',
                color: '#5a4020',
                lineHeight: 1.6,
              }}
            >
              1️⃣ 在港口 <b>低买高卖</b>，赚取差价<br />
              2️⃣ 跑 <b>远航贸易</b>，跨区域倒货赚更多<br />
              3️⃣ 用利润 <b>升级帆船</b>，容量更大、单趟更赚<br />
              4️⃣ 解锁 <b>更多港口</b>，发现更稀缺的货物<br />
              5️⃣ 挑战 <b>功勋榜</b>，目标 12 万总资产登顶！
            </div>
          </div>

          {/* 提示 */}
          <div
            className="text-[11px] leading-relaxed p-2.5 mb-4"
            style={{
              borderRadius: 10,
              background: '#fff5ec',
              color: '#a07030',
              border: '1px dashed #f5d8a8',
            }}
          >
            💡 离开小红书 webview 后，<b style={{ color: '#c08030' }}>本局进度不会保留</b>，下次进来会重新开始。
          </div>

          {/* 危险区 */}
          <div className="mb-4">
            <div className="text-xs font-800 mb-2" style={{ color: '#8a6a40' }}>⚠️ 危险操作</div>
            <button
              className="w-full py-2.5 text-sm font-800"
              style={{
                borderRadius: 12,
                background: '#fff0e8',
                color: '#c05050',
                border: '1.5px solid #f5c8b8',
              }}
              onClick={handleReset}
            >
              🗑️ 重新开始
            </button>
          </div>

          {/* 状态消息 */}
          {status && (
            <div
              className="text-xs p-2.5"
              style={{
                borderRadius: 10,
                background: status.kind === 'ok' ? '#e8f6ec' : '#fcecec',
                color: status.kind === 'ok' ? '#3f9d52' : '#c05050',
                border: `1.5px solid ${status.kind === 'ok' ? '#cce8d4' : '#f5c8c8'}`,
              }}
            >
              {status.msg}
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="px-4 py-3" style={{ borderTop: '1.5px solid #f5e8d0', background: '#fff8f0' }}>
          <button
            className="btn-ghost-orange w-full py-2.5 text-sm font-800"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}