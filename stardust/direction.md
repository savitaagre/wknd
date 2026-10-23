---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-23T08:14:00Z
  againstInput: https://wknd.site/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://wknd.site/ (all locales,
65 pages, `extract --prep --dynamics`), promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-10-23T08:14:00Z).

Provenance: verbatim `--prep` promotion (run 2). Supersedes the 2026-10-16 `bounded-single`
synthesis of the `/us/en` pilot.

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(3 entries, all `applied`, all structural: one `<h1>` per page — R-01 landing, R-02 coming-soon,
R-03 ai-powered-search; no visual change).

Fidelity: ia verbatim · design verbatim · content verbatim.
