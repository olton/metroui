# Dropdown

A lightweight floating panel that opens relative to a toggle control. The dropdown can open in any direction (up, down, left, right) or decide automatically based on viewport space. It appends a caret icon to the toggle, supports click-outside to close, and provides a small API to open/close programmatically.

## Dependencies

No additional dependencies beyond Metro UI core. The component is included via `source/components/dropdown/index.js` which imports its JS and LESS.

## Usage

### Basic Usage

```html
<button class="dropdown-toggle">Default</button>
<div data-role="dropdown">
    <div>Content appears below the parent</div>
</div>
```

The plugin automatically looks for the toggle element next to the dropdown:
- First, a sibling with class `.menu-toggle`, `.dropdown-toggle`, or an anchor `<a>`;
- If not found, it tries the previous element.
If no toggle is found, an error is thrown ("Menu toggle not found").

A caret SVG icon is appended to the toggle. To hide the caret add the utility class `.no-dropdown-caret` to the toggle. To force a light caret use `.light-toggle`.

### Positions

```html
<!-- Drop up -->
<div class="pos-relative">
    <button class="dropdown-toggle">Drop Up</button>
    <div data-role="dropdown" data-open-mode="up">
        <div>Content appears above the parent</div>
    </div>
</div>

<!-- Drop right -->
<div class="pos-relative d-inline-block">
    <button class="dropdown-toggle">Drop Right</button>
    <div data-role="dropdown" data-open-mode="right">
        <div>Content appears to the right of the parent</div>
    </div>
</div>

<!-- Drop left -->
<div class="pos-relative d-inline-block">
    <button class="dropdown-toggle">Drop Left</button>
    <div data-role="dropdown" data-open-mode="left">
        <div>Content appears to the left of the parent</div>
    </div>
</div>
```

With `data-open-mode="auto"` (default), the component will try to fit the content in the viewport:
- Adds `.drop-up` if there is no space below;
- Adds `.place-right` when content needs to shift right;
- Falls back to `.drop-as-dialog` if the content still overflows the viewport.

### Keep open / No close

```html
<!-- Using a class -->
<button class="dropdown-toggle">Keep Open</button>
<div class="keep-open" data-role="dropdown">
    <div>This dropdown can't be closed</div>
</div>

<!-- Using an option -->
<div class="pos-relative">
    <button class="dropdown-toggle">No Close</button>
    <div data-role="dropdown" data-no-close="true">
        <div>This dropdown can't be closed</div>
    </div>
</div>
```

### Fixed height and scrolling

```html
<button class="dropdown-toggle">Fixed Height</button>
<div data-role="dropdown" data-height="200">
    <p>Scrollable content…</p>
</div>
```

### Deferred initialization

```html
<button class="dropdown-toggle">Deferred</button>
<div data-role="dropdown" data-dropdown-deferred="3000">
    <div>This dropdown is created after 3 seconds</div>
</div>
```

### Custom toggle element

If the toggle is not a sibling/previous element, you can point to it explicitly:

```html
<button id="myToggle">Open</button>
<div data-role="dropdown" data-toggle-element="#myToggle">
    <div>Any content</div>
</div>
```

### Programmatic initialization

```js
// Initialize
const ddEl = Metro.makePlugin("#myDropdown", "dropdown", { openMode: "down" });

// Get instance and control it
const dd = Metro.getPlugin("#myDropdown", "dropdown");

dd.open();         // open with animation
// dd.open(true);  // open immediately (no animation delay)

dd.close();        // close with animation
// dd.close(true); // close immediately

dd.toggle();       // toggle state
```

## Plugin Parameters

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
dropdownDeferred | number | 0 | Delay (ms) before the component is created and becomes ready.
dropFilter | string | null | A CSS selector used to limit which other dropdowns are auto-closed when this one opens. If set, only dropdowns inside elements matching this selector will be auto-closed; others remain untouched.
toggleElement | string | null | CSS selector for the toggle element. By default, the plugin tries to find a sibling `.menu-toggle`, `.dropdown-toggle`, or `<a>`, or the previous element.
noClose | boolean | false | If true, the dropdown cannot be closed by clicking outside or on itself; internally the component adds `.keep-open` and stops click propagation.
openMode | "auto" | "auto" | Opening mode: `auto`, `up`, `down`, `left`, `right`. In `auto` mode the component decides and may add `.drop-up`, `.place-right`, or `.drop-as-dialog`.
openFunc | string | "show" | Name of the show function to call on the dropdown element (e.g., `show`).
closeFunc | string | "hide" | Name of the hide function to call on the dropdown element (e.g., `hide`).
height | string | "auto" | Fixed height for the dropdown. If not "auto", the height is applied and `overflow-y: auto` is set. A number is treated as pixels.
stayOnClick | boolean | false | If true, clicks inside the dropdown content do not close it (clicks are not propagated to the document).

Example with data-attributes:

```html
<div data-role="dropdown"
     data-open-mode="right"
     data-height="240"
     data-no-close="false"
     data-stay-on-click="true"></div>
```

## Events

Event | Description
----- | -----------
`dropdown-create` | Fired when the dropdown is initialized.
`open` | Fired when the dropdown finishes opening.
`close` | Fired when the dropdown finishes closing.
`drop` | Alias/companion event fired on open.
`up` | Companion event fired on close.

Attach handlers via options (preferred form: `onEventName`), or listen in JS.

```html
<div id="dd" data-role="dropdown" data-on-dropdown-create="onCreate" data-on-drop="onDrop" data-on-up="onUp"></div>
<script>
function onCreate() { /* … */ }
function onDrop()   { /* … */ }
function onUp()     { /* … */ }
</script>
```

```js
const dd = Metro.getPlugin("#dd", "dropdown");
// Depending on your app setup, you can also subscribe using DOM events or assign option callbacks.
```

## API Methods

- `open(immediate = false, el?)` – Opens the dropdown. If `immediate` is true, uses immediate show (no animation delay). Optional `el` lets you target a nested dropdown element.
- `close(immediate = false, el?)` – Closes the dropdown. If `immediate` is true, closes without delay. Optional `el` lets you target a nested dropdown element.
- `toggle()` – Toggles the dropdown state.

Global setup:

```js
// Set defaults globally before creating any dropdowns
Metro.dropdownSetup({ openMode: "auto", stayOnClick: false });
```

## Styling with CSS Variables

Variable | Light (Default) | Dark Mode | Description
-------- | ---------------- | --------- | -----------
`--dropdown-caret-color` | `#191919` | `#ffffff` | Color of the caret SVG appended to the toggle.

Example:

```css
/* Make caret blue for a specific toggle */
#myToggle { --dropdown-caret-color: dodgerblue; }
```

## Available CSS Classes

### Base and utilities
- `.dropdown` – Applied to the dropdown container; positioned absolutely; z-index managed by theme.
- `.dropdown-toggle` – Expected on the toggle element; caret is appended to it.
- `.dropdown-caret` – The SVG caret icon appended to the toggle.
- `.light-toggle` – Forces a light (white) caret color for dark toggles.
- `.no-dropdown-caret` – Hides the caret.
- `.active-toggle`, `.active-control`, `.active-container` – Added while the dropdown is open.
- `.keep-open` – Prevents auto-close on outside click.
- `.horizontal` – If applied to a list-based dropdown (e.g., `<ul>`), the width is calculated from child `<li>` widths.

### Position helpers (usually managed by the component)
- `.drop-up`, `.drop-down`, `.drop-left`, `.drop-right` – Place the dropdown relative to the toggle.
- `.place-right` – May be added in auto mode if horizontal space is limited.
- `.drop-as-dialog` – Fallback class added when the dropdown would overflow the viewport.

## Additional Notes

- Clicks on elements with class `.disabled` inside the dropdown are ignored.
- By default, clicking anywhere in the document closes all open dropdowns (unless they have `.keep-open` / `data-no-close="true"` or similar stay-open flags).

## Best Practices

- Place the dropdown right after its toggle when possible; otherwise set `data-toggle-element` to link them.
- Prefer `openMode: "auto"` for responsive behavior.
- Use `stayOnClick` if the dropdown contains interactive controls that should not close it on click.
- Keep content concise; for long content set a fixed `height` for better UX.