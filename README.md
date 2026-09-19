# 远洋贸易 · 大航海经商模拟

一个纯前端的单页经商模拟游戏：从中国港口起航，环游 15 座大航海时代的城市，低买高卖 22 种特产，应对海上风暴与海盗，升级舰队、解锁成就，目标是攒下 100 万金币。

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

本项目托管在 GitHub（[noda999/ocean-trade](https://github.com/noda999/ocean-trade)），并通过 **Vercel** 自动部署：每次 `git push` 后约 1 分钟，线上版本自动更新。

本地改动后发布新版本：

```bash
git add .
git commit -m "更新说明"
git push
```

> 首次部署 Vercel 的方式：vercel.com 用 GitHub 账号登录 → Add New Project → Import 本仓库 → 直接 Deploy（Vite 项目零配置）。

## 玩法速览

- **贸易**：每座城市有 5～6 种在售货物，原产地便宜、远方昂贵；航行耗时按真实航线距离计算
- **行情**：市场价格周期波动，还会随机出现"紧缺行情"暴涨暴跌
- **事件**：航行中可能遭遇风暴、海盗，也可能捡到漂流的宝箱
- **升级**：3 档商船（容量与航速不同），可购买情报终端查看全局行情
- **成就**：8 个资金里程碑，全部达成即通关
