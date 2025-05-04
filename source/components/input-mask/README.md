# Input Mask Component

The Input Mask component provides a way to enforce a specific format for user input in text fields. It helps ensure data consistency by applying a predefined pattern to the input.

## Usage

```html
<!-- Basic usage with a phone number mask -->
<input data-role="input-mask" data-mask="+1 (___) ___-____">

<!-- Date mask -->
<input data-role="input-mask" data-mask="__/__/____" placeholder="DD/MM/YYYY">

<!-- Custom mask with different placeholder -->
<input data-role="input-mask" data-mask="ISBN ___-__-____-___-_" data-mask-placeholder="#">
```

## Configuration Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| maskPattern | "." | Regular expression pattern for allowed characters |
| mask | null | The mask pattern to apply to the input (required) |
| maskPlaceholder | "_" | Character used as a placeholder for editable positions |
| maskEditableStart | 0 | Position where editable characters start |
| thresholdInterval | 300 | Interval in milliseconds for cursor positioning |
| onChar | Metro.noop | Callback function triggered when a character is entered |
| onInputMaskCreate | Metro.noop | Callback function triggered when the component is created |

## JavaScript Usage

```javascript
// Initialize with JavaScript
const inputMask = Metro.getPlugin('#myInput', 'input-mask', {
    mask: "+1 (___) ___-____",
    maskPlaceholder: "_",
    onChar: function(char) {
        // Validate or transform the character
        return char.toUpperCase();
    }
});

// Global setup
Metro.inputMaskSetup({
    maskPlaceholder: "#",
    thresholdInterval: 500
});
```

## API Methods

### destroy()
Removes the input mask functionality from the element and restores its original state.

```javascript
// Get the component instance
const inputMask = Metro.getPlugin('#myInput', 'input-mask');

// Destroy the component
inputMask.destroy();
```

## Events

You can subscribe to events using the Metro 4 event system:

```javascript
// Listen for component creation
$(document).on("input-mask-create", function(event, component){
    console.log("Input mask created for:", component.element);
});
```

## Best Practices

1. Always provide a clear mask pattern that matches the expected input format
2. Consider using a different placeholder character if "_" conflicts with your data
3. Provide visual cues or helper text to show users the expected format
4. For complex input patterns, consider adding example text in a label or placeholder
5. Test your masks with different input scenarios to ensure they work as expected