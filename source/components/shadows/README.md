# Shadows Component

The Shadows component provides a comprehensive set of CSS classes for adding shadow effects to elements and text. It includes various shadow styles, sizes, and color options that can be easily applied to enhance the visual hierarchy and depth of your UI.

## Usage

### Box Shadows

```html
<!-- Basic shadow sizes -->
<div class="shadow-small">Small shadow</div>
<div class="shadow-normal">Normal shadow</div>
<div class="shadow-medium">Medium shadow</div>
<div class="shadow-large">Large shadow</div>
<div class="shadow-large-extra">Extra large shadow</div>

<!-- Special shadow effects -->
<div class="shadow-3d">3D shadow effect</div>
<div class="shadow-3d-border">3D shadow with border</div>
<div class="shadow-border">Border shadow</div>
<div class="shadow-solid">Solid shadow</div>

<!-- Remove shadows -->
<div class="no-shadow-box">No box shadow</div>
```

### Colored Box Shadows

```html
<!-- Colored 3D shadows -->
<div class="shadow-3d-red">Red 3D shadow</div>
<div class="shadow-3d-green">Green 3D shadow</div>
<div class="shadow-3d-blue">Blue 3D shadow</div>

<!-- Colored 3D shadows with border -->
<div class="shadow-3d-border-red">Red 3D shadow with border</div>
<div class="shadow-3d-border-green">Green 3D shadow with border</div>

<!-- Glow effects -->
<div class="shadow-glow-red">Red glow effect</div>
<div class="shadow-glow-soft-blue">Soft blue glow effect</div>
```

### Text Shadows

```html
<!-- Basic text shadow -->
<p class="text-shadow">Text with shadow</p>

<!-- Special text shadow effects -->
<p class="text-retro">Retro text effect</p>
<p class="text-3d">3D text effect</p>

<!-- Colored text glow effects -->
<p class="text-shadow-glow-red">Red glowing text</p>
<p class="text-shadow-glow-blue">Blue glowing text</p>

<!-- Remove text shadow -->
<p class="no-shadow-text">No text shadow</p>
```

## Styling with CSS Variables

The Shadows component uses CSS variables to define shadow colors, which automatically adjust between light and dark modes:

| Variable | Light Mode | Dark Mode | Description |
| -------- | ---------- | --------- | ----------- |
| --shadow-color-small | rgba(0, 0, 0, 0.05) | rgba(0, 0, 0, 0.55) | Color for small shadows |
| --shadow-color-normal | rgba(0, 0, 0, 0.1) | rgba(0, 0, 0, 0.75) | Color for normal shadows |
| --shadow-color-medium | rgba(0, 0, 0, 0.1) | rgba(0, 0, 0, 0.75) | Color for medium shadows |
| --shadow-color-large | rgba(0, 0, 0, 0.1) | rgba(0, 0, 0, 0.75) | Color for large shadows |
| --shadow-color-large-extra | rgba(0, 0, 0, 0.25) | rgba(0, 0, 0, 0.75) | Color for extra large shadows |
| --shadow-color-3d | rgba(0, 0, 0, 1) | rgb(17, 18, 21) | Color for 3D shadows |
| --shadow-color-border1 | rgba(9, 30, 66, 0.25) | rgba(0, 0, 0, 0.45) | Primary color for border shadows |
| --shadow-color-border2 | rgba(9, 30, 66, 0.13) | rgba(0, 0, 0, 0.25) | Secondary color for border shadows |
| --shadow-color-solid-1 | rgba(9, 30, 66, 0.25) | rgba(0, 0, 0, 0.55) | Primary color for solid shadows |
| --shadow-color-solid-2 | rgba(9, 30, 66, 0.08) | rgba(0, 0, 0, 0.25) | Secondary color for solid shadows |
| --shadow-color-text | rgb(46, 46, 46) | rgba(0, 0, 0, 0.55) | Color for text shadows |

### Example of Custom Styling

```css
/* Custom shadow colors */
:root {
    --shadow-color-normal: rgba(0, 120, 215, 0.2);
    --shadow-color-3d: #0078d7;
}
```

## Available CSS Classes

### Box Shadow Classes
- `.shadow-small` - Small, subtle shadow
- `.shadow-normal` - Standard shadow
- `.shadow-medium` - Medium-sized shadow
- `.shadow-large` - Large shadow for elevated elements
- `.shadow-large-extra` - Extra large shadow for highly elevated elements
- `.shadow-3d` - 3D effect shadow
- `.shadow-3d-border` - 3D effect shadow with border
- `.shadow-border` - Border-like shadow
- `.shadow-solid` - Solid shadow effect

### Colored Box Shadow Classes
- `.shadow-3d-{color}` - 3D shadow with specified color
- `.shadow-3d-border-{color}` - 3D shadow with border in specified color
- `.shadow-glow-{color}` - Glow effect in specified color
- `.shadow-glow-soft-{color}` - Soft glow effect in specified color

### Text Shadow Classes
- `.text-shadow` - Basic text shadow
- `.text-retro` - Retro-style text effect
- `.text-3d` - 3D text effect
- `.text-shadow-glow-{color}` - Text with glowing effect in specified color

### Utility Classes
- `.no-shadow-box` - Removes box shadows
- `.no-shadow-text` - Removes text shadows
- `.no-shadow` - Removes both box and text shadows

## Dark Mode Support

The Shadows component automatically adjusts shadow colors when the `.dark-side` class is applied to a parent element, providing appropriate shadow effects for dark mode interfaces.

## Best Practices

1. Use shadows consistently to establish a clear visual hierarchy in your UI
2. Choose shadow sizes that reflect the elevation of elements (higher elements should have larger shadows)
3. Use colored shadows sparingly for emphasis or to match your brand colors
4. Consider using smaller shadows for mobile interfaces to maintain a clean look on smaller screens
5. Ensure sufficient contrast between elements with shadows and their backgrounds
6. Use the dark mode support to ensure shadows look appropriate in both light and dark interfaces