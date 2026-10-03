import { useEffect, useState } from 'react'
import { CITIES } from '../game/data'
import { Glyph } from './Glyph'
import { CityLandmark } from './Landmarks'

// ─────────────────────────────────────────────────────────────────────────────
//  城市图鉴（v1.5.1）：到达城市从商品图鉴拆出，独立成页
//  数据源 state.visited，无需新增存档字段，旧档进度自动继承
// ─────────────────────────────────────────────────────────────────────────────

export default function CityCodex({ visited, onClose }: { visited: string[]; onClose: () => void }) {
  const [onlyVisited, setOnlyVisited] = useState(false)
  const visitedSet = new Set(visited)
  const knownCount = visited.length

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const list = CITIES.filter(c => (onlyVisited ? visitedSet.has(c.id) : true))

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
            <Glyph name="city" size={18} color="#c98a30" />
            <span className="font-900 text-base" style={{ color: '#3d2b10' }}>城市图鉴</span>
            <span
              className="ml-auto text-xs font-800"
              style={{ color: knownCount === CITIES.length ? '#4cba6a' : '#c0a070' }}
            >
              {knownCount}/{CITIES.length}
            </span>
            <button className="px-1 leading-none" onClick={onClose}>
              <Glyph name="cross" size={16} color="#c9b394" />
            </button>
          </div>

          <div className="prog-track h-2 mb-2 flex-shrink-0">
            <div
              className="prog-fill"
              style={{ width: `${(knownCount / CITIES.length) * 100}%`, background: 'linear-gradient(90deg,#4ea0c9,#9ad6f0)' }}
            />
          </div>
          <div className="text-[10px] mb-2 flex-shrink-0" style={{ color: '#a07030' }}>
            已抵达 <b style={{ color: '#2f7fa0' }}>{knownCount}</b> 座港口 · 集齐全部 {CITIES.length} 座解锁「全球通」
          </div>

          <div className="flex gap-1.5 mb-3 flex-shrink-0">
            {[
              { key: false, label: '全部' },
              { key: true, label: '已到达' },
            ].map(t => (
              <button
                key={String(t.key)}
                onClick={() => setOnlyVisited(t.key)}
                className="text-xs px-3 py-1 font-800"
                style={{
                  borderRadius: 999,
                  background: onlyVisited === t.key ? '#2f8fb8' : '#fff5ec',
                  color: onlyVisited === t.key ? '#fff' : '#a07030',
                  border: `1.5px solid ${onlyVisited === t.key ? '#2f8fb8' : '#f0dcb8'}`,
                }}
              >{t.label}</button>
            ))}
          </div>

          <div className="overflow-auto grid grid-cols-2 gap-2 pr-0.5">
            {list.map(c => {
              const seen = visitedSet.has(c.id)
              return (
                <div
                  key={c.id}
                  className="p-2"
                  style={{
                    background: seen ? '#fff8f0' : '#f6f2e8',
                    border: `1.5px solid ${seen ? '#f0dcb8' : '#eae2d2'}`,
                    borderRadius: 12,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    {/* 城市图标 = 招牌特产插画：每城不同，未到达时置灰 */}
                    <span
                      style={{
                        display: 'inline-flex',
                        filter: seen ? undefined : 'grayscale(1)',
                        opacity: seen ? 1 : 0.4,
                      }}
                    >
                      {/* 优先用 icons_backup 同款 AI 城市地标位图（public/icons/<id>.png），缺失时回落 SVG */}
                      <CityLandmark id={c.id} size={26} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12px] font-800 truncate" style={{ color: seen ? '#3d2b10' : '#b8ac96' }}>
                        {seen ? c.name : '未发现'}
                      </div>
                      <div className="text-[9px] truncate" style={{ color: seen ? '#a07030' : '#c0b8a4' }}>
                        {seen ? c.sub : '???'}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] mt-1 leading-tight" style={{ color: seen ? '#9a8a6a' : '#c0b8a4', minHeight: 26 }}>
                    {seen ? c.blurb : '尚未靠岸，出海探索新港口吧'}
                  </div>
                </div>
              )
            })}
          </div>
          {list.length === 0 && (
            <div className="text-xs text-center py-8" style={{ color: '#c0a070' }}>还没有到达过任何港口，出海探险吧！</div>
          )}
        </div>
      </div>
    </div>
  )
}
