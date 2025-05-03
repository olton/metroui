# Overlay Component

The Overlay component provides styling for creating overlays, backdrops, and splash screens that cover the entire viewport. It's commonly used with dialogs, modals, and loading screens to focus user attention and prevent interaction with underlying content.

## Usage

### Basic Overlay

```html
<!-- Basic overlay -->
<div class="overlay"></div>

<!-- Transparent overlay -->
<div class="overlay transparent"></div>

<!-- Global overlay (higher z-index) -->
<div class="overlay global-overlay"></div>

<!-- Splash screen -->
<div class="splashscreen">
    <div class="spinner large"></div>
    <h2>Loading...</h2>
</div>
```

### Creating Overlays Programmatically

Overlays can be created programmatically using JavaScript:

```javascript
// Create a basic overlay
const overlay = $("<div>").addClass("overlay").appendTo("body");

// Create a splash screen
const splash = $("<div>").addClass("splashscreen").appendTo("body");
splash.append($("<div>").addClass("spinner large"));
splash.append($("<h2>").text("Loading..."));

// Remove overlay when done
setTimeout(() => {
    overlay.remove();
    splash.remove();
}, 3000);
```

### Using with Dialogs

Overlays are often used with dialogs to create modal experiences:

```html
<!-- Overlay for a modal dialog -->
<div class="overlay"></div>
<div class="dialog">
    <div class="dialog-title">Modal Dialog</div>
    <div class="dialog-content">
        This dialog appears above the overlay.
    </div>
    <div class="dialog-actions">
        <button class="button js-dialog-close">Close</button>
    </div>
</div>
```

## Styling with CSS Variables

The Overlay component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--overlay-color` | rgba(255,255,255, .5) | rgba(0,0,0, .5) | Background color of the overlay |
| `--splash-color` | rgba(255,255,255, 1) | rgba(0,0,0, 1) | Background color of the splash screen |

### Example of Custom Styling

```css
/* Custom styling for overlays */
.custom-overlay {
    --overlay-color: rgba(0, 123, 255, 0.3);
}

/* Custom styling for splash screens */
.custom-splash {
    --splash-color: rgba(33, 37, 41, 0.95);
}
```

## Available CSS Classes

### Base Classes
- `.overlay` - Base class for overlays
- `.splashscreen` - Full-screen splash screen

### Modifier Classes
- `.transparent` - Makes the overlay completely transparent
- `.global-overlay` - Overlay with higher z-index for global use
- `.global-dialog` - Dialog that appears above global overlays

## Z-Index Hierarchy

The Overlay component uses a specific z-index hierarchy to ensure proper stacking:

1. Standard overlays (z-index: 1040)
2. Global overlays (z-index: 2000)
3. Global dialogs (z-index: 2001)
4. Splash screens (z-index: 2050)

This hierarchy ensures that elements appear in the correct order when multiple overlays or dialogs are present.

## Accessibility

When using overlays, consider the following accessibility best practices:

1. Ensure that modal dialogs trap focus within them when an overlay is active
2. Provide a way to dismiss overlays using both mouse and keyboard
3. Consider adding `aria-hidden="true"` to content behind the overlay
4. For splash screens, consider adding a screen reader announcement about loading status

## Best Practices

1. Use overlays sparingly to avoid disrupting user flow
2. Provide clear visual indication of what's happening when an overlay is shown
3. Always include a way to dismiss the overlay (close button, escape key, etc.)
4. For loading overlays, consider adding a progress indicator or estimated time
5. Use transparent overlays when you want to maintain visual context while preventing interaction