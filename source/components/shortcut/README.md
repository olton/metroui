# Shortcut Component

The Shortcut component provides styled shortcut icons that can be used for application launchers, desktop icons, or navigation elements. It offers both standard and Windows-style shortcut designs with customizable icons and captions.

## Usage

### Standard Shortcut

```html
<!-- Basic shortcut with icon and caption -->
<div class="shortcut">
    <span class="icon mif-windows"></span>
    <span class="caption">Windows</span>
</div>

<!-- Shortcut with only an icon -->
<div class="shortcut">
    <span class="icon mif-chrome"></span>
</div>

<!-- Shortcut with badge -->
<div class="shortcut">
    <span class="icon mif-mail"></span>
    <span class="caption">Mail</span>
    <span class="badge">3</span>
</div>
```

### Windows-Style Shortcut

```html
<!-- Windows-style shortcut -->
<div class="windows-shortcut">
    <span class="icon mif-windows"></span>
    <span class="caption">Windows</span>
</div>

<!-- Windows-style shortcut with image icon -->
<div class="windows-shortcut">
    <img class="icon" src="path/to/icon.png">
    <span class="caption">Application</span>
</div>
```

### Shortcut Variants

```html
<!-- Outline shortcut -->
<div class="shortcut outline">
    <span class="icon mif-file"></span>
    <span class="caption">Document</span>
</div>

<!-- Disabled shortcut -->
<div class="shortcut disabled">
    <span class="icon mif-blocked"></span>
    <span class="caption">Disabled</span>
</div>
```

## Styling with CSS Variables

The Shortcut component can be styled using the following CSS variables:

### Standard Shortcut Variables

| Variable | Light Mode | Dark Mode | Description |
| -------- | ---------- | --------- | ----------- |
| --shortcut-border-radius | 6px | 6px | Border radius of the shortcut |
| --shortcut-background | #f8f8f8 | #2e2e2e | Background color of the shortcut |
| --shortcut-color | #191919 | #F8F8F8 | Text color of the shortcut |
| --shortcut-background-hover | #dadada | #373737 | Background color on hover |
| --shortcut-color-hover | #474747 | #bfbfbf | Text color on hover |

### Windows-Style Shortcut Variables

| Variable | Light Mode | Dark Mode | Description |
| -------- | ---------- | --------- | ----------- |
| --windows-shortcut-icon-size | 40px | 40px | Size of the icon in Windows-style shortcuts |
| --windows-shortcut-border-radius | 4px | 4px | Border radius of Windows-style shortcuts |
| --windows-shortcut-background | transparent | transparent | Background color of Windows-style shortcuts |
| --windows-shortcut-background-hover | #efefef | #373737 | Background color on hover |
| --windows-shortcut-color | #191919 | #F8F8F8 | Text color of Windows-style shortcuts |

### Example of Custom Styling

```css
/* Custom styling for shortcuts */
:root {
    --shortcut-background: #e3f2fd;
    --shortcut-color: #0d47a1;
    --shortcut-background-hover: #bbdefb;
    --shortcut-color-hover: #1565c0;
    
    --windows-shortcut-icon-size: 48px;
    --windows-shortcut-background-hover: #e3f2fd;
}
```

## Available CSS Classes

### Base Classes
- `.shortcut` - Standard shortcut style
- `.windows-shortcut` - Windows-style shortcut

### Modifier Classes
- `.outline` - Shortcut with transparent background and border
- `.disabled` - Disabled shortcut with reduced opacity
- `.focus` - Shortcut with focus styling

### Element Classes
- `.icon` - The icon element within a shortcut
- `.caption` - The text caption element within a shortcut
- `.badge` - Badge element for displaying notifications or counts

## Structure

### Standard Shortcut Structure
The standard shortcut has a size of 84px × 84px and displays elements in a vertical column:
```
┌──────────────────┐
│                  │
│       Icon       │
│                  │
│     Caption      │
│                  │
└──────────────────┘
```

### Windows-Style Shortcut Structure
The Windows-style shortcut has a size of 64px × 64px and also displays elements in a vertical column:
```
┌──────────────────┐
│                  │
│       Icon       │
│                  │
│     Caption      │
│                  │
└──────────────────┘
```

## Dark Mode Support

The Shortcut component automatically adjusts its colors when the `.dark-side` class is applied to a parent element, providing appropriate styling for dark mode interfaces.

## Best Practices

1. Use consistent shortcut styles throughout your application
2. Choose icons that clearly represent the action or destination
3. Keep caption text short and descriptive
4. Use badges sparingly and only when they provide valuable information
5. Consider using the Windows-style shortcuts for desktop-like interfaces
6. Ensure sufficient contrast between the shortcut and its background
7. Use the dark mode support to ensure shortcuts look appropriate in both light and dark interfaces