# Box Component

The Box component provides a simple, styled container with a border, background, and padding. It's useful for grouping related content and creating visual separation between different sections of a page.

## Usage

```html
<div class="box">
    <div class="box-title">Box Title</div>
    <p>Content inside the box...</p>
    <div class="box-title-secondary">Secondary Title</div>
    <p>More content...</p>
</div>
```

## Features

- Clean, bordered container with rounded corners
- Support for primary and secondary titles
- Customizable through CSS variables
- Automatic spacing between multiple boxes

## Styling with CSS Variables

The Box component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --box-border-radius | 10px | 10px | Border radius of the box |
| --box-border-color | var(--border-color) | var(--border-color) | Border color of the box |
| --box-background | #ffffff | var(--default-background) | Background color of the box |
| --box-color | #191919 | var(--default-color) | Text color inside the box |

### Example of Custom Styling

```css
/* Custom styling for a specific box */
.custom-box {
    --box-border-radius: 4px;
    --box-border-color: #2196F3;
    --box-background: #E3F2FD;
    --box-color: #0D47A1;
}
```

## Structure

The Box component includes the following elements:

- `.box` - The main container
- `.box-title` - Primary title with bottom border
- `.box-title-secondary` - Secondary title (smaller than primary)

## Spacing

- The box has internal padding of 1.5rem
- Multiple boxes are automatically spaced with a 1rem margin between them
- Titles have a 0.5rem margin at the bottom
- Secondary titles that follow other elements have a 2rem margin at the top