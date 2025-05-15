# Hotkey Component

The Hotkey component provides functionality for handling keyboard shortcuts (hotkeys) in your Metro UI application. It allows you to bind specific key combinations to elements or functions, making your application more accessible and user-friendly.

## Usage

### Basic Usage

```javascript
// Bind a hotkey to an element
$("#myButton").hotkey("ctrl+s", function(e, pressedKey, definedKey) {
    console.log("Ctrl+S was pressed!");
    // Your action here
});

// Bind a hotkey to a link
$("a.save-link").hotkey("ctrl+s");
```

### Global Hotkeys

```javascript
// Define a global hotkey
Metro.hotkeys["ctrl+g"] = ["#globalAction", function() {
    console.log("Global hotkey Ctrl+G was triggered");
}];
```

## Configuration Options

The Hotkey component can be configured globally through the following options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| METRO_HOTKEYS_FILTER_INPUT_ACCEPTING_ELEMENTS | Boolean | true | When true, hotkeys won't trigger when focus is on form elements like inputs, textareas, and selects |
| METRO_HOTKEYS_FILTER_CONTENT_EDITABLE | Boolean | true | When true, hotkeys won't trigger when focus is on elements with contenteditable attribute |
| METRO_HOTKEYS_FILTER_TEXT_INPUTS | Boolean | true | When true, hotkeys won't trigger when focus is on text input types |

## API Methods

### hotkey(key, callback)

Binds a keyboard shortcut to an element.

**Parameters:**
- `key` (String): The key combination to bind (e.g., "ctrl+s", "alt+shift+f")
- `callback` (Function, optional): The function to execute when the hotkey is triggered
  - Parameters passed to callback:
    - `event`: The original keyboard event
    - `pressedKey`: The actual key combination that was pressed
    - `definedKey`: The key combination that was defined in the binding

**Example:**
```javascript
$("#saveButton").hotkey("ctrl+s", function(e, pressedKey, definedKey) {
    // Save action
    console.log("Hotkey pressed:", pressedKey);
    e.preventDefault(); // Prevent default browser behavior if needed
});
```

## Supported Keys

### Special Keys
The component supports various special keys including:
- Navigation: up, down, left, right, home, end, pageup, pagedown
- Function keys: f1-f12
- Control keys: backspace, tab, return/enter, shift, ctrl, alt, esc, space, insert, del
- Others: capslock, numlock, scroll, meta

### Key Combinations
You can combine keys using the "+" symbol:
- `ctrl+s`
- `alt+shift+f`
- `ctrl+alt+delete`

### Repeat Prevention
By default, the component prevents repeated triggering when a key is held down. For global hotkeys, you can enable repeat by adding the `data-repeat` attribute to the target element.

## Notes

1. When binding hotkeys to anchor (`<a>`) elements:
   - If the anchor has an href attribute, clicking the hotkey will navigate to that URL
   - If no callback is provided, the default behavior is to follow the href or trigger a click

2. The component automatically filters hotkey events when typing in form elements to prevent interference with normal typing.