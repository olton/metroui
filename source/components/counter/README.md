# Counter Component

The Counter component provides an animated numerical counter that can count up or down to a specified value. It's useful for displaying statistics, achievements, or any numerical data in an engaging way.

## Usage

### Basic Counter

```html
<!-- Basic counter that counts from 0 to 100 -->
<div data-role="counter" data-value="100">0</div>

<!-- Counter with custom starting value -->
<div data-role="counter" data-value="100" data-from="50">50</div>

<!-- Counter with prefix and suffix -->
<div data-role="counter" data-value="100" data-prefix="$" data-suffix="+">0</div>
```

### Counter with Custom Duration

```html
<!-- Counter with 5 second animation duration -->
<div data-role="counter" data-value="1000" data-duration="5000">0</div>
```

### Counter that Starts When Visible

```html
<!-- Counter that starts when it enters the viewport -->
<div data-role="counter" data-value="500" data-start-on-viewport="true">0</div>
```

## Plugin Parameters

The Counter component accepts the following configuration options:

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| `startOnViewport` | `false` | When `true`, the counter starts when it enters the viewport |
| `counterDeferred` | `0` | Delay in milliseconds before the counter starts |
| `duration` | `2000` | Duration of the counting animation in milliseconds |
| `value` | `0` | The target value to count to |
| `from` | `0` | The starting value to count from |
| `timeout` | `0` | Additional timeout before starting the animation |
| `delimiter` | `,` | Character used as the thousands separator |
| `prefix` | `""` | Text to display before the number |
| `suffix` | `""` | Text to display after the number |
| `size` | `16` | Font size in pixels |

## Events

The Counter component provides the following callback events:

| Event | Description |
| ----- | ----------- |
| `onStart` | Triggered when the counter animation starts |
| `onStop` | Triggered when the counter animation completes |
| `onTick` | Triggered on each frame of the animation with the current value |
| `onCounterCreate` | Triggered when the counter is created |

## API Methods

The Counter component provides the following methods:

### start(val, from)

Starts the counter animation.

```javascript
// Start counting to the value specified in the options
Metro.getPlugin('#myCounter', 'counter').start();

// Start counting to a specific value
Metro.getPlugin('#myCounter', 'counter').start(200);

// Start counting from a specific value to a target value
Metro.getPlugin('#myCounter', 'counter').start(200, 50);
```

### reset()

Resets the counter to its initial state.

```javascript
Metro.getPlugin('#myCounter', 'counter').reset();
```

## Global Configuration

You can set global defaults for all counter components:

```javascript
Metro.counterSetup({
    duration: 3000,
    delimiter: ' ',
    prefix: '# '
});
```

## Styling with CSS Variables

The Counter component uses the `size` parameter to control the font size. You can also style the counter using standard CSS properties:

```css
/* Custom styling for a counter */
#myCounter {
    font-weight: bold;
    color: #0078D7;
    font-family: 'Segoe UI', sans-serif;
}
```

## Example with All Options

```html
<div id="statsCounter"
     data-role="counter"
     data-value="1000"
     data-from="0"
     data-duration="3000"
     data-start-on-viewport="true"
     data-prefix="$"
     data-suffix=" USD"
     data-delimiter=","
     data-size="24">
    0
</div>
```

## JavaScript Initialization

You can also initialize the counter component via JavaScript:

```javascript
Metro.makePlugin(element, 'counter', {
    value: 1000,
    duration: 3000,
    prefix: '$',
    suffix: ' USD',
    onStop: function() {
        console.log('Counter finished!');
    }
});
```