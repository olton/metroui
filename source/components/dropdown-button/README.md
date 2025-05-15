# Dropdown Button Component

The Dropdown Button component combines the functionality of the Button and Dropdown components to create a button that toggles a dropdown menu. It provides a convenient way to create dropdown menus triggered by button clicks.

## Usage

### Basic Dropdown Button

```html
<!-- Basic dropdown button -->
<button class="button dropdown-button dropdown-toggle">
    Options
    <div class="dropdown" data-role="dropdown">
        <ul>
            <li><a href="#">Option 1</a></li>
            <li><a href="#">Option 2</a></li>
            <li><a href="#">Option 3</a></li>
        </ul>
    </div>
</button>

<!-- With different button styles -->
<button class="button outline dropdown-button dropdown-toggle">
    Outline Button
    <div class="dropdown" data-role="dropdown">
        <ul>
            <li><a href="#">Option 1</a></li>
            <li><a href="#">Option 2</a></li>
        </ul>
    </div>
</button>
```

### Dropdown Button Positioning

```html
<!-- Dropdown that opens upward -->
<button class="button dropdown-button dropdown-toggle">
    Options
    <div class="dropdown drop-up" data-role="dropdown">
        <div>Content appears above the button</div>
    </div>
</button>

<!-- Dropdown aligned to the right -->
<button class="button dropdown-button dropdown-toggle">
    Options
    <div class="dropdown drop-down-right" data-role="dropdown">
        <div>Content aligned to the right</div>
    </div>
</button>
```

### Colored Dropdown Buttons

```html
<!-- Colored dropdown buttons -->
<button class="button button-primary dropdown-button dropdown-toggle">
    Primary
    <div class="dropdown" data-role="dropdown">
        <ul>
            <li><a href="#">Option 1</a></li>
            <li><a href="#">Option 2</a></li>
        </ul>
    </div>
</button>

<button class="button button-success dropdown-button dropdown-toggle">
    Success
    <div class="dropdown" data-role="dropdown">
        <ul>
            <li><a href="#">Option 1</a></li>
            <li><a href="#">Option 2</a></li>
        </ul>
    </div>
</button>
```

## Configuration Options

The Dropdown Button component inherits all configuration options from the Dropdown component:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `dropdownDeferred` | Number | 0 | Delay in milliseconds before the dropdown appears |
| `dropFilter` | String | null | CSS selector to filter which dropdowns should be closed when another is opened |
| `toggleElement` | String | null | CSS selector for the toggle element (if not automatically detected) |
| `align` | String | "left" | Alignment of the dropdown ("left" or "right") |
| `noClose` | Boolean | false | If true, the dropdown won't close when clicking outside |
| `duration` | Number | 50 | Animation duration in milliseconds |
| `openMode` | String | "auto" | How the dropdown opens ("auto", "up") |
| `openFunc` | String | "show" | Function to use for opening animation |
| `closeFunc` | String | "hide" | Function to use for closing animation |
| `height` | String | "auto" | Height of the dropdown |

### Example of Configuration

```javascript
// Global configuration
Metro.dropdownSetup({
    duration: 100,
    noClose: true,
    openMode: "up"
});

// Component-specific configuration
$(".my-dropdown-button .dropdown").dropdown({
    align: "right",
    height: "300px",
    onDrop: function() {
        console.log("Dropdown opened");
    }
});
```

## API Methods

The Dropdown Button component provides the following API methods (inherited from the Dropdown component):

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `open` | (immediate, el) | Opens the dropdown. If `immediate` is true, opens without animation. `el` is optional element to open. |
| `close` | (immediate, el) | Closes the dropdown. If `immediate` is true, closes without animation. `el` is optional element to close. |
| `toggle` | () | Toggles the dropdown between open and closed states. |

### Example of API Usage

```javascript
// Get the dropdown component instance
const dropdown = Metro.getPlugin($("#myDropdownButton .dropdown"), "dropdown");

// Open the dropdown
dropdown.open();

// Close the dropdown immediately (without animation)
dropdown.close(true);

// Toggle the dropdown state
dropdown.toggle();
```

## Events

The Dropdown Button component provides the following callback events (inherited from the Dropdown component):

| Event | Description |
| ----- | ----------- |
| `onDrop` | Triggered when the dropdown is opened |
| `onUp` | Triggered when the dropdown is closed |
| `onDropdownCreate` | Triggered when the dropdown component is created |

## Styling with CSS Variables

The Dropdown Button component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--dropdown-button-toggle-color` | #000 | #fff | Color of the dropdown toggle icon |

Additionally, all CSS variables from the Button component can be used to style the button part:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--button-border-radius` | 4px | 4px | Border radius for standard buttons |
| `--button-pill-radius` | 36px | 36px | Border radius for pill buttons |
| `--button-size` | 36px | 36px | Height of the button |
| `--button-font-size` | 14px | 14px | Font size of the button text |
| `--button-background` | #ebebeb | #2b2d30 | Background color of the button |
| `--button-background-hover` | #dadada | #333439 | Background color on hover |
| `--button-color` | #191919 | #f3fcff | Text color of the button |
| `--button-border-color` | #ebebeb | #4e5157 | Border color of the button |
| `--button-disabled-opacity` | .65 | .25 | Opacity for disabled buttons |

### Example of Custom Styling

```css
/* Custom styling for dropdown button */
.custom-dropdown-button {
    --dropdown-button-toggle-color: #2196F3;
    --button-background: #e0f7fa;
    --button-background-hover: #b2ebf2;
    --button-color: #006064;
}
```

## Available CSS Classes

### Base Classes
- `.dropdown-button` - Main class for the dropdown button component

### Inherited Button Classes
- All button classes from the Button component can be used
- See the Button component documentation for the full list of available classes

### Inherited Dropdown Classes
- All dropdown positioning and state classes from the Dropdown component can be used
- See the Dropdown component documentation for the full list of available classes

## Best Practices

1. Use clear and descriptive labels for dropdown buttons
2. Keep dropdown menus concise and organized
3. Use appropriate button styles to indicate the type of action
4. Consider using icons alongside text for better visual recognition
5. Use appropriate positioning based on the location of the dropdown button in the UI
6. Ensure dropdown content is accessible and navigable via keyboard