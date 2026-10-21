/**
 * TapTap 小游戏/H5 广告封装（广告位 ID 由控制台注入）
 *
 * 仅在 TapTap 小游戏/H5 宿主中 window.tap 才存在；普通浏览器 / 开发预览里
 * TapAdManager 全部静默降级：不弹广告、不误发奖励、不影响游戏运行。
 *
 * 广告位 ID（SPACE_ID）由 check_ads_status 自动获取并注入，请勿手改。
 */

declare global {
  interface Window {
    tap?: TapSdk
  }
}

interface TapAdInstance {
  load(): Promise<void>
  show(): Promise<void>
  onLoad(cb: () => void): void
  onError(cb: (err: { errCode?: number; errMsg?: string }) => void): void
  onClose(cb: (res: { isEnded?: boolean }) => void): void
  destroy(): void
}

interface TapSdk {
  createRewardedVideoAd(opts: { adUnitId: string }): TapAdInstance
  createInterstitialAd(opts: { adUnitId: string }): TapAdInstance
  createBannerAd(opts: {
    adUnitId: string
    style?: Record<string, unknown>
    adIntervals?: number
  }): TapAdInstance
  getSystemInfoSync(): { screenWidth: number; screenHeight: number }
}

const SPACE_ID = '1054324'

class TapAdManager {
  private rewarded: TapAdInstance | null = null
  private interstitial: TapAdInstance | null = null
  private banner: TapAdInstance | null = null
  private rewardCb: (() => void) | null = null

  /** 是否处于 TapTap 宿主环境（有可用的 tap SDK） */
  get available(): boolean {
    return typeof window !== 'undefined' && typeof window.tap !== 'undefined'
  }

  /** 初始化广告（激励视频 + 插屏）。非 TapTap 环境静默跳过 */
  async init(): Promise<void> {
    if (!this.available) {
      console.info('[AdManager] 非 TapTap 环境，广告已静默降级')
      return
    }
    const tap = window.tap!
    this.initRewarded(tap)
    this.initInterstitial(tap)
  }

  /** 绑定「看完广告」奖励回调（用户完整观看后自动调用） */
  onReward(cb: () => void): void {
    this.rewardCb = cb
  }

  /** 展示激励视频广告 */
  showRewarded(): void {
    if (!this.rewarded) {
      console.warn('[AdManager] 激励视频未初始化')
      return
    }
    this.rewarded
      .show()
      .catch(() =>
        this.rewarded!
          .load()
          .then(() => this.rewarded!.show())
          .catch((e) => console.error('[AdManager] 激励视频重试失败', e)),
      )
  }

  /** 展示插屏广告 */
  showInterstitial(): void {
    this.interstitial?.show()
  }

  /** 初始化 Banner 广告 */
  initBanner(opts: { width?: number; height?: number; position?: 'top' | 'bottom' } = {}): void {
    if (!this.available) return
    const tap = window.tap!
    const info = tap.getSystemInfoSync()
    const height = opts.height ?? 100
    const style: Record<string, unknown> = {
      left: 0,
      width: opts.width ?? info.screenWidth,
      height,
      top: opts.position === 'top' ? 0 : info.screenHeight - height,
    }
    this.banner = tap.createBannerAd({ adUnitId: SPACE_ID, style, adIntervals: 30 })
    this.banner.onError((e) => console.error('[AdManager] Banner 错误', e.errMsg))
  }

  showBanner(): void {
    this.banner?.show().catch((e) => console.error('[AdManager] Banner 显示失败', e))
  }

  hideBanner(): void {
    this.banner?.hide()
  }

  /** 销毁所有广告实例 */
  destroy(): void {
    this.rewarded?.destroy()
    this.rewarded = null
    this.interstitial?.destroy()
    this.interstitial = null
    this.banner?.destroy()
    this.banner = null
  }

  private initRewarded(tap: TapSdk): void {
    const ad = tap.createRewardedVideoAd({ adUnitId: SPACE_ID })
    ad.onLoad(() => console.info('[AdManager] 激励视频就绪'))
    ad.onError((e) => console.error('[AdManager] 激励视频错误', e.errCode, e.errMsg))
    ad.onClose((res) => {
      if (res?.isEnded) {
        this.rewardCb?.()
      } else {
        console.info('[AdManager] 用户提前关闭，未发放奖励')
      }
    })
    ad.load().catch((e) => console.error('[AdManager] 激励视频预加载失败', e))
    this.rewarded = ad
  }

  private initInterstitial(tap: TapSdk): void {
    const ad = tap.createInterstitialAd({ adUnitId: SPACE_ID })
    ad.onError((e) => console.error('[AdManager] 插屏错误', e.errCode, e.errMsg))
    ad.load().catch((e) => console.error('[AdManager] 插屏预加载失败', e))
    this.interstitial = ad
  }
}

export const adManager = new TapAdManager()
