# WKND – AEM Multi Site Manager (MSM) implementation

Implements the MSM setup described in
`docs/aem-multi-site-manager-msm-comprehensive-feature-guide-2026-10-21-10-21.pdf`
(PDF section numbers are shown as §1–§8).

This folder is **not** part of the Edge Delivery site (it is listed in `.hlxignore`).
Copy `ui.apps/` and `ui.config/` content into your AEM as a Cloud Service project.

---

## 1. Requirements extracted from the PDF

| # | PDF requirement | How it is implemented |
|---|---|---|
| R1 | Create sites from a Blueprint Configuration (§1) | `blueprintconfigs/wknd-language-masters` (code) + **Create Site** wizard (UI) |
| R2 | Deep / shallow / nested Live Copies, ad-hoc sources (§1) | UI – Create Live Copy (Step U4) |
| R3 | Choose rollout configs at creation (§1) | Default set to `wknd-standard-rollout`; selectable in wizards |
| R4 | Rollout (push) and Synchronize (pull) (§2) | UI – Step U6 |
| R5 | Triggers On Rollout / Modification / Activation / Deactivation (§2) | Custom config uses **On Rollout**; built-in Activate/Deactivate configs reused optionally; **On Modification not used** (Cautions) |
| R6 | Reusable custom rollout config, ordered actions (§2, §7) | `rolloutconfigs/wknd-standard-rollout` |
| R7 | Exclusions for properties / paragraph items / node types (§2) | `ContentUpdateActionFactory`, `ContentCopyActionFactory` OSGi configs – anything named `wkndLocal*` never syncs |
| R8 | Cancel / re-enable inheritance, suspend, resume, detach, reset (§3) | UI – Step U7, governed by roles |
| R9 | Control inheritance of Live Copy config / rollout configs (§3) | UI – Page Properties › Live Copy (Step U5) |
| R10 | Live Copy Overview and relationship monitoring (§4) | UI – Step U8, plus `tools/verify-msm.sh` |
| R11 | Language masters → country sites; language copies via translation (§5) | Structure below + Translation Cloud Service (Step U2) |
| R12 | Sync actions: content, references, versioning, workflow, permissions (§6) | Content + references actions in custom config; others optional (section 7) |
| R13 | MSM for Content Fragments / Assets / XF (§8) | Out of initial scope; notes in section 7 |
| R14 | Cautions: no On Modify, reset destructive, detach permanent, MSM ≠ translation | Applied in design and test cases |

The PDF is a general feature guide and doesn't name specific sites. Source and target
sites are taken from the language menu already in this site's navigation.

## 2. Environment findings

- This repository is an **Edge Delivery Services site authored in Document Authoring**.
  It contains **no AEM project** (no `pom.xml`, `ui.apps`, `ui.config`) and no AEM author
  environment reference.
- MSM requires **AEM Sites as a Cloud Service authoring** (Universal Editor projects
  publishing to Edge Delivery work). Document Authoring does not use AEM MSM.
- Assumptions (change them if they differ):
  - AEM version: **AEM as a Cloud Service**, deployed via **Cloud Manager**.
  - Project/app id: `wknd` (OSGi configs live in `/apps/wknd/osgiconfig`).
  - Content root: `/content/wknd`.

## 3. Design

### Source and targets

```
/content/wknd/language-masters/      ← Blueprint Configuration sitePath (source)
   en                                ← authored master
   es  fr  de  it                    ← Language Copies of en (translation, §5)

Live Copies (deep, rollout config: WKND Standard Rollout)
   /content/wknd/us/en  ← language-masters/en      /content/wknd/us/es  ← language-masters/es
   /content/wknd/ca/en  ← language-masters/en      /content/wknd/ca/fr  ← language-masters/fr
   /content/wknd/ch/de  ← language-masters/de      /content/wknd/ch/fr  ← language-masters/fr
   /content/wknd/ch/it  ← language-masters/it      /content/wknd/de/de  ← language-masters/de
   /content/wknd/fr/fr  ← language-masters/fr      /content/wknd/es/es  ← language-masters/es
   /content/wknd/it/it  ← language-masters/it
```

### Rollout configurations

| Config | Location | Trigger | Actions (in order) | Use |
|---|---|---|---|---|
| **WKND Standard Rollout** | `/apps/msm/wknd/rolloutconfigs/wknd-standard-rollout` | On Rollout | contentUpdate, contentCopy, contentDelete, referencesUpdate, orderChildren | All live copies (system default) |
| Activate on Blueprint Activation | `/libs/msm/wcm/rolloutconfigs/activate` (built-in) | On Activation | targetActivate | Optional: only for sites that must publish with the master |
| Deactivate on Blueprint Deactivation | `/libs/msm/wcm/rolloutconfigs/deactivate` (built-in) | On Deactivation | targetDeactivate | Pair with the one above |
| Push on Modify | built-in | On Modification | – | **Not used** (PDF caution) |

### Inheritance rules

| Content | Rule |
|---|---|
| Page structure, adventures, magazine, header, footer | Inherited – no local edits |
| Country promotions, prices, contact details | Authors **cancel inheritance** on that component |
| Country-only page properties | Name them `wkndLocal…` – excluded from sync by OSGi config |
| Locally translated text | Cancel inheritance to protect it from later rollouts (§5) |
| Live Copy configuration on child pages | Inherited from root (Live Copy Inheritance = on) |
| Rollout configs on child pages | "Inherit Rollout Configs from Parent" = on |

## 4. Files (code)

| File | Purpose |
|---|---|
| `ui.apps/.../META-INF/vault/filter.xml` | Filter root `/apps/msm/wknd` |
| `ui.apps/.../apps/msm/wknd/rolloutconfigs/wknd-standard-rollout/.content.xml` | Custom rollout config (R5, R6) |
| `ui.apps/.../apps/msm/wknd/blueprintconfigs/wknd-language-masters/.content.xml` | Blueprint Configuration (R1) |
| `ui.config/.../config.author/com.day.cq.wcm.msm.impl.LiveRelationshipManagerImpl.cfg.json` | System default rollout config = WKND Standard Rollout (R3) |
| `ui.config/.../config.author/com.day.cq.wcm.msm.impl.RolloutManagerImpl.cfg.json` | Conflict handling for pages that already exist in a live copy |
| `ui.config/.../config.author/com.day.cq.wcm.msm.impl.actions.ContentUpdateActionFactory.cfg.json` | Sync exclusions (R7) |
| `ui.config/.../config.author/com.day.cq.wcm.msm.impl.actions.ContentCopyActionFactory.cfg.json` | Sync exclusions (R7) |
| `tools/verify-msm.sh` | Read-only validation against an author (section 6) |

> **Before deploying, compare the exclusion lists with your environment.** An OSGi config
> **replaces** the defaults, so the files repeat the standard AEM defaults and add only
> `wkndLocal.*`. Check the current values in Developer Console › Status › Configurations
> (or `/system/console/configMgr` on the local SDK) and keep any extra entries your
> environment already has.

## 5. AEM UI steps (cannot be done in code)

**U1 – Language master content.** Sites › create `/content/wknd/language-masters/en`
(page title "English") with the full tree: home, adventures, magazine, faqs, about-us.
Use only relative internal links within the master so `referencesUpdate` can rewrite them.

**U2 – Translation and language copies (§5).**
1. Tools › Cloud Services › Translation Cloud Services: create a config for your connector.
2. Page Properties of `/content/wknd` › Cloud Services: assign it.
3. Sites › select `language-masters/en` › References › Language Copies › **Create & Translate**:
   targets es, fr, de, it; "Create a new translation project".
4. Projects › open the translation project › start, review, approve.
5. Later updates: Language Copies › **Update language copies** (new translation job).

**U3 – Check the blueprint.** Tools › Sites › Blueprints: "WKND Language Masters" is listed
(it's deployed from code; `/apps` is read-only on Cloud Service, so don't create it here).

**U4 – Create country Live Copies (§1).** Either:
- Sites › Create › **Site** › choose "WKND Language Masters" › select a language
  (e.g. en) and sections › Title "United States", Name `us` › Rollout config
  "WKND Standard Rollout" › Create. Then move/rename so the result is `/content/wknd/us/en`, **or**
- Create the country folder page `/content/wknd/us` first, then Sites › select `us` ›
  Create › **Live Copy** › Source `/content/wknd/language-masters/en` › Title "English",
  Name `en` › leave **Exclude sub pages** unchecked (deep) › Rollout config
  "WKND Standard Rollout" › Create.

Repeat for every row of the Live Copies diagram in section 3.

**U5 – Inheritance of configuration (§3).** On each live copy root: Page Properties ›
Live Copy › keep **Live Copy Inheritance** checked and **Inherit Rollout Configs from Parent**
checked on child pages. Add "Activate on Blueprint Activation" here only for sites that
should auto-publish.

**U6 – Propagate changes (§2).**
- Push: select a master page › **Rollout** › "Rollout page" or "Rollout page and sub pages"
  › choose target live copies › Rollout (runs as a background job for large trees).
- Pull: live copy page › Page Properties › Live Copy › **Synchronize**.

**U7 – Local differences (§3).**
- Cancel inheritance: open the live copy page in the editor › select component ›
  **lock icon**. Re-enable: click the lock again, then **Synchronize** (re-enabling doesn't sync).
- Suspend / Resume, **Reset** (discards local changes), **Detach** (permanent):
  Page Properties › Live Copy.
- Governance: allow Reset and Detach only for an "MSM admins" group (Tools › Security ›
  Permissions on `/content/wknd`). Train authors on the destructive operations.

**U8 – Monitoring (§4).** Sites › select `language-masters/en` › **Live Copy Overview**:
status per live copy. Master Page Properties › **Blueprint** tab lists live copies and the
last rollout. Live copy Page Properties › **Live Copy** tab shows the source, status and
rollout config.

## 6. Deployment (AEM as a Cloud Service)

1. **Merge into the AEM project**
   - `ui.apps/src/main/content/jcr_root/apps/msm/**` → your `ui.apps` module; add
     `<filter root="/apps/msm/wknd"/>` to its `filter.xml`.
   - `ui.config/.../config.author/*.cfg.json` → your `ui.config` module's
     `osgiconfig/config.author/` (adjust `/apps/wknd` if your app id differs).
2. **Test locally on the AEM SDK**: `mvn clean install -PautoInstallSinglePackage`,
   then run the UI steps and the test cases on `http://localhost:4502`.
3. **Commit** to the Cloud Manager Git repository (feature branch → pull request).
4. **Run the Dev pipeline** in Cloud Manager (full-stack) and test on Dev author.
5. **Run the Production pipeline** (deploys to Stage, approval, then Production).
6. **Perform the UI steps U1–U8** on each environment (content isn't deployed by code).
   Content can be moved between environments with the Content Copy tool if needed.

On **AEM 6.5** (AMS or on-premise) the same files work. Deploy the package with Package
Manager or Maven, and the blueprint config may instead live in `/conf` or `/etc/blueprints`.
Check your version's documentation.

For **Edge Delivery**, map every live copy root (`/content/wknd/us/en`, `/content/wknd/ca/fr`, …)
to its public path in the site configuration. Several sites can share one code repository
("repoless" multi-site setup). Keep the header language switcher and `hreflang` links
pointing at those paths.

## 7. Optional extensions (not enabled)

- **Read-only global content** (§6 authoring permissions): add a second rollout config with
  `mandatoryContent` / `mandatoryStructure` actions for legal pages, targeting an author group.
- **Workflow / notifications** (§6): add `workflow` or `notify` actions after the content
  actions.
- **Custom Java action** (§7): implement `com.day.cq.wcm.msm.api.LiveActionFactory` in the
  `core` bundle and reference its action name as a `cq:LiveSyncAction` node.
- **Content Fragments** (§8): Live Copies from the Content Fragments console. On Modification
  isn't supported, so use On Rollout.
- **Assets** (§8): use the **Standard Rollout Config**, as Adobe recommends.
- **Experience Fragments** (§8): check support for your AEM version first.

## 8. Validation and test cases

Run `AEM_HOST=… AEM_TOKEN=… ./tools/verify-msm.sh` after U1–U5. It checks the rollout
config trigger and action order, the blueprint `sitePath`, the language masters, and that
all 11 country roots are deep live copies of the right master. It only reads data.

Run the functional tests on Dev (or the local SDK), using a test page such as
`language-masters/en/msm-test`:

| ID | PDF | Steps | Expected result |
|---|---|---|---|
| T1 | §1 | Tools › Sites › Blueprints | "WKND Language Masters" listed with source `/content/wknd/language-masters` |
| T2 | §1 | Create Site from the blueprint for a test country `/content/wknd/zz/en` | Site created with selected sections; Live Copy tab shows source `language-masters/en` and WKND Standard Rollout |
| T3 | §1 | Create Live Copy of one page with **Exclude sub pages** | Only that page created (shallow) |
| T4 | §1 | Create a Live Copy under `/content/wknd/zz/en` (nested) | Nested live copy created; overview shows both relationships |
| T5 | §2 | Edit a title on `language-masters/en/msm-test` and **save only** | Live copies unchanged (no On Modification trigger) |
| T6 | §2 | Rollout page and sub pages to all live copies | Title updated in all 11 country pages |
| T7 | §6 | Add a link in master to `/content/wknd/language-masters/en/adventures`, roll out | In `us/en` the link points to `/content/wknd/us/en/adventures` |
| T8 | §6 | Add a new child page and reorder children in master, roll out | Page appears in live copies, in the same order |
| T9 | §6 | Delete a page in master, roll out | Page removed from live copies |
| T10 | §3 | In `ca/fr`, cancel inheritance on a text component and edit it; change it in master; roll out | `ca/fr` keeps its local text; other copies update |
| T11 | §3 | Re-enable inheritance on that component | Local text stays until **Synchronize**; after Synchronize, master text shows |
| T12 | §2 | Change master, then on `ch/de` run **Synchronize** only | Only `ch/de` updates |
| T13 | §2 | Set page property `wkndLocalPromo=test` in master, roll out | Property is **not** copied to live copies |
| T14 | §3 | Suspend `es/es`, change master, roll out; then Resume and Synchronize | Not updated while suspended; updated after resume + sync |
| T15 | §3 | **Reset** a test live copy page with local changes | Inheritance restored; local changes gone (only on test pages) |
| T16 | §3 | **Detach** the test site `zz/en` | Relationship removed; Live Copy tab gone; no longer in overview |
| T17 | §4 | Open Live Copy Overview on `language-masters/en` | All live copies listed with status and last rollout |
| T18 | §5 | Update language copy `fr` via translation job, then roll out `language-masters/fr` | `ca/fr`, `ch/fr`, `fr/fr` receive translated content; locally cancelled components untouched |
| T19 | – | Rollout to a live copy where a page with the same name exists locally | Conflict handled (existing page renamed), no error |
| T20 | – | Publish a live copy page and open it on the Edge Delivery preview | Page renders at the mapped country path |

Clean up the test country `zz` afterwards.
