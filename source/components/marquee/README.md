# Marquee Component

The Marquee component provides a modern implementation of scrolling text or content, similar to the classic HTML marquee element but with more features and control options. It supports multiple directions, easing functions, and animation modes.

## Usage

```html
<div data-role="marquee">
    Item 1
    Item 2
    Item 3
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| items | array | null | Items to display in the marquee (alternative to HTML content) |
| loop | boolean | true | Whether to loop the marquee animation |
| height | string | "auto" | Height of the marquee container |
| width | string | "100%" | Width of the marquee container |
| duration | number | 10000 | Duration of the animation in milliseconds |
| direction | string | "left" | Direction of the marquee ("left", "right", "up", "down") |
| ease | string | "linear" | Easing function for the animation |
| mode | string | "default" | Mode of the marquee ("default" or "accent") |
| accentPause | number | 2000 | Pause time for accent mode in milliseconds |
| firstPause | number | 1000 | Pause time before the first item in milliseconds |
| stopOnHover | boolean | true | Whether to stop the marquee on hover |
| clsMarquee | string | "" | Additional CSS class for the marquee container |
| clsMarqueeItem | string | "" | Additional CSS class for marquee items |

## Methods

### setItems(items, replace)
Sets the items for the marquee.

```javascript
var marquee = Metro.getPlugin('#my-marquee', 'marquee');
marquee.setItems(['Item 1', 'Item 2', 'Item 3'], true);
```

### setItem(index, value)
Sets a specific item at the given index.

```javascript
var marquee = Metro.getPlugin('#my-marquee', 'marquee');
marquee.setItem(0, 'New Item 1');
```

### addItem(item, index)
Adds an item to the marquee. If index is provided, inserts at that position, otherwise appends to the end.

```javascript
var marquee = Metro.getPlugin('#my-marquee', 'marquee');
// Add to the end
marquee.addItem('New Item');
// Insert at position 1
marquee.addItem('New Item', 1);
```

### start()
Starts the marquee animation.

```javascript
var marquee = Metro.getPlugin('#my-marquee', 'marquee');
marquee.start();
```

### stop()
Stops the marquee animation.

```javascript
var marquee = Metro.getPlugin('#my-marquee', 'marquee');
marquee.stop();
```

### destroy()
Destroys the marquee component.

```javascript
var marquee = Metro.getPlugin('#my-marquee', 'marquee');
marquee.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onMarqueeItem | Triggered when a marquee item is shown |
| onMarqueeItemComplete | Triggered when a marquee item animation is complete |
| onMarqueeComplete | Triggered when the marquee animation is complete |
| onMarqueeCreate | Triggered when the marquee is created |

## Styling

The Marquee component uses the following CSS classes for styling:

### Base Classes
- `.marquee` - Base class for the component
- `.marquee__item` - Class for each marquee item
- `.moveLeftRight` - Class for items moving left or right
- `.moveUpDown` - Class for items moving up or down

## Examples

### Basic Marquee
```html
<div data-role="marquee">
    This is a scrolling text
    This is another line
    And one more line
</div>
```

### Marquee with Custom Direction and Duration
```html
<div data-role="marquee" data-direction="right" data-duration="5000">
    This text will scroll from left to right
    At a faster speed than default
</div>
```

### Marquee with Accent Mode
```html
<div data-role="marquee" data-mode="accent" data-accent-pause="1000">
    This text will pause in the middle
    Before continuing to scroll
</div>
```

### Marquee with Custom Items via JavaScript
```html
<div id="my-marquee" data-role="marquee"></div>

<script>
    $(function(){
        var marquee = Metro.getPlugin('#my-marquee', 'marquee');
        marquee.setItems([
            'Item 1',
            'Item 2',
            'Item 3'
        ]);
    });
</script>
```

### Marquee with Item-Specific Settings
```html
<div data-role="marquee">
    <div data-direction="left" data-duration="5000">This item scrolls left</div>
    <div data-direction="right" data-duration="7000">This item scrolls right</div>
    <div data-direction="up" data-duration="3000">This item scrolls up</div>
</div>
```

## Best Practices

1. Use appropriate duration values based on the length of your content
2. Consider using the `stopOnHover` option to improve user experience
3. For vertical scrolling, set an explicit height for the marquee container
4. Use the accent mode for important announcements that need user attention
5. For responsive designs, consider adjusting the duration based on screen size