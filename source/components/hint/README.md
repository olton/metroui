# Hint Component

The Hint component provides a simple and customizable tooltip-like functionality that displays additional information when users hover over an element. Hints can be positioned in different directions and styled to match your application's design.

## Usage

### Basic Hint

```html
<!-- Element with a hint -->
<button class="button" data-role="hint" data-hint-text="This is a hint">Hover me</button>
```

### Hint Position

```html
<!-- Hint positioned at the top (default) -->
<button data-role="hint" data-hint-position="top" data-hint-text="Top hint">Top</button>

<!-- Hint positioned at the bottom -->
<button data-role="hint" data-hint-position="bottom" data-hint-text="Bottom hint">Bottom</button>

<!-- Hint positioned at the right -->
<button data-role="hint" data-hint-position="right" data-hint-text="Right hint">Right</button>

<!-- Hint positioned at the left -->
<button data-role="hint" data-hint-position="left" data-hint-text="Left hint">Left</button>
```

### Custom Hint Styling

```html
<!-- Hint with custom class -->
<button data-role="hint" data-cls-hint="bg-red fg-white" data-hint-text="Custom styled hint">Custom Style</button>
```

## Plugin Parameters

The Hint component accepts the following configuration options:

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| hintDeferred | 0 | Delay in milliseconds before showing the hint |
| hintHide | 5000 | Time in milliseconds before automatically hiding the hint (0 to disable auto-hide) |
| clsHint | "" | Additional CSS class(es) to apply to the hint element |
| hintText | "" | Text content of the hint |
| hintPosition | Metro.position.TOP | Position of the hint relative to the target element (TOP, BOTTOM, RIGHT, LEFT) |
| hintOffset | 4 | Offset in pixels from the target element |
| onHintShow | Metro.noop | Callback function triggered when the hint is shown |
| onHintHide | Metro.noop | Callback function triggered when the hint is hidden |
| onHintCreate | Metro.noop | Callback function triggered when the hint is created |

## API Methods

The Hint component provides the following API methods:

| Method | Description |
| ------ | ----------- |
| createHint() | Creates and shows the hint |
| setPosition() | Sets the position of the hint based on the target element |
| removeHint() | Removes the hint from the DOM |
| changeText() | Updates the hint text from the data-hint-text attribute |
| changeAttribute(attributeName) | Handles attribute changes (currently supports data-hint-text) |
| destroy() | Removes the hint and cleans up event listeners |

## Global Configuration

You can set global default options for all hint components:

```javascript
Metro.hintSetup({
    hintDeferred: 500,
    hintHide: 3000,
    hintPosition: Metro.position.BOTTOM
});
```

## Styling with CSS Variables

The Hint component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --hint-z-index | @zindex-tooltip | @zindex-tooltip | Z-index of the hint element |
| --hint-border-radius | 6px | 6px | Border radius of the hint |
| --hint-background | #FFFCC0 | #26282e | Background color of the hint |
| --hint-color | #1d1d1d | #ffffff | Text color of the hint |

### Example of Custom Styling

```css
/* Custom styling for hints */
:root {
    --hint-background: #e3f2fd;
    --hint-color: #0d47a1;
    --hint-border-radius: 8px;
}

/* Custom styling for a specific hint */
.custom-hint {
    --hint-background: #ffebee;
    --hint-color: #c62828;
}
```

## Available CSS Classes

### Base Class
- `.hint` - The main hint container

## Accessibility

The Hint component provides additional information that may not be immediately visible to users. For better accessibility:

1. Use concise and meaningful hint text
2. Consider using the `hintDeferred` option to prevent hints from appearing too quickly
3. For critical information, consider using more accessible alternatives like visible labels or help text

## Best Practices

1. Keep hint text brief and to the point
2. Use hints for supplementary information, not for critical content
3. Position hints appropriately to avoid covering important UI elements
4. Consider using a short delay (hintDeferred) to prevent hints from appearing when users briefly hover over elements
5. Test hint visibility against different backgrounds to ensure readability