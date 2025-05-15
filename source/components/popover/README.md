# Popover Component

The Popover component provides a way to display additional information or content when a user interacts with an element. It can be triggered by hover, click, or focus events and can be positioned around the target element.

## Usage

```html
<!-- Basic popover triggered by hover -->
<button data-role="popover" data-popover-text="This is a popover">Hover me</button>

<!-- Popover with custom position -->
<button data-role="popover" 
        data-popover-text="This is a popover on the right" 
        data-popover-position="right">
    Right popover
</button>

<!-- Popover triggered by click -->
<button data-role="popover" 
        data-popover-text="This is a click popover" 
        data-popover-trigger="click">
    Click me
</button>

<!-- Popover with custom hide timeout -->
<button data-role="popover" 
        data-popover-text="This will hide after 5 seconds" 
        data-popover-hide="5000">
    Custom timeout
</button>

<!-- Popover with close button -->
<button data-role="popover" 
        data-popover-text="Click the X to close" 
        data-popover-hide="0" 
        data-close-button="true">
    With close button
</button>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| popoverDeferred | number | 0 | Deferred initialization time in milliseconds |
| popoverText | string | "" | Text content of the popover |
| popoverHide | number | 3000 | Time in milliseconds after which the popover will be hidden (0 for no auto-hide) |
| popoverTimeout | number | 10 | Delay before showing the popover in milliseconds |
| popoverOffset | number | 10 | Offset from the element in pixels |
| popoverTrigger | string | "hover" | Event that triggers the popover (hover, click, focus) |
| popoverPosition | string | "top" | Position of the popover relative to the element (top, bottom, right, left) |
| hideOnLeave | boolean | false | Whether to hide the popover when the mouse leaves the element |
| closeButton | boolean | true | Whether to show a close button on the popover when popoverHide is set to 0 |
| clsPopover | string | "" | Additional CSS class for the popover |
| clsPopoverContent | string | "" | Additional CSS class for the popover content |

## Methods

### show()
Shows the popover.

```javascript
var popover = Metro.getPlugin('#myPopover', 'popover');
popover.show();
```

### hide()
Hides the popover.

```javascript
var popover = Metro.getPlugin('#myPopover', 'popover');
popover.hide();
```

### setPosition()
Sets the position of the popover based on the current position of the target element.

```javascript
var popover = Metro.getPlugin('#myPopover', 'popover');
popover.setPosition();
```

### destroy()
Destroys the popover component.

```javascript
var popover = Metro.getPlugin('#myPopover', 'popover');
popover.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onPopoverShow | Triggered when the popover is shown |
| onPopoverHide | Triggered when the popover is hidden |
| onPopoverCreate | Triggered when the popover is created |

## CSS Variables

The Popover component can be styled using the following CSS variables:

| Variable | Default (Light) | Default (Dark) | Description |
| --- | --- | --- | --- |
| --popover-border-radius | 6px | 6px | Border radius of the popover |
| --popover-background | #ffffff | #1e1f22 | Background color of the popover |
| --popover-color | #191919 | #dbdfe7 | Text color of the popover |
| --popover-border-color | #e8e8e8 | #4a4d51 | Border color of the popover |

## Custom Styling Example

```css
.custom-popover {
    --popover-background: #3498db;
    --popover-color: #ffffff;
    --popover-border-color: #2980b9;
    --popover-border-radius: 10px;
}
```

```html
<button data-role="popover" 
        class="custom-popover"
        data-popover-text="This is a custom styled popover">
    Custom styled popover
</button>
```

## Accessibility

When using popovers, consider the following accessibility best practices:

1. Use appropriate trigger events for the content type (e.g., use click instead of hover for important information)
2. Ensure sufficient contrast between the popover text and background
3. Consider using ARIA attributes to improve screen reader support
4. Provide alternative ways to access the information for users who may have difficulty with popovers

## Best Practices

1. Keep popover content concise and focused
2. Use popovers for supplementary information, not for critical content
3. Position popovers to avoid obscuring important page elements
4. Set appropriate timeout values based on the amount of content
5. Consider using the close button for popovers with longer content