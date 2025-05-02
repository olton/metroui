# Transform Button Component

The Transform Button component provides a customizable button that can transform its appearance, commonly used for hamburger menus and similar UI elements.

## Usage

```html
<button class="transform-button">
    <span></span>
    Menu
</button>
```

To activate the transformation, add the `.transform` class:

```html
<button class="transform-button transform">
    <span></span>
    Menu
</button>
```

## Transformation Directions

The component supports various transformation directions:

- `.right` - Transform to the right
- `.up` - Transform upward
- `.down` - Transform downward
- `.top-left` - Transform to the top-left
- `.top-right` - Transform to the top-right
- `.bottom-left` - Transform to the bottom-left
- `.bottom-right` - Transform to the bottom-right

Example:

```html
<button class="transform-button transform up">
    <span></span>
    Menu
</button>
```

## Styling with CSS Variables

The Transform Button component can be customized using CSS variables:

| CSS Variable | Default Value | Description |
|--------------|---------------|-------------|
| `--transform-button-color` | `#000000` | The color of the button lines |

### Dark Mode

In dark mode, the button color automatically changes to white:

```css
.dark-side {
    --transform-button-color: #ffffff;
}
```

## Example

```html
<button class="transform-button" id="menu-toggle">
    <span></span>
    Toggle Menu
</button>

<script>
    const toggleButton = document.getElementById('menu-toggle');
    toggleButton.addEventListener('click', function() {
        this.classList.toggle('transform');
    });
</script>
```

This example creates a transform button that toggles its appearance when clicked.