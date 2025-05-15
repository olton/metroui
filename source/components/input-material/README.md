# Material Input Component

The Material Input component provides a stylish, Material Design-inspired text input with floating labels, animations, and various button options.

## Usage

```html
<div data-role="material-input">
    <input type="text" placeholder="Enter your text">
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| materialInputDeferred | number | 0 | Deferred initialization time in milliseconds |
| label | string | "" | Label text for the input |
| informer | string | "" | Informational text displayed below the input |
| icon | string | "" | Icon to display with the input |
| permanentLabel | boolean | false | If true, the label will always be visible |
| searchButton | boolean | false | If true, displays a search button |
| clearButton | boolean | true | If true, displays a clear button |
| revealButton | boolean | true | If true, displays a reveal button for password inputs |
| clearButtonIcon | string | "❌" | Icon for the clear button |
| revealButtonIcon | string | "👀" | Icon for the reveal button |
| searchButtonIcon | string | "🔍" | Icon for the search button |
| customButtons | array | [] | Array of custom button configurations |
| searchButtonClick | string | "submit" | Action for search button click ("submit" or custom) |
| clsComponent | string | "" | Additional CSS class for the component |
| clsInput | string | "" | Additional CSS class for the input element |
| clsLabel | string | "" | Additional CSS class for the label |
| clsInformer | string | "" | Additional CSS class for the informer |
| clsIcon | string | "" | Additional CSS class for the icon |
| clsLine | string | "" | Additional CSS class for the underline |

## Methods

### clear()
Clears the input value.

```javascript
var input = Metro.getPlugin('#my-input', 'material-input');
input.clear();
```

### disable()
Disables the input.

```javascript
var input = Metro.getPlugin('#my-input', 'material-input');
input.disable();
```

### enable()
Enables the input.

```javascript
var input = Metro.getPlugin('#my-input', 'material-input');
input.enable();
```

### toggleState()
Toggles between enabled and disabled states.

```javascript
var input = Metro.getPlugin('#my-input', 'material-input');
input.toggleState();
```

### destroy()
Destroys the component.

```javascript
var input = Metro.getPlugin('#my-input', 'material-input');
input.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onInputCreate | Triggered when the input is created |
| clear-click | Triggered when the clear button is clicked |
| reveal-click | Triggered when the reveal button is clicked |
| search-button-click | Triggered when the search button is clicked |
| enter-click | Triggered when Enter key is pressed |

## CSS Variables

The Material Input component can be styled using the following CSS variables:

| Variable | Default (Light) | Default (Dark) | Description |
| --- | --- | --- | --- |
| --material-input-border-color | var(--border-color) | var(--border-color) | Border color of the input |
| --material-input-border-color-hover | #cacaca | #686c71 | Border color on hover/focus |
| --material-input-color | #191919 | #dbdfe7 | Text color of the input |
| --material-input-placeholder-color | #bdbdbd | #dbdfe7 | Placeholder text color |

## Example

```html
<div data-role="material-input" data-label="Username" data-informer="Enter your username">
    <input type="text" placeholder="Username">
</div>
```

## Custom Styling Example

```css
.my-custom-input {
    --material-input-border-color: #3498db;
    --material-input-border-color-hover: #2980b9;
    --material-input-color: #333;
    --material-input-placeholder-color: #95a5a6;
}
```

```html
<div data-role="material-input" class="my-custom-input" data-label="Username">
    <input type="text" placeholder="Username">
</div>
```

## Available CSS Classes

### Base Classes
- `.input-material` - Base class for the component

### State Modifiers
- `.focused` - Applied when the input is focused
- `.invalid` - Applied when the input is invalid
- `.valid` - Applied when the input is valid
- `.disabled` - Applied when the input is disabled

### Style Modifiers
- `.with-icon` - Adds space for an icon
- `.full-size` - Makes the input take full width
- `.permanent-label` - Makes the label always visible