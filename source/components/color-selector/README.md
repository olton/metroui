# Color Selector Component

The Color Selector is a comprehensive color picking component that allows users to select colors in various formats (HEX, RGB, RGBA, HSL, HSLA, HSV, CMYK). It provides a visual interface with color maps, hue and alpha sliders, and predefined color swatches.

## Usage

```html
<div data-role="color-selector"></div>
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| defaultSwatches | String | "#FFFFFF,#000000,#FFFB0D,#0532FF,#FF9300,#00F91A,#FF2700,#686868,#EE5464,#D27AEE,#5BA8C4,#E64AA9,#1ba1e2,#6a00ff,#bebebe,#f8f8f8" | Comma-separated list of default color swatches |
| userColors | String | null | Comma-separated list of user-defined colors |
| returnValueType | String | "hex" | Format of the returned color value (hex, rgb, rgba, hsl, hsla, hsv, cmyk) |
| returnAsString | Boolean | true | If true, returns color as a string; if false, returns a color object |
| showValues | String | "hex, rgb, rgba, hsl, hsla, hsv, cmyk" | Comma-separated list of color formats to display |
| showAsString | String | null | Comma-separated list of color formats to display as strings |
| showUserColors | Boolean | true | If true, shows the user colors section |
| controller | String | null | Selector for an input element to be used as a controller |
| addUserColorTitle | String | null | Title for the "Add User Color" button |
| userColorsTitle | String | null | Title for the user colors section |
| hslMode | String | "percent" | Mode for HSL values display ("percent" or numeric) |
| showAlphaChannel | Boolean | true | If true, shows the alpha channel slider |
| inputThreshold | Number | 300 | Debounce threshold for input changes in milliseconds |
| initColor | String | null | Initial color value |
| readonlyInput | Boolean | false | If true, makes color value inputs readonly |
| clsSelector | String | "" | Additional CSS class for the selector element |
| clsSwatches | String | "" | Additional CSS class for the swatches container |
| clsSwatch | String | "" | Additional CSS class for individual swatches |
| clsValue | String | "" | Additional CSS class for color value elements |
| clsLabel | String | "" | Additional CSS class for labels |
| clsInput | String | "" | Additional CSS class for input elements |
| clsUserColorButton | String | "" | Additional CSS class for the user color button |
| clsUserColors | String | "" | Additional CSS class for the user colors container |
| clsUserColorsTitle | String | "" | Additional CSS class for the user colors title |
| clsUserColor | String | "" | Additional CSS class for user color elements |
| onSelectColor | Function | Metro.noop | Callback function triggered when a color is selected |
| onColorSelectorCreate | Function | Metro.noop | Callback function triggered when the color selector is created |

## API Methods

### val(value)

Gets or sets the current color value.

```javascript
// Get current color value
var color = $("#colorSelector").data("color-selector").val();

// Set color value
$("#colorSelector").data("color-selector").val("#FF0000");
```

### user(colors)

Gets or sets the user colors.

```javascript
// Get user colors
var userColors = $("#colorSelector").data("color-selector").user();

// Set user colors
$("#colorSelector").data("color-selector").user("#FF0000,#00FF00,#0000FF");
// or
$("#colorSelector").data("color-selector").user(["#FF0000", "#00FF00", "#0000FF"]);
```

### getVal()

Gets the current color value in the format specified by `returnValueType`.

```javascript
var color = $("#colorSelector").data("color-selector").getVal();
```

## Events

| Event | Description |
|-------|-------------|
| onSelectColor | Triggered when a color is selected |
| onColorSelectorCreate | Triggered when the color selector is created |

## CSS Variables

The Color Selector component can be styled using CSS variables:

| Variable | Description |
|----------|-------------|
| --color-selector-background | Background color of the color selector (default: var(--default-background)) |

## Styling with CSS

You can customize the appearance of the Color Selector component using CSS classes:

```css
/* Custom styling for the color selector */
.color-selector {
    /* Your custom styles */
}

/* Dark mode styling */
.dark-side .color-selector {
    /* Dark mode styles */
}
```

## Example

```html
<div id="colorSelector" data-role="color-selector" 
     data-return-value-type="hex"
     data-show-alpha-channel="true"
     data-init-color="#3498db">
</div>

<script>
    // Get the selected color
    var color = $("#colorSelector").data("color-selector").val();
    
    // Set a new color
    $("#colorSelector").data("color-selector").val("#FF5733");
    
    // Listen for color selection events
    $("#colorSelector").on("select-color", function(e, data) {
        console.log("Selected color:", data.color);
        console.log("Color primitives:", data.primitive);
    });
</script>
```