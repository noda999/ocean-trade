// ─────────────────────────────────────────────────────────────────────────────
//  跨端持久化存储抽象
//
//  背景：小红书小工具容器里 localStorage / IndexedDB / Cookie 都「不保证始终可用或
//  数据有效」（见小工具容器能力清单 §2.4 / §3.7），可能静默丢失。平台推荐改用
//  miniTool 提供的 Storage JS API（客户端 9.46+，如 miniTool.setStorage/getStorage）。
//
//  策略（网页版 / Vercel / dev 与 XHS 通用）：
//    1. 普通网页：没有 window.xhs，直接走 localStorage（主力）。
//    2. XHS 沙箱：优先尝试平台 Storage API；拿不到或抛错时回退 localStorage。
//    3. 写档同时镜像到「平台 + localStorage」两条路（best-effort），提高存活率。
//    4. 任何读写异常一律吞掉，绝不让存储问题导致白屏 → 容忍丢失。
//
//  平台 API 在不同客户端版本形态可能不同（同步返回 / 返回 Promise），且具体方法名
//  与入参约定以官方为准。这里做防御式兼容：读取只认「字符串或可拆出字符串的对象」，
//  拿到 Promise 则在读路径忽略（无法同步使用），写入时给 Promise 补 .catch 防漏。
// ─────────────────────────────────────────────────────────────────────────────

type PlatformStore = {
  get?: (key: string) => unknown
  set?: (key: string, value: string) => unknown
  remove?: (key: string) => unknown
}

function platformStorage(): PlatformStore | null {
  try {
    const mt = (window as unknown as { xhs?: { miniTool?: Record<string, unknown> } }).xhs?.miniTool
    if (mt && typeof mt === 'object') {
      const fn = (n: string) => (typeof mt[n] === 'function' ? (mt[n] as (...a: unknown[]) => unknown) : undefined)
      const get = fn('getStorage') ?? fn('get')
      const set = fn('setStorage') ?? fn('set')
      const remove = fn('removeStorage') ?? fn('remove')
      if (get || set || remove) return { get, set, remove }
    }
  } catch {
    /* 探测失败，当作无平台存储 */
  }
  return null
}

function isThenable(v: unknown): v is Promise<unknown> {
  return !!v && (typeof v === 'object' || typeof v === 'function') && typeof (v as { then?: unknown }).then === 'function'
}

/** 读：平台优先（仅当能同步拿到字符串），否则回退 localStorage；失败返回 null */
export function safeGet(key: string): string | null {
  const mt = platformStorage()
  if (mt?.get) {
    try {
      const r = mt.get(key)
      if (!isThenable(r)) {
        if (typeof r === 'string') return r
        if (r && typeof r === 'object') {
          const data = (r as { data?: unknown }).data
          if (typeof data === 'string') return data
        }
      }
    } catch {
      /* 平台读失败 → 回退 localStorage */
    }
  }
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/** 写：本地点 localStorage（网页主力），并 best-effort 镜像到平台存储 */
export function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* 本地不可用，忽略 */
  }
  const mt = platformStorage()
  if (mt?.set) {
    try {
      const r = mt.set(key, value)
      if (isThenable(r)) r.catch(() => {})
    } catch {
      /* 平台写失败，忽略 */
    }
  }
}

/** 删：本地 + 平台都清理，best-effort */
export function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
  const mt = platformStorage()
  if (mt?.remove) {
    try {
      const r = mt.remove(key)
      if (isThenable(r)) r.catch(() => {})
    } catch {
      /* ignore */
    }
  }
}
