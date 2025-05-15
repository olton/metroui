# Button Group Component

The Button Group component provides a way to group related buttons together, creating a unified control that can operate in different selection modes. It's useful for creating toggle buttons, radio-button-like interfaces, or multi-select button groups.

## Usage

### Basic Button Group

```html
<!-- Basic button group with default settings -->
<div data-role="button-group">
    <button>Option 1</button>
    <button>Option 2</button>
    <button>Option 3</button>
</div>
```

### Single Selection Mode (Default)

```html
<!-- Only one button can be active at a time (radio button behavior) -->
<div data-role="button-group" data-mode="one">
    <button>Option 1</button>
    <button class="active">Option 2</button>
    <button>Option 3</button>
</div>
```

### Multiple Selection Mode

```html
<!-- Multiple buttons can be active (checkbox behavior) -->
<div data-role="button-group" data-mode="multi">
    <button>Option 1</button>
    <button class="active">Option 2</button>
    <button class="active">Option 3</button>
</div>
```

### Required Button Selection

```html
<!-- At least one button must be selected -->
<div data-role="button-group" data-required-button="true">
    <button class="active">Option 1</button>
    <button>Option 2</button>
    <button>Option 3</button>
</div>
```

### Custom Target Elements

```html
<!-- Using elements other than buttons -->
<div data-role="button-group" data-targets=".option">
    <span class="option">Option 1</span>
    <span class="option active">Option 2</span>
    <span class="option">Option 3</span>
</div>
```

### Custom Active Class

```html
<!-- Using a custom class for active buttons -->
<div data-role="button-group" data-cls-active="highlighted">
    <button>Option 1</button>
    <button class="active">Option 2</button>
    <button>Option 3</button>
</div>
```

## Configuration Options

The Button Group component can be configured with the following options:

| Option | Default | Description |
| ------ | ------- | ----------- |
| buttongroupDeferred | 0 | Delay in milliseconds before initialization |
| targets | "button" | Selector for elements that should behave as buttons in the group |
| clsActive | "" | Additional CSS class to apply to active buttons |
| requiredButton | false | Whether at least one button must be active |
| mode | Metro.groupMode.ONE | Selection mode: ONE (single selection) or MULTI (multiple selection) |
| onButtonClick | Metro.noop | Event handler triggered when a button is clicked |
| onButtonGroupCreate | Metro.noop | Event handler triggered when the button group is created |

### Global Configuration

You can set global defaults for all Button Group components:

```javascript
Metro.buttonGroupSetup({
    clsActive: "highlighted",
    mode: Metro.groupMode.MULTI
});
```

## Events

The Button Group component provides the following events:

| Event | Description |
| ----- | ----------- |
| onButtonClick | Triggered when a button in the group is clicked |
| onButtonGroupCreate | Triggered when the button group is created |

### Example with Events

```html
<div data-role="button-group" 
     data-on-button-click="onButtonClicked"
     data-on-button-group-create="onGroupCreated">
    <button>Option 1</button>
    <button>Option 2</button>
    <button>Option 3</button>
</div>

<script>
function onButtonClicked(event) {
    console.log("Button clicked:", event.button);
}

function onGroupCreated(event) {
    console.log("Button group created:", event.element);
}
</script>
```

## Styling with CSS Variables

The Button Group component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --button-group-active-background | #989898 | #4b4b4b | Background color of active buttons |
| --button-group-active-color | #fff | #fff | Text color of active buttons |

### Example of Custom Styling

```css
/* Custom styling for a specific button group */
#myCustomButtonGroup {
    --button-group-active-background: #2196F3;
    --button-group-active-color: #FFFFFF;
}
```

## Available CSS Classes

### Base Classes
- `.button-group` - The main container class for the button group

### State Classes
- `.active` - Applied to active buttons within the group
- `.js-active` - Applied to buttons activated via JavaScript

## Accessibility

For better accessibility:
1. Use semantic button elements when possible
2. Ensure there is sufficient color contrast between active and inactive states
3. Consider adding ARIA attributes to clarify the role and state of the button group

## Best Practices

1. Use button groups for related options where users need to make a selection
2. Clearly indicate the active state with visual cues
3. For single-selection mode, consider making one option selected by default
4. Keep the number of options in a button group reasonable (typically 2-5)
5. Use consistent styling for button groups throughout your application