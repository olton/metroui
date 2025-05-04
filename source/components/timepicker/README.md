# Time Picker Component

Time Picker component allows users to select time values (hours, minutes, seconds) using wheel-based interface with customizable steps and formats.

## Usage

```html
<!-- Basic usage -->
<input data-role="time-picker">

<!-- With custom options -->
<input data-role="time-picker" data-hours-step="2" data-minutes-step="5" data-seconds="false">
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | String | `""` | Label text for the time picker |
| `timepickerDeferred` | Number | `0` | Defer initialization of component in milliseconds |
| `hoursStep` | Number | `1` | Step value for hours (1-23) |
| `minutesStep` | Number | `1` | Step value for minutes (1-59) |
| `secondsStep` | Number | `1` | Step value for seconds (1-59) |
| `value` | String/Object | `null` | Initial value for time picker |
| `distance` | Number | `3` | Number of visible elements before and after selection |
| `hours` | Boolean | `true` | Display hours |
| `minutes` | Boolean | `true` | Display minutes |
| `seconds` | Boolean | `true` | Display seconds |
| `showLabels` | Boolean | `true` | Show labels for hours, minutes and seconds |
| `scrollSpeed` | Number | `4` | Scroll speed for wheel selection |
| `copyInlineStyles` | Boolean | `false` | Copy inline styles from original input to component |
| `openMode` | String | `"auto"` | Mode for opening dropdown: "auto", "dialog" or "up" |
| `clsPicker` | String | `""` | Additional class for time picker element |
| `clsPart` | String | `""` | Additional class for each time part |
| `clsHours` | String | `""` | Additional class for hours element |
| `clsMinutes` | String | `""` | Additional class for minutes element |
| `clsSeconds` | String | `""` | Additional class for seconds element |
| `clsLabel` | String | `""` | Additional class for label element |
| `clsButton` | String | `""` | Additional class for buttons |
| `clsOkButton` | String | `""` | Additional class for OK button |
| `clsCancelButton` | String | `""` | Additional class for Cancel button |
| `okButtonIcon` | String | `"✓"` | Icon for OK button |
| `cancelButtonIcon` | String | `"𐄂"` | Icon for Cancel button |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `onSet` | `{val, elementVal}` | Triggered when time is set |
| `onOpen` | `{val}` | Triggered when time picker is opened |
| `onClose` | `{val}` | Triggered when time picker is closed |
| `onScroll` | `{target, list, picker}` | Triggered when scrolling time lists |
| `onTimePickerCreate` | `{element}` | Triggered after time picker component creation |

## API Methods

### val([value])

Gets or sets the current time as string (format: "HH:MM:SS").

```javascript
// Get current value
var timepicker = $("#my-timepicker").data("timepicker");
var currentValue = timepicker.val();

// Set new value
timepicker.val("14:30:00");
```

### time([value])

Gets or sets the current time as object with h, m, s properties.

```javascript
// Get current time as object
var timepicker = $("#my-timepicker").data("timepicker");
var timeObj = timepicker.time();  // returns {h: 14, m: 30, s: 0}

// Set new time from object
timepicker.time({h: 15, m: 45, s: 30});
```

### date([value])

Gets or sets the current time using Date object.

```javascript
// Get current time as Date object
var timepicker = $("#my-timepicker").data("timepicker");
var dateObj = timepicker.date();

// Set time from Date object
var date = new Date();
date.setHours(10);
date.setMinutes(20);
timepicker.date(date);
```

### open()

Opens the time picker dropdown.

```javascript
var timepicker = $("#my-timepicker").data("timepicker");
timepicker.open();
```

### close()

Closes the time picker dropdown.

```javascript
var timepicker = $("#my-timepicker").data("timepicker");
timepicker.close();
```

### disable()

Disables the time picker component.

```javascript
var timepicker = $("#my-timepicker").data("timepicker");
timepicker.disable();
```

### enable()

Enables the time picker component.

```javascript
var timepicker = $("#my-timepicker").data("timepicker");
timepicker.enable();
```

### toggleState()

Toggles between enabled and disabled states.

```javascript
var timepicker = $("#my-timepicker").data("timepicker");
timepicker.toggleState();
```

### destroy()

Destroys the component and returns the element to its original state.

```javascript
var timepicker = $("#my-timepicker").data("timepicker");
timepicker.destroy();
```

## Global Configuration

You can globally configure the time picker component using the `Metro.timePickerSetup` method:

```javascript
Metro.timePickerSetup({
    hoursStep: 2,
    minutesStep: 5,
    seconds: false,
    showLabels: true
});
```

## CSS Variables

The time picker component uses the following CSS variables that you can customize:

| Variable | Default | Description |
| --- | --- | --- |
| `--border-color` | `#e4e4e4` | Border color for various elements |
| `--wheel-picker-border-radius` | `4px` | Border radius for the time picker |
| `--datepicker-border-radius` | `4px` | Border radius for action block |

Example of customizing CSS variables:

```css
:root {
    --wheel-picker-border-radius: 8px;
}
```

## Time Format Examples

```html
<!-- Hours and minutes only -->
<input data-role="time-picker" data-seconds="false">

<!-- With custom steps -->
<input data-role="time-picker" data-hours-step="2" data-minutes-step="15" data-seconds-step="30">

<!-- With initial value -->
<input data-role="time-picker" data-value="14:30:00">
```

## Dialog Mode

You can set the dropdown to always open as a dialog, which is useful for mobile devices:

```html
<input data-role="time-picker" data-open-mode="dialog">
```
