# Cube

A 3D-styled cube visualization composed of three visible sides (left, right, top), each divided into a grid of cells. Cells can "flash" (light up) over time according to configurable rules, making the component useful for status dashboards, activity indicators, or decorative effects. Optional axis lines can be shown for orientation.

## Dependencies

- Farbe (color utilities)

## Usage

### Basic Usage

Include the Metro build outputs (make sure you ran `npm run dev` or `npm run build`):

```html
<link rel="stylesheet" href="./lib/metro.css">
<script src="./lib/metro.js"></script>

<div data-role="cube"></div>
```

By default, the cube uses built-in flashing rules and hides axis lines.

### Show Axis and Choose Axis Style

```html
<div data-role="cube" data-show-axis="true" data-axis-style="arrow"></div>
```

Available axis styles: `arrow` (default), `line`, `no-style`.

### Grid Size and Cell Numbers

```html
<div data-role="cube" data-cells="5" data-numbers="true"></div>
```

- `data-cells` controls the N×N grid for each side. Default is 4.
- `data-numbers` renders cell numbers for development or demonstration.

### Custom Colors

```html
<div
  data-role="cube"
  data-color="#222831"
  data-flash-color="#00bcd4"
></div>
```

- `data-color` sets the base cell background color.
- `data-flash-color` sets the flashing (active) color.

### Custom Flashing Rules

Rules define which cells on which side turn on/off at each tick. Provide as JSON via `data-rules` or set programmatically. Each rule step can specify `on` and/or `off` per side (`left`, `right`, `top`) with arrays of 1-based cell ids.

```html
<div
  id="cube1"
  data-role="cube"
  data-rules='[
    { "on":  { "top": [1,2],   "left": [3],     "right": [4] } },
    { "off": { "top": [2],     "left": [3],     "right": [4] },
      "on":  { "top": [5,6] } },
    { "on":  { "left": [7,8],  "right": [9] } }
  ]'
></div>
```

If `data-rules` is omitted, a built-in pattern (`Metro.cubeDefaultRules`) is used.

### Programmatic Initialization

```html
<div id="myCube"></div>
<script>
  // Create the plugin
  const el = Metro.makePlugin("#myCube", "cube", {
    showAxis: true,
    axisStyle: "line",
    cells: 4,
    numbers: false,
  });

  // Access the API
  const cube = Metro.getPlugin("#myCube", "cube");
  cube.toRule(2); // move to rule #2 (0-based index) and hold, then auto-restart if configured
</script>
```

## Plugin Parameters

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
`cubeDeferred` | number | 0 | Optional deferred initialization time (ms) handled by Metro’s core (common across components).
`rules` | object|string|null | `null` | Flashing rules. Object or JSON string. If null, uses `Metro.cubeDefaultRules`.
`color` | string|null | `null` | Base cell background color. If a valid color, sets CSS var `--cube-background`.
`flashColor` | string|null | `null` | Flash color for active cells. If valid, sets CSS var `--cube-background-flash`.
`flashInterval` | number | 1000 | Interval in ms used as a base for ticks and rule step timing.
`numbers` | boolean | false | If true, displays 1-based indices inside cells.
`cells` | number | 4 | Number of cells per side edge (N). Each side contains N×N cells.
`showAxis` | boolean | false | Show/hide axis guides over the cube.
`axisStyle` | string | "arrow" | Axis rendering style: `arrow`, `line`, or `no-style`.
`cellClick` | boolean | false | If true, clicking a cell toggles its light state.
`autoRestart` | number | 5000 | After calling `toRule(index, ...)`, automatically restart the autoplay after this timeout (ms). Use `0` or non-integer to disable.
`clsCube` | string | "" | Extra class(es) for the root cube element.
`clsCell` | string | "" | Extra class(es) added to each cell.
`clsSide` | string | "" | Extra class(es) for every side.
`clsSideLeft` | string | "" | Extra class(es) for the left side.
`clsSideRight` | string | "" | Extra class(es) for the right side.
`clsSideTop` | string | "" | Extra class(es) for the top side.
`clsAxis` | string | "" | Extra class(es) for each axis element.
`clsAxisX` | string | "" | Extra class(es) for X axis.
`clsAxisY` | string | "" | Extra class(es) for Y axis.
`clsAxisZ` | string | "" | Extra class(es) for Z axis.
`onTick` | function | `Metro.noop` | Callback executed on every rule tick. Receives the tick index.
`onCubeCreate` | function | `Metro.noop` | Callback when cube is created (also emitted as `cube-create` event).

Notes:
- The options `clsSideLeftCell`, `clsSideRightCell`, `clsSideTopCell` are present in defaults for potential styling, but are not applied in the current implementation.

#### Example of Parameter Usage

```html
<div
  data-role="cube"
  data-show-axis="true"
  data-axis-style="line"
  data-cells="6"
  data-numbers="true"
  data-color="#0f172a"
  data-flash-color="#22d3ee"
></div>
```

## Events

Event | Description
----- | -----------
`cube-create` | Fired when the cube structure and events are initialized.
`tick` | Fired on each rule step tick; includes `{ index }` in event detail.

#### Example of Event Usage

```html
<div id="cube2" data-role="cube" data-on-cube-create="onCreated" data-on-tick="onTick"></div>
<script>
  function onCreated(e) {
    console.log("cube created", e.detail);
  }
  function onTick(e) {
    console.log("tick", e.detail.index);
  }
</script>
```

## API Methods

- `start()` — Start/restart the flashing sequence from the beginning of the rules.
- `stop()` — Stop any ongoing flashing and clear timers.
- `toRule(index, speed)` — Show the cumulative result up to the rule at `index` (0-based). Optional `speed` overrides the default step timing for this call. If `autoRestart` is a positive integer, the autoplay restarts after that timeout.
- `rule()` — Getter; returns the currently active rules object.
- `rule(rules)` — Setter; accepts object or JSON string rules, applies them, and restarts the sequence.
- `axis(show)` — Show/hide axis programmatically (`true` to show, `false` to hide).
- `changeRules()` — Re-read `data-rules` from the element, apply, and restart.
- `changeAxisVisibility()` — Re-read `data-show-axis` from the element and apply visibility.
- `changeAxisStyle()` — Re-read `data-axis-style` from the element and apply style (`arrow`, `line`, `no-style`).
- `changeAttribute(name)` — Internal helper used by Metro when `data-*` attributes change; routes to the corresponding change method.
- `destroy()` — Remove event handlers and timers. Returns the element.

#### Example of Method Usage

```javascript
const cube = Metro.getPlugin('#cube1', 'cube');

cube.stop();

// Jump to a specific rule step (0-based). Optionally pass a custom speed for tick spacing.
cube.toRule(3, 300);

// Update rules programmatically
cube.rule([
  { on: { left: [1,2,3] } },
  { on: { right: [4,5,6] }, off: { left: [2] } },
]);

// Toggle axis programmatically
cube.axis(true);
```

## Styling with CSS Variables

Variable | Default (Light) | Dark Mode | Description
-------- | ---------------- | --------- | -----------
`--cube-size` | 24px | 24px | Cell size (width/height). Computed at runtime to fill the side but can be overridden.
`--cube-gap` | 4px | 4px | Gap between cells within a side.
`--cube-border-color` | #767676 | #767676 | Cell border color.
`--cube-background` | var(--default-background) | var(--default-background) | Base cell background color.
`--cube-color` | var(--default-color) | var(--default-color) | Cell text color (used with `numbers`).
`--cube-background-flash` | var(--color-primary) | var(--color-primary) | Flashing background color for active cells.
`--cube-color-flash` | #ffffff | #ffffff | Text color when a cell is lit.
`--cube-axis-color` | #191919 | #ffffff | Axis color.
`--cube-side-border-color` | transparent | transparent | Border color for each side container.

### Example of Custom Styling

```css
#myCube {
  --cube-size: 18px;           /* make cells smaller */
  --cube-gap: 2px;             /* tighter grid */
  --cube-background: #111827;  /* slate-900 */
  --cube-background-flash: #22c55e; /* emerald-500 */
  --cube-axis-color: #94a3b8;  /* slate-400 */
}
```

## Available CSS Classes

### Base Classes
- `.cube` — Root element of the component.
- `.side` — A cube face container. Specific side classes are added together with this base class.
- `.left-side`, `.right-side`, `.top-side` — Specific faces of the cube.
- `.cube-cell` — Individual cell inside a side grid.
- `.axis` — Axis guide element.

### Modifiers
- `.light` — Applied to cells that are lit; enables animation and flash colors.
- `.axis-x`, `.axis-y`, `.axis-z` — X/Y/Z axes.
- `.arrow`, `.line`, `.no-style` — Axis styles.

## Additional Notes

- The component auto-generates the required DOM structure (sides, cells, axes). You only need a container element with `data-role="cube"` or initialize via `Metro.makePlugin()`.
- The cube uses built-in rules if none are provided. When you provide custom rules, validate your JSON; malformed JSON is ignored and a warning is logged.
- Cell IDs are 1-based within each side and go from 1 to `cells*cells`.
- When `cellClick` is true, manual toggles do not affect the automated schedule; subsequent ticks may override cell states.

## Best Practices

- Keep `flashInterval` reasonable; very small values can create a large number of timers.
- If you jump to a rule using `toRule`, consider `autoRestart` to resume playback automatically.
- Prefer programmatic rule updates via `cube.rule(newRules)` during dynamic interactions; it validates and restarts safely.
- Override CSS variables on the root cube element or a wrapper for scoped theming.
