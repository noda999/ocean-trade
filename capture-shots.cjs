// 捕获真实游戏截图，用于小红书卡片设计
const { chromium } = require('playwright')
const path = require('path')

const OUT = path.join(__dirname, 'shots')
require('fs').mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge' })
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
  })
  const page = await ctx.newPage()

  // 跳过新手导览与更新日志
  await page.addInitScript(() => {
    localStorage.setItem('ocean-trade-onboarding-done', '1')
    localStorage.setItem('ocean-trade-changelog-seen', 'v1.0.4')
    // 先放一些金币以便看到更多内容
    const raw = localStorage.getItem('ocean-trade-save-v1')
    if (raw) {
      try {
        const s = JSON.parse(raw)
        if (s.state) {
          s.state.money = 5000
          s.state.intelOwned = true
          s.state.visited = ['cn', 'jp', 'ml', 'in', 'az', 'inca']
          // 买点茶叶赶一些货，让货舱有内容
          s.state.cargo = { tea: { qty: 14, buyPrice: 30 } }
          localStorage.setItem('ocean-trade-save-v1', JSON.stringify(s))
        }
      } catch {}
    }
  })

  await page.goto('http://127.0.0.1:8443/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  // 1. 平面地图（默认页）
  await page.screenshot({ path: path.join(OUT, '01-map-flat.png') })

  // 2. 球形地球（点地图模式切换里的第一个按钮 = 🌍）
  await page.evaluate(() => {
    const btns = document.querySelectorAll('.map-mode-toggle button')
    if (btns[0]) btns[0].click()
  })
  await page.waitForTimeout(2200)
  const globeOk = await page.evaluate(() => !!document.querySelector('canvas, .globe-wrap, [class*=globe]'))
  console.log('地球模式已切换:', globeOk)
  await page.screenshot({ path: path.join(OUT, '02-globe.png') })

  // 切回平面
  await page.evaluate(() => {
    const btns = document.querySelectorAll('.map-mode-toggle button')
    if (btns[1]) btns[1].click()
  })
  await page.waitForTimeout(800)

  // 3. 市场页（商品列表展开态）
  await page.evaluate(() => {
    const n = document.querySelectorAll('.nav-btn')
    if (n[1]) n[1].click()
  })
  await page.waitForTimeout(700)
  // 滚动到商品区并展开一张商品卡（展示定价 / 买入按钮）
  await page.evaluate(() => {
    const sc = [...document.querySelectorAll('div')]
      .filter(e => e.scrollHeight - e.clientHeight > 300)
      .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0]
    if (sc) sc.scrollTop = 620
  })
  await page.waitForTimeout(500)
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll('button, div')].filter(
      e => /茶叶/.test(e.textContent.trim()) && e.textContent.length < 90 && e.offsetParent && e.getBoundingClientRect().width > 120
    )
    if (cards.length) cards[cards.length - 1].click()
  })
  await page.waitForTimeout(600)
  const mkt = await page.evaluate(() => {
    const t = document.body.innerText
    return { hasBuy: t.includes('买入'), hasPrice: /\d+\s*金\/件/.test(t) }
  })
  console.log('市场页状态:', JSON.stringify(mkt))
  await page.screenshot({ path: path.join(OUT, '03-market.png') })

  // 4. 货舱页（买入10件后展示）
  // 先确保买了
  await page.evaluate(() => {
    const buy = [...document.querySelectorAll('button')].find(x => x.textContent.includes('买入') && x.offsetParent)
    if (buy) buy.click()
  })
  await page.waitForTimeout(500)
  await page.evaluate(() => {
    const n = document.querySelectorAll('.nav-btn')
    if (n[2]) n[2].click()
  })
  await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(OUT, '04-cargo.png') })

  // 5. 船坞 → 酒馆
  await page.evaluate(() => {
    const n = document.querySelectorAll('.nav-btn')
    if (n[3]) n[3].click()
  })
  await page.waitForTimeout(700)
  // 切到酒馆标签
  await page.evaluate(() => {
    const t = document.querySelector('.tavern-toggle')
    if (t) t.click()
  })
  await page.waitForTimeout(800)
  // 滚到中间位置（展示船员）
  await page.evaluate(() => {
    const sc = [...document.querySelectorAll('.overflow-auto')].find(e => e.scrollHeight > e.clientHeight)
    if (sc) sc.scrollTop = 200
  })
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(OUT, '05-tavern.png') })

  // 6. 功勋榜
  await page.evaluate(() => {
    const n = document.querySelectorAll('.nav-btn')
    if (n[4]) n[4].click()
  })
  await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(OUT, '06-quest.png') })

  // 7. 航行中（封面的动感素材）：回到地图，点远方的城启航，海上截一张
  await page.evaluate(() => {
    const n = document.querySelectorAll('.nav-btn')
    if (n[0]) n[0].click()
  })
  await page.waitForTimeout(700)
  // 点日本（较近，航行中能稳定截到海面）
  await page.evaluate(() => {
    const hits = [...document.querySelectorAll('.city-hit')].filter(e => /日本/.test(e.textContent))
    if (hits.length) hits[0].click()
  })
  await page.waitForTimeout(600)
  // 确认抽屉里的启航按钮
  await page.evaluate(() => {
    const sail = [...document.querySelectorAll('button')].find(b => /启航|出发|起航/.test(b.textContent) && b.offsetParent)
    if (sail) sail.click()
  })
  await page.waitForTimeout(3500)
  await page.screenshot({ path: path.join(OUT, '07-sailing.png') })

  await browser.close()
  console.log('完成，输出目录:', OUT)
})()