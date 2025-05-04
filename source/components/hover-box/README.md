# Hover Box Component

The Hover Box component creates an interactive hover effect that follows the mouse cursor within an element. It adds a subtle radial gradient effect that moves with the cursor, enhancing the visual feedback for interactive elements.

## Usage

```html
<div data-role="hover-box">
    <!-- Your content here -->
</div>
```

## Configuration Options

The Hover Box component can be configured with the following options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| onHoverBoxCreate | function | Metro.noop | Callback function triggered when the hover box is created |

## API Methods

The Hover Box component provides the following API methods:

### destroy()

Removes the hover box component and its associated elements.

```javascript
Metro.getPlugin('#myHoverBox', 'hoverbox').destroy();
```

## Styling with CSS Variables

The Hover Box component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --hover-box-effect-color | hsla(0,0%,80%,56%) | hsla(234,78%,62%,26%) | Color of the hover effect gradient |

### Example of Custom Styling

```css
/* Custom styling for a specific hover box */
#myCustomHoverBox {
    --hover-box-effect-color: hsla(180, 100%, 50%, 0.5);
}
```

## Additional Information

The Hover Box component:
- Only shows the hover effect on devices that support hover
- Creates a radial gradient that follows the mouse cursor
- Automatically calculates the size of the effect based on the element's height
- Works best with elements that have a defined height and width