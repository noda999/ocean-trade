// 把 xhs-cards.html 中的 5 张卡片渲染成 1080×1440 PNG
const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const OUT = path.join(__dirname, 'cards')
fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge' })
  const ctx = await browser.newContext({
    viewport: { width: 600, height: 800 },
    deviceScaleFactor: 2,
  })
  const page = await ctx.newPage()
  await page.goto('http://127.0.0.1:8443/xhs-cards.html', { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  for (let i = 0; i < 5; i++) {
    const card = page.locator('.card').nth(i)
    const file = path.join(OUT, `xhs-${String(i + 1).padStart(2, '0')}.png`)
    await card.screenshot({ path: file, omitBackground: false })
    console.log('saved:', file)
  }

  await browser.close()
})()