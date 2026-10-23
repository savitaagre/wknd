# Plugin improvement notes (stardust / replica run on wknd.site, 2026-10-16)

General observations collected while following the stardust skills step by step.
Each note: what happened → why it matters → suggested fix.

## Setup

1. **`section.mjs` treats the heading argument as a regex.** `section.mjs SKILL.md 'Setup (run before anything else)'`
   failed (no match) because `(`…`)` became a regex group, even though the outline printed that exact
   heading. → Agents copy headings verbatim from `--list`. → Match a literal substring first and fall back
   to regex, or escape by default and offer `--regex`.
2. **`impeccable-version-check.mjs` cannot find impeccable in the EMA marketplace layout**
   (`~/.excat-marketplaces/excat-extended/impeccable/skills/impeccable`); `--where` fails too, and
   `--local <dir>` still printed "not found". → Setup step 1 can't verify the hard dependency, and later
   phases that need impeccable's `reference/` dir have no path. → Add the excat-extended marketplace dir to
   the search list, and make `--local` short-circuit the registry lookup.
3. **Script-copy rule vs. EMA dependency rule conflict.** Replica Setup step 4 says copy scripts into
   `stardust/scripts/` and run them from there; the EMA override says do not install deps into the project
   and run bundled scripts from the plugin tree. The copies cannot resolve `playwright`/`pixelmatch`/`pngjs`/
   `cheerio` (ESM resolves from the script location), and running from the plugin tree breaks `gate.sh --full`
   (`DIFF="$HERE/../diff"` → `skills/replica/diff`, which doesn't exist; stitch-shot has a two-layout
   fallback, gate.sh does not). A symlink to the plugin `node_modules` is blocked by the sandbox (target
   outside workspace). Workaround used: byte-copy the plugin-root `node_modules` (25 MB) to
   `stardust/scripts/node_modules/` and gitignore it. → Give gate.sh the same two-layout fallback as
   stitch-shot (`$HERE/../diff` or `$HERE/../../diff/scripts`), and document one blessed way for EMA.
4. **Command registry count mismatch.** Master Setup step 4 says impeccable has "24 commands";
   `command-metadata.json` has 23. → Don't hardcode the count in prose (the step itself says never hardcode).

## Extract

5. **Contradictory script-location rules across skills.** Extract's EMA box says "NEVER copy crawl.mjs (or any
   bundled script) into the project"; replica Setup step 4 says copy whole script dirs into
   `stardust/scripts/` and run them from there. The EMA box also suggests symlinking plugin modules into the
   project root `node_modules` — the sandbox blocks symlinks whose target is outside the workspace. → One
   rule for all skills, tested against the sandbox.
6. **Changing directory into the plugin tree is blocked** by the sandbox ("writes to … outside the project
   workspace"), though the EMA box's example starts by changing into the plugin dir. Absolute-path
   invocation from the project root works. → Change the example.
7. **crawl.mjs slug for `/us/en.html` is `us-en-html`** (extension kept in the slug). Every downstream
   artifact inherits it (`us-en-html-proposed.html`). → Strip `.html`/`.htm` before slugging.
8. **crawl.mjs saves no media, fonts or logo** although the SKILL says Phase 2 captures fonts via network
   intercept (§ Capture list 16) and saves media under `assets/media/`. Every run must hand-harvest. →
   Add the media/font save to crawl.mjs (it already sees the responses).
9. **Visibility filter drops carousel slides 2..n** from `body[]`/`media.imgs` (hidden by design). For a
   migration this loses real content; only the DOM sidecar has it. → Record carousel-hidden content under
   a separate `hiddenPanels[]` key rather than dropping it.
10. **Bounded entry vs extract Phases 3–6 is ambiguous.** Replica says a bounded run "skips the descriptive
   synthesis" (→ Phase 2 § 1a bounded promotion), but extract's own procedure for `--single` runs all six
   phases. → State explicitly whether `--single` under replica should stop after crawl.mjs.
11. **No clock helper for hand-written timestamps.** Journal/provenance want ISO timestamps; agents guess
   (this run guessed 10 min ahead and had to correct). → Have `ledger.mjs` print `now` / offer `ledger.mjs now`.
12. **`css-rules.mjs` cannot match `@media` / `:root`** by selector regex (expected), and the error does not
   hint at `--media`. Minor.
13. **Brand-surface synthesis has no script.** `_brand-extraction.json` is hand-authored from the census;
   easy to transcribe a truncated value wrongly (this run initially completed a truncated alt text and an
   og:image path from memory — caught and fixed). → Generate the deterministic parts (palette, type, logo,
   iconFont, heroImage) from `_computed-styles.json` + page JSON with a script.

## Recreate / gate

14. **`anchor.mjs` found no sections on an AEM Core Components page** (no `<section>`/landmark children —
   the live content root is `div.aem-Grid` > columns). It printed only the footer. → Fall back to the
   content root's direct children (descending through single-child wrappers) when no landmarks exist.
15. **`measure.mjs` output is verbose** (24 props × every selector); a 30-selector run is ~200 lines. An
   awk filter dropping default values was needed to make it readable. → Add `--changed` (omit props at
   their initial value) and a `--compact` one-line-per-box mode.
16. **No probe compares two pages with different selectors.** `measure.mjs --against` uses one selector
   list for both sides, but a clean re-authoring renames every class. → Accept `--build-selectors` paired
   by position.
17. **motion-observe hover probes are order-sensitive.** Running `--click` pokes before `--hover` left an
   overlay (the language menu) open; it intercepted the pointer and produced false "dead" hovers on live
   and a false "MISSING on build". → Reset state (reload, or Escape + click on body) between the poke and
   hover phases, or warn when an element at the hover point is not the probed element.
18. **motion-observe hover diff does not sample `text-decoration`** (or border-color / pseudo-elements);
   motion-compare even says so in its advisory. Underline-on-hover is common. → Add
   `textDecorationLine` and `::after` border/width to the sampled set.
19. **Overlay geometry after a click is not measured.** The language menu's JS-computed `left` differed
   (882 vs 1080) and only surfaced through the hover inconsistency. → motion-observe `--click` could
   record the rect of newly displayed elements.
20. **Iteration-cap wording** — "3 iterations per breakpoint" doesn't say whether the first `--full` map
   and the confirmation round count. Interpretation used here: fix rounds count; map/confirmation rounds
   don't (recorded in progress.json).
21. **Rendition residual at 360**: live serves width-specific renditions (290px), the prototype the
   originals; sub-pixel aspect differences round the footer by 1px and fail the 2% footer crop. → The
   crop-compare guidance could recognise a uniform ±1px offset (try shifted alignment) before failing.
22. **(Delivery) The deploy skill's EMA box contradicts the operator's DA instructions.** The box says inside
   Experience Catalyst never PUT to DA / preview (no credentials by design), but this runtime's operator
   prompt documents exactly that path with injected credentials, and it worked. Its detection rule ("you are
   in /workspace/…, the plugin lives under .excat-marketplaces/") is also ambiguous when the project root is
   elsewhere. → Detect capability (a DA write probe), not paths, and reconcile with the operator prompt.
23. **(Delivery) `gate-all --stage published` needs `status: "deployed"` + `liveUrl`**, but `state.mjs`
   cannot write `deployed` (statuses end at `migrated`). Both units had to hand it a derived state copy. →
   Add `state.mjs deployed <slug> --url <preview>` or let gate-all read rollout coverage / `--url`.
24. **(Delivery) `section-schema.mjs` only detects `<section>` elements**; a replica prototype built from an
   AEM-grid source has divs. The unit annotated a copy. → Accept `--sections <selector list>`.
25. **(Delivery) content-diff can't see icons painted on a non-empty link's `::before`** (MISSING ICON 🔴
   while crops were 100 %). The fix was to mirror the source's empty icon span, which is fine, but the red
   reads as a real defect. → Count `::before` glyphs on the anchor as the icon.
26. **(Delivery) Pipeline attribute losses aren't documented in the ENCODE contract:** image `title` →
   `data-title` (dropped when equal to alt); no authorable `aria-label` on links. Both needed foundation
   code. → Document both in deploy § ENCODE with the shipped restore snippet.
27. **(Delivery) Rollout A–I for a single-URL replica.** The replica card says Phase 5 delegates to
   migrate → deploy → rollout "unchanged", but most rollout phases (inventory, clusters, sitemap, link audit,
   dashboard) presuppose a site. → State the minimum Phase 5 for a bounded run (C0 → C-archetype → C-final +
   published gate) explicitly.
28. **(Delivery) Reusing an existing EDS implementation isn't covered.** This repo already had a WKND
   foundation; the skills assume a fresh boilerplate. A baseline gate of the existing implementation (50.91 %)
   was what justified rebuilding. → Add a "baseline the existing build" step to deploy Step 2's reuse decision.
29. **(Workflow) Subagent briefs are long because the contract is long.** Each delivery unit needed ~1k words
   of brief. → Ship brief templates for C0 / C-archetype in the handoff card.

# Run 2 — full-site replica of wknd.site, all locales (2026-10-23)

Same format. Numbering continues.

## Setup / remote prerequisites

30. **Replica assumes the target site already exists and is reachable.** A "new site / rename" ask needs
    a GitHub repo rename, a site-config create and DA config edits before Phase 5 — none of which the
    skills mention, and in EMA all three are gated (no GitHub token; DA/admin writes need an explicit
    chat request, AskUserQuestion answers do not count). → Add a Phase 0 "target readiness" checklist
    to replica Setup that probes code-repo push, admin config write and DA write up front, so the run
    can surface blockers before a multi-hour extract.

## Extract (run 2)

31. **Locale-root capture-gap detector misses `.html` locale roots.** wknd.site's locale roots are
    `/us/en.html`, `/ca/en.html`; crawl.mjs reported "no locale root captured" while 38 linked pages
    (10 `/us/en/adventures/*`, the whole `/ca/en/**` tree incl. members-only) were uncaptured — exactly the
    recorded failure the detector exists for. → Strip `.html`/`.htm` before the locale-code test, and
    also report uncaptured same-origin links globally (not only under locale roots).
32. **Discovery stopped at 28/66 pages with no warning.** The BFS (depth 3) never queued the adventure
    detail pages that sit behind the listing's filter tabs. → After discovery, print "N same-origin links
    seen but not queued" so the gap is visible without an ad-hoc probe; offer `--closure` to iterate
    `--pages` until no linked page is uncaptured.
33. **crawl.mjs has no `--prep` flag** although extract § Prep says `--prep` implies `--all`; the agent
    must map it to `--max 0` and run typing / module detection by hand. → Accept `--prep` as an alias of
    `--max 0` and say in `--help` which prep steps remain agent-side.
34. **No state writer for extract.** `state.mjs` can advance a page but cannot add `pages[]` rows, set
    `site.*` or stamp `handsOff`; every --prep run hand-writes a merge script. → `state.mjs add-pages
    --from stardust/current/pages --type-map <file>` and `state.mjs set handsOff true`.
35. **Carousel slides beyond the active one are absent from `media.imgs`** (home + 32 adventure pages).
    The rendered DOM sidecar has them, so recreation is safe, but media-reconcile counts will be low.
    → Walk hidden carousel slides (`[aria-hidden]` slide containers) in the media capture.

## Recreate / gate (run 2)

36. **unit-geometry caches live unit measurements per slug, not per width**
    (`stardust/current/measure/<slug>-units.json`). A 360 round after a 1440 round — or both in parallel,
    which run-bg's slots invite — compares against the other width's positions and reports every unit "off".
    Two workers hit it independently. → Key the cache by `<slug>-<width>`.
37. **gate.sh loses its executable bit when the skill's `cp -r` copy step is followed** (plugin file mode);
    `run-bg … -- stardust/scripts/replica/gate.sh` then fails with EACCES (exit 127). → Document
    `bash gate.sh`, or have the copy step `chmod +x`.
38. **Cumulative canon needs a request queue the skill doesn't define.** With parallel archetype workers,
    "import the shared layers" requires a single writer; a `canon-requests.md` queue + one canon
    maintainer round (move rules, re-gate every gated archetype, ±0.10 % bar) worked: 15 requests,
    8 re-gates, no number moved. → Ship this as the fan-out contract for Phase 3.

# Run 3 — /ca/en scope on top of run 2 (2026-10-23)

39. **No documented "scope narrows / grows within an existing inventory" entry.** A follow-up ask for a
    subset already captured and gated (here /ca/en) has two readings: re-run Phase 1–4 from zero, or
    deliver from the existing inventory. The skills only describe `--refresh <slug>` and the pilot → site
    growth path. → Add a "scoped follow-up" entry to replica: freshness check of the subset's captures
    (content hash vs live), then Phase 5 for the subset plus the archetypes it depends on (#126).
40. **Workspace guard vs. delivery scripts.** In EMA the admin/DA guard blocked batched `curl` loops and
    every `preview` / `DELETE` call even after an explicit owner request, while single PUTs and the
    node delivery scripts went through. → The deploy card should name the EMA path that is allowed
    (deploy-batch.mjs) and say that chat approval is evaluated per call.
41. **Owner-side DA folder moves silently invalidate delivered documents** (C0 chrome moved to a renamed
    folder, old content moved in). → `deploy-batch.mjs` should verify the DA source of every ledger entry
    still exists (HEAD) before reporting "skips pages already live".
42. **crop-compare default `--out crop-diff.png` writes into the CWD** — a stray file landed in the repo root
    and was committed and served by EDS. → Default the diff into the gate dir or `stardust/.work/`.
43. **deploy-batch.mjs passes `--branch` verbatim into admin URLs.** A git branch with a slash
    (`feat/wknd-ca-en`) becomes `/preview/<org>/<site>/feat/wknd-ca-en/<path>`: the admin API reads branch
    `feat` and path `/wknd-ca-en/…`, so every preview 404s while the PUTs succeed. → Normalise to the host
    label (slash to hyphen) or refuse a slash.
44. **No force / re-upload path in da-media-upload.mjs.** After the owner moved DA folders, the ledger said
    "uploaded" for 27 images that no longer existed in the target folder; the only remedy was rotating the
    ledger file. → `--verify` (HEAD each ledger entry against DA) and `--force`.
