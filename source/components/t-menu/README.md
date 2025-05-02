# Tile Menu Component

The Tile Menu (t-menu) component provides a tile-based navigation menu with support for both vertical and horizontal layouts, as well as dropdown submenus. It's designed for icon-based navigation.

## Usage

```html
<ul class="t-menu open">
    <li>
        <a href="#">
            <span class="mif-home"></span>
        </a>
    </li>
    <li>
        <a href="#" class="dropdown-toggle">
            <span class="mif-cog"></span>
        </a>
        <ul class="t-menu">
            <li><a href="#"><span class="mif-wrench"></span></a></li>
            <li><a href="#"><span class="mif-user"></span></a></li>
            <li><a href="#"><span class="mif-lock"></span></a></li>
        </ul>
    </li>
    <li>
        <a href="#">
            <span class="mif-bell"></span>
        </a>
    </li>
</ul>
```

## Features

### Basic Menu Items

Basic menu items consist of a list item with a link containing an icon:

```html
<li>
    <a href="#">
        <span class="mif-home"></span>
    </a>
</li>
```

### Horizontal Layout

By default, the t-menu is vertical. To create a horizontal menu, add the `horizontal` class:

```html
<ul class="t-menu horizontal open">
    <!-- Menu items -->
</ul>
```

### Compact Size

For smaller tiles (40px instead of the default 60px), add the `compact` class:

```html
<ul class="t-menu compact open">
    <!-- Menu items -->
</ul>
```

### Dropdown Menus

Create dropdown menus by adding the `dropdown-toggle` class to the link and including a nested `t-menu` list:

```html
<li>
    <a href="#" class="dropdown-toggle">
        <span class="mif-cog"></span>
    </a>
    <ul class="t-menu">
        <li><a href="#"><span class="mif-wrench"></span></a></li>
        <li><a href="#"><span class="mif-user"></span></a></li>
        <li><a href="#"><span class="mif-lock"></span></a></li>
    </ul>
</li>
```

### Displaying the Menu

The t-menu is hidden by default. To display it, add the `open` class:

```html
<ul class="t-menu open">
    <!-- Menu items -->
</ul>
```

## Styling with CSS Variables

The Tile Menu component can be customized using CSS variables:

| CSS Variable | Default Value (Light) | Default Value (Dark) | Description |
|--------------|----------------------|---------------------|-------------|
| `--t-menu-border-radius` | `6px` | `6px` | Border radius of the menu |
| `--t-menu-border-color` | `#ececec` | `#484b4c` | Border color of the menu |
| `--t-menu-background` | `#fefefe` | `#343637` | Background color of the menu |
| `--t-menu-color` | `#191919` | `#dbdfe7` | Text color of the menu |

### Dark Mode

The component automatically adapts to dark mode when the `.dark-side` class is applied to a parent element:

```html
<div class="dark-side">
    <ul class="t-menu open">
        <!-- Menu items -->
    </ul>
</div>
```

## Example with Custom Styling

```html
<style>
    .custom-t-menu {
        --t-menu-border-radius: 8px;
        --t-menu-border-color: #3b5998;
        --t-menu-background: #4c70ba;
        --t-menu-color: #ffffff;
    }
    
    .custom-t-menu > li:hover {
        background-color: #3b5998;
    }
</style>

<ul class="t-menu horizontal compact open custom-t-menu">
    <li>
        <a href="#">
            <span class="mif-home"></span>
        </a>
    </li>
    <li>
        <a href="#" class="dropdown-toggle">
            <span class="mif-cog"></span>
        </a>
        <ul class="t-menu custom-t-menu">
            <li><a href="#"><span class="mif-wrench"></span></a></li>
            <li><a href="#"><span class="mif-user"></span></a></li>
            <li><a href="#"><span class="mif-lock"></span></a></li>
        </ul>
    </li>
    <li>
        <a href="#">
            <span class="mif-bell"></span>
        </a>
    </li>
    <li>
        <a href="#">
            <span class="mif-apps"></span>
        </a>
    </li>
    <li>
        <a href="#">
            <span class="mif-exit"></span>
        </a>
    </li>
</ul>
```

This example creates a horizontal, compact tile menu with Facebook-inspired styling.

## JavaScript Integration

While the t-menu component itself doesn't include JavaScript functionality, you'll typically need to use it with Metro UI's dropdown component to handle the opening and closing of dropdown menus:

```html
<script>
    // Initialize dropdowns for the menu
    Metro.makePlugin(document.querySelectorAll('.t-menu .dropdown-toggle'), 'dropdown', {
        dropFilter: '.t-menu'
    });
    
    // To manually open the menu
    document.querySelector('.t-menu').classList.add('open');
</script>
```

## Nesting Menus

You can create complex navigation structures by nesting t-menus:

```html
<ul class="t-menu open">
    <li>
        <a href="#" class="dropdown-toggle">
            <span class="mif-cog"></span>
        </a>
        <ul class="t-menu">
            <li><a href="#"><span class="mif-wrench"></span></a></li>
            <li>
                <a href="#" class="dropdown-toggle">
                    <span class="mif-user"></span>
                </a>
                <ul class="t-menu">
                    <li><a href="#"><span class="mif-profile"></span></a></li>
                    <li><a href="#"><span class="mif-security"></span></a></li>
                </ul>
            </li>
            <li><a href="#"><span class="mif-lock"></span></a></li>
        </ul>
    </li>
</ul>
```

This creates a nested menu structure with multiple levels of navigation.