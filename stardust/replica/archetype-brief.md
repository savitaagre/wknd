# Archetype worker brief — stardust replica Phase 3 + 4 (wknd.site, run 2)

You recreate ONE archetype as a clean, re-authored static prototype and prove it with the measured
source-fidelity gate. Same design, same content — new code. Project root:
`/backups/savitaagre/edsmsm/repo` — run every command from there with absolute paths (`cd` elsewhere is
blocked by the sandbox).

## Environment rules (hard)
- Never `npm install`, `npx playwright install`, or edit plugin files. Scripts are project copies:
  `node stardust/scripts/replica/<x>.mjs`, `node stardust/scripts/diff/<x>.mjs`; run gate.sh as
  `bash stardust/scripts/replica/gate.sh …` (the copy is not executable).
- A prototype server is ALREADY running: `http://localhost:8791/` serves `stardust/prototypes/`. Never
  start another or kill it. Your prototype URL is `http://localhost:8791/<slug>-proposed.html`.
- Every gate round and every long instrument runs through run-bg, never in the foreground:
  `node stardust/scripts/replica/run-bg.mjs start --name <slug>-<width>-<label> -- bash stardust/scripts/replica/gate.sh …`
  then `node stardust/scripts/replica/run-bg.mjs wait` as your NEXT step (repeat while it says still going;
  never in a shell loop, never after `sleep`). Exit 124 = deadline → re-run, not a verdict. Other workers
  share the run-bg slots; that is expected. Read output with `run-bg.mjs log <job> --grep <re>`, never cat.
- Reading discipline: reference docs by section (`node stardust/scripts/replica/section.mjs <doc> --list`,
  then one heading per call); JSON via `node stardust/scripts/replica/json-query.mjs`; captured HTML via
  `node stardust/scripts/replica/html-slice.mjs <page.html> header|footer|main|.class [--text]`; captured
  CSS via `node stardust/scripts/replica/css-rules.mjs <sheet> '<selector regex>'`; live-vs-prototype boxes
  via `node stardust/scripts/replica/measure.mjs <live> --against <proto> --selectors "<css>,…" --width 1440,360`.
  Images: one crop per fact (`crop-compare.mjs`), never a whole stitched page or the live/build/diff triplet.
  Script flags: `/home/node/.excat-marketplaces/excat-extended/stardust/skills/stardust/reference/scripts-index.md`
  first, then `--help`. Never read a script's source to learn its flags.

## Read first (by section)
Skill: `/home/node/.excat-marketplaces/excat-extended/stardust/skills/replica/SKILL.md` § Phase 3 and § Phase 4.
References in `/home/node/.excat-marketplaces/excat-extended/stardust/skills/replica/reference/`:
`recreation-procedure.md` (§ Authoring order, § CSS lifting …, § Fonts policy, § Asset harvest and the
capture-state policy, § Granularity parity, § Role parity, § Carousels and animated sections, § Interaction
parity, § Fixed and sticky chrome, § Repeated-unit families) and `source-fidelity-gate.md` (§ Pass bar,
§ Per-breakpoint procedure, § Band breakdown, § Iteration discipline, § Hardening). Read what your step needs.
Project: `stardust/prototypes/CANON.md` (shared layers — read it fully), `DESIGN.md`/`DESIGN.json` (target
spec = captured current state; `extensions.breakpoints` = cap model; `extensions.modules[]` = module candidates
with instance selectors), `stardust/replica/inconsistency-register.md` (the ONLY permitted deltas),
`stardust/dynamic-features.md` (behaviour rows for your type).

## Inputs for your archetype
- Page record: `stardust/current/pages/<slug>.json` (verbatim content; `slots` = typed slots),
  rendered DOM `stardust/current/pages/<slug>.html`, screenshot `stardust/current/assets/screenshots/<slug>.png`.
- Computed styles: `stardust/current/_computed-styles.json` → `pages["<live url>"]["1440"|"360"]`.
- Source CSS: pilot capture in `stardust/replica/capture/css/`; fetch any further stylesheet the live page
  links (curl with a browser UA) into `stardust/replica/capture/css/` if it is missing. Fidelity values come
  from the source CSS, not the eye.
- Media: `stardust/current/assets/media/` + `_index.tsv` (source URL → local file). Copy what you use into
  `stardust/prototypes/assets/media/` (keep file names).

## Do
1. Authoring order exactly as recreation-procedure § Authoring order: content skeleton verbatim from the
   page JSON / rendered DOM (reconcile COUNTS of every repeated unit first), lift values from source CSS,
   fonts per policy, compose against the screenshot, then gate. Clean semantic HTML/CSS — never paste the
   live DOM, never port a page-level stylesheet (per-section CSS-portation only per § CSS-portation fallback).
2. Files: `stardust/prototypes/<slug>-proposed.html`, `<slug>.css`, `<slug>.js` (only if needed). Load
   `canon.css` then `<slug>.css`, `canon.js` then `<slug>.js`. Reuse the canon header/footer markup from
   CANON.md (content per locale from your page's own capture). NEVER edit canon.css/canon.js or another
   archetype's files: append a request to `stardust/replica/canon-requests.md` (format in that file) and
   compensate in your own file meanwhile. Shared modules you author that other templates also use
   (see DESIGN.json modules[] instances — e.g. breadcrumb, share-bar, underlined-section-title) → write them
   in your file AND file a canon request to promote them.
3. Apply only the register entries that name your type. Anything else that looks wrong on the source is
   replicated as captured; a new inconsistency goes to `stardust/replica/register-requests.md` (never fixed).
4. Gate per breakpoint 1440 and 360 (source-fidelity-gate.md): chrome-parity before pixel rounds on
   header/footer; first round and confirmation round `--full --main main`; pixel rounds in between;
   anchor.mjs band inner loop; hard cap **3 fix iterations per breakpoint**, fixes only from instrument output.
   Pass bar: 0 structural 🔴 (main + chrome roots), visual flags none or justified, pixel ≤ 10 % with no
   unexplained hot band, |Δh| ≤ 8 px, `cap-probe.mjs <live> --against <proto> --design DESIGN.json --slug <slug>
   --main main` → `cap-probe: PASS`, clip-probe `Clipped: 0`, horizontal overflow within 4 px.
   Declare repeated-unit families in `stardust/replica/units.json` (shared file: read-modify-write ONLY your
   keys with a small node script, re-reading the file immediately before writing).
5. Interaction parity (after the static gate): `motion-observe.mjs` on the live URL →
   `stardust/replica/motion/<slug>.json`; implement ONLY behaviours that fired; observe the prototype with the
   same pokes → `stardust/replica/motion/<slug>-build.json`; `motion-compare.mjs`; resolve MISSING/EXTRA; re-run
   a pixel round — the number must return to the gated value. Timer-driven media counts as fired.
6. Write your result to `stardust/replica/progress/<slug>.json` (do NOT edit progress.json, state.json, the
   ledger, the journal or the register — the coordinator does bookkeeping):
   `{ slug, type, liveUrl, prototype, breakpoints: { "1440": { iterations, result: { structuralRed, visualFlags,
   pixelPct, heightDelta, chromeParity, clipped, overflow, pass }, justified[], residuals[] }, "360": {…} },
   capProbe, units[], motion: { observed, implemented, dead[] }, canonRequests[], registerRequests[], notes }`.

## Never
No redesign, no rewording, no invented content, no "improvements" without a register entry, no DOM copying.
A placeholder or hydration state is replicated as captured.

## Return (final message, compact)
Per breakpoint: the confirmation `--full` verdict line (pixel %, Δh, structural red, flags, chrome, clipped,
overflow), iterations used, cap-probe line; residuals; motion {observed, implemented, dead}; canon requests
filed; files written; anything unresolved.
