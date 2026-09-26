# JIN Studio · Garden waterwheel

Preview model created 2026-09-26 from JIN's supplied garden concept. This is a genuine mesh model, authored procedurally with Three.js; the surrounding garden is a composited image plate.

- `waterwheel.glb`: glTF 2.0, ~1.57 MB, 11,824 triangles, four PBR materials with embedded procedural oak grain. Imports into Blender and other glTF tools.
- `Rotor`: wheel cheeks, spokes, open water scoops, hub and iron fittings. Rotate this node around local Z. Runtime rotates clockwise at 2.2 rpm.
- `Fixed_frame_and_flume`: axle, A-frame supports and wooden delivery channel. Keep this assembly stationary.
- `waterwheel-poster.png`: transparent render of the same model, used when WebGL is unavailable.
- `day.webp`, `night.webp`: 1672 × 941 clean plates, edited from the user's daylight garden. The original wheel was removed; the night version uses the same clean plate as its composition reference and the user's night image as a lighting reference. There may be small AI-generated texture differences; model placement does not shift between themes.

The GLB contains geometry, materials and a `Waterwheel_cycle` rotation clip (one turn at 2.2 rpm). Lights, flowing water particles, contact shadow and entry transition are scene behavior in `components/garden/GardenWheel.jsx`, not a fluid simulation. The web renderer creates the same geometry from `waterwheel.js` so it needs no model download at runtime.

## Source and reproducibility

- Geometry and seeded oak texture: `components/garden/waterwheel.js`.
- Camera composition and all garden tuning: `gardenParams()` in `components/ring/params.js`; crop/hotspot mapping: `components/garden/layout.js`.
- In development only, visit `/?garden-debug` for the numeric controls. Dimensions that change topology require rebuilding/reloading the model after editing defaults; lighting, speed, camera and composition parameters update live.
- In a development browser, `await window.__exportGardenWheel()` returns a binary ArrayBuffer for the same model, with the rotor zeroed. `window.__gardenPoster()` returns its transparent PNG render as a data URL. These helpers and the exporter are excluded from production.

## Clean-plate edit instructions used

Day: remove only the waterwheel, axle, and its falling water; fill the occluded center with continuous flat meadow and the existing shallow creek. Preserve trees, sky, flowers, lamp, raven, camera, and composition.

Night: use the cleaned daylight plate as the exact composition target; change lighting to moonlit blue with a warm amber lamp and a small moon. Keep the empty center, creek, trees, lamp and raven positions. The supplied night image is a lighting reference only.

This directory contains JIN Studio project assets. They are not covered by the upstream code's MIT license.
