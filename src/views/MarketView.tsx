import { useEffect, useState } from 'react'
import { CITIES, CITY_BY_ID, CITY_EVENT_INFO, GOOD_BY_ID, SECRET_OF_CITY, isSecretGood, repTierName } from '../game/data'
import {
  anchorPrice, bestSellHint, cargoUnits, eventBuyMult, eventSellMult, isBlockaded, isScarce, sellPrice,
} from '../game/engine'
import { cityEventOf, investBonusOf, repBonusOf, repOf, secretUnlocked, shipNow } from '../game/state'
import { useGame } from '../game/store'
import { CityLandmark } from '../components/Landmarks'
import BankView from './BankView'
import { Glyph } from '../components/Glyph'
import { ArtIcon } from '../components/ArtIcon'
import { audio } from '../game/audio'

// ─────────────────────────────────────────────────────────────────────────────
// 市场页（v1.4.1）：sticky 头部从 ~320px 砍到 ~56px（一行），其余面板进滚动流
// 解决"小屏手机 / 小红书容器里商品被挡到看不见"的问题。
// 默认折叠 港口情报 / 切港 chips / 商情快报（按需展开），保证所有手机首屏可见货物。
// ─────────────────────────────────────────────────────────────────────────────

export default function MarketView() {
  const { state, dispatch } = useGame()
  const [open, setOpen] = useState<string | null>(null)
  const [qty, setQty] = useState(10)
  const [viewCityId, setViewCityId] = useState(state.cityId)
  // 默认折叠：减少首屏占用，按需展开
  const [showDetail, setShowDetail] = useState(false)
  const [showCities, setShowCities] = useState(false)
  const [showNews, setShowNews] = useState(false)

  // 派生量必须先于 useEffect 声明 —— effect deps 是同步求值的数组字面量，
  // 若 cm 等在后面声明会被 ESBuild minify 后暴露成 TDZ（ReferenceError）。
  const ship = shipNow(state)
  const city = CITY_BY_ID[viewCityId]
  const cm = state.markets[viewCityId]
  const here = viewCityId === state.cityId
  const held = cargoUnits(state.cargo)
  const room = ship.cap - held
  const sailing = state.voyage
  // 商情事件（v1.3.0）：封锁中本港禁止交易
  const viewEv = cityEventOf(state, viewCityId)
  const viewBlockaded = isBlockaded(viewEv)
  const canTrade = here && !sailing && !viewBlockaded
  const investBonus = here ? investBonusOf(state, viewCityId) : { buy: 0, sell: 0, dividend: 0 }
  const repDisc = repBonusOf(state, viewCityId)
  // 快报只播报已探明港口（未探明的行情需先买情报网络或亲自到访）
  const newsList = Object.entries(state.cityEvents)
    .filter(([cid, ev]) => ev.until > state.clock && (state.intelOwned || state.visited.includes(cid)))
    .sort((a, b) => a[1].until - b[1].until)
  const knownCities = CITIES.filter(c => state.intelOwned || state.visited.includes(c.id))

  // 自动夹住 qty：市场刷新或货舱变化导致可用上限缩小时，UI 数量跟着缩
  useEffect(() => {
    if (!open) return
    const m = cm?.[open]
    if (!m) return
    const maxRoom = Math.max(0, Math.min(room, m.stock))
    if (qty > maxRoom) setQty(Math.max(1, maxRoom))
  }, [open, cm, room, qty])

  // 抵达新港口时自动切回本港
  useEffect(() => { setViewCityId(state.cityId) }, [state.cityId])

  // 每个港口只经营自己的特产 + 紧缺货，其余不挂牌；
  // 隐藏特产（v1.4.0）在本港投资 ≥ 1 级解锁后才挂牌
  const secretId = SECRET_OF_CITY[city.id]
  const unlockedHere = secretUnlocked(state, city.id)
  const tradedIds = [
    ...city.exports.filter(id => id !== secretId || unlockedHere),
    ...city.imports.filter(x => !city.exports.includes(x)),
  ]

  /** 是否掌握该城市实时行情 */
  const isKnown = (cid: string) => state.intelOwned || state.visited.includes(cid)

  const refreshIn = Math.ceil(state.marketTimer)

  function trade(goodId: string, kind: 'BUY' | 'SELL', max: number) {
    if (!canTrade) return
    const m = cm?.[goodId]
    if (!m) return
    // 统一数值校验：禁止 NaN / 负数 / 小数；并按当前行情（最新 m.stock / 货舱余量 / 金钱）
    // 夹紧，防止市场刷新后用陈旧的 qty state 提交超出上限的请求
    let cap = max
    if (kind === 'BUY') {
      const afford = Math.max(0, Math.floor(state.money / m.price))
      cap = Math.min(cap, m.stock, afford, room)
    } else {
      const held = state.cargo[goodId]?.qty ?? 0
      cap = Math.min(cap, held)
    }
    const n = Math.max(0, Math.min(Math.floor(Number.isFinite(qty) ? qty : 0), Math.max(1, cap)))
    audio.sfx(kind === 'BUY' ? 'buy' : 'sell')
    dispatch({ type: kind, goodId, qty: n })
  }

  return (
    <div className="absolute inset-0 overflow-auto" style={{ background: '#f8f0e0' }}>
      {/* ── 1. sticky 头部（v1.4.1：精简到 ~56px）──────────────────────────── */}
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2 flex items-center gap-2" style={{ background: '#f8f0e0' }}>
        <div className="w-10 h-10 rounded-xl flex items-end justify-center flex-shrink-0" style={{ background: '#fff5ec', overflow: 'hidden' }}>
          <div style={{ marginBottom: -4 }}>
            <CityLandmark id={city.id} size={36} forceSvg />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-900 text-base truncate" style={{ color: '#3d2b10' }}>{city.name} 市场</span>
            {here
              ? <span className="badge-green">本港</span>
              : <span className="badge-orange">查看</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-800 flex-shrink-0">
          <span className="inline-flex items-center gap-1" style={{ color: '#a07030' }}>
            <Glyph name="hourglass" size={13} /><b style={{ color: '#e05050' }}>{refreshIn}s</b>
          </span>
          <span className="inline-flex items-center gap-1" style={{ color: '#a07030' }}>
            <Glyph name="coin" size={13} /><b style={{ color: '#3d2b10' }}>{Math.floor(state.money).toLocaleString()}</b>
          </span>
        </div>
      </div>

      {/* ── 2. 货舱（非 sticky，随时可见）───────────────────────────────────── */}
      <div className="px-4 pb-2">
        <div className="panel-white p-2.5" style={{ borderRadius: 14 }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-700" style={{ color: '#3d2b10' }}>货舱 {held}/{ship.cap}</span>
            <span className="text-xs ml-auto" style={{ color: '#a07030' }}>{ship.name} · 利润 +{ship.bonus}%</span>
          </div>
          <div className="prog-track h-2.5">
            <div className="prog-fill" style={{ width: `${(held / ship.cap) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ── 3. 港口情报（特产 / 隐藏特产 / 声望 / 投资 / 商情）—— 默认折叠 */}
      <div className="px-4 pb-2">
        <button
          className="w-full text-left text-xs font-800 flex items-center gap-1 px-3 py-2 rounded-xl"
          style={{ background: '#fff5ec', color: '#a07030' }}
          onClick={() => setShowDetail(d => !d)}
        >
          <span>{showDetail ? '▲' : '▼'}</span>
          <span className="inline-flex items-center gap-1"><Glyph name="bars" size={13} />港口情报</span>
          {secretId && !unlockedHere && (
            <span className="inline-flex items-center gap-1" style={{ color: '#c05050' }}>· <Glyph name="lock" size={11} />隐藏特产</span>
          )}
          {investBonus.buy > 0 && (
            <span className="inline-flex items-center gap-1" style={{ color: '#3a8a52' }}>· <Glyph name="hall" size={11} />-{investBonus.buy}%</span>
          )}
          {repDisc > 0 && (
            <span className="inline-flex items-center gap-1" style={{ color: '#a06a10' }}>· <Glyph name="exchange" size={11} />-{repDisc}%</span>
          )}
          {newsList.length > 0 && (
            <span className="inline-flex items-center gap-1" style={{ color: '#e05050' }}>· <Glyph name="horn" size={11} />{newsList.length}</span>
          )}
          <span className="ml-auto" style={{ color: '#c0a070' }}>{showDetail ? '收起' : '展开'}</span>
        </button>
        {showDetail && (
          <div className="panel-white mt-1.5 p-2.5" style={{ borderRadius: 12 }}>
            <div className="text-xs" style={{ color: '#a07030' }}>
              特产 <b style={{ color: '#4cba6a' }}>
                {city.exports.filter(g => g !== secretId || unlockedHere).map(g => GOOD_BY_ID[g].name).join('·')}
              </b>
              {' · '}行情 <b style={{ color: '#e05050' }}>{refreshIn}s</b> 后刷新
            </div>
            {secretId && !unlockedHere && (
              <div className="text-xs font-800 mt-1 inline-flex items-center gap-1" style={{ color: '#b07830' }}>
                <Glyph name="lock" size={12} />传闻本地还藏着一件「{GOOD_BY_ID[secretId].name}」…投资 1 级「商会伙伴」即可解锁
              </div>
            )}
            <div className="text-xs mt-1 flex items-center gap-1.5 flex-wrap" style={{ color: '#8a6a40' }}>
              <span className="inline-flex items-center gap-1">
                <Glyph name="exchange" size={12} />声望 <b style={{ color: '#a06a10' }}>{repTierName(repOf(state, viewCityId))}</b>（{repOf(state, viewCityId)}）
              </span>
              {repDisc > 0 && (
                <span className="px-1.5 py-0.5 rounded-md font-800" style={{ background: '#fff3d6', color: '#a06a10', fontSize: 10 }}>
                  本港买入 -{repDisc}% · 卖出 +{repDisc}%
                </span>
              )}
              {investBonus.buy > 0 && (
                <span className="px-1.5 py-0.5 rounded-md font-800 inline-flex items-center gap-1" style={{ background: '#e8f7ec', color: '#3a8a52', fontSize: 10 }}>
                  <Glyph name="hall" size={11} />投资 -{investBonus.buy}% / +{investBonus.sell}%
                </span>
              )}
            </div>
            {newsList.length > 0 && (
              <div className="mt-2 pt-2" style={{ borderTop: '1.5px dashed #f0e2c8' }}>
                <div className="text-xs font-800 mb-1.5 inline-flex items-center gap-1" style={{ color: '#3d2b10' }}>
                  <Glyph name="horn" size={13} />商情快报（{newsList.length}）
                </div>
                <div className="flex gap-2 overflow-x-auto pb-0.5">
                  {newsList.map(([cid, ev]) => {
                    const info = CITY_EVENT_INFO[ev.kind]
                    const isHere = cid === viewCityId
                    const bad = ev.kind === 'blockade'
                    return (
                      <div
                        key={cid}
                        className="flex-shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-800"
                        style={{
                          background: isHere ? (bad ? '#fdeaea' : '#e8f7ec') : '#fff5ec',
                          border: isHere ? `1.5px solid ${bad ? '#e05050' : '#4cba6a'}` : '1.5px dashed #f0e2c8',
                          color: '#8a6a40',
                        }}
                      >
                        <span className="inline-flex items-center gap-1"><Glyph name={info.icon} size={12} />{CITY_BY_ID[cid].name}</span>
                        {isHere && <b style={{ color: bad ? '#e05050' : '#4cba6a' }}>（本港）</b>}
                        {ev.goodId ? ` ${GOOD_BY_ID[ev.goodId].name}` : ''}
                        {' · '}{Math.ceil(ev.until - state.clock)}s
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 4. 港口银行（v1.4.0）：默认折叠成一行 ─────────────────────────── */}
      {here && (
        <div className="px-4 pb-2">
          <BankView />
        </div>
      )}

      {/* ── 5. 切港 chips（默认折叠成一行，展开 flex-wrap）────────────────── */}
      <div className="px-4 pb-2">
        <button
          className="w-full text-left text-xs font-800 flex items-center gap-1 px-3 py-2 rounded-xl"
          style={{ background: '#fff5ec', color: '#a07030' }}
          onClick={() => setShowCities(s => !s)}
        >
          <span>{showCities ? '▲' : '▼'}</span>
          <span className="inline-flex items-center gap-1"><Glyph name="pin" size={13} />切港</span>
          <span style={{ color: '#c0a070' }}>已知 {knownCities.length} / {CITIES.length}</span>
          <span className="ml-auto" style={{ color: '#c0a070' }}>{showCities ? '收起' : '展开'}</span>
        </button>
        {showCities && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {CITIES.map(c => {
              const known = isKnown(c.id)
              const isCurrentPort = c.id === state.cityId
              const viewing = c.id === viewCityId
              return (
                <button
                  key={c.id}
                  disabled={!known}
                  onClick={() => known && setViewCityId(c.id)}
                  className="px-2.5 py-1 text-xs font-800 rounded-full"
                  style={viewing
                    ? { background: '#f5913a', color: 'white', boxShadow: '0 2px 6px rgba(245,145,58,0.4)' }
                    : known
                      ? { background: 'white', color: '#a07030', border: '1.5px solid #f5c87a' }
                      : { background: '#f4eee1', color: '#b8ab94', border: '1.5px dashed #ddd0b8' }}
                >
                  {isCurrentPort && <Glyph name="pin" size={12} style={{ marginRight: 2 }} />}
                  {c.name}
                  {!known && <span style={{ marginLeft: 4, fontSize: 9 }}>未探明</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── 6. 本港封锁横幅 ─────────────────────────────────────────────── */}
      {here && viewBlockaded && (
        <div className="px-4 pb-2">
          <div className="panel-white px-3 py-2 flex items-center gap-2 text-xs font-800" style={{ borderRadius: 14, border: '1.5px solid #e05050', color: '#c05050' }}>
            <span className="inline-flex items-center gap-1.5"><Glyph name="barrier" size={14} />{city.name}瘟疫封锁中，暂时无法交易（约 {Math.ceil((viewEv?.until ?? 0) - state.clock)} 秒后解除）</span>
          </div>
        </div>
      )}

      {/* ── 7. 异港查看提示 ─────────────────────────────────────────────── */}
      {!here && (
        <div className="px-4 pb-2">
          <div className="panel-cream px-3 py-2 flex items-center gap-2 text-xs font-800" style={{ color: '#8a6a40' }}>
            <span className="inline-flex items-center gap-1.5"><Glyph name="search" size={14} />正在查看 <b style={{ color: '#3d2b10' }}>{city.name}</b> 行情</span>
            <button
              className="btn-ghost-orange ml-auto px-2.5 py-1 text-xs"
              style={{ borderRadius: 10 }}
              onClick={() => setViewCityId(state.cityId)}
            >
              回到本港
            </button>
          </div>
        </div>
      )}

      {/* ── 8. 航行 / 仅查看提示（顶部）──────────────────────────────────── */}
      {sailing && (
        <div className="px-4 pb-2">
          <div className="panel-orange px-3 py-2 text-xs font-800 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5"><Glyph name="ban" size={14} />航行途中无法交易，抵达 {CITY_BY_ID[sailing.to].name} 后即可开市</span>
          </div>
        </div>
      )}
      {!sailing && !here && (
        <div className="px-4 pb-2">
          <div className="panel-orange px-3 py-2 text-xs font-800 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5"><Glyph name="ban" size={14} />只能在停靠的港口交易，此处仅可查看行情比价</span>
          </div>
        </div>
      )}

      {/* ── 9. 货物列表（玩家最关心的内容，紧跟辅助面板之后）─────────────── */}
      <div className="px-4 pb-6 flex flex-col gap-2">
        {tradedIds.map(id => {
          const g = GOOD_BY_ID[id]
          const m = cm[g.id]
          const anchor = anchorPrice(city, g)
          const ratio = m.price / anchor
          const scarce = isScarce(m)
          const isExport = city.exports.includes(g.id)
          const isImport = city.imports.includes(g.id)
          const mine = state.cargo[g.id]
          const best = bestSellHint(g.id, state.markets, ship.bonus, isKnown, state.cityId)
          const buyMult = eventBuyMult(viewEv, g.id)
          const sellMult = eventSellMult(viewEv, g.id)
          // 显示价 = 真实结算价：含丰产/抢购、声望与投资折扣
          const buyUnit = Math.max(8, Math.round(m.price * buyMult * (1 - repDisc / 100) * (1 - investBonus.buy / 100)))
          const unit = Math.round(sellPrice(g, cm, ship.bonus + repDisc + investBonus.sell) * sellMult)
          const margin = Math.round(((best.price - m.price) / m.price) * 100)
          const expanded = open === g.id
          const roomUse = Math.max(0, Math.min(room, m.stock))

          return (
            <div key={g.id} className="panel-white" style={{ borderRadius: 14, overflow: 'hidden' }}>
              <div
                className="p-3 cursor-pointer"
                onClick={() => { setOpen(expanded ? null : g.id); setQty(10) }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F7F0E1' }}>
                    <ArtIcon name={g.icon} size={38} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className="font-800 text-sm" style={{ color: '#3d2b10' }}>{g.name}</span>
                      {isExport && <span className="badge-green">特产</span>}
                      {isExport && isSecretGood(g.id) && (
                        <span className="px-1.5 py-0.5 rounded-md font-800 text-[10px]" style={{ background: '#f3e8ff', color: '#8a4fc9' }}>隐藏特产</span>
                      )}
                      {g.id === 'relic' && <span className="px-1.5 py-0.5 rounded-md font-800 text-[10px]" style={{ background: '#f3e8ff', color: '#8a4fc9' }}>秘藏</span>}
                      {isImport && <span className="badge-orange">紧缺</span>}
                      {scarce && <span className="badge-red">行情暴涨</span>}
                      {buyMult < 1 && <span className="badge-green inline-flex items-center gap-1"><Glyph name="wheat" size={11} />丰产 -45%</span>}
                      {sellMult > 1 && viewEv?.kind !== 'festival' && <span className="badge-red inline-flex items-center gap-1"><Glyph name="flame" size={11} />抢购 ×2.2</span>}
                      {viewEv?.kind === 'festival' && <span className="badge-red inline-flex items-center gap-1"><Glyph name="mask" size={11} />节庆 ×1.8</span>}
                      {m.momentum > 0.02 && <span className="text-xs" style={{ color: '#4cba6a' }}>▲</span>}
                      {m.momentum < -0.02 && <span className="text-xs" style={{ color: '#e05050' }}>▼</span>}
                    </div>
                    <div className="flex gap-2 text-xs flex-wrap" style={{ color: '#a07030' }}>
                      <span>均价 <b style={{ color: '#8a6a40' }}>{anchor}</b></span>
                      <span>
                        性价比
                        <b style={{ color: ratio < 0.9 ? '#4cba6a' : ratio > 1.25 ? '#e05050' : '#8a6a40' }}>
                          {ratio < 0.9 ? ' 划算' : ratio > 1.25 ? ' 偏贵' : ' 持平'}
                        </b>
                      </span>
                      <span>库存 <b style={{ color: '#8a6a40' }}>{m.stock}</b></span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-900 text-base" style={{ color: '#f5913a' }}>{buyUnit}</div>
                    <div className="text-xs" style={{ color: '#a07030' }}>金/件</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: '1.5px dashed #f0e2c8' }}>
                  {mine ? (
                    <span className="text-xs font-700" style={{ color: '#4cba6a' }}>货舱中 {mine.qty} · 成本 {(mine.cost / mine.qty).toFixed(0)}/件</span>
                  ) : (
                    <span className="text-xs" style={{ color: '#c0a070' }}>未持有</span>
                  )}
                  <span className="ml-auto text-xs" style={{ color: '#a07030' }}>
                    销往 <b style={{ color: '#3d2b10' }}>{best.city.name}</b>
                    {best.estimated && <span className="est-tag">预估</span>}
                    {' '}可卖 <b style={{ color: '#4cba6a' }}>{best.price}</b>
                    <b style={{ color: margin > 0 ? '#4cba6a' : '#e05050' }}> ({margin > 0 ? '+' : ''}{margin}%)</b>
                  </span>
                </div>
              </div>

              {expanded && (
                <div className="px-3 pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-700" style={{ color: '#8a6a40' }}>数量</span>
                    <div className="flex items-center gap-1.5 ml-auto">
                      {[1, 10, 50].map(n => (
                        <button
                          key={n}
                          onClick={() => setQty(n)}
                          className="text-xs font-800 px-2.5 py-1 rounded-lg"
                          style={qty === n
                            ? { background: '#f5913a', color: 'white' }
                            : { background: '#fff5ec', color: '#a07030' }}
                        >{n}</button>
                      ))}
                      <button
                        onClick={() => setQty(Math.max(1, isImport
                          ? (mine?.qty ?? 0)
                          : Math.min(roomUse, Math.floor(state.money / buyUnit))))}
                        className="text-xs font-800 px-2.5 py-1 rounded-lg"
                        style={{ background: '#fff5ec', color: '#a07030' }}
                      >MAX</button>
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          className="w-6 h-6 rounded-lg text-sm font-900"
                          style={{ background: '#f8f0e0', color: '#8a6a40' }}
                          onClick={() => setQty(q => Math.max(1, q - 5))}
                        >−</button>
                        <span className="w-9 text-center text-sm font-900" style={{ color: '#3d2b10' }}>{qty}</span>
                        <button
                          className="w-6 h-6 rounded-lg text-sm font-900"
                          style={{ background: '#f8f0e0', color: '#8a6a40' }}
                          onClick={() => setQty(q => q + 5)}
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: '#8a6a40' }}>
                    {isImport
                      ? <span style={{ color: '#c9b394' }}>本港不卖（销地）</span>
                      : <span>买入需 <b style={{ color: '#3d2b10' }}>{(Math.min(qty, roomUse) * buyUnit).toLocaleString()}</b> 金</span>}
                    <span className="ml-auto">
                      {isExport
                        ? <span style={{ color: '#c9b394' }}>本港不买（产地）</span>
                        : <>卖出得 <b style={{ color: '#4cba6a' }}>{(Math.min(qty, mine?.qty ?? 0) * unit).toLocaleString()}</b> 金</>}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* 产地（特产）：本港只卖不买 → 玩家只能买入（本港不买自己产的货） */}
                    {!isImport && (
                      <button
                        className="btn-green flex-1 py-2.5 text-sm"
                        disabled={!canTrade || roomUse <= 0 || m.stock <= 0}
                        style={{ opacity: !canTrade || roomUse <= 0 || m.stock <= 0 ? 0.45 : 1 }}
                        onClick={() => trade(g.id, 'BUY', roomUse)}
                      >
                        <span className="inline-flex items-center gap-1.5 justify-center"><Glyph name="loadIn" size={15} />买入 {Math.min(qty, roomUse)}</span>
                      </button>
                    )}
                    {/* 销地（紧缺）：本港只买不卖 → 玩家只能卖出，且本港买价高 */}
                    {!isExport && (
                      <button
                        className="btn-red flex-1 py-2.5 text-sm"
                        disabled={!canTrade || !mine || (mine?.qty ?? 0) <= 0}
                        style={{ opacity: !canTrade || !mine || (mine?.qty ?? 0) <= 0 ? 0.45 : 1 }}
                        onClick={() => trade(g.id, 'SELL', mine?.qty ?? 0)}
                      >
                        <span className="inline-flex items-center gap-1.5 justify-center"><Glyph name="loadOut" size={15} />卖出 {Math.min(qty, mine?.qty ?? 0)}</span>
                      </button>
                    )}
                  </div>

                  {/* 规则提示：同一种货，本港只卖不买（产地）或只买不卖（销地） */}
                  {(isExport || isImport) && (
                    <div
                      className="mt-2 py-2 text-xs text-center rounded-xl"
                      style={{ background: '#fff5ec', color: '#a07030', border: '1.5px dashed #f0e2c8' }}
                    >
                      {isExport && !isImport && <span className="inline-flex items-center gap-1 justify-center"><Glyph name="factory" size={13} />产地：本港只卖不买 —— 你只买不卖（特产＝买价低）</span>}
                      {isImport && !isExport && <span className="inline-flex items-center gap-1 justify-center"><Glyph name="ship" size={13} />销地：本港只买不卖 —— 你只卖不买（紧缺＝卖价高）</span>}
                      {isExport && isImport && <span className="inline-flex items-center gap-1 justify-center"><Glyph name="anchor" size={13} />本港既产也销：仅供查看</span>}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        <div className="text-xs text-center mt-1 mb-1" style={{ color: '#c0a070' }}>
          本港只经营 {tradedIds.length} 种货物 · 规则：产地买特产、销地卖紧缺（缺口货物）
        </div>

        {held > 0 && (
          <button
            className="btn-orange w-full py-3 text-base font-900 mt-1"
            style={{ borderRadius: 16, opacity: canTrade ? 1 : 0.45 }}
            disabled={!canTrade}
            onClick={() => dispatch({ type: 'SELL_ALL' })}
          >
            <span className="inline-flex items-center gap-1.5 justify-center"><Glyph name="purse" size={17} />一键全部卖出（{held} 件）</span>
          </button>
        )}
      </div>
    </div>
  )
}