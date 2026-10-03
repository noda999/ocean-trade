import { useGame } from '../game/store'
import { supplyCount } from '../game/state'
import { Glyph } from './Glyph'

/** 海盗遭遇抉择弹窗（v1.5）：航行中遇到海盗暂停模拟，玩家三选一应对 */
export default function PirateModal() {
  const { state, dispatch } = useGame()
  if (!state.pendingEvent) return null
  const cannon = supplyCount(state, 's_cannon')

  const choose = (choice: 'cannon' | 'bribe' | 'fight') =>
    dispatch({ type: 'RESOLVE_PIRATE', choice })

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.6)', zIndex: 9998 }}
    >
      <div className="panel-white p-5 flex flex-col" style={{ borderRadius: 18, width: '100%', maxWidth: 340 }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fdeaea' }}>
            <Glyph name="pirate" size={24} color="#c05050" />
          </span>
          <div className="font-900 text-lg" style={{ color: '#3d2b10' }}>海盗来袭！</div>
        </div>
        <div className="text-xs mb-3 leading-relaxed" style={{ color: '#8a6a40' }}>
          海平线上窜出一艘海盗船，拦住了你的去路。你船上有
          <b style={{ color: '#3d2b10' }}> 舰炮组 ×{cannon}</b>，如何应付？
        </div>

        <div className="flex flex-col gap-2">
          <button
            className="w-full py-2.5 text-sm font-900 rounded-xl inline-flex items-center justify-center gap-1.5"
            style={{ background: cannon > 0 ? '#4cba6a' : '#d8d2c4', color: '#fff' }}
            disabled={cannon <= 0}
            onClick={() => choose('cannon')}
          >
            <Glyph name="target" size={15} />舰炮迎战（消耗舰炮组 ×1，必胜缴获战利品）
          </button>
          <button
            className="w-full py-2.5 text-sm font-900 rounded-xl inline-flex items-center justify-center gap-1.5"
            style={{ background: '#f5913a', color: '#fff' }}
            onClick={() => choose('bribe')}
          >
            <Glyph name="coin" size={15} />破财消灾（缴过路费，货物无损）
          </button>
          <button
            className="w-full py-2.5 text-sm font-800 rounded-xl inline-flex items-center justify-center gap-1.5"
            style={{ background: '#fff5ec', color: '#a07030' }}
            onClick={() => choose('fight')}
          >
            <Glyph name="sword" size={15} />硬拼突围（不耗补给，五五开可能丢货）
          </button>
        </div>
      </div>
    </div>
  )
}
