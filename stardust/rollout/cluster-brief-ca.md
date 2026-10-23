# Cluster brief — run 3 (/ca/en) overrides

Read `stardust/rollout/cluster-brief.md` first; it is the full contract. This file OVERRIDES these points:

## Branch and host
- Git branch: `feat/wknd-ca-en` (already checked out). Commit/push with the git lock to `origin feat/wknd-ca-en`.
- Admin API branch (preview, code, status, deploy-batch `--branch`): **`feat-wknd-ca-en`** — the HOST form.
  The slash form makes the admin API read branch `feat` and every preview 404s.
- Preview host for every gate: `https://feat-wknd-ca-en--wknd--savitaagre.aem.page`
  (`--eds-host feat-wknd-ca-en--wknd--savitaagre.aem.page`, media-reconcile `--deploy-host` the same).
- Still PREVIEW ONLY (`--no-publish`). Still only `savitaagre/wknd`.

## State left by the paused run-2 workers (resume, do not redo)
- Blocks already authored on this branch (not yet gated on a preview): breadcrumb, trip-gallery-carousel,
  trip-facts, content-tabs, share-bar (program), adventure-card-grid, adventure-category-tabs and an updated
  hero-teaser (listing), image-list contract (members-only). Their section schemas are in stardust/eds-schema/.
  Re-verify each with the local asserts before delivery; fix what fails.
- The owner moved DA folders after those workers ran: every document and image they uploaded is now in
  `savitaagre/wknd-test`, NOT in `wknd`. The media ledger was rotated: `stardust/deploy/media-ledger-wknd.json`
  now holds only the chrome logos. Re-upload your images into `wknd` with that ledger (the uploader will upload
  them again) and re-PUT your documents with `deploy-batch.mjs --force` the first time.
- Chrome documents (/nav, /footer, /ca/en/nav, /ca/en/footer, /fragments/sign-in, /drafts/wknd-shell) are
  delivered and previewed on the branch host — do not touch them.

## Scope of this run
- Deliver your template's **us/en archetype** (required first, contract #126) and then ONLY its **/ca/en
  siblings**. The /us/en siblings are out of scope in this run — do not render or deliver them.
- /ca/en pages carry the en-CA chrome through the foundation's locale rule; internal links stay under /ca/en
  exactly as captured (the captures already use /ca/en hrefs). Verify the CA chrome on your first /ca/en page
  with crop-compare (header/footer bands vs the live /ca/en page) and chrome-parity.
- Coverage: `update-coverage.mjs` only for pages you deliver.
