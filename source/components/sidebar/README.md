# Sidebar Component

The Sidebar component provides a collapsible side panel for navigation, settings, or other content. It can be positioned on either side of the screen and supports both static and dynamic modes.

## Usage

### Basic Sidebar

```html
<!-- Basic sidebar with header and menu -->
<div data-role="sidebar">
    <div class="sidebar-header">
        <div class="avatar">
            <img src="path/to/avatar.jpg">
        </div>
        <span class="title">John Doe</span>
        <span class="subtitle">Web Developer</span>
    </div>
    <ul class="sidebar-menu">
        <li class="active"><a href="#"><span class="icon mif-home"></span>Home</a></li>
        <li><a href="#"><span class="icon mif-user"></span>Profile</a></li>
        <li><a href="#"><span class="icon mif-cog"></span>Settings</a></li>
        <li class="divider"></li>
        <li><a href="#"><span class="icon mif-exit"></span>Logout</a></li>
    </ul>
</div>
```

### Sidebar with Toggle Button

```html
<!-- Sidebar with toggle button -->
<button class="button" id="sidebar-toggle">Toggle Sidebar</button>

<div data-role="sidebar" data-toggle="#sidebar-toggle">
    <!-- Sidebar content -->
</div>
```

### Sidebar with Group Titles

```html
<div data-role="sidebar">
    <ul class="sidebar-menu">
        <li class="group-title">Main Navigation</li>
        <li><a href="#"><span class="icon mif-home"></span>Home</a></li>
        <li><a href="#"><span class="icon mif-user"></span>Profile</a></li>
        
        <li class="group-title">Settings</li>
        <li><a href="#"><span class="icon mif-cog"></span>General</a></li>
        <li><a href="#"><span class="icon mif-bell"></span>Notifications</a></li>
    </ul>
</div>
```

### Sidebar with Hotkeys

```html
<div data-role="sidebar">
    <ul class="sidebar-menu">
        <li><a href="#"><span class="icon mif-home"></span>Home<span class="hotkey">Alt+H</span></a></li>
        <li><a href="#"><span class="icon mif-user"></span>Profile<span class="hotkey">Alt+P</span></a></li>
    </ul>
</div>
```

## Component Parameters

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| menuScrollbar | false | Whether to show scrollbars in the menu |
| sidebarDeferred | 0 | Delay before initialization (in milliseconds) |
| position | "left" | Position of the sidebar ("left" or "right") |
| shift | null | Selector for elements to be shifted when the sidebar opens |
| staticShift | null | Selector for elements to be shifted when the sidebar is in static mode |
| toggle | null | Selector for the element that toggles the sidebar |
| duration | METRO_ANIMATION_DURATION | Duration of the animation when opening/closing |
| static | null | Breakpoint at which the sidebar becomes static (e.g., "lg", "md") |
| closeOutside | true | Whether to close the sidebar when clicking outside |
| onOpen | Metro.noop | Callback function when the sidebar opens |
| onClose | Metro.noop | Callback function when the sidebar closes |
| onToggle | Metro.noop | Callback function when the sidebar toggles |
| onStaticSet | Metro.noop | Callback function when the sidebar enters static mode |
| onStaticLoss | Metro.noop | Callback function when the sidebar exits static mode |
| onSidebarCreate | Metro.noop | Callback function when the sidebar is created |

## API Methods

### Metro.sidebarSetup(options)

Configure global default options for all sidebar components.

```javascript
Metro.sidebarSetup({
    position: "right",
    closeOutside: false
});
```

### Instance Methods

These methods can be called on a sidebar instance:

```javascript
// Get sidebar instance
var sidebar = Metro.getPlugin('#mySidebar', 'sidebar');

// Call methods
sidebar.open();
sidebar.close();
sidebar.toggle();
var isOpen = sidebar.isOpen();
```

### Static Methods

These methods can be called directly on the Metro.sidebar object:

```javascript
// Open sidebar
Metro.sidebar.open('#mySidebar');

// Close sidebar
Metro.sidebar.close('#mySidebar');

// Toggle sidebar
Metro.sidebar.toggle('#mySidebar');

// Check if sidebar is open
var isOpen = Metro.sidebar.isOpen('#mySidebar');
```

## HTML Structure

```html
<div data-role="sidebar">
    <!-- Optional header -->
    <div class="sidebar-header">
        <div class="avatar"><!-- Avatar content --></div>
        <span class="title"><!-- Title --></span>
        <span class="subtitle"><!-- Subtitle --></span>
        <span class="action"><!-- Action button --></span>
    </div>
    
    <!-- Menu -->
    <ul class="sidebar-menu">
        <li class="group-title"><!-- Group title --></li>
        <li class="active">
            <a href="#">
                <span class="icon"><!-- Icon --></span>
                <!-- Menu item text -->
                <span class="hotkey"><!-- Hotkey --></span>
            </a>
        </li>
        <li class="divider"></li>
        <!-- More menu items -->
    </ul>
    
    <!-- Optional content -->
    <div class="sidebar-content">
        <!-- Additional content -->
    </div>
</div>
```

## Styling with CSS Variables

The Sidebar component can be styled using the following CSS variables:

| Variable | Light Mode | Dark Mode | Description |
| -------- | ---------- | --------- | ----------- |
| --sidebar-width | 240px | 240px | Width of the sidebar |
| --sidebar-background | #ffffff | #2b2d30 | Background color of the sidebar |
| --sidebar-color | #191919 | #dbdfe7 | Text color of the sidebar |
| --sidebar-header-background | #f8f8f8 | #1e1f22 | Background color of the header |
| --sidebar-header-color | #191919 | #dbdfe7 | Text color of the header |
| --sidebar-border-color | #e8e8e8 | #343538 | Color of the sidebar borders |
| --sidebar-avatar-background | #ffffff | #2b2d30 | Background color of the avatar |
| --sidebar-avatar-color | #191919 | #ffffff | Text color of the avatar |
| --sidebar-avatar-border-color | #fff | #fff | Border color of the avatar |
| --sidebar-menu-background | #ffffff | #2b2d30 | Background color of the menu |
| --sidebar-menu-color | #191919 | #dbdfe7 | Text color of the menu |
| --sidebar-item-background | inherit | inherit | Background color of menu items |
| --sidebar-item-color | #191919 | #dbdfe7 | Text color of menu items |
| --sidebar-item-background-hover | #cecece | #1e1f22 | Background color of menu items on hover |
| --sidebar-item-color-hover | #0a0a0a | #ffffff | Text color of menu items on hover |
| --sidebar-item-marker-color | #468cff | #468cff | Color of the active item marker |
| --sidebar-item-color-disabled | #ccc | #43454a | Text color of disabled menu items |

### Example of Custom Styling

```css
/* Custom sidebar styling */
:root {
    --sidebar-width: 280px;
    --sidebar-background: #f0f7ff;
    --sidebar-color: #0d47a1;
    --sidebar-header-background: #1976d2;
    --sidebar-header-color: #ffffff;
    --sidebar-item-background-hover: #bbdefb;
    --sidebar-item-color-hover: #0d47a1;
    --sidebar-item-marker-color: #ff4081;
}
```

## Dark Mode Support

The Sidebar component automatically adjusts its colors when the `.dark-side` class is applied to a parent element, providing appropriate styling for dark mode interfaces.

## Accessibility

The sidebar menu should use proper semantic HTML for navigation:

```html
<nav data-role="sidebar">
    <ul class="sidebar-menu" role="menu">
        <li role="menuitem"><a href="#">Home</a></li>
        <!-- More menu items -->
    </ul>
</nav>
```

## Best Practices

1. Use the sidebar for primary navigation or secondary controls
2. Keep the sidebar content focused and organized
3. Use group titles to categorize menu items
4. Consider using static mode for larger screens and collapsible mode for mobile
5. Provide a clear toggle button when the sidebar is hidden
6. Use consistent icons and labels for better usability
7. Ensure the sidebar doesn't obscure important content when open
8. Use the dark mode support to ensure the sidebar looks appropriate in both light and dark interfaces