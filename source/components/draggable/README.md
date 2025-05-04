# Draggable Component

The Draggable component allows you to make any element draggable within a specified area. It provides a simple way to implement drag-and-drop functionality with customizable options for boundaries, drag handles, and event callbacks.

## Usage

### Basic Usage

```html
<!-- Make an element draggable -->
<div data-role="draggable">
    This element can be dragged
</div>

<!-- Make an element draggable with a specific handle -->
<div data-role="draggable" data-drag-element=".handle">
    <div class="handle">Drag here</div>
    <div>Content of the draggable element</div>
</div>
```

### JavaScript Initialization

```javascript
// Initialize with default options
Metro.makePlugin(element, "draggable");

// Initialize with custom options
Metro.makePlugin(element, "draggable", {
    dragArea: "#container",
    boundaryRestriction: true,
    onDragStart: function(event) {
        console.log("Started dragging", event);
    }
});
```

## Plugin Parameters

The Draggable component accepts the following configuration options:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `dragContext` | Object | `null` | Context object passed to event callbacks |
| `draggableDeferred` | Number | `0` | Delay in milliseconds before initialization |
| `dragElement` | String | `"self"` | Selector for the drag handle element. Use "self" to make the entire element draggable |
| `dragArea` | String | `"parent"` | Selector for the container that limits the draggable area. Can be "parent", "body", or any valid CSS selector |
| `timeout` | Number | `0` | Timeout for initialization |
| `boundaryRestriction` | Boolean | `true` | When true, restricts dragging within the boundaries of the dragArea |
| `onCanDrag` | Function | `Metro.noop_true` | Callback function that determines if dragging is allowed. Should return true to allow dragging |
| `onDragStart` | Function | `Metro.noop` | Callback function triggered when dragging starts |
| `onDragStop` | Function | `Metro.noop` | Callback function triggered when dragging stops |
| `onDragMove` | Function | `Metro.noop` | Callback function triggered during dragging movement |
| `onDraggableCreate` | Function | `Metro.noop` | Callback function triggered when the draggable component is created |

## API Methods

The Draggable component provides the following API methods:

### on()

Enables dragging functionality for the element.

```javascript
var draggable = Metro.getPlugin(element, "draggable");
draggable.on();
```

### off()

Disables dragging functionality for the element.

```javascript
var draggable = Metro.getPlugin(element, "draggable");
draggable.off();
```

### destroy()

Removes the draggable functionality and event listeners from the element.

```javascript
var draggable = Metro.getPlugin(element, "draggable");
draggable.destroy();
```

## Styling with CSS

The Draggable component applies the `.draggable` class to elements while they are being dragged. You can customize the appearance of dragged elements by targeting this class in your CSS.

### Default Styling

```css
.draggable {
    box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px!important;
}
```

### Custom Styling Example

```css
/* Custom styling for dragged elements */
.draggable {
    box-shadow: rgba(0, 0, 255, 0.4) 0 0 20px!important;
    opacity: 0.8;
    transform: rotate(2deg);
}
```

## Event Handling

The Draggable component provides several events that you can use to respond to drag operations:

```javascript
Metro.makePlugin(element, "draggable", {
    onDragStart: function(event) {
        console.log("Drag started at position:", event.position);
    },
    onDragMove: function(event) {
        console.log("Current position:", event.position);
    },
    onDragStop: function(event) {
        console.log("Drag stopped at position:", event.position);
    }
});
```

## Best Practices

1. Use the `dragElement` option to specify a handle when you want only part of an element to be draggable
2. Set `boundaryRestriction` to true to prevent elements from being dragged outside their container
3. Use the `dragArea` option to define a specific area where the element can be dragged
4. Implement the `onCanDrag` callback to conditionally allow or prevent dragging based on your application's state
5. Consider the user experience when implementing draggable elements, ensuring they provide visual feedback during dragging