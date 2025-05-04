# Horizontal Menu Component

The Horizontal Menu (h-menu) component provides a horizontal navigation menu with support for dropdown items and mega menus.

## Usage

```html
<ul class="h-menu">
    <li>
        <a href="#">Home</a>
    </li>
    <li>
        <a href="#" class="dropdown-toggle">Products</a>
        <ul class="d-menu">
            <li><a href="#">Product 1</a></li>
            <li><a href="#">Product 2</a></li>
            <li><a href="#">Product 3</a></li>
        </ul>
    </li>
    <li>
        <a href="#">About</a>
    </li>
    <li>
        <a href="#">Contact</a>
    </li>
</ul>
```

## Features

### Basic Menu Items

Basic menu items consist of a list item with a link:

```html
<li>
    <a href="#">Menu Item</a>
</li>
```

### Dropdown Menus

Create dropdown menus by adding the `dropdown-toggle` class to the link and including a nested `d-menu` list:

```html
<li>
    <a href="#" class="dropdown-toggle">Dropdown</a>
    <ul class="d-menu">
        <li><a href="#">Option 1</a></li>
        <li><a href="#">Option 2</a></li>
        <li><a href="#">Option 3</a></li>
    </ul>
</li>
```

### No Hover Effect

Disable the hover effect by adding the `no-hover` class to the menu:

```html
<ul class="h-menu no-hover">
    <!-- Menu items -->
</ul>
```

### Large Menu

Create a larger menu by adding the `large` class:

```html
<ul class="h-menu large">
    <!-- Menu items -->
</ul>
```

### Mega Menu

Create a mega menu by adding the `mega` class to the menu and including a `mega-container` for the content:

```html
<ul class="h-menu mega">
    <li>
        <a href="#">Home</a>
    </li>
    <li>
        <a href="#" class="dropdown-toggle">Products</a>
        <div class="mega-container">
            <div class="row">
                <div class="cell-4">
                    <h3>Category 1</h3>
                    <ul>
                        <li><a href="#">Product 1.1</a></li>
                        <li><a href="#">Product 1.2</a></li>
                        <li><a href="#">Product 1.3</a></li>
                    </ul>
                </div>
                <div class="cell-4">
                    <h3>Category 2</h3>
                    <ul>
                        <li><a href="#">Product 2.1</a></li>
                        <li><a href="#">Product 2.2</a></li>
                        <li><a href="#">Product 2.3</a></li>
                    </ul>
                </div>
                <div class="cell-4">
                    <h3>Category 3</h3>
                    <ul>
                        <li><a href="#">Product 3.1</a></li>
                        <li><a href="#">Product 3.2</a></li>
                        <li><a href="#">Product 3.3</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </li>
    <li>
        <a href="#">About</a>
    </li>
</ul>
```

## Styling

The Horizontal Menu component uses the following default styling:

- Background color: White
- Text color: Dark
- Hover background color: Light gray

Unlike some other components, the h-menu component uses LESS variables internally rather than CSS custom properties. To customize the appearance, you can use standard CSS:

```css
.custom-h-menu {
    background-color: #3b5998;
    color: white;
}

.custom-h-menu > li:hover {
    background-color: #4c70ba;
}
```

## Example

```html
<style>
    .custom-h-menu {
        background-color: #3b5998;
        color: white;
    }
    
    .custom-h-menu > li:hover {
        background-color: #4c70ba;
    }
    
    .custom-h-menu .d-menu {
        background-color: #3b5998;
        color: white;
        border-color: #2d4373;
    }
    
    .custom-h-menu .d-menu li:hover {
        background-color: #4c70ba;
    }
</style>

<ul class="h-menu custom-h-menu">
    <li>
        <a href="#">Home</a>
    </li>
    <li>
        <a href="#" class="dropdown-toggle">Products</a>
        <ul class="d-menu">
            <li><a href="#">Hardware</a></li>
            <li><a href="#">Software</a></li>
            <li><a href="#">Services</a></li>
        </ul>
    </li>
    <li>
        <a href="#">About Us</a>
    </li>
    <li>
        <a href="#">Contact</a>
    </li>
</ul>
```

This example creates a horizontal menu with a Facebook-inspired color scheme.

## JavaScript Integration

While the h-menu component itself doesn't include JavaScript functionality, you'll typically need to use it with Metro UI's dropdown component to handle the opening and closing of dropdown menus:

```html
<script>
    // Initialize dropdowns for the menu
    Metro.makePlugin(document.querySelectorAll('.h-menu .dropdown-toggle'), 'dropdown');
</script>
```