# Icon Box Component

The Icon Box component provides a versatile way to display information with an icon in various layouts. It's commonly used for displaying statistics, features, or key information in a visually appealing format.

## Usage

### Basic Icon Box

The standard icon box has an icon on the left side and content on the right.

```html
<div class="icon-box">
    <div class="icon">
        <span class="mif-users"></span>
    </div>
    <div class="content">
        <div class="title">USERS</div>
        <div class="value">1,245</div>
        <div class="subtitle">Active users</div>
    </div>
</div>
```

### Icon Box with Top-Right Icon (icon-box2)

This variant places the icon in the top-right corner.

```html
<div class="icon-box2">
    <div class="icon">
        <span class="mif-chart-line"></span>
    </div>
    <div class="content">
        <div class="title">REVENUE</div>
        <div class="value">$12,846</div>
        <div class="subtitle">Monthly income</div>
    </div>
</div>
```

### Icon Box with Top-Left Icon (icon-box3)

This variant places the icon in the top-left corner with right-aligned content.

```html
<div class="icon-box3">
    <div class="icon">
        <span class="mif-database"></span>
    </div>
    <div class="content">
        <div class="title">STORAGE</div>
        <div class="value">85%</div>
        <div class="subtitle">Used space</div>
    </div>
</div>
```

### Horizontal Icon Box (icon-box4)

This variant has a circular icon on the left with a more compact layout.

```html
<div class="icon-box4">
    <div class="icon">
        <span class="mif-bell"></span>
    </div>
    <div class="content">
        <div class="title">NOTIFICATIONS</div>
        <div class="value">24 New</div>
    </div>
</div>
```

## Styling with CSS Variables

The Icon Box component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --icon-box-border-radius | 6px | 6px | Border radius for the icon box |
| --icon-box-background | var(--default-background) | var(--default-background) | Background color of the icon box |
| --icon-box-color | var(--default-color) | rgb(219, 223, 231) | Text color of the icon box |
| --icon-box-border-color | var(--border-color) | var(--border-color) | Border color of the icon box |
| --icon-box-icon-background | light-gray | dark-gray | Background color of the icon |
| --icon-box-icon-color | var(--default-color) | var(--default-color) | Text color of the icon |

### Example of Custom Styling

```css
/* Custom styling for a specific icon box */
.my-custom-icon-box {
    --icon-box-background: #e3f2fd;
    --icon-box-color: #0d47a1;
    --icon-box-border-color: #bbdefb;
    --icon-box-icon-background: #2196f3;
    --icon-box-icon-color: white;
}
```

## Available CSS Classes

### Base Classes
- `.icon-box` - Standard layout with icon on the left
- `.icon-box2` - Layout with icon in the top right corner
- `.icon-box3` - Layout with icon in the top left corner and right-aligned content
- `.icon-box4` - Horizontal layout with a circular icon on the left

### Structure Elements
- `.icon` - Container for the icon
- `.content` - Container for the text content
- `.title` - Title text (typically uppercase)
- `.value` - Main value or number (larger font)
- `.subtitle` - Additional description text

## Best Practices

1. Use appropriate icons that clearly represent the information being displayed
2. Keep text content concise and easy to read
3. Maintain consistent styling across multiple icon boxes for a cohesive design
4. Consider using color coding to differentiate between different types of information
5. Ensure sufficient contrast between text and background colors for readability