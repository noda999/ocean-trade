// ─────────────────────────────────────────────────────────────────────────────
//  小红书小工具原生能力桥接
//
//  仅在小工具容器内（window.xhs.miniTool 存在）可用；普通网页 / Vercel / dev 下
//  所有方法自动空操作，组件据此决定是否渲染相关 UI，绝不报错。
//
//  关注作者 API（容器能力清单 §3.15，最低客户端 9.51+）：
//    miniTool.followAuthor()      引导关注「当前小工具作者」（平台绑定，无需传 id）
//    miniTool.getFollowStatus()   查询关注状态
//    返回 follow_status：
//      -1 接口失败 / 0 未关注(含未登录) / 1 已关注 / 2 当前用户是作者本人
//    约定：不传 success/fail/complete 回调时返回 Promise；传了则返回 undefined。
// ─────────────────────────────────────────────────────────────────────────────

interface FollowResult {
  follow_status: number
  errMsg?: string
}

interface MiniTool {
  followAuthor?: (opts?: Record<string, unknown>) => Promise<FollowResult> | undefined
  getFollowStatus?: (opts?: Record<string, unknown>) => Promise<FollowResult> | undefined
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

/** 是否运行在小红书小工具容器且关注能力可用 */
export function canFollowAuthor(): boolean {
  const m = getMiniTool()
  return !!(m && typeof m.followAuthor === 'function' && typeof m.getFollowStatus === 'function')
}

async function call(api: 'followAuthor' | 'getFollowStatus'): Promise<number | null> {
  const m = getMiniTool()
  if (!m) return null
  const fn = m[api]
  if (typeof fn !== 'function') return null
  try {
    const r = await (fn.call(m) as Promise<FollowResult>)
    if (r && typeof r.follow_status === 'number') return r.follow_status
    return null
  } catch {
    // 用户关闭确认框(errCode 20002) / 频次上限(15404) / 重复调用(10003) 等 → 视为未变更
    return null
  }
}

/** 查询当前用户与小工具作者的关注状态；非 XHS 或失败返回 null */
export function getAuthorFollowStatus(): Promise<number | null> {
  return call('getFollowStatus')
}

/** 引导关注作者；返回操作后的状态（null 表示未变更 / 不可用） */
export function followAuthor(): Promise<number | null> {
  return call('followAuthor')
}
