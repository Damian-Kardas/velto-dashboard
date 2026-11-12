# VELTO device detail controls

VELTO's detail dialogs use the capabilities exposed by Home Assistant rather than assuming that every climate, cover, fan, humidifier, water-heater or lock entity supports the same services.

Per-entity service locks belong to the active Home Assistant websocket connection and the current Lovelace card attachment. When the websocket changes or the card is detached while a command is pending, VELTO closes stale detail/history dialogs, clears obsolete busy indicators and retires the old locks. It shows a persistent, accessible warning naming the affected device because the command may have completed even though its confirmation was lost. A late response from the previous socket or card lifecycle cannot unlock or alter a newer action for the same entity. VELTO never retries a service automatically; check the device state before manually repeating a non-idempotent action whose result was interrupted.

## Interrupted service commands

A Home Assistant websocket replacement or Lovelace card detachment can interrupt the browser's wait for a service response without proving that Home Assistant did not execute the command. VELTO therefore labels the outcome as unknown, retires the old in-flight lock, and displays a persistent status notice with the affected friendly name (or entity ID when no name is available). Dismissing the notice only hides the warning; it does not change the device or retry the service. Verify the actual entity state before repeating non-idempotent actions such as pressing a button, triggering an automation, or opening a valve.

## Room context summaries

When the room control bar is enabled, it can show the average temperature and relative humidity available in that room. Temperature is read from climate entities' `current_temperature` and temperature-class sensors. Climate readings use the `temperature_unit` state attribute when present (Home Assistant Core 2026.11+), with the configured Home Assistant temperature unit as a compatibility fallback for older climate states; sensor readings use `unit_of_measurement`. Recognized Celsius, Fahrenheit and Kelvin values are normalized into the configured Home Assistant unit before averaging, and unknown or missing sensor units are ignored rather than guessed. The displayed chip includes the actual unit (`°C`, `°F` or `K`). A change to Home Assistant's configured temperature unit invalidates the dashboard's render signature, so the chip is refreshed even when no displayed entity state changes. Humidity is read from climate entities' `current_humidity` and humidity-class sensors; empty, non-numeric, null and unavailable readings are ignored, and humidity values outside 0–100% are omitted. The humidity chip uses the bundled Phosphor drop glyph and an explicit Polish accessible label. When an entry sensor is open, an alert-class binary sensor is active, a lock is unlocked or jammed, an alarm is triggered/pending, a gas valve is open or closing, a binary battery sensor reports low battery, a percentage `sensor.*` with `device_class: battery` reaches the configured low-battery threshold (20% by default), or a connectivity sensor reports a lost connection, the summary adds an amber attention chip with the affected friendly names in its accessible label. Numeric battery readings are accepted only when their unit is `%` (or an equivalent percentage label) and the value is between 0 and 100; unknown, unavailable, malformed and non-percentage readings are ignored. Set `low_battery_threshold` to 10, 15, 20, 25, 30, 40 or 50 in the visual editor or card YAML (default: 20). The same threshold controls room-attention alerts and home-highlight ranking; binary battery sensors continue to follow their Home Assistant `on` / `off` state. This is a convenience threshold, not per-device calibration or a substitute for the integration's own battery alert. Normal secured states and unavailable sensors do not create alerts. This is a read-only indicator, not a replacement for an alarm system or a guarantee that the home is safe. The summary, metric chips, filters and quick actions are exposed as named accessibility groups. These summaries do not poll Home Assistant separately.

## Buttons and input buttons

Both `button.*` and `input_button.*` keep their existing direct tile action: a normal tile activation calls the matching `button.press` or `input_button.press` service. The explicit **Więcej** action opens a VELTO detail dialog with the last-press time when Home Assistant reports a valid ISO timestamp and one deliberate **Naciśnij przycisk** action.

Opening the dialog never invokes the service. The press action sends only the selected `entity_id`, uses the shared per-entity in-flight lock and leaves the dialog open so its result can be announced. Invalid or unavailable timestamps are not interpreted as dates. Button entities can trigger arbitrary integration actions or automations; the detail panel does not infer their effect or add parameters. Use the native Home Assistant dialog for integration-specific configuration.

## Lights

The VELTO light dialog always provides the existing 1–100% brightness control and an explicit on/off action. The inline tile brightness slider also uses the shared per-entity service lock: while `light.turn_on` is pending, the slider is disabled and marked `aria-busy`, the tile exposes the same busy state, and a slider recreated by a dashboard update inherits the lock. When the service completes or fails, connected controls leave the busy state; a slider remains disabled if Home Assistant now reports the light as off. Additional controls are capability-driven:

- **Color temperature** appears only when supported_color_modes contains color_temp and Home Assistant supplies a valid range. Current Kelvin bounds use min_color_temp_kelvin / max_color_temp_kelvin; older integrations may use min_mireds / max_mireds, which VELTO converts for display without inventing limits.
- **Color picker** appears only for the reported hs, rgb, rgbw, rgbww or xy modes. VELTO sends hs_color, rgb_color or xy_color according to the entity's active/supported mode.
- White-only, brightness-only and entities without a reported color-mode list keep the simpler brightness panel; unsupported color services are not guessed.

Color and temperature changes use light.turn_on through the same per-entity in-flight service lock as brightness and the main light toggle. The dialog retains the **Więcej w Home Assistant** action for integration-specific features not represented here.

## Media players

The media-player detail dialog keeps the existing artwork, track metadata, play/pause, previous/next and volume controls, and adds optional controls only when Home Assistant reports the matching `supported_features` bit and current attributes:

| Feature bit | Detail control | Home Assistant service |
| ---: | --- | --- |
| 2 | Seek slider when duration and position are valid | `media_player.media_seek` with `seek_position` in seconds |
| 4 | Volume slider | `media_player.volume_set` |
| 8 | Mute / unmute when `is_volume_muted` is boolean | `media_player.volume_mute` |
| 16 | Previous track | `media_player.media_previous_track` |
| 32 | Next track | `media_player.media_next_track` |
| 2048 | Source selector from `source_list` | `media_player.select_source` |
| 4096 | Stop playback | `media_player.media_stop` |
| 16384 | Play / resume | `media_player.media_play` |
| 32768 | Shuffle toggle when `shuffle` is boolean | `media_player.shuffle_set` |
| 65536 | Sound-mode selector from `sound_mode_list` | `media_player.select_sound_mode` |
| 262144 | Repeat selector for reported `off`, `one` or `all` | `media_player.repeat_set` |

Source and sound-mode options are trimmed, deduplicated and capped at 40 entries; the currently selected option is retained when it falls beyond the cap. A feature mask that is absent, malformed or explicitly zero does not enable these additional controls. Missing current shuffle, mute or repeat state also omits the corresponding toggle rather than guessing a value. Shuffle and mute buttons update their accessible pressed state and action label only after the Home Assistant service succeeds, while keeping the dialog open for further controls. Every write goes through the shared per-entity in-flight service lock, and service payloads are limited to the selected source/mode/state plus the selected entity ID.

The seek slider appears only when the entity advertises `SEEK` (bit `2`) and reports a finite positive `media_duration` plus a non-negative `media_position`. It sends `media_player.media_seek` with a whole-second `seek_position`, clamped to the reported duration. The time label and accessible slider value update while dragging. The initial position is the latest value reported by Home Assistant; VELTO does not run a separate playback-position timer, so refresh cadence remains controlled by the integration. See the [Home Assistant seek action](https://www.home-assistant.io/actions/media_player.media_seek/) for the service contract.

The dialog keeps **Więcej w Home Assistant** for browsing media, grouping players and other integration-specific functions not represented in VELTO. See the [Home Assistant media player entity reference](https://www.home-assistant.io/integrations/media_player/) for supported features and actions.

## Climate

The dialog can expose:

- Current temperature and the active HVAC action.
- A target-temperature slider when Home Assistant reports a numeric target temperature.
- HVAC mode buttons from `hvac_modes`.
- Target humidity when `target_humidity` is numeric and the entity supports target humidity (feature bit `4`, when feature flags are present).
- Fan-mode selection from `fan_modes` (feature bit `8`).
- Preset selection from `preset_modes` (feature bit `16`).
- Vertical swing selection from `swing_modes` (feature bit `32`).
- Horizontal swing selection from `swing_horizontal_modes` (feature bit `512`).

The corresponding Home Assistant services receive only the selected entity ID and the relevant field: `set_temperature`, `set_humidity`, `set_fan_mode`, `set_preset_mode`, `set_swing_mode`, or `set_swing_horizontal_mode`.

## Covers

The existing open, stop, close and position controls remain capability-aware. Tilt controls are shown only when the entity advertises the relevant Home Assistant cover feature:

| Feature bit | Detail control | Service |
| ---: | --- | --- |
| 16 | Open tilt | `open_cover_tilt` |
| 32 | Close tilt | `close_cover_tilt` |
| 64 | Stop tilt | `stop_cover_tilt` |
| 128 | Tilt-position slider | `set_cover_tilt_position` |

The tilt slider uses `current_tilt_position` for its initial value and sends `tilt_position` on change.

## Fans

Fan controls follow Home Assistant's `supported_features` bitmask when it is present:

| Feature bit | Detail control | Service |
| ---: | --- | --- |
| 1 | Percentage slider (`percentage`, optional `percentage_step`) | `fan.set_percentage` |
| 2 | Oscillation toggle (`oscillating`) | `fan.oscillate` |
| 4 | Direction selector (`forward` / `reverse`) | `fan.set_direction` |
| 8 | Preset selector (`preset_modes`) | `fan.set_preset_mode` |

The dialog also exposes `fan.turn_on` and `fan.turn_off`. When feature flags are absent, VELTO falls back only to the corresponding attributes exposed by the entity. An explicit zero feature mask is authoritative and hides unsupported controls.

## Humidifiers and dehumidifiers

The humidifier dialog shows current humidity and the reported activity (`humidifying`, `drying`, `idle` or `off`) when those attributes are available. A target-humidity slider is shown only when Home Assistant provides a numeric `target_humidity`; the slider is bounded by `min_humidity` and `max_humidity` (falling back to 0–100 only when a bound is absent) and sends `humidifier.set_humidity` with the selected numeric `humidity` value.

Mode selection uses `available_modes` and the `HumidifierEntityFeature.MODES` bit (`supported_features` bit 1). An explicit zero or malformed feature mask hides the selector; when the mask is absent, a non-empty `available_modes` list is the conservative fallback. The selected mode is sent with `humidifier.set_mode`. Standard `turn_on` and `turn_off` actions remain available according to the entity's current `on` / `off` state.

VELTO does not invent humidity targets or mode names, and it omits controls when the corresponding state/capability data is missing. See the [Home Assistant humidifier documentation](https://www.home-assistant.io/integrations/humidifier/) for the entity attributes and actions.

## Water heaters

The water-heater dialog reads the current temperature from `current_temperature` (or the newer `native_current_temperature` attribute) and the target from `temperature`, `target_temperature` or `native_target_temperature`. It displays a target-temperature slider only when the target is numeric, Home Assistant advertises `TARGET_TEMPERATURE` (feature bit `1`, or the feature mask is absent), and both `min_temp` and `max_temp` define a valid range. The slider uses `target_temp_step` when available and sends `water_heater.set_temperature` with the numeric `temperature` field.

Operation-mode selection uses the entity's `operation_list` and `WaterHeaterEntityFeature.OPERATION_MODE` (feature bit `2`), sending `water_heater.set_operation_mode` with `operation_mode`. Away mode is exposed only when `AWAY_MODE` (bit `4`) is advertised or a legacy `away_mode` / `is_away_mode_on` attribute is present; it sends `water_heater.set_away_mode` with a boolean `away_mode`. `ON_OFF` (bit `8`) enables `water_heater.turn_on` and `water_heater.turn_off`; without a feature mask, the fallback is limited to entities whose state is explicitly `on` or `off`.

An explicit zero or malformed `supported_features` mask disables write controls. A target value may still be shown read-only when its feature is not advertised. For entities that advertise `ON_OFF` without `OPERATION_MODE`, VELTO keeps both idempotent power actions available: the reported operation state alone may not reliably describe power for this capability combination. When the temperature unit is known, the dialog also shows a non-blocking warning if the target is below 60°C (including Fahrenheit/Kelvin conversion); it updates while the slider moves and never blocks a command. VELTO does not invent operation modes, temperature limits or temperature units, enforce a temperature floor, or create automatic heating schedules. Follow the device manufacturer's guidance and Home Assistant's [water-heater safety guidance](https://www.home-assistant.io/integrations/water_heater/), which warns about Legionella risk in the 25–45°C range and recommends maintaining at least 60°C.

## Vacuums

The vacuum dialog follows the current Home Assistant `VacuumEntityFeature` bitmask. When `supported_features` is present, it is authoritative (including an explicit zero); state-based fallbacks are used only when the attribute is absent. The current feature bits used by VELTO are:

| Feature bit | Detail control | Home Assistant service |
| ---: | --- | --- |
| 4 | Pause while cleaning | `vacuum.pause` |
| 8 | Stop while cleaning, paused or returning | `vacuum.stop` |
| 16 | Return to dock while idle, cleaning, paused or in error | `vacuum.return_to_base` |
| 32 | Fan-speed selector from `fan_speed_list` | `vacuum.set_fan_speed` with `fan_speed` |
| 512 | Locate the robot | `vacuum.locate` |
| 1024 | Spot cleaning when not cleaning/returning | `vacuum.clean_spot` |
| 8192 | Start/resume while idle, docked or paused | `vacuum.start` |

The dialog also shows a bounded battery percentage when the legacy `battery_level` attribute is available, and translates the standard activity states (cleaning, docked, idle, paused, returning and error). Fan-speed options are deduplicated and capped at 12 entries for compact touch layouts. A locate action keeps the dialog open; state-changing actions close it after a successful service call.

VELTO deliberately does not expose raw `vacuum.send_command` input or generic area-cleaning IDs. Area cleaning depends on the segment-to-Home-Assistant-area mapping configured by the integration; use Home Assistant's native vacuum dialog/action for that workflow. See the [Home Assistant vacuum documentation](https://www.home-assistant.io/integrations/vacuum/) for the current entity states, features and actions.

## Locks

The lock dialog exposes `lock.lock` and `lock.unlock` only for stable `locked` / `unlocked` states. Transitional and jammed states keep both actions disabled. If Home Assistant supplies a non-empty `code_format`, direct unlocking is disabled and VELTO directs the user to the native Home Assistant dialog to enter the code. VELTO never asks for, stores or forwards a lock code.

## Selects and numeric helpers

The `select.*` and `input_select.*` detail panels show a selector only when Home Assistant supplies a non-empty `options` array. VELTO trims and deduplicates string options, ignores malformed entries, and caps the list at 40 while preserving the currently selected option. A changed selection calls the matching `select.select_option` or `input_select.select_option` service with the selected `option` value.

The `number.*` and `input_number.*` panels show a range control only when the current state and the reported `min`, `max` and `step` values are finite and form a valid positive range. The slider is bounded to those Home Assistant values, aligns its initial value to the reported step, and sends `number.set_value` or `input_number.set_value` with a numeric `value`. The unit of measurement is shown when available. The slider applies the selected value on release; if Home Assistant rejects the command, VELTO restores the last value. Selectors apply immediately after a valid option is chosen and restore the previous selection if the service fails.

Missing, malformed or empty metadata never creates a guessed write control: VELTO shows the current value and leaves the native **Więcej w Home Assistant** path available. All four helper domains use the shared per-entity in-flight lock, so rapid changes cannot dispatch duplicate commands. Changes to numeric bounds, steps or select options invalidate the displayed-attribute signature and refresh the dashboard view.

## Date and time helpers

The `input_datetime.*` panel uses Home Assistant's `has_date` and `has_time` attributes to show a native date picker, time picker, or both. It parses the helper's local state directly, validates real calendar dates and 24-hour times, and does not convert through the browser timezone. Both fields are saved together in one `input_datetime.set_datetime` call using `datetime: YYYY-MM-DD HH:MM:SS`; date-only helpers use `date` and time-only helpers use `time`. The explicit save button stays disabled until a value changes. Invalid/missing capability metadata, malformed states and helpers explicitly marked `editable: false` never create a write control. If Home Assistant rejects a save, VELTO restores the last confirmed date/time. The helper uses the same per-entity service lock as other detail controls and retains the native Home Assistant fallback.

## Switches

The `switch.*` detail panel is available from the explicit **Więcej** action. It shows the reported `on` / `off` state and exposes explicit `switch.turn_on` or `switch.turn_off` actions. The state label and `aria-pressed` value change only after the service call succeeds; rejected calls leave the last confirmed display intact. The control shares the per-entity in-flight lock with tile and quick actions. Normal tile activation intentionally retains the existing `switch.toggle` behavior.

See the [Home Assistant Switch documentation](https://www.home-assistant.io/integrations/switch/) for entity behavior and supported actions.

## Automations

The `automation.*` detail panel shows whether the automation is enabled, its current run count and execution mode when reported, plus the last-triggered timestamp. Enable/disable actions use `automation.turn_on` and `automation.turn_off`; the normal tile action remains the existing `automation.toggle`.

Manual execution is deliberately a two-step action and is offered only while the automation is enabled. It calls `automation.trigger` with `skip_condition: false`, so Home Assistant evaluates the automation's conditions instead of silently bypassing them. VELTO does not trigger a disabled automation from this panel. Manual execution does not carry normal trigger context such as `trigger.id` or `trigger.to_state`; automations that depend on trigger variables may therefore behave differently or fail to run their actions. Use the native Home Assistant automation editor/traces for debugging and for automations that require trigger-specific context.

See the [Home Assistant Trigger automation documentation](https://www.home-assistant.io/actions/automation.trigger/) for the condition and trigger-context behavior.

## Input booleans

The `input_boolean.*` detail panel shows the current `on` / `off` state and provides one accessible toggle action. It sends the explicit `input_boolean.turn_on` or `input_boolean.turn_off` service selected from the panel's pressed state rather than sending a second ambiguous `toggle` command. The visible state, button label and `aria-pressed` value change only after the Home Assistant service call succeeds; a rejected call leaves the previous state visible. The control uses the shared per-entity in-flight lock to suppress rapid duplicate taps. Normal tile activation intentionally keeps the existing direct `input_boolean.toggle` behavior, and **Więcej w Home Assistant** remains available for native helper information.

## Text helpers

The `input_text.*` detail panel is available when the entity is assigned to a room manually (or explicitly included through a custom `auto_domains` list). Text helpers are deliberately excluded from default automatic Area discovery because they can contain private messages, access codes or password values. The tile and editor preview never display the stored text; password-mode values are masked in the dialog status, tile accessible name and editor preview as well.

VELTO uses the helper's reported `min`, `max`, `pattern`, `mode` and `editable` metadata. Missing `min` / `max` use Home Assistant's documented defaults (0 and 100); malformed bounds, unsupported modes, invalid patterns and explicitly read-only helpers do not expose a write field. The input is single-line, enforces the reported length and optional pattern, and requires an explicit **Zapisz wartość** action. Password mode uses a masked password input, disables browser autofill with `new-password`, and omits the character counter. A successful save calls `input_text.set_value` with `value`; a rejected service call restores the last confirmed value. The shared per-entity service lock prevents duplicate writes.

Password masking is a presentation safeguard, not a secret-storage boundary: Home Assistant state and any client authorized to read it may still access the underlying value. VELTO does not copy helper state into configuration backups or local storage. See the [Home Assistant Input text documentation](https://www.home-assistant.io/integrations/input_text/) for helper setup, modes and defaults.

## Counter helpers

The `counter.*` helper is included in automatic Area discovery and opens a VELTO detail panel instead of the native more-info dialog. The panel shows the current whole-number value, configured step and any reported minimum/maximum. **Zmniejsz** and **Zwiększ** call Home Assistant's `counter.decrement` and `counter.increment` actions, so Home Assistant applies the helper's configured step and enforces its own limits. The corresponding button is disabled at a reported boundary.

VELTO exposes write controls only when Home Assistant explicitly reports `editable: true`; YAML-defined/read-only counters remain read-only. **Przywróć wartość początkową** appears only when the initial value is valid and within the reported bounds. Home Assistant defaults an omitted `initial` to `0` and an omitted `step` to `1`. Malformed state, step or bounds suppress write controls. Every action uses the shared per-entity service lock and keeps the dialog open; the displayed value changes when Home Assistant reports the updated state.

See the [Home Assistant Counter documentation](https://www.home-assistant.io/integrations/counter/) and its increment, decrement and reset actions.

## Timer helpers

The `timer.*` detail panel supports Home Assistant's documented `idle`, `active` and `paused` states. An idle timer can be started only when its configured `duration` is a valid positive value. Starting uses `timer.start` without overriding the helper's configured duration; resuming a paused timer uses the same action without a duration, so Home Assistant continues with the saved remaining time. Active timers expose `timer.pause` and `timer.cancel`; paused timers expose resume and cancel.

For an active timer, VELTO calculates a live countdown from the offset-aware `finishes_at` timestamp. A one-second display tick exists only while this detail dialog is open and the document is visible; it pauses in background tabs and is cleared when the dialog closes. If `finishes_at` is absent or invalid, VELTO shows only the last reported `remaining` value and does not present it as a live countdown. Paused timers use the reported `remaining` value; idle timers show the configured starting duration. Malformed durations and unknown/unavailable states do not expose start/resume controls.

VELTO intentionally does **not** expose `timer.finish`: Home Assistant fires the `timer.finished` event when that action ends a timer early, which can trigger automations before the countdown naturally expires. **Anuluj** calls `timer.cancel`, which cancels without firing the finished event. All timer actions use the shared per-entity service lock and send only the selected entity ID.

See the [Home Assistant Timer documentation](https://www.home-assistant.io/integrations/timer/) and the [timer.start action reference](https://www.home-assistant.io/actions/timer.start/).

## Updates

The explicit **Więcej** action opens a read-only VELTO panel for Home Assistant update entities. It shows the state, installed and latest versions, a short release summary, automatic-update/restart hints and installation progress only when in_progress is explicitly true and update_percentage is a finite number from 0 to 100. Firmware entities receive a distinct label. Unknown and unavailable states retain the native Home Assistant more-info path.

The panel uses text-only rendering for integration-provided titles and release summaries, truncates the summary to the documented short excerpt length, and does not turn release_url into a clickable link. Its sole action opens the native Home Assistant update dialog. VELTO never calls update.install, update.skip or update.clear_skipped, never asks for a version or backup choice, and never claims an update completed. Home Assistant remains responsible for feature checks, backup prompts, installation, skipped versions and release notes. See the [Home Assistant Update documentation](https://www.home-assistant.io/integrations/update/) for entity states, attributes and actions.

## Tile state, labels and motion

The dashboard uses the advertised Home Assistant state and `device_class` to choose the device glyph and its restrained animation. Common light, fan, lock, door/window, water and motion glyphs use bundled Phosphor regular SVGs; unsupported domains retain the legacy VELTO glyph as a compatibility fallback.

- Fans rotate only while on; vacuum tiles move while cleaning or returning to the dock.
- Cover movement is animated only in `opening` / `closing`; a stationary open cover does not keep moving.
- Media-player motion is limited to `playing`; lights retain the amber active glow.
- Binary-sensor motion is selective: motion/occupancy pulse while active, an open door gets a subtle hinge movement, and active moisture/water or smoke/gas/carbon-monoxide sensors receive distinct alert emphasis. Generic binary sensors remain static.
- An `alarm_control_panel` tile highlights and pulses only in `triggered`. Normal tile activation opens Home Assistant's native controls; an explicit **Więcej** action opens a VELTO read-only detail panel. VELTO never adds arm/disarm or code-entry actions.
- The alarm detail shows the translated state, whether arming requires a code and the advertised code format. It never creates a code field or sends alarm services. Its only action closes the VELTO dialog and opens native Home Assistant controls, leaving PIN prompts, custom modes and confirmations to the integration.
- Vacuum and standard alarm states use concise Polish tile labels, including `Sprząta`, `Wraca do stacji`, `Uzbrajanie`, `Uzbrojony`, `Rozbrajanie` and `Alarm aktywny`.

The off-screen animation optimization is deliberately fail-open: if a browser exposes a partial or broken `IntersectionObserver` (including constructor, `observe()`, `unobserve()` or `disconnect()` failures), VELTO disconnects what it can, clears visibility bookkeeping and restores the normal animated presentation. A failed observer is not retried on every render. This avoids a broken optimization interrupting dashboard rendering or silently removing device motion. Every motion rule is disabled when the browser or operating system requests `prefers-reduced-motion: reduce`. The editor preview uses the same Phosphor tile-icon resolver as the live dashboard, so the preview does not show a different glyph from the saved tile.

## Numeric entity history

Finite numeric `sensor.*`, `number.*`, `input_number.*` and `counter.*` tiles open the VELTO history chart after a 600 ms press or with the **F2** keyboard shortcut. Sensor tiles identify the view as measurement history; numeric helpers use a value-history heading. A normal tile activation keeps its existing action or detail-panel behavior. The chart uses Home Assistant Recorder and offers rolling 24-hour, 7-day and 30-day ranges. Unavailable, unknown, malformed and non-numeric states, plus entities outside the supported domains, keep their existing behavior. If the Home Assistant connection changes while a history request is pending, VELTO discards the stale response and asks the user to close and retry rather than displaying data from the previous connection.

## Binary-sensor event history

Available `binary_sensor.*` tiles in the `on` or `off` state open a VELTO event-history dialog after a 600 ms press or with **F2**. A normal tap is unchanged and opens Home Assistant's native more-info dialog. The dialog uses the Home Assistant Recorder `history/period` API for the selected entity and offers rolling 24-hour, 7-day and 30-day ranges. It shows up to the 20 most recent state transitions, translating `on` / `off` through the entity's current `device_class` (for example, door history shows **Otwarte** / **Zamknięte**). Each row also reports how long that state lasted; the newest row is explicitly marked as the currently ongoing state. Durations are calculated from Recorder transition timestamps and displayed in Polish days, hours and minutes. Repeated identical states are collapsed, and malformed timestamps or unsupported states are ignored. The timeline is read-only and never sends a service call. Unknown or unavailable binary sensors keep native more-info behavior; empty history, missing Recorder permissions and request failures are reported without inventing events. Responses from a replaced Home Assistant connection are discarded, and the dialog traps keyboard focus, closes on Escape and restores focus to its invoking tile.

## Reliability and accessibility

All detail-dialog buttons, selects and sliders participate in the same per-entity in-flight service lock used by tile and quick controls. A pending command temporarily disables the other detail controls for that entity, preventing rapid duplicate service calls. Service payloads are merged with the selected `entity_id` last, so a caller cannot redirect an action to another entity.

Controls use native buttons, selects and range inputs, visible focus indicators and touch-sized targets. Unsupported options are omitted rather than rendered as controls that can only fail. No external runtime dependency or Home Assistant credential is added.

## Dialog accessibility

VELTO detail dialogs expose their visible heading as the dialog's accessible name (`aria-labelledby`) and associate the live current-state message as its description (`aria-describedby`). Focus moves to the close control when a dialog opens, Tab and Shift+Tab stay within the dialog, Escape closes it, and closing restores focus to the invoking control when it is still connected. The heading and status references are stable within the single active dialog in the card's shadow root.
