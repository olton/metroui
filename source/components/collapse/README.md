# Collapse Component

The Collapse component provides a way to toggle the visibility of content with smooth animations. It's commonly used for accordion-style interfaces, expandable panels, and other UI elements that need to show or hide content.

## Usage

### Basic Collapse

```html
<!-- Basic collapse structure -->
<div class="collapse-toggle">Toggle Content</div>
<div class="collapse">
    <p>This content can be collapsed or expanded.</p>
</div>
```

### Custom Toggle Element

```html
<!-- Using a custom toggle element -->
<button id="customToggle">Toggle Content</button>
<div data-role="collapse" data-toggle-element="#customToggle">
    <p>This content is toggled by a custom element.</p>
</div>
```

### Initially Collapsed

```html
<!-- Initially collapsed content -->
<div class="collapse-toggle">Toggle Content</div>
<div data-role="collapse" data-collapsed="true">
    <p>This content is initially hidden.</p>
</div>
```

## Plugin Options

The Collapse component can be configured with the following options:

| Option | Default | Description |
| ------ | ------- | ----------- |
| `collapseDeferred` | 0 | Delay in milliseconds before the collapse action starts |
| `collapsed` | false | Whether the element should be initially collapsed |
| `toggleElement` | false | Selector for a custom toggle element (if not using the default adjacent toggle) |
| `duration` | 100 | Duration of the collapse/expand animation in milliseconds |
| `onExpand` | Metro.noop | Callback function triggered when the element is expanded |
| `onCollapse` | Metro.noop | Callback function triggered when the element is collapsed |
| `onCollapseCreate` | Metro.noop | Callback function triggered when the collapse component is created |

### Example of Configuration

```javascript
// Global setup
Metro.collapseSetup({
    duration: 300,
    collapsed: true
});

// Individual element setup
$("#myCollapse").data("collapse").options.duration = 500;
```

## API Methods

The Collapse component provides the following API methods:

| Method | Description |
| ------ | ----------- |
| `collapse(immediate)` | Collapses the element. If `immediate` is true, collapses without animation |
| `expand(immediate)` | Expands the element. If `immediate` is true, expands without animation |
| `close(immediate)` | Alias for `collapse()` |
| `open(immediate)` | Alias for `expand()` |
| `isCollapsed()` | Returns true if the element is currently collapsed |
| `toggleState()` | Toggles between collapsed and expanded states |

### Example of API Usage

```javascript
// Get the collapse component instance
const collapseElement = $("#myCollapse");
const collapse = collapseElement.data("collapse");

// Use API methods
collapse.collapse(); // Collapse with animation
collapse.expand(true); // Expand immediately without animation

// Check state
if (collapse.isCollapsed()) {
    console.log("Element is collapsed");
}

// Toggle state
collapse.toggleState();
```

## Styling with CSS Variables

The Collapse component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--collapse-toggle-active-color` | inherit | inherit | Color of the toggle element when active |
| `--collapse-border-color` | #e4e4e4 | #3f3f3f | Border color of the collapse element |
| `--collapse-background` | transparent | transparent | Background color of the collapse element |

### Example of Custom Styling

```css
/* Custom styling for a specific collapse element */
#myCustomCollapse {
    --collapse-border-color: #2196F3;
    --collapse-background: #e3f2fd;
}

/* Custom styling for the toggle element */
#myCustomCollapse + .collapse-toggle {
    --collapse-toggle-active-color: #2196F3;
}
```

## Available CSS Classes

- `.collapse` - The main class for the collapsible content
- `.collapse-toggle` - Class for the toggle element
- `.active-toggle` - Applied to the toggle element when the content is expanded
- `.collapsed` - Applied to the collapse element when it's collapsed

## Accessibility

For better accessibility:
- Use semantic HTML elements for your toggle (like `<button>`)
- Add appropriate ARIA attributes to indicate the expanded/collapsed state
- Ensure keyboard navigation works properly with your toggle elements

## Best Practices

1. Use clear visual indicators for the toggle element to show it's interactive
2. Consider using icons (like arrows or plus/minus) to indicate the current state
3. Keep animations short for better user experience
4. Group related collapse elements in accordion-style interfaces when appropriate
5. Ensure the toggle element is easily clickable on mobile devices