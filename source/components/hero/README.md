# Hero Component

The Hero component provides a full-width banner section typically used at the top of a webpage to showcase key content or imagery. It's designed to be eye-catching and to establish the visual identity of the page.

## Usage

### Basic Hero Section

```html
<div class="hero">
    <h1>Welcome to Our Website</h1>
    <p>Discover amazing products and services</p>
    <button class="button">Learn More</button>
</div>
```

### Hero with Background Image

```html
<div class="hero" style="background-image: url('path/to/image.jpg');">
    <h1>Welcome to Our Website</h1>
    <p>Discover amazing products and services</p>
    <button class="button">Learn More</button>
</div>
```

### Hero with Custom Colors

```html
<div class="hero" style="--hero-background: #2196F3; --hero-color: #ffffff;">
    <h1>Welcome to Our Website</h1>
    <p>Discover amazing products and services</p>
    <button class="button">Learn More</button>
</div>
```

## Features

- Full-width banner section for highlighting important content
- Support for background images
- Responsive padding that adjusts to screen size
- Customizable through CSS variables
- Simple implementation with minimal markup

## Styling with CSS Variables

The Hero component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --hero-background | #ffffff | #1e1f22 | Background color of the hero section |
| --hero-color | #191919 | #dbdfe7 | Text color of the hero section |

### Example of Custom Styling

```css
/* Custom styling for a specific hero section */
.custom-hero {
    --hero-background: linear-gradient(135deg, #667eea, #764ba2);
    --hero-color: #ffffff;
}
```

## Responsive Behavior

The Hero component has the following responsive behavior:

| Screen Size | Padding |
| ----------- | ------- |
| Mobile (< 768px) | 40px 20px |
| Desktop (≥ 768px) | 160px 80px |

## Background Options

The Hero component supports various background options:

- Solid color (using the `--hero-background` variable)
- Background image (using the `background-image` property)
- Gradient (using the `--hero-background` variable with a CSS gradient)

When using a background image, the component automatically sets:
- `background-position: center`
- `background-repeat: no-repeat`
- `background-size: cover`

## Common Use Cases

- Website homepage banner
- Section introductions
- Call-to-action areas
- Product showcases
- Event announcements