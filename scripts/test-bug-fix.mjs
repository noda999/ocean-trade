// v1.0.2 回归测试
import { initialState, reducer } from '../src/game/state.ts'
import { createMarkets, bestSellHint } from '../src/game/engine.ts'
import { CITIES, CITY_BY_ID, GOODS } from '../src/game/data.ts'

let pass = 0, fail = 0
function check(ok, label, detail) {
  if (ok) { pass++; console.log('PASS', label, detail || '') }
  else { fail++; console.log('FAIL', label, detail || '') }
}

// 1) BUY 数值校验：qty=100, stock=20 -> 只买 20
{
  // 找一座有"非特产非紧缺"普通货的城市
  const neutralCity = CITIES.find(c => Object.keys(c.exports).length > 0 && GOODS.some(g => !c.exports.includes(g.id) && !c.imports.includes(g.id) && false))
  // 直接造一个：把任何城市的 markets 调整成非特产非紧缺的货
  let s = initialState()
  const cn = s.cityId
  // 直接拿 GOODS[2]（假设它不是挪威特产/紧缺）；并手动让 BUY 通过
  const target = GOODS.find(g => !CITY_BY_ID[cn].exports.includes(g.id) && !CITY_BY_ID[cn].imports.includes(g.id))
  if (!target) {
    // 把 cn 的 cityId 切到一个有中性货的城市
    const alt = CITIES.find(c => GOODS.some(g => !c.exports.includes(g.id) && !c.imports.includes(g.id)))
    s = { ...s, cityId: alt.id, markets: { ...s.markets, [alt.id]: { ...s.markets[alt.id] } } }
  }
  const city2 = CITY_BY_ID[s.cityId]
  const tgt = GOODS.find(g => !city2.exports.includes(g.id) && !city2.imports.includes(g.id))
  if (!tgt) {
    check(false, '1) BUY stock clamp', 'no neutral good available in any city')
  } else {
    // 把这种货添加到本港市场（手动注入）
    s = { ...s, markets: { ...s.markets, [s.cityId]: { ...s.markets[s.cityId], [tgt.id]: { price: 100, stock: 20, momentum: 0, spike: 0 } } } }
    const before = s.cargo[tgt.id]?.qty ?? 0
    const r = reducer(s, { type: 'BUY', goodId: tgt.id, qty: 100 })
    const bought = (r.cargo[tgt.id]?.qty ?? 0) - before
    check(bought === 20, '1) BUY stock clamp: qty=100 stock=20 -> 20', 'bought=' + bought)
  }
}

// 2) BUY NaN -> noop
{
  let s = initialState()
  const cn = s.cityId
  const target = Object.keys(s.markets[cn])[0]
  const before = { money: s.money, q: s.cargo[target]?.qty ?? 0 }
  const r = reducer(s, { type: 'BUY', goodId: target, qty: NaN })
  check(r.money === before.money && (r.cargo[target]?.qty ?? 0) === before.q, '2) BUY NaN noop', '')
}

// 3) BUY negative -> noop
{
  let s = initialState()
  const cn = s.cityId
  const target = Object.keys(s.markets[cn])[0]
  const before = s.money
  const r = reducer(s, { type: 'BUY', goodId: target, qty: -50 })
  check(r.money === before, '3) BUY negative noop', 'money unchanged=' + (r.money === before))
}

// 4) SELL in export city -> blocked
{
  let s = initialState()
  const exportCity = CITIES.find(c => c.exports.length > 0)
  if (!exportCity) { check(false, '4) SELL export block', 'no export city') }
  else {
    const gid = exportCity.exports[0]
    s = { ...s, cityId: exportCity.id, cargo: { ...s.cargo, [gid]: { qty: 50, cost: 5000 } } }
    const before = s.cargo[gid].qty
    const r = reducer(s, { type: 'SELL', goodId: gid, qty: 10 })
    check(r.cargo[gid].qty === before, '4) SELL export city block: cargo unchanged', 'qty=' + r.cargo[gid].qty + ' expected=' + before)
  }
}

// 5) SELL in import city -> blocked
{
  let s = initialState()
  const importCity = CITIES.find(c => c.imports.length > 0)
  if (!importCity) { check(false, '5) SELL import block', 'no import city') }
  else {
    const gid = importCity.imports[0]
    s = { ...s, cityId: importCity.id, cargo: { ...s.cargo, [gid]: { qty: 50, cost: 5000 } } }
    const before = s.cargo[gid].qty
    const r = reducer(s, { type: 'SELL', goodId: gid, qty: 10 })
    check(r.cargo[gid].qty === before, '5) SELL import city block: cargo unchanged', 'qty=' + r.cargo[gid].qty + ' expected=' + before)
  }
}

// 6) SELL_ALL in export city -> blocked
{
  let s = initialState()
  const exportCity = CITIES.find(c => c.exports.length > 0)
  if (!exportCity) { check(false, '6) SELL_ALL export block', 'no export city') }
  else {
    const gid = exportCity.exports[0]
    s = { ...s, cityId: exportCity.id, cargo: { ...s.cargo, [gid]: { qty: 50, cost: 5000 } } }
    const r = reducer(s, { type: 'SELL_ALL' })
    check(r.cargo[gid]?.qty === 50, '6) SELL_ALL export block: keep all', 'qty=' + r.cargo[gid]?.qty)
  }
}

// 7) bestSellHint excludes hereId
{
  const markets = createMarkets()
  const hereId = CITIES[0].id
  const gid = GOODS[0].id
  const best = bestSellHint(gid, markets, 0, () => false, hereId)
  check(best.city.id !== hereId, '7) bestSellHint excludes here', 'here=' + hereId + ' best=' + best.city.id)
}

// 8) bestSellHint backward compat (no hereId)
{
  const markets = createMarkets()
  const gid = GOODS[0].id
  const best = bestSellHint(gid, markets, 0, () => false)
  check(!!best.city, '8) bestSellHint no hereId OK', 'best=' + best.city.id)
}

// 9) Neutral good in city can be sold
{
  let s = initialState()
  // 切到一座有中性货的城市
  const cn = CITIES.find(c => GOODS.some(g => !c.exports.includes(g.id) && !c.imports.includes(g.id))).id
  s = { ...s, cityId: cn }
  const city2 = CITY_BY_ID[cn]
  const target = GOODS.find(g => !city2.exports.includes(g.id) && !city2.imports.includes(g.id))
  // 注入该货到本港市场
  s = { ...s, markets: { ...s.markets, [cn]: { ...s.markets[cn], [target.id]: { price: 100, stock: 50, momentum: 0, spike: 0 } } }, cargo: { ...s.cargo, [target.id]: { qty: 10, cost: 1000 } } }
  const r = reducer(s, { type: 'SELL', goodId: target.id, qty: 5 })
  check((r.cargo[target.id]?.qty ?? 0) === 5, '9) Neutral sell allowed: 10->5', 'qty=' + r.cargo[target.id]?.qty)
}

// 10) BUY afford clamp
{
  let s = initialState()
  const cn = CITIES.find(c => GOODS.some(g => !c.exports.includes(g.id) && !c.imports.includes(g.id))).id
  s = { ...s, cityId: cn }
  const city2 = CITY_BY_ID[cn]
  const target = GOODS.find(g => !city2.exports.includes(g.id) && !city2.imports.includes(g.id))
  s = { ...s, markets: { ...s.markets, [cn]: { ...s.markets[cn], [target.id]: { price: 100, stock: 50, momentum: 0, spike: 0 } } } }
  s = { ...s, money: 301 }  // 只够买 3 件
  const before = s.cargo[target.id]?.qty ?? 0
  const r = reducer(s, { type: 'BUY', goodId: target.id, qty: 100 })
  const bought = (r.cargo[target.id]?.qty ?? 0) - before
  check(bought === 3, '10) BUY afford clamp: qty=100 money=301 -> 3', 'bought=' + bought)
}

console.log('--- pass=' + pass + ' fail=' + fail + ' ---')
if (fail > 0) process.exit(1)