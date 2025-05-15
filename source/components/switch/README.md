# Switch Component

The Switch component provides a toggle switch control that can be used as an alternative to checkboxes. It supports both standard and material design styles, with customizable appearance and behavior.

## Usage

### Basic Switch

```html
<!-- Basic switch -->
<input type="checkbox" data-role="switch">

<!-- Switch with labels -->
<input type="checkbox" data-role="switch" data-prepend="Off" data-append="On">

<!-- Material design switch -->
<input type="checkbox" data-role="switch" data-material="true">
```

### Switch with On/Off Text

```html
<!-- Switch with on/off text -->
<input type="checkbox" data-role="switch" data-onoff="true">

<!-- Switch with custom on/off text -->
<input type="checkbox" data-role="switch" data-onoff="true" data-on="YES" data-off="NO">
```

### Switch States

```html
<!-- Checked switch -->
<input type="checkbox" data-role="switch" checked>

<!-- Disabled switch -->
<input type="checkbox" data-role="switch" disabled>

<!-- Readonly switch -->
<input type="checkbox" data-role="switch" readonly>
```

### Colored Switches

```html
<!-- Primary colored switch -->
<input type="checkbox" data-role="switch" class="switch-primary">

<!-- Success colored switch -->
<input type="checkbox" data-role="switch" class="switch-success">

<!-- Warning colored switch -->
<input type="checkbox" data-role="switch" class="switch-warning">

<!-- Alert colored switch -->
<input type="checkbox" data-role="switch" class="switch-alert">
```

## Plugin Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `material` | boolean | false | Use material design style |
| `prepend` | string | "" | Text to display before the switch |
| `append` | string | "" | Text to display after the switch |
| `onoff` | boolean | false | Show on/off text on the switch |
| `on` | string | "" | Custom text for the "on" state (when onoff is true) |
| `off` | string | "" | Custom text for the "off" state (when onoff is true) |
| `showOnOff` | boolean | false | Alternative way to show on/off text |
| `clsSwitch` | string | "" | Additional CSS class for the switch container |
| `clsCheck` | string | "" | Additional CSS class for the checkbox element |
| `clsCaption` | string | "" | Additional CSS class for caption elements |

## API Methods

### Toggle Switch

```javascript
// Toggle the switch state
$('#my-switch').data('switch').toggle();

// Set switch to specific state (1 = on, 0 = off)
$('#my-switch').data('switch').toggle(1); // Turn on
$('#my-switch').data('switch').toggle(0); // Turn off
```

## Events

| Event | Description |
| ----- | ----------- |
| `onSwitchCreate` | Triggered when switch is created |

## Styling with CSS Variables

The Switch component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--switch-background` | #e9e9e9 | #232527 | Background color of the switch in off state |
| `--switch-background-checked` | #191919 | #474748 | Background color of the switch in on state |
| `--switch-background-disabled` | #e8e8e8 | #e8e8e8 | Background color when disabled |
| `--switch-toggle-color` | #fff | #fff | Color of the toggle button |
| `--switch-toggle-disabled` | #ccc | #3e4145 | Color of the toggle when disabled |
| `--switch-text-color` | #000 | #efefef | Color of the text in off state |
| `--switch-text-color-checked` | #fff | #fff | Color of the text in on state |
| `--switch-focus-color` | #e8e8e8 | #191919 | Color of the focus ring |

### Example of Custom Styling

```css
/* Custom styling for a specific switch */
#my-custom-switch {
    --switch-background: #f0f0f0;
    --switch-background-checked: #2196F3;
    --switch-toggle-color: #ffffff;
    --switch-text-color: #333333;
    --switch-text-color-checked: #ffffff;
}
```

## Available CSS Classes

### Base Classes
- `.switch` - Standard switch container

### Style Modifiers
- `.material` - Material design style switch

### Color Classes
- `.switch-primary` - Primary colored switch
- `.switch-secondary` - Secondary colored switch
- `.switch-success` - Success colored switch
- `.switch-warning` - Warning colored switch
- `.switch-alert` - Alert colored switch
- `.switch-info` - Info colored switch

## Accessibility

The Switch component uses standard checkbox inputs with proper styling, ensuring good accessibility:
- Works with keyboard navigation (Tab to focus, Space to toggle)
- Supports standard disabled and readonly attributes
- Maintains proper focus states for keyboard users