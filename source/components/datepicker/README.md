# DatePicker Component

The DatePicker component is a wheel-based date picker that allows users to select a date by scrolling through months, days, and years.

## Usage

```html
<input data-role="datepicker">
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| label | string | "" | Label for the datepicker |
| datepickerDeferred | number | 0 | Deferred initialization time in milliseconds |
| gmt | number | 0 | GMT timezone adjustment |
| format | string | "YYYY-MM-DD" | Output date format |
| inputFormat | string | null | Input date format (if different from output format) |
| value | string | null | Initial value for the datepicker |
| distance | number | 3 | Number of visible items before and after the selected item |
| month | boolean | true | Show month selector |
| day | boolean | true | Show day selector |
| year | boolean | true | Show year selector |
| minYear | number | null | Minimum selectable year (defaults to current year - 100) |
| maxYear | number | null | Maximum selectable year (defaults to current year + 100) |
| defaultYearDistance | number | 100 | Default distance for min/max year calculation |
| scrollSpeed | number | 4 | Scrolling speed for the wheel picker |
| copyInlineStyles | boolean | false | Copy inline styles from the input element to the picker |
| openMode | string | "auto" | Mode for opening the picker: "auto", "dialog", or "up" |
| clsPicker | string | "" | Additional CSS class for the picker |
| clsPart | string | "" | Additional CSS class for the date parts |
| clsMonth | string | "" | Additional CSS class for the month element |
| clsDay | string | "" | Additional CSS class for the day element |
| clsYear | string | "" | Additional CSS class for the year element |
| clsLabel | string | "" | Additional CSS class for the label |
| clsButton | string | "" | Additional CSS class for buttons |
| clsOkButton | string | "" | Additional CSS class for the OK button |
| clsCancelButton | string | "" | Additional CSS class for the Cancel button |
| okButtonIcon | string | "✓" | Icon for the OK button |
| cancelButtonIcon | string | "𐄂" | Icon for the Cancel button |

## Events

| Event | Description |
| --- | --- |
| onSet | Triggered when a date is set |
| onOpen | Triggered when the picker is opened |
| onClose | Triggered when the picker is closed |
| onScroll | Triggered when scrolling through the date options |
| onDatePickerCreate | Triggered when the datepicker is created |

## Methods

### open()
Opens the datepicker dropdown.

```javascript
Metro.getPlugin('#my-datepicker', 'datepicker').open();
```

### close()
Closes the datepicker dropdown.

```javascript
Metro.getPlugin('#my-datepicker', 'datepicker').close();
```

### val(value)
Gets or sets the current value of the datepicker.

```javascript
// Get value
const value = Metro.getPlugin('#my-datepicker', 'datepicker').val();

// Set value
Metro.getPlugin('#my-datepicker', 'datepicker').val('2023-01-15');
```

### date(value, format)
Gets or sets the date value with optional format.

```javascript
// Get date
const date = Metro.getPlugin('#my-datepicker', 'datepicker').date();

// Set date with specific format
Metro.getPlugin('#my-datepicker', 'datepicker').date('15/01/2023', 'DD/MM/YYYY');
```

### disable()
Disables the datepicker.

```javascript
Metro.getPlugin('#my-datepicker', 'datepicker').disable();
```

### enable()
Enables the datepicker.

```javascript
Metro.getPlugin('#my-datepicker', 'datepicker').enable();
```

### toggleState()
Toggles the enabled/disabled state of the datepicker.

```javascript
Metro.getPlugin('#my-datepicker', 'datepicker').toggleState();
```

## CSS Variables

The DatePicker component uses the following CSS variables for styling:

| Variable | Description |
| --- | --- |
| --border-color | Border color for the datepicker elements |
| --wheel-picker-border-radius | Border radius for the date wrapper |
| --datepicker-border-radius | Border radius for the action block |

## Customizing with CSS

You can customize the appearance of the DatePicker by overriding the CSS variables:

```css
:root {
  --border-color: #ccc;
  --wheel-picker-border-radius: 4px;
  --datepicker-border-radius: 4px;
}
```

Additional styling can be applied using the provided class options (clsPicker, clsPart, etc.) or by targeting the component's CSS classes:

```css
.date-picker .date-wrapper {
  /* Custom styles for the date wrapper */
}

.date-picker .month {
  /* Custom styles for the month display */
}

.date-picker .day {
  /* Custom styles for the day display */
}

.date-picker .year {
  /* Custom styles for the year display */
}

.date-picker .action-block {
  /* Custom styles for the action buttons area */
}
```

## Dependencies

The DatePicker component depends on:
- WheelPicker component
- Metro UI CSS framework