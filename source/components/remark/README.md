# Remark Component

The Remark component provides styled message boxes or callouts that can be used to highlight important information, quotes, or notes in your application. It's a CSS-only component with various styling options.

## Usage

### Basic Remark

```html
<div class="remark">
    This is a basic remark box that can be used to highlight important information.
</div>
```

### Remark with Icon

```html
<div class="remark">
    <span class="icon mif-info"></span>
    This remark includes an icon on the left side.
</div>
```

### Color Variants

```html
<!-- Alert/Error Remark -->
<div class="remark alert">
    <span class="icon mif-warning"></span>
    This is an alert message for critical information.
</div>

<!-- Warning Remark -->
<div class="remark warning">
    <span class="icon mif-warning"></span>
    This is a warning message for important cautions.
</div>

<!-- Info Remark -->
<div class="remark info">
    <span class="icon mif-info"></span>
    This is an informational message.
</div>

<!-- Success Remark -->
<div class="remark success">
    <span class="icon mif-checkmark"></span>
    This is a success message.
</div>

<!-- Dark Remark -->
<div class="remark dark">
    <span class="icon mif-books"></span>
    This is a dark-themed remark.
</div>
```

### Custom Colors

The Remark component supports all standard Metro UI colors:

```html
<div class="remark red">Red remark</div>
<div class="remark green">Green remark</div>
<div class="remark blue">Blue remark</div>
<div class="remark yellow">Yellow remark</div>
<div class="remark orange">Orange remark</div>
<div class="remark purple">Purple remark</div>
<div class="remark lime">Lime remark</div>
<!-- And many more color options -->
```

## CSS Variables

The Remark component can be styled using the following CSS variables:

| Variable | Default (Light) | Default (Dark) | Description |
| --- | --- | --- | --- |
| --remark-border-radius | 6px | 6px | Border radius of the remark box |
| --remark-border-color | var(--border-color) | var(--border-color) | Border color of the remark box |
| --remark-background | #ffffff | #26282e | Background color of the remark box |
| --remark-color | #191919 | #dbdfe7 | Text color of the remark box |

## Available CSS Classes

### Base Class
- `.remark` - The base class for the remark component

### Color Variants
- `.alert`, `.error` - Red styling for error or alert messages
- `.warning`, `.caution` - Orange styling for warning messages
- `.info` - Blue styling for informational messages
- `.success` - Green styling for success messages
- `.dark` - Dark styling
- Any standard Metro UI color name (e.g., `.red`, `.green`, `.blue`, etc.)

## Custom Styling Example

```css
.custom-remark {
    --remark-border-radius: 10px;
    --remark-background: #f8f9fa;
    --remark-color: #343a40;
    --remark-border-color: #6c757d;
}
```

```html
<div class="remark custom-remark">
    This remark has custom styling applied.
</div>
```

## Structure

The Remark component has the following structure:

```html
<div class="remark [color-variant]">
    <!-- Optional icon -->
    <span class="icon [icon-class]"></span>
    
    <!-- Remark content -->
    Your content here
</div>
```

## Best Practices

1. Use appropriate color variants to match the type of message (e.g., use `.alert` for errors, `.success` for confirmations)
2. Include relevant icons to enhance visual recognition
3. Keep remark content concise and focused
4. Use remarks sparingly to highlight truly important information
5. Consider accessibility by ensuring sufficient color contrast