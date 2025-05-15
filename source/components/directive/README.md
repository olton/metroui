# Directive Component

The Directive component creates styled directive boxes for displaying notes, warnings, tips, and other informational content in your application.

## Usage

```html
<div data-role="directive" 
     data-directive="note"
     data-show-icon="true"
     data-title="Note"
     data-style="1">
    This is a note directive.
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| directive | string | "note" | Type of directive. Options: note, info, warning, caution, tip, success, important, bug, shit, air, fuck |
| showIcon | boolean | true | Whether to show an icon |
| title | string | "default" | Title of the directive. If set to "default", it will use the localized label for the directive type |
| style | number | 1 | Style of the directive. Options: 1, 2, 3 |
| onDirectiveCreate | function | Metro.noop | Event fired when directive is created |

## API Methods

### Metro.directiveSetup(options)

Configure global defaults for all directive components.

```javascript
Metro.directiveSetup({
    directive: "info",
    showIcon: false,
    style: 2
});
```

### element.destroy()

Remove the directive component.

```javascript
const directive = $('#myDirective').data('directive');
directive.destroy();
```

## Styles

The Directive component supports three different styles:

1. **Style 1** (default): Icon positioned on the right
2. **Style 2**: Icon positioned on the left with a thicker left border
3. **Style 3**: Icon positioned on the left with padding

## Directive Types

The component supports various directive types, each with its own styling:

- **note**: Default style
- **info**: Blue styling for informational content
- **tip/success**: Green styling for tips and success messages
- **warning**: Yellow styling for warnings
- **caution/alert/error**: Red styling for errors and important cautions
- **important**: Orange styling for important information
- **bug**: Styling for bug notes
- **air**: Light styling for less important notes
- And more...

## CSS Variables

You can customize the appearance of the directive component using CSS variables:

```css
:root {
    --directive-background: #f9f9f9;      /* Background color */
    --directive-color: #191919;           /* Text color */
    --directive-border-color: #3c3c3c1a;  /* Border color */
    --directive-title-color: #3c3c3c;     /* Title color */
    --directive-border-radius: 10px;      /* Border radius */
    --directive-code-background: #f5f5f5; /* Code background color */
    --directive-icon-background: #f5f5f5; /* Icon background color */
    --directive-icon-color: #7a7a7a;      /* Icon color */
    --directive-icon-size: 3rem;          /* Icon size */
}
```

### Customizing Specific Directive Types

You can also customize specific directive types by targeting their classes:

```css
.directive.directive-info {
    --directive-background: #e6f7ff;
    --directive-border-color: #91d5ff;
    --directive-title-color: #1890ff;
}
```

### Dark Mode Support

The component includes dark mode support with the `.dark-side` class:

```css
.dark-side .directive-note {
    --directive-background: #292e37!important;
    --directive-border-color: #5454547a!important;
    --directive-title-color: #ffffff!important;
}
```

## Examples

### Basic Note

```html
<div data-role="directive">
    This is a default note directive.
</div>
```

### Warning with Custom Title

```html
<div data-role="directive" data-directive="warning" data-title="Attention!">
    This is a warning directive with a custom title.
</div>
```

### Info Directive with Style 2

```html
<div data-role="directive" data-directive="info" data-style="2">
    This is an info directive with style 2.
</div>
```

### Success Directive without Icon

```html
<div data-role="directive" data-directive="success" data-show-icon="false">
    This is a success directive without an icon.
</div>
```