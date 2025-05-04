# Sidenav M3 Component

The Sidenav M3 component provides a Metro 3 style side navigation menu for your application.

## Usage

```html
<ul class="sidenav-m3">
    <li class="title">Navigation</li>
    <li>
        <a href="#">
            <span class="icon mif-home"></span>
            Home
        </a>
    </li>
    <li>
        <a href="#">
            <span class="icon mif-cog"></span>
            Settings
        </a>
    </li>
    <li>
        <a href="#">
            <span class="icon mif-user"></span>
            Profile
        </a>
    </li>
</ul>
```

## Features

### Title

Add a title to your navigation menu:

```html
<li class="title">Navigation Title</li>
```

### Icons

Add icons to menu items:

```html
<a href="#">
    <span class="icon mif-home"></span>
    Home
</a>
```

### Dropdown Menus

Add dropdown menus using the `.d-menu` class:

```html
<li>
    <a href="#" class="dropdown-toggle">
        <span class="icon mif-cog"></span>
        Settings
    </a>
    <ul class="d-menu">
        <li><a href="#">General</a></li>
        <li><a href="#">Security</a></li>
        <li><a href="#">Privacy</a></li>
    </ul>
</li>
```

### Stick Effect

Add a visual "stick" effect to menu items:

```html
<li class="stick-left">
    <a href="#">
        <span class="icon mif-home"></span>
        Home
    </a>
</li>
```

Options:
- `stick-left`: Adds a stick effect on the left side
- `stick-right`: Adds a stick effect on the right side

## RTL Support

For right-to-left languages, add the `dir="rtl"` attribute:

```html
<ul class="sidenav-m3" dir="rtl">
    <!-- Menu items -->
</ul>
```

## Styling with CSS Variables

The Sidenav M3 component can be customized using CSS variables:

| CSS Variable | Description |
|--------------|-------------|
| `--border-color` | The color of borders between menu items |

## Example

```html
<style>
    :root {
        --border-color: #e0e0e0;
    }
    
    .dark-theme {
        --border-color: #444444;
    }
    
    .sidenav-container {
        height: 100vh;
    }
</style>

<div class="sidenav-container">
    <ul class="sidenav-m3">
        <li class="title">My App</li>
        <li class="stick-left">
            <a href="#">
                <span class="icon mif-home"></span>
                Home
            </a>
        </li>
        <li>
            <a href="#">
                <span class="icon mif-cog"></span>
                Settings
            </a>
        </li>
        <li>
            <a href="#" class="dropdown-toggle">
                <span class="icon mif-user"></span>
                Account
            </a>
            <ul class="d-menu">
                <li><a href="#">Profile</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">Logout</a></li>
            </ul>
        </li>
    </ul>
</div>
```