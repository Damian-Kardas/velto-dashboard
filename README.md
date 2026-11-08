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

The visual configurator can automatically discover Home Assistant Areas and devices. It also lets you choose presence, calendar, theme and a `weather.*` entity for the 7-day forecast. Advanced settings expose smart layout, diagnostics, room controls, favorites and tile-layout persistence. When the Home Assistant tab or app returns to the foreground, VELTO refreshes the calendar and weather forecast, redraws date-driven tiles and realigns the midnight refresh timer. Calendar requests begin at local midnight to include all-day events starting today; expired timed events are excluded, and the range advances by local dates across daylight-saving changes. Clock, calendar and weather polling intervals are suspended while the browser tab is hidden and resume on foreground return. Full shadow-DOM rebuilds are also deferred while the page is hidden; rapid background state updates are coalesced and the latest state is rendered once the tab becomes visible. Foreground-return and local-midnight date refreshes use the same animation-frame scheduler. Render invalidation tracks only displayed state and attributes such as labels, units, icon classes, artwork and control capabilities, avoiding full dashboard rebuilds for unrelated metadata timestamp changes.

## Latest preview update (November 2026)

The current HACS distribution includes a collapsible room sidebar, clearer device filters, scroll-position preservation, a seven-day weather layout, animated inline SVG forecast icons, keyboard-accessible horizontal forecast scrolling, accessible daily weather summaries and PM2.5/PM10 severity labels.

If HACS does not immediately offer an update, open **HACS → VELTO Dashboard → ⋮ → Redownload** (menu wording may vary), then reload Home Assistant and hard-refresh the browser. Existing installations should keep the resource URL under `/hacsfiles/velto-dashboard/velto-dashboard.js`; do not add the old `/local/velto/...` resource alongside it.

This is a preview build. Keep a fallback dashboard while checking the new sidebar and scrolling on your own devices.

## Weekly waste collection tile

The **Odpady** tile is enabled by default in the current VELTO preview. It calculates the next Friday pickup from one anchor Friday and alternates between mixed waste and recycling every seven days. It displays the next collection, bin hint, countdown and following Friday. Its collapsed/expanded state is remembered per dashboard layout and synchronized across open tabs in the same browser.

The built-in anchor (**2026-11-06**, mixed waste) is an example, not a schedule detected from your municipality. Before relying on the reminder, set your own reference Friday and collection type in the visual editor under **Odbiór odpadów**. The editor moves a selected date forward to the next Friday.

You can disable the tile with the editor checkbox or `enabled: false`:

```yaml
waste_collection:
  enabled: true
  anchor_date: "2026-11-06" # example Friday: mixed waste
  anchor_type: mixed
  show_next: true
  show_in_rooms: false
```

The tile does not create Home Assistant entities or send notifications.

## PM2.5 / PM10 reference scale

The weather card uses the six-level Polish GIOŚ Air Quality Index reference bands for 1-hour concentrations: PM2.5 thresholds 13 / 35 / 55 / 75 / 110 µg/m³ and PM10 thresholds 20 / 50 / 80 / 110 / 150 µg/m³. A local or InPost sensor is not a GIOŚ monitoring station, so these labels are indicative comparisons, not an official GIOŚ station index. Missing or invalid readings remain neutral.

## Mobile fullscreen

The header button first requests the browser Fullscreen API. Some iOS Safari and Home Assistant webview combinations do not allow arbitrary dashboard elements to enter native fullscreen, so VELTO falls back to a fixed, full-viewport layout with safe-area padding for notches and home indicators. The header remains available while scrolling. Exit with the same fullscreen button or press **Escape** when a hardware keyboard is connected. This is a presentation fallback, not kiosk mode or an access-control boundary.

## Calendar privacy and compact view

The calendar toolbar uses inline SVG controls for refresh, title privacy and expand/collapse. On phones, when more than three events are loaded, VELTO starts in compact mode with the first three visible; expand it to show all events up to the configured limit. Desktop starts expanded, and a manual choice is preserved during later calendar refreshes. When browser storage is available, the privacy preference is remembered and synchronized across open VELTO tabs in the same browser. In privacy mode, event titles remain in the DOM as heavily blurred text, locations are omitted, and screen readers receive only a neutral “Tytuł wydarzenia ukryty” label. The original event title remains in the DOM (blurred with CSS) and in Home Assistant data, so this is visual screen privacy only, not access control. Screen readers receive a generic label instead of the title.

## Updating

Once installed through HACS, update VELTO from HACS instead of manually replacing files in `/config/www`.

### If Redownload does not change the dashboard

1. In **Settings → Dashboards → Resources**, confirm there is only one VELTO resource: `/hacsfiles/velto-dashboard/velto-dashboard.js`, with type **JavaScript module**.
2. In browser developer tools, open **Network**, filter for `velto-dashboard.js`, and reload once. Check the request status, response size and initiator. A 404 indicates a missing resource; a 200 with old content suggests browser/proxy caching or a duplicate resource.
3. Do not repeatedly reinstall or remove a working resource until the new HACS card loads. Keep your previous dashboard as a fallback.

For a quick read-only check from the browser console on your Home Assistant origin:

```js
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 10000);
fetch('/hacsfiles/velto-dashboard/velto-dashboard.js?check=' + Date.now(), {
  cache: 'no-store', signal: controller.signal
}).then(async response => {
  const source = await response.text();
  console.log({status: response.status, bytes: source.length,
    hasThemeToggle: source.includes('velto:theme:override')});
}).catch(error => console.warn('VELTO resource check:', error.message))
  .finally(() => clearTimeout(timer));
```

Do not share authentication tokens or full HAR captures when asking for help.

## Status

VELTO is currently a preview build. Keep your existing Home Assistant dashboard available as a fallback while testing controls and layout on your own devices.

## Performance on older touch devices

VELTO preserves the same visual language and device-state animations on touch devices; it does not apply a blanket low-cost profile that strips shadows, glow or motion from older iPads. Performance work is targeted at JavaScript scheduling, cached SVG templates, keyed DOM reuse, avoiding unnecessary renders and reducing repeated entity/attribute processing. The dashboard also respects the operating system's reduced-motion preference. Actual responsiveness still depends on the iPad model, iPadOS/Safari version, Home Assistant entity count and network latency; verify on the target device before treating performance as validated.
