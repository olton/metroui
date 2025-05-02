# Vertical Menu Component

The Vertical Menu (v-menu) component provides a vertical navigation menu with support for dropdown items, icons, hotkeys, and dividers.

## Usage

```html
<ul class="v-menu">
    <li class="menu-title">Menu Title</li>
    <li>
        <a href="#">
            <span class="icon mif-home"></span>
            <span class="caption">Home</span>
            <span class="hotkey">Ctrl+H</span>
        </a>
    </li>
    <li class="divider"></li>
    <li>
        <a href="#" class="dropdown-toggle">
            <span class="icon mif-cog"></span>
            <span class="caption">Settings</span>
        </a>
        <ul>
            <li><a href="#">General</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Privacy</a></li>
        </ul>
    </li>
    <li class="disabled">
        <a href="#">
            <span class="icon mif-user"></span>
            <span class="caption">Profile (Disabled)</span>
        </a>
    </li>
</ul>
```

## Features

### Menu Items

Basic menu items consist of an optional icon, caption, and optional hotkey:

```html
<li>
    <a href="#">
        <span class="icon mif-home"></span>
        <span class="caption">Home</span>
        <span class="hotkey">Ctrl+H</span>
    </a>
</li>
```

### Section Titles

Add section titles to organize your menu:

```html
<li class="menu-title">Section Title</li>
```

### Dividers

Add dividers to separate menu items:

```html
<li class="divider"></li>
```

### Dropdown Menus

Create nested dropdown menus:

```html
<li>
    <a href="#" class="dropdown-toggle">
        <span class="icon mif-cog"></span>
        <span class="caption">Settings</span>
    </a>
    <ul>
        <li><a href="#">General</a></li>
        <li><a href="#">Security</a></li>
        <li><a href="#">Privacy</a></li>
    </ul>
</li>
```

### Disabled Items

Disable menu items:

```html
<li class="disabled">
    <a href="#">
        <span class="icon mif-user"></span>
        <span class="caption">Profile (Disabled)</span>
    </a>
</li>
```

### Right Alignment

Align the menu to the right:

```html
<ul class="v-menu place-right">
    <!-- Menu items -->
</ul>
```

## Styling with CSS Variables

The Vertical Menu component can be customized using CSS variables:

| CSS Variable | Default Value (Light) | Default Value (Dark) | Description |
|--------------|----------------------|---------------------|-------------|
| `--v-menu-border-color` | `#e9e9e9` | `#404959` | Border color of the menu |
| `--v-menu-divider-color` | `#e9e9e9` | `#404959` | Color of menu dividers |
| `--v-menu-background` | `#ffffff` | `#11151d` | Background color of the menu |
| `--v-menu-color` | `#191919` | `#ffffff` | Text color of the menu |
| `--v-menu-item-color` | `#191919` | `#dbdfe7` | Text color of menu items |
| `--v-menu-item-color-disabled` | `#ccc` | `#173e8f` | Text color of disabled menu items |
| `--v-menu-item-color-hover` | `#000000` | `#ffffff` | Text color of menu items on hover |
| `--v-menu-item-background-hover` | `#e8e8e8` | `#222938` | Background color of menu items on hover |
| `--v-menu-dropdown-toogle-color` | `#191919` | `#ffffff` | Color of dropdown toggle indicators |
| `--v-menu-shadow-color` | `#e1e1e1` | `#191919` | Shadow color of the menu |
| `--v-menu-border-radius` | `4px` | `4px` | Border radius of menu items |

### Dark Mode

The component automatically adapts to dark mode when the `.dark-side` class is applied to a parent element:

```html
<div class="dark-side">
    <ul class="v-menu">
        <!-- Menu items -->
    </ul>
</div>
```

## Example with Custom Styling

```html
<style>
    .custom-v-menu {
        --v-menu-border-color: #3b5998;
        --v-menu-divider-color: #8b9dc3;
        --v-menu-background: #f7f7f7;
        --v-menu-color: #333333;
        --v-menu-item-color: #333333;
        --v-menu-item-color-disabled: #999999;
        --v-menu-item-color-hover: #ffffff;
        --v-menu-item-background-hover: #3b5998;
        --v-menu-dropdown-toogle-color: #3b5998;
        --v-menu-shadow-color: rgba(59, 89, 152, 0.2);
        --v-menu-border-radius: 6px;
    }
</style>

<ul class="v-menu custom-v-menu">
    <li class="menu-title">Application</li>
    <li>
        <a href="#">
            <span class="icon mif-home"></span>
            <span class="caption">Dashboard</span>
        </a>
    </li>
    <li>
        <a href="#">
            <span class="icon mif-file-text"></span>
            <span class="caption">Documents</span>
            <span class="hotkey">Ctrl+D</span>
        </a>
    </li>
    <li class="divider"></li>
    <li>
        <a href="#" class="dropdown-toggle">
            <span class="icon mif-cog"></span>
            <span class="caption">Settings</span>
        </a>
        <ul>
            <li><a href="#">Account</a></li>
            <li><a href="#">Preferences</a></li>
            <li><a href="#">Security</a></li>
        </ul>
    </li>
    <li class="disabled">
        <a href="#">
            <span class="icon mif-bell"></span>
            <span class="caption">Notifications</span>
        </a>
    </li>
</ul>
```

This example creates a vertical menu with custom styling for an application navigation.

## Note

There appears to be a potential issue in the component's CSS where some variables are using `--d-menu-*` instead of `--v-menu-*`. The documentation above uses the correct `--v-menu-*` variables as defined in the component's CSS.