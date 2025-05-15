# Tag Component

The Tag component provides a styled label element that can include an optional action button.

## Usage

```html
<span class="tag">
    <span class="title">Tag Label</span>
    <span class="action">×</span>
</span>
```

## CSS Classes

### Main Classes
- `.tag` - The main container class for the tag component
- `.title` - Used for displaying the tag text
- `.action` - Used for the action button (typically for removing the tag)

### Size Modifiers
- `.small` - Creates a smaller tag
- `.large` - Creates a larger tag

### Behavior Modifiers
- `.static` - Removes the action button and applies a specific style
- `.short-tag` - Limits the title width to 120px with text ellipsis

### Color Modifiers
The tag component supports various color schemes:

- Accent colors: Add class with the color name (e.g., `.primary`, `.secondary`, etc.)
- Soft colors: Add class with `.soft-` prefix (e.g., `.soft-blue`, `.soft-red`, etc.)
- Normal colors: Add class with `.normal-` prefix (e.g., `.normal-blue`, `.normal-red`, etc.)

## Styling with CSS Variables

The Tag component can be customized using the following CSS variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--tag-background` | `#f8f8f8` | Controls the background color of the tag |
| `--tag-color` | `#191919` | Controls the text color of the tag |
| `--tag-action-background` | `#dcdcdc` | Controls the background color of the action button |
| `--tag-action-color` | `#191919` | Controls the text color of the action button |

### Example of Custom Styling

```css
.tag {
    --tag-background: #e3f2fd;
    --tag-color: #0d47a1;
    --tag-action-background: #bbdefb;
    --tag-action-color: #1976d2;
}
```

For dark mode, the component includes a `.dark-side` class with the following variable values:

```css
.dark-side {
    --tag-background: #53575c;
    --tag-color: #f3fcff;
    --tag-action-background: #2b2d30;
    --tag-action-color: #ffffff;
}
```