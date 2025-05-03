# Notify Component

The Notify component provides a flexible notification system for displaying messages, alerts, and notifications to users. It supports customizable appearance, positioning, and behavior.

## Usage

### Basic Notification

```javascript
// Create a simple notification
Metro.notify.create("This is a notification message");

// Create a notification with title
Metro.notify.create("This is a notification message", "Notification Title");

// Create a notification with custom options
Metro.notify.create("This is a notification message", "Notification Title", {
    width: 300,
    keepOpen: true,
    clsNotify: "alert"
});
```

### Notification Positioning

By default, notifications appear in the top-right corner of the screen. You can change this by adding positioning classes to the container:

```javascript
// Create a notification container at the top-left
const container = $("<div>").addClass("notify-container position-left");
$("body").prepend(container);

// Use this container for notifications
Metro.notify.setup({
    container: container
});
```

### Removing Notifications

```javascript
// Remove all notifications
Metro.notify.killAll();

// Remove a specific notification (usually handled automatically)
Metro.notify.kill($("#notification-id"));
```

## Plugin Parameters

The Notify component accepts the following configuration options:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `container` | element | `null` | Container element for notifications (created automatically if null) |
| `width` | number | `220` | Width of notification in pixels |
| `timeout` | number | `3000` | Time in milliseconds before notification automatically closes |
| `duration` | number | `METRO_ANIMATION_DURATION` | Animation duration in milliseconds |
| `distance` | string/number | `"max"` | Animation distance ("max" or specific pixel value) |
| `animation` | string | `"linear"` | Animation easing function |
| `clsNotify` | string | `""` | Additional CSS class(es) for notification element |

### Event Callbacks

| Callback | Description |
| -------- | ----------- |
| `onClick` | Triggered when notification is clicked |
| `onClose` | Triggered when notification is closed |
| `onShow` | Triggered when notification is shown |
| `onAppend` | Triggered when notification is appended to container |
| `onNotifyCreate` | Triggered when notification is created |

## API Methods

The Notify component provides the following methods:

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `setup(options)` | options: object | Configure notification system with options |
| `reset()` | - | Reset options to default values |
| `create(message, title, options)` | message: string, title: string, options: object | Create and show a notification |
| `kill(notify, callback)` | notify: element, callback: function | Remove a specific notification |
| `killAll()` | - | Remove all notifications |

### Create Method Options

When using the `create()` method, you can pass the following options:

| Option | Type | Description |
| ------ | ---- | ----------- |
| `keepOpen` | boolean | If true, notification won't auto-close |
| `clsNotify` | string | Additional CSS class(es) for this notification |
| `width` | number | Width for this specific notification |
| `duration` | number | Animation duration for this notification |
| `animation` | string | Animation type for this notification |
| `distance` | string/number | Animation distance for this notification |
| `onClick` | function | Click handler for this notification |
| `onClose` | function | Close handler for this notification |
| `onShow` | function | Show handler for this notification |
| `onAppend` | function | Append handler for this notification |

## Styling with CSS Variables

The Notify component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--notify-container-background` | transparent | transparent | Background color of the notification container |
| `--notify-border-radius` | 4px | 4px | Border radius of notifications |
| `--notify-border-color` | #e8e8e8 | #4a4d51 | Border color of notifications |
| `--notify-background` | #ffffff | #26282e | Background color of notifications |
| `--notify-color` | #191919 | #dbdfe7 | Text color of notifications |

### Example of Custom Styling

```css
/* Custom styling for notifications */
.custom-notify {
    --notify-background: #e3f2fd;
    --notify-color: #0d47a1;
    --notify-border-color: #2196f3;
    --notify-border-radius: 8px;
}
```

## Available CSS Classes

### Container Classes
- `.notify-container` - Container for notifications
- `.position-left` - Position container on the left side
- `.position-top` - Position container at the top (full width)
- `.position-bottom` - Position container at the bottom (full width)

### Notification Classes
- `.notify` - Base class for notifications
- `.notify-title` - Title element of notification
- `.notify-message` - Message element of notification

## Best Practices

1. Keep notification messages brief and clear
2. Use titles for important notifications to draw attention
3. Consider using different CSS classes for different notification types (info, warning, error)
4. Set appropriate timeout values based on message importance and length
5. For critical notifications, use the `keepOpen: true` option to require user interaction
6. Consider accessibility by ensuring notifications have sufficient contrast and readable text