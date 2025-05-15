# Keypad Component

The Keypad component provides a customizable numeric or custom keypad for input fields. It's useful for creating secure PIN inputs, numeric entry fields, or custom key-based inputs.

## Usage

```html
<input data-role="keypad">
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| keypadDeferred | number | 0 | Deferred initialization time in milliseconds |
| label | string | "" | Label text for the keypad |
| keySize | number | 36 | Size of each key in pixels |
| keys | string | "1, 2, 3, 4, 5, 6, 7, 8, 9, 0" | Keys to display, separated by keyDelimiter |
| exceptKeys | string | "" | Keys to exclude from input, separated by keyDelimiter |
| keySeparator | string | "" | Separator between keys in the input value |
| trimSeparator | boolean | false | If true, separators will be trimmed from the final value |
| keyDelimiter | string | "," | Delimiter used to separate keys in the keys parameter |
| copyInlineStyles | boolean | false | If true, copies inline styles from the input to the keypad |
| target | string | null | Target element to receive the keypad value |
| keyLength | number | 0 | Maximum length of input (0 for unlimited) |
| shuffle | boolean | false | If true, shuffles the keys on initialization |
| shuffleCount | number | 3 | Number of times to shuffle the keys |
| serviceButtons | boolean | true | If true, shows service buttons (clear, backspace) |
| showValue | boolean | true | If true, shows the value in the input field |
| open | boolean | false | If true, the keypad is open by default |
| useElementSizeForKeys | boolean | false | If true, uses the element size for the keypad width |
| openMode | string | "auto" | Mode for opening the keypad ("auto" or "up") |
| clsKeypad | string | "" | Additional CSS class for the keypad |
| clsInput | string | "" | Additional CSS class for the input element |
| clsKeys | string | "" | Additional CSS class for the keys container |
| clsKey | string | "" | Additional CSS class for each key |
| clsServiceKey | string | "" | Additional CSS class for service keys |
| clsBackspace | string | "" | Additional CSS class for the backspace key |
| clsClear | string | "" | Additional CSS class for the clear key |
| clsLabel | string | "" | Additional CSS class for the label |

## Methods

### shuffle()
Shuffles the keys.

```javascript
var keypad = Metro.getPlugin('#my-keypad', 'keypad');
keypad.shuffle();
```

### shuffleKeys(count)
Shuffles the keys a specified number of times.

```javascript
var keypad = Metro.getPlugin('#my-keypad', 'keypad');
keypad.shuffleKeys(5); // Shuffle 5 times
```

### val(v)
Gets or sets the value of the keypad.

```javascript
var keypad = Metro.getPlugin('#my-keypad', 'keypad');
// Get value
var value = keypad.val();
// Set value
keypad.val("1234");
```

### open()
Opens the keypad.

```javascript
var keypad = Metro.getPlugin('#my-keypad', 'keypad');
keypad.open();
```

### close()
Closes the keypad.

```javascript
var keypad = Metro.getPlugin('#my-keypad', 'keypad');
keypad.close();
```

### disable()
Disables the keypad.

```javascript
var keypad = Metro.getPlugin('#my-keypad', 'keypad');
keypad.disable();
```

### enable()
Enables the keypad.

```javascript
var keypad = Metro.getPlugin('#my-keypad', 'keypad');
keypad.enable();
```

### setPosition(pos)
Sets the position of the keypad.

```javascript
var keypad = Metro.getPlugin('#my-keypad', 'keypad');
keypad.setPosition("bottom-right");
```

### destroy()
Destroys the keypad component.

```javascript
var keypad = Metro.getPlugin('#my-keypad', 'keypad');
keypad.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onChange | Triggered when the value changes |
| onClear | Triggered when the clear button is pressed |
| onBackspace | Triggered when the backspace button is pressed |
| onShuffle | Triggered when the keys are shuffled |
| onKey | Triggered when a key is pressed |
| onKeypadCreate | Triggered when the keypad is created |

## CSS Variables

The Keypad component can be styled using the following CSS variables:

| Variable | Default (Light) | Default (Dark) | Description |
| --- | --- | --- | --- |
| --keypad-background | var(--input-background) | var(--input-background) | Background color of the keypad |
| --keypad-color | var(--input-color) | var(--input-color) | Text color of the keypad |
| --keypad-border-color | #E8E8E8 | #4A4D51 | Border color of the keypad |
| --keypad-border-radius | 4px | 4px | Border radius of the keypad |

## Examples

### Basic Keypad
```html
<input data-role="keypad">
```

### Custom Keys
```html
<input data-role="keypad" data-keys="A, B, C, D, E, F">
```

### PIN Input with Shuffled Keys
```html
<input data-role="keypad" data-shuffle="true" data-key-length="4" data-label="Enter PIN">
```

### Custom Styling
```css
.my-custom-keypad {
    --keypad-background: #f0f0f0;
    --keypad-color: #333;
    --keypad-border-color: #999;
    --keypad-border-radius: 8px;
}
```

```html
<input data-role="keypad" class="my-custom-keypad">
```

## Available CSS Classes

### Base Classes
- `.keypad` - Base class for the component
- `.keys` - Container for the keypad keys
- `.key` - Individual key

### Position Classes
- `.right` - Positions the keypad to the right
- `.bottom` - Positions the keypad to the bottom
- `.top` - Positions the keypad to the top
- `.left` - Positions the keypad to the left
- `.bottom-left` - Positions the keypad to the bottom-left
- `.bottom-right` - Positions the keypad to the bottom-right
- `.top-left` - Positions the keypad to the top-left
- `.top-right` - Positions the keypad to the top-right

### State Classes
- `.open` - Applied when the keypad is open
- `.disabled` - Applied when the keypad is disabled