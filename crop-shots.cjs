// 从 crops.html 渲染精确裁剪图
const { chromium } = require('playwright')
const path = require('path')

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge' })
  const page = await browser.newPage({ viewport: { width: 820, height: 900 }, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:8443/crops.html', { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  const jobs = [
    ['#crop-market', '03-market-crop.png'],
    ['#crop-tavern', '05-tavern-crop.png'],
  ]
  for (const [sel, out] of jobs) {
    await page.locator(sel).screenshot({ path: path.join(__dirname, 'shots', out) })
    console.log('cropped:', out)
  }

  await browser.close()
})()