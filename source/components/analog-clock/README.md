# Analog Clock Component

The Analog Clock component creates a stylish analog clock with customizable features including hour, minute, and second hands, day and month display, digital clock, and moon phase indicator.

## Usage

```html
<!-- Basic usage -->
<div data-role="analog-clock"></div>

<!-- With custom options -->
<div data-role="analog-clock" data-show-numbers="true" data-show-moon="true" data-time-format="12"></div>
```

## Configuration Options

The Analog Clock component can be configured with the following options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| icon | string | null | Custom icon to display on the clock (HTML content) |
| showNumbers | boolean | false | Whether to show numbers on the clock face instead of dashes |
| showMoon | boolean | true | Whether to show the current moon phase |
| showDay | boolean | true | Whether to show the day and month display |
| showDigitalClock | boolean | true | Whether to show the digital clock |
| timeFormat | number | 24 | Time format (12 or 24 hour) |
| onAnalogClockCreate | function | Metro.noop | Callback function triggered when the clock is created |

## API Methods

The Analog Clock component provides the following API methods:

### destroy()

Removes the analog clock component and its associated elements.

```javascript
Metro.getPlugin('#myClock', 'analog-clock').destroy();
```

## Styling with CSS Variables

The Analog Clock component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --analog-clock-size | 300px | 300px | Size of the clock |
| --analog-clock-icon-size | 100px | 100px | Size of the icon |
| --analog-clock-border-color | #6a6a6a | #6a6a6a | Border color of the clock |
| --analog-clock-dash-color | #191919 | #efefef | Color of the hour markers |
| --analog-clock-background | var(--default-background) | var(--default-background) | Background color of the clock |
| --analog-clock-color | var(--default-color) | var(--default-color) | Text color |
| --analog-clock-hour-color | var(--color-dark) | #cdcdcd | Hour hand color |
| --analog-clock-minute-color | var(--color-dark) | #cdcdcd | Minute hand color |
| --analog-clock-second-color | var(--color-red) | var(--color-red) | Second hand color |
| --analog-clock-hand-border-color | #ccc | #efefef | Border color of the hands |
| --analog-clock-inset-border-color | #e6e6e6 | #333333 | Inset border color |
| --analog-clock-inset-shadow | rgba(0,0,0,0.45) | #919191 | Inset shadow color |

### Example of Custom Styling

```css
/* Custom styling for a specific analog clock */
#myCustomClock {
    --analog-clock-size: 400px;
    --analog-clock-hour-color: #2196F3;
    --analog-clock-minute-color: #2196F3;
    --analog-clock-second-color: #FF5722;
}
```

## Additional Information

The Analog Clock component:
- Automatically updates the time every second
- Displays the current day, month, and day of the week when enabled
- Shows the current moon phase when enabled
- Has a "tick" animation that toggles every 500ms
- Adapts to both light and dark themes
- Can display both analog and digital time simultaneously