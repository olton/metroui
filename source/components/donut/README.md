# Donut Component

The Donut component is a circular progress indicator that displays a percentage or value in a donut-shaped chart. It's useful for visualizing progress, completion rates, or any numerical data in a compact and visually appealing way.

## Usage

### Basic Donut

```html
<!-- Basic donut with default settings -->
<div data-role="donut"></div>

<!-- Donut with custom value -->
<div data-role="donut" data-value="75"></div>

<!-- Donut with custom colors -->
<div data-role="donut" data-value="50" data-fill="#1ba1e2" data-stroke="#e3e3e3"></div>
```

### Customizing Size and Appearance

```html
<!-- Larger donut -->
<div data-role="donut" data-size="200" data-value="65"></div>

<!-- Custom hole size (smaller hole) -->
<div data-role="donut" data-hole="0.5" data-value="40"></div>

<!-- Hide percentage text -->
<div data-role="donut" data-show-text="false" data-value="80"></div>

<!-- Show actual value instead of percentage -->
<div data-role="donut" data-show-value="true" data-value="42" data-total="100"></div>

<!-- Custom value cap (unit) -->
<div data-role="donut" data-value="75" data-cap="°C"></div>
```

### Animated Donut

```html
<!-- Animated donut (animation duration in milliseconds) -->
<div data-role="donut" data-value="60" data-animate="1000"></div>
```

### Color Variants

```html
<!-- Using predefined color classes -->
<div data-role="donut" class="donut-primary" data-value="75"></div>
<div data-role="donut" class="donut-success" data-value="85"></div>
<div data-role="donut" class="donut-alert" data-value="25"></div>
<div data-role="donut" class="donut-warning" data-value="65"></div>
<div data-role="donut" class="donut-info" data-value="50"></div>

<!-- Using standard color classes -->
<div data-role="donut" class="donut-red" data-value="30"></div>
<div data-role="donut" class="donut-green" data-value="70"></div>
<div data-role="donut" class="donut-blue" data-value="45"></div>
<div data-role="donut" class="donut-yellow" data-value="90"></div>
```

## Plugin Parameters

The Donut component accepts the following configuration parameters:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `size` | number | 100 | The size of the donut in pixels (width and height) |
| `hole` | number | 0.8 | The size of the hole as a ratio (0-1) of the donut's radius |
| `value` | number | 0 | The current value to display |
| `background` | string | "transparent" | Background color of the donut |
| `color` | string | "" | Text color (defaults to fill color if not specified) |
| `stroke` | string | "#d1d8e7" | Color of the background circle |
| `fill` | string | "#49649f" | Color of the value circle |
| `fontSize` | number | 0 | Font size for the text (0 means auto-calculated) |
| `total` | number | 100 | The total value (maximum) |
| `cap` | string | "%" | The unit or symbol to display after the value |
| `showText` | boolean | true | Whether to show the text in the center |
| `showValue` | boolean | false | Whether to show the actual value instead of percentage |
| `animate` | number | 0 | Animation duration in milliseconds (0 means no animation) |

## API Methods

The Donut component provides the following API methods:

### val(value)

Gets or sets the current value of the donut.

```javascript
// Get current value
var currentValue = $("#myDonut").data("donut").val();

// Set new value
$("#myDonut").data("donut").val(75);
```

### setColor(colorObject)

Updates the colors of the donut.

```javascript
// Change colors
$("#myDonut").data("donut").setColor({
    background: "#ffffff",
    fill: "#3498db",
    stroke: "#e3e3e3",
    color: "#333333"
});
```

### changeValue()

Updates the donut value based on the data-value attribute.

```javascript
// Update the data-value attribute
$("#myDonut").attr("data-value", 80);

// Apply the new value
$("#myDonut").data("donut").changeValue();
```

## Styling with CSS Variables

The Donut component uses SVG for rendering and can be styled using CSS classes. The component doesn't directly use CSS variables, but you can customize its appearance using the plugin parameters or by applying color classes.

## Available CSS Classes

### Color Classes

#### Standard Colors
Apply these classes to use predefined color schemes:

- `.donut-lime`, `.donut-green`, `.donut-emerald`, `.donut-blue`, `.donut-teal`, `.donut-cyan`
- `.donut-cobalt`, `.donut-indigo`, `.donut-violet`, `.donut-pink`, `.donut-magenta`
- `.donut-crimson`, `.donut-red`, `.donut-orange`, `.donut-amber`, `.donut-yellow`
- `.donut-brown`, `.donut-olive`, `.donut-steel`, `.donut-mauve`, `.donut-taupe`
- `.donut-khaki`, `.donut-charcoal`, `.donut-bronze`, `.donut-windstorm`
- `.donut-nude`, `.donut-terracotta`, `.donut-coral`, `.donut-army`, `.donut-seashell`, `.donut-sand`

#### Accent Colors
Apply these classes to use accent color schemes:

- `.donut-primary` - Primary brand color
- `.donut-secondary` - Secondary brand color
- `.donut-success` - Success indicator color
- `.donut-alert` - Alert/error indicator color
- `.donut-warning` - Warning indicator color
- `.donut-info` - Information indicator color
- `.donut-dark` - Dark theme color
- `.donut-light` - Light theme color

## Best Practices

1. Choose an appropriate size for your donut based on where it will be displayed
2. Use consistent colors throughout your application for similar metrics
3. Consider using animation for a more engaging user experience
4. Provide context for the value being displayed (through labels or surrounding content)
5. For small donuts, consider hiding the text to avoid crowding