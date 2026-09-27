# JIN Studio · Current State

Last code verification: 2026-09-27, branch `codex/jin-studio-viscose`, source HEAD `3f4d019ac24c6587dc84f820d967af44cee8fe29`. PR [#1](https://github.com/weoiquan-art/Viscose-JIN-fork/pull/1) is an open, unmerged draft against `main`. The mobile half-arc code passes local build/lint/layout checks; check the exact commit's Cloudflare Pages result after any push. The earlier creek preview was deployed successfully. A separate Workers build fails because that Worker does not exist. This snapshot is source evidence, not production acceptance.

## Current architecture

- `app/page.js` renders `StudioExperience` and a no-JavaScript garden/catalog path.
- `components/StudioExperience.jsx` owns garden/gallery routing, hash/history entry, and persisted day/night theme. It mounts `GardenGate` **or** dynamically loads `Carousel`, releasing the garden canvas on entry.
- `components/GardenGate.jsx` layers daylight/night image plates with `components/garden/GardenWheel.jsx`; the latter builds runtime Three.js meshes via `components/garden/waterwheel.js` and `environment.js`, in a shared pitched world.
- `components/Carousel.jsx` owns the adapted WebGL half-arc and settled project stage. `components/ring/projects.js` stores the content and order; `catalog.js` filters pending assets, yielding eight navigable entries.

## Working in the inspected code

- Garden wheel/button enters the portfolio; the lamp and site control switch persisted day/night theme. Wheel pause, reduced-motion behavior, WebGL poster fallback, mobile framing, direct project hash entry, return to garden, and browser back/forward are implemented.
- Gallery has left half-arc navigation with top/bottom mouse regions, a central idle region, wheel/drag/index/keyboard input, settled card backdrops, two local films, native player/lightbox, hash deep links/history, mobile selection, reduced-motion behavior, and no-JavaScript/WebGL catalog fallback.
- Below 768px, the gallery now renders a 32% left half-arc and 68% content stage, with touch drag, previous/next buttons and a select menu. `components/ring/viewport.js` shares composition metrics with CSS and canvas; mobile DPR is capped at 1.25 and rendering at 30fps, with GPU scissoring to the left column. Desktop geometry is preserved. Phone gesture/visual review of this new layout is still pending.
- Eight navigable entries: four character images, two local films, one external Facebook post, and Contact. The Sera costume sheet remains a pending record and is filtered out of navigation.

## Current garden implementation

| Element | Current form |
| --- | --- |
| Distant meadow, trees, flowers, creek outside the modeled reach, lamp, raven | Composited `public/garden/day.webp` and `night.webp` image plates; the lamp has an aligned clickable hotspot and glow. These are not environment meshes. |
| Local creek reach, two bank strips, stones, grass, foundations | Runtime geometry in `components/garden/environment.js`: sampled creek bed/banks, 240 instanced stones, 2,600 instanced grass blades, geometry water waves and 80 drifting glints. Edges blend into the retained plates; this is a partial migration. |
| Waterwheel, supports, wooden delivery flume | Runtime procedural Three.js geometry (`waterwheel.js`) with moving rotor and fixed frame/flume; small water stream, droplets, ripple, lighting and shadow are scene effects. Water is not fluid simulation. |
| `public/garden/waterwheel.glb` | Exported reusable model with animation. The website currently constructs equivalent geometry in JavaScript; it does **not** fetch this GLB at runtime. |
| `public/garden/waterwheel-poster.png` | Static fallback if WebGL is unavailable. |

## Known limitations

- The surroundings outside the local creek reach remain image plates. Full 3D Garden is not complete.
- **JIN supplied a phone screenshot showing the new creek geometry rendered (2026-09-27).** It confirms device rendering, but the pale modeled water/banks form a visible strip over the photographic creek; the boundary/material match is not accepted. The agent browser reports `GL_RENDERER = Disabled` and renders the static fallback. Day/night consistency, motion and real-device performance still need review. Do not treat a deployment success or fallback screenshot as 3D acceptance.
- The old static poster/GLB contain only the wheel; no environment GLB was exported. The Pages preview is not a production release.
- Costume sheet and dedicated Facebook cover await supplied assets; the pending sheet is not an empty card.

## Active direction and one next task

**Next task: review the new phone half-arc on device**, especially swipe/settle, adjacent-card visibility, films, contact links and rotation between portrait/landscape. First files: `Carousel.jsx` → `ring/viewport.js` → `globals.css`. Then resume the approved full 3D Garden migration by correcting the visible creek/plate boundary before extending meadow/flowers, trees and lamp/raven. The phone layout request changes the current priority; the Garden direction remains active.

## Already done; do not recreate

- The interactive wheel and fixed flume, day/night theme, garden-to-gallery navigation, and WebGL fallbacks exist.
- The eight-entry half-arc, settled content/backdrops, films, hash/history navigation, keyboard/mobile/reduced-motion paths exist.
- Upstream 18-card demo claims and the old full-screen portfolio layout are historical, not present requirements.
