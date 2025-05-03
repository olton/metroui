# Swipe Component

The Swipe Component adds touch and mouse swipe gesture detection to elements. It allows you to detect swipe gestures in four directions: left, right, up, and down.

## Plugin Parameters

The Swipe Component accepts the following parameter:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| swipeThreshold | Number | 32 | The minimum distance (in pixels) required for a swipe to be detected |

## Events

The Swipe Component provides the following events:

| Event | Description |
|-------|-------------|
| onSwipe | Triggered for any swipe direction with direction information |
| onSwipeRight | Triggered specifically for right swipes |
| onSwipeLeft | Triggered specifically for left swipes |
| onSwipeUp | Triggered specifically for upward swipes |
| onSwipeDown | Triggered specifically for downward swipes |
| onSwipeCreate | Triggered when the swipe component is created |

## CSS Styling

This component does not have specific CSS variables for styling as it's primarily a behavior component that adds gesture detection functionality.

## Example Usage

### HTML

```html
<div id="swipeElement" data-role="swipe">
    <div class="p-4">
        Swipe me in any direction
    </div>
</div>
```

### JavaScript

```javascript
// Initialize with JavaScript
Metro.makePlugin('#swipeElement', 'swipe', {
    swipeThreshold: 50,
    onSwipe: function(event, data) {
        console.log('Swipe detected in direction:', data.direction);
    },
    onSwipeLeft: function(event, data) {
        console.log('Swiped left!');
    },
    onSwipeRight: function(event, data) {
        console.log('Swiped right!');
    },
    onSwipeUp: function(event, data) {
        console.log('Swiped up!');
    },
    onSwipeDown: function(event, data) {
        console.log('Swiped down!');
    }
});
```

## Event Data

The event callbacks receive data with the following properties:

### For onSwipe:

```javascript
{
    start: {x: Number, y: Number}, // Starting coordinates of the swipe
    swipe: {x: Number, y: Number}, // Swipe distance in x and y directions
    direction: String // Direction of the swipe: "left", "right", "up", or "down"
}
```

### For direction-specific events (onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown):

```javascript
{
    start: {x: Number, y: Number}, // Starting coordinates of the swipe
    swipe: {x: Number, y: Number}  // Swipe distance in x and y directions
}
```

## Notes

- The component automatically adds `user-select: none` to the element to prevent text selection during swipe gestures.
- The component works with both touch events (for mobile devices) and mouse events (for desktop).
- Swipe detection is based on the distance moved in pixels compared to the swipeThreshold value.