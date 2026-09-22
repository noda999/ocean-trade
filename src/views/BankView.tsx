import { useState } from 'react'
import { creditLimit } from '../game/state'
import { useGame } from '../game/store'

// ─────────────────────────────────────────────────────────────────────────────
// 港口银行（v1.4.0）：信用额度随借随还，债务每市场周期计息 0.15%
// 从「市政厅」拆出，挂在市场页 —— 借贷与交易同属"钱"的场所；
// 默认折叠成一行，避免挤占市场页顶部空间
// ─────────────────────────────────────────────────────────────────────────────

export default function BankView() {
  const { state, dispatch } = useGame()
  const [expanded, setExpanded] = useState(false)

  const limit = creditLimit(state)
  const debt = state.debt
  const sailing = !!state.voyage
  const canBorrow = limit > 0 && !sailing
  const canRepay = debt > 0 && state.money > 0 && !sailing

  return (
    <div className="bank-bar panel-white mb-3" style={{ borderRadius: 14, overflow: 'hidden' }}>
      {/* 折叠行：一眼看到债务与额度 */}
      <button
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <span className="text-sm">🏦</span>
        <span className="text-xs font-800" style={{ color: '#3d2b10' }}>港口银行</span>
        <span
          className="px-1.5 py-0.5 rounded-md font-800 text-[10px]"
          style={{ background: debt > 0 ? '#fdeaea' : '#e8f7ec', color: debt > 0 ? '#c05050' : '#3a8a52' }}
        >
          债务 {debt.toLocaleString()}
        </span>
        <span className="px-1.5 py-0.5 rounded-md font-800 text-[10px]" style={{ background: '#fff5ec', color: '#a07030' }}>
          可借 {limit.toLocaleString()}
        </span>
        <span className="ml-auto text-xs font-800" style={{ color: '#a07030' }}>
          {expanded ? '收起 ▲' : '借贷 ▼'}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-3">
          <div className="flex gap-2 mb-2 flex-wrap">
            {[5_000, 20_000, 50_000].filter(a => a <= limit).map(a => (
              <button
                key={a}
                className="btn-orange px-3 py-2 text-xs font-900"
                disabled={!canBorrow}
                style={{ opacity: canBorrow ? 1 : 0.5 }}
                onClick={() => dispatch({ type: 'LOAN_BORROW', amount: a })}
              >
                借 {(a / 1000).toFixed(0)}k
              </button>
            ))}
            {limit > 0 && (
              <button
                className="btn-orange px-3 py-2 text-xs font-900"
                disabled={!canBorrow}
                style={{ opacity: canBorrow ? 1 : 0.5 }}
                onClick={() => dispatch({ type: 'LOAN_BORROW', amount: limit })}
              >
                借满 {Math.round(limit / 1000)}k
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-3 py-2 text-xs font-900 rounded-xl"
              disabled={!canRepay}
              style={{ background: canRepay ? '#e8f7ec' : '#f4eee1', color: canRepay ? '#3a8a52' : '#b8ab94' }}
              onClick={() => dispatch({ type: 'LOAN_REPAY', amount: Math.ceil(debt / 2) })}
            >
              偿还一半
            </button>
            <button
              className="px-3 py-2 text-xs font-900 rounded-xl"
              disabled={!canRepay}
              style={{ background: canRepay ? '#e8f7ec' : '#f4eee1', color: canRepay ? '#3a8a52' : '#b8ab94' }}
              onClick={() => dispatch({ type: 'LOAN_REPAY', amount: debt })}
            >
              全部还清
            </button>
          </div>
          <div className="text-[10px] mt-2 text-center" style={{ color: '#c0a070' }}>
            额度 = 资产 × 50%（8k - 250k）· 每市场周期计息 0.15% · 债务超过资产 3 倍将被强制清算（没收货物与现金抵债）
          </div>
          {sailing && (
            <div className="text-[10px] mt-1 text-center" style={{ color: '#c05050' }}>
              航行途中无法办理银行业务，靠港后再来
            </div>
          )}
        </div>
      )}
    </div>
  )
}
