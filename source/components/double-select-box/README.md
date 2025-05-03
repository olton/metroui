# Double Select Box Component

The Double Select Box component provides a user interface for moving items between two select boxes. It's useful for scenarios where users need to select items from a list and move them to another list, such as assigning permissions, selecting features, or organizing items into categories.

## Usage

### Basic Usage

```html
<div class="double-select-box">
    <select>
        <option value="1">Item 1</option>
        <option value="2">Item 2</option>
        <option value="3">Item 3</option>
        <option value="4">Item 4</option>
    </select>
    <select>
        <!-- Initially empty or with pre-selected items -->
    </select>
</div>
```

### With Icons and Templates

```html
<div class="double-select-box">
    <select>
        <option value="1" data-icon="🍎">Apple</option>
        <option value="2" data-icon="🍌">Banana</option>
        <option value="3" data-icon="🍒">Cherry</option>
        <option value="4" data-template="<b>$1</b>">Bold Text</option>
    </select>
    <select>
        <!-- Initially empty or with pre-selected items -->
    </select>
</div>
```

## Component Parameters

The Double Select Box component can be configured with the following parameters:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `height` | string | "auto" | Height of the select boxes |
| `multiSelect` | boolean | false | Allows selecting multiple items at once |
| `moveRightIcon` | string | "&rsaquo;" | Icon for the move right button |
| `moveRightAllIcon` | string | "&raquo;" | Icon for the move all right button |
| `moveLeftIcon` | string | "&lsaquo;" | Icon for the move left button |
| `moveLeftAllIcon` | string | "&laquo;" | Icon for the move all left button |
| `clsBox` | string | "" | Additional CSS class for the component container |
| `clsMoveButton` | string | "" | Additional CSS class for all move buttons |
| `clsMoveRightButton` | string | "" | Additional CSS class for the move right button |
| `clsMoveRightAllButton` | string | "" | Additional CSS class for the move all right button |
| `clsMoveLeftButton` | string | "" | Additional CSS class for the move left button |
| `clsMoveLeftAllButton` | string | "" | Additional CSS class for the move all left button |
| `clsListLeft` | string | "" | Additional CSS class for the left list |
| `clsListRight` | string | "" | Additional CSS class for the right list |

### Example of Setting Parameters

```javascript
// Global setup
Metro.doubleSelectBoxSetup({
    multiSelect: true,
    moveRightIcon: "→",
    moveLeftIcon: "←"
});

// Component instance setup
const doubleSelectBox = Metro.getPlugin("#myDoubleSelectBox", "double-select-box");
```

## API Methods

The Double Select Box component provides the following API methods:

| Method | Description |
| ------ | ----------- |
| `destroy()` | Removes the component from the DOM |

## Events

The Double Select Box component triggers the following events:

| Event | Description |
| ----- | ----------- |
| `onDoubleSelectBoxCreate` | Triggered when the component is created |

## Styling with CSS Variables

The Double Select Box component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--double-select-border-radius` | 4px | 4px | Border radius of the select boxes |
| `--double-select-border-color` | var(--border-color) | var(--border-color) | Border color of the select boxes |
| `--double-select-item-background-active` | #e6e6e6 | #2c2d30 | Background color of active items |
| `--double-select-item-color-active` | #191919 | #efefef | Text color of active items |
| `--double-select-item-background-hover` | #e6e6e6 | #2c2d30 | Background color of items on hover |
| `--double-select-item-color-hover` | #191919 | #efefef | Text color of items on hover |

### Example of Custom Styling

```css
/* Custom styling for double select box */
.custom-double-select {
    --double-select-border-radius: 8px;
    --double-select-border-color: #2196F3;
    --double-select-item-background-active: #e3f2fd;
    --double-select-item-color-active: #0d47a1;
}
```

## Additional Information

- Items can be moved between lists by:
  - Double-clicking on an item
  - Selecting an item and clicking the move buttons
  - Using the "move all" buttons to transfer all items at once
- The component automatically creates the necessary UI elements (buttons, lists) based on the provided select elements
- Items can include icons or custom HTML templates using data attributes
- The component adapts to both light and dark themes