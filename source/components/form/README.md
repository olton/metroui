# Form Component

The Form component provides styling for HTML forms in Metro UI. It's a CSS-only component that offers various layout options and styling for form elements.

## Usage

Import the component in your JavaScript:

```javascript
import "@olton/metroui/source/components/form";
```

Or include it in your HTML:

```html
<link href="path/to/metro.css" rel="stylesheet">
```

## CSS Classes

### Basic Form

```html
<form class="form">
  <!-- Form content -->
</form>
```

Or use the `.form` class on any element:

```html
<div class="form">
  <!-- Form content -->
</div>
```

### Form Groups

Group form elements with labels:

```html
<div class="form-group">
  <label>Input Label:</label>
  <input type="text">
</div>
```

### Form Actions

Container for form buttons and controls:

```html
<div class="form-actions">
  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</div>
```

### Inline Form

Create horizontal form layouts:

```html
<form class="inline-form">
  <div class="form-group">
    <label>Name:</label>
    <input type="text">
  </div>
  <div class="form-group">
    <label>Email:</label>
    <input type="email">
  </div>
  <div class="form-actions">
    <button type="submit">Submit</button>
  </div>
</form>
```

### Grid Form

Create responsive grid layouts for forms:

```html
<form class="grid-form">
  <div class="form-group">
    <label>First Name:</label>
    <input type="text">
  </div>
  <div class="form-group">
    <label>Last Name:</label>
    <input type="text">
  </div>
  <div class="form-group">
    <label>Email:</label>
    <input type="email">
  </div>
  <div class="form-group">
    <label>Phone:</label>
    <input type="tel">
  </div>
  <div class="form-actions">
    <button type="submit">Submit</button>
  </div>
</form>
```

## CSS Variables

The Form component uses the following CSS variables for styling:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--form-column-min-width` | `200px` | Minimum width for columns in grid forms |
| `--form-gap-size` | `1rem` | Gap size between form elements in grid forms |
| `--border-color` | Inherited from theme | Color for borders in form elements |

## Customization

You can customize the appearance of forms by overriding the CSS variables:

```css
:root {
  --form-column-min-width: 250px;
  --form-gap-size: 1.5rem;
  --border-color: #ccc;
}
```

## Examples

### Basic Form

```html
<form>
  <div class="form-group">
    <label>Username:</label>
    <input type="text">
  </div>
  <div class="form-group">
    <label>Password:</label>
    <input type="password">
  </div>
  <div class="form-actions">
    <button type="submit">Login</button>
    <button type="button">Cancel</button>
  </div>
</form>
```

### Grid Form

```html
<form class="grid-form">
  <div class="form-group">
    <label>First Name:</label>
    <input type="text">
  </div>
  <div class="form-group">
    <label>Last Name:</label>
    <input type="text">
  </div>
  <div class="form-group">
    <label>Email:</label>
    <input type="email">
  </div>
  <div class="form-group">
    <label>Phone:</label>
    <input type="tel">
  </div>
  <div class="form-actions">
    <button type="submit">Submit</button>
  </div>
</form>
```