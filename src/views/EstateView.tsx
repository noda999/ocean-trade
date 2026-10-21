import { CITIES, CITY_BY_ID, HOUSES, HOUSE_BONUS_PER_LEVEL, HOUSE_COSTS, HOUSE_STAGE_NAMES } from '../game/data'
import { houseBonusOf, houseLevelOf } from '../game/state'
import { useGame } from '../game/store'
import { Glyph } from '../components/Glyph'

// ─────────────────────────────────────────────────────────────────────────────
//  行馆（v1.6）：在每座港口置办宅邸——长期金币消耗口，按地区特色设计房屋，
//  拥有即永久降低该城交易税费、提升买卖收益；集齐七海别具收藏之乐。
//  宅邸配图采用之前 AI 生成的各港口地区风光图（/icons/<cityId>.png）。
// ─────────────────────────────────────────────────────────────────────────────

export default function EstateView() {
  const { state, dispatch } = useGame()
  const owned = Object.keys(state.houses).filter(k => (state.houses[k] ?? 0) > 0).length
  const total = CITIES.length
  const curId = state.cityId
  const curDef = HOUSES[curId]
  const curLv = houseLevelOf(state, curId)
  const curMaxed = curLv >= HOUSE_STAGE_NAMES.length
  const curCost = HOUSE_COSTS[curLv]
  const curBonus = houseBonusOf(state, curId)
  const curCan = !curMaxed && state.money >= curCost

  // 图片加载失败时优雅隐藏，避免破图
  const hideImg = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none' }

  return (
    <>
      {/* 概览 */}
      <div className="panel-orange p-4 mb-4" style={{ borderRadius: 18 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.22)' }}>
            <Glyph name="city" size={30} color="#fff" />
          </div>
          <div className="flex-1">
            <div className="text-xs opacity-85">七海基业</div>
            <div className="font-900 text-xl">{owned} / {total} 处宅邸</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-85">金币</div>
            <div className="font-900 text-sm">{Math.floor(state.money).toLocaleString()}</div>
          </div>
        </div>
        <div className="text-[11px] opacity-85">
          在每座港口置办宅邸，可永久降低该城交易税费、提升买卖收益；宅邸按当地风土设计，集齐七海别具收藏之乐。
        </div>
      </div>

      {/* 当前港宅邸 —— 左图右文：方形地区图 1:1 完整显示，不裁切构图 */}
      <div className="panel-white p-3 mb-4 flex items-center gap-3" style={{ borderRadius: 16, borderLeft: '4px solid #c9a24b' }}>
        <img
          src={`./icons/${curId}.png`}
          alt={curDef.base}
          className="w-28 h-28 rounded-xl object-cover flex-shrink-0"
          style={{ border: '1px solid rgba(0,0,0,.06)' }}
          onError={hideImg}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="font-900 text-base" style={{ color: '#3d2b10' }}>{CITY_BY_ID[curId].name} · {curDef.base}</span>
            {curLv > 0 && (
              <span className="text-[10px] font-800 px-1.5 py-0.5 rounded-md" style={{ background: '#e8f4ff', color: '#2f7cb8' }}>
                {HOUSE_STAGE_NAMES[curLv - 1]}
              </span>
            )}
          </div>
          <div className="text-xs mb-2" style={{ color: '#a07030' }}>{curDef.desc}</div>
          {curLv > 0 && (
            <div className="flex gap-2 mb-2">
              <span className="text-[10px] font-800 px-1.5 py-0.5 rounded-md" style={{ background: '#e8f4ff', color: '#2f7cb8' }}>买入 -{curBonus.buy}%</span>
              <span className="text-[10px] font-800 px-1.5 py-0.5 rounded-md" style={{ background: '#fff4dd', color: '#c07a1a' }}>卖出 +{curBonus.sell}%</span>
            </div>
          )}
          {curMaxed ? (
            <div className="text-center py-2 text-sm font-800 rounded-xl" style={{ background: '#f5eee0', color: '#a07030' }}>府邸已成，无可扩建</div>
          ) : (
            <button
              className="btn-orange w-full py-2 text-sm font-900"
              style={{ opacity: curCan ? 1 : 0.55 }}
              onClick={() => dispatch({ type: 'BUY_HOUSE', cityId: curId })}
            >
              <span className="inline-flex items-center gap-1.5 justify-center">
                <Glyph name="city" size={15} />{curLv === 0 ? '购置' : '扩建'} · {curCost.toLocaleString()} 金
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 宅邸图鉴（收藏） */}
      <div className="text-xs font-800 mb-2" style={{ color: '#a07030' }}>七海宅邸图鉴</div>
      <div className="flex flex-col gap-2">
        {CITIES.map(c => {
          const def = HOUSES[c.id]
          const lv = houseLevelOf(state, c.id)
          const here = c.id === curId
          return (
            <div
              key={c.id}
              className="panel-white p-3 flex items-center gap-3"
              style={{ borderRadius: 14, opacity: lv > 0 || here ? 1 : 0.62, borderLeft: `4px solid ${here ? '#c9a24b' : '#e5d6b8'}` }}
            >
              <img
                src={`./icons/${c.id}.png`}
                alt={def.base}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                style={{ border: '1px solid rgba(0,0,0,.06)' }}
                onError={hideImg}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>{c.name} · {def.base}</span>
                  {lv > 0 && (
                    <span className="text-[10px] font-800 px-1.5 py-0.5 rounded-md" style={{ background: '#e8f4ff', color: '#2f7cb8' }}>
                      {HOUSE_STAGE_NAMES[lv - 1]}
                    </span>
                  )}
                  {here && (
                    <span className="text-[10px] font-700 px-1.5 py-0.5 rounded-md" style={{ background: '#e6f6e9', color: '#3a9a58' }}>本港</span>
                  )}
                </div>
                <div className="text-[11px] mt-0.5 truncate" style={{ color: '#a07030' }}>{def.desc}</div>
              </div>
              {lv > 0 && (
                <span className="text-[10px] font-800 px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ background: '#fff4dd', color: '#c07a1a' }}>
                  +{lv * HOUSE_BONUS_PER_LEVEL}%
                </span>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
