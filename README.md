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

No YAML or entity IDs are required for the normal first setup. Assign devices to Home Assistant **Areas** and VELTO can build rooms automatically. The visual editor keeps searchable entity pickers up to date, announces no-match states, and retains keyboard focus plus the active search query when its configuration refreshes. In the advanced room editor, the collapsible **Dodaj urządzenia do pokoju** picker supports multi-select: search by friendly name or entity ID, keep selections while changing the query, select the visible results, and add several devices in one undoable configuration change. Existing room entities are excluded and no more than 60 result rows are rendered at once. Picker labels and IDs are indexed once per render; at most 80 native options are displayed at once, with the selected item kept visible, so large registries do not create thousands of option nodes on older tablets. The visual editor also offers up to 20 undo/redo steps during the current editing session. Use Ctrl/Cmd+Z to undo and Ctrl/Cmd+Shift+Z or Ctrl+Y to redo; native text-field editing shortcuts are preserved. Configuration changes are still sent to Home Assistant immediately; the history is memory-only and is cleared when an unrelated external configuration replaces the editor state. In the advanced room editor, accessible touch-sized ↑/↓ buttons reorder rooms and devices without drag-and-drop; controls disable at list boundaries, and every move can be undone with the editor history. Each manually assigned device can also receive an optional display label and icon override. Select multiple devices to copy the first selected tile's default size and icon to the others; custom-label copying is optional, and the operation is one undoable change. Use **Zaznacz wszystkie** and **Wyczyść zaznaczenie** for room-level selection; selection is cleared after a room switch or unrelated external configuration replacement. The size selector edits the default size; an explicitly saved dashboard layout keeps precedence. Choose **Automatycznie** to clear the override and return to VELTO's entity/device-class icon; media-player playback animation remains active. The editor can export the complete card configuration to a versioned JSON backup and restore it from a local file. Import is validated and previewed before replacement, and applying it is one undoable change. Backups contain room names and entity IDs, so keep them private.

## Migrating from an old /local installation

If you previously loaded VELTO manually from `/local/velto/...`:

1. Install VELTO through HACS first.
2. Go to **Settings → Dashboards → Resources**.
3. Remove the old VELTO resource pointing to `/local/velto/...`.
4. Keep only the HACS-installed resource under `/hacsfiles/...`.
5. Hard-refresh the browser/app.

Do not keep the old and HACS resources active at the same time.

## First-run setup

The visual configurator can automatically discover Home Assistant Areas and devices. It also lets you choose presence, calendar, theme and a `weather.*` entity for the 7-day forecast. Advanced settings expose smart layout, diagnostics, room controls, favorites and tile-layout persistence. When the Home Assistant tab or app returns to the foreground, VELTO refreshes the calendar and weather forecast, redraws date-driven tiles and realigns the midnight refresh timer. Calendar requests begin at local midnight to include all-day events starting today; expired timed events are excluded, and the range advances by local dates across daylight-saving changes. Clock, calendar and weather polling intervals are suspended while the browser tab is hidden and resume on foreground return. Full shadow-DOM rebuilds are also deferred while the page is hidden; rapid background state updates are coalesced and the latest state is rendered once the tab becomes visible. Foreground-return and local-midnight date refreshes use the same animation-frame scheduler. Render invalidation tracks only displayed state and attributes such as labels, units, icon classes, artwork and control capabilities, avoiding full dashboard rebuilds for unrelated metadata timestamp changes. If a refresh temporarily fails, returns an empty forecast, or contains no valid forecast dates, VELTO keeps the last successful forecast for the same configured weather entity and labels it as the last available data. While a replacement subscription is being established, cached data is explicitly marked as refreshing until a valid update arrives; failed or empty updates retain the stale-data warning. An empty or unparseable response is treated as a failed refresh, not as a valid forecast. VELTO clears the cached forecast when the selected source changes or the forecast is disabled; an explicitly selected weather entity remains selected while its state is temporarily unavailable.

## Latest preview update (November 2026)

The current HACS distribution includes a collapsible room sidebar, clearer device filters, scroll-position preservation, a full-width seven-day weather row on wide cards, a readable multi-row tablet layout, animated inline SVG forecast icons, keyboard-accessible horizontal forecast scrolling, accessible daily weather summaries and PM2.5/PM10 severity labels. Device tiles also use bundled Phosphor glyphs for common light, fan, lock, door/window, water and motion entities, with state-aware animation for running devices and attention states. Cover movement animates only while opening/closing, and all device motion respects reduced-motion preferences. Room summaries normalize recognized Celsius, Fahrenheit and Kelvin readings into the Home Assistant configured temperature unit; unknown sensor units are omitted instead of being labeled incorrectly. An amber attention chip appears only for open entry sensors, active alert-class binary sensors, unlocked or jammed locks, triggered/pending alarms, gas valves that are open or closing, low-battery sensors and lost connectivity. It names affected devices for assistive technology, remains read-only, and never sends a service call. The room summary, metric chips, filters and quick actions expose named accessibility groups.



Valve entities (valve.*) open a VELTO detail panel only through the explicit details action; ordinary tile taps keep Home Assistant's native more-info behavior and never toggle a valve. Open, close, stop and position controls are shown only when supported_features advertises the matching capability. Position changes are clamped to 0–100 and sent only after the slider is released. Gas-valve opening requires a second confirmation within 3.5 seconds; the gas position slider stays in the native Home Assistant dialog. Gas valves also appear in the Security room filter and receive elevated home-highlight priority while open.
If HACS does not immediately offer an update, open **HACS → VELTO Dashboard → ⋮ → Redownload** (menu wording may vary), then reload Home Assistant and hard-refresh the browser. Existing installations should keep the resource URL under `/hacsfiles/velto-dashboard/velto-dashboard.js`; do not add the old `/local/velto/...` resource alongside it.

This is a preview build. Keep a fallback dashboard while checking the new sidebar and scrolling on your own devices.

## Keyboard navigation of the weather forecast

The seven-day forecast is accessible from the keyboard without tabbing through every day. Press **Tab** once to focus the forecast region, then use **← / →** to move between days. **Home** and **End** jump to the first and last day. The focused day receives a visible amber outline; on narrow screens, off-screen days scroll into view. Smooth scrolling is disabled when the operating system requests reduced motion.

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

## Czytelne stany czujników

VELTO tłumaczy stany `binary_sensor` na podstawie `device_class`, zgodnie z semantyką Home Assistant. Drzwi i okna pokazują „Otwarte” / „Zamknięte”, czujniki ruchu — „Wykryto ruch” / „Brak ruchu”, a czujniki baterii, łączności, dymu, gazu, CO, stłuczenia szyby i naruszenia otrzymują jednoznaczne polskie etykiety. Ten sam opis trafia do nazwy dostępnej kafelka i podglądu w edytorze. Dostępne czujniki binarne otwierają również historię zmian stanu z etykietami zależnymi od klasy urządzenia po przytrzymaniu kafelka lub naciśnięciu F2; zwykłe dotknięcie nadal otwiera natywne informacje Home Assistant. Filtr „Bezpieczeństwo” obejmuje również czujniki CO, stłuczenia szyby, naruszenia i pozostałe obsługiwane klasy alarmowe; „Najważniejsze” może dodatkowo podnieść niski poziom baterii i utratę łączności. Stany `unknown` i `unavailable` pozostają niedostępne — nigdy nie są pokazywane jako stan normalny.

## Historia wartości i zdarzeń

Przytrzymaj kafelek liczbowego czujnika lub pomocnika (`number`, `input_number`, `counter`) przez 600 ms albo naciśnij F2, aby zobaczyć wykres historii z Home Assistant Recorder. Czujniki binarne udostępniają osobną chronologię zmian stanów. Zwykłe kliknięcie zachowuje dotychczasowe działanie kafelka.

## Performance on older touch devices

VELTO keeps its visual language on touch-first devices, including active-device icon animations, warm highlights, layered tile surfaces and the light/dark themes. Hover lift and hover-only shadow changes are reserved for devices with a fine pointer, so touchscreens do not pay for a simulated or sticky hover state. State invalidation also reuses the previous Home Assistant state-object references: when no displayed entity, room or theme has changed, VELTO skips rebuilding the dashboard signature and does not schedule a render. These changes reduce avoidable work without switching off the visual effects. Actual responsiveness still depends on the iPad model, iPadOS/Safari version, Home Assistant entity count and network latency; verify on the target device before treating performance as validated.

## Kontrola konfiguracji w edytorze

W zaawansowanym edytorze VELTO pojawia się panel **Kontrola konfiguracji**, gdy wykryje problemy w ręcznie przypisanych pomieszczeniach i urządzeniach. Wskazuje między innymi brakujące elementy Home Assistant, chwilowo niedostępne urządzenia, nieprawidłowe lub powtórzone ID oraz identyfikatory pomieszczeń użyte więcej niż raz. To diagnostyka, nie automatyczna naprawa: VELTO nie usuwa ani nie przepisuje konfiguracji. Brak stanu elementu może oznaczać również jego wyłączenie w Home Assistant, dlatego komunikat prosi o sprawdzenie zamiast zakładać, że urządzenie zostało usunięte. Kontrola brakujących elementów uruchamia się dopiero po udostępnieniu rejestru stanów przez Home Assistant.


## Live tile preview in the visual editor

In Advanced settings, each assigned device has a collapsed **Podgląd kafelka** section. Open it to inspect the resolved tile label, icon, size and current Home Assistant state, including custom overrides and automatic fallbacks. Only expanded previews follow their device's state changes; collapsed previews do not track state and do not trigger extra editor renders. For `input_text` helpers, previews never track or display the stored value; they do refresh when the helper switches between `text` and `password` mode so the protected-value label stays accurate. It is read-only and never calls a Home Assistant service or changes card configuration. Keeping previews collapsed by default avoids unnecessary SVG work on older tablets.

## Room icon picker

The advanced room editor includes an **Ikona pomieszczenia** selector with a curated set of bundled Phosphor icons for the hallway, garden, children's room, living room, office, server rack, storage, kitchen, bathroom, bedroom and garage. Choose **Automatycznie** to return to the name-based icon mapping. Existing configurations using older room icon names remain supported; legacy fan and camera glyphs are retained as compatibility choices. Icons are bundled inline, so the dashboard makes no CDN requests and adds no runtime dependencies.


## Device detail controls

VELTO's climate dialogs expose Home Assistant-supported fan, preset, swing and target-humidity controls; cover dialogs add tilt actions and a tilt-position slider when the entity reports those capabilities. Humidifier dialogs expose reported current/target humidity, supported operating modes and on/off actions without guessing unsupported options. Vacuum dialogs expose only the actions advertised by the current Home Assistant vacuum feature mask, including start/resume, pause, stop, return-to-dock, spot clean, locate and fan-speed selection when available. Inline light-tile brightness, detail actions and quick controls share the per-entity in-flight service lock; a pending light command disables the slider and marks the tile busy, preventing duplicate requests. VELTO does not expose raw vacuum commands or guessed room/segment IDs. `input_datetime.*` helpers also get native date/time pickers with validated `input_datetime.set_datetime` payloads and rollback on service failure. See [device control documentation](docs/DEVICE-CONTROLS.md) for supported attributes and service payloads.

## Switches and automations

`switch.*` entities open a VELTO detail panel from **Więcej** with the current on/off state and explicit `switch.turn_on` / `switch.turn_off` actions. Normal tile taps keep their direct `switch.toggle` behavior. `automation.*` details show enabled state, the current run count, execution mode and last-triggered time. Enable/disable uses explicit services. Manual execution is available only while the automation is enabled and requires a second confirmation; VELTO sends `automation.trigger` with `skip_condition: false`, so Home Assistant evaluates the automation's conditions. Manual runs do not provide normal trigger data such as `trigger.id`, so automations that depend on it may not behave as they do after a real trigger.

## Input booleans

Assign an `input_boolean.*` helper to a room to open its VELTO detail panel. The panel shows the current on/off state and provides one accessible toggle control that sends explicit `input_boolean.turn_on` or `input_boolean.turn_off` commands. The pressed state changes only after Home Assistant accepts the service call; a failed call leaves the previous display intact. The shared per-entity lock prevents rapid duplicate actions. Normal tile activation keeps its existing direct `input_boolean.toggle` behavior, and the native Home Assistant details action remains available.

## Counter helpers

Assign a UI-managed `counter.*` helper to a Home Assistant Area and VELTO will show its current value with step-aware increment/decrement controls. Home Assistant enforces configured minimum/maximum values; VELTO disables actions at reported boundaries. Reset appears only when a valid initial value is available. YAML-defined/read-only counters remain non-editable.

## Text helpers

Manually assign an `input_text.*` helper to a room to edit it in VELTO. Text and password modes use the Home Assistant helper's reported length and pattern constraints, an explicit save button, and rollback if Home Assistant rejects the update. Password values are masked in the detail dialog, tile accessible name and editor preview. Text helpers are not included in default automatic Area discovery because they may contain private values. Password masking is a UI safeguard, not a replacement for Home Assistant access control.

## Button entities

`button.*` and `input_button.*` tiles continue to call their matching Home Assistant `press` service on normal activation. The explicit More action opens a VELTO detail panel with a validated last-press timestamp and a deliberate **Naciśnij przycisk** action. Opening the panel never triggers the service; the action uses the shared per-entity lock and sends only the selected entity ID. Integration-specific effects and configuration remain in Home Assistant.

## Timer helpers

Assign a `timer.*` helper to a room to see its countdown in VELTO. Active timers use the Home Assistant `finishes_at` timestamp for a live display while the detail dialog is visible; paused timers show their saved remaining time. Idle timers can be started with their configured duration, paused timers can be resumed, and active/paused timers can be canceled. VELTO intentionally omits manual finish because `timer.finish` fires the `timer.finished` event and may trigger automations early. Cancel uses `timer.cancel`, which does not fire that event.

