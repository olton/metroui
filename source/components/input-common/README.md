# Input Common Component

The Input Common component provides base styling and behavior for various input elements in Metro UI. It serves as a foundation for other input-related components and ensures consistent styling across different input types.

## Usage

The Input Common component applies styling to standard HTML input elements and Metro UI input components:

```html
<!-- Standard HTML inputs -->
<input type="text" class="metro-input" placeholder="Text input">
<input type="password" class="metro-input" placeholder="Password input">
<input type="email" class="metro-input" placeholder="Email input">
<textarea class="metro-input" placeholder="Textarea"></textarea>

<!-- Input states -->
<input type="text" class="metro-input required" placeholder="Required input">
<input type="text" class="metro-input invalid" placeholder="Invalid input">
<input type="text" class="metro-input valid" placeholder="Valid input">
<input type="text" class="metro-input" disabled placeholder="Disabled input">

<!-- With prepend/append elements -->
<div class="input">
    <div class="prepend">@</div>
    <input type="text" placeholder="Username">
</div>

<div class="input">
    <input type="text" placeholder="Search">
    <div class="append"><span class="mif-search"></span></div>
</div>
```

## Styling with CSS Variables

The Input Common component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--input-background` | #ffffff | #2b2d30 | Background color of input elements |
| `--input-background-disabled` | #f7f8fa | #2b2d30 | Background color of disabled input elements |
| `--input-color` | #161316 | #dfe1e5 | Text color of input elements |
| `--input-color-disabled` | #c9ccd6 | #333437 | Text color of disabled input elements |
| `--input-border-color` | #c9ccd6 | #4e5157 | Border color of input elements |
| `--input-border-color-hover` | #adb0b8 | #71757e | Border color of input elements on hover |
| `--input-box-shadow` | rgba(201, 204, 214, 0.42) | rgba(78, 81, 87, 0.43) | Box shadow color for focused inputs |
| `--input-prepend-background` | #f8f8f8 | #4e5157 | Background color of prepend elements |
| `--input-prepend-color` | #191919 | #bac1cf | Text color of prepend elements |
| `--input-append-background` | #f8f8f8 | #4e5157 | Background color of append elements |
| `--input-append-color` | #191919 | #bac1cf | Text color of append elements |
| `--input-required-color` | #468cff | #468cff | Color for required input indicators |
| `--input-invalid-color` | #ad2a14 | #ad2a14 | Color for invalid input indicators |
| `--input-valid-color` | #4cad14 | #4cad14 | Color for valid input indicators |
| `--input-border-radius` | 6px | 6px | Border radius of input elements |
| `--input-font-size` | 14px | 14px | Font size of input text |

### Example of Custom Styling

```css
/* Custom styling for inputs in a specific form */
.custom-form .metro-input {
    --input-background: #f0f8ff;
    --input-border-color: #4a90e2;
    --input-border-color-hover: #2a6fc2;
    --input-color: #2c3e50;
    --input-border-radius: 8px;
}
```

## Available CSS Classes

### Base Classes
- `.metro-input` - Base class for styled inputs
- `.input` - Container class for inputs with prepend/append elements

### State Classes
- `.required` - Indicates a required input field
- `.invalid` - Indicates an invalid input field
- `.valid` - Indicates a valid input field
- `.disabled` - Visually disables an input field
- `.focused` - Applies focused styling to an input field

### Helper Classes
- `.prepend` - Element to prepend before an input
- `.append` - Element to append after an input
- `.invalid_feedback` - Container for invalid input feedback messages
- `.custom-validation` - Enables custom validation styling
- `.label-for-input` - Styling for input labels
- `.rtl` - Right-to-left text direction for inputs

## Accessibility

The Input Common component includes proper styling for various input states to improve accessibility:
- Focus states are clearly indicated with box shadows
- Required, valid, and invalid states have distinct visual indicators
- Disabled states have appropriate styling and pointer-events disabled
- Labels can be properly associated with inputs

## Best Practices

1. Always provide labels for input fields to improve accessibility
2. Use appropriate input types for different data (email, password, etc.)
3. Provide clear validation feedback for invalid inputs
4. Use the required, valid, and invalid classes consistently to indicate input state
5. Consider using prepend/append elements to provide additional context for inputs