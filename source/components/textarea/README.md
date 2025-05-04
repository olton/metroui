# Textarea Component

Textarea component provides an enhanced textarea field with additional features like character counting, auto-resizing, and styling options.

## Usage

```html
<textarea data-role="textarea" data-auto-size="true">Content goes here</textarea>
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | String | `""` | Label text for textarea |
| `textareaDeferred` | Number | `0` | Defer initialization of component |
| `charsCounter` | String/Object | `null` | Selector for character counter element |
| `charsCounterTemplate` | String | `"$1"` | Template for character counter, where $1 will be replaced with count |
| `defaultValue` | String | `""` | Default value for textarea |
| `prepend` | String | `""` | Content to prepend before textarea |
| `append` | String | `""` | Content to append after textarea |
| `clearButton` | Boolean | `true` | Display clear button |
| `clearButtonIcon` | String | `"❌"` | Icon for clear button |
| `autoSize` | Boolean | `true` | Auto-resize textarea based on content |
| `maxHeight` | Number | `0` | Maximum height for textarea (0 = no limit) |
| `clsPrepend` | String | `""` | Additional class for prepend element |
| `clsAppend` | String | `""` | Additional class for append element |
| `clsComponent` | String | `""` | Additional class for component element |
| `clsTextarea` | String | `""` | Additional class for textarea element |
| `clsLabel` | String | `""` | Additional class for label element |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `onChange` | `{val, length}` | Triggered when textarea value changes |
| `onTextareaCreate` | `{element}` | Triggered after textarea component creation |

## API Methods

### resize()

Recalculates the height of the textarea based on its content.

```javascript
var textarea = $('#my-textarea').data('textarea');
textarea.resize();
```

### clear()

Clears the textarea.

```javascript
var textarea = $('#my-textarea').data('textarea');
textarea.clear();
```

### toDefault()

Resets textarea to default value.

```javascript
var textarea = $('#my-textarea').data('textarea');
textarea.toDefault();
```

### length()

Returns the number of characters in the textarea.

```javascript
var textarea = $('#my-textarea').data('textarea');
var charCount = textarea.length();
```

### disable()

Disables the textarea component.

```javascript
var textarea = $('#my-textarea').data('textarea');
textarea.disable();
```

### enable()

Enables the textarea component.

```javascript
var textarea = $('#my-textarea').data('textarea');
textarea.enable();
```

### toggleState()

Toggles between enabled and disabled states.

```javascript
var textarea = $('#my-textarea').data('textarea');
textarea.toggleState();
```

## Global Configuration

You can globally configure the textarea component using the `Metro.textareaSetup` method:

```javascript
Metro.textareaSetup({
    autoSize: false,
    clearButton: false,
    // other options
});
```

## CSS Variables

The textarea component uses the following CSS variables that you can customize:

| Variable | Default | Description |
| --- | --- | --- |
| `--textarea-color` | `#191919` | Text color for textarea |
| `--textarea-border-color` | `var(--border-color)` | Border color |
| `--textarea-font-size` | `14px` | Font size |
| `--textarea-border-radius` | `4px` | Border radius |

Example of customizing CSS variables:

```css
:root {
    --textarea-color: #0066aa;
    --textarea-font-size: 16px;
    --textarea-border-radius: 8px;
}
```

## Character Counter

You can add a character counter to your textarea:

```html
<textarea data-role="textarea" data-chars-counter="#counter"></textarea>
<span id="counter">0</span>

<!-- Or with template -->
<textarea data-role="textarea" data-chars-counter="#counter" 
          data-chars-counter-template="Characters: $1"></textarea>
<span id="counter">Characters: 0</span>
```

## Auto-resize Feature

By default, the textarea will automatically resize to fit its content. You can disable this feature:

```html
<textarea data-role="textarea" data-auto-size="false"></textarea>
```

If you want to limit the maximum height when using auto-size:

```html
<textarea data-role="textarea" data-auto-size="true" data-max-height="200"></textarea>
```
