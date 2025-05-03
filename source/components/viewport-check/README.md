# Viewport Check Component

Viewport Check component monitors whether an element is visible in the browser's viewport. It can trigger events when an element enters or leaves the visible area, making it useful for implementing lazy loading, animations, or analytics.

## Usage

```html
<!-- Basic usage -->
<div data-role="viewport-check" id="my-element">
    This content will be monitored for viewport visibility
</div>

<!-- With custom events -->
<div data-role="viewport-check" 
     data-on-viewport-enter="showElement" 
     data-on-viewport-leave="hideElement">
    Content that responds to visibility
</div>
```

```javascript
// JavaScript event handling
$("#my-element").on("viewport-enter", function(){
    console.log("Element entered viewport!");
    // Start animations or load content
});
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `onViewport` | Function | `Metro.noop` | Triggered on every scroll with current viewport state |
| `onViewportEnter` | Function | `Metro.noop` | Triggered when element enters the viewport |
| `onViewportLeave` | Function | `Metro.noop` | Triggered when element leaves the viewport |
| `onViewportCheckCreate` | Function | `Metro.noop` | Triggered after component creation |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `viewport` | `{state}` | Fired on scroll with current viewport state (boolean) |
| `viewport-enter` | `{}` | Fired when element enters the viewport |
| `viewport-leave` | `{}` | Fired when element leaves the viewport |
| `viewport-check-create` | `{}` | Fired after component creation |

## API Methods

### state()

Returns the current viewport state for the element (boolean).

```javascript
var check = $("#my-element").data("viewport-check");
var isVisible = check.state(); // true if element is in viewport
```

### destroy()

Destroys the component and removes event listeners.

```javascript
var check = $("#my-element").data("viewport-check");
check.destroy();
```

## Global Configuration

You can globally configure the viewport-check component using the `Metro.viewportCheckSetup` method:

```javascript
Metro.viewportCheckSetup({
    onViewportEnter: function() {
        console.log("Default behavior for all viewport-check components");
    }
});
```

## Example Use Cases

### Lazy Loading Images

```html
<img data-role="viewport-check" 
     data-on-viewport-enter="loadImage" 
     data-src="large-image.jpg" 
     src="placeholder.jpg">

<script>
    function loadImage(e) {
        var img = $(e.target);
        var src = img.attr("data-src");
        img.attr("src", src);
    }
</script>
```

### Trigger Animations

```html
<div class="animate-me" 
     data-role="viewport-check" 
     data-on-viewport-enter="startAnimation"
     data-on-viewport-leave="stopAnimation">
    Content to animate
</div>

<script>
    function startAnimation(e) {
        $(e.target).addClass("animated");
    }
    
    function stopAnimation(e) {
        $(e.target).removeClass("animated");
    }
</script>
```

### Analytics Tracking

```html
<section id="important-content" data-role="viewport-check" data-on-viewport-enter="trackView">
    Important content
</section>

<script>
    function trackView(e) {
        // Only track the first time element becomes visible
        $(e.target).off("viewport-enter");
        
        analytics.track("Content viewed", {
            id: e.target.id,
            time: new Date()
        });
    }
</script>
```
