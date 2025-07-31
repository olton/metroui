# Select

The Select component provides a customizable dropdown selection interface that enhances the standard HTML select element with advanced features like filtering, multiple selection, icons, option groups, and remote data loading.

## Dependencies

- Input Common component
- Input component
- Dropdown component
- Tag component
- Button component
- Button Group component

## Usage

### Basic Usage

```html
<select data-role="select">
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
</select>
```

### Select with Icons

```html
<select data-role="select">
    <option data-icon="<span class='mif-rocket'>" value="rocket">Rocket</option>
    <option data-icon="<span class='mif-star-empty'>" value="star">Star</option>
    <option data-icon="<img src='images/flag.svg' alt=''/>" value="flag" selected>Flag</option>
</select>
```

### Multiple Selection

```html
<select data-role="select" multiple data-clear-button="true">
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
</select>
```

### Select with Option Groups

```html
<select data-role="select" data-show-group-name="true">
    <optgroup label="Group 1">
        <option value="g1-option1">Group 1 Option 1</option>
        <option value="g1-option2">Group 1 Option 2</option>
    </optgroup>
    <optgroup label="Group 2">
        <option value="g2-option1">Group 2 Option 1</option>
        <option value="g2-option2">Group 2 Option 2</option>
    </optgroup>
</select>
```

### Select with Filtering

```html
<select data-role="select" data-filter="true" data-filter-placeholder="Search options...">
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
</select>
```

### Select with Remote Data

```html
<select data-role="select" 
        data-source="data/options.json" 
        data-source-method="GET">
</select>
```

#### Format of Remote Data
The remote data should be in JSON format, structured as follows:

```json
[
    {"value": "1", "text": "Option 1"},
    {"value": "2", "text": "Option 2", "icon": "<span class='mif-star'></span>"},
    {"value": "3", "text": "Option 3", "icon": "<img src='images/icon.svg' alt=''/>"},
    {"value": "3", "text": "Option 3"},
    {"value": "4", "text": "Option 4", "selected": true}
]
```

:::caution
Option groups are not supported in remote data sources!
:::

#### Transforming Remote Data
You can transform the remote data using a callback function specified in the `data-on-data` attribute.
This function should return an array of options in the format expected by the Select component.

```html
<select data-role="select" id="select" 
        data-filter="true" 
        data-source="https://dummyjson.com/products" 
        data-filter-source="https://dummyjson.com/products/search?q=" 
        data-on-data="updateData"></select>

<script>
    function updateData(data){
        const products = [...data.products]
        const result = []
        for (const p of products) {
            result.push({
                value: p.id,
                text: p.title
            })
        }
        return result
    }
</script>
```

## Plugin Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `id` | string | "" | Custom ID for the select element |
| `label` | string | "" | Label text for the select |
| `size` | string | "normal" | Size of the select (small, medium, normal, large, largest) |
| `selectDeferred` | number | 0 | Delay in milliseconds before processing selection |
| `clearButton` | boolean | false | Show clear button to reset selection |
| `clearButtonIcon` | string | "❌" | Icon for the clear button |
| `usePlaceholder` | boolean | false | Use placeholder text when no option is selected |
| `placeholder` | string | "" | Placeholder text |
| `addEmptyValue` | boolean | false | Add an empty option at the beginning |
| `emptyValue` | string | "" | Value for the empty option |
| `duration` | number | 0 | Animation duration for dropdown |
| `prepend` | string | "" | Text to prepend before the select |
| `append` | string | "" | Text to append after the select |
| `filterPlaceholder` | string | "" | Placeholder text for filter input |
| `filter` | boolean | false | Enable filtering of options |
| `dropHeight` | number | 200 | Maximum height of dropdown in pixels |
| `dropWidth` | number | null | Width of dropdown (null for auto) |
| `dropFullSize` | boolean | false | Make dropdown full width |
| `openMode` | string | "auto" | How dropdown opens (auto, up, down) |
| `showGroupName` | boolean | false | Show group name in selected items |
| `shortTag` | boolean | true | Use short tags (max width 120px) for multiple selection |
| `source` | string | null | URL for remote data source |
| `sourceMethod` | string | "GET" | HTTP method for remote data |
| `sourceType` | string | "json" | Data type for remote source (json, text) |
| `filterSource` | string | null | URL for filtered data source |
| `filterThreshold` | number | 500 | Minimum characters before filtering |

### CSS Class Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `clsSelect` | string | "" | Additional CSS class for select container |
| `clsSelectInput` | string | "" | Additional CSS class for select input |
| `clsPrepend` | string | "" | Additional CSS class for prepend element |
| `clsAppend` | string | "" | Additional CSS class for append element |
| `clsOption` | string | "" | Additional CSS class for options |
| `clsOptionActive` | string | "" | Additional CSS class for active option |
| `clsOptionGroup` | string | "" | Additional CSS class for option groups |
| `clsDropList` | string | "" | Additional CSS class for dropdown list |
| `clsDropContainer` | string | "" | Additional CSS class for dropdown container |
| `clsSelectedItem` | string | "" | Additional CSS class for selected item tags |
| `clsSelectedItemAction` | string | "" | Additional CSS class for selected item action button |
| `clsLabel` | string | "" | Additional CSS class for label |
| `clsGroupName` | string | "" | Additional CSS class for group names |
| `clsFilterInput` | string | "" | Additional CSS class for filter input |

### Example of Parameter Usage

```html
<select data-role="select" 
        data-clear-button="true"
        data-filter="true"
        data-filter-placeholder="Search..."
        data-show-group-name="true"
        data-cls-select="custom-select"
        data-cls-option="custom-option">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
</select>
```

## Events

| Event            | Description                                |
|------------------|--------------------------------------------|
| `onClear`        | Fired when the select is cleared           |
| `onChange`       | Fired when the selection changes           |
| `onUp`           | Fired when the dropdown closes             |
| `onDrop`         | Fired when the dropdown opens              |
| `onOptions`      | Fired when options are processed           |
| `onItemSelect`   | Fired when an item is selected             |
| `onItemDeselect` | Fired when an item is deselected           |
| `onSelectCreate` | Fired when the select component is created |
| `onData`         | Function to process data before rendering  |
| `onReset`        | Event calling when select was reseted      |
| `onOptions`      | Event calling when options where created   |

### Example of Event Usage

```html
<select data-role="select" 
        data-on-change="onSelectChange"
        data-on-clear="onSelectClear">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
</select>

<script>
    function onSelectChange(event) {
        console.log('Selection changed:', event.detail);
    }
    
    function onSelectClear(event) {
        console.log('Select cleared');
    }
</script>
```

## API Methods

+ `getSelected()` - Returns an array of selected values.
+ `val(val)` - Gets or sets the selected value(s). If no parameter is provided, returns current selection.
+ `data(options, selected, delimiter)` - Sets the select options from data object or HTML string.
+ `options(options, selected, delimiter)` - Alias for the data method.
+ `addOption(val, title, selected)` - Adds a single option to the select.
+ `addOptions(values)` - Adds multiple options from array or object.
+ `removeOption(val)` - Removes an option by value.
+ `removeOptions(values)` - Removes multiple options by values array.
+ `fetch(source, options, clearOptions)` - Fetches data from remote source.
+ `clear()` - Clears the selected value(s).
+ `reset()` - Resets the select to its initial state.
+ `destroy()` - Destroys the component and removes all event listeners.

### Example of Method Usage

```javascript
// Get the select component
const select = Metro.getPlugin('#mySelect', 'select');

// Set single value
select.val('option1');

// Set multiple values
select.val(['option1', 'option2']);

// Get selected values
const selected = select.getSelected();

// Add options from object
select.data({
    'value1': 'Option 1',
    'value2': 'Option 2'
});

// Add single option
select.addOption('new-value', 'New Option', true);

// Clear selection
select.clear();

// Reset to initial state
select.reset();
```

## Styling with CSS Variables

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--select-focus-color` | rgba(204,204,204,0.45) | rgba(204,204,204,0.2) | Focus outline color |
| `--select-disabled-color` | #ccc | #ccc | Disabled state color |
| `--select-options-background` | #ffffff | #2b2d30 | Dropdown background |
| `--select-options-color` | #191919 | #dbdfe7 | Dropdown text color |
| `--select-option-background` | transparent | transparent | Option background |
| `--select-option-color` | inherit | inherit | Option text color |
| `--select-option-background-hover` | rgba(29,29,29,0.1) | #43454a | Option hover background |
| `--select-option-color-hover` | inherit | #ffffff | Option hover text color |
| `--select-option-background-selected` | #e8e8e8 | #43454a | Selected option background |
| `--select-option-color-selected` | #191919 | #ffffff | Selected option text color |
| `--select-button-background` | transparent | transparent | Button background |
| `--select-button-color` | #191919 | #dbdfe7 | Button text color |
| `--select-button-background-hover` | transparent | transparent | Button hover background |
| `--select-button-color-hover` | #191919 | #ffffff | Button hover text color |
| `--select-dropdown-toggle-color` | #191919 | #ffffff | Dropdown arrow color |
| `--select-group-title-background` | #f6f7f8 | #1e1f22 | Group title background |
| `--select-group-title-color` | #646464 | #646464 | Group title text color |
| `--select-item-group-title-background` | transparent | transparent | Selected item group background |
| `--select-item-group-title-color` | #ccc | #646464 | Selected item group text color |
| `--select-tag-background` | #f6f7f8 | #2b2d30 | Tag background for multiple select |
| `--select-tag-color` | #191919 | #dbdfe7 | Tag text color |
| `--select-tag-button-background` | #f6f7f8 | #2b2d30 | Tag button background |
| `--select-tag-button-color` | #191919 | #dbdfe7 | Tag button text color |
| `--select-border-radius` | 4px | 4px | Border radius |

### Example of Custom Styling

```css
/* Custom select styling */
#mySelect {
    --select-options-background: #f0f0f0;
    --select-option-background-hover: #e0e0e0;
    --select-border-radius: 8px;
}

/* Dark theme customization */
.dark-side #mySelect {
    --select-options-background: #1a1a1a;
    --select-option-background-hover: #333333;
}
```

## Available CSS Classes

### Base Classes
- `.select` - Main select container class
- `.select-input` - Input display area
- `.option-list` - Dropdown options list
- `.drop-container` - Dropdown container

### Size Modifiers
- `.small` - Small size select
- `.medium` - Medium size select  
- `.large` - Large size select
- `.largest` - Largest size select

### State Classes
- `.focused` - Applied when select is focused
- `.active-toggle` - Applied when dropdown is open
- `.multiple` - Applied to multiple select containers
- `.disabled` - Applied when select is disabled

### Feature Classes
- `.drop-full-size` - Makes dropdown full width
- `.no-icons` - Hides option icons
- `.pill-input` - Applies pill-shaped styling

### Element Classes
- `.dropdown-caret` - Dropdown arrow element
- `.group-title` - Option group title
- `.tag` - Selected item tag in multiple select
- `.unselect-option` - Remove button for selected items
- `.input-clear-button` - Clear button
- `.selected-item__group-name` - Group name in selected items

## Additional Notes

### Remote Data Format

When using remote data sources, the expected JSON format is:

```json
[
    {
        "value": "option1",
        "text": "Option 1",
        "icon": "<span class='mif-star'>",
        "selected": false
    },
    {
        "value": "option2", 
        "text": "Option 2",
        "selected": true
    }
]
```

### Option Attributes

Options support several data attributes:
- `data-icon` - HTML for option icon
- `data-template` - Custom template with $1 placeholder for text
- `data-display` - Custom display text different from option text

### Multiple Selection

For multiple selection:
- Use the `multiple` attribute on the select element
- Selected items appear as removable tags
- Use `data-short-tag="true"` to limit tag width to 120px

## Best Practices

- Always provide meaningful option values and text
- Use option groups to organize large lists of options
- Enable filtering for lists with more than 10-15 options
- Provide clear labels and placeholders for better UX
- Use icons consistently across all options or not at all
- Test with both light and dark themes
- Ensure proper keyboard navigation support
- Use the clear button for optional selections
- Handle loading states when using remote data sources
- Validate selections on form submission