# WheelPicker Component

The WheelPicker component provides a wheel-based selection mechanism that allows users to scroll through a list of options. It is primarily used as a dependency for other components like DatePicker and TimePicker.

## Usage

The WheelPicker is typically not used directly but is integrated into other components. However, it can be styled using CSS variables.

## CSS Variables

The WheelPicker component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --wheel-picker-border-radius | 4px | 4px | Border radius for the wheel picker |
| --wheel-picker-color | #191919 | #dbdfe7 | Text color for the wheel picker options |
| --wheel-picker-selected-background | rgba(175, 175, 175, 0.5) | rgba(78, 81, 88, 0.5) | Background color for the selected option |

## Styling with CSS

You can customize the appearance of the WheelPicker by overriding the CSS variables:

```css
:root {
  --wheel-picker-border-radius: 6px;
  --wheel-picker-color: #333;
  --wheel-picker-selected-background: rgba(0, 123, 255, 0.3);
}
```

### Component Structure

The WheelPicker has the following structure:

```html
<div class="wheel-picker">
  <div class="select-wrapper">
    <div class="select-block">
      <ul>
        <!-- Options go here -->
        <li>Option 1</li>
        <li class="active">Option 2</li>
        <li>Option 3</li>
      </ul>
    </div>
    <div class="action-block">
      <!-- Action buttons go here -->
    </div>
  </div>
</div>
```

### Additional Classes

The WheelPicker supports the following additional classes:

- `drop-up-select`: Positions the dropdown above the input
- `drop-as-dialog`: Displays the picker as a dialog

## Dependencies

The WheelPicker component is used by:
- DatePicker component
- TimePicker component