# Sidenav

A responsive side navigation component that provides a collapsible menu with support for icons, titles, dropdown submenus, and various visual states. The sidenav automatically adapts between compact and expanded modes based on screen size and user interaction.

## Dependencies

This component has no external dependencies beyond Metro UI core functionality.

## Usage

### Basic Usage

```html
<ul data-role="sidenav">
    <li class="title">Navigation</li>
    <li class="active"><a href="#"><span class="mif-home icon"></span><span class="caption">Dashboard</span></a></li>
    <li><a href="#"><span class="mif-cog icon"></span><span class="caption">Settings</span></a></li>
    <li><a href="#"><span class="caption">Profile</span></a></li>
</ul>
```

### With Custom Expand Point

```html
<ul data-role="sidenav" data-expand-point="lg">
    <li class="title">Menu</li>
    <li><a href="#"><span class="mif-home icon"></span><span class="caption">Home</span></a></li>
    <li><a href="#"><span class="mif-users icon"></span><span class="caption">Users</span></a></li>
</ul>
```

### With Toggle Button

```html
<button id="toggle-btn">Toggle Menu</button>
<ul data-role="sidenav" data-toggle="#toggle-btn">
    <li><a href="#"><span class="mif-home icon"></span><span class="caption">Dashboard</span></a></li>
    <li><a href="#"><span class="mif-cog icon"></span><span class="caption">Settings</span></a></li>
</ul>
```

### With Dropdown Submenu

```html
<ul data-role="sidenav">
    <li>
        <a class="dropdown-toggle" href="#"><span class="mif-tree icon"></span><span class="caption">Sub menu</span></a>
        <ul class="d-menu" data-role="dropdown">
            <li><a href="#"><span class="mif-vpn-lock icon"></span> Subitem 1</a></li>
            <li><a href="#"><span class="mif-vpn-lock icon"></span> Subitem 2</a></li>
            <li class="disabled"><a href="#">Disabled item</a></li>
        </ul>
    </li>
</ul>
```

### With Stick Indicators

```html
<ul data-role="sidenav">
    <li class="stick-left"><a href="#"><span class="mif-home icon"></span><span class="caption">Left Stick</span></a></li>
    <li class="stick-right"><a href="#"><span class="mif-cog icon"></span><span class="caption">Right Stick</span></a></li>
    <li class="stick-color-red"><a href="#"><span class="mif-alert icon"></span><span class="caption">Red Stick</span></a></li>
</ul>
```

## Plugin Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `compacted` | boolean | false | Initial compacted state of the sidenav |
| `toggle` | string | null | CSS selector for toggle button element |
| `expandPoint` | string | "fs" | Media breakpoint for automatic expansion (xs, sm, md, lg, xl, xxl, fs) |

### Example of Parameter Usage

```html
<ul data-role="sidenav" data-compacted="true" data-toggle="#menu-toggle" data-expand-point="lg">
    <li><a href="#"><span class="caption">Menu Item</span></a></li>
</ul>
```

## Events

| Event | Description |
| ----- | ----------- |
| `onMenuItemClick` | Fired when a menu item is clicked |
| `onCollapse` | Fired when the sidenav collapses |
| `onExpand` | Fired when the sidenav expands |
| `onSidenavCreate` | Fired when the sidenav component is created |

### Example of Event Usage

```html
<ul data-role="sidenav" data-on-menu-item-click="onItemClick" data-on-expand="onExpand">
    <li><a href="#"><span class="caption">Menu Item</span></a></li>
</ul>

<script>
    function onItemClick(event) {
        console.log('Menu item clicked:', event.target);
    }
    
    function onExpand(event) {
        console.log('Sidenav expanded');
    }
</script>
```

## API Methods

+ `setValue(index, value)` - Sets the counter value for a menu item at the specified index.

### Example of Method Usage

```javascript
const sidenav = Metro.getPlugin('#my-sidenav', 'sidenav');
sidenav.setValue(0, 5); // Sets counter to 5 for first menu item
```

## Styling with CSS Variables

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--sidenav-border-radius` | 4px | 4px | Border radius for menu items |
| `--sidenav-width` | 220px | 220px | Width when expanded |
| `--sidenav-background` | #f6f6f6 | #2b2d30 | Background color |
| `--sidenav-color` | #191919 | #dfe1e5 | Text color |
| `--sidenav-icon-color` | #191919 | #dfe1e5 | Icon color |
| `--sidenav-counter-color` | #191919 | #dfe1e5 | Counter text color |
| `--sidenav-background-hover` | #cecece | #43454a | Hover background color |
| `--sidenav-color-hover` | #0a0a0a | #ffffff | Hover text color |
| `--sidenav-background-active` | #68a3ff | #468cff | Active background color |
| `--sidenav-color-active` | #ffffff | #ffffff | Active text color |
| `--sidenav-border-color` | var(--border-color) | var(--border-color) | Border color |

### Example of Custom Styling

```css
/* Custom styling example */
#my-sidenav {
    --sidenav-width: 280px;
    --sidenav-background: #1e1e1e;
    --sidenav-color: #ffffff;
    --sidenav-background-active: #0078d4;
}
```

## Available CSS Classes

### Base Classes
- `.sidenav` - Main sidenav container (automatically applied)
- `.expanded` - Expanded state class
- `.handmade` - Manual toggle state class

### Item Classes
- `.title` - Section title styling
- `.active` - Active menu item
- `.disabled` - Disabled menu item
- `.stick-left` - Left stick indicator
- `.stick-right` - Right stick indicator
- `.stick-color-{color}` - Colored stick indicator (supports all Metro UI colors)

### Element Classes
- `.icon` - Icon container
- `.caption` - Text caption
- `.counter` - Counter badge
- `.dropdown-caret` - Dropdown arrow
- `.d-menu` - Dropdown submenu container

## Additional Notes

- The sidenav automatically generates default icons from the first letters of menu item text when no icon is provided
- The component remembers its collapsed/expanded state using local storage
- Responsive behavior is controlled by the `expandPoint` parameter
- Icons should use Metro UI icon classes (e.g., `mif-home`, `mif-cog`)
- Dropdown submenus require the dropdown component to be included

## Best Practices

- Use semantic HTML structure with `<ul>` and `<li>` elements
- Provide meaningful icons and captions for better user experience
- Group related items under section titles for better organization
- Use the `active` class to indicate the current page/section
- Consider the `expandPoint` parameter based on your layout requirements
- Test the component on different screen sizes to ensure proper responsive behavior