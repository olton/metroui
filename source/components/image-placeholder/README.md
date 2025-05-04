# Image Placeholder Component

The Image Placeholder component generates dynamic placeholder images with customizable dimensions, colors, and text. It's useful for prototyping, mockups, or as fallback images when actual content is not available.

## Usage

### Basic Usage

```html
<!-- Basic placeholder with default settings (100x100) -->
<img data-role="image-placeholder">

<!-- Custom size placeholder -->
<img data-role="image-placeholder" data-size="300x200">

<!-- Custom colors -->
<img data-role="image-placeholder" data-color="#e0f7fa" data-text-color="#006064">

<!-- Custom text -->
<img data-role="image-placeholder" data-text="No Image Available" data-size="200x150">
```

### JavaScript Initialization

```javascript
// Initialize with default options
$(".placeholder-img").imagePlaceholder();

// Initialize with custom options
$(".placeholder-img").imagePlaceholder({
    size: "400x300",
    color: "#f5f5f5",
    textColor: "#333333",
    text: "Loading...",
    font: "16px Arial"
});
```

## Configuration Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| `size` | "100x100" | Default size of the placeholder in format "widthxheight" |
| `width` | null | Width of the placeholder (overrides width from size if set) |
| `height` | null | Height of the placeholder (overrides height from size if set) |
| `color` | "#f8f8f8" | Background color of the placeholder |
| `textColor` | "#292929" | Color of the text displayed on the placeholder |
| `font` | "12px sans-serif" | Font style for the text |
| `text` | "" | Custom text to display (if empty, shows dimensions) |
| `showText` | true | Whether to show text on the placeholder |

## Events

| Event | Description |
| ----- | ----------- |
| `onImagePlaceholderCreate` | Triggered after the placeholder is created |

## Example Use Cases

### Responsive Placeholders

```html
<!-- Responsive placeholder that adapts to container width -->
<div class="img-container" style="width: 100%; max-width: 600px;">
    <img data-role="image-placeholder" 
         data-size="600x400" 
         style="width: 100%; height: auto;">
</div>
```

### Loading State Placeholders

```html
<!-- Placeholder for image that's still loading -->
<img data-role="image-placeholder" 
     data-text="Loading Image..." 
     data-color="#e3f2fd" 
     data-text-color="#1565c0"
     data-size="300x200">
```

### Error State Placeholders

```html
<!-- Placeholder for image that failed to load -->
<img src="actual-image.jpg" 
     onerror="Metro.getPlugin(this, 'image-placeholder', {
         text: 'Image Not Available',
         color: '#ffebee',
         textColor: '#c62828',
         size: '300x200'
     })">
```

## Best Practices

1. Always specify dimensions for placeholders to prevent layout shifts when content loads
2. Use appropriate colors that match your application's design system
3. Keep placeholder text concise and informative
4. Consider using placeholders as fallbacks for images that might fail to load
5. For large placeholders, consider increasing the font size for better readability