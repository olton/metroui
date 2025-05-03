# Select Component

The Select component provides an enhanced replacement for the standard HTML select element with additional features like filtering, custom styling, multiple selection with tags, and remote data loading.

## Usage

### Basic Usage

```html
<!-- Basic select -->
<select data-role="select">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
</select>

<!-- With option groups -->
<select data-role="select">
    <optgroup label="Group 1">
        <option value="1.1">Option 1.1</option>
        <option value="1.2">Option 1.2</option>
    </optgroup>
    <optgroup label="Group 2">
        <option value="2.1">Option 2.1</option>
        <option value="2.2">Option 2.2</option>
    </optgroup>
</select>

<!-- Multiple selection -->
<select data-role="select" multiple>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
</select>
```

### Advanced Usage

```html
<!-- With filter -->
<select data-role="select" data-filter="true">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
</select>

<!-- With placeholder -->
<select data-role="select" data-placeholder="Select an option" data-use-placeholder="true">
    <option value=""></option>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
</select>

<!-- With remote data source -->
<select data-role="select" data-source="/api/options"></select>
```

## Configuration Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| id | "" | Component ID |
| label | "" | Label for the select |
| size | "normal" | Size of the select (normal, small, large) |
| selectDeferred | 0 | Deferred initialization time in milliseconds |
| clearButton | false | Show clear button |
| clearButtonIcon | "❌" | Icon for clear button |
| usePlaceholder | false | Use placeholder text |
| placeholder | "" | Placeholder text |
| addEmptyValue | false | Add empty value option |
| emptyValue | "" | Value for empty option |
| duration | 0 | Duration of dropdown animation |
| prepend | "" | Content to prepend to select |
| append | "" | Content to append to select |
| filterPlaceholder | "" | Placeholder for filter input |
| filter | false | Enable filtering |
| dropHeight | 200 | Maximum height of dropdown |
| dropWidth | null | Width of dropdown |
| dropFullSize | false | Make dropdown full width |
| openMode | "auto" | Dropdown open mode (auto, click, hover) |
| showGroupName | false | Show group name in selected item |
| shortTag | true | Limit tag width to 120px |
| source | null | URL for remote data source |
| sourceMethod | "GET" | HTTP method for remote data |
| sourceType | "json" | Data type for remote data |
| filterSource | null | URL for filtered remote data |
| filterThreshold | 500 | Debounce time for filter input |

### CSS Classes Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| clsSelect | "" | Class for select container |
| clsSelectInput | "" | Class for select input |
| clsPrepend | "" | Class for prepend element |
| clsAppend | "" | Class for append element |
| clsOption | "" | Class for option |
| clsOptionActive | "" | Class for active option |
| clsOptionGroup | "" | Class for option group |
| clsDropList | "" | Class for dropdown list |
| clsDropContainer | "" | Class for dropdown container |
| clsSelectedItem | "" | Class for selected item |
| clsSelectedItemAction | "" | Class for selected item action |
| clsLabel | "" | Class for label |
| clsGroupName | "" | Class for group name |
| clsFilterInput | "" | Class for filter input |

### Callback Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| onClear | Metro.noop | Triggered when select is cleared |
| onChange | Metro.noop | Triggered when selection changes |
| onUp | Metro.noop | Triggered when dropdown closes |
| onDrop | Metro.noop | Triggered when dropdown opens |
| onItemSelect | Metro.noop | Triggered when item is selected |
| onItemDeselect | Metro.noop | Triggered when item is deselected |
| onSelectCreate | Metro.noop | Triggered when component is created |
| onData | (f) => f | Function to process data from remote source |

## API Methods

### disable()
Disables the select component.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
select.disable();
```

### enable()
Enables the select component.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
select.enable();
```

### toggleState()
Toggles between enabled and disabled states.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
select.toggleState();
```

### reset(toDefault)
Resets the selection to default or clears it.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
select.reset(); // Clear selection
select.reset(true); // Reset to default selected options
```

### getSelected()
Returns an array of selected values.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
const selectedValues = select.getSelected();
```

### val(value)
Gets or sets the selected value(s).

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
// Get value
const currentValue = select.val();
// Set value
select.val('option1');
// Set multiple values
select.val(['option1', 'option2']);
```

### data(options, selected, delimiter)
Sets options from an object or string.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
// Set options from object
select.data({
    '1': 'Option 1',
    '2': 'Option 2',
    '3': 'Option 3'
}, '1,3'); // Select options 1 and 3
```

### addOption(value, title, selected)
Adds a single option.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
select.addOption('new-option', 'New Option', true);
```

### addOptions(values)
Adds multiple options.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
select.addOptions([
    { val: '1', title: 'Option 1', selected: true },
    { val: '2', title: 'Option 2' }
]);
```

### removeOption(value)
Removes an option by value.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
select.removeOption('option-to-remove');
```

### removeOptions(values)
Removes multiple options by values.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
select.removeOptions(['option1', 'option2']);
```

### fetch(source, options, clearOptions)
Fetches options from a remote source.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
select.fetch('/api/options', { method: 'GET' }, true);
```

### destroy()
Destroys the component and restores the original select element.

```javascript
const select = Metro.getPlugin('#mySelect', 'select');
select.destroy();
```

## Styling with CSS Variables

The Select component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --select-focus-color | rgba(211,211,211,0.45) | rgba(211,211,211,0.2) | Focus outline color |
| --select-disabled-color | #ccc | #ccc | Color for disabled state |
| --select-options-background | #ffffff | #2b2d30 | Background color for options list |
| --select-options-color | #191919 | #dbdfe7 | Text color for options list |
| --select-option-background | transparent | transparent | Background color for option |
| --select-option-color | inherit | inherit | Text color for option |
| --select-option-background-hover | rgba(29,29,29,0.1) | #43454a | Background color for option on hover |
| --select-option-color-hover | inherit | #ffffff | Text color for option on hover |
| --select-option-background-selected | #e8e8e8 | #43454a | Background color for selected option |
| --select-option-color-selected | #191919 | #ffffff | Text color for selected option |
| --select-button-background | transparent | transparent | Background color for buttons |
| --select-button-color | #191919 | #dbdfe7 | Text color for buttons |
| --select-dropdown-toggle-color | #191919 | #ffffff | Color for dropdown toggle |
| --select-group-title-background | #f6f7f8 | #1e1f22 | Background color for group titles |
| --select-group-title-color | #646464 | #646464 | Text color for group titles |
| --select-tag-background | #f6f7f8 | #2b2d30 | Background color for tags |
| --select-tag-color | #191919 | #dbdfe7 | Text color for tags |
| --select-tag-button-background | #f6f7f8 | #2b2d30 | Background color for tag buttons |
| --select-tag-button-color | #191919 | #dbdfe7 | Text color for tag buttons |
| --select-border-radius | 4px | 4px | Border radius for select elements |

### Example of Custom Styling

```css
/* Custom styling for a specific select */
#myCustomSelect {
    --select-options-background: #f0f8ff;
    --select-option-background-hover: #e1f5fe;
    --select-option-color-hover: #0277bd;
    --select-option-background-selected: #b3e5fc;
    --select-option-color-selected: #01579b;
    --select-tag-background: #e1f5fe;
    --select-tag-color: #0277bd;
}
```

## Accessibility

The Select component includes proper semantics for improved accessibility:
- Maintains proper focus states
- Supports keyboard navigation
- Includes proper ARIA attributes
- Preserves the original select element for form submission

## Best Practices

1. Use clear, descriptive option text to help users make selections
2. Enable filtering for selects with many options
3. Group related options using optgroup for better organization
4. Provide a placeholder when the selection is optional
5. Use multiple select with tags for selecting multiple related items
6. Consider using remote data loading for very large option sets