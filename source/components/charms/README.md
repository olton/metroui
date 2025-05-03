# Charms Component

The Charms component provides a panel that can be positioned on any side of the screen (right, left, top, bottom) and can be opened or closed with smooth transition effects. It's commonly used for displaying additional options, notifications, or contextual information.

## Usage

### Basic Usage

```html
<!-- Basic charms panel (right side by default) -->
<div data-role="charms" id="my-charms">
    <!-- Content goes here -->
</div>

<!-- Charms panel with custom position -->
<div data-role="charms" data-position="left">
    <!-- Content goes here -->
</div>
```

### Controlling Charms

```javascript
// Open charms
Metro.charms.open('#my-charms');

// Close charms
Metro.charms.close('#my-charms');

// Toggle charms state
Metro.charms.toggle('#my-charms');

// Close all open charms
Metro.charms.closeAll();

// Check if charms is open
const isOpen = Metro.charms.isOpen('#my-charms');

// Set opacity
Metro.charms.opacity('#my-charms', 0.8);
```

### Charm Elements

The charms component supports two special elements:

```html
<!-- Charm tile -->
<div class="charm-tile">
    <span class="icon mif-home"></span>
    <span class="caption">Home</span>
</div>

<!-- Charm notification -->
<div class="charm-notify">
    <span class="icon mif-bell"></span>
    <span class="title">Notification Title</span>
    <span class="content">Notification content goes here</span>
    <span class="secondary">Additional information</span>
</div>
```

## Plugin Parameters

The Charms component accepts the following configuration options:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| charmsDeferred | number | 0 | Deferred initialization time in milliseconds |
| position | string | "right" | Position of the charms panel ("right", "left", "top", "bottom") |
| opacity | number | 1 | Opacity of the charms panel background (0-1) |
| clsCharms | string | "" | Additional CSS class(es) for the charms element |
| onCharmCreate | function | Metro.noop | Callback function triggered after charms creation |
| onOpen | function | Metro.noop | Callback function triggered when charms is opened |
| onClose | function | Metro.noop | Callback function triggered when charms is closed |
| onToggle | function | Metro.noop | Callback function triggered when charms state is toggled |

## API Methods

### Component Methods

These methods can be called on a charms component instance:

```javascript
// Get component instance
const charms = Metro.getPlugin('#my-charms', 'charms');

// Call methods
charms.open();
charms.close();
charms.toggle();
charms.opacity(0.8);
```

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| open | - | - | Opens the charms panel |
| close | - | - | Closes the charms panel |
| toggle | - | - | Toggles the open/closed state of the charms panel |
| opacity | value | current opacity | Gets or sets the opacity of the charms panel background |
| changeOpacity | - | - | Changes opacity based on data-opacity attribute |
| destroy | - | element | Destroys the component and returns the element |

### Static Methods

These methods can be called directly from the Metro.charms object:

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| check | element | boolean | Checks if element is a charms component |
| isOpen | element | boolean | Checks if charms panel is open |
| open | element | - | Opens the charms panel |
| close | element | - | Closes the charms panel |
| toggle | element | - | Toggles the charms panel state |
| closeAll | - | - | Closes all charms panels |
| opacity | element, opacity | - | Sets opacity for a charms panel |

## Styling with CSS Variables

The Charms component can be styled using the following CSS variables:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| @zindex-charms | (defined in vars) | Z-index of the charms component |
| @dark | (defined in vars) | Default background color |
| @white | (defined in vars) | Default text color |
| @transition-transform | (defined in vars) | Transition effect for opening/closing |

### Example of Custom Styling

```css
/* Custom styling for a specific charms panel */
#my-charms {
    --zindex-charms: 1050;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
}
```

## Available CSS Classes

### Base Classes
- `.charms` - Main container class
- `.charm-tile` - Tile element within charms
- `.charm-notify` - Notification element within charms

### Position Modifiers
- `.top-side` - Positions charms at the top
- `.bottom-side` - Positions charms at the bottom
- `.left-side` - Positions charms at the left
- `.right-side` - Positions charms at the right

### State Classes
- `.open` - Applied when charms is open

## Best Practices

1. Use charms panels sparingly to avoid overwhelming the user interface
2. Consider the appropriate position based on your application's layout
3. Use appropriate opacity to ensure content remains readable
4. Provide clear ways for users to close the charms panel
5. Use charm-tile and charm-notify elements for consistent styling