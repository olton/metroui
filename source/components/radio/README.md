# Radio Component

The Radio component provides an enhanced replacement for the standard HTML radio input element with additional styling and functionality.

## Usage

### Basic Usage

```html
<!-- Basic radio button -->
<input type="radio" data-role="radio" name="group1" value="option1">

<!-- Radio button with label -->
<input type="radio" data-role="radio" name="group1" value="option2" data-caption="Option 2">

<!-- Radio button with prepend and append content -->
<input type="radio" data-role="radio" name="group1" value="option3" 
       data-prepend="Before" data-append="After">
```

### Radio Button Groups

```html
<!-- Radio button group -->
<div class="form-group">
    <label>Select an option:</label>
    <div>
        <input type="radio" data-role="radio" name="options" value="1" data-caption="Option 1" checked>
    </div>
    <div>
        <input type="radio" data-role="radio" name="options" value="2" data-caption="Option 2">
    </div>
    <div>
        <input type="radio" data-role="radio" name="options" value="3" data-caption="Option 3">
    </div>
</div>
```

### Colored Radio Buttons

```html
<!-- Colored radio buttons -->
<input type="radio" class="radio-primary" data-role="radio" name="colors" value="1" data-caption="Primary">
<input type="radio" class="radio-success" data-role="radio" name="colors" value="2" data-caption="Success">
<input type="radio" class="radio-warning" data-role="radio" name="colors" value="3" data-caption="Warning">
<input type="radio" class="radio-alert" data-role="radio" name="colors" value="4" data-caption="Alert">
<input type="radio" class="radio-info" data-role="radio" name="colors" value="5" data-caption="Info">
```

## Configuration Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| radioDeferred | 0 | Deferred initialization time in milliseconds |
| prepend | "" | Content to prepend to the radio button |
| append | "" | Content to append to the radio button |
| caption | "" | Caption text for the radio button |
| clsRadio | "" | Additional CSS class for the radio container |
| clsCaption | "" | Additional CSS class for the caption |
| clsPrepend | "" | Additional CSS class for the prepend content |
| clsAppend | "" | Additional CSS class for the append content |
| onRadioCreate | Metro.noop | Callback function triggered when the component is created |

## JavaScript Usage

```javascript
// Initialize with JavaScript
const radio = Metro.getPlugin('#myRadio', 'radio', {
    caption: "My Radio Option",
    prepend: "<span class='mif-star'></span>",
    onRadioCreate: function() {
        console.log("Radio created!");
    }
});

// Global setup
Metro.metroRadioSetup({
    clsRadio: "custom-radio",
    clsCaption: "custom-caption"
});
```

## API Methods

### check()
Checks the radio button.

```javascript
const radio = Metro.getPlugin('#myRadio', 'radio');
radio.check();
```

### uncheck()
Unchecks the radio button.

```javascript
const radio = Metro.getPlugin('#myRadio', 'radio');
radio.uncheck();
```

### setCheckState(state)
Sets the check state of the radio button.

```javascript
const radio = Metro.getPlugin('#myRadio', 'radio');
radio.setCheckState(true); // Check
radio.setCheckState(false); // Uncheck
```

### getCheckState(asString)
Gets the current check state of the radio button.

```javascript
const radio = Metro.getPlugin('#myRadio', 'radio');
const state = radio.getCheckState(); // Returns true or false
const stateString = radio.getCheckState(true); // Returns "checked" or "unchecked"
```

### toggle()
Toggles the check state of the radio button.

```javascript
const radio = Metro.getPlugin('#myRadio', 'radio');
radio.toggle();
```

### destroy()
Destroys the component and restores the original radio element.

```javascript
const radio = Metro.getPlugin('#myRadio', 'radio');
radio.destroy();
```

## Styling with CSS Variables

The Radio component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --radio-height | 36px | 36px | Height of the radio component |
| --radio-color | #575757 | #a6a8a7 | Color of the radio button |
| --radio-color-disabled | #c3c3c3 | #505050 | Color of the disabled radio button |
| --radio-background-disabled | #efefef | #323030 | Background color of the disabled radio button |
| --radio-focus-color | #e8e8e8 | #191919 | Focus outline color |

### Example of Custom Styling

```css
/* Custom styling for a specific radio button */
#myCustomRadio {
    --radio-color: #3f51b5;
    --radio-focus-color: rgba(63, 81, 181, 0.3);
}

/* Custom styling for a group of radio buttons */
.custom-radio-group input[type=radio] {
    --radio-height: 30px;
    --radio-color: #009688;
}
```

## Accessibility

The Radio component includes proper semantics for improved accessibility:
- Maintains proper focus states
- Uses standard HTML radio input elements for proper keyboard navigation
- Preserves the original radio element for form submission

## Best Practices

1. Always use the same `name` attribute for radio buttons that belong to the same group
2. Provide clear, descriptive captions for each radio option
3. Use colored radio buttons consistently to represent the same meanings throughout your application
4. Group related radio buttons together using fieldset and legend for better accessibility
5. Consider using the prepend or append options to add icons for better visual recognition