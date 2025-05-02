# App Bar Component

The App Bar component provides a responsive navigation bar that can be placed at the top of your application. It supports hamburger menu for mobile devices and can be expanded for larger screens.

## Usage

```html
<div class="app-bar" data-role="app-bar">
    <button class="hamburger menu-down"></button>
    <a href="#" class="brand">
        <span class="icon"><img src="..."></span>
        <span class="caption">Brand</span>
    </a>
    <ul class="app-bar-menu">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| appbarDeferred | number | 0 | Deferred initialization time in milliseconds |
| expand | boolean | false | If true, the app bar will always be expanded |
| expandPoint | string | null | Media query string at which the app bar will expand |
| duration | number | 100 | Animation duration for menu open/close in milliseconds |
| checkHamburgerColor | boolean | false | If true, hamburger color will be set dependent on app-bar background color |

## Methods

### open()
Opens the app bar menu.

```javascript
var appbar = Metro.getPlugin('#app-bar', 'app-bar');
appbar.open();
```

### close()
Closes the app bar menu.

```javascript
var appbar = Metro.getPlugin('#app-bar', 'app-bar');
appbar.close();
```

### destroy()
Destroys the app bar component.

```javascript
var appbar = Metro.getPlugin('#app-bar', 'app-bar');
appbar.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onMenuOpen | Triggered when menu is opened |
| onMenuClose | Triggered when menu is closed |
| onBeforeMenuOpen | Triggered before menu is opened |
| onBeforeMenuClose | Triggered before menu is closed |
| onMenuCollapse | Triggered when menu is collapsed |
| onMenuExpand | Triggered when menu is expanded |
| onAppBarCreate | Triggered when app bar is created |

## CSS Variables

The App Bar component can be styled using the following CSS variables:

| Variable | Default (Light) | Default (Dark) | Description |
| --- | --- | --- | --- |
| --appbar-border-radius | 4px | 4px | Border radius of app bar items |
| --appbar-z-index | @zindex-fixed | @zindex-fixed | Z-index of the app bar |
| --appbar-background | #ffffff | #1e1f22 | Background color of the app bar |
| --appbar-color | #191919 | #dbdfe7 | Text color of the app bar |
| --appbar-item-background | transparent | transparent | Background color of app bar items |
| --appbar-item-color | #191919 | #dbdfe7 | Text color of app bar items |
| --appbar-item-color-disabled | #ccc | #a8a8a8 | Text color of disabled app bar items |
| --appbar-item-color-hover | #000000 | #ffffff | Text color of app bar items on hover |
| --appbar-item-background-hover | #e8e8e8 | #2b2d30 | Background color of app bar items on hover |

## Example

```html
<div class="app-bar" data-role="app-bar" data-expand-point="md">
    <a href="#" class="brand">
        <span class="caption">Metro UI</span>
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

## Custom Styling Example

```css
.my-custom-app-bar {
    --appbar-background: #3498db;
    --appbar-color: #ffffff;
    --appbar-item-color: #ffffff;
    --appbar-item-background-hover: rgba(255, 255, 255, 0.2);
    --appbar-item-color-hover: #ffffff;
}
```

```html
<div class="app-bar my-custom-app-bar" data-role="app-bar">
    <!-- App bar content -->
</div>
```