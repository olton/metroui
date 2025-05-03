# Drop Menu Component

The Drop Menu component provides a flexible and interactive dropdown menu system that can be attached to any element. It supports nested menus, positioning options, and customizable styling.

## Usage

### Basic Drop Menu

```html
<!-- Basic drop menu -->
<button class="button menu-toggle">Menu
    <!-- Toggle icon will be added automatically -->
</button>
<ul data-role-dropmenu>
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
</ul>
```

### Nested Drop Menu

```html
<button class="button menu-toggle">Menu</button>
<ul data-role-dropmenu>
    <li><a href="#">Item 1</a></li>
    <li>
        <a href="#" class="menu-toggle">Submenu</a>
        <ul data-role-dropmenu>
            <li><a href="#">Submenu Item 1</a></li>
            <li><a href="#">Submenu Item 2</a></li>
        </ul>
    </li>
    <li><a href="#">Item 3</a></li>
</ul>
```

### Right-Aligned Drop Menu

```html
<button class="button menu-toggle">Menu</button>
<ul data-role-dropmenu data-align="right">
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
</ul>
```

### Fixed Height Drop Menu

```html
<button class="button menu-toggle">Menu</button>
<ul data-role-dropmenu data-height="200">
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
    <li><a href="#">Item 4</a></li>
    <li><a href="#">Item 5</a></li>
    <!-- Menu will scroll if content exceeds 200px height -->
</ul>
```

## Plugin Parameters

The Drop Menu component accepts the following configuration options:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| height | string/number | "auto" | Maximum height of the menu. Can be "auto" or a specific pixel value |
| align | string | "left" | Horizontal alignment of the menu. Can be "left" or "right" |
| onMenuCreate | function | Metro.noop | Callback function that fires when the menu is created |

### Setting Parameters via Data Attributes

```html
<ul data-role-dropmenu 
    data-height="300"
    data-align="right">
    <!-- Menu items -->
</ul>
```

### Setting Parameters via JavaScript

```javascript
// Global setup for all drop menus
Metro.dropMenuSetup({
    height: 300,
    align: "right",
    onMenuCreate: function() {
        console.log("Menu created!");
    }
});

// Individual setup
const dropMenu = Metro.getPlugin("#myDropMenu", "dropmenu");
// Configure options if needed
```

## API Methods

The Drop Menu component provides the following API methods:

| Method | Description |
| ------ | ----------- |
| open() | Opens the drop menu |
| close() | Closes the drop menu |
| destroy() | Removes the drop menu component |

### Example of API Usage

```javascript
// Get the drop menu component instance
const dropMenu = Metro.getPlugin("#myDropMenu", "dropmenu");

// Open the menu
dropMenu.open();

// Close the menu
dropMenu.close();

// Destroy the menu
dropMenu.destroy();
```

## Styling with CSS Variables

The Drop Menu component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --drop-menu-toggle-color | #191919 | #efefef | Color of the toggle icon |
| --zindex-fixed | - | - | Base z-index for the drop menu (component adds level to this value) |

### Example of Custom Styling

```css
/* Custom styling for a specific drop menu */
#myCustomDropMenu {
    --drop-menu-toggle-color: #0078d7;
}

/* Custom styling for all drop menus in dark mode */
.dark-side .drop-menu {
    --drop-menu-toggle-color: #00b0ff;
}
```

## Available CSS Classes

### Base Classes
- `.drop-menu` - The main container for the drop menu
- `.menu-toggle` - The toggle button/element that triggers the menu

### State Classes
- `.active-toggle` - Applied to the toggle when the menu is open

## Special Features

### Auto-Positioning

The Drop Menu component automatically adjusts its position to ensure it remains within the viewport:

- For top-level menus, it positions below the toggle by default, but will flip above if there's not enough space below
- For submenus, it positions to the right of the parent item by default, but will flip to the left if there's not enough space on the right
- The component respects the `align` option but will override it if necessary to keep the menu visible

### Nested Menus

The component supports unlimited nesting of menus. Each submenu:
- Has its own z-index level to ensure proper stacking
- Maintains its own open/close state
- Closes automatically when clicking outside or on another menu

### Keep-Open Feature

Add the class `keep-open`, `stay-open`, or `ignore-document-click` to prevent a menu from closing when clicking elsewhere on the document:

```html
<ul data-role-dropmenu class="keep-open">
    <!-- This menu will stay open until explicitly closed -->
</ul>
```

## Best Practices

1. Use semantic HTML for menu structures (typically `<ul>` and `<li>` elements)
2. Keep menu items concise and organized logically
3. Consider using icons alongside text for better visual recognition
4. Limit the depth of nested menus to improve usability
5. Ensure menu items have sufficient spacing for touch interactions
6. Use the auto-positioning feature rather than manually positioning menus