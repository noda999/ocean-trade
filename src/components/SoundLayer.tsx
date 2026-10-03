// ─────────────────────────────────────────────────────────────────────────────
//  声音层：订阅游戏状态，在关键事件发生时触发音效（事件驱动，免去逐个按钮接）
//   · 新 toast：good→levelup / bad→error / info→blip
//   · 起航（voyage 从 null 变为有）：sail
//  组件不渲染任何 UI。
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react'
import { useGame } from '../game/store'
import { audio, type SfxName } from '../game/audio'

export default function SoundLayer() {
  const { state } = useGame()
  const lastToastId = useRef<number>(0)
  const prevVoyage = useRef(state.voyage)

  useEffect(() => {
    for (const t of state.toasts) {
      if (t.id <= lastToastId.current) continue
      lastToastId.current = t.id
      const name: SfxName =
        t.kind === 'good' ? 'levelup'
          : t.kind === 'bad' ? 'error'
            : 'blip'
      audio.sfx(name)
    }
  }, [state.toasts])

  useEffect(() => {
    if (!prevVoyage.current && state.voyage) audio.sfx('sail')
    prevVoyage.current = state.voyage
  }, [state.voyage])

  return null
}
