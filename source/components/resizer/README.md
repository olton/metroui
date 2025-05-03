# Resizer Component

The Resizer component is a utility that monitors window and element size changes, as well as media query changes. It provides events for responding to these changes, making it useful for creating responsive behaviors in your application.

## Usage

```html
<!-- Basic usage -->
<div id="myElement" data-role="resizer">
    Content that will be monitored for size changes
</div>

<!-- Usage with event handlers -->
<div id="responsiveElement" data-role="resizer" 
     data-on-element-resize="handleResize" 
     data-on-media-point="handleMediaChange">
    This element will trigger custom functions when resized or when media breakpoints change
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| resizerDeferred | number | 0 | Deferred initialization time in milliseconds |

## Events

| Event | Description |
| --- | --- |
| onMediaPoint | Triggered when a media point changes |
| onMediaPointEnter | Triggered when entering a media point |
| onMediaPointLeave | Triggered when leaving a media point |
| onWindowResize | Triggered when the window is resized |
| onElementResize | Triggered when the element is resized |
| onResizerCreate | Triggered when the resizer component is created |

## Event Data

### onWindowResize
```javascript
{
    width: windowWidth,    // Current window width
    height: windowHeight,  // Current window height
    media: METRO_MEDIA     // Current active media breakpoints
}
```

### onElementResize
```javascript
{
    width: elementWidth,   // Current element width
    height: elementHeight, // Current element height
    oldSize: {             // Previous element size
        width: oldWidth,
        height: oldHeight
    },
    media: METRO_MEDIA     // Current active media breakpoints
}
```

### onMediaPoint, onMediaPointEnter, onMediaPointLeave
```javascript
{
    point: point,          // The media point that changed
    media: METRO_MEDIA     // Current active media breakpoints
}
```

## Methods

### destroy()
Destroys the resizer component and removes event listeners.

```javascript
var resizer = Metro.getPlugin('#myElement', 'resizer');
resizer.destroy();
```

## Examples

### Responding to Element Resize

```html
<div id="responsiveBox" data-role="resizer" style="width: 100%; height: 300px; border: 1px solid #ccc; padding: 16px;">
    <div id="sizeInfo">Size information will appear here</div>
    <div id="content">Content that adapts to the container size</div>
</div>

<script>
    Metro.init(function(){
        var resizer = Metro.getPlugin('#responsiveBox', 'resizer');
        var sizeInfo = $('#sizeInfo');
        var content = $('#content');
        
        resizer.options.onElementResize = function(e){
            // Update size information
            sizeInfo.html('Width: ' + e.width + 'px, Height: ' + e.height + 'px');
            
            // Adapt content based on size
            if (e.width < 400) {
                content.addClass('compact-layout').removeClass('full-layout');
            } else {
                content.addClass('full-layout').removeClass('compact-layout');
            }
        };
    });
</script>
```

### Responding to Media Breakpoints

```html
<div id="mediaMonitor" data-role="resizer">
    <div id="currentBreakpoint">Current breakpoint information will appear here</div>
</div>

<script>
    Metro.init(function(){
        var resizer = Metro.getPlugin('#mediaMonitor', 'resizer');
        var breakpointInfo = $('#currentBreakpoint');
        
        // Initial update
        breakpointInfo.html('Current breakpoints: ' + globalThis.METRO_MEDIA.join(', '));
        
        resizer.options.onMediaPoint = function(e){
            breakpointInfo.html('Current breakpoints: ' + e.media.join(', '));
            console.log('Media point changed:', e.point);
        };
    });
</script>
```

### Creating a Responsive Layout System

```html
<div class="container" data-role="resizer">
    <div class="layout-container">
        <div class="sidebar">Sidebar content</div>
        <div class="main-content">Main content</div>
    </div>
</div>

<script>
    Metro.init(function(){
        var container = Metro.getPlugin('.container', 'resizer');
        var layout = $('.layout-container');
        
        container.options.onMediaPointEnter = function(e){
            if (e.point.includes('xs') || e.point.includes('sm')) {
                layout.addClass('stacked-layout').removeClass('side-by-side-layout');
            }
        };
        
        container.options.onMediaPointLeave = function(e){
            if (e.point.includes('xs') || e.point.includes('sm')) {
                layout.addClass('side-by-side-layout').removeClass('stacked-layout');
            }
        };
        
        // Initial setup based on current breakpoint
        if (globalThis.METRO_MEDIA.includes('xs') || globalThis.METRO_MEDIA.includes('sm')) {
            layout.addClass('stacked-layout').removeClass('side-by-side-layout');
        } else {
            layout.addClass('side-by-side-layout').removeClass('stacked-layout');
        }
    });
</script>
```

## Best Practices

1. Use the Resizer component when you need to respond to size changes or media breakpoints in a specific element
2. For simple responsive designs, consider using CSS media queries instead, which are more performant
3. Avoid heavy operations in the resize event handlers, as they can be called frequently during resizing
4. Consider debouncing your event handlers for better performance
5. Use the `onElementResize` event to create content that adapts to its container size
6. Use the media point events to implement more complex responsive behaviors that can't be achieved with CSS alone