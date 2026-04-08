# Pixel Ledger

Pixel Ledger 是一个纯前端的极简像素风记账网页，使用 React + Vite + JavaScript 构建，数据保存在浏览器 `LocalStorage`，不依赖后端，适合本地使用、作品集展示和部署到 GitHub Pages。

## 功能

- 快速新增、编辑、删除账单
- 月预算设置与预算进度展示
- 本月收支概览与结余统计
- 最近账单筛选：按类型、类别、月份
- 最近 7 天趋势图、像素柱状图、分类占比、活跃度热力图
- 自动生成月度洞察文案
- 导出 CSV / JSON
- 导入 JSON 快照恢复数据
- 生成并下载像素风分享图片 PNG

## 技术栈

- React
- Vite
- JavaScript
- CSS
- LocalStorage
- SVG + Canvas

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址：

```bash
http://localhost:5173
```

## 本地构建

```bash
npm run build
npm run preview
```

## GitHub Pages 部署

这个项目已经在 `vite.config.js` 中配置了：

- 生产环境 `base: /pixel-ledger/`
- `npm run deploy` 脚本

如果你的 GitHub 仓库名不是 `pixel-ledger`，请先修改 [`vite.config.js`](/Users/zhong/Project/PixelTab/vite.config.js) 里的 `base`。

部署步骤：

1. 创建 GitHub 仓库，例如 `pixel-ledger`
2. 推送项目代码到仓库默认分支
3. 安装依赖并执行：

```bash
npm install
npm run deploy
```

4. 到 GitHub 仓库 `Settings -> Pages`
5. 确认 Pages 来源为 `gh-pages` 分支

部署完成后，页面通常会在以下地址可访问：

```bash
https://<your-github-username>.github.io/pixel-ledger/
```

## 数据说明

- 所有账单存在浏览器 `LocalStorage`
- 预算信息同样保存在 `LocalStorage`
- 导出 JSON 可用于备份和导入恢复

## 项目结构

```text
pixel-ledger/
├─ index.html
├─ package.json
├─ vite.config.js
├─ src/
│  ├─ components/
│  │  ├─ charts/
│  │  └─ share/
│  ├─ data/
│  ├─ hooks/
│  ├─ styles/
│  ├─ utils/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
```

## 后续扩展建议

- 新增自定义分类
- 增加多账本模式
- 支持深色主题
- 增加数据导入合并而非覆盖模式
- 增加 PWA 离线支持
