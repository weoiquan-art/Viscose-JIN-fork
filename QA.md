# QA 记录

更新：2026-09-25。每项只在实际完成后标记通过；源码编译并不等于浏览器中的 GLSL 成功编译。

| 检查 | 状态 | 证据/待做 |
| --- | --- | --- |
| `npm ci` | 已通过 | 上游源码基线安装 |
| `npm run lint` | 已通过 | 本分支执行；无报错及警告 |
| `npm run build` | 已通过 | Next.js 16 静态页面编译完成 |
| 360 / 640 / 1024 / 1512px 浏览器排版 | 已通过 | Chromium 153 截图，Sera 肖像和资讯显示，无文档横向溢出 |
| WebGL shader 运行与无控制台报错 | 已通过 | 实际 Chromium 153 加载 WebGL 场景，页面及控制台无报错；GLSL 未改 |
| hash 直达、刷新、前进后退 | 已通过 | 直达肖像，索引切卡，浏览器前进后退回到正确 hash 与资讯 |
| 普通模式入场、索引、滚轮、键盘与触控 | 已通过 | 无 hash 的入场到糯糯、滚轮切至菲比、CDP 手机触控切卡；索引、Home/End、数字键已通过 |
| reduced-motion 与无 JS/WebGL 降级 | 已通过 | 减少动态效果直接到指定卡；禁 JS 显示九张目录；强制 WebGL 失败也显示目录 |
| 两部影片播放、关闭、复位及焦点 | 已通过 | 两部均打开正确本地 MP4；Esc/关闭按钮可退出，焦点回到行动按钮；视频元素卸载且清理时暂停复位 |
| Facebook 新标签与 `noopener noreferrer` | 已通过 | Chromium DOM 核对原帖 URL、`target="_blank"`、`rel="noopener noreferrer"` |
| Vercel 预览地址与正式发布 | 待部署 | 预览通过后由用户决定正式发布 |

上游原始 `npm run build` 与 `npm run lint` 也已通过。本次未改 `planeShaders.js` 的 GLSL 内容。检查使用本地无头 Chromium 的软件 WebGL；1024px 滚轮检查以设备像素比 0.5 减轻软件渲染负担。手机触控仍需在实体设备上最终视觉审阅。
