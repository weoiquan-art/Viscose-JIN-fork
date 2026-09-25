# JIN Studio · 产品定义

更新：2026-09-25。此 Fork 是新站的预览候选，目标是一个可导航的真实作品轮盘。

## 内容与行为

- 顺序：糯糯、菲比、Sera Q 版、Sera 拟真肖像、Sera 服装三视图待补、三小只影片、Sera《家乡》非正史试片、三小只 Facebook 原帖、Contact。
- 每张卡的 `slug` 同时作为 URL hash；停稳后更新地址，支持刷新、直达和前进后退。
- 两部 MP4 仅在点击后打开原生播放器。《家乡》标为示范试片，明确非正史；Facebook 卡只外跳，不内嵌或镜像社交影片。
- Contact 使用用户提供的邮箱、Instagram、TikTok、课程站，以及用户 GitHub 账号链接。不显示真实姓名、团队规模、客户或虚构成绩。
- 素材缺失时保留诚实占位。服装三视图待提供；Facebook 帖子专用封面待提供。

## 技术与发布

- Next.js 16、React 19、Three.js、GSAP、Tailwind v4，基于 Viscose 原 shader 环形轮盘。旧版“保持纯静态 HTML 不迁移框架”决定在此 Fork 作废。
- 渡鸦只作为 favicon 和可点击的角落标记；旧版大型 Hero 与六章节 Canvas 2D 草稿属于先前探索，本次整站为单轮盘。
- 提供键盘、减少动态效果、小屏触控、无 JS/WebGL 的完整目录降级。
- 首选将此 Fork 的预览分支导入 Vercel。正式发布和替换现有站点都需先由用户检查预览 URL。
