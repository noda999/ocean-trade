/**
 * 小红书版产物的本地预览服务器。
 *
 * 与 `python -m http.server` 的区别：所有响应带 `Cache-Control: no-store`。
 * 不然预览 WebView 会缓存旧的 index-*.js，重建后仍然执行旧代码、
 * 报出上一个版本的运行时错误，看起来像"修复没生效"。
 *
 * 用法：npm run preview:xhs   →  http://127.0.0.1:5181/
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..', 'dist-xhs')
const PORT = Number(process.env.PORT || 5181)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
}

if (!fs.existsSync(ROOT)) {
  console.error(`未找到 ${ROOT}，请先执行：npm run build:xhs`)
  process.exit(1)
}

http
  .createServer((req, res) => {
    let pathname
    try {
      pathname = decodeURIComponent((req.url || '/').split('?')[0])
    } catch {
      pathname = '/'
    }
    if (pathname === '/') pathname = '/index.html'

    const file = path.join(ROOT, pathname)
    // 防目录穿越
    if (!file.startsWith(ROOT)) {
      res.writeHead(403)
      res.end('forbidden')
      return
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404)
        res.end('not found')
        return
      }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      })
      res.end(data)
    })
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`小红书版预览（禁用缓存）：http://127.0.0.1:${PORT}/`)
  })
