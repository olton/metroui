# Image Magnifier Component

The Image Magnifier component provides an interactive way to zoom in on parts of an image. It creates a magnifying glass effect that follows the cursor, allowing users to see details of the image at a higher zoom level.

## Usage

### Basic Usage

```html
<div class="image-magnifier">
    <img src="image.jpg" alt="Image to magnify">
</div>
```

### JavaScript Initialization

```javascript
// Initialize with default options
Metro.makePlugin(element, "image-magnifier");

// Initialize with custom options
Metro.makePlugin(element, "image-magnifier", {
    lensSize: 150,
    lensType: "circle",
    magnifierZoom: 3,
    magnifierMode: "glass",
    onMagnifierMove: function(e) {
        console.log("Magnifier moved to position:", e.pos);
    }
});
```

## Plugin Parameters

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| imageMagnifierDeferred | 0 | Delay before initialization (milliseconds) |
| width | "100%" | Width of the component (CSS value or percentage) |
| height | "auto" | Height of the component (CSS value, percentage, or aspect ratio like "16/9", "21/9", "4/3") |
| lensSize | 100 | Size of the magnifier lens in pixels |
| lensType | "square" | Shape of the lens: "square" or "circle" |
| magnifierZoom | 2 | Zoom level for the magnified view |
| magnifierMode | "glass" | Mode of operation: "glass" (magnification in the lens) or "zoom" (magnification in a separate element) |
| magnifierZoomElement | null | Element to display the zoomed image when in "zoom" mode (if null, a new element is created) |
| clsMagnifier | "" | Additional CSS class for the magnifier container |
| clsLens | "" | Additional CSS class for the lens element |
| clsZoom | "" | Additional CSS class for the zoom element (when in "zoom" mode) |
| onMagnifierMove | Metro.noop | Callback function triggered when the magnifier is moved |
| onImageMagnifierCreate | Metro.noop | Callback function triggered when the component is created |

## API Methods

### changeAttribute(attr, val)
Changes the specified attribute of the component.

### destroy()
Removes the component and its event handlers.

## Styling with CSS Variables

The Image Magnifier component uses the following styling:

| Element | Style | Description |
| ------- | ----- | ----------- |
| .image-magnifier | position: relative; display: block; cursor: none; | Container for the magnifier |
| .image-magnifier img | width: 100%; height: auto; | Image to be magnified |
| .image-magnifier-glass | position: absolute; border: 4px solid rgba(255,255,255,.7); | Magnifier lens |

### Example of Custom Styling

```css
/* Custom styling for a specific image magnifier */
#myImageMagnifier .image-magnifier-glass {
    border: 3px solid rgba(0, 0, 0, 0.5); /* Dark border for the lens */
}

/* Custom styling for the zoom element in zoom mode */
.my-zoom-element {
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
```

## Component Structure

The component creates the following structure in "glass" mode:

```html
<div class="image-magnifier">
    <img src="image.jpg" alt="Image to magnify">
    <div class="image-magnifier-glass"></div>
</div>
```

In "zoom" mode, an additional element is created or used for displaying the zoomed image:

```html
<div class="image-magnifier">
    <img src="image.jpg" alt="Image to magnify">
    <div class="image-magnifier-glass"></div>
</div>
<div class="zoom-element"></div> <!-- Created automatically or specified via magnifierZoomElement -->
```

## Modes of Operation

### Glass Mode
In "glass" mode, the magnified view appears directly in the lens that follows the cursor. This is useful for inline magnification without requiring additional screen space.

### Zoom Mode
In "zoom" mode, the lens acts as a selection area, and the magnified view appears in a separate element. This allows for a larger magnified view and is useful when more detail is needed.

## Accessibility

The Image Magnifier component enhances the viewing experience for users who need to see details in images. Consider the following for better accessibility:

- Provide descriptive alt text for the image being magnified
- Ensure sufficient color contrast for the magnifier lens border
- Consider adding keyboard navigation options for users who cannot use a mouse

## Best Practices

1. Use high-quality images to ensure details are visible when magnified
2. Choose an appropriate lens size and zoom level for your content
3. For complex images with many details, consider using a higher zoom level
4. In "zoom" mode, position the zoom element in a way that doesn't obscure important content
5. Test the component on different screen sizes to ensure it works well on all devices