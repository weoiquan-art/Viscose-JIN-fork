# Deployment procedure

This file is the release procedure, not a live status feed. Current branch, PR, verified commit, and its preview are in [CURRENT_STATE.md](CURRENT_STATE.md).

- Host: Cloudflare Pages project `viscose-jin-fork`.
- Build: `npm run build`; output: `out/` (Next.js static export).
- Push reviewed source and assets to the existing preview branch. Verify the exact new commit's **Cloudflare Pages** check and preview URL before reporting a successful deployment. An independent Workers Builds check can fail because its Worker does not exist; do not mistake it for the Pages result.
- Keep the PR as preview until JIN reviews it. Do not merge to `main` or switch production based on a successful preview alone.
