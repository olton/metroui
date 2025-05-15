# Gradient Box Component

The Gradient Box component allows you to create elements with customizable gradient backgrounds. It supports both linear and radial gradients with various configuration options.

## Usage

```html
<div data-role="gradient-box" 
     data-gradient-type="linear" 
     data-gradient-colors="#ff0000, #0000ff">
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| data-gradient-type | string | "linear" | Type of gradient. Possible values: "linear", "radial" |
| data-gradient-shape | string | "" | Shape of the radial gradient. Possible values: "circle", "ellipse" |
| data-gradient-position | string | "" | Position of the gradient. For linear gradients, it can be a direction like "to bottom", "to right", or an angle like "45deg". For radial gradients, it specifies the center position like "center" or "top left" |
| data-gradient-size | string | "" | Size of the radial gradient. Possible values: "closest-side", "closest-corner", "farthest-side", "farthest-corner" |
| data-gradient-colors | string | "#000, #fff" | Comma-separated list of colors for the gradient |
| data-gradient-repeat | boolean | false | Whether to repeat the gradient |
| data-on-gradient-box-create | function | Metro.noop | Callback function that is called when the gradient box is created |

## API Methods

### Metro.gradientBoxSetup(options)

Global setup for Gradient Box component default options.

```javascript
Metro.gradientBoxSetup({
    gradientType: "radial",
    gradientColors: "#ff0000, #00ff00, #0000ff"
});
```

### changeAttribute(attr, newValue)

This method is called automatically when you change any of the component's data attributes. It updates the gradient according to the new attribute value.

### destroy()

Destroys the component and returns the element.

```javascript
const gradientBox = Metro.getPlugin(element, 'gradient-box');
gradientBox.destroy();
```

## CSS Styling

The Gradient Box component applies the gradient directly to the background property of the element. You can customize the appearance further with CSS:

```css
.gradient-box {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    /* Add any additional styling */
}
```

## Examples

### Linear Gradient

```html
<div data-role="gradient-box" 
     data-gradient-type="linear" 
     data-gradient-position="to right" 
     data-gradient-colors="#ff0000, #0000ff">
</div>
```

### Radial Gradient

```html
<div data-role="gradient-box" 
     data-gradient-type="radial" 
     data-gradient-shape="circle" 
     data-gradient-position="center" 
     data-gradient-size="farthest-corner" 
     data-gradient-colors="#ff0000, #00ff00, #0000ff">
</div>
```

### Repeating Gradient

```html
<div data-role="gradient-box" 
     data-gradient-type="linear" 
     data-gradient-position="45deg" 
     data-gradient-colors="#ff0000, #0000ff, #ff0000" 
     data-gradient-repeat="true">
</div>
```