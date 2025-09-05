# Drag Items

The Drag Items component allows you to create draggable and reorderable items within a container. It provides a flexible way to implement drag-and-drop functionality for lists and other UI elements.

## Dependencies

No additional dependencies required.

## Usage

### Basic Usage

```html
<ul data-role="drag-items">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

### Additional Configurations

```html
<!-- With drag markers -->
<ul data-role="drag-items" data-draw-drag-marker="true">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

<!-- Disabled dragging initially -->
<ul data-role="drag-items" data-can-drag="false">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

<!-- Custom drag item selector -->
<div data-role="drag-items" data-drag-item=".item">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
</div>
```

## Plugin Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `dragItemsDeferred` | number | 0 | Delay in milliseconds before initialization |
| `target` | string/object | null | Target element for dropping items |
| `dragItem` | string | "li" | Selector for draggable items |
| `dragMarker` | string | ".drag-item-marker" | Selector for drag marker |
| `drawDragMarker` | boolean | false | Whether to draw drag markers |
| `clsDragItemAvatar` | string | "" | Additional CSS class for drag avatar |
| `clsDragItem` | string | "" | Additional CSS class for drag item |
| `canDrag` | boolean | true | Whether dragging is enabled |

## API Methods

+ on() - Enables dragging functionality.

#### Example of Method Usage
```javascript
const dragItems = Metro.getPlugin('#myList', 'drag-items');
dragItems.on();
```

+ off() - Disables dragging functionality.

#### Example of Method Usage
```javascript
const dragItems = Metro.getPlugin('#myList', 'drag-items');
dragItems.off();
```

+ toggle() - Toggles dragging functionality on/off.

#### Example of Method Usage
```javascript
const dragItems = Metro.getPlugin('#myList', 'drag-items');
dragItems.toggle();
```

+ destroy() - Removes event handlers and cleans up the component.

#### Example of Method Usage
```javascript
const dragItems = Metro.getPlugin('#myList', 'drag-items');
dragItems.destroy();
```

## Events

| Event | Description |
| ----- | ----------- |
| `onDragStartItem` | Triggered when dragging starts |
| `onDragMoveItem` | Triggered when dragging moves |
| `onDragDropItem` | Triggered when item is dropped |
| `onTarget` | Triggered when over a target |
| `onTargetIn` | Triggered when entering a target (planned but not implemented) |
| `onTargetOut` | Triggered when leaving a target (planned but not implemented) |
| `onDragItemsCreate` | Triggered when component is created |

### Example of Event Usage

```javascript
$("#myList").on("drag-start-item", function(e, data){
    console.log("Started dragging:", data.dragItem);
});

// Or using the options
<ul data-role="drag-items" data-on-drag-drop-item="myDropFunction">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

<script>
function myDropFunction(e, data) {
    console.log("Item dropped:", data.dragItem);
}
</script>
```

## Styling with CSS Variables

The component uses the following CSS variables from the Metro UI framework:

| Variable            | Default (Light) | Dark Mode | Description |
|---------------------| --------------- | --------- | ----------- |
| `@transparent`      | transparent | transparent | Used for background color |
| `@white`            | #ffffff | #ffffff | Used for marker color |
| `@dark`             | #1d1d1d | #1d1d1d | Used for dark theme marker |
| `@blue`             | #4390df | #4390df | Used for avatar background |
| `@z-index-absolute` | 2000 | 2000 | Used for z-index |
| `@primaryColor`     | #5c92fa | #5c92fa | Used for box-shadow |

### Example of Custom Styling

```css
/* Custom styling for drag markers */
.my-list .drag-item-marker {
    border-top-color: red;
}

.my-list .drag-item-marker::before,
.my-list .drag-item-marker::after {
    background-color: red;
}

/* Custom styling for dragged item avatar */
.my-list .dragged-item-avatar {
    background-color: purple;
    opacity: 0.5;
}
```

## Available CSS Classes

### Base Classes
- `.drag-items-target` - Applied to the container element
- `.dragged-item` - Applied to the item being dragged (opacity: 0.3)
- `.drag-item-marker` - Styling for the drag marker (hamburger icon)
- `.dragged-item-avatar` - Styling for the avatar element that follows the cursor during dragging

### Modifiers
- `.drag-marker-dark` - Dark theme variant for the drag marker

## Global Configuration

You can set global defaults for all Drag Items components:

```javascript
Metro.dragItemsSetup({
    dragItem: "div",
    drawDragMarker: true,
    clsDragItemAvatar: "custom-avatar"
});
```