# Window Component

The Window component provides a customizable floating window interface with features like dragging, resizing, minimizing, and maximizing. It can be used to create modal dialogs, information panels, or application windows.

## Usage

```html
<!-- Basic usage -->
<div id="my-window" data-role="window" data-title="My Window">
    Window content goes here
</div>

<!-- With custom options -->
<div data-role="window" 
     data-title="Custom Window"
     data-icon="<span class='mif-apps'></span>"
     data-width="640"
     data-height="480"
     data-place="center"
     data-btn-min="true"
     data-btn-max="true"
     data-resizable="true">
    <p>Window content goes here</p>
</div>
```

You can also create windows dynamically using JavaScript:

```javascript
// Create window with options
var win = Metro.window.create({
    title: "Dynamic Window",
    content: "<div>Window content</div>",
    width: 400,
    height: 300,
    place: "center",
    icon: "<span class='mif-rocket'></span>"
});
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `windowDeferred` | Number | `0` | Defer initialization of component in milliseconds |
| `hidden` | Boolean | `false` | Whether window is initially hidden |
| `width` | String/Number | `"auto"` | Window width |
| `height` | String/Number | `"auto"` | Window height |
| `btnClose` | Boolean | `true` | Show close button |
| `btnMin` | Boolean | `true` | Show minimize button |
| `btnMax` | Boolean | `true` | Show maximize button |
| `draggable` | Boolean | `true` | Allow window to be dragged |
| `dragElement` | String | `".window-caption .title"` | Element used for dragging |
| `dragArea` | String | `"parent"` | Area where window can be dragged |
| `shadow` | Boolean | `false` | Add shadow to window |
| `icon` | String | `""` | Icon HTML for window caption |
| `title` | String | `"Window"` | Window title |
| `content` | String/Function/Element | `null` | Window content |
| `resizable` | Boolean | `true` | Allow window to be resized |
| `overlay` | Boolean | `false` | Create overlay behind window |
| `overlayColor` | String | `"transparent"` | Overlay color |
| `overlayAlpha` | Number | `0.5` | Overlay opacity |
| `modal` | Boolean | `false` | Make window modal (disables minimize and maximize) |
| `position` | String | `"absolute"` | CSS position value |
| `checkEmbed` | Boolean | `true` | Check if content is a video embed |
| `top` | String/Number | `"auto"` | Initial top position |
| `left` | String/Number | `"auto"` | Initial left position |
| `place` | String | `"auto"` | Window placement: "auto" or positioning values like "top-left", "center", etc. |
| `closeAction` | String | `Metro.actions.HIDE` | Action on close: REMOVE or HIDE |
| `customButtons` | Object | `null` | Custom buttons for window caption |
| `status` | String | `""` | Status bar text |
| `canClose` | Boolean | `true` | Whether window can be closed |
| `canMaximize` | Boolean | `true` | Whether window can be maximized |
| `canMinimize` | Boolean | `true` | Whether window can be minimized |
| `clsCustomButton` | String | `""` | Additional class for custom buttons |
| `clsCaption` | String | `""` | Additional class for caption |
| `clsContent` | String | `""` | Additional class for content |
| `clsWindow` | String | `""` | Additional class for window |
| `minWidth` | Number | `0` | Minimum window width |
| `minHeight` | Number | `0` | Minimum window height |
| `maxWidth` | Number | `0` | Maximum window width (0 = no limit) |
| `maxHeight` | Number | `0` | Maximum window height (0 = no limit) |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `onDragStart` | `{}` | Triggered when window dragging starts |
| `onDragStop` | `{}` | Triggered when window dragging stops |
| `onDragMove` | `{}` | Triggered when window is being dragged |
| `onWindowClick` | `{win, e}` | Triggered when window is clicked |
| `onCaptionClick` | `{win, e}` | Triggered when caption is clicked |
| `onCaptionDblClick` | `{win}` | Triggered when caption is double-clicked |
| `onCloseClick` | `{win}` | Triggered when close button is clicked |
| `onMaxClick` | `{win}` | Triggered when maximize button is clicked |
| `onMinClick` | `{win}` | Triggered when minimize button is clicked |
| `onResizeStart` | `{}` | Triggered when resizing starts |
| `onResizeStop` | `{}` | Triggered when resizing stops |
| `onResize` | `{}` | Triggered when window is being resized |
| `onWindowCreate` | `{win, element}` | Triggered after window creation |
| `onShow` | `{win, element}` | Triggered when window is shown |
| `onWindowDestroy` | `{win}` | Triggered before window is destroyed |
| `onCanClose` | `{win}` | Function that determines if window can be closed |
| `onMinimize` | `{win}` | Triggered when window is minimized |
| `onMaximize` | `{win}` | Triggered when window is maximized |
| `onClose` | `{win}` | Triggered when window is closed |

## API Methods

### Instance Methods

These methods are accessed through the component instance:

```javascript
// Get window component
var window = $("#my-window").data("window");

// Call method on instance
window.setTitle("New Title");
```

| Method | Parameters | Description |
| --- | --- | --- |
| `width(value)` | `value` (optional) | Get or set window width |
| `height(value)` | `value` (optional) | Get or set window height |
| `maximize(event)` | `event` | Maximize the window |
| `minimize()` | - | Minimize the window |
| `close()` | - | Close the window |
| `hide()` | - | Hide the window |
| `show()` | - | Show the window |
| `toggle()` | - | Toggle window visibility |
| `isOpen()` | - | Check if window is visible |
| `min(toggle)` | `toggle` | Set minimized state |
| `max(toggle)` | `toggle` | Set maximized state |
| `setContent(content)` | `content` | Set window content |
| `setTitle(title)` | `title` | Set window title |
| `setIcon(icon)` | `icon` | Set window icon |
| `getIcon()` | - | Get window icon |
| `getTitle()` | - | Get window title |
| `toggleDraggable(flag)` | `flag` | Enable/disable dragging |
| `toggleResizable(flag)` | `flag` | Enable/disable resizing |
| `pos(top, left)` | `top, left` | Set window position |
| `top(value)` | `value` | Set window top position |
| `left(value)` | `value` | Set window left position |

### Static Methods

Metro.window provides static methods to control windows:

```javascript
// Using static methods
Metro.window.min("#my-window", true);
Metro.window.close("#my-window");
```

| Method | Parameters | Description |
| --- | --- | --- |
| `Metro.window.min(el, flag)` | `el, flag` | Minimize window |
| `Metro.window.max(el, flag)` | `el, flag` | Maximize window |
| `Metro.window.show(el)` | `el` | Show window |
| `Metro.window.hide(el)` | `el` | Hide window |
| `Metro.window.toggle(el)` | `el` | Toggle window visibility |
| `Metro.window.isOpen(el)` | `el` | Check if window is open |
| `Metro.window.close(el)` | `el` | Close window |
| `Metro.window.pos(el, top, left)` | `el, top, left` | Set window position |
| `Metro.window.top(el, top)` | `el, top` | Set window top position |
| `Metro.window.left(el, left)` | `el, left` | Set window left position |
| `Metro.window.width(el, width)` | `el, width` | Set window width |
| `Metro.window.height(el, height)` | `el, height` | Set window height |
| `Metro.window.create(options, parent)` | `options, parent` | Create new window |

## Window Placement Options

The `place` option allows you to position the window in different areas:

- `"center"` (default when `"auto"`) - Center of parent
- `"top-left"` - Top-left corner
- `"top-center"` - Top-center
- `"top-right"` - Top-right corner
- `"right-center"` - Right-center
- `"bottom-right"` - Bottom-right corner
- `"bottom-center"` - Bottom-center
- `"bottom-left"` - Bottom-left corner
- `"left-center"` - Left-center

## Custom Buttons

You can add custom buttons to the window caption:

```javascript
Metro.window.create({
    title: "Window with custom buttons",
    customButtons: [
        {
            html: "<span class='mif-rocket'></span>",
            cls: "alert",
            onclick: function() {
                alert("Custom button clicked!");
            }
        },
        {
            html: "<span class='mif-cog'></span>",
            cls: "",
            onclick: function() {
                alert("Settings button clicked!");
            }
        }
    ]
});
```

## CSS Variables

The window component uses the following CSS variables that you can customize:

| Variable | Default (Light Theme) | Default (Dark Theme) | Description |
| --- | --- | --- | --- |
| `--window-scrollbar-size` | `6px` | `6px` | Scrollbar size |
| `--window-scrollbar-track-radius` | `0` | `0` | Scrollbar track radius |
| `--window-border-size` | `4px` | `4px` | Window border size |
| `--window-border-radius` | `6px` | `6px` | Window border radius |
| `--window-border-color` | `#f3f3f3` | `#484b4c` | Window border color |
| `--window-background` | `#fff` | `#1e1f22` | Window background color |
| `--window-color` | `#191919` | `#dbdfe7` | Window text color |
| `--window-caption-color` | `#191919` | `#dbdfe7` | Caption text color |
| `--window-scrollbar-thumb-color` | `#a8a8a8` | `#d1d1d1` | Scrollbar thumb color |
| `--window-scrollbar-track-color` | `#f1f1f1` | `#2c2c2c` | Scrollbar track color |
| `--window-resize-element-color` | `#a8a8a8` | `#2c2c2c` | Resize handle color |
| `--window-sys-button-color` | `#191919` | `#ffffff` | System button color |
| `--window-sys-button-backgroud-hover` | `#d8d8d8` | `#2c2c2c` | System button hover background |
| `--window-close-button-backgroud-hover` | `#C75050FF` | `#C75050FF` | Close button hover background |
| `--window-close-button-color-hover` | `#ffffff` | `#ffffff` | Close button hover text color |

Example of customizing CSS variables:

```css
:root {
    --window-border-radius: 10px;
    --window-border-color: #0078d7;
    --window-caption-color: #ffffff;
}
```

## Colored Windows

You can add predefined color classes to your windows:

```html
<!-- Info window -->
<div data-role="window" class="info-window">Info window</div>

<!-- Alert window -->
<div data-role="window" class="alert-window">Alert window</div>

<!-- Warning window -->
<div data-role="window" class="warning-window">Warning window</div>

<!-- Success window -->
<div data-role="window" class="success-window">Success window</div>
```

## Global Configuration

You can globally configure the window component using the `Metro.windowSetup` method:

```javascript
Metro.windowSetup({
    shadow: true,
    draggable: true,
    resizable: true,
    btnMax: false,
    place: "center"
});
```
