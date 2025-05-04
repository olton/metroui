# Scrollbar Component

The Scrollbar component provides custom styling for browser scrollbars, allowing you to create more visually appealing and consistent scrollbars across different elements in your application.

## Usage

### Basic Usage

```html
<!-- Apply scrollbar styling to an element -->
<div class="scrollbar-type-1">
    <!-- Content with custom scrollbar -->
    <div style="height: 200px; overflow: auto;">
        <!-- Long content that will scroll -->
    </div>
</div>
```

### Scrollbar Types

```html
<!-- Type 1: Basic scrollbar (6px width/height) -->
<div class="scrollbar-type-1">...</div>

<!-- Type 2: Rounded scrollbar (6px width/height with border-radius) -->
<div class="scrollbar-type-2">...</div>

<!-- Type 3: Larger scrollbar (10px width/height) -->
<div class="scrollbar-type-3">...</div>

<!-- Type 4: Larger rounded scrollbar (12px width/height with border-radius) -->
<div class="scrollbar-type-4">...</div>
```

### Colored Scrollbars

```html
<!-- Red scrollbar -->
<div class="scrollbar-type-1 sb-red">...</div>

<!-- Green scrollbar -->
<div class="scrollbar-type-2 sb-green">...</div>

<!-- Blue scrollbar -->
<div class="scrollbar-type-3 sb-blue">...</div>

<!-- Yellow scrollbar -->
<div class="scrollbar-type-4 sb-yellow">...</div>
```

### Scroll Container

```html
<!-- Prevent overscroll effects (bouncing/rubber-banding) -->
<div class="scroll-container">
    <!-- Scrollable content -->
</div>
```

## Styling with CSS Variables

The Scrollbar component uses LESS variables for styling, which can be customized by overriding these variables in your own LESS files:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| @scrollbarBackgroundColor | rgb(232, 232, 232) | Background color of the scrollbar track |
| @scrollbarThumbColor | rgba(101, 95, 95, 0.71) | Color of the scrollbar thumb (the draggable part) |

### Example of Custom Styling

```less
// Custom scrollbar colors
@scrollbarBackgroundColor: #f0f0f0;
@scrollbarThumbColor: rgba(0, 120, 215, 0.7);
```

## Available CSS Classes

### Base Classes
- `.scrollbar-type-1` - Basic scrollbar with 6px width/height
- `.scrollbar-type-2` - Rounded scrollbar with 6px width/height
- `.scrollbar-type-3` - Larger scrollbar with 10px width/height
- `.scrollbar-type-4` - Larger rounded scrollbar with 12px width/height

### Color Modifiers
- `.sb-{color}` - Changes the scrollbar thumb color to the specified color (e.g., `.sb-red`, `.sb-blue`, `.sb-green`)

### Utility Classes
- `.scroll-container` - Prevents overscroll effects (bouncing/rubber-banding) with `overscroll-behavior: contain`

## Browser Compatibility

The Scrollbar component uses both WebKit-specific pseudo-elements (`::-webkit-scrollbar`, `::-webkit-scrollbar-track`, `::-webkit-scrollbar-thumb`) for Chrome, Safari, and Edge, as well as standard CSS properties (`scrollbar-width`, `scrollbar-color`) for Firefox.

Note that Internet Explorer does not support custom scrollbar styling.

## Best Practices

1. Use consistent scrollbar styling throughout your application for a cohesive user experience
2. Choose scrollbar colors that provide sufficient contrast against the background
3. Consider using smaller scrollbars (Type 1 or Type 2) for content areas where space is limited
4. Use the `.scroll-container` class on mobile-friendly interfaces to prevent unwanted overscroll effects
5. Be aware that custom scrollbar styling may not be visible on some touch devices where scrollbars are hidden by default