# Deployment

- Host: existing Cloudflare Pages project `viscose-jin-fork`.
- Build: `npm run build`; output: `out/` (Next.js static export).
- Work branch: `codex/jin-studio-viscose`; draft PR #1.
- Garden uses local WebP plates, procedural Three.js geometry and theme state in localStorage. No API key, runtime service, or new dependency is required.
- Push the reviewed source and assets to the preview branch, verify the exact commit's Cloudflare check and preview URL, and only then report it as deployed.
- Production merge/release remains subject to JIN's preview review. Do not change the production branch automatically.
