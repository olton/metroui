# Countdown Component

The Countdown component is a flexible timer that counts down to a specific date or time duration. It displays days, hours, minutes, and seconds with various animation options.

## Usage

```html
<div data-role="countdown" 
     data-date="2023-12-31" 
     data-animate="slide">
</div>
```

## Configuration Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `countdownDeferred` | number | 0 | Delay before countdown starts (in milliseconds) |
| `stopOnBlur` | boolean | true | Whether to stop the countdown when the window loses focus |
| `animate` | string | "none" | Animation type for digit changes. Options: "none", "slide", "fade", "zoom" |
| `ease` | string | "linear" | Easing function for animations |
| `duration` | number | 600 | Duration of animations in milliseconds |
| `inputFormat` | string | null | Format for parsing the date string (if provided) |
| `days` | number | 0 | Number of days to count down |
| `hours` | number | 0 | Number of hours to count down |
| `minutes` | number | 0 | Number of minutes to count down |
| `seconds` | number | 0 | Number of seconds to count down |
| `date` | string | null | Target date to count down to (overrides days, hours, minutes, seconds) |
| `start` | boolean | true | Whether to start the countdown automatically |
| `fontSize` | number | 24 | Font size for the countdown digits |
| `clsCountdown` | string | "" | Additional CSS class for the countdown container |
| `clsPart` | string | "" | Additional CSS class for each part (days, hours, minutes, seconds) |
| `clsZero` | string | "" | Additional CSS class for parts that reach zero |
| `clsAlarm` | string | "" | Additional CSS class applied when countdown reaches zero |
| `clsDays` | string | "" | Additional CSS class for the days part |
| `clsHours` | string | "" | Additional CSS class for the hours part |
| `clsMinutes` | string | "" | Additional CSS class for the minutes part |
| `clsSeconds` | string | "" | Additional CSS class for the seconds part |

## Events

| Event | Description |
| ----- | ----------- |
| `onAlarm` | Triggered when the countdown reaches zero |
| `onTick` | Triggered on each countdown tick (every second) |
| `onZero` | Triggered when a specific part (days, hours, minutes, seconds) reaches zero |
| `onBlink` | Triggered when the countdown blinks |
| `onCountdownCreate` | Triggered when the countdown is created |

## API Methods

### start()
Starts or resumes the countdown.

```javascript
var countdown = Metro.getPlugin('#myCountdown', 'countdown');
countdown.start();
```

### stop()
Stops the countdown and resets all values to zero.

```javascript
countdown.stop();
```

### pause()
Pauses the countdown without resetting values.

```javascript
countdown.pause();
```

### resume()
Resumes a paused countdown.

```javascript
countdown.resume();
```

### reset()
Resets the countdown to its initial state and starts it again.

```javascript
countdown.reset();
```

### resetWith(value)
Resets the countdown with new parameters.

```javascript
// Reset with a new date
countdown.resetWith("2024-12-31");

// Reset with new duration values
countdown.resetWith({
    days: 10,
    hours: 5,
    minutes: 30,
    seconds: 0
});
```

### togglePlay()
Toggles between play and pause states.

```javascript
countdown.togglePlay();
```

### isPaused()
Checks if the countdown is currently paused.

```javascript
var isPaused = countdown.isPaused();
```

### getBreakpoint(asDate)
Gets the target time as timestamp or Date object.

```javascript
// Get as timestamp
var timestamp = countdown.getBreakpoint();

// Get as Date object
var date = countdown.getBreakpoint(true);
```

### getLeft()
Gets the remaining time in different units.

```javascript
var timeLeft = countdown.getLeft();
console.log(timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds);
```

### blink()
Toggles the blink class on the countdown element.

```javascript
countdown.blink();
```

## Styling with CSS Variables

The Countdown component uses CSS variables for styling:

| CSS Variable | Description |
| ------------ | ----------- |
| `--border-color` | Color for borders and dividers between parts |

### Example of custom styling

```css
.my-countdown {
    --border-color: #ff5722;
    font-size: 32px;
    color: #0066cc;
}
```

```html
<div data-role="countdown" 
     data-date="2023-12-31" 
     class="my-countdown">
</div>
```

## Animation Types

The Countdown component supports several animation types for digit changes:

- **none**: No animation, digits change instantly
- **slide**: Digits slide up/down during changes
- **fade**: Digits fade in/out during changes
- **zoom**: Digits zoom in/out during changes

Set the animation type using the `data-animate` attribute:

```html
<div data-role="countdown" data-animate="slide" data-date="2023-12-31"></div>
```