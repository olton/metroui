# Linked Block Component

The Linked Block component provides draggable/resizable blocks with link points on each side that can be connected with visual connectors (lines/curves/zigzags). It is useful for building simple node/link editors, flow diagrams, or block schematics directly in the browser.

## Dependencies

This component relies on the following Metro UI modules (imported via its index.js):
- draggable
- resizable
- linked-connector

:::note
The connection drawing functionality is provided by the Connector component. 
You can configure it globally via `window.metroConnectorSetup` object, or pass it as an option to the `connect()` method.
:::

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
    canDrag: true,
    canResize: true
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
    canResize: true
});
block2.addPoint("north");

// Connect existing points (first available by default)
block.connect(block2.element, { type: "zigzag" });
```

### Programmatic Initialization on Existing Element

```javascript
Metro.makePlugin("#myBlock", "linked-block", {
    canResize: true,
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
| `width` | string\|number\|null | null | Initial width (CSS value). |
| `height` | string\|number\|null | null | Initial height (CSS value). |
| `minWidth` | number | 0 | Minimum block width when resizing. |
| `minHeight` | number | 0 | Minimum block height when resizing. |
| `maxWidth` | number\|null | null | Maximum block width when resizing. |
| `maxHeight` | number\|null | null | Maximum block height when resizing. |
| `content` | string | "" | HTML content for the block body. If the element already has innerHTML, it will be used instead. |
| `showAddButtons` | boolean | true | Shows "+" hover buttons on block sides to add points and start connections. |
| `addButtons` | string | "north east south west" | Sides where add buttons appear (space-separated): any of `north`, `east`, `south`, `west`. |
| `resizeHotkey` | string\|null | null | Hotkey to toggle resize availability on the active block (e.g., `"alt+t"`). |
| `dragHotkey` | string\|null | null | Hotkey to toggle drag availability on the active block (e.g., `"alt+d"`). |
| `connectionType` | "line"\|"curve"\|"zigzag" | "curve" | Default connector type when connecting interactively. |
| `connectionStyle` | "solid"\|"dashed"\|"dotted" | "solid" | Default line style for interactive connections. |
| `onePoint` | boolean | false | If true, points are centered (useful for single-point blocks). |
| `canDrag` | boolean | true | Enables dragging for the block. |
| `canResize` | boolean | true | Enables resizing for the block. |
| `onAddPoint` | function | Metro.noop | `(pointEl, side, pointId, blockEl)` — called when a point is added. |
| `onRemovePoint` | function | Metro.noop | `(pointEl, side, pointId, blockEl)` — called when a point is removed. |
| `onStartConnection` | function | Metro.noop | `(buttonEl, side)` — called when interactive connecting starts. |
| `onCancelConnection` | function | Metro.noop | `()` — called if an interactive connect is canceled. |
| `onConnect` | function | Metro.noop | See Events section for signatures (interactive vs direct API). |
| `onDisconnect` | function | Metro.noop | `(connectionId)` — called when a connection is removed. |
| `onDragStart` | function | Metro.noop | `({top, left}, element)` — when dragging starts. |
| `onDragMove` | function | Metro.noop | `({top, left}, element)` — while dragging. |
| `onDragEnd` | function | Metro.noop | `({top, left}, element)` — when dragging stops. |
| `onResize` | function | Metro.noop | `({width, height}, element)` — when block is resized. |
| `onLinkedBlockCreate` | function | Metro.noop | `(element)` — when the component is created. |

Data attribute usage (dashed format) examples:
- `data-role="linked-block"`
- `data-can-resize="true"`
- `data-can-drag="true"`
- `data-show-add-buttons="false"`
- `data-add-buttons="north east"`
- `data-connection-type="curve"`
- `data-connection-style="dashed"`
- `data-one-point="true"`
- `data-resize-hotkey="alt+t"`
- `data-drag-hotkey="alt+d"`
- `data-on-add-point="onAddPointHandler"`

## Events

You can handle events using options (callbacks) or `data-on-*` attributes.

| Event | Description |
| ----- | ----------- |
| `onLinkedBlockCreate` | Fired when the linked block is created. Signature: `(element)`. |
| `onAddPoint` | Fired after a new link point has been added. Signature: `(pointEl, side, pointId, blockEl)`. |
| `onRemovePoint` | Fired after a link point has been removed. Signature: `(pointEl, side, pointId, blockEl)`. |
| `onStartConnection` | Fired when interactive connection starts. Signature: `(buttonEl, side)`. |
| `onCancelConnection` | Fired when an interactive connection is canceled. Signature: `()`. |
| `onConnect` | Fired when a connection is created. Interactive: `(connectionId, sourceBlockEl, targetBlockEl, sourcePointEl, targetPointEl, connectorInst)`. Direct `connect()` API: `(targetEl, sourcePointEl, targetPointEl, connectorEl)`. |
| `onDisconnect` | Fired when an existing connection is removed. Signature: `(connectionId)`. |
| `onDragStart` | When dragging starts. Signature: `({top, left}, element)`. |
| `onDragMove` | While dragging, with updated position. Signature: `({top, left}, element)`. |
| `onDragEnd` | When dragging stops. Signature: `({top, left}, element)`. |
| `onResize` | When block is resized (if `canResize: true`). Signature: `({width, height}, element)`. |

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

## Linked Block Connector

The Linked Connector component renders SVG connectors (lines, curves, zigzags) between two link points. It is used internally by Linked Block, but can also be used independently to connect any two DOM points/elements and keep the connection updated while blocks move.

### Dependencies

None.

:::note
You can configure global defaults via a global `window.metroConnectorSetup` object.
:::

### Usage

#### Programmatic (recommended)

```javascript
// Suppose you have two link-point elements (e.g., created by Linked Block)
const pA = document.querySelector('#block-1 .link-point');
const pB = document.querySelector('#block-2 .link-point');

// Create a connector between them
const conn = Metro.connector.create(pA, pB, {
    type: 'curve',            // 'line' | 'curve' | 'zigzag'
    lineStyle: 'solid',       // 'solid' | 'dashed' | 'dotted'
    deleteButton: true,       // show delete icon when a connector is selected
    arrow: false              // draw an arrowhead at the end
});

// Access instance methods
conn.setType('zigzag');
conn.setLineStyle('dashed');
conn.update(); // manually update if needed
```

#### As a plugin on an element

```html
<div id="myConnector"></div>
<script>
  const pA = document.querySelector('#block-1 .link-point');
  const pB = document.querySelector('#block-2 .link-point');

  Metro.makePlugin('#myConnector', 'connector', {
      pointA: pA,
      pointB: pB,
      type: 'line',
      lineStyle: 'dotted'
  });

  const inst = Metro.getPlugin('#myConnector', 'connector');
</script>
```

#### Global Setup (optional)

```html
<script>
  window.metroConnectorSetup = {
      deleteButton: true,
      lineStyle: 'solid'
  };
</script>
```

### Plugin Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `pointA` | Element\|Dom\|null | null | First endpoint element (e.g., a `.link-point`). |
| `pointB` | Element\|Dom\|null | null | Second endpoint element. |
| `type` | 'line'\|'curve'\|'zigzag' | 'curve' | Connector shape type. |
| `container` | Element\|Dom\|Selector\|null | null | SVG container parent. If not set, the connector will use the parent of the plugin element. |
| `autoUpdate` | boolean | true | Automatically update the connector on block moves/resizes. |
| `id` | string\|null | auto | Connection id. Generated if not provided (`connector-<uid>`). |
| `deleteButton` | boolean | false | Show delete icon near the selected path. |
| `arrow` | boolean | false | Add an arrowhead marker to the end of the connector. |
| `lineStyle` | 'solid'\|'dashed'\|'dotted' | 'solid' | Stroke style of the connector. |
| `onConnectorCreate` | function | Metro.noop | Called on create. Receives detail object (see Events). |
| `onConnectorUpdate` | function | Metro.noop | Called on update. Receives detail object (see Events). |
| `onConnectorDestroy` | function | Metro.noop | Called on destroy. Receives detail object (see Events). |

Data-attribute mapping (for live changes):
- `data-type` — handled by `changeAttribute()`; updates connector type.
- `data-line-style` — handled by `changeAttribute()`; updates line style.

### Events

Events can be handled either via options (`onConnectorCreate`, etc.) or by listening to Metro’s internal event system. The component fires:

| Event | Detail |
| ----- | ------ |
| `connector-create` | `{ element, options }` — fired after structure and connection are created. |
| `connector-update` | `{ connection, type }` — fired whenever the connector is re-rendered/updated. |
| `connector-destroy` | `{ id }` — fired when the connector is destroyed. |

Selection and delete:
- Clicking on a connector path (`.cl-line`, `.cl-curve`) toggles `selected-path` class.
- If `deleteButton: true`, a `.connector-delete` icon appears for the selected connection; clicking it removes that connection.

### API Methods

- `setType(type)` — Change connector type: `'line'|'curve'|'zigzag'`.
- `setPoints(pointA, pointB)` — Change endpoints and re-bind auto-updates.
- `setLineStyle(style)` — Set line style: `'solid'|'dashed'|'dotted'`.
- `update()` — Force re-calc and redraw of the connector.
- `changeAttribute(attr, newValue)` — Reacts to `data-type` and `data-line-style`.
- `destroy()` — Remove the connector, delete button, observers; may remove temporary points.

Static helper:
- `Metro.connector.create(pointA, pointB, options)` — Programmatically create a connector instance on a dummy element appended to `options.container` (default `body`). Returns the plugin instance.

### Styling with CSS Variables

The connector uses the same variables as Linked Block for line appearance:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--linked-block-line-width` | `1px` | `1px` | Stroke width for connector shapes. |
| `--linked-block-line-color` | `#b1b1b1` | `#656a70` | Stroke color for connector shapes and delete icon. |

You can also style via the `.cl-line` / `.cl-curve` classes (stroke, stroke-width) and `.selected-path` state.

### Available CSS Classes

- `.connection-area` — Shared SVG container created inside the provided container.
- `.cl-line` — SVG `<line>` for `'line'` type connectors.
- `.cl-curve` — SVG `<path>` for `'curve'` and `'zigzag'` connectors.
- `.selected-path` — Applied when a connector is selected (click); can be styled for focus.
- `.connector-delete` — Delete button group appended to the SVG; visible when the path is selected and `deleteButton` is true.

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
