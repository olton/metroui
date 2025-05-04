# Typer Component

The Typer component creates a typing animation effect, where text appears to be typed and deleted character by character. It can cycle through multiple phrases and customize the typing behavior.

## Usage

```html
<!-- Basic usage -->
<span data-role="typer">Hello,Metro UI,Welcome</span>

<!-- With custom options -->
<span data-role="typer" 
      data-delay="200" 
      data-delete-delay="1000"
      data-colors="#ff0000,#00ff00,#0000ff">
    Programming,Development,Coding
</span>
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `splitter` | String | `,` | Character that splits the text into separate phrases |
| `variance` | Number | `0` | Random variance in timing between character typing (ms) |
| `delay` | Number | `100` | Base delay between typing each character (ms) |
| `blinkDelay` | Number | `400` | Delay for cursor blink animation (ms) |
| `deleteDelay` | Number | `800` | Delay before starting to delete text (ms) |
| `loop` | Boolean | `true` | Whether to loop through the phrases continuously |
| `cursor` | String | `_` | Character or HTML to use as the typing cursor |
| `colors` | String | `""` | Comma-separated list of colors to cycle through for phrases |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `onType` | `{}` | Triggered with each new character typed |
| `onTyperCreate` | `{element}` | Triggered after typer component creation |

## API Methods

### start()

Starts or resumes the typing animation.

```javascript
var typer = $("#my-typer").data("typer");
typer.start();
```

### stop()

Stops the typing animation.

```javascript
var typer = $("#my-typer").data("typer");
typer.stop();
```

### destroy()

Destroys the component and removes it from the DOM.

```javascript
var typer = $("#my-typer").data("typer");
typer.destroy();
```

## Global Configuration

You can globally configure the typer component using the `Metro.typerSetup` method:

```javascript
Metro.typerSetup({
    delay: 50,
    variance: 10,
    cursor: "|",
    colors: "#3498db,#e74c3c,#2ecc71"
});
```

## Examples

### Multi-phrase Typing

```html
<span data-role="typer">
    Welcome to Metro UI,The modern UI framework,Build beautiful web applications
</span>
```

### Colorful Typing

```html
<span data-role="typer" 
      data-colors="#e74c3c,#3498db,#2ecc71,#f39c12" 
      data-delay="150">
    Red text,Blue text,Green text,Orange text
</span>
```

### Custom Cursor

```html
<span data-role="typer" data-cursor="|">Type with a vertical cursor</span>
```

### Speed Control

```html
<!-- Fast typing, slow deletion -->
<span data-role="typer" data-delay="50" data-delete-delay="2000">
    Fast typing,With slow deletion
</span>
```

## Styling

You can customize the appearance of the typer component using CSS:

```css
.typer {
    font-family: 'Courier New', monospace;
    font-size: 24px;
}

.typer-cursor {
    color: #ff0000;
    font-weight: bold;
}
```
