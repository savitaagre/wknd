<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-23T08:13:30.256Z · input stardust/current/_dynamics.json (10 pages, 30 findings) -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-adobedatalayer | A | CMS / app settings object adobeDataLayer | 10/10 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-cms-app-settings-object-granite | A | CMS / app settings object Granite | 10/10 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-cms-app-settings-object-cq | A | CMS / app settings object CQ | 10/10 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 4 | d-first-party-data-file-get-home-users-o-oa6pkcc2rneodh2ni0q | D | first-party data file GET /home/users/o/oa6PkCC2rneOdh2ni0qG.infinity.json | 10/10 (reach 66/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 5 | d-first-party-data-file-get-libs-granite-csrf-token-json | D | first-party data file GET /libs/granite/csrf/token.json | 10/10 (reach 66/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 6 | d-first-party-data-file-get-libs-granite-security-currentuse | D | first-party data file GET /libs/granite/security/currentuser.json | 10/10 (reach 66/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 7 | d-first-party-data-file-get-content-wknd-us-en-jcr-content-c | D | first-party data file GET /content/wknd/us/en/_jcr_content/contexthub.pagedata.json | 1/10 (reach 2/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 8 | d-first-party-data-file-get-content-wknd-us-en-adventures-jc | D | first-party data file GET /content/wknd/us/en/adventures/_jcr_content/contexthub.pagedata.json | 1/10 (reach 1/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 9 | d-first-party-data-file-get-content-wknd-us-en-adventures-cl | D | first-party data file GET /content/wknd/us/en/adventures/climbing-new-zealand/_jcr_content/contexthub.pagedata.json | 1/10 (reach 1/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 10 | d-first-party-data-file-get-content-wknd-us-en-magazine-jcr- | D | first-party data file GET /content/wknd/us/en/magazine/_jcr_content/contexthub.pagedata.json | 1/10 (reach 1/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 11 | d-first-party-data-file-get-content-wknd-ca-en-magazine-memb | D | first-party data file GET /content/wknd/ca/en/magazine/members-only/_jcr_content/contexthub.pagedata.json | 1/10 | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 12 | d-first-party-data-file-get-content-wknd-us-en-magazine-guid | D | first-party data file GET /content/wknd/us/en/magazine/guide-la-skateparks/_jcr_content/contexthub.pagedata.json | 1/10 (reach 1/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 13 | d-first-party-data-file-get-content-wknd-us-en-faqs-jcr-cont | D | first-party data file GET /content/wknd/us/en/faqs/_jcr_content/contexthub.pagedata.json | 1/10 (reach 1/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 14 | d-first-party-data-file-get-content-wknd-us-en-about-us-jcr- | D | first-party data file GET /content/wknd/us/en/about-us/_jcr_content/contexthub.pagedata.json | 1/10 (reach 1/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 15 | d-first-party-data-file-get-content-wknd-us-es-jcr-content-c | D | first-party data file GET /content/wknd/us/es/_jcr_content/contexthub.pagedata.json | 1/10 (reach 1/66) | data-fed | self | pending | sheet-sync | none (sync from the source origin) |  |
| 16 | i18n-locale-variants-ca-ca-ch-ch-ch | I18N | locale variants ca,ca,ch,ch,ch | 9/10 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 17 | i18n-locale-variants-us-us-ch-ch-ch | I18N | locale variants us,us,ch,ch,ch | 1/10 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 18 | l-listing-candidate-cmp-image-list-16-cards | L | listing candidate cmp-image-list (16 cards) | 1/10 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 19 | l-listing-candidate-cmp-image-list-6-cards | L | listing candidate cmp-image-list (6 cards) | 1/10 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 20 | l-listing-candidate-cmp-list-4-cards | L | listing candidate cmp-list (4 cards) | 1/10 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 21 | m-modal-trigger-data-modal-url-chrome-only-target-outside-do | M | modal trigger data-modal-url (chrome only) → target outside DOM at capture | 10/10 (reach 132/66) | rebuild-native | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 22 | s-first-party-data-file-get-content-wknd-us-en-ai-powered-se | S | first-party data file GET /content/wknd/us/en/ai-powered-search/_jcr_content/contexthub.pagedata.json | 1/10 (reach 1/66) | index-backed | self | pending | search-index-backed | replace the hosted search service? |  |
| 23 | s-site-search-form-js-submitted | S | site search form → (JS-submitted) | 1/10 (reach 1/66) | index-backed | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 24 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 10/10 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 10/10 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 10/10 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-unknown-third-party-host-wkndsitewknd887971p-112-2o7-net | T | unknown third-party host wkndsitewknd887971p.112.2o7.net | 10/10 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | x-sign-in-account-links | X | sign-in / account links | 10/10 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 29 | chrome-account | X | header account: Sign In (chrome only) | 1/1 | rebuild-native | needs-backend | pending | chrome-interaction | sign-in on the new host (the menu ships per the contract either way) |  |
| 30 | chrome-menu | M | header menu: en-US (chrome only) | 1/1 | rebuild-native | self | pending | chrome-interaction | none (the header contract is the spec) |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 19 row(s) — read-settings, sheet-sync, chrome-interaction, search-index-backed.
- **One owner decision batch:** 10 row(s) — scope of the locale trees · index-driven or editorially curated? · which tags run on the new host; property ids · sign-in on the new host (the menu ships per the contract either way).
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **data** — 12
- **tags** — 4
- **detect** — 3
- **listings** — 3
- **interactive** — 3
- **locale wave** — 2
- **search** — 2
- **register** — 1
