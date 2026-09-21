# 远洋贸易 · 大航海经商模拟

一个纯前端的单页经商模拟游戏：从中国港口起航，环游 21 座大航海时代的城市，低买高卖 29 种货物，应对海上风暴与海盗，去酒馆招募航海好手，升级帆船、登顶功勋榜，目标 12 万总资产通关。

> 线上试玩：https://ocean-trade-sigma.vercel.app/

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- 纯前端实现：游戏状态通过 React Context + Reducer 驱动，存档保存在浏览器 localStorage，无需后端

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本到 dist/
```

## 部署与更新

本项目托管在 GitHub（[noda999/ocean-trade](https://github.com/noda999/ocean-trade)），并通过 **Vercel** 自动部署：每次 `git push` 后约 1 分钟，线上版本自动更新。构建配置锁定在 [`vercel.json`](./vercel.json)（framework: vite → `npm run build` → `dist`）。

本地改动后发布新版本：

```bash
git add .
git commit -m "更新说明"
git push
```

> 首次部署 Vercel 的方式：vercel.com 用 GitHub 账号登录 → Add New Project → Import 本仓库 → 直接 Deploy（Vite 项目零配置）。

## 小红书小工具

除标准构建外，还提供小红书容器专用构建（相对路径、IIFE、ES2017，兼容容器内老 WebView）：

```bash
npm run pack:all        # 构建 dist/ + dist-xhs/ 并打包 ocean-trade-minitool.zip
npm run preview:xhs     # 本地模拟容器环境验证 zip
```

## 玩法速览

- **贸易**：每座港口只经营自己的特产 + 紧缺货 —— 产地买特产、销地卖紧缺，跨区域跑差价最赚
- **行情**：市场价格周期波动，还会随机出现"紧缺行情"暴涨暴跌；可购买情报终端查看全局最优商路
- **事件**：航行中可能遭遇风暴、海盗，也可能捡到漂流的宝箱
- **酒馆**：12 位航海好手散布在世界各港，亲自到对应港口才能雇佣，提供永久的航速 / 利润加成
- **地图**：平面地图 ⇄ 球形地球双模式，标注大洋海峡与雪山、沙丘等手绘地形；座舰自带金色光晕高亮
- **升级**：多档商船（容量与航速不同），船坞可改名、查看已雇佣船员
- **成就**：功勋榜资金里程碑，达成即领大奖
- **存档**：每 3 秒自动保存，设置里可手动存 / 读 / 删档，还可一键重看新手导览

## 版本

当前 v1.0.4 —— 酒馆招募、座舰金色高亮、地理标注与地形贴纸、重看新手导览。详见游戏内更新日志。
