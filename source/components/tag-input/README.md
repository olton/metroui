# Tag Input Component

The Tag Input component allows users to enter multiple tags or keywords in a single input field. It supports autocomplete, custom tag separators, and various styling options.

## Usage

```html
<input data-role="tag-input" data-tag-separator="," value="tag1, tag2, tag3">
```

## Plugin Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `autocomplete` | `null` | Array or object of autocomplete values |
| `autocompleteUnique` | `true` | When true, only shows unique values in autocomplete list |
| `autocompleteUrl` | `null` | URL to fetch autocomplete data |
| `autocompleteUrlMethod` | `"GET"` | HTTP method for autocomplete URL request |
| `autocompleteUrlKey` | `null` | Key to extract data from JSON response |
| `autocompleteDivider` | `","` | Divider for autocomplete values |
| `autocompleteListHeight` | `200` | Maximum height of autocomplete list in pixels |
| `label` | `""` | Label text for the input |
| `size` | `"normal"` | Size of the input: "small", "normal", or "large" |
| `tagInputDeferred` | `0` | Delay before initialization (milliseconds) |
| `static` | `false` | When true, makes the component read-only |
| `clearButton` | `true` | When true, shows a clear button |
| `clearButtonIcon` | `"❌"` | Icon for the clear button |
| `randomColor` | `false` | When true, assigns random colors to tags |
| `maxTags` | `0` | Maximum number of tags (0 for unlimited) |
| `tagSeparator` | `","` | Character used to separate tags in the value |
| `tagTrigger` | `"Enter, Space, Comma"` | Keys that trigger tag creation |
| `backspace` | `true` | When true, allows removing last tag with backspace |
| `clsComponent` | `""` | Additional CSS class for the component |
| `clsInput` | `""` | Additional CSS class for the input |
| `clsClearButton` | `""` | Additional CSS class for the clear button |
| `clsTag` | `""` | Additional CSS class for tags |
| `clsTagTitle` | `""` | Additional CSS class for tag titles |
| `clsTagAction` | `""` | Additional CSS class for tag action buttons |
| `clsLabel` | `""` | Additional CSS class for the label |

## Events

| Event | Description |
|-------|-------------|
| `onBeforeTagAdd` | Triggered before a tag is added. Return `false` to prevent adding |
| `onTagAdd` | Triggered when a tag is added |
| `onBeforeTagRemove` | Triggered before a tag is removed. Return `false` to prevent removing |
| `onTagRemove` | Triggered when a tag is removed |
| `onTag` | Triggered when a tag is added or removed |
| `onClear` | Triggered when all tags are cleared |
| `onTagTrigger` | Triggered when a tag trigger key is pressed |
| `onTagInputCreate` | Triggered when the component is created |

## API Methods

### tags()
Returns an array of the current tags.

```javascript
var tagInput = Metro.getPlugin('#my-tag-input', 'tag-input');
var tags = tagInput.tags();
```

### val(v)
Gets or sets the value of the tag input.

**Parameters:**
- `v` (optional) - String or array of tags to set

```javascript
// Get current tags
var tags = tagInput.val();

// Set new tags
tagInput.val("tag1, tag2, tag3");
// or
tagInput.val(["tag1", "tag2", "tag3"]);
```

### append(v)
Appends new tags to the existing ones.

**Parameters:**
- `v` - String or array of tags to append

```javascript
tagInput.append("tag4, tag5");
// or
tagInput.append(["tag4", "tag5"]);
```

### clear()
Removes all tags.

```javascript
tagInput.clear();
```

### disable()
Disables the tag input.

```javascript
tagInput.disable();
```

### enable()
Enables the tag input.

```javascript
tagInput.enable();
```

## CSS Classes

- `.tag-input` - The main container class
- `.original-input` - The original input element
- `.input-wrapper` - The visible input field
- `.input-clear-button` - The clear button
- `.tag` - Individual tag elements
- `.title` - Tag text
- `.action` - Tag remove button
- `.autocomplete-list` - Autocomplete dropdown
- `.static-mode` - Applied when the component is in static mode
- `.input-large` - Applied for large size
- `.input-small` - Applied for small size

## Styling with CSS Variables

The Tag Input component can be customized using the following CSS variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--taginput-border-radius` | `4px` | Controls the border radius of the tag input |
| `--taginput-color` | `var(--input-color)` | Controls the text color of the tag input |

### Example of Custom Styling

```css
.tag-input {
    --taginput-border-radius: 8px;
    --taginput-color: #0066cc;
}
```

For dark mode, the component includes a `.dark-side` class with the following variable values:

```css
.dark-side {
    --taginput-color: var(--input-color);
}
```

Note that the Tag Input component also uses the Tag component for individual tags, so you can customize tag appearance using the Tag component's CSS variables.