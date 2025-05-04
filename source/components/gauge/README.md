# Gauge Component

The Gauge component provides a customizable analog gauge visualization for displaying numeric values within a specified range. It's perfect for dashboards, monitoring interfaces, and any application that needs to display values in a visually intuitive way.

## Usage

### Basic Gauge

```html
<!-- Basic gauge with default settings -->
<div data-role="gauge"></div>

<!-- Gauge with custom min, max, and value -->
<div data-role="gauge" data-min="0" data-max="200" data-value="75"></div>

<!-- Gauge with custom size and label -->
<div data-role="gauge" data-size="300" data-label="Speed" data-suffix=" km/h"></div>
```

### Gauge with Custom Labels

```html
<!-- Gauge with min/max labels -->
<div data-role="gauge" 
     data-min="0" 
     data-max="100" 
     data-value="65" 
     data-label-min="Low" 
     data-label-max="High" 
     data-label="Pressure">
</div>
```

### Gauge with Custom Segments and Values

```html
<!-- Gauge with custom segments and value marks -->
<div data-role="gauge" 
     data-segments="5" 
     data-values="0,25,50,75,100" 
     data-value="42">
</div>
```

### Themed Gauges

```html
<!-- Gauge with predefined theme -->
<div data-role="gauge" data-theme="speed" data-value="75"></div>

<!-- Other available themes -->
<div data-role="gauge" data-theme="load" data-value="75"></div>
<div data-role="gauge" data-theme="sky" data-value="75"></div>
<div data-role="gauge" data-theme="temp" data-value="75"></div>
<div data-role="gauge" data-theme="battery" data-value="75"></div>
<div data-role="gauge" data-theme="rainbow" data-value="75"></div>
```

## Plugin Parameters

The Gauge component accepts the following configuration options:

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| min | 0 | Minimum value of the gauge |
| max | 100 | Maximum value of the gauge |
| value | 0 | Current value to display on the gauge |
| size | 0 | Size of the gauge in pixels (0 means it will use container size) |
| labelMin | "" | Label to display at the minimum value position |
| labelMax | "" | Label to display at the maximum value position |
| label | "" | Main label displayed below the value |
| suffix | "" | Text to append after the value (e.g., "%", "°C") |
| values | 10 | Number of value marks to display or comma-separated list of specific values |
| segments | 10 | Number of segments to divide the gauge into |
| startAngle | 235 | Starting angle of the gauge in degrees |
| range | 250 | Angular range of the gauge in degrees |
| theme | "" | Predefined theme to apply (load, sky, temp, speed, battery, rainbow) |
| onGaugeCreate | Metro.noop | Callback function triggered after gauge creation |

## API Methods

The Gauge component provides the following API methods:

### val(value)
Get or set the current value of the gauge.

```javascript
// Get current value
const currentValue = $("#myGauge").data("gauge").val();

// Set new value
$("#myGauge").data("gauge").val(75);
```

### update()
Update the gauge display after changing options.

```javascript
// Update the gauge after changing options
const gauge = $("#myGauge").data("gauge");
gauge.options.max = 200;
gauge.update();
```

### destroy()
Remove the gauge component from the DOM.

```javascript
// Destroy the gauge
$("#myGauge").data("gauge").destroy();
```

## Styling with CSS Variables

The Gauge component can be styled using the following CSS variables:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| --analog-gauge-start-angle | 235deg | Starting angle of the gauge |
| --analog-gauge-range | 250deg | Angular range of the gauge |
| --analog-gauge-needle-height | 10cqi | Height of the needle |
| --analog-gauge-needle-color | #4b4b4b | Color of the needle |
| --analog-gauge-segment-color | #ddd | Color of the gauge segments |
| --analog-gauge-marks-color | #191919 | Color of the value marks |
| --analog-gauge-value-color | #191919 | Color of the displayed value |
| --analog-gauge-label-color | #191919 | Color of the labels |
| --analog-gauge-values-bg | transparent | Background color of the values area |
| --analog-gauge-bdw | 10cqi | Width of the gauge border |
| --analog-gauge-value-mark-w | 6ch | Width of the value marks |
| --analog-gauge-segments-w | 1deg | Width of the segments |
| --analog-gauge-segments | 10 | Number of segments |

### Dark Mode Variables

When using the `.dark-side` class, the following variables are applied:

```css
.dark-side {
    --analog-gauge-needle-color: #e3e3e3;
    --analog-gauge-segment-color: #222;
    --analog-gauge-marks-color: #cfcfcf;
    --analog-gauge-value-color: #FFF;
    --analog-gauge-label-color: #FFF;
}
```

### Example of Custom Styling

```css
/* Custom styling for a specific gauge */
#myCustomGauge {
    --analog-gauge-needle-color: #ff5722;
    --analog-gauge-segment-color: #e0e0e0;
    --analog-gauge-marks-color: #2196f3;
    --analog-gauge-value-color: #4caf50;
    --analog-gauge-label-color: #9c27b0;
    --analog-gauge-bdw: 15cqi;
}
```

## Available Themes

The Gauge component comes with several predefined themes that can be applied using the `data-theme` attribute or the `theme` option:

- **load**: A gradient from green to red, suitable for load indicators
- **sky**: A blue gradient theme
- **temp**: A blue to red gradient, suitable for temperature gauges
- **speed**: A blue to green gradient that fills based on the current value
- **battery**: A red to green gradient with thicker border, suitable for battery indicators
- **rainbow**: A full-spectrum rainbow gradient with thick border

## Best Practices

1. Choose an appropriate theme based on the type of data you're displaying
2. Use clear and concise labels to indicate what the gauge is measuring
3. Set appropriate min and max values to ensure the gauge accurately represents your data
4. Consider using the suffix parameter to add units to your displayed value
5. For better readability, limit the number of value marks to avoid overcrowding