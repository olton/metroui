# Colors CSS Component

The Colors CSS component provides a comprehensive set of color utilities for styling your Metro UI applications. It includes predefined color variables, background colors, foreground (text) colors, border colors, and more.

## CSS Variables

The component defines a wide range of CSS variables that can be used throughout your application:

### Base Colors

```css
--color-dark: #1d1d1d;
--color-light: #ffffff;
--color-gray: #a0a0a0;
--color-gray-blue: #607d8b;
--color-gray-white: #f8f8f8;
--color-gray-mouse: #455a64;
```

### Standard Colors

```css
--color-lime: #a4c400;
--color-green: #60a917;
--color-emerald: #008a00;
--color-blue: #0072c6;
--color-teal: #00aba9;
--color-cyan: #1ba1e2;
--color-cobalt: #0050ef;
--color-indigo: #6a00ff;
--color-violet: #aa00ff;
--color-pink: #f472d0;
--color-magenta: #d80073;
--color-crimson: #a20025;
--color-red: #e51400;
--color-orange: #fa6800;
--color-amber: #f0a30a;
--color-yellow: #fff000;
--color-brown: #825a2c;
--color-olive: #6d8764;
--color-steel: #647687;
```

### Color Variants

The component also provides dark, saturated, and light variants of all standard colors:

- Dark variants: `--color-dark-[color]` (e.g., `--color-dark-blue`)
- Saturated variants: `--color-sat-[color]` (e.g., `--color-sat-blue`)
- Light variants: `--color-light-[color]` (e.g., `--color-light-blue`)

### Utility Colors

```css
--color-hover-default: rgba(29, 29, 29, 0.1);
--color-success: green;
--color-alert: #c10000;
--color-warning: orange;
--color-info: #468cff;
```

## CSS Classes

### Background Colors

Apply background colors to elements:

```html
<div class="bg-blue">Blue background</div>
<div class="bg-red">Red background</div>
```

#### Background Modifiers

- `.bg-[color]`: Apply a background color
- `.bg-[color]-active`: Apply a background color on active state
- `.bg-[color]-hover`: Apply a background color on hover
- `.bg-[color]-focus`: Apply a background color on focus

#### Special Background Classes

- `.bg-transparent`: Transparent background
- `.bg-default`: Default background color
- `.bg-hover`: Hover background effect
- `.bg-glassmorphism`: Glassmorphism effect with blur

### Foreground (Text) Colors

Apply text colors to elements:

```html
<p class="fg-blue">Blue text</p>
<p class="fg-red">Red text</p>
```

### Border Colors

Apply border colors to elements:

```html
<div class="bd-blue">Element with blue border</div>
<div class="bd-red">Element with red border</div>
```

### Accent Colors

Apply accent colors to UI components:

```html
<button class="button blue">Blue Button</button>
<button class="button red outline">Red Outline Button</button>
```

### Opacity Classes

Control the opacity of elements:

```html
<div class="op-10">10% opacity</div>
<div class="op-50">50% opacity</div>
<div class="op-90">90% opacity</div>
```

### Gradient Colors

Apply gradient backgrounds:

```html
<div class="gradient-blue">Blue gradient</div>
<div class="gradient-red-yellow">Red to yellow gradient</div>
```

### SVG Colors

Style SVG elements:

```html
<svg class="svg-fill-blue">...</svg>
<svg class="svg-stroke-red">...</svg>
```

## Customization

You can customize the colors by overriding the CSS variables in your own stylesheet:

```css
:root {
  --color-blue: #0066cc;
  --color-red: #cc0000;
}
```

## Responsive Design

The component supports responsive design with media queries for different hover states:

```css
@media (hover: hover) {
  /* Styles for devices that support hover */
}

@media (hover: none) {
  /* Styles for touch devices */
}
```

## Best Practices

1. Use the predefined color variables for consistency across your application
2. Apply background colors with the `bg-` prefix classes
3. Apply text colors with the `fg-` prefix classes
4. Apply border colors with the `bd-` prefix classes
5. Use accent colors for interactive elements like buttons
6. Combine with other Metro UI components for a cohesive design