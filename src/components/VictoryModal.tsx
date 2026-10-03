import { useGame } from '../game/store'
import { allLegendsDone, assetsOf, rank } from '../game/state'
import { LEGENDS, LEGEND_TITLE } from '../game/data'
import { Glyph } from './Glyph'

/** 通关庆祝页（v1.5）：集齐全部传奇功勋后弹一次，展示生涯统计 */
export default function VictoryModal() {
  const { state, dispatch } = useGame()
  if (!allLegendsDone(state) || state.victorySeen) return null

  const st = state.stats
  const rk = rank(state)
  const rows: { icon: string; label: string; value: string }[] = [
    { icon: 'crown', label: '传奇功勋', value: `${state.legendsClaimed.length} / ${LEGENDS.length}` },
    { icon: 'coin', label: '总资产', value: `${Math.floor(assetsOf(state)).toLocaleString()} 金` },
    { icon: 'compass', label: '航行总里程', value: `${st.distance.toLocaleString()} 里` },
    { icon: 'exchange', label: '累计交易', value: `${st.trades} 次` },
    { icon: 'purse', label: '累计利润', value: `${Math.round(st.profit).toLocaleString()} 金` },
    { icon: 'anchor', label: '到达港口', value: `${state.visited.length} 座` },
    { icon: 'trophy', label: '击败海盗', value: `${st.raidsWon ?? 0} 次` },
    { icon: 'amphora', label: '深海秘藏', value: `${st.treasures ?? 0} 处` },
    { icon: 'rank', label: '全球排名', value: rk ? `第 ${rk} 名` : '—' },
  ]

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.66)', zIndex: 9997 }}
      onClick={() => dispatch({ type: 'CLOSE_VICTORY' })}
    >
      <div
        className="panel-white p-5 flex flex-col"
        style={{ borderRadius: 20, width: '100%', maxWidth: 340 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-1">
          <span className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-2" style={{ background: '#fff3c4' }}>
            <Glyph name="crown" size={30} color="#d99b1f" />
          </span>
          <div className="font-900 text-xl" style={{ color: '#3d2b10' }}>加冕「{LEGEND_TITLE}」</div>
          <div className="text-xs mt-1" style={{ color: '#a07030' }}>你集齐了全部传奇功勋，纵横七海的传奇就此写就！</div>
        </div>

        <div className="grid grid-cols-2 gap-2 my-3">
          {rows.map(r => (
            <div key={r.label} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: '#fff8f0' }}>
              <Glyph name={r.icon as never} size={18} color="#c98a30" />
              <div className="min-w-0">
                <div className="text-[10px]" style={{ color: '#a07030' }}>{r.label}</div>
                <div className="font-900 text-xs truncate" style={{ color: '#3d2b10' }}>{r.value}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn-orange w-full py-2.5 text-sm font-900"
          style={{ borderRadius: 12 }}
          onClick={() => dispatch({ type: 'CLOSE_VICTORY' })}
        >
          继续我的贸易帝国
        </button>
      </div>
    </div>
  )
}
