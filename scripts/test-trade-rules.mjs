// ─────────────────────────────────────────────────────────────────────────────
//  贸易规则回归测试（v1.5.0）
//
//  核心规则（最根本的玩法，别改错）：
//    · 产地（特产）：本港只卖不买 —— 玩家只能「买入」，卖不回去（出口商不回购）
//    · 销地（紧缺）：本港只收不卖 —— 玩家只能「卖出」，买不到（进口商不零售）
//    · 唯一赚钱回路：产地低价买入 → 装船出海 → 销地高价卖出
//    · 因此「同港买入再卖回」在任何港口都不成立（白嫖船只利润加成的套利被堵死）
//
//  运行：npm run test:rules
// ─────────────────────────────────────────────────────────────────────────────
import { createServer } from 'vite'

const server = await createServer({
  configFile: 'vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
})

let pass = 0
let fail = 0
function check(ok, label, detail = '') {
  if (ok) {
    pass++
    console.log(`  \u2713 ${label}${detail ? '  —  ' + detail : ''}`)
  } else {
    fail++
    console.log(`  \u2717 ${label}${detail ? '  —  ' + detail : ''}`)
  }
}
function section(title) {
  console.log(`\n${title}`)
}

try {
  const { initialState, reducer } = await server.ssrLoadModule('/src/game/state.ts')
  const { sellPrice, shipOf } = await server.ssrLoadModule('/src/game/engine.ts')
  const { CITIES, GOODS } = await server.ssrLoadModule('/src/game/data.tsx')

  if (typeof initialState !== 'function') throw new Error('initialState 不是函数，测试无法运行')
  const base = () => initialState()

  // 找一条真实的货路：tea 在哪里是特产（产地）、在哪里是紧缺（销地）
  const goods = GOODS[0] ?? { id: 'tea' }
  const probes = ['tea', 'silk', 'porcelain', 'olive_oil', 'clove', 'cheese'].map(id =>
    ({
      gid: id,
      from: CITIES.find(c => c.exports.includes(id)),
      to: CITIES.find(c => c.imports.includes(id)),
    })).filter(p => p.from && p.to)
  const probe = probes[0] ?? {
    gid: goods.id,
    from: CITIES.find(c => c.exports.includes(goods.id)),
    to: CITIES.find(c => c.imports.includes(goods.id)),
  }
  const { gid, from, to } = probe
  console.log(`\n测试货路：${gid} · 产地=${from?.name}(${from?.id}) · 销地=${to?.name}(${to?.id})`)

  // ── 1. 产地（只卖不买）：可以买入 ───────────────────────────────────────────
  section('1) 产地（特产）＝ 本港只卖不买')
  {
    const s0 = { ...base(), cityId: from.id }
    const r = reducer(s0, { type: 'BUY', goodId: gid, qty: 10 })
    const got = r.cargo[gid]?.qty ?? 0
    check(got === 10, '产地可以买入 10 件', `买入后 ${got} 件`)
    check(r.markets[from.id][gid].stock === s0.markets[from.id][gid].stock - 10, '买入后本港库存 -10')
  }

  // ── 2. 产地不回购：卖不回去 ────────────────────────────────────────────────
  {
    const s0 = { ...base(), cityId: from.id, cargo: { [gid]: { qty: 10, cost: 500 } } }
    const r = reducer(s0, { type: 'SELL', goodId: gid, qty: 5 })
    check(r.cargo[gid]?.qty === 10 && r.money === s0.money, '产地卖出被拒（只卖不买）', `货仍 ${r.cargo[gid]?.qty} 件`)
  }

  // ── 3. 销地（只收不卖）：能卖出，且按本港价结算 ─────────────────────────────
  section('2) 销地（紧缺）＝ 本港只收不卖')
  {
    const s0 = { ...base(), cityId: to.id, cargo: { [gid]: { qty: 10, cost: 100 } } }
    const good = GOODS.find(g => g.id === gid)
    const unit = sellPrice(good, s0.markets[to.id], shipOf(s0.shipId).bonus)
    const r = reducer(s0, { type: 'SELL', goodId: gid, qty: 10 })
    check((r.cargo[gid]?.qty ?? 0) === 0, '销地能卖出（卖得掉）', `剩余 ${r.cargo[gid]?.qty ?? 0} 件`)
    check(r.money - s0.money === unit * 10, '销地按本港（高价）价结算', `+${r.money - s0.money} 金 / 单价 ${unit}`)
  }
  {
    const s0 = { ...base(), cityId: to.id }
    const r = reducer(s0, { type: 'BUY', goodId: gid, qty: 10 })
    check((r.cargo[gid]?.qty ?? 0) === 0 && r.money === s0.money, '销地买入被拒（只收不卖）', `货 ${r.cargo[gid]?.qty ?? 0} 件`)
  }

  // ── 4. 同港搬运套利被彻底堵死 ──────────────────────────────────────────────
  section('3) 同港买入→卖回 套利不可能')
  {
    let s = { ...base(), cityId: from.id, money: 999999 }
    s = reducer(s, { type: 'BUY', goodId: gid, qty: 5 })
    const bought = s.cargo[gid]?.qty ?? 0
    const moneyAfterBuy = s.money
    s = reducer(s, { type: 'SELL', goodId: gid, qty: bought })
    check(bought > 0, '产地买入成功（前提）', `${bought} 件`)
    check((s.cargo[gid]?.qty ?? 0) === bought && s.money === moneyAfterBuy, '产地原地卖回被拒（无套利）')

    const s2 = reducer({ ...base(), cityId: to.id, money: 999999 }, { type: 'BUY', goodId: gid, qty: 5 })
    check((s2.cargo[gid]?.qty ?? 0) === 0, '销地买不进（无套利）')
  }

  // ── 5. 完整回路能赚钱：产地买 → 销地卖 ─────────────────────────────────────
  section('4) 核心回路：产地买 → 销地卖 = 赚钱')
  {
    let s = { ...base(), cityId: from.id, money: 1_000_000 }
    s = reducer(s, { type: 'BUY', goodId: gid, qty: 20 })
    const cost = 1_000_000 - s.money
    s = { ...s, cityId: to.id }
    const before = s.money
    s = reducer(s, { type: 'SELL', goodId: gid, qty: s.cargo[gid]?.qty ?? 0 })
    const revenue = s.money - before
    check(revenue > cost, '跨港倒卖有正向利润', `成本 ${cost} → 收入 ${revenue}（+${revenue - cost}）`)
  }

  // ── 6. 一键清仓：销地卖得掉、产地货保留 ────────────────────────────────────
  section('5) 一键清仓（SELL_ALL）')
  {
    const r1 = reducer({ ...base(), cityId: to.id, cargo: { [gid]: { qty: 5, cost: 100 } } }, { type: 'SELL_ALL' })
    check((r1.cargo[gid]?.qty ?? 0) === 0, '销地一键清仓：紧缺货全部卖出')
    const r2 = reducer({ ...base(), cityId: from.id, cargo: { [gid]: { qty: 5, cost: 100 } } }, { type: 'SELL_ALL' })
    check(r2.cargo[gid]?.qty === 5, '产地一键清仓：不回购的货保留', `保留 ${r2.cargo[gid]?.qty} 件`)
  }

  // ── 7. 数值校验：NaN / 负数 / 超量 ─────────────────────────────────────────
  section('6) 数值校验')
  {
    const s0 = base()
    const g0 = Object.keys(s0.markets[s0.cityId])[0]
    check(reducer(s0, { type: 'BUY', goodId: g0, qty: NaN }).money === s0.money, 'BUY qty=NaN 无副作用（金币不变）')
    check(reducer(s0, { type: 'BUY', goodId: g0, qty: -50 }).money === s0.money, 'BUY qty=-50 无副作用')
    check(reducer(s0, { type: 'SELL', goodId: g0, qty: NaN }).money === s0.money, 'SELL qty=NaN 无副作用')
    const stock = s0.markets[s0.cityId][g0].stock
    const r = reducer(s0, { type: 'BUY', goodId: g0, qty: 999999 })
    const bought = r.cargo[g0]?.qty ?? 0
    check(bought <= Math.max(stock, 0), 'BUY 超量夹紧到库存', `买入 ${bought} / 库存 ${stock}`)
  }

  // ── 8. 数据完整性：每货必有产地与销地，且同港不同时既是产地又是销地 ────────
  section('7) 数据完整性')
  {
    const noFrom = GOODS.filter(g => !CITIES.some(c => c.exports.includes(g.id)))
    const noTo = GOODS.filter(g => !CITIES.some(c => c.imports.includes(g.id)))
    check(noFrom.length === 0, '每种货都有产地', noFrom.map(g => g.name).join('、') || '全部 OK')
    check(noTo.length === 0, '每种货都有销地', noTo.map(g => g.name).join('、') || '全部 OK')
    const ambiguous = []
    for (const c of CITIES) {
      for (const gid2 of c.exports) {
        if (c.imports.includes(gid2)) ambiguous.push(`${c.name}:${gid2}`)
      }
    }
    check(ambiguous.length === 0, '没有「同港既产也销」的歧义货（只卖不买/只收不卖互斥）', ambiguous.join('、') || '全部 OK')
  }
} finally {
  await server.close()
}

console.log(`\n${fail === 0 ? '\u2705 全部通过' : '\u274c 有失败项'}：pass=${pass} fail=${fail}`)
if (fail > 0) process.exit(1)
