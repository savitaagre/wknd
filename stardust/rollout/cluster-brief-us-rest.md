# Cluster brief — run 4 (remaining 29 pages) overrides

Read `stardust/rollout/cluster-brief.md` first; it is the full contract. This file OVERRIDES these points.

## Branch and host
- Git branch: `feat/wknd-us-rest` (checked out). Commit/push with the git lock to `origin feat/wknd-us-rest`.
- Admin API branch (preview, code, status, deploy-batch `--branch`): **`feat-wknd-us-rest`** (host form — the slash
  form 404s every preview).
- Preview host for every gate: `https://feat-wknd-us-rest--wknd--savitaagre.aem.page` — pass it WITH the scheme to
  gate-all `--eds-host`; media-reconcile `--deploy-host feat-wknd-us-rest--wknd--savitaagre.aem.page`.
- PREVIEW ONLY (`--no-publish`). Only `savitaagre/wknd`. Media ledger: `stardust/deploy/media-ledger-wknd.json`.

## State
- Foundation and every block from runs 2–3 are on main (merged PR #2), frozen (`foundation-freeze.json`, 32 files).
  Never edit frozen files → `stardust/rollout/foundation-requests.md`. Reused blocks are read-only → report a
  reuse request.
- The 36 run-3 pages and the chrome docs (/nav, /footer, /ca/en/*, /fragments/sign-in) are delivered on DA wknd —
  do not touch them. The program and article archetypes are delivered and gated: reuse their encoders (the
  probe scripts under stardust/.work/rollout/program and stardust/.work/rollout/article) and their documents.
- gate-all reads `deployed` + `liveUrl` from a state file: build a private copy under stardust/.work/rollout/<cluster>
  (never edit stardust/state.json). `migrate.mjs render` runs only inside the state lock.
- Delete `stardust/current/measure/<slug>-units.json` before each gate round; never 1440 + 360 of one slug at once.
- Release the git lock in a SEPARATE command from any command mentioning a `content` path.
- Big-endian-Exif JPEGs: strip the Exif block (orientation 1) before upload, log it.
- Leave state.json, coverage/*, rollout.json, progress.json, status.jsonl uncommitted (the coordinator commits them);
  DO run `update-coverage.mjs` for your pages and `migrate.mjs gate|modules` for your siblings.
