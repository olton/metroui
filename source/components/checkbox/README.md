# Checkbox Component

The Checkbox component provides a customizable way to create checkboxes with various styles and states. It supports standard HTML checkbox elements with enhanced functionality, including a three-state mode.

## Usage

### Basic Checkboxes

```html
<!-- Standard checkbox -->
<input type="checkbox" data-role="checkbox" data-caption="Standard Checkbox">

<!-- Checked checkbox -->
<input type="checkbox" data-role="checkbox" data-caption="Checked Checkbox" checked>

<!-- Disabled checkbox -->
<input type="checkbox" data-role="checkbox" data-caption="Disabled Checkbox" disabled>

<!-- Disabled and checked checkbox -->
<input type="checkbox" data-role="checkbox" data-caption="Disabled Checked Checkbox" disabled checked>
```

### Three-State Checkboxes

```html
<!-- Three-state checkbox -->
<input type="checkbox" data-role="checkbox" data-three-state="true" data-caption="Three-state Checkbox">

<!-- Alternative three-state checkbox -->
<input type="checkbox" data-role="checkbox-three-state" data-caption="Three-state Checkbox">

<!-- Three-state checkbox with initial state -->
<input type="checkbox" data-role="checkbox-three-state" data-caption="Indeterminate" data-state="indeterminate">
```

### Text Positioning

```html
<!-- Checkbox with text before (prepend) -->
<input type="checkbox" data-role="checkbox" data-prepend="Text before">

<!-- Checkbox with text after (append) -->
<input type="checkbox" data-role="checkbox" data-append="Text after">

<!-- Checkbox with both prepend and append -->
<input type="checkbox" data-role="checkbox" data-prepend="Before" data-append="After">
```

### Custom Styling

```html
<!-- Custom styling with CSS variables -->
<div style="--checkbox-color: #0078d7; --checkbox-border-radius: 0;">
    <input type="checkbox" data-role="checkbox" data-caption="Custom Styled Checkbox">
</div>
```

## Plugin Parameters

The Checkbox component accepts the following parameters:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| checkboxDeferred | number | 0 | Delay in milliseconds before initialization |
| state | number/string | -1 | Initial state: -1/unchecked, 0/indeterminate, 1/checked |
| threeState | boolean | false | Enable three-state mode (checked, unchecked, indeterminate) |
| prepend | string | "" | Text to display before the checkbox |
| append | string | "" | Text to display after the checkbox |
| caption | string | "" | Alternative to append (for backward compatibility) |
| clsCheckbox | string | "" | Additional CSS class for the checkbox container |
| clsCaption | string | "" | Additional CSS class for the caption text |
| clsPrepend | string | "" | Additional CSS class for the prepend text |
| clsAppend | string | "" | Additional CSS class for the append text |
| onCheckboxCreate | function | Metro.noop | Callback function triggered after checkbox creation |

## API Methods

The Checkbox component provides the following API methods:

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| check | - | - | Sets the checkbox to checked state |
| uncheck | - | - | Sets the checkbox to unchecked state |
| indeterminate | - | - | Sets the checkbox to indeterminate state |
| setCheckState | state | this | Sets the checkbox state (-1/unchecked, 0/indeterminate, 1/checked) |
| getCheckState | asString | number/string | Gets the current state (as number or string if asString=true) |
| toggle | - | - | Cycles through states (unchecked → checked → indeterminate) |
| destroy | - | - | Removes the checkbox component |

### Examples

```javascript
// Get checkbox component instance
const checkbox = Metro.getPlugin('#myCheckbox', 'checkbox');

// Set to checked state
checkbox.check();

// Set to unchecked state
checkbox.uncheck();

// Set to indeterminate state
checkbox.indeterminate();

// Toggle state
checkbox.toggle();

// Get current state (as number)
const state = checkbox.getCheckState();

// Get current state (as string)
const stateString = checkbox.getCheckState(true); // Returns "checked", "unchecked", or "indeterminate"
```

## Styling with CSS Variables

The Checkbox component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --checkbox-height | 36px | 36px | Height of the checkbox element |
| --checkbox-border-radius | 4px | 4px | Border radius of the checkbox |
| --checkbox-color | #575757 | #a6a8a7 | Color of the checkbox border and checkmark |
| --checkbox-color-disabled | #c3c3c3 | #505050 | Color of the checkbox when disabled |
| --checkbox-background-disabled | #efefef | #323030 | Background color when disabled |
| --checkbox-focus-color | #e8e8e8 | #191919 | Color of the focus ring |

### Example of Custom Styling

```css
/* Custom styling for checkboxes in a specific container */
.custom-checkboxes {
    --checkbox-color: #0078d7;
    --checkbox-border-radius: 0;
    --checkbox-focus-color: rgba(0, 120, 215, 0.3);
}
```

## Accessibility

The Checkbox component includes proper semantics for improved accessibility:
- Uses native checkbox elements for proper keyboard and screen reader support
- Properly conveys checked, unchecked, and indeterminate states
- Supports disabled state with appropriate styling

## Best Practices

1. Always provide descriptive text for checkboxes using the `data-caption`, `data-prepend`, or `data-append` attributes
2. Use the three-state mode only when an indeterminate state makes sense in your UI
3. Group related checkboxes together for better organization
4. Consider using custom styling to match your application's design system
5. Ensure sufficient contrast between the checkbox and its background for better visibility