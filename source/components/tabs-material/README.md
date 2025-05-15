# Material Tabs Component

The Material Tabs component provides a tabbed interface with a material design style, featuring a sliding indicator for the active tab.

## Usage

```html
<ul data-role="material-tabs">
    <li class="active"><a href="#tab1">Tab 1</a></li>
    <li><a href="#tab2">Tab 2</a></li>
    <li><a href="#tab3">Tab 3</a></li>
</ul>

<div id="tab1">Content for Tab 1</div>
<div id="tab2">Content for Tab 2</div>
<div id="tab3">Content for Tab 3</div>
```

## Plugin Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `wheelStep` | `20` | The number of pixels to scroll when using the mouse wheel |
| `materialTabsDeferred` | `0` | Delay before initialization (milliseconds) |
| `deep` | `false` | When true, reduces the z-index of the tabs |
| `fixedTabs` | `false` | When true, tabs have equal width and fill the container |
| `duration` | `300` | Animation duration in milliseconds |
| `appBar` | `false` | Adjusts positioning when used with an app bar. Set to `true` or `"more"` |
| `clsComponent` | `""` | Additional CSS class for the component wrapper |
| `clsTabs` | `""` | Additional CSS class for the tabs container |
| `clsTab` | `""` | Additional CSS class for each tab |
| `clsTabActive` | `""` | Additional CSS class for the active tab |
| `clsMarker` | `""` | Additional CSS class for the active tab marker |

## Events

| Event | Description |
|-------|-------------|
| `onBeforeTabOpen` | Triggered before a tab is opened. Return `false` to prevent the tab from opening |
| `onTabOpen` | Triggered when a tab is opened |
| `onTabsScroll` | Triggered when the tabs are scrolled |
| `onTabsCreate` | Triggered when the component is created |

## API Methods

### openTab(tab, tab_next)
Opens a specific tab.

**Parameters:**
- `tab` - The tab element to open
- `tab_next` - Boolean indicating if the tab is to the right of the current tab

```javascript
var tabs = Metro.getPlugin('#my-tabs', 'material-tabs');
tabs.openTab($('#my-tabs li').eq(1));
```

### open(tab_num)
Opens a tab by its index (1-based).

**Parameters:**
- `tab_num` - The 1-based index of the tab to open

```javascript
var tabs = Metro.getPlugin('#my-tabs', 'material-tabs');
tabs.open(2); // Opens the second tab
```

### destroy()
Removes event handlers and the element.

```javascript
var tabs = Metro.getPlugin('#my-tabs', 'material-tabs');
tabs.destroy();
```

## CSS Classes

- `.tabs-material-wrapper` - The wrapper for the tabs component
- `.tabs-material` - The main container class for the tabs
- `.with-icons` - Add to the tabs container when tabs have icons
- `.deep` - Reduces the z-index of the tabs
- `.fixed-tabs` - Makes tabs equal width and fills the container
- `.tab-marker` - The sliding indicator for the active tab
- `.tab-badge` - Used for badges on tabs

## Styling with CSS Variables

The Material Tabs component can be customized using the following CSS variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--tabs-material-background` | `#ffffff` | Controls the background color of the tabs |
| `--tabs-material-color` | `#191919` | Controls the text color of the tabs |
| `--tabs-material-marker-color` | `#000000` | Controls the color of the active tab marker |

### Example of Custom Styling

```css
.tabs-material {
    --tabs-material-background: #f5f5f5;
    --tabs-material-color: #424242;
    --tabs-material-marker-color: #2196F3;
}
```

For dark mode, the component includes a `.dark-side` class with the following variable values:

```css
.dark-side {
    --tabs-material-background: #343637;
    --tabs-material-color: #dbdfe7;
    --tabs-material-marker-color: #ff6211;
}
```