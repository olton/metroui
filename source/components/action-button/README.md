# Action Button Component

The Action Button component creates a floating action button with expandable sub-actions. When the main button is clicked, it reveals a set of additional action buttons arranged in a circular pattern around the main button.

## Usage

```html
<div data-role="action-button">
    <button class="rotate">
        <span class="icon mif-plus"></span>
    </button>
    <ul class="actions">
        <li><span class="icon mif-home"></span></li>
        <li><span class="icon mif-user"></span></li>
        <li><span class="icon mif-cog"></span></li>
        <li><span class="icon mif-search"></span></li>
    </ul>
</div>
```

## Configuration Options

The Action Button component can be configured with the following options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| onClick | function | Metro.noop | Callback function triggered when the main button is clicked |
| onActionClick | function | Metro.noop | Callback function triggered when a sub-action is clicked |
| onActionButtonCreate | function | Metro.noop | Callback function triggered when the action button is created |

## API Methods

The Action Button component provides the following API methods:

### destroy()

Removes the action button component and its associated elements.

```javascript
Metro.getPlugin('#myActionButton', 'action-button').destroy();
```

## Styling with CSS Variables

The Action Button component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --action-button-background | #ebebeb | #2b2d30 | Background color of the buttons |
| --action-button-color | #191919 | #f3fcff | Text/icon color of the buttons |

### Example of Custom Styling

```css
/* Custom styling for a specific action button */
#myCustomActionButton {
    --action-button-background: #2196F3;
    --action-button-color: #ffffff;
}
```

## Additional Information

The Action Button component:
- Creates a circular main button with expandable sub-actions
- Supports up to 8 sub-actions by default, but can accommodate more
- Can rotate the main button icon when activated by adding the "rotate" class
- Automatically calculates the position of each sub-action based on the total number of actions
- Closes when clicking outside the component