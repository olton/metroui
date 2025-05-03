# Input Component

The Input component provides a versatile and customizable text input field with various features including autocomplete, history, custom buttons, and more. It enhances the standard HTML input element with additional functionality and styling options.

## Usage

### Basic Usage

```html
<!-- Basic input -->
<input type="text" data-role="input">

<!-- Input with placeholder -->
<input type="text" data-role="input" placeholder="Enter text here...">

<!-- Input with label -->
<input type="text" data-role="input" data-label="Username">

<!-- Password input with reveal button -->
<input type="password" data-role="input">
```

### Input with Prepend/Append

```html
<!-- Input with prepended text -->
<input type="text" data-role="input" data-prepend="https://">

<!-- Input with appended text -->
<input type="text" data-role="input" data-append=".com">

<!-- Input with prepend and append options -->
<input type="text" data-role="input" 
       data-prepend-options="http://,https://" 
       data-append-options=".com,.org,.net">
```

### Input with Buttons

```html
<!-- Input with search button -->
<input type="text" data-role="input" data-search-button="true">

<!-- Input with random button (generates random value) -->
<input type="text" data-role="input" data-random-button="true">

<!-- Input with custom buttons -->
<input type="text" data-role="input" data-custom-buttons='[
    {"text": "✓", "cls": "success", "onclick": "alert(\'Confirmed!\')"},
    {"text": "✗", "cls": "alert", "onclick": "alert(\'Cancelled!\')"}
]'>
```

### Input with Autocomplete

```html
<!-- Input with autocomplete -->
<input type="text" data-role="input" 
       data-autocomplete="Apple,Banana,Cherry,Date,Elderberry">

<!-- Input with autocomplete from URL -->
<input type="text" data-role="input" 
       data-autocomplete-url="/api/autocomplete" 
       data-autocomplete-url-method="GET">
```

### Input with History

```html
<!-- Input with history (press Enter to add to history, Up/Down arrows to navigate) -->
<input type="text" data-role="input" data-history="true">

<!-- Input with preset history -->
<input type="text" data-role="input" 
       data-history="true" 
       data-history-preset="previous search 1|previous search 2|previous search 3">
```

## Configuration Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| `label` | "" | Label text for the input |
| `autocomplete` | null | Autocomplete list (string with dividers or array) |
| `autocompleteUrl` | null | URL to fetch autocomplete data |
| `autocompleteUrlMethod` | "GET" | HTTP method for autocomplete URL |
| `autocompleteUrlKey` | null | Key in the response object to extract autocomplete data |
| `autocompleteDivider` | "," | Divider for autocomplete string |
| `autocompleteListHeight` | 200 | Height of autocomplete dropdown list |
| `history` | false | Enable input history |
| `historyPreset` | "" | Preset history values |
| `historyDivider` | "\|" | Divider for history preset string |
| `preventSubmit` | false | Prevent form submission on Enter key |
| `defaultValue` | "" | Default value for the input |
| `size` | "default" | Size of the input (can be pixel value) |
| `prepend` | "" | Text to prepend to the input |
| `append` | "" | Text to append to the input |
| `prependOptions` | "" | Options for prepend dropdown |
| `prependOptionsSep` | "," | Separator for prepend options |
| `appendOptions` | "" | Options for append dropdown |
| `appendOptionsSep` | "," | Separator for append options |
| `searchButton` | false | Show search button |
| `clearButton` | true | Show clear button |
| `revealButton` | true | Show reveal button for password inputs |
| `randomButton` | false | Show random button |
| `clearButtonIcon` | "❌" | Icon for clear button |
| `revealButtonIcon` | "👀" | Icon for reveal button |
| `searchButtonIcon` | "🔍" | Icon for search button |
| `randomButtonIcon` | "🎲" | Icon for random button |
| `searchButtonClick` | "submit" | Action for search button ("submit" or custom) |
| `randomSymbols` | "0123..." | Symbols to use for random value generation |
| `randomLength` | 12 | Length of generated random value |
| `badge` | null | Badge text to display in the input |
| `clsComponent` | "" | Additional CSS class for component container |
| `clsInput` | "" | Additional CSS class for input element |
| `clsPrepend` | "" | Additional CSS class for prepend element |
| `clsAppend` | "" | Additional CSS class for append element |
| `clsClearButton` | "" | Additional CSS class for clear button |
| `clsRevealButton` | "" | Additional CSS class for reveal button |
| `clsSearchButton` | "" | Additional CSS class for search button |
| `clsRandomButton` | "" | Additional CSS class for random button |
| `clsCustomButton` | "" | Additional CSS class for custom buttons |
| `clsLabel` | "" | Additional CSS class for label |

## Events

| Event | Description |
| ----- | ----------- |
| `onAutocompleteSelect` | Triggered when an autocomplete item is selected |
| `onHistoryChange` | Triggered when history changes |
| `onHistoryUp` | Triggered when navigating up through history |
| `onHistoryDown` | Triggered when navigating down through history |
| `onClearClick` | Triggered when clear button is clicked |
| `onRevealClick` | Triggered when reveal button is clicked |
| `onSearchButtonClick` | Triggered when search button is clicked |
| `onEnterClick` | Triggered when Enter key is pressed |
| `onInputCreate` | Triggered after the input is created |

## API Methods

| Method | Description |
| ------ | ----------- |
| `getHistory()` | Returns the history array |
| `getHistoryIndex()` | Returns the current history index |
| `setHistoryIndex(val)` | Sets the history index |
| `setHistory(history, append)` | Sets the history array |
| `clear()` | Clears the input value |
| `toDefault()` | Sets the input value to the default value |
| `disable()` | Disables the input |
| `enable()` | Enables the input |
| `toggleState()` | Toggles the disabled state |
| `setAutocompleteList(list)` | Sets the autocomplete list |
| `val(value, splitter)` | Gets or sets the input value |

## Styling with CSS Variables

The Input component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--input-autocomplete-background` | #ffffff | #2b2d30 | Background color of autocomplete dropdown |
| `--input-autocomplete-color` | #191919 | #dbdfe7 | Text color of autocomplete dropdown |
| `--input-autocomplete-selected-color` | #468cff | #ffc351 | Color of selected text in autocomplete |
| `--input-autocomplete-selected-background` | transparent | transparent | Background of selected text in autocomplete |
| `--input-border-radius` | 4px | 4px | Border radius of the input |
| `--input-font-size` | 14px | 14px | Font size of the input |

### Example of Custom Styling

```css
/* Custom styling for a specific input */
#myCustomInput {
    --input-border-radius: 8px;
    --input-font-size: 16px;
    --input-autocomplete-background: #f0f8ff;
    --input-autocomplete-color: #0d47a1;
    --input-autocomplete-selected-color: #ff5722;
}
```

## Example Use Cases

### Search Input with Autocomplete

```html
<input type="text" data-role="input" 
       data-search-button="true"
       data-autocomplete="Popular search 1,Popular search 2,Popular search 3"
       data-history="true"
       placeholder="Search...">
```

### Password Input with Strength Indicator

```html
<div class="input-container">
    <input type="password" data-role="input" id="password"
           data-random-button="true"
           data-random-length="16"
           data-label="Create Password">
    <div class="password-strength" id="passwordStrength"></div>
</div>

<script>
    $("#password").on("input", function(){
        // Simple password strength check
        const val = $(this).val();
        const strength = val.length > 12 ? "Strong" : (val.length > 8 ? "Medium" : "Weak");
        $("#passwordStrength").text("Strength: " + strength);
    });
</script>
```

### URL Input with Protocol and Domain Selection

```html
<input type="text" data-role="input"
       data-prepend-options="http://,https://"
       data-append-options=".com,.org,.net,.io"
       data-label="Website URL">
```

## Best Practices

1. Use appropriate input types (text, password, email, etc.) for better mobile keyboard support
2. Provide clear labels for inputs to improve accessibility
3. Use autocomplete for fields where users might benefit from suggestions
4. Consider using history for search inputs to improve user experience
5. Use appropriate validation and feedback for user input
6. For password fields, consider using the random button to help users generate secure passwords
7. Use custom buttons sparingly to avoid cluttering the interface