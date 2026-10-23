# WKND full-site same-design migration — plan & tracker

Source: https://wknd.site/ (all locales)
Flow: replica (same design, near pixel-perfect) — stardust `replica` skill, full `--prep` entry
Branch: `feat/wknd-full-replica` (from `main` @ 71d7e86)
Started: 2026-10-23
Grows from: the bounded `/us/en` pilot (`stardust/replica-plan.md`, PR #1)

## Decisions (user, 2026-10-23)

| Decision | Answer |
|---|---|
| Site | **Full rename** edsmsm → `wknd`; remove all MSM configuration |
| Scope | **All locales**, all pages and subpages, plus index, nav, footer — overwrite existing content |
| Delivery | **Preview only** — nothing published live |
| Approvals | **Hands-off** (`approvedBy: "hands-off"`) |
| Gate widths | 1440, 360 (skill defaults); no `--target-breakpoints`, no `--register` (pure replica) |

## Remote prerequisites (blocked on the user)

| # | Item | Who | Status |
|---|---|---|---|
| R1 | Explicit chat approval for remote changes (DA config, site config, DA upload, preview) | user | **waiting** |
| R2 | Rename GitHub repo `savitaagre/edsmsm` → `savitaagre/wknd` (no GitHub access from the agent) | user | **waiting** |
| R3 | Enable git push (Settings → LLM Permissions) to push `feat/wknd-full-replica` | user | **waiting** |
| R4 | Remove MSM: org `msm` sheet; "Multi-site Manager" rows in `prepare`/`apps` of edsmsm, ema, savisite | agent after R1 | pending |
| R5 | Create site config `wknd` (code `savitaagre/wknd`, content `https://content.da.live/savitaagre/wknd`) + DA site config | agent after R1+R2 | pending |
| R6 | Decide what happens to the old `edsmsm` site config and DA content (kept as backup until told) | user | open |

Backups of every config touched: `stardust/wknd-rename/backups/` (taken 2026-10-23, before any change).

## Phases

| # | Phase | Status | Notes |
|---|---|---|---|
| 0 | Setup (branch, flow guard, deps, script copies) | in progress | |
| 1 | Extract `--prep --dynamics` (all locales) | pending | |
| 2 | Preserve direction (verbatim promotion), register, dynamics triage | pending | |
| 3 | Recreate one archetype per page type | pending | |
| 4 | Source-fidelity gate 1440 + 360, cap-probe, motion parity, approval | pending | |
| 5 | Handoff: C0 foundation → C-archetype → C1…Cn → C-final, all-pages gate on wknd preview | blocked (R1–R5) | |

## Log

- 2026-10-23 Setup: read configs; backups written; MSM removal attempted and refused by the
  workspace guard (remote change needs an explicit chat request) — nothing remote changed.
  GitHub API and `git ls-remote` both unauthenticated → rename and push need the user.
  Branch `feat/wknd-full-replica` created from `main`.
