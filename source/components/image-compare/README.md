# Image Compare Component

The Image Compare component provides an interactive way to compare two images by sliding a divider between them. This is useful for before/after comparisons, showing differences between images, or highlighting changes.

## Usage

### Basic Usage

```html
<div class="image-compare">
    <img src="image1.jpg" alt="Before">
    <img src="image2.jpg" alt="After">
</div>
```

### JavaScript Initialization

```javascript
// Initialize with default options
Metro.makePlugin(element, "image-compare");

// Initialize with custom options
Metro.makePlugin(element, "image-compare", {
    width: "100%",
    height: "16/9",
    onSliderMove: function(e) {
        console.log("Slider moved to position:", e.x);
    }
});
```

## Plugin Parameters

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| imageCompareDeferred | 0 | Delay before initialization (milliseconds) |
| width | "100%" | Width of the component (CSS value or percentage) |
| height | "auto" | Height of the component (CSS value, percentage, or aspect ratio like "16/9", "21/9", "4/3") |
| onSliderMove | Metro.noop | Callback function triggered when the slider is moved |
| onImageCompareCreate | Metro.noop | Callback function triggered when the component is created |

## API Methods

### changeAttribute(attr, val)
Changes the specified attribute of the component.

### destroy()
Removes the component and its event handlers.

## Styling with CSS Variables

The Image Compare component can be styled using the following CSS variables:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| @orange | Orange color | Background color of the slider |
| @borderRadius | Border radius value | Border radius for the slider |

### Example of Custom Styling

```css
/* Custom styling for a specific image compare component */
#myImageCompare .image-slider {
    background-color: #ff0000; /* Red slider */
    opacity: 1;
}
```

## Component Structure

The component creates the following structure:

```html
<div class="image-compare">
    <div class="image-container">
        <div class="image-wrapper" style="background-image: url(image1.jpg)"></div>
    </div>
    <div class="image-container-overlay">
        <div class="image-wrapper" style="background-image: url(image2.jpg)"></div>
    </div>
    <div class="image-slider"></div>
</div>
```

## Accessibility

The Image Compare component includes:
- Interactive slider for comparing images
- Visual feedback when interacting with the slider

## Best Practices

1. Use high-quality images with the same dimensions for best results
2. Ensure the images being compared are aligned properly
3. Consider adding descriptive text near the component to explain what is being compared
4. Use appropriate image formats (JPEG for photos, PNG for graphics with transparency)