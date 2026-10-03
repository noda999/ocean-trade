// ─────────────────────────────────────────────────────────────────────────────
//  音频：程序化音效 + 背景音乐（BGM 文件优先，缺失时程序化兜底）
//
//  · 音效全部用 Web Audio API 振荡器实时合成，零音频文件、零包体增量。
//  · BGM 优先播放 public/audio/bgm.ogg（你放入即用、自动启用）；文件不存在时
//    回退到 Web Audio 程序化合成的多段落航海轻音乐：
//      引子(海浪+驼铃) → 主歌(古筝/乌德拨弦+笛) → 中段(弦乐铺底+大鼓) → 循环
//    中东 Hijaz 异域音阶 + 中国五声，Convolver 电影级混响。无需任何资源。
//  · 浏览器自动播放策略：首个用户手势（pointerdown / keydown）后 unlock() 再 resume。
//  · 开关与音量持久化到 localStorage。
// ─────────────────────────────────────────────────────────────────────────────

import { BGM_B64 } from './bgmData'

export type SfxName =
  | 'click' | 'buy' | 'sell' | 'sail' | 'anchor'
  | 'coin' | 'levelup' | 'error' | 'blip' | 'claim'

const LS = {
  sfxOn: 'ocean-trade-sfx-on',
  bgmOn: 'ocean-trade-bgm-on',
  sfxVol: 'ocean-trade-sfx-vol',
  bgmVol: 'ocean-trade-bgm-vol',
}

function readBool(k: string, d: boolean): boolean {
  try {
    const v = localStorage.getItem(k)
    return v === null ? d : v === '1'
  } catch { return d }
}
function readNum(k: string, d: number): number {
  try {
    const v = localStorage.getItem(k)
    return v === null ? d : Number(v)
  } catch { return d }
}

interface Preset { freq: number[]; dur: number; type: OscillatorType; gap?: number; gain?: number }

// ── BGM 合成素材：16 世纪大航海 / 海上丝绸之路 异域航海轻音乐 ────────────────
const NOTE: Record<string, number> = {
  A2: 110.00, Bb2: 116.54, B2: 123.47, C3: 130.81, Csh3: 138.59, D3: 146.83,
  Eb3: 155.56, E3: 164.81, F3: 174.61, Fsh3: 185.00, G3: 196.00, Gsh3: 207.65,
  A3: 220.00, Bb3: 233.08, B3: 246.94, C4: 261.63, Csh4: 277.18, D4: 293.66,
  Eb4: 311.13, E4: 329.63, F4: 349.23, Fsh4: 369.99, G4: 392.00, Gsh4: 415.30,
  A4: 440.00, Bb4: 466.16, B4: 493.88, C5: 523.25, Csh5: 554.37, D5: 587.33,
  Eb5: 622.25, E5: 659.25, F5: 698.46, Fsh5: 739.99, G5: 783.99, Gsh5: 830.61, A5: 880.00,
}
const HIJAZ = ['A3', 'Bb3', 'Csh4', 'D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'Csh5', 'D5', 'E5'] as const
const PENTA = ['A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5'] as const

function playPluck(ctx: AudioContext, dest: AudioNode, freq: number, start: number, dur: number, peak: number): void {
  const mk = (det: number, amp: number) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'; hp.frequency.value = 200
    o.type = 'triangle'; o.frequency.value = freq; o.detune.value = det
    g.gain.setValueAtTime(0.0001, start)
    g.gain.linearRampToValueAtTime(peak * amp, start + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    o.connect(hp); hp.connect(g); g.connect(dest)
    o.start(start); o.stop(start + dur + 0.05)
  }
  mk(0, 1); mk(-6, 0.6)
}

function playFlute(ctx: AudioContext, dest: AudioNode, freq: number, start: number, dur: number, peak: number): void {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  const vib = ctx.createOscillator()
  const vibG = ctx.createGain()
  o.type = 'sine'; o.frequency.value = freq
  vib.type = 'sine'; vib.frequency.value = 5.2; vibG.gain.value = freq * 0.008
  vib.connect(vibG); vibG.connect(o.frequency)
  g.gain.setValueAtTime(0.0001, start)
  g.gain.linearRampToValueAtTime(peak, start + 0.08)
  g.gain.setValueAtTime(peak, start + dur * 0.6)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  o.connect(g); g.connect(dest)
  o.start(start); o.stop(start + dur + 0.05)
  vib.start(start); vib.stop(start + dur + 0.05)
}

function playBell(ctx: AudioContext, dest: AudioNode, start: number, peak: number): void {
  const base = 587
  const partials = [1, 2.0, 3.01, 4.2]
  const amps = [1, 0.5, 0.3, 0.15]
  partials.forEach((p, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'; o.frequency.value = base * p
    g.gain.setValueAtTime(0.0001, start)
    g.gain.linearRampToValueAtTime(peak * amps[i], start + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.7)
    o.connect(g); g.connect(dest)
    o.start(start); o.stop(start + 0.75)
  })
}

function playDrum(ctx: AudioContext, dest: AudioNode, start: number, peak: number): void {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(120, start)
  o.frequency.exponentialRampToValueAtTime(48, start + 0.18)
  g.gain.setValueAtTime(peak, start)
  g.gain.exponentialRampToValueAtTime(0.0001, start + 0.3)
  o.connect(g); g.connect(dest)
  o.start(start); o.stop(start + 0.32)
  const n = ctx.createBufferSource(); n.buffer = noiseShort(ctx)
  const ng = ctx.createGain(); ng.gain.setValueAtTime(peak * 0.3, start)
  ng.gain.exponentialRampToValueAtTime(0.0001, start + 0.05)
  const nf = ctx.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 2000
  n.connect(nf); nf.connect(ng); ng.connect(dest)
  n.start(start); n.stop(start + 0.06)
}

function playStrings(ctx: AudioContext, dest: AudioNode, freqs: number[], start: number, dur: number, peak: number): void {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, start)
  g.gain.linearRampToValueAtTime(peak, start + dur * 0.25)
  g.gain.setValueAtTime(peak, start + dur * 0.7)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400
  freqs.forEach((f) => {
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f
    o.connect(lp); o.start(start); o.stop(start + dur + 0.05)
  })
  lp.connect(g); g.connect(dest)
}

let _noise: AudioBuffer | null = null
function noiseShort(ctx: AudioContext): AudioBuffer {
  if (!_noise) {
    const len = Math.floor(ctx.sampleRate * 0.1)
    const b = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = b.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    _noise = b
  }
  return _noise
}

function startWaves(ctx: AudioContext, dest: AudioNode): () => void {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 2), ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf; src.loop = true
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500
  const g = ctx.createGain(); g.gain.value = 0.05
  const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.12
  const lfoG = ctx.createGain(); lfoG.gain.value = 0.035
  const lfoF = ctx.createGain(); lfoF.gain.value = 220
  lfo.connect(lfoG); lfoG.connect(g.gain)
  lfo.connect(lfoF); lfoF.connect(lp.frequency)
  src.connect(lp); lp.connect(g); g.connect(dest)
  src.start(); lfo.start()
  return () => { try { src.stop() } catch { /* ignore */ } try { lfo.stop() } catch { /* ignore */ } }
}

function makeReverbIR(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const rate = ctx.sampleRate
  const len = Math.floor(rate * seconds)
  const buf = ctx.createBuffer(2, len, rate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return buf
}

const MELODY_A = ['A4', 'B4', 'Csh5', 'D5', 'E5', 'D5', 'Csh5', 'B4', 'A4', 'Csh5', 'E5', 'D5', 'Csh5', 'B4', 'A4', null]
const MELODY_B = ['A4', 'Csh5', 'E5', 'A5', 'Gsh5', 'E5', 'Csh5', 'A4', 'A4', 'E5', 'A5', 'Csh5', 'D5', 'Csh5', 'A4', null]
const CHORD_A = [NOTE.A3, NOTE.Csh4, NOTE.E4]
const CHORD_B = [NOTE.A2, NOTE.E3, NOTE.A3, NOTE.Csh4]

class AudioManager {
  private ctx: AudioContext | null = null
  private unlocked = false
  private bgmEl: HTMLAudioElement | null = null
  private bgmTimer: number | null = null
  private bgmBus: GainNode | null = null
  private bgmWaveStop: (() => void) | null = null
  private bgmSrcNode: AudioBufferSourceNode | null = null
  private bgmGain: GainNode | null = null
  private bgmDecoding = false

  sfxOn = readBool(LS.sfxOn, true)
  bgmOn = readBool(LS.bgmOn, true)
  sfxVol = readNum(LS.sfxVol, 0.6)
  bgmVol = readNum(LS.bgmVol, 0.4)

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      this.ctx = new AC()
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume().catch(() => {})
    return this.ctx
  }

  private getBgmBus(ctx: AudioContext): GainNode {
    if (!this.bgmBus) {
      const bus = ctx.createGain()
      bus.gain.value = 0.8
      const comp = ctx.createDynamicsCompressor()
      const conv = ctx.createConvolver()
      conv.buffer = makeReverbIR(ctx, 2.2, 1.8)
      const wet = ctx.createGain()
      wet.gain.value = 0.4
      bus.connect(comp); comp.connect(ctx.destination)
      bus.connect(conv); conv.connect(wet); wet.connect(comp)
      this.bgmBus = bus
    }
    return this.bgmBus
  }

  unlock() {
    if (this.unlocked) return
    this.unlocked = true
    this.ensure()
    if (this.bgmOn) this.startBgm()
  }

  sfx(name: SfxName) {
    if (!this.sfxOn) return
    const ctx = this.ensure()
    if (!ctx) return
    const presets: Record<SfxName, Preset> = {
      click:   { freq: [620], dur: 0.05, type: 'square', gain: 0.35 },
      buy:     { freq: [520, 740], dur: 0.08, type: 'triangle', gap: 0.06, gain: 0.5 },
      sell:    { freq: [740, 520], dur: 0.08, type: 'triangle', gap: 0.06, gain: 0.5 },
      sail:    { freq: [330, 440, 550], dur: 0.45, type: 'sawtooth', gap: 0.12, gain: 0.4 },
      anchor:  { freq: [440, 330], dur: 0.3, type: 'sine', gain: 0.5 },
      coin:    { freq: [880, 1320], dur: 0.12, type: 'square', gap: 0.05, gain: 0.4 },
      levelup: { freq: [523, 659, 784, 1047], dur: 0.5, type: 'triangle', gap: 0.09, gain: 0.5 },
      claim:   { freq: [784, 988, 1319], dur: 0.45, type: 'triangle', gap: 0.08, gain: 0.5 },
      error:   { freq: [200, 150], dur: 0.25, type: 'sawtooth', gap: 0.1, gain: 0.45 },
      blip:    { freq: [520], dur: 0.07, type: 'sine', gain: 0.3 },
    }
    const p = presets[name]
    const t0 = ctx.currentTime
    const master = ctx.createGain()
    master.gain.value = this.sfxVol
    master.connect(ctx.destination)
    p.freq.forEach((f, i) => {
      const start = t0 + i * (p.gap ?? 0)
      const end = start + p.dur
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = p.type
      o.frequency.setValueAtTime(f, start)
      const peak = p.gain ?? 0.5
      g.gain.setValueAtTime(0.0001, start)
      g.gain.linearRampToValueAtTime(peak, start + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, end)
      o.connect(g)
      g.connect(master)
      o.start(start)
      o.stop(end)
    })
  }

  setSfxOn(on: boolean) {
    this.sfxOn = on
    try { localStorage.setItem(LS.sfxOn, on ? '1' : '0') } catch { /* ignore */ }
  }
  setSfxVol(v: number) {
    this.sfxVol = v
    try { localStorage.setItem(LS.sfxVol, String(v)) } catch { /* ignore */ }
  }
  setBgmOn(on: boolean) {
    this.bgmOn = on
    try { localStorage.setItem(LS.bgmOn, on ? '1' : '0') } catch { /* ignore */ }
    if (on) this.startBgm()
    else this.stopBgm()
  }
  setBgmVol(v: number) {
    this.bgmVol = v
    try { localStorage.setItem(LS.bgmVol, String(v)) } catch { /* ignore */ }
    if (this.bgmEl) this.bgmEl.volume = v
    if (this.bgmGain) this.bgmGain.gain.value = v
  }

  private startBgm() {
    if (typeof window === 'undefined') return
    if (this.bgmTimer !== null || this.bgmSrcNode || this.bgmEl || this.bgmDecoding) return
    if (this.tryEmbeddedBgm()) return
    this.startFileOrProceduralBgm()
  }

  // 内嵌 BGM：用 Web Audio decodeAudioData 解码 base64（读内存 ArrayBuffer，
  // 不经过 <audio>/media-src，可绕过小红书沙箱对 data: URI 的拦截）。
  // 看门狗：部分老版本 webview 的 decodeAudioData 会「卡死」（两个回调都不触发），
  // 因此 2s 内未解码成功就回落合成器，保证一定有声音；若之后内嵌解码成功再切回。
  private tryEmbeddedBgm(): boolean {
    const ctx = this.ensure()
    if (!ctx) { this.startProceduralBgm(); return false }
    let bin: Uint8Array
    try {
      const s = atob(BGM_B64)
      bin = new Uint8Array(s.length)
      for (let i = 0; i < s.length; i++) bin[i] = s.charCodeAt(i)
    } catch { this.startProceduralBgm(); return false }
    this.bgmDecoding = true
    let settled = false
    let watch: number | undefined
    const onFail = () => {
      if (settled) return
      settled = true
      this.bgmDecoding = false
      if (watch !== undefined) window.clearTimeout(watch)
      this.startProceduralBgm()
    }
    watch = window.setTimeout(onFail, 2000)
    try {
      ctx.decodeAudioData(
        bin.buffer.slice(0),
        (audioBuf) => {
          if (settled) return
          settled = true
          this.bgmDecoding = false
          if (watch !== undefined) window.clearTimeout(watch)
          // 若看门狗已先启动合成器，先停掉
          if (this.bgmTimer !== null) this.stopProceduralBgm()
          const bus = this.getBgmBus(ctx)
          const g = ctx.createGain()
          g.gain.value = this.bgmVol
          g.connect(bus)
          this.bgmGain = g
          const node = ctx.createBufferSource()
          node.buffer = audioBuf
          node.loop = true
          node.connect(g)
          node.start()
          this.bgmSrcNode = node
        },
        () => onFail(),
      )
    } catch {
      onFail()
      return false
    }
    return true
  }

  private startFileOrProceduralBgm() {
    if (typeof window === 'undefined') return
    const candidates = [
      `${import.meta.env.BASE_URL}audio/bgm.ogg`,
      `${import.meta.env.BASE_URL}audio/bgm.mp3`,
    ]
    let idx = 0
    const tryNext = () => {
      if (idx >= candidates.length) { this.bgmEl = null; this.startProceduralBgm(); return }
      const url = candidates[idx++]
      const el = new Audio(url)
      el.loop = true
      el.preload = 'auto'
      el.volume = this.bgmVol
      let failed = false
      el.addEventListener('error', () => { if (!failed) { failed = true; tryNext() } })
      this.bgmEl = el
      void el.play().then(() => { /* 真实文件可用，关闭程序化兜底 */ }).catch(() => {
        if (!failed) { failed = true; tryNext() }
      })
    }
    tryNext()
  }

  private startProceduralBgm() {
    if (this.bgmTimer !== null) return
    const ctx = this.ensure()
    if (!ctx) return
    const bus = this.getBgmBus(ctx)
    this.bgmWaveStop = startWaves(ctx, bus)
    const BPM = 76
    const beat = 60 / BPM
    let beatCount = 0
    const tick = () => {
      if (!this.bgmOn) { this.stopProceduralBgm(); return }
      const c = this.ensure()
      if (!c) return
      const t = c.currentTime + 0.02
      const vol = this.bgmVol
      if (beatCount < 8) {
        if (beatCount % 4 === 0) playBell(c, bus, t, vol * 0.32)
      } else {
        const inLoop = beatCount - 8
        const isB = Math.floor(inLoop / 16) % 2 === 1
        const beatInBar = inLoop % 4
        const idx = inLoop % 16
        const melody = isB ? MELODY_B : MELODY_A
        if (beatInBar === 0) {
          if (isB) playStrings(c, bus, CHORD_B, t, beat * 4 * 0.98, vol * 0.22)
          else CHORD_A.forEach((f) => playPluck(c, bus, f, t, beat * 3.6, vol * 0.18))
        }
        const m = melody[idx]
        if (m) {
          playPluck(c, bus, NOTE[m], t, beat * 0.9, vol * 0.5)
          if (beatInBar === 0 || beatInBar === 2) {
            const fl = NOTE[m] >= NOTE.A4 ? NOTE[m] : NOTE[m] * 2
            playFlute(c, bus, fl, t, beat * 2 * 0.95, vol * 0.26)
          }
        }
        if (isB) playDrum(c, bus, t, beatInBar % 2 === 0 ? vol * 0.6 : vol * 0.3)
      }
      beatCount++
    }
    tick()
    this.bgmTimer = window.setInterval(tick, beat * 1000)
  }

  private stopProceduralBgm() {
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer)
      this.bgmTimer = null
    }
    if (this.bgmWaveStop) {
      this.bgmWaveStop()
      this.bgmWaveStop = null
    }
  }

  private stopBgm() {
    if (this.bgmEl) {
      this.bgmEl.pause()
      try { this.bgmEl.currentTime = 0 } catch { /* ignore */ }
      this.bgmEl = null
    }
    if (this.bgmSrcNode) {
      try { this.bgmSrcNode.stop() } catch { /* ignore */ }
      try { this.bgmSrcNode.disconnect() } catch { /* ignore */ }
      this.bgmSrcNode = null
    }
    if (this.bgmGain) {
      try { this.bgmGain.disconnect() } catch { /* ignore */ }
      this.bgmGain = null
    }
    this.stopProceduralBgm()
  }
}

export const audio = new AudioManager()
