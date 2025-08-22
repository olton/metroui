# Linked Block Component

The Linked Block component provides draggable/resizable blocks with link points on each side that can be connected with visual connectors (lines/curves/zigzags). It is useful for building simple node/link editors, flow diagrams, or block schematics directly in the browser.

## Dependencies

This component relies on the following Metro UI modules (imported via its index.js):
- draggable
- resizable-container (resizer UI used when resizing is enabled)
- linked-connector (Connector engine used to draw/update connections)

Note: The connection drawing functionality is provided by the Connector component (Metro.connector). You can configure it globally via `Metro.connectorSetup` or `window.metroConnectorSetup`.

## Usage

### Basic Usage (HTML)

```html
<!-- A simple linked block with default settings -->
<div data-role="linked-block" style="top: 100px; left: 100px; position: absolute;">
    My Block
</div>
```

- The component will ensure an id on the element (if missing), add required inner structure, and wrap your content into `.linked-block-content`.
- Each block contains four sides: `.north-side`, `.east-side`, `.south-side`, `.west-side`.
- When `showAddButtons` is enabled (default), small “+” buttons appear on hover to add a new link point on a side and start a connection.

### Programmatic Creation

```javascript
// Create a block programmatically
const block = Metro.linkedBlock.create({
    container: "#container",  // where to place the block (defaults to body)
    id: "block-1",
    top: 100,
    left: 100,
    content: "Block 1",
    draggable: true,
    resizable: true
});

// Add a link point to a specific side
block.addPoint("north"); // sides: north | east | south | west

// Create another block and connect them
const block2 = Metro.linkedBlock.create({
    container: "#container",
    id: "block-2",
    top: 100,
    left: 300,
    content: "Block 2",
    resizable: true
});
block2.addPoint("north");

// Connect existing points (first available by default)
block.connect(block2.element, { type: "zigzag" });
```

### Programmatic Initialization on Existing Element

```javascript
Metro.makePlugin("#myBlock", "linked-block", {
    resizable: true,
    showAddButtons: true
});

const inst = Metro.getPlugin("#myBlock", "linked-block");
```

### Global Setup (Optional)

```html
<script>
    // Linked Block global setup
    window.metroLinkedBlockSetup = {
        resizeHotkey: "alt+t"
    };

    // Connector global setup (from linked-connector)
    window.metroConnectorSetup = {
        deleteButton: true, // show delete button when a connector path is selected
        // type: 'zigzag'   // default connector type: line | curve | zigzag
    };
</script>
```

## Plugin Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `draggable` | boolean | true | Enables dragging for the block (uses Metro draggable). |
| `resizable` | boolean | false | Enables resizing for the block (uses Metro resizable). |
| `width` | string\|number\|null | null | Initial width (CSS value). |
| `height` | string\|number\|null | null | Initial height (CSS value). |
| `minWidth` | number | 100 | Minimum block width when resizing. |
| `minHeight` | number | 100 | Minimum block height when resizing. |
| `maxWidth` | number\|null | null | Maximum block width when resizing. |
| `maxHeight` | number\|null | null | Maximum block height when resizing. |
| `content` | string | "" | HTML content for the block body. If the element already has innerHTML, it will be used instead. |
| `showAddButtons` | boolean | true | Shows "+" hover buttons on block sides to add points and start connections. |
| `resizeHotkey` | string\|null | null | Hotkey to toggle the resizer availability on the currently active block (e.g., `"alt+t"`). |
| `onAddPoint` | function | Metro.noop | Callback when a point is added: `(pointEl, side, pointId, blockEl)`. |
| `onRemovePoint` | function | Metro.noop | Callback when a point is removed: `(pointEl, side, pointId, blockEl)`. |
| `onConnect` | function | Metro.noop | Callback when a connection is created. In interactive connect: `(sourceBlock, targetBlock, sourcePoint, targetPoint, connectorInstance)`. In direct `connect()` API: `(targetEl, sourcePoint, targetPoint, connectorEl)`. |
| `onDisconnect` | function | Metro.noop | Callback when a connection is removed: `(blockEl, connectionId)`. |
| `onDragStart` | function | Metro.noop | Called on drag start: `({top, left}, blockEl)`. |
| `onDragMove` | function | Metro.noop | Called during dragging: `({top, left}, blockEl)`. |
| `onDragEnd` | function | Metro.noop | Called after dragging: `({top, left}, blockEl)`. |
| `onResize` | function | Metro.noop | Called on resize when `resizable` is enabled: `({width, height}, blockEl)`. |
| `onLinkedBlockCreate` | function | Metro.noop | Called when the component is created: `({element})`. |

Data attribute usage follows dashed format, for example:
- `data-role="linked-block"`
- `data-resizable="true"`
- `data-show-add-buttons="false"`
- `data-resize-hotkey="alt+t"`
- `data-on-add-point="onAddPointHandler"`

## Events

You can handle events using options (callbacks) or `data-on-*` attributes.

| Event | Description |
| ----- | ----------- |
| `onLinkedBlockCreate` | Fired when the linked block is created. |
| `onAddPoint` | Fired after a new link point has been added. |
| `onRemovePoint` | Fired after a link point has been removed. |
| `onConnect` | Fired when a connection between two points is created. |
| `onDisconnect` | Fired when an existing connection is removed. |
| `onDragStart` | When dragging starts. |
| `onDragMove` | While dragging, with updated position. |
| `onDragEnd` | When dragging stops. |
| `onResize` | When block is resized (if `resizable: true`). |

Example (with data attributes):

```html
<div
  id="myBlock"
  data-role="linked-block"
  data-resizable="true"
  data-resize-hotkey="alt+t"
  data-on-add-point="onAddPoint"
  data-on-connect="onConnect">
</div>

<script>
function onAddPoint(point, side, id, block) {
    console.log("Point added:", side, id);
}
function onConnect(targetOrSource, a, b, connector) {
    console.log("Connected:", connector);
}
</script>
```

## API Methods

- `addPoint(side)` — Adds a new link point to the specified side (`"north"|"east"|"south"|"west"`). Returns the created point element (Dom). 
- `removePoint(pointId)` — Removes a specific point by id. Also disconnects any connectors attached to that point. Returns boolean.
- `getPoints(side?)` — Returns a collection of points for a side or for all sides.
- `connect(targetBlock, options = {})` — Connects the current block to another. Options:
  - `type`: `"line"|"curve"|"zigzag"` (default `"curve"`)
  - `container`: SVG container parent (defaults to the parent of the block)
  - `sourcePoint` / `targetPoint`: specific point elements to connect (optional)
  Returns `{ id, connector, sourcePoint, targetPoint }` or `null`.
- `disconnect(connectionId)` — Removes a specific connection by id. Returns boolean.
- `disconnectPoint(pointId)` — Removes all connections related to a given point id. Returns number of removed connections.
- `disconnectAll()` — Removes all connections of the block. Returns number of removed connections.
- `setContent(html)` — Sets block content.
- `getContent()` — Gets current block content HTML.
- `getConnections()` — Returns an array of connection objects registered on the block.
- `destroy()` — Destroys the component, removes event handlers and all connections.

Static helper:
- `Metro.linkedBlock.create(options)` — Programmatically create and initialize a block. Options include: `id`, `container`, `content`, `top`, `left`, `draggable`, `resizable`, etc. Returns the plugin instance.

Example of method usage:

```javascript
const b1 = Metro.linkedBlock.create({ container: "#container", content: "A", top: 120, left: 100 });
const b2 = Metro.linkedBlock.create({ container: "#container", content: "B", top: 120, left: 320 });

b1.addPoint("north");
b2.addPoint("north");

const c = b1.connect(b2.element, { type: "zigzag" });
console.log(c.id);
```

## Styling with CSS Variables

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--linked-block-point-size` | `7px` | `7px` | Diameter of link point circles. |
| `--linked-block-point-color` | `#b1b1b1` | `#656a70` | Point fill color. |
| `--linked-block-line-width` | `1px` | `1px` | Stroke width for connector paths. |
| `--linked-block-min-size` | `100px` | `100px` | Default block min size (used for initial width/height). |
| `--linked-block-border-radius` | `4px` | `4px` | Border radius for blocks. |
| `--linked-block-background` | `var(--default-background)` | `var(--default-background)` | Block background. |
| `--linked-block-color` | `#191919` | `#ffffff` | Text color. |
| `--linked-block-border-color` | `#b1b1b1` | `#656a70` | Block border color. |
| `--linked-block-line-color` | `#b1b1b1` | `#656a70` | Default connector path color. |
| `--linked-block-border-color-active` | `#007bff` | `#007bff` | Border color when a block is active/selected. |

### Example of Custom Styling

```css
#container {
    --linked-block-point-color: #ff0000;
    --linked-block-line-width: 2px;
}
```

## Available CSS Classes

### Base Classes
- `.linked-block` — Root element of the component; positioned absolutely.
- `.linked-block-content` — Inner content container (fills the block with `inset: 4px`).
- `.north-side`, `.east-side`, `.south-side`, `.west-side` — Side containers that hold `.link-point` circles.
- `.link-point` — Point element used as connection endpoints.

### Modifiers and Helpers
- `.add-point-btn` — Small "+" button (shown on hover) to add a point and start a connection.
  - `.add-point-north` | `.add-point-east` | `.add-point-south` | `.add-point-west` — Button positions for each side.
  - `.connecting` — Visual state while a connection is in progress.
- `.active-block` — Applied to a block when clicked; highlights its border.
- `[data-can-resize=true]` — When true, shows resizer handles (together with `resizable: true`).

Connector-related (from linked-connector):
- `.connection-area` — Shared SVG container styling.
- `.cl-line`, `.cl-curve` — Path/line classes (hover/selection styles applied).
- `.connector-delete` — Delete button icon for a selected path (visible when configured and selected).

## Additional Notes

- Interactive connections: Hover a block to reveal "+" buttons; click a side button to start connecting, then click a side button on another block to complete the connection. Temporary connector follows the cursor during the operation.
- Active block & resize hotkey: Clicking a block toggles `.active-block`. If `resizeHotkey` is set, pressing it toggles `[data-can-resize]` on the active block to show/hide resizers.
- Connector types: Supported types are `line`, `curve`, and `zigzag`. Default is `curve`.
- The `connect()` API returns an object with the created connector and points, plus a generated `id` for later `disconnect()` calls.

## Best Practices

- Ensure all blocks are placed within a common positioned container to keep connector SVGs aligned.
- Add only the needed number of points per side to keep diagrams readable.
- Use CSS variables on a wrapping container to theme multiple blocks consistently.
- Avoid modifying the internal structure (sides/points) manually after initialization—use the API methods.
- When enabling `resizable`, consider `minWidth`, `minHeight`, `maxWidth`, and `maxHeight` to guide user resizing.
