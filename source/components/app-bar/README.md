# App Bar Component

The App Bar component provides a responsive navigation bar that can be placed at the top of your application. It supports a hamburger menu for mobile devices and can be expanded for larger screens, offering a flexible solution for application navigation.

## Usage

### Basic Usage

```html
<div data-role="app-bar">
    <a href="#" class="brand">
        <span class="caption">Brand</span>
    </a>
    <ul class="app-bar-menu">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
</div>
```

### With Hamburger Menu and Icon

```html
<div data-role="app-bar">
    <a href="#" class="brand">
        <span class="icon"><img src="path/to/logo.png"></span>
        <span class="caption">Brand</span>
    </a>
    <ul class="app-bar-menu">
        <li><a href="#">Home</a></li>
        <li><a href="#">Products</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
</div>
```

### Programmatic Creation

```javascript
// Initialize app-bar on an existing element
Metro.makePlugin("#myAppBar", "app-bar");

// Access the app-bar object
const appBar = Metro.getPlugin("#myAppBar", "app-bar");
```

## Plugin Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `appbarDeferred` | number | 0 | Deferred initialization time in milliseconds |
| `expand` | boolean | false | If true, the app bar will always be expanded |
| `expandPoint` | string | null | Media query string at which the app bar will expand (e.g., "md", "lg") |
| `duration` | number | 100 | Animation duration for menu open/close in milliseconds |
| `checkHamburgerColor` | boolean | false | If true, hamburger color will be set dependent on app-bar background color |

## Events

| Event | Description |
| ----- | ----------- |
| `onMenuOpen` | Triggered when menu is opened |
| `onMenuClose` | Triggered when menu is closed |
| `onBeforeMenuOpen` | Triggered before menu is opened |
| `onBeforeMenuClose` | Triggered before menu is closed |
| `onMenuCollapse` | Triggered when menu is collapsed |
| `onMenuExpand` | Triggered when menu is expanded |
| `onAppBarCreate` | Triggered when app bar is created |

## API Methods

+ `open()` - Opens the app bar menu.
+ `close()` - Closes the app bar menu.
+ `destroy()` - Destroys the app bar component and removes all event listeners.

```javascript
// Open the app bar menu
const appBar = Metro.getPlugin('#myAppBar', 'app-bar');
appBar.open();
```

## Styling with CSS Variables

| Variable | Default (Light) | Dark Mode      | Description |
| -------- |-----------------|----------------| ----------- |
| `--appbar-border-radius` | 4px             | 4px            | Border radius of app bar items |
| `--appbar-z-index` | @z-index-fixed  | @z-index-fixed | Z-index of the app bar |
| `--appbar-background` | #ffffff         | #1e1f22        | Background color of the app bar |
| `--appbar-color` | #191919         | #dbdfe7        | Text color of the app bar |
| `--appbar-item-background` | transparent     | transparent    | Background color of app bar items |
| `--appbar-item-color` | #191919         | #dbdfe7        | Text color of app bar items |
| `--appbar-item-color-disabled` | #ccc            | #a8a8a8        | Text color of disabled app bar items |
| `--appbar-item-color-hover` | #000000         | #ffffff        | Text color of app bar items on hover |
| `--appbar-item-background-hover` | #e8e8e8         | #2b2d30        | Background color of app bar items on hover |

### Example of Custom Styling

```css
/* Custom styling for a specific app bar */
#myCustomAppBar {
    --appbar-background: #3498db;
    --appbar-color: #ffffff;
    --appbar-item-color: #ffffff;
    --appbar-item-background-hover: rgba(255, 255, 255, 0.2);
    --appbar-item-color-hover: #ffffff;
}
```

## Available CSS Classes

### Base Classes
- `.app-bar` - The main container class (automatically added)
- `.app-bar-menu` - The menu container
- `.app-bar-item` - Items within the app bar
- `.app-bar-item-static` - Static items that don't have hover effects
- `.brand` - For branding elements
- `.app-bar-button` - Button styling
- `.hamburger` - The hamburger menu button

### State Classes
- `.collapsed` - Applied to the menu when it's collapsed
- `.opened` - Applied to the menu when it's opened
- `.app-bar-expand` - Applied to the app bar when it's expanded

## Responsive Behavior

The App Bar component automatically adapts to different screen sizes:

1. On small screens, the menu is collapsed and accessible via the hamburger button
2. On larger screens (or when `expand` is true), the menu is expanded horizontally

You can control the breakpoint at which the app bar expands using the `expandPoint` parameter.

## Accessibility

The App Bar component includes ARIA attributes for improved accessibility:
- The hamburger button has `aria-label`, `aria-expanded`, and `aria-controls` attributes
- Menu items have appropriate roles and tabindex attributes
- Keyboard navigation is supported (Enter/Space to toggle menu)