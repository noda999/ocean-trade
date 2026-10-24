// ─────────────────────────────────────────────────────────────────────────────
//  小红书小工具原生能力桥接
//
//  仅在小工具容器内（window.xhs.miniTool 存在）可用；普通网页 / Vercel / dev 下
//  所有方法自动空操作，组件据此决定是否渲染相关 UI，绝不报错。
//
//  接口依据《小工具容器能力清单》（容器能力清单）：
//    §3.3  postNote                  唤起笔记发布页（带图/视频），用于分享战绩
//    §3.4  saveImageToPhotosAlbum     保存图片到相册（替代 <a download>）
//    §3.5  writeTempFile              base64 → 容器临时文件（postNote/saveImage 传图桥）
//    §3.7  Storage（setStorage 等）    已在 storage.ts 用于存档兜底
//    §3.11 getWindowInfo              窗口/安全区/胶囊按钮位置（避让右上角胶囊）
//    §3.13 vibrateShort / vibrateLong 触感反馈（9.50+）
//    §3.15 followAuthor / getFollowStatus  关注作者（9.51+）
//    §3.6  getLaunchOptions           读 buildVersion 做版本门控
//
//  返回约定：不传 success/fail/complete 回调时返回 Promise；传了则返回 undefined。
//  失败时（reject / 函数不存在）一律吞掉并返回 null / false，保证网页端零影响。
// ─────────────────────────────────────────────────────────────────────────────

interface FollowResult {
  follow_status: number
  errMsg?: string
}

interface WindowInfo {
  pixelRatio?: number
  screenWidth?: number
  screenHeight?: number
  windowWidth?: number
  windowHeight?: number
  statusBarHeight?: number
  screenTop?: number
  safeArea?: { top: number; right: number; bottom: number; left: number }
  menuButtons?: { left: number; right: number; top: number; bottom: number; width: number; height: number }
}

interface LaunchOptions {
  miniToolEnv?: { buildVersion?: string; userDataPath?: string }
  [k: string]: unknown
}

export interface PostNoteOptions {
  title?: string
  content?: string
  pageType?: string
  mediaInfo: {
    image_resources?: { url: string }[]
    video_resources?: { video_url: string; cover_url?: string }
    live_photo_sources?: { url: string; video_url: string }[]
  }
}

interface MiniTool {
  followAuthor?: (opts?: Record<string, unknown>) => Promise<FollowResult> | undefined
  getFollowStatus?: (opts?: Record<string, unknown>) => Promise<FollowResult> | undefined
  writeTempFile?: (opts: { data: string }) => Promise<{ filePath: string }> | undefined
  saveImageToPhotosAlbum?: (opts: { filePath: string }) => Promise<unknown> | undefined
  postNote?: (opts: PostNoteOptions) => Promise<unknown> | undefined
  vibrateShort?: (opts: { type: string }) => Promise<unknown> | undefined
  vibrateLong?: (opts?: Record<string, unknown>) => Promise<unknown> | undefined
  getWindowInfo?: (opts?: Record<string, unknown>) => Promise<WindowInfo> | undefined
  getLaunchOptions?: (opts?: Record<string, unknown>) => Promise<LaunchOptions> | undefined
  [k: string]: unknown
}

function getMiniTool(): MiniTool | null {
  try {
    const m = (window as unknown as { xhs?: { miniTool?: MiniTool } }).xhs?.miniTool
    return m && typeof m === 'object' ? m : null
  } catch {
    return null
  }
}

/** 统一调用：函数不存在 / 失败均返回 null，绝不抛错 */
async function safeCall<T = unknown>(api: keyof MiniTool, opts?: unknown): Promise<T | null> {
  const m = getMiniTool()
  if (!m) return null
  const fn = m[api]
  if (typeof fn !== 'function') return null
  try {
    return (await fn.call(m, opts)) as T
  } catch {
    return null
  }
}

// ── 关注作者（§3.15）─────────────────────────────────────────────────────────

/** 是否运行在小红书小工具容器且关注能力可用 */
export function canFollowAuthor(): boolean {
  const m = getMiniTool()
  return !!(m && typeof m.followAuthor === 'function' && typeof m.getFollowStatus === 'function')
}

async function callFollow(api: 'followAuthor' | 'getFollowStatus'): Promise<number | null> {
  const r = await safeCall<FollowResult>(api)
  if (r && typeof r.follow_status === 'number') return r.follow_status
  return null
}

/** 查询当前用户与小工具作者的关注状态；非 XHS 或失败返回 null */
export function getAuthorFollowStatus(): Promise<number | null> {
  return callFollow('getFollowStatus')
}

/** 引导关注作者；返回操作后的状态（null 表示未变更 / 不可用） */
export function followAuthor(): Promise<number | null> {
  return callFollow('followAuthor')
}

// ── 分享 / 相册（§3.3 / §3.4 / §3.5）───────────────────────────────────────

/** 是否可唤起笔记发布（分享战绩到小红书） */
export function canPostNote(): boolean {
  const m = getMiniTool()
  return !!(m && typeof m.postNote === 'function')
}

/** 是否可保存图片到相册（需 writeTempFile 配合） */
export function canSaveImage(): boolean {
  const m = getMiniTool()
  return !!(m && typeof m.saveImageToPhotosAlbum === 'function' && typeof m.writeTempFile === 'function')
}

/** base64（可带 data: 前缀）写入容器临时文件，返回临时路径；失败返回 null */
export async function writeTempFile(data: string): Promise<string | null> {
  const r = await safeCall<{ filePath: string }>('writeTempFile', { data })
  return r?.filePath ?? null
}

/** 保存图片到系统相册（filePath 为 writeTempFile 返回的临时路径或 data: base64） */
export async function saveImageToPhotosAlbum(filePath: string): Promise<boolean> {
  const r = await safeCall('saveImageToPhotosAlbum', { filePath })
  return r != null
}

/** 唤起小红书笔记发布页，带入图片（与战绩图分享）。成功返回 true */
export async function postNote(opts: PostNoteOptions): Promise<boolean> {
  const r = await safeCall('postNote', opts)
  return r != null
}

// ── 触感反馈（§3.13，9.50+）──────────────────────────────────────────────────

export function vibrateShort(type: 'heavy' | 'medium' | 'light' = 'medium'): void {
  const m = getMiniTool()
  if (!m || typeof m.vibrateShort !== 'function') return
  try { void m.vibrateShort({ type }) } catch {}
}

export function vibrateLong(): void {
  const m = getMiniTool()
  if (!m || typeof m.vibrateLong !== 'function') return
  try { void m.vibrateLong() } catch {}
}

// ── 版本门控（§3.6）/ 安全区避让（§3.11）──────────────────────────────────

let CACHED_VERSION: string | null = null

/** 读 buildVersion 并缓存（启动时调一次）；非 XHS / 失败返回 null */
export async function cacheXhsVersion(): Promise<string | null> {
  const r = await safeCall<LaunchOptions>('getLaunchOptions')
  const v = r?.miniToolEnv?.buildVersion
  if (v) {
    CACHED_VERSION = v
    return v
  }
  return CACHED_VERSION
}

export function getClientVersion(): string | null {
  return CACHED_VERSION
}

function parseVersion(v: string): number[] {
  return v.split('.').map(n => parseInt(n, 10) || 0)
}

/** 客户端版本是否不低于 min（如 '9.50'）；未拿到版本号时保守返回 false */
export function clientVersionAtLeast(min: string): boolean {
  if (!CACHED_VERSION) return false
  const a = parseVersion(CACHED_VERSION)
  const b = parseVersion(min)
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] || 0
    const y = b[i] || 0
    if (x > y) return true
    if (x < y) return false
  }
  return true
}

/**
 * 读取窗口信息，把右上角胶囊按钮留白（--xhs-capsule-safe）与状态栏高度
 * （--xhs-status-bar）写到 :root，供 CSS 避让（解决「胶囊盖住关闭按钮」）。
 * 非 XHS / 失败无副作用。
 */
export async function applyXhsSafeArea(): Promise<void> {
  const r = await safeCall<WindowInfo>('getWindowInfo')
  if (!r) return
  const root = document.documentElement
  const status = (r.statusBarHeight || 0) + (r.screenTop || 0)
  if (status) root.style.setProperty('--xhs-status-bar', `${status}px`)
  if (r.menuButtons && typeof r.windowWidth === 'number') {
    const safe = Math.max(0, r.windowWidth - r.menuButtons.left)
    if (safe) root.style.setProperty('--xhs-capsule-safe', `${safe}px`)
  }
}
