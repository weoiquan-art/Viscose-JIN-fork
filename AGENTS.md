# JIN Studio · Agent router

This is the JIN Studio portfolio, evolved from the Viscose Carousel fork. Work from the checked-out branch, not a prior chat or the upstream demo.

## Read order and authority

1. Read this file, then [CURRENT_STATE.md](CURRENT_STATE.md).
2. Read only 1–3 files directly relevant to the task; expand if a concrete dependency requires it.
3. For implementation facts, live code wins over `CURRENT_STATE.md`; reconcile a discrepancy before changing code. For direction, follow the user's latest task, then the active direction in `CURRENT_STATE.md`.
4. `PRODUCT.md` records intent, `DESIGN.md` rules, `ASSETS.md` asset provenance, `DEPLOY.md` release procedure. `QA.md` and `CHANGELOG.md` are dated evidence; `BREAKDOWN.md` and `docs/upstream-viscose-internals.md` describe the upstream engine/history. None overrides present code.

## Route by task

| Task | First files after `CURRENT_STATE.md` | Open next only if needed |
| --- | --- | --- |
| Garden scene / 3D migration | `components/GardenGate.jsx`, `components/garden/GardenWheel.jsx`, `components/ring/params.js` | `components/garden/waterwheel.js` for model; `components/garden/layout.js` for crop/hotspots; `public/garden/README.md` and `ASSETS.md` for existing media; `app/globals.css` for presentation |
| Garden / studio navigation or theme | `components/StudioExperience.jsx`, `components/GardenGate.jsx` | `components/Carousel.jsx` for gallery history integration |
| Portfolio content / media | `components/ring/projects.js`, `components/ring/catalog.js`, `components/ProjectUI.jsx` | `ASSETS.md` for provenance; `components/ring/background.js` for backdrop selection |
| Carousel interaction / ring | `components/Carousel.jsx`, `components/ring/params.js` | Specific `components/ring/*` dependency; `docs/upstream-viscose-internals.md` when changing engine math |
| Shader / atlas internals | Relevant `components/shaders/*` or `components/ring/atlas.js`, then `docs/upstream-viscose-internals.md` | `BREAKDOWN.md` for original design rationale |
| Build / preview / release | `DEPLOY.md`, `package.json` | `QA.md` for prior checks; verify the current PR HEAD's Pages check |

Do not glob entire directories at entry. Paths with `*` in older handoffs mean *choose the file involved*, not read everything.

## Work and handoff

- Keep this router stable. One current snapshot lives in `CURRENT_STATE.md`; dated changes go to `CHANGELOG.md`. Update a specialist document only when its own intent, rule, asset, QA evidence, or deploy process changes. Do not mirror the same status across seven files.
- After a material phase, verify code and checks, then refresh `CURRENT_STATE.md` with the actual implementation, one next task, and any remaining limitation. Record the phase once in `CHANGELOG.md`.
- Run `npm run lint`, `npm run build`, and `git diff --check` for substantive changes. Browser-check WebGL/shader changes: a successful build cannot compile GLSL in a browser.
- Preserve attribution in `LICENSE` and shader source. `public/` assets have separate rights; consult `ASSETS.md` when replacing them.
