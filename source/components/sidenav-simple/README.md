# Sidenav Simple Component

The Sidenav Simple component provides a compact, icon-based side navigation menu that can expand to show titles.

## Usage

```html
<ul class="sidenav-simple">
    <li>
        <a href="#">
            <span class="icon mif-home"></span>
            <span class="title">Home</span>
        </a>
    </li>
    <li>
        <a href="#">
            <span class="icon mif-cog"></span>
            <span class="title">Settings</span>
        </a>
    </li>
    <li class="active">
        <a href="#">
            <span class="icon mif-user"></span>
            <span class="title">Profile</span>
        </a>
    </li>
</ul>
```

## Features

### Compact Design

By default, the Sidenav Simple component is in a collapsed state with a width of 52px, showing only icons.

### Icons

Add icons to menu items:

```html
<a href="#">
    <span class="icon mif-home"></span>
    <span class="title">Home</span>
</a>
```

### Active State

Mark the current active menu item:

```html
<li class="active">
    <a href="#">
        <span class="icon mif-home"></span>
        <span class="title">Home</span>
    </a>
</li>
```

### Expandable Navigation

The sidenav can expand to show titles using responsive classes:

```html
<ul class="sidenav-simple sidenav-simple-expand-md">
    <!-- Menu items -->
</ul>
```

Available expansion breakpoints:
- `sidenav-simple-expand-sm`: Expands on small screens and larger
- `sidenav-simple-expand-md`: Expands on medium screens and larger
- `sidenav-simple-expand-lg`: Expands on large screens and larger
- `sidenav-simple-expand-xl`: Expands on extra-large screens and larger
- `sidenav-simple-expand-xxl`: Expands on extra-extra-large screens and larger

When expanded, the navigation width increases to 220px and titles become visible.

### RTL Support

For right-to-left languages, add the `dir="rtl"` attribute:

```html
<ul class="sidenav-simple" dir="rtl">
    <!-- Menu items -->
</ul>
```

## Styling

The Sidenav Simple component uses the following styling:

- Default width: 52px (collapsed)
- Expanded width: 220px
- Background color: Light
- Hover state: Light hover background
- Active state: Cyan background with white text

## Example

```html
<style>
    .sidenav-container {
        height: 100vh;
    }
</style>

<div class="sidenav-container">
    <ul class="sidenav-simple sidenav-simple-expand-lg">
        <li>
            <a href="#">
                <span class="icon mif-home"></span>
                <span class="title">Home</span>
            </a>
        </li>
        <li class="active">
            <a href="#">
                <span class="icon mif-cog"></span>
                <span class="title">Settings</span>
            </a>
        </li>
        <li>
            <a href="#">
                <span class="icon mif-user"></span>
                <span class="title">Profile</span>
            </a>
        </li>
        <li>
            <a href="#">
                <span class="icon mif-bell"></span>
                <span class="title">Notifications</span>
            </a>
        </li>
        <li>
            <a href="#">
                <span class="icon mif-exit"></span>
                <span class="title">Logout</span>
            </a>
        </li>
    </ul>
</div>
```

This example creates a simple side navigation that expands on large screens to show both icons and titles.