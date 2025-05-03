# File Input Component

The File Input component provides a customizable interface for file selection in web applications. It offers three different modes: standard input, button, and drop zone, allowing for flexible integration into various UI designs.

## Usage

```html
<input type="file" data-role="file-input">
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| fileDeferred | number | 0 | Deferred initialization time in milliseconds |
| label | string | "" | Label text for the input |
| mode | string | "input" | Component mode: "input", "button", or "drop-zone" |
| buttonTitle | string | "" | Text for the select files button (defaults to "Choose file" if empty) |
| filesSelectedTitle | string | "" | Text template for selected files count (use {n} as placeholder for number of files) |
| dropTitle | string | "" | Text for the drop zone (defaults to "Drop files here" if empty) |
| dropIcon | string | "📥" | Icon for the drop zone |
| clearButtonIcon | string | "❌" | Icon for the clear button |
| prepend | string | "" | HTML to prepend to the input |
| clsComponent | string | "" | Additional CSS class for the component |
| clsPrepend | string | "" | Additional CSS class for the prepend element |
| clsButton | string | "" | Additional CSS class for the button |
| clsCaption | string | "" | Additional CSS class for the caption |
| clsLabel | string | "" | Additional CSS class for the label |
| onSelect | function | Metro.noop | Callback function triggered when files are selected |
| onFileCreate | function | Metro.noop | Callback function triggered when the component is created |

## API Methods

### clear()
Clears the selected files.

```javascript
var fileInput = $(selector).data('file');
fileInput.clear();
```

### disable()
Disables the component.

```javascript
var fileInput = $(selector).data('file');
fileInput.disable();
```

### enable()
Enables the component.

```javascript
var fileInput = $(selector).data('file');
fileInput.enable();
```

### toggleState()
Toggles between enabled and disabled states.

```javascript
var fileInput = $(selector).data('file');
fileInput.toggleState();
```

### toggleDir()
Toggles RTL direction.

```javascript
var fileInput = $(selector).data('file');
fileInput.toggleDir();
```

## Events

| Event | Description |
| --- | --- |
| onSelect | Triggered when files are selected |
| onFileCreate | Triggered when the component is created |

## CSS Variables

The File Input component can be customized using the following CSS variables:

### Light Theme Variables

```css
:root {
    --file-height: 36px;
    --file-button-background: #ebebeb;
    --file-button-background-hover: #dadada;
    --file-button-color: #191919;
    
    --file-drop-zone-border-size: 4px;
    --file-drop-zone-border-type: dashed;
    --file-drop-zone-border-color: #858585;
    --file-drop-zone-background: #f5f5f5;
    --file-drop-zone-color: #191919;
    --file-drop-zone-hover-color: darken(#3A3A3A, 20%);
    --file-drop-zone-drop-color: #94ff6a;
}
```

### Dark Theme Variables

```css
.dark-side {
    --file-button-background: #3a3b40;
    --file-button-background-hover: #484850;
    --file-button-color: #f3fcff;

    --file-drop-zone-border-size: 4px;
    --file-drop-zone-border-type: dashed;
    --file-drop-zone-border-color: #858585;
    --file-drop-zone-background: #2b2d30;
    --file-drop-zone-color: #dbdfe7;
    --file-drop-zone-hover-color: #dbdfe7;
    --file-drop-zone-drop-color: #94ff6a;
}
```

## Styling

### Standard Input Mode
The standard input mode displays a text field with a button for file selection.

### Button Mode
The button mode displays only a button for file selection.

### Drop Zone Mode
The drop zone mode displays a designated area where users can drag and drop files.

### RTL Support
The component supports right-to-left text direction. Add the `dir="rtl"` attribute to enable RTL mode.

### Small Input Variant
Add the `input-small` class to create a smaller version of the file input.

## Examples

### Standard Input Mode
```html
<input type="file" data-role="file-input">
```

### Button Mode
```html
<input type="file" data-role="file-input" data-mode="button">
```

### Drop Zone Mode
```html
<input type="file" data-role="file-input" data-mode="drop-zone">
```

### With Custom Label
```html
<input type="file" data-role="file-input" data-label="Upload Document">
```

### Multiple File Selection
```html
<input type="file" multiple data-role="file-input">
```

### With Custom Button Text
```html
<input type="file" data-role="file-input" data-button-title="Browse Files">
```