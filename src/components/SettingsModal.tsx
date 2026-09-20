import { useEffect, useRef, useState, type ReactNode } from 'react'
import { decodeSaveFromUrl, encodeSaveToUrl, useGame } from '../game/store'

const SAVE_KEY = 'ocean-trade-save-v2'

interface Props {
  onClose: () => void
}

/** 把当前 localStorage 里的存档原样取出（找不到返回 null） */
function readSaveBlob(): string | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    // 二次校验结构合法再导出，避免把已损坏的存档喂回去
    JSON.parse(raw)
    return raw
  } catch {
    return null
  }
}

/** 拿一段存档文本，写回 localStorage 并触发 reload */
function writeSaveBlob(blob: string): { ok: boolean; msg: string } {
  try {
    const parsed = JSON.parse(blob)
    if (!parsed || typeof parsed !== 'object') return { ok: false, msg: '存档格式不对，应为 JSON 对象' }
    if (typeof parsed.money !== 'number' || typeof parsed.cityId !== 'string') {
      return { ok: false, msg: '存档缺少关键字段（money / cityId）' }
    }
    localStorage.setItem(SAVE_KEY, blob)
    return { ok: true, msg: '导入成功，正在重启…' }
  } catch (e) {
    return { ok: false, msg: '存档 JSON 解析失败：' + (e instanceof Error ? e.message : String(e)) }
  }
}

/** 把一段文本存为文件触发下载 */
function downloadAsFile(filename: string, text: string) {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function SettingsModal({ onClose }: Props): ReactNode {
  const { state, reset } = useGame()
  const fileRef = useRef<HTMLInputElement>(null)
  const linkRef = useRef<HTMLTextAreaElement>(null)
  const [status, setStatus] = useState<{ kind: 'ok' | 'bad' | 'info'; msg: string } | null>(null)
  const [importText, setImportText] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const hasSave = !!readSaveBlob()

  /** 选中链接框里的全部内容（移动端长按复制需要先选中文本） */
  function selectLinkText() {
    const ta = linkRef.current
    if (!ta) return
    ta.focus({ preventScroll: true })
    try { ta.setSelectionRange(0, ta.value.length) } catch { /* ignore */ }
    ta.select()
  }

  /** 链接变化后自动 focus + 全选，方便用户长按复制 */
  useEffect(() => {
    if (generatedLink) selectLinkText()
  }, [generatedLink])

  function handleExport() {
    const blob = readSaveBlob()
    if (!blob) {
      setStatus({ kind: 'bad', msg: '当前没有可导出的存档' })
      return
    }
    const filename = `ocean-trade-save-${new Date().toISOString().slice(0, 10)}.json`
    downloadAsFile(filename, blob)
    setStatus({ kind: 'ok', msg: `已下载 ${filename}（共 ${blob.length} 字节）` })
    // 顺手复制一份到剪贴板（小红书容器可能屏蔽 clipboard API，但桌面浏览器可用）
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(blob).then(
          () => setStatus(prev => ({ kind: 'ok', msg: (prev?.msg ?? '') + ' · 已复制到剪贴板' })),
          () => { /* 静默忽略：失败不打扰用户 */ },
        )
      }
    } catch { /* ignore */ }
  }

  function handleCopyOnly() {
    const blob = readSaveBlob()
    if (!blob) {
      setStatus({ kind: 'bad', msg: '当前没有可复制的存档' })
      return
    }
    if (!navigator.clipboard?.writeText) {
      setStatus({ kind: 'bad', msg: '当前环境不支持剪贴板，请改用「下载文件」' })
      return
    }
    navigator.clipboard.writeText(blob).then(
      () => setStatus({ kind: 'ok', msg: `存档已复制（${blob.length} 字节），去别处粘贴回来` }),
      () => setStatus({ kind: 'bad', msg: '复制被浏览器拦截，请改用「下载文件」' }),
    )
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? '')
      applyImport(text)
      e.target.value = '' // 允许重复选同一文件
    }
    reader.readAsText(f)
  }

  function handlePasteImport() {
    if (!importText.trim()) {
      setStatus({ kind: 'bad', msg: '请先粘贴存档文本' })
      return
    }
    applyImport(importText.trim())
  }

  function applyImport(text: string) {
    const r = writeSaveBlob(text)
    setStatus({ kind: r.ok ? 'ok' : 'bad', msg: r.msg })
    if (r.ok) {
      setTimeout(() => location.reload(), 600)
    }
  }

  function handleReset() {
    if (!window.confirm('确定要清空所有进度，重新开始吗？')) return
    reset()
    setStatus({ kind: 'info', msg: '存档已清空，正在重启…' })
    setTimeout(() => location.reload(), 400)
  }

  /** 生成一条带存档的完整链接（含 origin + pathname） */
  function buildLink(): string | null {
    const blob = readSaveBlob()
    if (!blob) return null
    const enc = encodeSaveToUrl(blob)
    try {
      const u = new URL(window.location.href)
      u.search = ''
      u.hash = ''
      u.searchParams.set('save', enc)
      return u.toString()
    } catch {
      // 容错：万一 URL 构造失败，至少给出相对路径
      return `?save=${enc}`
    }
  }

  function handleMakeLink() {
    const link = buildLink()
    if (!link) {
      setStatus({ kind: 'bad', msg: '当前没有可导出的存档' })
      setGeneratedLink('')
      return
    }
    setGeneratedLink(link)
    setStatus({
      kind: 'ok',
      msg: `已生成链接（${link.length} 字符）—— 下方链接已自动选中，📱 手机长按链接框选「拷贝」即可`,
    })
  }

  /**
   * 复制链接，兼容移动 webview / 小红书容器：
   *   1) execCommand('copy') — 兜底首选，移动 webview（小红书）通常能用
   *   2) navigator.clipboard.writeText — 桌面浏览器备选
   *   3) 都失败 → 提示长按下方链接框复制
   * 关键：必须用 try/catch 包整个流程，且 clipboard 调用 800ms 内不响应就主动放弃，
   * 因为小红书容器里 writeText 可能永远 pending、既不 resolve 也不 reject。
   */
  function handleCopyLink() {
    const link = generatedLink || buildLink()
    if (!link) {
      setStatus({ kind: 'bad', msg: '当前没有可复制的存档' })
      return
    }
    setGeneratedLink(link)

    // 方案 1：execCommand('copy') —— 移动端 WKWebView 兜底首选
    function tryExecCommand(): boolean {
      const tmp = document.createElement('textarea')
      tmp.value = link
      tmp.setAttribute('readonly', '')
      tmp.style.position = 'fixed'
      tmp.style.top = '0'
      tmp.style.left = '0'
      tmp.style.width = '1px'
      tmp.style.height = '1px'
      tmp.style.opacity = '0'
      document.body.appendChild(tmp)
      tmp.focus()
      try { tmp.setSelectionRange(0, link.length) } catch { /* ignore */ }
      tmp.select()
        let ok = false
      try { ok = document.execCommand('copy') } catch { ok = false }
      document.body.removeChild(tmp)
      return ok
    }

    if (tryExecCommand()) {
      setStatus({
        kind: 'ok',
        msg: `链接已复制（${link.length} 字符）—— 去小红书私信/保存草稿发给自己，下次点开即继续`,
      })
      return
    }

    // 方案 2：navigator.clipboard —— 桌面浏览器备选
    if (navigator.clipboard?.writeText) {
      let settled = false
      const finish = (k: 'ok' | 'info', m: string) => {
        if (settled) return
        settled = true
        setStatus({ kind: k, msg: m })
      }
      // 兜底超时：800ms 还没响应就放弃（小红书容器常见）
      const timeoutId = window.setTimeout(() => {
        finish('info', '复制未响应，📱 手机请长按下方链接框选「拷贝」')
      }, 800)
      try {
        navigator.clipboard.writeText(link).then(
          () => {
            window.clearTimeout(timeoutId)
            finish('ok', `链接已复制（${link.length} 字符）—— 去小红书私信发给自己，下次点开即继续`)
          },
          () => {
            window.clearTimeout(timeoutId)
            finish('info', '复制被浏览器拦截，📱 手机请长按下方链接框选「拷贝」')
          },
        )
      } catch {
        window.clearTimeout(timeoutId)
        finish('info', '复制失败，📱 手机请长按下方链接框选「拷贝」')
      }
      return
    }

    // 方案 3：完全不支持剪贴板 —— 提示长按
    setStatus({ kind: 'info', msg: '当前环境不支持自动复制，📱 手机请长按下方链接框选「拷贝」' })
  }

  function handleImportLink() {
    const json = decodeSaveFromUrl(linkInput)
    if (!json) {
      setStatus({ kind: 'bad', msg: '链接解析失败，请确认是本游戏的存档链接（不是其他网页 URL）' })
      return
    }
    const r = writeSaveBlob(json)
    setStatus({ kind: r.ok ? 'ok' : 'bad', msg: r.msg })
    if (r.ok) setTimeout(() => location.reload(), 600)
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(20,40,55,.55)' }} onClick={onClose}>
      <div
        className="panel-white mx-4 my-6 w-full max-w-md overflow-hidden"
        style={{ borderRadius: 18, maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 顶部 */}
        <div className="px-4 pt-4 pb-3 flex items-center" style={{ borderBottom: '1.5px solid #f5e8d0' }}>
          <div className="font-900 text-base" style={{ color: '#3d2b10' }}>⚙️ 存档设置</div>
          <button className="ml-auto top-icon-btn" style={{ width: 28, height: 28 }} onClick={onClose}>✕</button>
        </div>

        {/* 正文 */}
        <div className="px-4 py-3 overflow-auto" style={{ flex: 1 }}>
          {/* 状态卡片 */}
          <div className="panel-orange p-3 mb-3" style={{ borderRadius: 14 }}>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,.92)' }}>
              <span>📍 当前进度</span>
              <span className="ml-auto font-900" style={{ color: 'white' }}>
                🪙 {Math.floor(state.money).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1.5" style={{ color: 'rgba(255,255,255,.85)' }}>
              <span>📦 货舱 {Object.values(state.cargo).reduce((s, c) => s + c.qty, 0)} 件</span>
              <span className="ml-auto">{hasSave ? '✅ 已有存档' : '⚠️ 当前没有存档'}</span>
            </div>
            <div className="text-[11px] mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,.78)' }}>
              💡 小红书容器每次进入都是新的浏览器窗口，<b style={{ color: 'white' }}>localStorage 不会自动保留</b>。建议每次退出前点「导出存档」，下次进入时再「导入」。
            </div>
          </div>

          {/* 导出 */}
          <Section title="📤 导出存档">
            <BtnRow>
              <button className="btn-orange flex-1 py-2.5 text-sm" onClick={handleExport}>
                ⬇️ 下载 .json 文件
              </button>
              <button className="btn-ghost-orange px-3 py-2.5 text-sm" onClick={handleCopyOnly} title="复制到剪贴板">
                📋 复制
              </button>
            </BtnRow>
          </Section>

          {/* ⭐ 短链：最推荐的小红书存档方式 */}
          <Section title="📎 存档短链（推荐）">
            <BtnRow>
              <button className="btn-orange flex-1 py-2.5 text-sm" onClick={handleMakeLink}>
                🔗 生成长链
              </button>
              <button className="btn-ghost-orange px-3 py-2.5 text-sm" onClick={handleCopyLink} title="复制长链">
                📋 复制链接
              </button>
            </BtnRow>
            {generatedLink && (
              <textarea
                ref={linkRef}
                readOnly
                value={generatedLink}
                onFocus={selectLinkText}
                onClick={selectLinkText}
                onTouchStart={selectLinkText}
                className="w-full p-2 text-[10px] font-mono mt-2"
                style={{
                  borderRadius: 10,
                  border: '1.5px solid #f0e2c8',
                  background: '#fff8f0',
                  color: '#3d2b10',
                  minHeight: 60,
                  maxHeight: 120,
                  resize: 'vertical',
                  outline: 'none',
                  wordBreak: 'break-all',
                  WebkitUserSelect: 'all',
                  userSelect: 'all',
                }}
              />
            )}
            <div className="text-[11px] mt-2 mb-1.5" style={{ color: '#a07030' }}>
              或粘贴已保存的链接导入：
            </div>
            <textarea
              value={linkInput}
              onChange={e => setLinkInput(e.target.value)}
              placeholder="粘贴完整链接 或 仅 ?save= 后面那段"
              className="w-full p-2 text-[11px] font-mono"
              style={{
                borderRadius: 10,
                border: '1.5px solid #f0e2c8',
                background: '#fff8f0',
                color: '#3d2b10',
                minHeight: 60,
                resize: 'vertical',
                outline: 'none',
              }}
            />
            <button
              className="btn-green w-full py-2 text-xs mt-2"
              disabled={!linkInput.trim()}
              style={{ opacity: !linkInput.trim() ? 0.45 : 1 }}
              onClick={handleImportLink}
            >
              🔁 从链接导入并重启
            </button>
          </Section>

          {/* 导入 */}
          <Section title="📥 导入存档">
            <BtnRow>
              <button
                className="btn-green flex-1 py-2.5 text-sm"
                onClick={() => fileRef.current?.click()}
              >
                📂 选择文件
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json,.txt"
                className="hidden"
                onChange={handleFileSelected}
              />
            </BtnRow>
            <div className="text-[11px] mt-2 mb-1.5" style={{ color: '#a07030' }}>
              或粘贴 JSON 文本：
            </div>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder='{"money":3000,"cityId":"china",…}'
              className="w-full p-2 text-[11px] font-mono"
              style={{
                borderRadius: 10,
                border: '1.5px solid #f0e2c8',
                background: '#fff8f0',
                color: '#3d2b10',
                minHeight: 80,
                resize: 'vertical',
                outline: 'none',
              }}
            />
            <button
              className="btn-green w-full py-2 text-xs mt-2"
              disabled={!importText.trim()}
              style={{ opacity: !importText.trim() ? 0.45 : 1 }}
              onClick={handlePasteImport}
            >
              🔁 导入并重启
            </button>
          </Section>

          {/* 危险区 */}
          <Section title="⚠️ 危险操作">
            <button
              className="w-full py-2.5 text-sm font-800"
              style={{
                borderRadius: 12,
                background: '#fff0e8',
                color: '#c05050',
                border: '1.5px solid #f5c8b8',
              }}
              onClick={handleReset}
            >
              🗑️ 清空存档，重新开始
            </button>
          </Section>

          {/* 状态消息 */}
          {status && (
            <div
              className="text-xs p-2.5 mt-2"
              style={{
                borderRadius: 10,
                background: status.kind === 'ok' ? '#e8f6ec' : status.kind === 'bad' ? '#fcecec' : '#fff5ec',
                color: status.kind === 'ok' ? '#3f9d52' : status.kind === 'bad' ? '#c05050' : '#8a6a40',
                border: `1.5px solid ${status.kind === 'ok' ? '#cce8d4' : status.kind === 'bad' ? '#f5c8c8' : '#f0e2c8'}`,
              }}
            >
              {status.msg}
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="px-4 py-3" style={{ borderTop: '1.5px solid #f5e8d0', background: '#fff8f0' }}>
          <button
            className="btn-ghost-orange w-full py-2.5 text-sm font-800"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-800 mb-2" style={{ color: '#8a6a40' }}>{title}</div>
      {children}
    </div>
  )
}

function BtnRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2">{children}</div>
}