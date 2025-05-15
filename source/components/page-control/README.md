# Page Control Component

The Page Control component provides a tabbed interface for organizing content into separate tabs. It supports tab creation, activation, closing, and renaming, with features like overflow handling, context menus, and reference control.

## Usage

### Basic Usage

```html
<ul data-role="page-control">
    <li class="active">Home</li>
    <li>Profile</li>
    <li>Settings</li>
</ul>
```

### With Icons and Close Buttons

```html
<ul data-role="page-control">
    <li class="active" data-icon="mif-home">Home</li>
    <li data-icon="mif-user">Profile</li>
    <li data-icon="mif-cog" data-close="false">Settings</li>
</ul>
```

### With Reference Control

```html
<ul data-role="page-control" data-ref-control="true">
    <li class="active" data-ref="#home-content">Home</li>
    <li data-ref="#profile-content">Profile</li>
    <li data-ref="#settings-content">Settings</li>
</ul>

<div id="home-content">Home content here</div>
<div id="profile-content" style="display: none;">Profile content here</div>
<div id="settings-content" style="display: none;">Settings content here</div>
```

### JavaScript Creation

```javascript
// Create a page control programmatically
const pageControl = $("<ul>").pageControl({
    tabsPosition: "center",
    appendButton: true,
    defaultNewTabTitle: "New Tab"
}).appendTo("#container");

// Add tabs
pageControl.pageControl("addTab", {
    caption: "Home",
    icon: "mif-home",
    canClose: false
});
```

## Plugin Parameters

The Page Control component accepts the following configuration options:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `appendButton` | boolean | `true` | Show button to add new tabs |
| `tabsPosition` | string | `"left"` | Position of tabs ("left", "center", "right") |
| `customButtons` | array | `null` | Custom buttons for the control |
| `activateNewTab` | boolean | `true` | Activate newly created tabs |
| `defaultNewTabTitle` | string | `"New File"` | Default title for new tabs |
| `defaultNewCanClose` | boolean | `true` | Whether new tabs can be closed by default |
| `defaultNewTabIcon` | string | `""` | Default icon class for new tabs |
| `defaultNewTabImage` | string | `""` | Default image URL for new tabs |
| `defaultNewTabPosition` | string | `"before"` | Where to add new tabs ("before", "after") |
| `appendActions` | function | `null` | Function that returns an array of actions for the append button menu |
| `tabsActions` | function | `null` | Function that returns an array of actions for the tabs menu |
| `tabActions` | function | `null` | Function that returns an array of actions for individual tab menus |
| `refControl` | boolean | `false` | Control visibility of referenced elements based on active tab |

### Event Callbacks

| Callback | Description |
| -------- | ----------- |
| `onAppendButtonClick` | Triggered when the append button is clicked |
| `onTabCreate` | Triggered when a tab is created |
| `onTabActivate` | Triggered when a tab is activated |
| `onTabDeactivate` | Triggered when a tab is deactivated |
| `onTabBeforeClose` | Triggered before a tab is closed (return false to prevent closing) |
| `onTabClose` | Triggered when a tab is closed |
| `onTabRename` | Triggered when a tab is renamed |
| `onTabPropChange` | Triggered when a tab property is changed |
| `onTabOrganized` | Triggered when tabs are reorganized |

## API Methods

The Page Control component provides the following methods:

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `createTab(options)` | options: object | Creates a new tab with the specified options |
| `addTab(options, insert)` | options: object, insert: string | Adds a new tab with the specified options and position |
| `activateTab(tab)` | tab: element | Activates the specified tab |
| `closeTab(tab, reorg)` | tab: element, reorg: boolean | Closes the specified tab |
| `closeAll()` | - | Closes all tabs |
| `closeInactiveTabs()` | - | Closes all inactive tabs |
| `closeOtherTabs(tab)` | tab: element | Closes all tabs except the specified one |
| `closeTabsOnTheLeft(tab)` | tab: element | Closes all tabs to the left of the specified tab |
| `closeTabsOnTheRight(tab)` | tab: element | Closes all tabs to the right of the specified tab |
| `getActiveTab()` | - | Gets the currently active tab |
| `getActiveTabIndex()` | - | Gets the index of the active tab |
| `getTabByIndex(index)` | index: number | Gets a tab by its index |
| `getTabByTitle(caption)` | caption: string | Gets a tab by its caption/title |
| `setupTab(tab, prop, val)` | tab: element, prop: string, val: any | Updates a tab's property |
| `renameTab(tab)` | tab: element | Opens a dialog to rename the specified tab |
| `organizeTabs()` | - | Reorganizes tabs to fit the available space |
| `destroy()` | - | Removes the component from the DOM |

### Tab Creation Options

When using the `createTab()` or `addTab()` methods, you can pass the following options:

| Option | Type | Description |
| ------ | ---- | ----------- |
| `caption` | string | Tab title/caption |
| `icon` | string | CSS class for the tab icon |
| `image` | string | URL for the tab image |
| `canClose` | boolean | Whether the tab can be closed |
| `hasMenu` | boolean | Whether the tab has a context menu |
| `data` | any | Custom data associated with the tab |
| `ref` | string | Reference to an element controlled by the tab |

## Styling with CSS Variables

The Page Control component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--page-control-background` | #ffffff | #222222 | Background color of the page control |
| `--page-control-background-hover` | rgba(137, 137, 137, .1) | rgba(137, 137, 137, .1) | Background color on hover |
| `--page-control-closer-hover-background` | #e1e1e1 | #444444 | Background color of the close button on hover |
| `--page-control-border-color` | #e0e0e0 | #444444 | Border color of the page control |
| `--page-control-border-radius` | 6px | 6px | Border radius of the page control |

### Example of Custom Styling

```css
/* Custom styling for page control */
.custom-page-control {
    --page-control-background: #f5f5f5;
    --page-control-background-hover: rgba(0, 123, 255, 0.1);
    --page-control-closer-hover-background: #d0d0d0;
    --page-control-border-color: #cccccc;
    --page-control-border-radius: 8px;
}
```

## Available CSS Classes

### Container Classes
- `.page-control` - Main container
- `.page-control__tabs` - Container for tabs
- `.tabs-position-left` - Align tabs to the left
- `.tabs-position-center` - Align tabs to the center
- `.tabs-position-right` - Align tabs to the right

### Tab Classes
- `.page-control__tab` - Individual tab
- `.page-control__tab.active` - Active tab
- `.page-control__tab__icon` - Tab icon
- `.page-control__tab__caption` - Tab caption/title
- `.page-control__tab__closer` - Tab close button
- `.page-control__tab__menu` - Tab context menu
- `.page-control__tab__menu__holder` - Container for tab menu

### Service Classes
- `.page-control__tab__service` - Service buttons container
- `.page-control__tab__append` - Add tab button
- `.page-control__service-button` - Service button
- `.page-control__invisible_tabs_holder` - Container for overflow tabs

## Features

1. **Tab Management**: Create, activate, close, and rename tabs
2. **Overflow Handling**: Automatically moves tabs to a dropdown when there's not enough space
3. **Context Menus**: Provides context menus for tabs with various actions
4. **Reference Control**: Can control the visibility of referenced elements based on the active tab
5. **Custom Actions**: Supports custom actions for tabs and the page control
6. **Tab Icons**: Supports icons and images for tabs
7. **Tab Positioning**: Supports different tab alignment options

## Best Practices

1. Use clear, concise tab titles to help users navigate content
2. Consider using icons alongside text for better visual recognition
3. Use reference control for complex interfaces to show/hide content based on the active tab
4. Implement appropriate event handlers to respond to tab changes
5. Consider disabling tab closing for important tabs using the `canClose` option
6. Use custom tab actions for frequently used operations
7. For applications with many tabs, consider grouping related tabs or using a hierarchical structure