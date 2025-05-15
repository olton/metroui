# Tabs Component

The Tabs Component provides a way to organize content into multiple tabs, allowing users to switch between different views without navigating to a new page.

## Plugin Parameters

The Tabs Component accepts the following parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| tabsDeferred | Number | 0 | Deferred initialization time in milliseconds |
| expand | Boolean | false | Whether to expand tabs in mobile view |
| expandPoint | String | null | Media breakpoint at which tabs expand (e.g., "md") |
| type | String | "default" | Tab style type: "default", "text", "group", "pills" |
| updateUri | Boolean | false | Update browser URL hash when switching tabs |
| position | String | "top" | Tab position: "top", "bottom", "left", "right" |
| align | String | "left" | Tab alignment: "left", "center", "right" |
| link | String | "" | Link tabs with the same link value to synchronize tab switching |
| clsTabs | String | "" | Additional CSS class for tabs container |
| clsTabsList | String | "" | Additional CSS class for tabs list |
| clsTabsListItem | String | "" | Additional CSS class for tabs list items |
| clsTabsListItemActive | String | "" | Additional CSS class for active tabs list item |

## Events

The Tabs Component provides the following events:

| Event | Description |
|-------|-------------|
| onTab | Triggered when a tab is clicked |
| onTabOpen | Triggered when a tab is opened |
| onTabClose | Triggered when a tab is closed |
| onBeforeTab | Triggered before a tab is opened (return false to cancel) |
| onTabsCreate | Triggered when the tabs component is created |

## API Methods

### next()

Switches to the next tab.

```javascript
const tabs = Metro.getPlugin('#tabs', 'tabs');
tabs.next();
```

### prev()

Switches to the previous tab.

```javascript
const tabs = Metro.getPlugin('#tabs', 'tabs');
tabs.prev();
```

### open(tab)

Opens a specific tab.

```javascript
const tabs = Metro.getPlugin('#tabs', 'tabs');
tabs.open('#tab-1'); // Open tab by target ID
tabs.open(2);        // Open tab by index
tabs.open($('#tab')); // Open tab by jQuery object
```

## CSS Styling

The Tabs Component can be styled using the following CSS variables:

```css
:root {
    --tabs-border-radius: 6px;
    --tabs-border-radius-pills: 16px;
    --tabs-background: var(--default-background);
    --tabs-color: var(--default-color);
    --tabs-hamburger-background: transparent;
    --tabs-hamburger-color: #000000;
    --tabs-item-background: var(--default-background);
    --tabs-item-color: var(--default-color);
    --tabs-item-background-hover: #f5f8fe;
    --tabs-item-color-hover: var(--default-color);
    --tabs-item-background-active: #eaeaea;
    --tabs-item-color-active: var(--default-color);
    --tabs-item-marker-active: #2bcc19;
    --tabs-item-icon-background: #ffffff;
    --tabs-item-icon-color: #000000;
}
```

### Dark Theme

The Tabs Component also supports a dark theme:

```css
.dark-side {
    --tabs-background: var(--default-background);
    --tabs-color: var(--default-color);
    --tabs-hamburger-background: transparent;
    --tabs-hamburger-color: #ffffff;
    --tabs-item-background: var(--default-background);
    --tabs-item-color: var(--default-color);
    --tabs-item-background-hover: #26282e;
    --tabs-item-color-hover: var(--default-color);
    --tabs-item-background-active: #4a4d51;
    --tabs-item-color-active: var(--default-color);
    --tabs-item-marker-active: #4fff39;
    --tabs-item-icon-background: #343637;
    --tabs-item-icon-color: #ffffff;
}
```

## Example Usage

### HTML

```html
<ul data-role="tabs" data-expand="true" data-type="pills">
    <li><a href="#tab1">Tab 1</a></li>
    <li><a href="#tab2">Tab 2</a></li>
    <li><a href="#tab3">Tab 3</a></li>
</ul>

<div id="tab1">
    Content for Tab 1
</div>
<div id="tab2">
    Content for Tab 2
</div>
<div id="tab3">
    Content for Tab 3
</div>
```

### JavaScript

```javascript
// Initialize with JavaScript
Metro.makePlugin('#my-tabs', 'tabs', {
    type: 'pills',
    position: 'top',
    align: 'center',
    onTabOpen: function(tab) {
        console.log('Tab opened:', tab);
    }
});

// Control tabs programmatically
const tabs = Metro.getPlugin('#my-tabs', 'tabs');
tabs.next();     // Switch to next tab
tabs.prev();     // Switch to previous tab
tabs.open('#tab2'); // Open specific tab
```

## Tab Types

The Tabs Component supports several tab types:

### Default Tabs

```html
<ul data-role="tabs" data-type="default">
    <!-- Tab items -->
</ul>
```

### Text Tabs

```html
<ul data-role="tabs" data-type="text">
    <!-- Tab items -->
</ul>
```

### Group Tabs

```html
<ul data-role="tabs" data-type="group">
    <!-- Tab items -->
</ul>
```

### Pills Tabs

```html
<ul data-role="tabs" data-type="pills">
    <!-- Tab items -->
</ul>
```

## Tab Positions

The Tabs Component supports different positions:

### Top Tabs (default)

```html
<ul data-role="tabs" data-position="top">
    <!-- Tab items -->
</ul>
```

### Bottom Tabs

```html
<ul data-role="tabs" data-position="bottom">
    <!-- Tab items -->
</ul>
```

### Left Tabs

```html
<ul data-role="tabs" data-position="left">
    <!-- Tab items -->
</ul>
```

### Right Tabs

```html
<ul data-role="tabs" data-position="right">
    <!-- Tab items -->
</ul>
```