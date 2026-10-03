import { useEffect, useMemo, useState } from 'react'
import { CITIES, CITY_BY_ID, GOODS, GOOD_BY_ID, GOOD_DESC } from '../game/data'
import { Glyph } from './Glyph'

// ─────────────────────────────────────────────────────────────────────────────
//  图鉴（v1.5.1）：三个分页
//    · 商品     —— 按「买过 / 卖过」收集进度展示全部 83 种货物
//    · 到达城市 —— 已到达 / 未发现 的港口收集进度（state.visited）
//    · 出售记录 —— 逐笔卖出流水（state.sellLog，v1.5.1 新增存档字段）
// ─────────────────────────────────────────────────────────────────────────────

type Filter = 'all' | 'bought' | 'sold' | 'new'
type Page = 'goods' | 'sells'

const PAGES: { key: Page; label: string }[] = [
  { key: 'goods', label: '商品' },
  { key: 'sells', label: '出售记录' },
]

const GOODS_FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'bought', label: '买过' },
  { key: 'sold', label: '卖过' },
  { key: 'new', label: '未收集' },
]

const fmt = (n: number) => n.toLocaleString()

export default function GoodsCodex(
  { bought, sold, sellLog, visited, onClose }:
  { bought: string[]; sold: string[]; sellLog: { id: number; t: number; cityId: string; goodId: string; qty: number; unit: number; revenue: number; profit: number }[]; visited: string[]; onClose: () => void },
) {
  const [page, setPage] = useState<Page>('goods')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<string | null>(null)

  const boughtSet = new Set(bought)
  const soldSet = new Set(sold)
  const visitedSet = new Set(visited)

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') {
        if (selected) setSelected(null)
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, onClose])

  // ── 各页计数 ──
  const goodsKnown = GOODS.filter(g => boughtSet.has(g.id) || soldSet.has(g.id)).length
  const sellsTotal = sellLog.length
  const sellsRevenue = sellLog.reduce((a, r) => a + r.revenue, 0)
  const sellsProfit = sellLog.reduce((a, r) => a + r.profit, 0)

  const goodsList = GOODS.filter(g => {
    const b = boughtSet.has(g.id)
    const s = soldSet.has(g.id)
    if (filter === 'bought') return b
    if (filter === 'sold') return s
    if (filter === 'new') return !b && !s
    return true
  })

  // 产地：由城市 exports 推导（单一出口港 → 干净单产地；多港 → 截断显示）
  const originOf = useMemo(() => {
    const m: Record<string, string> = {}
    for (const g of GOODS) {
      const cities = CITIES.filter(c => c.exports.includes(g.id)).map(c => c.name)
      m[g.id] = cities.length
        ? cities.length <= 2
          ? cities.join('·')
          : `${cities.slice(0, 2).join('·')} 等${cities.length}地`
        : ''
    }
    return m
  }, [])

  // 到访过的出口港 → 即使未交易也亮出产地（图鉴百科感）
  const revealedOrigin = useMemo(() => {
    const m: Record<string, boolean> = {}
    for (const g of GOODS) {
      const cities = CITIES.filter(c => c.exports.includes(g.id))
      m[g.id] = cities.length > 0 && cities.some(c => visitedSet.has(c.id))
    }
    return m
  }, [visitedSet])

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
          {/* 头部：标题 + 计数 + 关闭 */}
          <div className="flex items-center gap-2 mb-2 flex-shrink-0">
            <Glyph name="book" size={18} color="#c98a30" />
            <span className="font-900 text-base" style={{ color: '#3d2b10' }}>
              {page === 'goods' ? '商品图鉴' : '出售记录'}
            </span>
            <span
              className="ml-auto text-xs font-800"
              style={{ color: '#c0a070' }}
            >
              {page === 'goods' && `${goodsKnown}/${GOODS.length}`}
              {page === 'sells' && `${sellsTotal} 笔`}
            </span>
            <button className="px-1 leading-none" onClick={onClose}>
              <Glyph name="cross" size={16} color="#c9b394" />
            </button>
          </div>

          {/* 分页切换 */}
          <div className="flex gap-1.5 mb-3 flex-shrink-0">
            {PAGES.map(p => (
              <button
                key={p.key}
                onClick={() => setPage(p.key)}
                className="text-xs px-3 py-1 font-800 flex-1"
                style={{
                  borderRadius: 999,
                  background: page === p.key ? '#f5913a' : '#fff5ec',
                  color: page === p.key ? '#fff' : '#a07030',
                  border: `1.5px solid ${page === p.key ? '#f5913a' : '#f0dcb8'}`,
                }}
              >{p.label}</button>
            ))}
          </div>

          {/* ───────── 商品页 ───────── */}
          {page === 'goods' && (
            <>
              <div className="prog-track h-2 mb-2 flex-shrink-0">
                <div
                  className="prog-fill"
                  style={{ width: `${(goodsKnown / GOODS.length) * 100}%`, background: 'linear-gradient(90deg,#f0a83c,#ffd97a)' }}
                />
              </div>
              <div className="text-[10px] mb-2 flex-shrink-0" style={{ color: '#a07030' }}>
                买过 <b style={{ color: '#3a9a52' }}>{boughtSet.size}</b> 种 · 卖过{' '}
                <b style={{ color: '#d0741f' }}>{soldSet.size}</b> 种 · 集齐全品可解锁「全品收购家」「垄断商人」
              </div>
              <div className="flex gap-1.5 mb-3 flex-shrink-0">
                {GOODS_FILTERS.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setFilter(t.key)}
                    className="text-xs px-3 py-1 font-800"
                    style={{
                      borderRadius: 999,
                      background: filter === t.key ? '#f5913a' : '#fff5ec',
                      color: filter === t.key ? '#fff' : '#a07030',
                      border: `1.5px solid ${filter === t.key ? '#f5913a' : '#f0dcb8'}`,
                    }}
                  >{t.label}</button>
                ))}
              </div>
              <div className="overflow-auto grid grid-cols-2 gap-2 pr-0.5">
                {goodsList.map(g => {
                  const b = boughtSet.has(g.id)
                  const s = soldSet.has(g.id)
                  const known = b || s
                  const showOrigin = known || revealedOrigin[g.id]
                  return (
                    <div
                      key={g.id}
                      onClick={() => setSelected(g.id)}
                      className="p-2 text-center cursor-pointer transition"
                      style={{
                        background: known ? '#fff8f0' : '#f6f2e8',
                        border: `1.5px solid ${selected === g.id ? '#f5913a' : known ? '#f0dcb8' : '#eae2d2'}`,
                        borderRadius: 12,
                      }}
                    >
                      <div className="flex items-center justify-center" style={{ height: 36 }}>
                        <span className="inline-flex" style={{ filter: known ? undefined : 'grayscale(1)', opacity: known ? 1 : 0.45 }}>
                          <Glyph name={g.icon} size={30} />
                        </span>
                      </div>
                      <div className="text-[11px] font-800 truncate" style={{ color: known ? '#3d2b10' : '#b8ac96' }}>
                        {known ? g.name : '？？？'}
                      </div>
                      {showOrigin ? (
                        <>
                          {known && <div className="text-[10px]" style={{ color: '#a07030' }}>基准 {g.base} 金</div>}
                          {originOf[g.id] && (
                            <div className="text-[10px] truncate" style={{ color: '#b08a55' }} title={`产地：${originOf[g.id]}`}>产地 {originOf[g.id]}</div>
                          )}
                        </>
                      ) : (
                        <div className="text-[10px]" style={{ color: '#c0b8a4' }}>尚未交易</div>
                      )}
                      {known && (
                        <div className="flex items-center justify-center gap-1 mt-0.5" style={{ minHeight: 15 }}>
                          {b && <span className="text-[9px] font-900 px-1.5 rounded-full" style={{ background: '#e6f6e9', color: '#3a9a52' }}>买</span>}
                          {s && <span className="text-[9px] font-900 px-1.5 rounded-full" style={{ background: '#fdeee0', color: '#d0741f' }}>卖</span>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {goodsList.length === 0 && (
                <div className="text-xs text-center py-8" style={{ color: '#c0a070' }}>这个分类还没有收集到商品，出海贸易试试！</div>
              )}
            </>
          )}

          {/* ───────── 出售记录页 ───────── */}
          {page === 'sells' && (
            <>
              {sellsTotal > 0 ? (
                <>
                  <div className="panel-white p-2 mb-2 flex-shrink-0" style={{ borderRadius: 12, background: '#fff8f0', border: '1.5px solid #f0dcb8' }}>
                    <div className="flex items-center justify-around text-center">
                      <div>
                        <div className="text-[9px]" style={{ color: '#a07030' }}>笔数</div>
                        <div className="text-xs font-900" style={{ color: '#3d2b10' }}>{sellsTotal}</div>
                      </div>
                      <div>
                        <div className="text-[9px]" style={{ color: '#a07030' }}>总收入</div>
                        <div className="text-xs font-900" style={{ color: '#d0741f' }}>{fmt(sellsRevenue)}</div>
                      </div>
                      <div>
                        <div className="text-[9px]" style={{ color: '#a07030' }}>总利润</div>
                        <div className="text-xs font-900" style={{ color: sellsProfit >= 0 ? '#3a9a52' : '#d0432f' }}>
                          {sellsProfit >= 0 ? '+' : ''}{fmt(sellsProfit)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-auto pr-0.5 flex flex-col gap-1.5">
                    {sellLog.map(r => {
                      const g = GOOD_BY_ID[r.goodId]
                      const city = CITY_BY_ID[r.cityId]
                      const good = g
                      return (
                        <div
                          key={r.id}
                          className="p-2 flex items-center gap-2"
                          style={{ background: '#fff8f0', border: '1.5px solid #f0dcb8', borderRadius: 12 }}
                        >
                          <span className="inline-flex flex-shrink-0">
                            <Glyph name={good.icon} size={26} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[12px] font-800 truncate" style={{ color: '#3d2b10' }}>
                              {good.name} ×{r.qty}
                            </div>
                            <div className="text-[10px] truncate" style={{ color: '#a07030' }}>
                              <Glyph name="city" size={10} color="#a07030" /> {city.name} · 单价 {fmt(r.unit)}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-[11px] font-900" style={{ color: '#d0741f' }}>+{fmt(r.revenue)}</div>
                            <div className="text-[10px] font-800" style={{ color: r.profit >= 0 ? '#3a9a52' : '#d0432f' }}>
                              {r.profit >= 0 ? '盈 ' : '亏 '}{fmt(Math.abs(r.profit))}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="text-xs text-center py-10" style={{ color: '#c0a070' }}>
                  还没有卖出记录<br />到销地港口把货舱里的货卖出去吧！
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ───────── 货物详情（点击卡片展开） ───────── */}
      {selected && (() => {
        const g = GOOD_BY_ID[selected]
        const b = boughtSet.has(g.id)
        const s = soldSet.has(g.id)
        const known = b || s
        const showOrigin = known || revealedOrigin[g.id]
        const desc = GOOD_DESC[g.id]
        return (
          <div
            className="absolute inset-0 flex items-center justify-center px-6"
            style={{ background: 'rgba(0,0,0,0.55)', zIndex: 10 }}
            onClick={() => setSelected(null)}
          >
            <div
              className="panel-white p-5 flex flex-col items-center text-center"
              style={{ borderRadius: 18, width: '100%', maxWidth: 320 }}
              onClick={e => e.stopPropagation()}
            >
              <span className="inline-flex mb-2" style={{ filter: known ? undefined : 'grayscale(1)', opacity: known ? 1 : 0.5 }}>
                <Glyph name={g.icon} size={56} />
              </span>
              <div className="font-900 text-lg mb-1" style={{ color: known ? '#3d2b10' : '#b8ac96' }}>{known ? g.name : '？？？'}</div>
              {known && <div className="text-xs mb-1" style={{ color: '#a07030' }}>基准 {g.base} 金</div>}
              {showOrigin && originOf[g.id] && (
                <div className="text-xs mb-2" style={{ color: '#b08a55' }}>产地 {originOf[g.id]}</div>
              )}
              <div className="flex items-center justify-center gap-1 mb-2" style={{ minHeight: 15 }}>
                {b && <span className="text-[9px] font-900 px-1.5 rounded-full" style={{ background: '#e6f6e9', color: '#3a9a52' }}>买</span>}
                {s && <span className="text-[9px] font-900 px-1.5 rounded-full" style={{ background: '#fdeee0', color: '#d0741f' }}>卖</span>}
              </div>
              {known && desc ? (
                <div className="text-[12px] leading-relaxed" style={{ color: '#6b5638' }}>{desc}</div>
              ) : known ? (
                <div className="text-[12px]" style={{ color: '#b0a890' }}>（普通货物，暂无更多图鉴笔记）</div>
              ) : (
                <div className="text-[12px]" style={{ color: '#b0a890' }}>尚未收集，出海贸易解锁详情</div>
              )}
              <button
                className="mt-3 text-xs px-4 py-1.5 font-800"
                style={{ borderRadius: 999, background: '#f5913a', color: '#fff' }}
                onClick={() => setSelected(null)}
              >知道了</button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
