# Ribbon Component

The Ribbon component provides a stylish, ribbon-shaped label that can be positioned on elements. It's commonly used to highlight special features, promotions, or status indicators on cards, images, or containers.

## Usage

### Basic Ribbon

```html
<div style="position: relative; width: 300px; height: 200px; background-color: #f0f0f0;">
    <span class="ribbon">New</span>
    Content with a ribbon label
</div>
```

### Right-Positioned Ribbon

```html
<div style="position: relative; width: 300px; height: 200px; background-color: #f0f0f0;">
    <span class="ribbon right">Featured</span>
    Content with a right-positioned ribbon
</div>
```

### Ribbon with Icon

```html
<div style="position: relative; width: 300px; height: 200px; background-color: #f0f0f0;">
    <span class="ribbon">
        <span class="icon mif-star-full"></span>
        Featured
    </span>
    Content with an icon in the ribbon
</div>
```

### Colored Ribbons

```html
<div style="position: relative; width: 300px; height: 200px; background-color: #f0f0f0;">
    <span class="ribbon ribbon-red">Sale</span>
    Content with a red ribbon
</div>

<div style="position: relative; width: 300px; height: 200px; background-color: #f0f0f0;">
    <span class="ribbon ribbon-green">Success</span>
    Content with a green ribbon
</div>

<div style="position: relative; width: 300px; height: 200px; background-color: #f0f0f0;">
    <span class="ribbon ribbon-blue">Info</span>
    Content with a blue ribbon
</div>

<div style="position: relative; width: 300px; height: 200px; background-color: #f0f0f0;">
    <span class="ribbon ribbon-yellow">Warning</span>
    Content with a yellow ribbon
</div>
```

## CSS Variables

The Ribbon component can be styled using the following CSS variables:

| Variable | Default (Light) | Default (Dark) | Description |
| --- | --- | --- | --- |
| --ribbon-background | rgb(117, 117, 117) | rgba(117, 117, 117, 0.32) | Background color of the ribbon |
| --ribbon-color | #ffffff | #ffffff | Text color of the ribbon |

## Available CSS Classes

### Base Class
- `.ribbon` - The base class for the ribbon component

### Position Variants
- `.right` - Positions the ribbon on the right side of the element

### Color Variants
- `.ribbon-red` - Red ribbon
- `.ribbon-green` - Green ribbon
- `.ribbon-blue` - Blue ribbon
- `.ribbon-yellow` - Yellow ribbon
- `.ribbon-orange` - Orange ribbon
- `.ribbon-purple` - Purple ribbon
- `.ribbon-lime` - Lime ribbon
- And other standard Metro UI colors

## Structure

The Ribbon component has the following structure:

```html
<span class="ribbon [position] [color-variant]">
    <!-- Optional icon -->
    <span class="icon [icon-class]"></span>
    
    <!-- Ribbon text -->
    Ribbon text
</span>
```

## Custom Styling Example

```css
.custom-ribbon {
    --ribbon-background: #3498db;
    --ribbon-color: #ffffff;
    font-size: 14px;
    padding: 8px 16px;
    top: 30px;
}

.custom-ribbon::before {
    color: #2980b9;
}
```

```html
<div style="position: relative; width: 300px; height: 200px; background-color: #f0f0f0;">
    <span class="ribbon custom-ribbon">
        <span class="icon mif-gift"></span>
        Special Offer
    </span>
    Content with a custom styled ribbon
</div>
```

## Important Notes

1. The parent element must have `position: relative` (or absolute/fixed) for the ribbon to be positioned correctly
2. The ribbon is positioned absolutely at the top-left (or top-right) of the parent element
3. The ribbon has a z-index value that places it above most elements but below fixed elements
4. The ribbon includes a shadow effect for depth

## Examples

### Product Card with Ribbon

```html
<div class="card" style="position: relative; width: 300px;">
    <div class="card-header">
        <span class="ribbon ribbon-red">20% OFF</span>
        <img src="product-image.jpg" alt="Product">
    </div>
    <div class="card-content">
        <h3>Product Name</h3>
        <p>Product description goes here.</p>
        <div class="price">$79.99</div>
    </div>
    <div class="card-footer">
        <button class="button primary">Add to Cart</button>
    </div>
</div>
```

### Image Gallery with Featured Items

```html
<div class="image-gallery">
    <div class="image-item" style="position: relative;">
        <span class="ribbon ribbon-yellow">Featured</span>
        <img src="image1.jpg" alt="Image 1">
        <div class="caption">Image 1</div>
    </div>
    
    <div class="image-item" style="position: relative;">
        <img src="image2.jpg" alt="Image 2">
        <div class="caption">Image 2</div>
    </div>
    
    <div class="image-item" style="position: relative;">
        <span class="ribbon ribbon-blue right">New</span>
        <img src="image3.jpg" alt="Image 3">
        <div class="caption">Image 3</div>
    </div>
</div>
```

## Best Practices

1. Use ribbons sparingly to highlight truly important information
2. Choose ribbon colors that contrast well with the background they appear on
3. Keep ribbon text short and concise for better readability
4. Consider using icons to enhance visual recognition
5. Ensure the ribbon doesn't obscure important content in the parent element