# Rating Component

The Rating component provides an interactive star rating system that allows users to view and select ratings. It supports both static display and interactive modes, with customizable symbols, colors, and behaviors.

## Usage

### Basic Usage

```html
<!-- Basic rating with default 5 stars -->
<input data-role="rating">

<!-- Rating with initial value -->
<input data-role="rating" data-value="3.5">

<!-- Static rating display (non-interactive) -->
<input data-role="rating" data-value="4.2" data-static="true">
```

### Advanced Usage

```html
<!-- Custom number of stars -->
<input data-role="rating" data-stars="10" data-value="7.5">

<!-- Custom symbol -->
<input data-role="rating" data-symbol="♥" data-value="3">

<!-- Custom colors -->
<input data-role="rating" data-on-color="#ff5252" data-off-color="#e0e0e0" data-value="4">

<!-- With title and message -->
<input data-role="rating" data-title="Product Rating:" data-message="4.5 out of 5" data-value="4.5">

<!-- Disable half-star ratings -->
<input data-role="rating" data-half="false" data-value="4">
```

## Configuration Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| ratingDeferred | 0 | Deferred initialization time in milliseconds |
| label | "" | Label for the rating component |
| static | false | If true, the rating is display-only and not interactive |
| title | null | Title text displayed before the stars |
| value | 0 | Initial rating value |
| values | null | Custom values for each star (array or comma-separated string) |
| message | "" | Message text displayed after the stars |
| stars | 5 | Number of stars to display |
| onColor | null | Color for active (rated) stars |
| offColor | null | Color for inactive stars |
| roundFunc | "round" | Rounding function for values ("round", "ceil", "floor", or "none") |
| half | true | If true, allows half-star ratings in static mode |
| symbol | "★" | Symbol to use for stars |

### CSS Classes Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| clsRating | "" | Additional CSS class for the rating container |
| clsTitle | "" | Additional CSS class for the title |
| clsStars | "" | Additional CSS class for the stars container |
| clsResult | "" | Additional CSS class for the result message |
| clsLabel | "" | Additional CSS class for the label |

### Callback Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| onStarClick | Metro.noop | Triggered when a star is clicked |
| onRatingCreate | Metro.noop | Triggered when the component is created |

## JavaScript Usage

```javascript
// Initialize with JavaScript
const rating = Metro.getPlugin('#myRating', 'rating', {
    value: 3.5,
    stars: 10,
    symbol: '♥',
    onStarClick: function(data) {
        console.log("Selected rating:", data.value);
    }
});

// Global setup
Metro.ratingSetup({
    symbol: '♦',
    onColor: '#1976d2',
    offColor: '#bbdefb'
});
```

## API Methods

### val(value)
Gets or sets the rating value.

```javascript
const rating = Metro.getPlugin('#myRating', 'rating');
// Get value
const currentValue = rating.val();
// Set value
rating.val(4.5);
```

### msg(message)
Sets the result message.

```javascript
const rating = Metro.getPlugin('#myRating', 'rating');
rating.msg("Excellent rating!");
```

### static(mode)
Sets the static mode (interactive or display-only).

```javascript
const rating = Metro.getPlugin('#myRating', 'rating');
rating.static(true); // Make it display-only
rating.static(false); // Make it interactive
```

### disable()
Disables the rating component.

```javascript
const rating = Metro.getPlugin('#myRating', 'rating');
rating.disable();
```

### enable()
Enables the rating component.

```javascript
const rating = Metro.getPlugin('#myRating', 'rating');
rating.enable();
```

### toggleState()
Toggles between enabled and disabled states.

```javascript
const rating = Metro.getPlugin('#myRating', 'rating');
rating.toggleState();
```

### destroy()
Destroys the component and restores the original input element.

```javascript
const rating = Metro.getPlugin('#myRating', 'rating');
rating.destroy();
```

## Styling with CSS Variables

The Rating component can be styled using the following CSS variables:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| --rating-star-size | 24px | Size of the rating stars |
| --rating-off-color | var(--color-light-blue) | Color of inactive stars |
| --rating-on-color | var(--color-blue) | Color of active (rated) stars |
| --rating-background | transparent | Background color of the rating component |

### Example of Custom Styling

```css
/* Custom styling for a specific rating */
#myCustomRating {
    --rating-star-size: 32px;
    --rating-off-color: #e0e0e0;
    --rating-on-color: #ffc107;
}

/* Custom styling for a group of ratings */
.product-ratings .rating {
    --rating-star-size: 20px;
    --rating-on-color: #ff9800;
}
```

## Events

You can subscribe to events using the Metro 4 event system:

```javascript
// Listen for star click
$(document).on("star-click", function(event, data){
    console.log("Star clicked with value:", data.value);
});

// Listen for component creation
$(document).on("rating-create", function(event, data){
    console.log("Rating created:", data.element);
});
```

## Accessibility

The Rating component includes proper semantics for improved accessibility:
- Maintains the original input element for form submission
- Provides visual feedback when interacting with stars
- Supports keyboard navigation in interactive mode
- Allows for descriptive labels and titles

## Best Practices

1. Always provide a clear label for the rating component
2. Use consistent star symbols and colors throughout your application
3. Consider using the static mode for displaying existing ratings
4. Add a descriptive message to provide context for the rating
5. Use half-star ratings for more precise feedback when appropriate
6. Set appropriate colors that provide sufficient contrast for visibility