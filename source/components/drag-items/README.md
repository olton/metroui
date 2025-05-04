# Drag Items Component

The Drag Items component allows you to create draggable and reorderable items within a container. It provides a flexible way to implement drag-and-drop functionality for lists and other UI elements.

## Usage

```html
<ul data-role="drag-items">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `dragItemsDeferred` | number | 0 | Delay in milliseconds before initialization |
| `target` | string/object | null | Target element for dropping items |
| `dragItem` | string | "li" | Selector for draggable items |
| `dragMarker` | string | ".drag-item-marker" | Selector for drag marker |
| `drawDragMarker` | boolean | false | Whether to draw drag markers |
| `clsDragItemAvatar` | string | "" | Additional CSS class for drag avatar |
| `clsDragItem` | string | "" | Additional CSS class for drag item |
| `canDrag` | boolean | true | Whether dragging is enabled |

## API Methods

### on()
Enables dragging functionality.

```javascript
var dragItems = $(element).data('drag-items');
dragItems.on();
```

### off()
Disables dragging functionality.

```javascript
var dragItems = $(element).data('drag-items');
dragItems.off();
```

### toggle()
Toggles dragging functionality on/off.

```javascript
var dragItems = $(element).data('drag-items');
dragItems.toggle();
```

### destroy()
Removes event handlers and cleans up the component.

```javascript
var dragItems = $(element).data('drag-items');
dragItems.destroy();
```

## Events

| Event | Description |
| --- | --- |
| `onDragStartItem` | Triggered when dragging starts |
| `onDragMoveItem` | Triggered when dragging moves |
| `onDragDropItem` | Triggered when item is dropped |
| `onTarget` | Triggered when over a target |
| `onDragItemsCreate` | Triggered when component is created |

### Event Usage Example

```javascript
$(".drag-items-container").on("drag-start-item", function(e, data){
    console.log("Started dragging:", data.dragItem);
});
```

## CSS Customization

The Drag Items component can be styled using the following CSS classes:

| Class | Description |
| --- | --- |
| `.drag-items-target` | Applied to the container element |
| `.dragged-item` | Applied to the item being dragged |
| `.drag-item-marker` | Styling for the drag marker |
| `.drag-marker-dark` | Dark theme variant for the drag marker |
| `.dragged-item-avatar` | Styling for the avatar element that follows the cursor during dragging |

### CSS Variables

The component uses the following CSS variables (defined in the Metro UI CSS framework):

| Variable | Description |
| --- | --- |
| `@transparent` | Used for background color |
| `@white` | Used for marker color |
| `@dark` | Used for dark theme marker |
| `@blue` | Used for avatar background |
| `@zindex-absolute` | Used for z-index |
| `@primaryColor` | Used for box-shadow |

### Custom Styling Example

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

## Global Configuration

You can set global defaults for all Drag Items components:

```javascript
Metro.dragItemsSetup({
    dragItem: "div",
    drawDragMarker: true,
    clsDragItemAvatar: "custom-avatar"
});
```