# Info Button Component

The Info Button component provides a button with a title and value section. It's commonly used for displaying information with a count or value, such as notifications, messages, or items in a cart.

## Usage

### Basic Info Button

```html
<button class="info-button">
    <span class="title">Messages</span>
    <span class="value">5</span>
</button>
```

### Info Button with Icon

```html
<button class="info-button">
    <span class="title">
        <span class="icon mif-mail"></span>
        Inbox
    </span>
    <span class="value">12</span>
</button>
```

### Colored Info Button

```html
<button class="info-button primary">
    <span class="title">Notifications</span>
    <span class="value">3</span>
</button>

<button class="info-button success">
    <span class="title">Completed</span>
    <span class="value">7</span>
</button>

<button class="info-button alert">
    <span class="title">Errors</span>
    <span class="value">2</span>
</button>
```

### Info Button as a Link

```html
<a href="#" class="info-button">
    <span class="title">Cart</span>
    <span class="value">4</span>
</a>
```

## Styling with CSS Variables

The Info Button component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --info-button-border-radius | 4px | 4px | Border radius of the button |
| --info-button-border-color | var(--border-color) | var(--border-color) | Border color of the button |
| --info-button-background | #F8F8F8 | #2e2e2e | Background color of the title section |
| --info-button-color | #191919 | #F8F8F8 | Text color of the title section |
| --info-button-background-secondary | #ffffff | var(--default-background) | Background color of the value section |
| --info-button-color-secondary | #000000 | var(--default-color) | Text color of the value section |
| --info-button-background-hover | #dcdcdc | #373737 | Background color of the title section on hover |
| --info-button-color-hover | #474747 | #bfbfbf | Text color of the title section on hover |

### Example of Custom Styling

```css
/* Custom styling for a specific info button */
.my-custom-info-button {
    --info-button-background: #e3f2fd;
    --info-button-color: #0d47a1;
    --info-button-background-secondary: #bbdefb;
    --info-button-color-secondary: #1565c0;
    --info-button-background-hover: #bbdefb;
    --info-button-color-hover: #0d47a1;
}
```

## Available CSS Classes

### Base Classes
- `.info-button` - Base class for all info buttons

### Color Classes
- `.primary`, `.secondary`, `.success`, `.warning`, `.alert`, `.info` - Color variants for the button

### Structure Elements
- `.title` - Container for the main text and optional icon
- `.value` - Container for the secondary value or count
- `.icon` - Optional icon that can be included in the title section

## Best Practices

1. Use info buttons for displaying information with a count or value
2. Keep title text concise and descriptive
3. Use color variants consistently throughout your application to indicate similar types of information
4. Consider using icons to make the purpose of the button more clear
5. Ensure sufficient contrast between text and background colors for readability
6. Use the value section for numerical values or short text (1-3 characters)
7. For longer values, consider using a different component or adjusting the styling