# Spinner Component

The Spinner component provides a numeric input field with increment and decrement buttons, allowing users to easily adjust numeric values.

## Usage

```html
<input data-role="spinner" data-default-value="0" data-step="1">
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| spinnerDeferred | number | 0 | Deferred initialization time in milliseconds |
| label | string | "" | Label for the spinner |
| step | number | 1 | Step value for increment/decrement |
| plusIcon | string | "+" | Icon for the increment button |
| minusIcon | string | "-" | Icon for the decrement button |
| buttonsPosition | string | "default" | Position of the buttons: "default", "left", or "right" |
| defaultValue | number | 0 | Default value for the spinner |
| minValue | number | null | Minimum allowed value |
| maxValue | number | null | Maximum allowed value |
| fixed | number | 0 | Number of decimal places |
| repeatThreshold | number | 2000 | Threshold for repeating increment/decrement when button is held |
| hideCursor | boolean | false | Whether to hide the cursor in the input field |
| clsSpinner | string | "" | Additional CSS class for the spinner container |
| clsSpinnerInput | string | "" | Additional CSS class for the input element |
| clsSpinnerButton | string | "" | Additional CSS class for both buttons |
| clsSpinnerButtonPlus | string | "" | Additional CSS class for the increment button |
| clsSpinnerButtonMinus | string | "" | Additional CSS class for the decrement button |
| clsLabel | string | "" | Additional CSS class for the label |

## Events

| Event | Description |
| --- | --- |
| onBeforeChange | Triggered before the value changes (return false to cancel) |
| onChange | Triggered when the value changes |
| onPlusClick | Triggered when the plus button is clicked |
| onMinusClick | Triggered when the minus button is clicked |
| onArrowUp | Triggered when the up arrow key is pressed |
| onArrowDown | Triggered when the down arrow key is pressed |
| onButtonClick | Triggered when any button is clicked |
| onArrowClick | Triggered when any arrow key is pressed |
| onSpinnerCreate | Triggered when the spinner is created |

## Methods

### val(value)

Gets or sets the current value of the spinner.

```javascript
// Get value
const value = Metro.getPlugin('#my-spinner', 'spinner').val();

// Set value
Metro.getPlugin('#my-spinner', 'spinner').val(10);
```

### disable()

Disables the spinner.

```javascript
Metro.getPlugin('#my-spinner', 'spinner').disable();
```

### enable()

Enables the spinner.

```javascript
Metro.getPlugin('#my-spinner', 'spinner').enable();
```

### toggleState()

Toggles the enabled/disabled state of the spinner.

```javascript
Metro.getPlugin('#my-spinner', 'spinner').toggleState();
```

## CSS Variables

The Spinner component can be styled using the following CSS variables:

| Variable | Default | Description |
| --- | --- | --- |
| --spinner-border-radius | 4px | Border radius for the spinner |

## Styling with CSS

You can customize the appearance of the Spinner by overriding the CSS variables:

```css
:root {
  --spinner-border-radius: 8px;
}
```

### Size Variants

The Spinner component supports different sizes:

- Default size: No additional class
- Large size: Add `input-large` class
- Small size: Add `input-small` class

```html
<input data-role="spinner" class="input-large">
<input data-role="spinner">
<input data-role="spinner" class="input-small">
```

### Button Positions

You can change the position of the buttons:

- Default: Minus on the left, plus on the right, input in the middle
- Left: Both buttons on the left, input on the right
- Right: Both buttons on the right, input on the left

```html
<input data-role="spinner" data-buttons-position="default">
<input data-role="spinner" data-buttons-position="left">
<input data-role="spinner" data-buttons-position="right">
```

## Dependencies

The Spinner component depends on:
- Input Common component
- Button component