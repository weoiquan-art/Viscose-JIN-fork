# JIN Studio · Current State

Last code verification: 2026-09-27, branch `codex/jin-studio-viscose`, source HEAD `9ca925f745ed7240efa1b0fa7b53202041ce8c03`. PR [#1](https://github.com/weoiquan-art/Viscose-JIN-fork/pull/1) is an open, unmerged draft against `main`. That code commit's [Cloudflare Pages preview](https://bca0632a.viscose-jin-fork.pages.dev/) succeeded; a separate Workers build failed because that Worker does not exist. Check the *new* commit's Pages result after any push. This snapshot describes the inspected code, not a promise that later commits or the live production site match it.

## Current architecture

- `app/page.js` renders `StudioExperience` and a no-JavaScript garden/catalog path.
- `components/StudioExperience.jsx` owns garden/gallery routing, hash/history entry, and persisted day/night theme. It mounts `GardenGate` **or** dynamically loads `Carousel`, releasing the garden canvas on entry.
- `components/GardenGate.jsx` layers daylight/night image plates with `components/garden/GardenWheel.jsx`; the latter builds runtime Three.js meshes via `components/garden/waterwheel.js`.
- `components/Carousel.jsx` owns the adapted WebGL half-arc and settled project stage. `components/ring/projects.js` stores the content and order; `catalog.js` filters pending assets, yielding eight navigable entries.

## Working in the inspected code

- Garden wheel/button enters the portfolio; the lamp and site control switch persisted day/night theme. Wheel pause, reduced-motion behavior, WebGL poster fallback, mobile framing, direct project hash entry, return to garden, and browser back/forward are implemented.
- Gallery has left half-arc navigation with top/bottom mouse regions, a central idle region, wheel/drag/index/keyboard input, settled card backdrops, two local films, native player/lightbox, hash deep links/history, mobile selection, reduced-motion behavior, and no-JavaScript/WebGL catalog fallback.
- Eight navigable entries: four character images, two local films, one external Facebook post, and Contact. The Sera costume sheet remains a pending record and is filtered out of navigation.

## Current garden implementation

| Element | Current form |
| --- | --- |
| Meadow, terrain, trees, flowers, creek/water surface, lamp, raven | Composited `public/garden/day.webp` and `night.webp` image plates; the lamp has an aligned clickable hotspot and glow. These are not environment meshes. |
| Waterwheel, supports, wooden delivery flume | Runtime procedural Three.js geometry (`waterwheel.js`) with moving rotor and fixed frame/flume; small water stream, droplets, ripple, lighting and shadow are scene effects. Water is not fluid simulation. |
| `public/garden/waterwheel.glb` | Exported reusable model with animation. The website currently constructs equivalent geometry in JavaScript; it does **not** fetch this GLB at runtime. |
| `public/garden/waterwheel-poster.png` | Static fallback if WebGL is unavailable. |

## Known limitations

- The garden surroundings and water surface are still flat plates. The 3D wheel is an initial review model; material match and real-device performance remain to be reviewed by JIN. The Pages preview is not a production release.
- Costume sheet and dedicated Facebook cover await supplied assets; the pending sheet is not an empty card.

## Active direction and one next task

**Next task: Garden Environment 3D Migration.** Move the garden progressively from composited plates toward modeled terrain/grass, trees/flowers, creek and water surface, lamp/raven, while integrating the existing waterwheel and wooden flume with day/night lighting. This is an approved direction, **not completed code**. Start at the Garden route in `AGENTS.md`; inspect relevant source and establish an incremental implementation before changing visuals. Preserve the current entry and portfolio behavior.

## Already done; do not recreate

- The interactive wheel and fixed flume, day/night theme, garden-to-gallery navigation, and WebGL fallbacks exist.
- The eight-entry half-arc, settled content/backdrops, films, hash/history navigation, keyboard/mobile/reduced-motion paths exist.
- Upstream 18-card demo claims and the old full-screen portfolio layout are historical, not present requirements.
