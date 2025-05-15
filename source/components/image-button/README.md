# Image Button Component

The Image Button component provides a button with an icon and caption. It's designed to create visually appealing buttons that combine icons with text, making them more recognizable and user-friendly.

## Usage

### Basic Image Button

```html
<button class="image-button">
    <span class="icon mif-home"></span>
    <span class="caption">Home</span>
</button>
```

### Image Button with Icon on the Right

```html
<button class="image-button icon-right">
    <span class="icon mif-arrow-right"></span>
    <span class="caption">Next</span>
</button>
```

### Image Button with Subtitle

```html
<button class="image-button">
    <span class="icon mif-user"></span>
    <span class="caption">
        Profile
        <small>View your profile</small>
    </span>
</button>
```

### Outline Image Button

```html
<button class="image-button outline">
    <span class="icon mif-cog"></span>
    <span class="caption">Settings</span>
</button>
```

### Colored Image Button

```html
<button class="image-button primary">
    <span class="icon mif-plus"></span>
    <span class="caption">Add Item</span>
</button>

<button class="image-button success">
    <span class="icon mif-checkmark"></span>
    <span class="caption">Confirm</span>
</button>

<button class="image-button alert">
    <span class="icon mif-bin"></span>
    <span class="caption">Delete</span>
</button>
```

### Image Button as a Link

```html
<a href="#" class="image-button">
    <span class="icon mif-link"></span>
    <span class="caption">Visit Website</span>
</a>
```

## Styling with CSS Variables

The Image Button component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --image-button-border-radius | 4px | 4px | Border radius of the button |
| --image-button-background | light-gray | #4a4a4a | Background color of the button |
| --image-button-color | default-color | default-color | Text color of the button |
| --image-button-icon-background | #929fa6 | #2e2e2e | Background color of the icon |
| --image-button-icon-color | #ffffff | #ffffff | Color of the icon |
| --image-button-icon-background-hover | #7da0b3 | #373737 | Background color of the icon on hover |
| --image-button-icon-color-hover | #ffffff | #ffffff | Color of the icon on hover |

### Example of Custom Styling

```css
/* Custom styling for a specific image button */
.my-custom-image-button {
    --image-button-background: #e3f2fd;
    --image-button-color: #0d47a1;
    --image-button-icon-background: #2196f3;
    --image-button-icon-color: white;
    --image-button-icon-background-hover: #1976d2;
    --image-button-icon-color-hover: white;
}
```

## Available CSS Classes

### Base Classes
- `.image-button` - Base class for all image buttons

### Layout Modifiers
- `.icon-right` - Places the icon on the right side of the caption

### Style Modifiers
- `.outline` - Creates a button with transparent background and a border
- `.disabled` - Applies a disabled appearance to the button (use with the `disabled` attribute)

### Color Classes
- `.primary`, `.secondary`, `.success`, `.warning`, `.alert`, `.info` - Color variants for the button

### Structure Elements
- `.icon` - Container for the icon
- `.caption` - Container for the text content
- `.caption small` - Subtitle or additional description text

## Best Practices

1. Use appropriate icons that clearly represent the action of the button
2. Keep caption text concise and descriptive
3. Use color variants consistently throughout your application to indicate similar actions
4. Consider using the subtitle for additional context when needed
5. Ensure sufficient contrast between text and background colors for readability
6. Use the `disabled` attribute along with the `.disabled` class for buttons that are not active