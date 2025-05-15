# Custom Checkbox Component

The Custom Checkbox component provides a highly customizable checkbox that allows you to define custom icons and captions for checked and unchecked states. It's designed to be flexible and easy to style.

## Usage

### Basic Usage

```html
<input type="checkbox" data-role="custom-checkbox">
```

### With Custom States

```html
<input type="checkbox" data-role="custom-checkbox" 
       data-state-on="✓" 
       data-state-off="✗">
```

### With Custom Captions

```html
<input type="checkbox" data-role="custom-checkbox" 
       data-caption-on="Enabled" 
       data-caption-off="Disabled">
```

### With Caption Position

```html
<input type="checkbox" data-role="custom-checkbox" 
       data-caption-on="Enabled" 
       data-caption-off="Disabled"
       data-caption-position="left">
```

## Configuration Options

The Custom Checkbox component can be configured with the following options:

| Option | Default | Description |
| ------ | ------- | ----------- |
| `stateOn` | "☑" | Symbol or HTML for the checked state |
| `stateOff` | "☐" | Symbol or HTML for the unchecked state |
| `captionOn` | "" | Text displayed when checkbox is checked |
| `captionOff` | "" | Text displayed when checkbox is unchecked |
| `captionPosition` | "right" | Position of the caption ("right" or "left") |
| `clsCustomCheckbox` | "" | Additional CSS class for the checkbox container |
| `clsIcon` | "" | Additional CSS class for the icon element |
| `clsIconOn` | "" | Additional CSS class for the checked state icon |
| `clsIconOff` | "" | Additional CSS class for the unchecked state icon |
| `clsCaption` | "" | Additional CSS class for the caption element |
| `clsCaptionOn` | "" | Additional CSS class for the checked state caption |
| `clsCaptionOff` | "" | Additional CSS class for the unchecked state caption |
| `onCustomCheckboxCreate` | Metro.noop | Callback function executed after checkbox creation |

## API Methods

The Custom Checkbox component provides the following API methods:

| Method | Description |
| ------ | ----------- |
| `disable()` | Disables the checkbox |
| `enable()` | Enables the checkbox |
| `toggleState()` | Toggles between enabled and disabled states |
| `toggle([value])` | Toggles the checked state. If `value` is provided (0 or 1), sets the state accordingly |

### Examples

```javascript
// Get the component instance
const checkbox = Metro.getPlugin('#myCheckbox', 'custom-checkbox');

// Disable the checkbox
checkbox.disable();

// Enable the checkbox
checkbox.enable();

// Toggle the checked state
checkbox.toggle();

// Set to checked state
checkbox.toggle(1);

// Set to unchecked state
checkbox.toggle(0);
```

## Styling with CSS Variables

The Custom Checkbox component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--custom-checkbox-size` | 36px | 36px | Size of the checkbox |
| `--custom-checkbox-icon-size` | 16px | 16px | Size of the icon |
| `--custom-checkbox-color` | #575757 | rgb(166, 166, 166) | Color of the checkbox |
| `--custom-checkbox-background` | transparent | transparent | Background of the checkbox |
| `--custom-checkbox-caption-color` | #191919 | #e8e8e8 | Color of the caption |
| `--custom-checkbox-background-disabled` | #e8e8e8 | #353535 | Background when disabled |
| `--custom-checkbox-color-disabled` | #c3c3c3 | #6c6c6c | Color when disabled |

### Example of Custom Styling

```css
/* Custom styling for a specific checkbox */
#myCustomCheckbox {
    --custom-checkbox-size: 42px;
    --custom-checkbox-icon-size: 20px;
    --custom-checkbox-color: #2196F3;
    --custom-checkbox-caption-color: #0D47A1;
}
```

## Global Configuration

You can set global defaults for all Custom Checkbox components using:

```javascript
Metro.customCheckboxSetup({
    stateOn: "✓",
    stateOff: "✗",
    captionPosition: "left"
});
```

## Accessibility

The Custom Checkbox component maintains the native checkbox element's accessibility features:
- It preserves the native checkbox's functionality while enhancing its appearance
- It respects the disabled state of the checkbox
- It uses proper label elements for better screen reader support

## Best Practices

1. Use meaningful icons that clearly indicate the checked and unchecked states
2. Provide clear captions when the checkbox's purpose might not be obvious from context
3. Maintain sufficient contrast between the checkbox and its background for better visibility
4. Consider using the left caption position when checkboxes are aligned to the right side of a form