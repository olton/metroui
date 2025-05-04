# Chat Component

The Chat component provides a versatile and interactive chat interface for web applications. It supports message exchange, customizable avatars, timestamps, and various styling options.

## Plugin Parameters

The Chat component accepts the following configuration options:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| chatDeferred | number | 0 | Delay before initializing the chat component |
| inputTimeFormat | string | null | Format for parsing input time strings |
| timeFormat | string | "D MMM hh:mm A" | Format for displaying message timestamps |
| name | string | "John Doe" | Default name for outgoing messages |
| avatar | string | "<span>👦</span>" | HTML content for the default avatar |
| welcome | string | null | Welcome message text (displayed when chat loads) |
| welcomeAvatar | string | "<span>👽</span>" | HTML content for the welcome message avatar |
| title | string | null | Chat window title |
| width | string | "100%" | Width of the chat component |
| height | string | "auto" | Height of the chat component |
| messages | object | null | Initial messages to display in the chat |
| sendButtonTitle | string | "" | Text for the send button |
| sendButtonIcon | string | "" | Icon for the send button |
| readonly | boolean | false | Whether the chat is in read-only mode |
| clsChat | string | "" | Additional CSS class for the chat container |
| clsName | string | "" | Additional CSS class for sender names |
| clsTime | string | "" | Additional CSS class for message timestamps |
| clsInput | string | "" | Additional CSS class for the input field |
| clsSendButton | string | "" | Additional CSS class for the send button |
| clsMessageLeft | string | "default" | Style class for left-aligned messages |
| clsMessageRight | string | "default" | Style class for right-aligned messages |

## Event Callbacks

| Callback | Description |
| -------- | ----------- |
| onMessage | Triggered when a message is added to the chat |
| onSend | Triggered when a message is sent |
| onSendButtonClick | Triggered when the send button is clicked |
| onChatCreate | Triggered when the chat component is created |

## API Methods

The Chat component provides the following methods:

### add(msg)

Adds a single message to the chat.

```javascript
chat.add({
    id: "msg-1", // Optional unique ID for the message
    name: "User Name",
    avatar: "<span>👨</span>", // Can be HTML, image URL, or data URL
    text: "Hello, world!",
    position: "left", // "left" or "right"
    time: new Date() // Date object or string
});
```

### addMessages(messages)

Adds multiple messages to the chat.

```javascript
chat.addMessages([
    {
        name: "User 1",
        avatar: "<span>👨</span>",
        text: "Hello!",
        position: "left",
        time: new Date()
    },
    {
        name: "User 2",
        avatar: "<span>👩</span>",
        text: "Hi there!",
        position: "right",
        time: new Date()
    }
]);
```

### delMessage(id)

Deletes a message by its ID.

```javascript
chat.delMessage("msg-1");
```

### updMessage(msg)

Updates an existing message.

```javascript
chat.updMessage({
    id: "msg-1",
    text: "Updated message text",
    time: new Date()
});
```

### clear()

Clears all messages from the chat.

```javascript
chat.clear();
```

### toggleReadonly(readonly)

Toggles the read-only state of the chat.

```javascript
// Set to read-only
chat.toggleReadonly(true);

// Set to editable
chat.toggleReadonly(false);

// Toggle current state
chat.toggleReadonly();
```

## Usage Examples

### Basic Chat

```html
<div id="myChat"></div>

<script>
    const chat = Metro.getPlugin('#myChat', 'chat', {
        title: "My Chat",
        name: "User",
        avatar: "<span>👤</span>",
        welcome: "Welcome to the chat!",
        onSend: function(data) {
            console.log("Message sent:", data.msg);
        }
    });
</script>
```

### Pre-populated Chat

```html
<div id="chatWithMessages"></div>

<script>
    const chat = Metro.getPlugin('#chatWithMessages', 'chat', {
        title: "Chat History",
        messages: [
            {
                name: "System",
                avatar: "<span>🤖</span>",
                text: "Chat started",
                position: "left",
                time: "2023-01-01 10:00:00"
            },
            {
                name: "User",
                avatar: "<span>👤</span>",
                text: "Hello there!",
                position: "right",
                time: "2023-01-01 10:01:00"
            }
        ]
    });
</script>
```

## Styling with CSS Variables

The Chat component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --chat-border-color | var(--border-color) | var(--border-color) | Border color of the chat container and messages |
| --chat-background | #ffffff | #343637 | Background color of the chat container |
| --chat-color | #191919 | #dbdfe7 | Text color in the chat container |
| --chat-message-background | #f5f5f5 | #4a4d51 | Background color of chat messages |
| --chat-message-color | #191919 | #dbdfe7 | Text color of chat messages |

### Example of Custom Styling

```css
/* Custom styling for a specific chat */
#myChat {
    --chat-background: #e8f5e9;
    --chat-color: #1b5e20;
    --chat-message-background: #c8e6c9;
    --chat-message-color: #2e7d32;
    --chat-border-color: #81c784;
}
```

## Available CSS Classes

### Base Classes
- `.chat` - Main container class

### Message Position Classes
- `.left` - Left-aligned message (typically for received messages)
- `.right` - Right-aligned message (typically for sent messages)

### Structure Classes
- `.title` - Chat title section
- `.messages` - Container for all messages
- `.message` - Individual message container
- `.message-item` - Wrapper for avatar and text
- `.message-avatar` - Message sender's avatar
- `.message-text` - Message text container
- `.message-text-inner` - Inner container for message text
- `.message-sender` - Message sender's name
- `.message-time` - Message timestamp
- `.message-input` - Input area container
- `.chat-input` - Text input field

### State Classes
- `.disabled` - Applied to input area when chat is in read-only mode

## Best Practices

1. Always provide meaningful avatars to help users identify message senders
2. Use consistent positioning (left for received messages, right for sent messages)
3. Consider using the welcome message to provide instructions or context
4. Implement proper error handling for message sending and receiving
5. Use appropriate timeFormat based on your application's requirements
6. Consider accessibility when designing chat interfaces