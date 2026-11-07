# VELTO Dashboard

VELTO is an Apple Home-inspired Home Assistant dashboard with automatic Area discovery, responsive room navigation, touch-friendly tile editing, custom device controls, smart home highlights, InPost sensor support, Google Calendar and a 7-day Home Assistant weather forecast.

## Install with HACS

[![Open VELTO in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Damian-Kardas&repository=velto-dashboard&category=plugin)

If the button does not add the repository automatically:

1. Open **HACS** in Home Assistant.
2. Open the **⋮** menu and choose **Custom repositories**.
3. Add `https://github.com/Damian-Kardas/velto-dashboard`.
4. Choose type **Dashboard**.
5. Open **VELTO Dashboard** and choose **Download**.
6. Reload Home Assistant and refresh the browser/app.
7. Create or open a dashboard view using **Panel (1 card)**.
8. Choose **Add card → VELTO Dashboard**.
9. Complete the short VELTO first-run configurator and save.

No YAML or entity IDs are required for the normal first setup. Assign devices to Home Assistant **Areas** and VELTO can build rooms automatically.

## Migrating from an old /local installation

If you previously loaded VELTO manually from `/local/velto/...`:

1. Install VELTO through HACS first.
2. Go to **Settings → Dashboards → Resources**.
3. Remove the old VELTO resource pointing to `/local/velto/...`.
4. Keep only the HACS-installed resource under `/hacsfiles/...`.
5. Hard-refresh the browser/app.

Do not keep the old and HACS resources active at the same time.

## First-run setup

The visual configurator can automatically discover Home Assistant Areas and devices. It also lets you choose presence, calendar, theme and a `weather.*` entity for the 7-day forecast. Advanced settings expose smart layout, diagnostics, room controls, favorites and tile-layout persistence.

## Latest preview update (November 2026)

The current HACS distribution includes a collapsible room sidebar, clearer device filters, scroll-position preservation, a seven-day weather layout, animated forecast symbols and PM2.5/PM10 severity labels.

If HACS does not immediately offer an update, open **HACS → VELTO Dashboard → ⋮ → Redownload** (menu wording may vary), then reload Home Assistant and hard-refresh the browser. Existing installations should keep the resource URL under `/hacsfiles/velto-dashboard/velto-dashboard.js`; do not add the old `/local/velto/...` resource alongside it.

This is a preview build. Keep a fallback dashboard while checking the new sidebar and scrolling on your own devices.

## Updating

Once installed through HACS, update VELTO from HACS instead of manually replacing files in `/config/www`.

## Status

VELTO is currently a preview build. Keep your existing Home Assistant dashboard available as a fallback while testing controls and layout on your own devices.
