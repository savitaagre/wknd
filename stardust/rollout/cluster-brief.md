# Cluster worker brief — stardust replica Phase 5, C-archetype + cluster unit (wknd.site → wknd)

You deliver ONE template cluster: first its gated archetype, then (only after the archetype passes on the
preview) its siblings. Project root and EDS code repo: `/backups/savitaagre/edsmsm/repo`, branch
`aem-20261023-1633`. Absolute paths; `cd` elsewhere is blocked. Never `npm install` / `npx playwright
install`; `npm run lint` / `npm run lint:fix` are allowed (never `--fix` a file another worker edits).

## Contract (read by section, one per call: `node stardust/scripts/replica/section.mjs <doc> --list`)
- `/home/node/.excat-marketplaces/excat-extended/stardust/skills/replica/reference/handoff-contract.md`
  § 1 (Migrate — sibling tier: rows 1–9 + Acceptance), § 2 (Deploy — per page: editability EW1–EW10,
  decode tier, DA media protocol, DA deploy protocol, boilerplate lint, final gate), § 3 row C (C-archetype +
  C1…Cn + Fan-out discipline), § 4 (script usage table — every flag you need is there).
- `/home/node/.excat-marketplaces/excat-extended/stardust/skills/replica/reference/source-fidelity-gate.md`
  § The published-origin gate, § The all-pages published-origin gate, § What a failing row means.
- Deploy skill sections cited by the card (`/home/node/.excat-marketplaces/excat-extended/stardust/skills/deploy/SKILL.md`).
- Project: `stardust/runtime-contract.json` (the frozen foundation's contract: locale + chrome rule, section
  styles, media ledger), `stardust/prototypes/CANON.md`, `stardust/eds-conversion-log.md` (the pilot's
  landing conversion and C0 runs — reuse its proven patterns), `stardust/rollout/plan.json` (your blocks:
  `convert` vs `reuse`), `stardust/dynamic-features.md`, `stardust/replica/inconsistency-register.md`,
  `AGENTS.md` (EDS rules — `scripts/aem.js` is vendored, never edit; CSS scoped to the block).

## Target (hard rules)
- DA org `savitaagre`, site/repo `wknd`. Write ONLY to `https://admin.da.live/source/savitaagre/wknd/…`.
  Never touch edsmsm, ema, savisite or any other site's content or config.
- Auth is injected by the network layer: run deploy scripts with `DA_TOKEN=injected`. Never print, ask for or
  store a token. A persistent 401/403 → stop and report.
- **PREVIEW ONLY** (owner decision): `deploy-batch.mjs … --no-publish`; never call `admin.hlx.page/live`.
- Preview host: `https://aem-20261023-1633--wknd--savitaagre.aem.page`. Branch for admin calls:
  `aem-20261023-1633`. Content tree (local source of the DA documents): `stardust/deploy/content/`
  (pass `--content stardust/deploy/content` to every script that takes it).
- Media: `DA_TOKEN=injected node stardust/scripts/deploy/da-media-upload.mjs --org savitaagre --repo wknd
  --scope <your-cluster> … --ledger stardust/deploy/media-ledger-wknd.json` (ALWAYS that ledger — the default
  ledger holds edsmsm URLs). Rehost from the captured files (`stardust/current/assets/media/` +
  `_index.tsv`, `stardust/prototypes/assets/media/`); never hotlink wknd.site; author
  `https://content.da.live/savitaagre/wknd/media/<scope>/<file>` URLs.

## Shared-tree discipline (several cluster workers run at once in this one working tree)
- **Frozen foundation** (`stardust/rollout/foundation-freeze.json`: styles/, fonts/, scripts/, head.html,
  blocks/header/, blocks/footer/): never edit. A foundation finding = ONE line appended to
  `stardust/rollout/foundation-requests.md` (`- <unit> | <what> | <evidence> | <templates>`), plus a scoped
  override in your OWN block CSS. `node stardust/scripts/replica/foundation-freeze.mjs check` must exit 0 at
  your end.
- **Only your files:** your blocks (`blocks/<name>/` for the blocks plan.json gives you to `convert`; reuse
  the others read-only — if a reused block needs a change, request it from its owner in your report, do not
  edit it), your content documents, your gate dirs, your ledgers (`stardust/deploy/ledger-<cluster>.json`),
  your logs (`stardust/.work/rollout/<cluster>/`).
- **Git:** stage ONLY your own paths explicitly (never `git add -A` / `git add .`), and wrap every
  commit + push in the lock: `until mkdir stardust/.work/locks/git.lock 2>/dev/null; do sleep 2; done;
  git add <your paths> && git commit -qm "<msg>" && git push -q origin aem-20261023-1633; rmdir
  stardust/.work/locks/git.lock` (if a push is rejected, `git pull --rebase -q origin aem-20261023-1633`
  inside the lock, then push). Commit trailer: `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
  After a push, poll the branch host (`curl -sf`, ≤ 5 s apart, ≤ 3 min) until your block JS/CSS is served.
- **State:** never edit `stardust/state.json`, `stardust/rollout/progress.json`, the ledger (`status.jsonl`),
  the journal or the register. `migrate.mjs render` writes state.json — run it ONLY inside
  `until mkdir stardust/.work/locks/state.lock 2>/dev/null; do sleep 2; done; … ; rmdir stardust/.work/locks/state.lock`.
  `update-coverage.mjs`, `deploy-batch.mjs` and `da-media-upload.mjs` are lock-safe.
- **Long instruments** (gate.sh, gate-all.mjs, sibling-variance, deploy-batch, Playwright) through
  `node stardust/scripts/replica/run-bg.mjs start --name <cluster>-… -- …`, then `run-bg.mjs wait` as your next
  step; every tool call under 4 minutes. Known defects: gate.sh copy is not executable → `bash
  stardust/scripts/replica/gate.sh …`; unit-geometry caches live units per slug not per width → delete
  `stardust/current/measure/<slug>-units.json` before each gate round and never run 1440 and 360 of the same
  slug at once; `crop-compare.mjs` writes `crop-diff.png` into the CWD unless you pass `--out
  stardust/.work/rollout/<cluster>/<name>.png` — always pass it.
- A prototype server already serves `stardust/prototypes/` at `http://localhost:8791/` (never start/kill one).

## The chain (contract § 3 row C, in order)
1. **Archetype convert** — `section-schema.mjs http://localhost:8791/<archetype>-proposed.html --out
   stardust/eds-schema/<archetype>.json`; `style-fingerprint.mjs` before block code; author/upgrade your
   blocks (template-slotted for fixed compositions, reconstructive for repeat groups; EW1–EW10, never
   value-slotting) and the DA document `stardust/deploy/content/<path>.html` from the prototype + captured
   content (verbatim; metadata block: Title, Description, Image = source og:image, Template = <type>).
   Apply ONLY the register entries for your type (R-01 landing, R-02 coming-soon, R-03 search: one `<h1>`,
   styled as the source — the canon h1 note in CANON.md).
2. **Local structural asserts** (never a pixel verdict): `block-roundtrip.mjs <protoURL>
   stardust/deploy/content/<path>.html --blocks <name> --ew` exit 0 per block, then once without `--blocks`;
   `build-harness.mjs` + `qa-gate.mjs` (schema counts, one h1, cap); `npm run lint:fix` then `npm run lint`
   (0 errors).
3. **Delivery chain per page**: `localize-links.mjs --source-host wknd.site --content stardust/deploy/content`
   then `--check` exit 0 → `davids-model-lint.mjs <file>` exit 0 → `delivery-lint.mjs --file <file> --path
   </path>` (no P0/P1) → media upload + `media-reconcile.mjs --file <file> --deploy-host
   aem-20261023-1633--wknd--savitaagre.aem.page --media-ledger stardust/deploy/media-ledger-wknd.json` →
   `sanitise.js <file>` → commit + push your block code (lock) → `deploy-batch.mjs --org savitaagre --repo
   wknd --branch aem-20261023-1633 --content stardust/deploy/content --paths stardust/rollout/units/<cluster>.paths
   --ledger stardust/deploy/ledger-<cluster>.json --log stardust/.work/rollout/<cluster>/deploy.log
   --concurrency 1 --no-publish` (through run-bg) → `.plain.html` checks (200, body wrapper, one h1,
   0 about:error, no /img/) → computed-style guard once per template → `update-coverage.mjs <slug> --status deployed --url <preview url>`.
4. **Archetype gate on the PREVIEW** (published-origin regime): `gate.sh <archetype> <live-url>
   <preview-url> 1440 pub1 --full --marker WKND` and 360 (sequential); `crop-compare` header/footer bands
   (≤ 2 %); `chrome-parity.mjs <live> <preview> --width 1440|360`; then `gate-all.mjs --only <archetype>
   --eds-host aem-20261023-1633--wknd--savitaagre.aem.page` and `--width 360`. Bar: pixel ≤ 10 %, |Δh| ≤ 5 %,
   0 clipped, 0 MISSING/HIDDEN links/headings, 0 structural 🔴. Fix rounds cap 3 (block CSS/JS rides a push;
   content fix re-PUTs the page); a 4th failing round = report "re-prototype decision" and stop.
   Interaction parity on the delivered archetype: `motion-observe.mjs` on the preview with the archetype's
   pokes (`stardust/replica/motion/<archetype>.json` lists them) → `-delivered.json`, `motion-compare.mjs`
   against the live file: 0 MISSING.
5. **Siblings** (only after step 4 passes): `sibling-variance.mjs <archetype-live-url> <sibling-urls…> --probe
   <block>=<sel> … --width 1440` once (keep the JSON in stardust/.work/rollout/<cluster>/); budget every delta
   as a block VARIANT class; `migrate.mjs render <sibling slugs> --archetype <slug>=<archetype>` (state lock;
   ≤ ~8 slugs per call); author each sibling's DA document with the archetype's proven encoder from the
   sibling's typed slots / captured DOM (verbatim content; `contentDeviations[]` via `migrate.mjs deviation`
   for every deviation); content-count acceptance per page (`content-diff.mjs <capture-url> <rendered-url>
   --profile generic --main main` — the capture of the source page vs the preview page); the same delivery
   chain (step 3); then `gate-all.mjs --only <sibling slugs> --eds-host aem-20261023-1633--wknd--savitaagre.aem.page`
   at 1440 and 360. Same bar; cap 3 rounds per page. Record `migrate.mjs gate <slug> content-fidelity
   --evidence "…"` per page and `migrate.mjs modules <slug> <ids…>`.
6. `foundation-freeze.mjs check` exit 0; final commit + push of your files (lock).

## Never
No redesign, no rewording, no invented content, no DOM copying, no publish, no writes outside savitaagre/wknd.

## Return — ONE verdict line first
`<cluster>: pages n/n previewed, blocks k, gate 1440 x% / 360 y% (archetype; worst sibling a%/b%), requests r`
then: archetype gate lines (pixel %, Δh, structural, clipped, MISSING/HIDDEN, crops, chrome-parity, motion),
per-sibling gate-all rows (failures only + count passing), variants used, foundation/reuse requests, content
deviations, commits pushed, anything unresolved.
