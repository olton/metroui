# Template Component

**Note: This component is marked as Deprecated.**

Template component provides a simple templating mechanism for Metro UI. It allows using a template syntax similar to EJS for creating dynamic HTML content based on the provided data.

## Usage

```html
<div data-role="template" data-template-data='{"name": "Metro", "version": "4.0"}'>
  <h1><%=name%></h1>
  <p>Version: <%=version%></p>
</div>
```

## Template Syntax

Templates use the `<% %>` syntax for embedding JavaScript code:

- `<%= value %>` - output a value
- `<% if (condition) { %>` ... `<% } %>` - conditional statements
- `<% for(var i = 0; i < items.length; i++) { %>` ... `<% } %>` - loops

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `templateData` | Object | `null` | Data for populating the template |
| `onTemplateCompile` | Function | `Metro.noop` | Function called after template compilation |
| `onTemplateCreate` | Function | `Metro.noop` | Function called after template component creation |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `template-compile` | `{ template, compiled, element }` | Triggered after template compilation |
| `template-create` | `{ element }` | Triggered after template component creation |

## API Methods

### buildWith(obj)

Rebuilds the template with new data.

```javascript
var template = $('#myTemplate').data('template');
template.buildWith({
    name: "New Name",
    version: "5.0"
});
```

### destroy()

Destroys the component and returns a reference to the DOM element.

```javascript
var template = $('#myTemplate').data('template');
var element = template.destroy();
```

## Global Configuration

You can globally configure the template component using the `Metro.templateSetup` method:

```javascript
Metro.templateSetup({
    templateData: { /* default values */ },
    onTemplateCompile: function(){ /* handler */ },
    onTemplateCreate: function(){ /* handler */ }
});
```

## Global Template Function

Metro UI also provides a global template function that can be used independently of the component:

```javascript
var template = '<div>Hello, <%=name%>!</div>';
var compiled = Metro.template(template, {name: "World"});
// Result: "<div>Hello, World!</div>"
```

## Customizing Template Tokens

You can change the default tokens `<%` and `%>` when using the global function:

```javascript
var template = '<div>Hello, {{name}}!</div>';
var compiled = Metro.template(template, {name: "World"}, {
    beginToken: "{{",
    endToken: "}}"
});
// Result: "<div>Hello, World!</div>"
```
