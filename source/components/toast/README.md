# Toast Component

The Toast component creates non-intrusive notification messages that appear temporarily on the screen before automatically disappearing.

## Usage

```javascript
// Basic usage
Metro.toast.create("Your message here");

// With options
Metro.toast.create("Task completed successfully", {
    timeout: 5000,
    position: "top"
});

// With callback
Metro.toast.create("Operation completed", function(){
    console.log("Toast was closed");
});
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `callback` | Function | `Metro.noop` | Function called after toast is closed |
| `timeout` | Number | `METRO_TIMEOUT` | Time in milliseconds before toast auto-closes |
| `distance` | Number | `20` | Distance from the edge of the screen in pixels |
| `position` | String | `"bottom"` | Position of the toast: "bottom", "top", or "center" |
| `clsToast` | String | `""` | Additional CSS class(es) for toast element |

## Methods

### Metro.toast.create(message, options)

Creates and displays a toast notification.

```javascript
// With object options
Metro.toast.create("Hello World!", {
    timeout: 3000,
    position: "center",
    clsToast: "primary"
});

// With callback function
Metro.toast.create("Hello World!", function(){
    console.log("Toast closed");
});
```

### Metro.createToast(message, options)

Alias for `Metro.toast.create()`.

```javascript
Metro.createToast("Hello World!");
```

### Metro.toast.remove(toast, callback)

Manually remove a toast element. Generally used internally.

```javascript
const toastElement = $(".toast");
Metro.toast.remove(toastElement, function(){
    console.log("Toast manually removed");
});
```

## Global Configuration

You can globally configure default toast options using the `Metro.toastSetup` method:

```javascript
Metro.toastSetup({
    position: "top",
    timeout: 10000,
    distance: 50,
    clsToast: "info-toast"
});
```

## CSS Variables

The toast component uses the following CSS variables that you can customize:

| Variable | Default (Light Theme) | Default (Dark Theme) | Description |
| --- | --- | --- | --- |
| `--toast-background` | `#323232` | `#2b2d30` | Toast background color |
| `--toast-color` | `#ffffff` | `#ffffff` | Toast text color |
| `--toast-border-radius` | `6px` | `6px` | Toast border radius |
| `--toast-closer-background` | `inherit` | `inherit` | Close button background |
| `--toast-closer-color` | `inherit` | `inherit` | Close button color |
| `--toast-closer-background-hover` | `var(--color-alert)` | `var(--color-alert)` | Close button background on hover |
| `--toast-closer-color-hover` | `var(--color-light)` | `var(--color-light)` | Close button text color on hover |

Example of customizing CSS variables:

```css
:root {
    --toast-background: rgba(0, 0, 0, 0.8);
    --toast-color: #ffffff;
    --toast-border-radius: 10px;
}
```

## Toast Positions

You can position toasts in three different ways:

### Bottom (default)
```javascript
Metro.toast.create("Toast at the bottom", {
    position: "bottom"
});
```

### Top
```javascript
Metro.toast.create("Toast at the top", {
    position: "top"
});
```

### Center
```javascript
Metro.toast.create("Toast in the center", {
    position: "center"
});
```

## Custom Styling

You can add custom styles to your toast notifications using the `clsToast` option:

```javascript
Metro.toast.create("Custom styled toast", {
    clsToast: "my-custom-toast bg-red fg-white"
});
```

Make sure to define the corresponding CSS classes in your stylesheet.
