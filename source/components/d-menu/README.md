# D-Menu Component

The D-Menu component provides a versatile dropdown menu system for displaying contextual options, navigation items, and hierarchical menus. It supports icons, captions, hotkeys, and nested submenus.

## Usage

### Basic Menu

```html
<ul class="d-menu pos-relative">
    <li><a href="#">Menu Item 1</a></li>
    <li><a href="#">Menu Item 2</a></li>
    <li><a href="#">Menu Item 3</a></li>
</ul>
```

### Menu with Icons, Captions, and Hotkeys

```html
<ul class="d-menu pos-relative">
    <li><a href="#">
        <span class="icon mif-home"></span>
        <span class="caption">Home</span>
        <span class="hotkey">Ctrl+H</span>
    </a></li>
    <li><a href="#">
        <span class="icon mif-cog"></span>
        <span class="caption">Settings</span>
    </a></li>
</ul>
```

### Disabled Menu Items

```html
<ul class="d-menu pos-relative">
    <li><a href="#">Enabled Item</a></li>
    <li class="disabled"><a href="#">Disabled Item</a></li>
</ul>
```

### Menu with Dividers

```html
<ul class="d-menu pos-relative">
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li class="divider"></li>
    <li><a href="#">Item 3</a></li>
</ul>
```

### Dropdown Submenu

```html
<ul class="d-menu pos-relative">
    <li><a href="#">Item 1</a></li>
    <li>
        <a href="#" class="dropdown-toggle">Submenu</a>
        <ul class="d-menu" data-role="dropdown">
            <li><a href="#">Submenu Item 1</a></li>
            <li><a href="#">Submenu Item 2</a></li>
        </ul>
    </li>
</ul>
```

### Menu Positioning

```html
<!-- Right-aligned menu -->
<ul class="d-menu place-right">
    <!-- Menu items -->
</ul>

<!-- Right-aligned submenu -->
<ul class="d-menu">
    <li>
        <a href="#" class="dropdown-toggle">Submenu</a>
        <ul class="d-menu place-right" data-role="dropdown">
            <!-- Submenu items -->
        </ul>
    </li>
</ul>
```

## Plugin Parameters

When using the d-menu with dropdown functionality (`data-role="dropdown"`), the following parameters are available:

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| dropFilter | null | Filter for dropdown elements |
| toggleElement | null | Element that toggles the dropdown |
| align | "left" | Alignment of the dropdown menu |
| noClose | false | If true, prevents the dropdown from closing when clicking outside |
| duration | 50 | Animation duration in milliseconds |
| openMode | "auto" | Opening mode: "auto", "up" |
| height | "auto" | Height of the dropdown menu |

### Example with Parameters

```html
<ul class="d-menu" data-role="dropdown" data-align="right" data-no-close="true" data-duration="100">
    <!-- Menu items -->
</ul>
```

## API Methods

When using the d-menu with dropdown functionality, the following methods are available:

| Method | Description |
| ------ | ----------- |
| open(immediate, element) | Opens the dropdown menu |
| close(immediate, element) | Closes the dropdown menu |
| toggle() | Toggles the dropdown menu state |

### Example of API Usage

```javascript
// Get the dropdown plugin instance
const menu = Metro.getPlugin('#myMenu', 'dropdown');

// Open the menu
menu.open();

// Close the menu
menu.close();

// Toggle the menu
menu.toggle();
```

## Styling with CSS Variables

The D-Menu component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --d-menu-border-color | #e9e9e9 | #404959 | Border color of the menu |
| --d-menu-divider-color | #e9e9e9 | #404959 | Color of the divider line |
| --d-menu-background | #ffffff | #2b2d30 | Background color of the menu |
| --d-menu-color | #191919 | #ffffff | Text color of the menu |
| --d-menu-item-color | #191919 | #dbdfe7 | Text color of menu items |
| --d-menu-item-color-disabled | #ccc | #a8a8a8 | Text color of disabled menu items |
| --d-menu-item-color-hover | #000000 | #ffffff | Text color of menu items on hover |
| --d-menu-item-background-hover | #e8e8e8 | #1e1f22 | Background color of menu items on hover |
| --d-menu-dropdown-toogle-color | #191919 | #ffffff | Color of the dropdown toggle icon |
| --d-menu-shadow-color | #e1e1e1 | #191919 | Shadow color of the menu |
| --d-menu-border-radius | 4px | 4px | Border radius of the menu |

### Example of Custom Styling

```css
/* Custom styling for a specific menu */
.custom-menu {
    --d-menu-background: #f0f8ff;
    --d-menu-item-color: #0066cc;
    --d-menu-item-background-hover: #e6f2ff;
    --d-menu-item-color-hover: #0044aa;
    --d-menu-border-radius: 8px;
}
```

## Available CSS Classes

### Base Classes
- `.d-menu` - The main class for the dropdown menu

### Positioning Classes
- `.place-right` - Positions the menu to the right
- `.place-right-{breakpoint}` - Responsive right positioning at specific breakpoints
- `.open-left` - Opens submenus to the left

### State Classes
- `.open` - Indicates that the menu is open
- `.disabled` - Indicates a disabled menu item
- `.divider` - Creates a divider line between menu items

### Element Classes
- `.caption` - Container for the menu item text
- `.hotkey` - Container for keyboard shortcut text
- `.icon` - Container for menu item icon
- `.dropdown-toggle` - Indicates that the item has a submenu

## Accessibility

For better accessibility:
- Use semantic HTML elements (`<ul>`, `<li>`, `<a>`) for menu structure
- Include proper ARIA attributes for dropdown menus
- Ensure keyboard navigation works properly
- Provide visible focus states for all interactive elements

## Best Practices

1. Keep menu items concise and clear
2. Group related items together and use dividers to separate groups
3. Use icons consistently to improve visual recognition
4. Include keyboard shortcuts (hotkeys) for frequently used actions
5. Limit the depth of nested submenus to avoid complexity
6. Ensure menus are properly positioned to avoid being cut off by viewport edges