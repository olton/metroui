# Panel Component

The Panel component provides a flexible container with optional title, collapsible functionality, and draggable capabilities. It's useful for organizing content into distinct sections with a consistent visual style.

## Usage

```html
<div data-role="panel">
    <div class="panel-content">
        Panel content goes here
    </div>
</div>
```

### Panel with Title

```html
<div data-role="panel" data-title-caption="Panel Title">
    <div class="panel-content">
        Panel content with a title
    </div>
</div>
```

### Collapsible Panel

```html
<div data-role="panel" data-title-caption="Collapsible Panel" data-collapsible="true">
    <div class="panel-content">
        This panel can be collapsed
    </div>
</div>
```

### Draggable Panel

```html
<div data-role="panel" data-title-caption="Draggable Panel" data-draggable="true">
    <div class="panel-content">
        This panel can be dragged
    </div>
</div>
```

### Panel with Custom Buttons

```html
<div data-role="panel" 
     data-title-caption="Panel with Custom Buttons"
     data-custom-buttons='[
        {
            "html": "<span class=\"mif-cog\"></span>",
            "cls": "bg-transparent",
            "onclick": "alert(\'Settings clicked\')"
        },
        {
            "html": "<span class=\"mif-cross\"></span>",
            "cls": "bg-transparent",
            "onclick": "$(this).closest(\'.panel\').hide()"
        }
     ]'>
    <div class="panel-content">
        Panel with custom buttons in the title
    </div>
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| panelDeferred | number | 0 | Deferred initialization time in milliseconds |
| id | string | null | Panel ID (auto-generated if not provided) |
| titleCaption | string | "" | Caption for the panel title |
| titleIcon | string | "" | Icon for the panel title (HTML string) |
| collapsible | boolean | false | Whether the panel can be collapsed |
| collapsed | boolean | false | Whether the panel is initially collapsed |
| collapseDuration | number | 100 | Duration of collapse/expand animation in milliseconds |
| width | string | "auto" | Panel width |
| height | string | "auto" | Panel height |
| draggable | boolean | false | Whether the panel can be dragged |
| customButtons | object | null | Custom buttons for the panel title |
| clsPanel | string | "" | Additional CSS class for the panel |
| clsTitle | string | "" | Additional CSS class for the panel title |
| clsTitleCaption | string | "" | Additional CSS class for the title caption |
| clsTitleIcon | string | "" | Additional CSS class for the title icon |
| clsContent | string | "" | Additional CSS class for the panel content |
| clsCollapseToggle | string | "" | Additional CSS class for the collapse toggle |
| clsCustomButton | string | "" | Additional CSS class for custom buttons |

## Methods

### customButtons(buttons)
Adds custom buttons to the panel title.

```javascript
var panel = Metro.getPlugin('#myPanel', 'panel');
panel.customButtons([
    {
        html: "<span class='mif-cog'></span>",
        cls: "bg-transparent",
        onclick: function() {
            alert('Settings clicked');
        }
    }
]);
```

### collapse()
Collapses the panel.

```javascript
var panel = Metro.getPlugin('#myPanel', 'panel');
panel.collapse();
```

### expand()
Expands the panel.

```javascript
var panel = Metro.getPlugin('#myPanel', 'panel');
panel.expand();
```

### open()
Alias for expand().

```javascript
var panel = Metro.getPlugin('#myPanel', 'panel');
panel.open();
```

### close()
Alias for collapse().

```javascript
var panel = Metro.getPlugin('#myPanel', 'panel');
panel.close();
```

### destroy()
Destroys the panel component.

```javascript
var panel = Metro.getPlugin('#myPanel', 'panel');
panel.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onCollapse | Triggered when panel is collapsed |
| onExpand | Triggered when panel is expanded |
| onDragStart | Triggered when panel drag starts |
| onDragStop | Triggered when panel drag stops |
| onDragMove | Triggered when panel is being dragged |
| onPanelCreate | Triggered when panel is created |

## CSS Variables

The Panel component can be styled using the following CSS variables:

| Variable | Default (Light) | Default (Dark) | Description |
| --- | --- | --- | --- |
| --panel-header-background | #fbfbfb | #282c35 | Background color of the panel header |
| --panel-header-color | #191919 | #fbfbfb | Text color of the panel header |
| --panel-header-icon-background | #fbfbfb | #282c35 | Background color of the icon in the panel header |
| --panel-header-icon-color | #191919 | #fbfbfb | Color of the icon in the panel header |
| --panel-background | #ffffff | #2b2d30 | Background color of the panel |
| --panel-color | #191919 | #dbdfe7 | Text color of the panel content |
| --panel-border-color | #e8e8e8 | #4a4d51 | Color of the panel border |
| --panel-border-radius | 6px | 6px | Border radius of the panel |
| --panel-dropdown-toogle-color | #191919 | #ffffff | Color of the dropdown toggle in the panel header |

## Custom Styling Example

```css
.custom-panel {
    --panel-header-background: #3498db;
    --panel-header-color: #ffffff;
    --panel-background: #ecf0f1;
    --panel-color: #2c3e50;
    --panel-border-color: #bdc3c7;
    --panel-border-radius: 10px;
}
```

```html
<div data-role="panel" class="custom-panel" data-title-caption="Custom Styled Panel">
    <div class="panel-content">
        This panel has custom styling
    </div>
</div>
```