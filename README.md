# JIN Studio · 轮盘作品站

基于 [Yousuf-developer/Viscose-carousel](https://github.com/Yousuf-developer/Viscose-carousel) 的 MIT 许可 Fork。保留原作的 Three.js SDF 黏液与细丝 shader、图集、GSAP 入场、滚动惯性和触控手势；作品、字体、导航和详情为 JIN Studio 改造。原作的技术说明保留在 [BREAKDOWN.md](BREAKDOWN.md)，版权声明见 [LICENSE](LICENSE)。

## 本地运行

Node.js 20+：

```bash
npm ci
npm run dev
npm run lint
npm run build
```

访问 `http://localhost:3000`。Vercel 可直接导入本 Fork 的 Next.js 项目；正式站点发布须先审核预览。旧版 GitHub Pages `main` 和旧版 Canvas 2D 草稿 PR 不受本分支影响。

## 浏览

- 滚轮、拖动或触控滑动转环；点击侧边卡、右上索引或手机选择框切换作品。
- 方向键逐张、Home/End 首末、数字 1–9 跳卡。停稳时更新 `#slug`，支持直达链接和浏览器前进后退。
- 角色图打开大图，两部本地影片在原生播放器中由用户点击播放；Facebook 原帖在新标签页打开。
- 弹窗 Esc、关闭按钮或点击遮罩退出，关闭影片会暂停并复位。
- 减少动态效果设置下跳过入场与文字黏液过渡。无 JavaScript、无 WebGL 或 shader 失败时显示可滚动的作品目录。

`components/ring/projects.js` 是图集、环序、索引、编号和 URL 锚点的唯一数据源。三视图未提供，清楚标注待补；Facebook 封面暂用三小只本地视频静帧。无需编辑 shader 添加卡片。

## 文档

- [PRODUCT.md](PRODUCT.md)：产品范围、媒体与发布门槛
- [DESIGN.md](DESIGN.md)：视觉、布局和交互规则
- [ASSETS.md](ASSETS.md)：素材来源与缺项
- [QA.md](QA.md)：已执行检查和仍需浏览器验证的项目
- [CHANGELOG.md](CHANGELOG.md)：本次改造记录

Satoshi 与 Geist 已转为 WOFF2；中文使用 OFL 许可的 Noto Sans SC。原版商业字体和第三方示例卡图未随站点发布。原版 `docs/` 截图仅为上游技术文档的演示，不代表 JIN Studio 的作品。
