# Resizable Container

A lightweight utility component that adds resize handles around any element and allows the user to resize it by dragging the handles. Works with mouse and touch and supports min/max constraints and fine-grained control over which sides/corners are resizable.

## Usage

### Basic (data-role)

```html
<div data-role="resizable-container"></div>
```

### Restrict sides/corners and set constraints

```html
<div
  data-role="resizable-container"
  data-resize-pointers="n, s, e, w"           <!-- allow edges only -->
  data-min-width="150"
  data-min-height="120"
  data-max-width="600"                         <!-- 0 means no limit -->
  data-max-height="0"
></div>
```

### Toggle resize mode at runtime

You can hide the handles and disable interactions via `data-enable-resize` or API methods:

```html
<div id="box" data-role="resizable-container" data-enable-resize="false"></div>

<script>
  // Later
  const inst = Metro.getPlugin("#box", "resizable-container")
  inst.enable()   // shows handles, enables interactions
  inst.disable()  // hides handles, disables interactions

  // Alternatively via attribute (the component reacts to this change):
  $("#box").attr("data-enable-resize", "true")
</script>
```

### Programmatic initialization

```html
<div id="my-resizable"></div>

<script>
  Metro.makePlugin("#my-resizable", "resizable-container", {
    canResize: true,
    resizePointers: "nw, ne, se, sw",
    minWidth: 150,
    minHeight: 100,
  })
</script>
```

## Plugin Parameters

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
`canResize` | boolean | `true` | Enables or disables the resize interactions (pointer down is ignored when `false`).
`resizePointers` | string | `"nw, n, ne, e, se, s, sw, w"` | Comma-separated list of allowed handles. Valid values: `n, s, e, w, ne, nw, se, sw`.
`minWidth` | number | `0` | Minimum width in pixels.
`minHeight` | number | `0` | Minimum height in pixels.
`maxWidth` | number | `0` | Maximum width in pixels; `0` means no maximum.
`maxHeight` | number | `0` | Maximum height in pixels; `0` means no maximum.
`initWidth` | number | `0` | Initital width in pixels.
`initHeight` | number | `0` | Initial height in pixels.

Example (HTML attributes):

```html
<div
  data-role="resizable-container"
  data-resize-pointers="ne, se, sw, nw"
  data-min-width="200"
  data-min-height="150"
></div>
```

Notes:
- Data attributes use dashed-case names that match option names: e.g. `data-resize-pointers` → `resizePointers`.
- Constraints with value `0` are treated as unlimited.

## Events

Event | Description
----- | -----------
`onResizeStart` | Fired when the user starts resizing.
`onResize` | Fired when the user is resizing.
`onResizeStop` | Fired when the user stops resizing.
`onResizeEnable` | Fired when resize mode enabled.
`onResizeDisable` | Fired when resize mode disabole.


Example usage of the create event via data-attribute:

```html
<div
  data-role="resizable-container"
  data-on-resize="onResize"
></div>

<script>
  function onResize(size, element, point) {
      // this === el
      // size = {top, left, width, height}
      // element = the DOM element being resized
      // point = one of "n", "s", "e", "w", "ne", "nw", "se", "sw"
  }
</script>
```

## API Methods

- `enable()` — Show the handles and enable resize interactions.
- `disable()` — Hide the handles and disable resize interactions.
- `destroy()` — Remove the element from the DOM.

Example:

```javascript
const rc = Metro.getPlugin("#my-resizable", "resizable-container")
rc.disable()
rc.enable()
```

## Styling with CSS Variables

Variable | Value | Description
-------- |-------| -----------
`--resizable-container-border-width` | `1px` | Border width of the dotted outline and handles.
`--resizable-container-point-size` | `8px` | Size (width and height) of each handle.

Variable | Default (Light) | Dark Mode | Description
-------- | ---------------- | --------- | -----------
`--resizable-container-border-color` | `#000` | `#fff` | Color of the dotted border and handles outline.

Example:

```css
#my-resizable {
  --resizable-container-border-color: var(--color-crimson);
  --resizable-container-border-width: 2px;
  --resizable-container-point-size: 10px;
}
```

## Available CSS Classes

- `.resizable-container` — Root class added to the target element.
- `.rc-contour` — Internal overlay that draws the dotted border and contains the handles. When `.disabled` is present on this element, handles are hidden.
- `.rc-point` — Base class for each handle.
  - Modifiers set the position and cursor: `.-n`, `.-s`, `.-e`, `.-w`, `.-ne`, `.-nw`, `.-se`, `.-sw`.

## Additional Notes

- The component ensures the target element has `position: relative` if it was `static` to support top/left updates while resizing.
- Set an initial `width` and `height` on the element (inline style or CSS) so users can see/drag from a sensible starting size.
- When used with `draggable`, consider toggle flows (e.g., enable/disable resize via a hotkey) to avoid accidental drags while resizing.

## Best Practices

- Prefer setting `minWidth`/`minHeight` to avoid collapsing to very small sizes.
- Keep `resizePointers` concise to match your UX: use only the handles your design needs.
- Avoid modifying the internal `.rc-contour` structure directly; prefer CSS variables for styling.
- Always check for updates and compatibility with the latest version of Metro UI.
