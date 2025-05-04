# NavView Component

The NavView component provides a responsive navigation panel that can be expanded or collapsed. It's ideal for creating modern, space-efficient navigation menus for applications and dashboards.

## Usage

```html
<div data-role="nav-view">
    <div class="navview-pane">
        <div class="pull-button">
            <span class="mif-menu"></span>
        </div>
        
        <div class="suggest-box">
            <input type="text" data-role="input" placeholder="Search...">
            <button class="holder">
                <span class="mif-search"></span>
            </button>
        </div>
        
        <ul class="navview-menu">
            <li class="item-header">Main Navigation</li>
            <li class="active"><a href="#"><span class="icon mif-home"></span><span class="caption">Dashboard</span></a></li>
            <li><a href="#"><span class="icon mif-user"></span><span class="caption">Users</span></a></li>
            <li><a href="#"><span class="icon mif-cog"></span><span class="caption">Settings</span></a></li>
        </ul>
    </div>
    
    <div class="navview-content">
        <div class="container-fluid">
            <!-- Your content here -->
            <h1>Dashboard</h1>
            <p>This is the main content area.</p>
        </div>
    </div>
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| navViewDeferred | number | 0 | Deferred initialization time in milliseconds |
| expandPoint | string | null | Media query point at which the navview expands (e.g., "md") |
| toggle | string | null | Selector for toggle element |
| animate | boolean | true | Whether to animate transitions |
| activeState | boolean | true | Whether to show active state for menu items |
| initialView | string | "expand" | Initial view mode ("expand" or "compact") |
| onMenuItemClick | function | Metro.noop | Event handler for menu item click |
| onPaneClose | function | Metro.noop | Event handler for pane close |
| onBeforePaneClose | function | Metro.noop | Event handler before pane close |
| onPaneOpen | function | Metro.noop | Event handler for pane open |
| onBeforePaneOpen | function | Metro.noop | Event handler before pane open |
| onNavviewCreate | function | Metro.noop | Event handler for navview creation |

## Methods

### toggle()
Toggles between expanded and compact modes.

```javascript
var navview = Metro.getPlugin('#my-navview', 'nav-view');
navview.toggle();
```

### compact()
Switches to compact mode.

```javascript
var navview = Metro.getPlugin('#my-navview', 'nav-view');
navview.compact();
```

### expand()
Switches to expanded mode.

```javascript
var navview = Metro.getPlugin('#my-navview', 'nav-view');
navview.expand();
```

### state()
Returns current state ("expand" or "compact").

```javascript
var navview = Metro.getPlugin('#my-navview', 'nav-view');
var currentState = navview.state();
console.log(currentState); // "expand" or "compact"
```

### destroy()
Destroys the component.

```javascript
var navview = Metro.getPlugin('#my-navview', 'nav-view');
navview.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onMenuItemClick | Triggered when a menu item is clicked |
| onPaneClose | Triggered when the pane is closed |
| onBeforePaneClose | Triggered before the pane is closed |
| onPaneOpen | Triggered when the pane is opened |
| onBeforePaneOpen | Triggered before the pane is opened |
| onNavviewCreate | Triggered when the navview is created |

## CSS Variables

The NavView component can be styled using the following CSS variables:

| Variable | Default (Light) | Default (Dark) | Description |
| --- | --- | --- | --- |
| --navview-pane-width | 280px | 280px | Width of the expanded navigation pane |
| --navview-pane-width-compact | 50px | 50px | Width of the compact navigation pane |
| --navview-item-border-radius | 4px | 4px | Border radius for navigation items |
| --navview-background | #f8f8f8 | #1e1f22 | Background color for the navview |
| --navview-color | #191919 | #dbdfe7 | Text color for the navview |
| --navview-pane-background | #ececec | #2b2d30 | Background color for the navigation pane |
| --navview-pane-color | #191919 | #dfe1e5 | Text color for the navigation pane |
| --navview-item-background | transparent | transparent | Background color for navigation items |
| --navview-item-color | #191919 | #dfe1e5 | Text color for navigation items |
| --navview-item-background-hover | #cecece | #43454a | Background color for hovered navigation items |
| --navview-item-color-hover | #0a0a0a | #ffffff | Text color for hovered navigation items |
| --navview-item-background-active | #cecece | #43454a | Background color for active navigation items |
| --navview-item-color-active | #0a0a0a | #ffffff | Text color for active navigation items |
| --navview-item-color-disabled | #ccc | #43454a | Text color for disabled navigation items |
| --navview-item-marker-color | #468cff | #468cff | Color for the active item marker |
| --navview-dropdown-toggle-color | #191919 | #ffffff | Color for dropdown toggle indicators |
| --navview-item-header-color | #191919 | #dfe1e5 | Color for section headers |
| --navview-item-header-border-color | #cccccc | #5d5e60 | Border color for section headers |
| --navview-scrollbar-width | 6px | 6px | Width of the scrollbar |
| --navview-scrollbar-thumb-color | #cccccc | #5d5e60 | Color of the scrollbar thumb |
| --navview-scrollbar-background-color | #ececec | #2b2d30 | Background color of the scrollbar |

## Examples

### Basic NavView
```html
<div data-role="nav-view">
    <div class="navview-pane">
        <div class="pull-button">
            <span class="mif-menu"></span>
        </div>
        <ul class="navview-menu">
            <li><a href="#"><span class="icon mif-home"></span><span class="caption">Home</span></a></li>
            <li><a href="#"><span class="icon mif-user"></span><span class="caption">Profile</span></a></li>
            <li><a href="#"><span class="icon mif-cog"></span><span class="caption">Settings</span></a></li>
        </ul>
    </div>
    <div class="navview-content">
        <h1>Content Area</h1>
    </div>
</div>
```

### NavView with Section Headers
```html
<div data-role="nav-view">
    <div class="navview-pane">
        <div class="pull-button">
            <span class="mif-menu"></span>
        </div>
        <ul class="navview-menu">
            <li class="item-header">Main</li>
            <li><a href="#"><span class="icon mif-home"></span><span class="caption">Dashboard</span></a></li>
            <li><a href="#"><span class="icon mif-chart-bars"></span><span class="caption">Analytics</span></a></li>
            
            <li class="item-header">Account</li>
            <li><a href="#"><span class="icon mif-user"></span><span class="caption">Profile</span></a></li>
            <li><a href="#"><span class="icon mif-cog"></span><span class="caption">Settings</span></a></li>
        </ul>
    </div>
    <div class="navview-content">
        <h1>Content Area</h1>
    </div>
</div>
```

### NavView with Search Box
```html
<div data-role="nav-view">
    <div class="navview-pane">
        <div class="pull-button">
            <span class="mif-menu"></span>
        </div>
        <div class="suggest-box">
            <input type="text" data-role="input" placeholder="Search...">
            <button class="holder">
                <span class="mif-search"></span>
            </button>
        </div>
        <ul class="navview-menu">
            <li><a href="#"><span class="icon mif-home"></span><span class="caption">Home</span></a></li>
            <li><a href="#"><span class="icon mif-user"></span><span class="caption">Profile</span></a></li>
        </ul>
    </div>
    <div class="navview-content">
        <h1>Content Area</h1>
    </div>
</div>
```

### NavView with Badges and Hotkeys
```html
<div data-role="nav-view">
    <div class="navview-pane">
        <div class="pull-button">
            <span class="mif-menu"></span>
        </div>
        <ul class="navview-menu">
            <li>
                <a href="#">
                    <span class="icon mif-envelop"></span>
                    <span class="caption">Messages</span>
                    <span class="badges">
                        <span class="badge bg-red fg-white">5</span>
                    </span>
                    <span class="hotkey">Ctrl+M</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <span class="icon mif-bell"></span>
                    <span class="caption">Notifications</span>
                    <span class="badges">
                        <span class="badge bg-green fg-white">New</span>
                    </span>
                </a>
            </li>
        </ul>
    </div>
    <div class="navview-content">
        <h1>Content Area</h1>
    </div>
</div>
```

### NavView with Dropdown Menus
```html
<div data-role="nav-view">
    <div class="navview-pane">
        <div class="pull-button">
            <span class="mif-menu"></span>
        </div>
        <ul class="navview-menu">
            <li>
                <a href="#" class="dropdown-toggle">
                    <span class="icon mif-cog"></span>
                    <span class="caption">Settings</span>
                </a>
                <ul class="navview-menu">
                    <li><a href="#"><span class="caption">General</span></a></li>
                    <li><a href="#"><span class="caption">Security</span></a></li>
                    <li><a href="#"><span class="caption">Privacy</span></a></li>
                </ul>
            </li>
        </ul>
    </div>
    <div class="navview-content">
        <h1>Content Area</h1>
    </div>
</div>
```

## Available CSS Classes

### Base Classes
- `.navview` - Base class for the component
- `.navview-pane` - Navigation pane container
- `.navview-content` - Content area container

### Navigation Elements
- `.navview-menu-container` - Container for the navigation menu
- `.navview-menu` - Navigation menu
- `.pull-button` - Button to toggle pane expansion
- `.holder` - Placeholder for the pull button in compact mode
- `.suggest-box` - Search box container
- `.item-header` - Section header

### Menu Item Elements
- `.caption` - Text caption for menu items
- `.icon` - Icon for menu items
- `.hotkey` - Keyboard shortcut display
- `.badges` - Container for badges
- `.badge` - Individual badge
- `.dropdown-toggle` - Dropdown toggle indicator

### State Classes
- `.active` - Class for active menu items
- `.disabled` - Class for disabled menu items
- `.compacted` - Class for compact mode
- `.expanded` - Class for expanded mode

## Best Practices

1. Use clear, recognizable icons for menu items to improve usability in compact mode
2. Group related menu items under section headers for better organization
3. Use badges sparingly to highlight important notifications or counts
4. Consider using the `expandPoint` parameter to automatically expand the navigation on larger screens
5. Provide a toggle button outside the NavView for mobile layouts where screen space is limited