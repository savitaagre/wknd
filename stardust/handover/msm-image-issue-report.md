**Subject:** Multi-Site Manager (early access): satellite pages lose all DA images (`about:error`) when using the da-msm content provider

Hello,

We are testing Multi-Site Manager for Document Authoring / Edge Delivery Services, following
https://www.aem.live/docs/ew/administering/multi-site-manager. Pages preview and publish through the
MSM content provider, but every image on those pages is delivered as `<img src="about:error">`.

**Setup**

- Org: `savitaagre`
- Base site: `edsmsm` (content source `https://content.da.live/savitaagre/edsmsm`)
- Satellite under test: `ema` (code repo `savitaagre/ema`)
- Org config `msm` tab:

  | base | satellite | title |
  |---|---|---|
  | edsmsm | | edsmsm |
  | edsmsm | ema | ema |
  | edsmsm | savisite | savisite |

- MSM Prepare-menu plugin and MSM app enabled in the `prepare` and `apps` tabs of all three sites.
- Satellite content source set via the Admin API (`POST /config/savitaagre/sites/ema/content.json`) to:
  `{"url": "https://da-msm.adobeaem.workers.dev/savitaagre/ema/", "type": "markup"}`

**What happened (2026-10-19, UTC)**

1. 11:52: switched `ema` to the da-msm content provider (the site received a new contentBusId, as expected).
2. 12:13: a signed-in author previewed and published `/drafts/wknd-shell` on `ema`. This page exists only on
   the base site, so inheritance itself appears to work.
3. 12:18–12:19: the same signed-in author bulk previewed and published all 22 existing `ema` pages from
   https://da.live/apps/bulk. All succeeded (HTTP 200).
4. The delivered pages had correct text, headings and links, but **every image was `src="about:error"`**.
   Examples (`.plain.html` on `main--ema--savitaagre.aem.live`):
   - `/nav`: logo `https://content.da.live/savitaagre/ema/.nav/wknd-logo-4175b433.svg` → `about:error`
   - `/footer`: logo `.../.footer/wknd-logo-light-ce768aef.svg` → `about:error`
   - `/testimonials-test`: 3 images under `https://content.da.live/savitaagre/ema/.testimonials-test/` → 3 × `about:error`
   - `/hero-video-test`, `/blog/ace-pro-court-polo`: same.
5. 12:20: reverted `ema` to `https://content.da.live/savitaagre/ema` (original contentBusId restored). With that
   source, the same pages and images deliver correctly.

**Observations**

- The images are authored as absolute `https://content.da.live/savitaagre/ema/...` URLs (standard DA uploads).
  Requested without authentication, both `content.da.live` and the da-msm worker answer 401 for them.
- An automated (non-signed-in) preview through da-msm returns 401 "error from content-bus"; a signed-in author's
  preview succeeds. Only the images fail.
- Our guess (unconfirmed): when the content source is the da-msm worker, the image fetch to `content.da.live`
  during ingestion is not authorized, so the pipeline substitutes `about:error`.

**Questions**

1. Is this a known limitation of the MSM content provider, or is extra configuration needed (for example
   content-source authorization or image handling) for DA-hosted images on satellites?
2. Will images on pages inherited from the base site (`edsmsm`, also hosted on `content.da.live`) be affected the same way?
3. Is there a recommended way to switch an existing, published satellite without an outage? Changing the content
   source assigns a new, empty contentBusId.

Thank you,
Savita Agre (sagre@adobe.com)
