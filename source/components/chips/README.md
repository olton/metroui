# Chips Component

The Chips component provides a way to display compact elements that represent an input, attribute, or action. Chips can contain text, icons, and an action button for removal.

## Usage

### Basic Chip

```html
<!-- Basic chip -->
<div class="chip">
    <span class="label">Basic Chip</span>
</div>

<!-- Chip with icon -->
<div class="chip">
    <span class="icon mif-tag"></span>
    <span class="label">Tag</span>
</div>

<!-- Chip with action button -->
<div class="chip">
    <span class="label">Removable</span>
    <span class="action"></span>
</div>

<!-- Chip with icon and action button -->
<div class="chip">
    <span class="icon mif-user"></span>
    <span class="label">John Doe</span>
    <span class="action"></span>
</div>
```

### Chip Variants

```html
<!-- Pill-shaped chip -->
<div class="chip pill-chip">
    <span class="label">Pill Chip</span>
</div>

<!-- Readonly chip (no action button) -->
<div class="chip readonly">
    <span class="label">Readonly</span>
</div>

<!-- Disabled chip (no action button) -->
<div class="chip disabled">
    <span class="label">Disabled</span>
</div>
```

### Chip with Image

```html
<!-- Chip with image -->
<div class="chip">
    <span class="icon">
        <img src="path/to/avatar.jpg" alt="User Avatar">
    </span>
    <span class="label">Jane Smith</span>
    <span class="action"></span>
</div>
```

### Color Variants

```html
<!-- Accent colored chips -->
<div class="chip red">
    <span class="label">Red</span>
    <span class="action"></span>
</div>

<div class="chip green">
    <span class="label">Green</span>
    <span class="action"></span>
</div>

<div class="chip blue">
    <span class="label">Blue</span>
    <span class="action"></span>
</div>

<!-- Soft colored chips -->
<div class="chip soft-yellow">
    <span class="label">Soft Yellow</span>
    <span class="action"></span>
</div>

<div class="chip soft-orange">
    <span class="label">Soft Orange</span>
    <span class="action"></span>
</div>
```

## Styling with CSS Variables

The Chips component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--chip-background` | #F4F4F4 | #2b2d30 | Background color of the chip |
| `--chip-color` | #191919 | #f3fcff | Text color of the chip |
| `--chip-background-hover` | #dadada | #333439 | Background color on hover |
| `--chip-color-hover` | #191919 | #f3fcff | Text color on hover |
| `--chip-action-background` | #c1c1c1 | #43444a | Background color of the action button |
| `--chip-action-color` | #191919 | #f3fcff | Text color of the action button |

### Example of Custom Styling

```css
/* Custom styling for chips */
.custom-chip {
    --chip-background: #e3f2fd;
    --chip-color: #1565c0;
    --chip-background-hover: #bbdefb;
    --chip-color-hover: #0d47a1;
    --chip-action-background: #64b5f6;
    --chip-action-color: #ffffff;
}
```

## Available CSS Classes

### Base Classes
- `.chip` - The main class for creating a chip

### Shape Modifiers
- `.pill-chip` - Creates a pill-shaped chip with rounded edges

### State Classes
- `.readonly` - Removes the action button, making the chip read-only
- `.disabled` - Disables the chip and removes the action button

### Color Classes
- Accent colors: `.red`, `.green`, `.blue`, `.yellow`, etc.
- Soft colors: `.soft-red`, `.soft-green`, `.soft-blue`, etc.

## Structure Elements

The Chips component consists of the following structural elements:

| Element | Class | Description |
| ------- | ----- | ----------- |
| Container | `.chip` | The main container element |
| Label | `.label` | The text content of the chip |
| Icon | `.icon` | Container for an icon or image |
| Action | `.action` | The removal/action button (displays an "×" by default) |

## Additional Information

The Chips component:
- Is purely CSS-based with no JavaScript functionality
- Automatically adapts to both light and dark themes
- Supports various color themes through accent and soft color classes
- Can be used inline with multiple chips having proper spacing (8px margin between chips)
- Has a default height of 32px and font size of 14px