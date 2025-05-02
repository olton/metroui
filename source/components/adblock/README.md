# Adblock Detection Component

The Adblock Detection component provides functionality to detect if a user has an ad blocker enabled in their browser. It can be used to display alternative content or messages when ad blockers are detected.

## Usage

The Adblock Detection component is automatically initialized when the Metro UI framework is loaded. No additional markup is required.

```javascript
// Listen for adblock detection events
$(window).on("adblock-alert", function() {
    console.log("Ad blocker detected!");
    // Show alternative content or message
});
```

## Configuration Options

The Adblock Detection component can be configured with the following options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| adblockDeferred | number | 0 | Deferred initialization time in milliseconds |
| checkInterval | number | 1000 | Interval in milliseconds to check for ad blockers |
| fireOnce | boolean/number | true | Whether to fire the alert event only once (true), or a specific number of times |
| checkStop | number | 10 | Number of checks before stopping even if no ad blocker is detected |
| localhost | boolean | false | Whether to check for ad blockers on localhost |
| onAlert | function | Metro.noop | Callback function triggered when an ad blocker is detected |
| onFishingStart | function | Metro.noop | Callback function triggered when the detection starts |
| onFishingDone | function | Metro.noop | Callback function triggered when the detection is done |

## Events

The Adblock Detection component fires the following events:

| Event | Description |
| ----- | ----------- |
| adblock-alert | Fired when an ad blocker is detected |
| fishing-start | Fired when the detection process starts |
| fishing-done | Fired when the detection process is complete |

## How It Works

The Adblock Detection component works by:

1. Creating a hidden element with class names commonly targeted by ad blockers
2. Periodically checking if the element is hidden or removed by an ad blocker
3. Triggering events and callbacks when an ad blocker is detected

## Global Configuration

You can configure the Adblock Detection component globally before the Metro UI framework is initialized:

```javascript
window.metroAdblockSetup = {
    checkInterval: 2000,
    fireOnce: false,
    checkStop: 5,
    onAlert: function() {
        console.log("Ad blocker detected!");
    }
};
```

## Additional Information

- The detection is not 100% reliable as ad blockers constantly evolve their detection methods
- Some browsers with built-in ad blocking may not be detected
- The component has minimal performance impact as it only creates a small hidden element
- Detection stops automatically after the specified number of checks or when an ad blocker is detected