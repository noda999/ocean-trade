import { useEffect, useState } from 'react'
import { VOYAGE_EVENTS } from '../game/data'
import { Glyph } from './Glyph'

// ─────────────────────────────────────────────────────────────────────────────
//  海上事件图鉴（v1.5.2）：列出全部航行奇遇，已遭遇的亮出详情，未遭遇的显示 ???
//  数据源 state.eventsSeen，无需新增存档字段，旧档读入自动补齐（见 save.ts 透传）
// ─────────────────────────────────────────────────────────────────────────────

export default function VoyageEventCodex({ seen, onClose }: { seen: string[]; onClose: () => void }) {
  const [onlySeen, setOnlySeen] = useState(false)
  const seenSet = new Set(seen)
  const knownCount = seen.length

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const list = VOYAGE_EVENTS.filter(e => (onlySeen ? seenSet.has(e.id) : true))

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.6)', zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="w-full flex flex-col"
        style={{ maxWidth: 380, maxHeight: '86vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="panel-white p-4 flex flex-col overflow-hidden" style={{ borderRadius: 18, maxHeight: '86vh' }}>
          <div className="flex items-center gap-2 mb-2 flex-shrink-0">
            <Glyph name="wave" size={18} color="#2f8fb8" />
            <span className="font-900 text-base" style={{ color: '#3d2b10' }}>海上事件图鉴</span>
            <span
              className="ml-auto text-xs font-800"
              style={{ color: knownCount === VOYAGE_EVENTS.length ? '#4cba6a' : '#c0a070' }}
            >
              {knownCount}/{VOYAGE_EVENTS.length}
            </span>
            <button className="px-1 leading-none" onClick={onClose}>
              <Glyph name="cross" size={16} color="#c9b394" />
            </button>
          </div>

          <div className="prog-track h-2 mb-2 flex-shrink-0">
            <div
              className="prog-fill"
              style={{ width: `${(knownCount / VOYAGE_EVENTS.length) * 100}%`, background: 'linear-gradient(90deg,#4ea0c9,#9ad6f0)' }}
            />
          </div>
          <div className="text-[10px] mb-2 flex-shrink-0" style={{ color: '#a07030' }}>
            已遭遇 <b style={{ color: '#2f7fa0' }}>{knownCount}</b> 种奇遇 · 集齐全部 {VOYAGE_EVENTS.length} 种解锁「命运弄人」
          </div>

          <div className="flex gap-1.5 mb-3 flex-shrink-0">
            {[
              { key: false, label: '全部' },
              { key: true, label: '已遭遇' },
            ].map(t => (
              <button
                key={String(t.key)}
                onClick={() => setOnlySeen(t.key)}
                className="text-xs px-3 py-1 font-800"
                style={{
                  borderRadius: 999,
                  background: onlySeen === t.key ? '#2f8fb8' : '#fff5ec',
                  color: onlySeen === t.key ? '#fff' : '#a07030',
                  border: `1.5px solid ${onlySeen === t.key ? '#2f8fb8' : '#f0dcb8'}`,
                }}
              >{t.label}</button>
            ))}
          </div>

          <div className="overflow-auto grid grid-cols-2 gap-2 pr-0.5">
            {list.map(e => {
              const found = seenSet.has(e.id)
              return (
                <div
                  key={e.id}
                  className="p-2"
                  style={{
                    background: found ? '#fff8f0' : '#f6f2e8',
                    border: `1.5px solid ${found ? '#f0dcb8' : '#eae2d2'}`,
                    borderRadius: 12,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex" style={{ filter: found ? undefined : 'grayscale(1)', opacity: found ? 1 : 0.4 }}>
                      <Glyph name={e.icon} size={22} color={found ? (e.kind === 'bad' ? '#c05050' : '#4cba6a') : '#b8ac96'} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12px] font-800 truncate" style={{ color: found ? '#3d2b10' : '#b8ac96' }}>
                        {found ? e.title : '未发现'}
                      </div>
                      <div className="text-[9px] truncate" style={{ color: found ? (e.kind === 'bad' ? '#c05050' : '#4cba6a') : '#c0b8a4' }}>
                        {found ? (e.kind === 'bad' ? '凶险' : '好运') : '???'}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] mt-1 leading-tight" style={{ color: found ? '#9a8a6a' : '#c0b8a4', minHeight: 30 }}>
                    {found ? e.desc : '航途中尚未遇见，多出海碰碰运气吧'}
                  </div>
                </div>
              )
            })}
          </div>
          {list.length === 0 && (
            <div className="text-xs text-center py-8" style={{ color: '#c0a070' }}>还没有遭遇过任何海上事件，启航探险吧！</div>
          )}
        </div>
      </div>
    </div>
  )
}
