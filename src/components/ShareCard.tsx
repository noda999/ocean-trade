import { useEffect, useRef, useState } from 'react'
import { ACHIEVEMENTS, CITIES, CREW_QUESTS, GOODS, LEGENDS, LEGEND_TITLE } from '../game/data'
import { allLegendsDone, type GameState } from '../game/state'

const W = 1080
const H = 1440

const FONT = '"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif'

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

interface Props {
  /** 由调用方算好：总资产、称号 */
  state: GameState
  assets: number
  title: string
  onClose: () => void
}

/** 功勋页分享图：canvas 绘制 1080×1440，可保存 PNG */
export default function ShareCard({ state, assets, title, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const legendsDone = state.legendsClaimed.length
    const legendComplete = allLegendsDone(state)
    const traded = new Set([...state.goodsBought, ...state.goodsSold])
    const achDone = ACHIEVEMENTS.filter(a =>
      (a.kind === 'visited' ? state.visited.length
        : a.kind === 'bought' ? state.goodsBought.length
          : a.kind === 'sold' ? state.goodsSold.length
            : traded.size) >= a.target,
    ).length
    const questsDone = state.crewQuestsClaimed.length

    // ── 背景 ──
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, '#fdf6e9')
    bg.addColorStop(1, '#f3e4c5')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)
    // 装饰波浪
    ctx.strokeStyle = 'rgba(79,184,220,0.14)'
    ctx.lineWidth = 3
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      const y = 1080 + i * 74
      for (let x = 0; x <= W; x += 12) {
        const yy = y + Math.sin((x / W) * Math.PI * 4 + i) * 13
        if (x === 0) ctx.moveTo(x, yy)
        else ctx.lineTo(x, yy)
      }
      ctx.stroke()
    }

    // ── 顶部 ──
    ctx.textAlign = 'center'
    ctx.fillStyle = '#3d2b10'
    ctx.font = `900 56px ${FONT}`
    ctx.fillText('🧭 远洋贸易 🧭', W / 2, 108)
    ctx.font = `700 30px ${FONT}`
    ctx.fillStyle = '#a07030'
    ctx.fillText('· 我 的 航 海 生 涯 ·', W / 2, 158)

    // ── 称号卡 ──
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    roundRect(ctx, 70, 200, W - 140, 350, 36)
    ctx.fill()
    ctx.strokeStyle = '#f0d89a'
    ctx.lineWidth = 4
    ctx.stroke()

    ctx.fillStyle = '#a07030'
    ctx.font = `800 34px ${FONT}`
    ctx.fillText(legendComplete ? `👑 ${LEGEND_TITLE} 👑` : `称号 · ${title}`, W / 2, 272)

    ctx.fillStyle = '#f5913a'
    ctx.font = `900 108px ${FONT}`
    ctx.fillText(assets.toLocaleString(), W / 2, 392)
    ctx.fillStyle = '#a07030'
    ctx.font = `700 30px ${FONT}`
    ctx.fillText('总资产（金）', W / 2, 444)

    ctx.fillStyle = '#8a6a40'
    ctx.font = `700 28px ${FONT}`
    const hrs = Math.floor(state.clock / 3600)
    const mins = Math.floor((state.clock % 3600) / 60)
    ctx.fillText(`航海时长 ${hrs} 小时 ${mins} 分 · 船队 ${state.ownedShips.length} 艘 · 船员 ${state.hiredCrew.length} 人`, W / 2, 508)

    // ── 数据网格 2×2 ──
    const cells: { icon: string; v: string; label: string }[] = [
      { icon: '🔁', v: `${state.stats.trades}`, label: '交易笔数' },
      { icon: '🧭', v: `${state.stats.distance.toLocaleString()}`, label: '航行海里' },
      { icon: '🏙️', v: `${state.visited.length}/${CITIES.length}`, label: '到访城市' },
      { icon: '🏅', v: state.stats.best > 0 ? `+${Math.round(state.stats.best).toLocaleString()}` : '—', label: '单笔最佳' },
    ]
    cells.forEach((c, i) => {
      const x = 70 + (i % 2) * ((W - 140) / 2 + 12)
      const y = 586 + Math.floor(i / 2) * 178
      const w = (W - 140) / 2 - 12
      ctx.fillStyle = 'rgba(255,255,255,0.88)'
      roundRect(ctx, x, y, w, 160, 28)
      ctx.fill()
      ctx.textAlign = 'left'
      ctx.font = `700 26px ${FONT}`
      ctx.fillStyle = '#c0a070'
      ctx.fillText(`${c.label}`, x + 28, y + 42)
      ctx.font = `900 56px ${FONT}`
      ctx.fillStyle = '#3d2b10'
      ctx.fillText(c.v, x + 28, y + 112)
      ctx.textAlign = 'center'
      ctx.font = `52px ${FONT}`
      ctx.fillText(c.icon, x + w - 62, y + 108)
    })

    // ── 传奇功勋条 ──
    ctx.textAlign = 'left'
    ctx.fillStyle = '#3d2b10'
    ctx.font = `900 40px ${FONT}`
    ctx.fillText('🏆 传奇功勋', 90, 1010)
    ctx.textAlign = 'right'
    ctx.font = `900 40px ${FONT}`
    ctx.fillStyle = legendsDone === LEGENDS.length ? '#c98a10' : '#a07030'
    ctx.fillText(`${legendsDone} / ${LEGENDS.length}`, W - 90, 1010)

    const barY = 1044
    ctx.fillStyle = 'rgba(61,43,16,0.12)'
    roundRect(ctx, 90, barY, W - 180, 30, 15)
    ctx.fill()
    if (legendsDone > 0) {
      const g = ctx.createLinearGradient(90, 0, W - 90, 0)
      g.addColorStop(0, '#f0a83c')
      g.addColorStop(1, '#ffd97a')
      ctx.fillStyle = g
      roundRect(ctx, 90, barY, Math.max(30, (W - 180) * (legendsDone / LEGENDS.length)), 30, 15)
      ctx.fill()
    }

    // ── 小成就行 ──
    ctx.textAlign = 'left'
    ctx.font = `700 32px ${FONT}`
    ctx.fillStyle = '#8a6a40'
    ctx.fillText(`📜 船员委托 ${questsDone}/${CREW_QUESTS.length}`, 90, 1148)
    ctx.fillText(`🎖️ 贸易成就 ${achDone}/${ACHIEVEMENTS.length}`, 90, 1200)
    ctx.fillText(`📦 万货图鉴 ${traded.size}/${GOODS.length}`, 90, 1252)

    // ── 底部 ──
    ctx.textAlign = 'center'
    ctx.fillStyle = '#a07030'
    ctx.font = `800 32px ${FONT}`
    ctx.fillText('⚓ 通关不是终点，七海才是 ⚓', W / 2, 1340)
    ctx.font = `700 26px ${FONT}`
    ctx.fillStyle = '#c0a070'
    const d = new Date()
    ctx.fillText(`远洋贸易 · ${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`, W / 2, 1386)

    setUrl(cv.toDataURL('image/png'))
  }, [state, assets, title])

  function save() {
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = `远洋贸易-航海生涯-${Date.now()}.png`
    a.click()
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.6)', zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="relative"
        style={{ maxWidth: 360, width: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="panel-white p-3" style={{ borderRadius: 18 }}>
          <div className="text-center font-900 text-sm mb-2" style={{ color: '#3d2b10' }}>📸 我的航海生涯卡</div>
          {url && (
            <img src={url} alt="分享图" style={{ width: '100%', borderRadius: 12, display: 'block' }} />
          )}
          <canvas ref={canvasRef} width={W} height={H} style={{ display: 'none' }} />
          <div className="flex gap-2 mt-3">
            <button
              className="btn-ghost-orange flex-1 py-2.5 text-sm font-800"
              onClick={onClose}
            >关闭</button>
            <button
              className="btn-orange flex-1 py-2.5 text-sm font-900"
              onClick={save}
            >💾 保存图片</button>
          </div>
          <div className="text-[10px] text-center mt-2" style={{ color: '#c0a070' }}>
            手机端也可长按图片保存 · 发到小红书记得带上游戏链接
          </div>
        </div>
      </div>
    </div>
  )
}
