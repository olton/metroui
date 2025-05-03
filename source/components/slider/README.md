# Slider Component

The Slider component provides an interactive way to select a value or range of values within a specified min-max range. It supports both horizontal and vertical orientations, with customizable appearance and behavior.

## Usage

### Basic Slider

```html
<!-- Basic slider -->
<input data-role="slider">

<!-- Slider with min and max values -->
<input data-role="slider" data-min="0" data-max="100" data-value="50">

<!-- Vertical slider -->
<input data-role="slider" data-vertical="true" style="height: 200px;">
```

### Slider with Buffer

```html
<!-- Slider with buffer -->
<input data-role="slider" data-buffer="25">
```

### Slider with Hint

```html
<!-- Slider with hint -->
<input data-role="slider" data-hint="true">

<!-- Slider with always visible hint -->
<input data-role="slider" data-hint="true" data-hint-always="true">

<!-- Slider with custom hint mask -->
<input data-role="slider" data-hint="true" data-hint-mask="$1%">
```

### Slider Sizes and Styles

```html
<!-- Thin slider -->
<input data-role="slider" class="thin">

<!-- Ultra-thin slider -->
<input data-role="slider" class="ultra-thin">

<!-- Rounded slider -->
<input data-role="slider" class="rounded">
```

## Plugin Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `min` | number | 0 | Minimum value of the slider |
| `max` | number | 100 | Maximum value of the slider |
| `accuracy` | number | 0 | Number of decimal places for the value |
| `value` | number | 0 | Initial value of the slider |
| `buffer` | number | 0 | Buffer value (secondary indicator) |
| `hint` | boolean | false | Show hint with current value |
| `hintAlways` | boolean | false | Always show the hint (not only during interaction) |
| `hintPosition` | string | "top" | Position of the hint (top, bottom, left, right) |
| `hintMask` | string | "$1" | Mask for formatting the hint value |
| `vertical` | boolean | false | Use vertical orientation |
| `showMinMax` | boolean | false | Show min and max values |
| `minMaxPosition` | string | "top" | Position of min/max labels |
| `target` | string | null | Target element to update with the slider value |
| `returnType` | string | "value" | Type of value to return ("value" or "percent") |
| `roundValue` | boolean | true | Round the value to the specified accuracy |
| `size` | number | 0 | Custom size for the slider |

## API Methods

### Get Value
```javascript
// Get current value
var value = $('#my-slider').data('slider').val();
```

### Set Value
```javascript
// Set value
$('#my-slider').data('slider').val(75);
```

### Get Buffer
```javascript
// Get buffer value
var buffer = $('#my-slider').data('slider').buff();
```

### Set Buffer
```javascript
// Set buffer value
$('#my-slider').data('slider').buff(50);
```

## Events

| Event | Description |
| ----- | ----------- |
| `onStart` | Triggered when slider interaction starts |
| `onStop` | Triggered when slider interaction stops |
| `onMove` | Triggered during slider movement |
| `onSliderClick` | Triggered when clicking on the slider |
| `onChange` | Triggered when slider value changes |
| `onChangeValue` | Triggered when slider value changes |
| `onChangeBuffer` | Triggered when buffer value changes |
| `onFocus` | Triggered when slider receives focus |
| `onBlur` | Triggered when slider loses focus |
| `onSliderCreate` | Triggered when slider is created |

## Styling with CSS Variables

The Slider component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--slider-thumb-size` | 18px | 18px | Size of the slider thumb |
| `--slider-thumb-color` | var(--color-blue) | var(--color-crimson) | Color of the slider thumb |
| `--slider-bar-color` | #191919 | #191919 | Color of the slider bar |
| `--slider-buffer-color` | #fefefe | #fefefe | Color of the buffer part |
| `--slider-back-color` | #d5d5d5 | #4e5055 | Background color of the slider |
| `--slider-fill-color` | var(--color-cyan) | #ff145c | Color of the filled part |
| `--slider-thumb-border-color` | var(--color-light-cyan) | #ffffff | Border color of the thumb |

### Example of Custom Styling

```css
/* Custom styling for a specific slider */
#my-custom-slider {
    --slider-thumb-size: 24px;
    --slider-thumb-color: #e91e63;
    --slider-fill-color: #f48fb1;
    --slider-back-color: #f8bbd0;
    --slider-thumb-border-color: #c2185b;
}
```

## Available CSS Classes

### Base Classes
- `.slider` - Standard slider

### Size Modifiers
- `.thin` - Thinner slider bar
- `.ultra-thin` - Ultra-thin slider bar

### Shape Modifiers
- `.rounded` - Slider with rounded corners
- `.cycle-marker` - Circular marker

### Orientation
- `.vertical-slider` - Vertical orientation

### State Classes
- `.disabled` - Disabled slider