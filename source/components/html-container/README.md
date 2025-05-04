# HTML Container Component

The HTML Container component provides a convenient way to load HTML content from external sources and insert it into the DOM. It supports various loading methods, insertion modes, and customizable request options.

## Usage

### Basic Usage

```html
<!-- Load HTML content from an external source -->
<div data-role="html-container" data-html-source="path/to/content.html"></div>

<!-- Specify insertion mode -->
<div data-role="html-container" 
     data-html-source="path/to/content.html"
     data-insert-mode="append">
</div>

<!-- With request data -->
<div data-role="html-container" 
     data-html-source="path/to/content.html"
     data-request-data='{"param1": "value1", "param2": "value2"}'>
</div>
```

### JavaScript Initialization

```javascript
// Initialize with default options
Metro.makePlugin(element, "html-container");

// Initialize with custom options
Metro.makePlugin(element, "html-container", {
    htmlSource: "path/to/content.html",
    method: "post",
    insertMode: "prepend",
    requestData: {
        param1: "value1",
        param2: "value2"
    }
});
```

## Configuration Options

The HTML Container component can be configured with the following options:

| Option | Default | Description |
| ------ | ------- | ----------- |
| `htmlContainerDeferred` | 0 | Deferred initialization time in milliseconds |
| `method` | "get" | HTTP method for the request (get, post, etc.) |
| `htmlSource` | null | URL of the HTML content to load |
| `requestData` | null | Data to send with the request |
| `requestOptions` | null | Additional options for the fetch request |
| `insertMode` | "default" | How to insert the loaded content: "default" (replace inner HTML), "append", "prepend", or "replace" (replace the entire element) |

## Events

The HTML Container component provides the following events:

| Event | Description |
| ----- | ----------- |
| `onHtmlLoad` | Triggered when HTML content is successfully loaded |
| `onHtmlLoadFail` | Triggered when HTML content loading fails |
| `onHtmlLoadDone` | Triggered when HTML content loading is complete (success or failure) |
| `onHtmlContainerCreate` | Triggered when the HTML Container component is created |

## API Methods

The HTML Container component provides the following methods:

### load(source, data, opt)

Loads HTML content from the specified source.

```javascript
// Get the component instance
const htmlContainer = Metro.getPlugin(element, "html-container");

// Load content from a new source
htmlContainer.load("path/to/new-content.html");

// Load with custom request data
htmlContainer.load("path/to/content.html", {
    param1: "value1",
    param2: "value2"
});

// Load with custom request options
htmlContainer.load("path/to/content.html", null, {
    headers: {
        "Authorization": "Bearer token"
    }
});
```

## Global Configuration

You can set global defaults for all HTML Container components:

```javascript
Metro.htmlContainerSetup({
    method: "post",
    insertMode: "append"
});
```

## Attributes

The HTML Container component supports the following data attributes:

| Attribute | Description |
| --------- | ----------- |
| `data-html-source` | URL of the HTML content to load |
| `data-insert-mode` | How to insert the loaded content |
| `data-request-data` | Data to send with the request (as JSON string) |
| `data-request-options` | Additional options for the fetch request (as JSON string) |

## Styling

The HTML Container component doesn't have specific CSS variables for styling as it's primarily a functional component for loading and inserting HTML content rather than a visual component.

## Best Practices

1. Use appropriate error handling by implementing the `onHtmlLoadFail` callback
2. Consider using a loading indicator while content is being fetched
3. Be mindful of CORS restrictions when loading content from external domains
4. Use the appropriate insertion mode based on your needs:
   - "default" - Replace the entire inner content
   - "append" - Add content to the end of the container
   - "prepend" - Add content to the beginning of the container
   - "replace" - Replace the entire container element