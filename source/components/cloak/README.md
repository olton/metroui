# Cloak Component

The Cloak component provides a simple way to hide elements initially and then reveal them with a smooth fade-in animation. This is particularly useful for preventing the flash of unstyled content (FOUC) during page load or for elements that should only be shown after certain conditions are met.

## Usage

### Basic Usage

Add the `cloak` or `m4-cloak` class to elements that should be initially hidden:

```html
<div class="cloak">
    This content will be initially hidden.
</div>
```

### Revealing Cloaked Elements

To reveal a cloaked element with a fade-in animation, add the `remove-cloak` class:

```html
<div class="cloak remove-cloak">
    This content will fade in.
</div>
```

In JavaScript, you can dynamically reveal elements:

```javascript
// After some condition is met or data is loaded
document.querySelector('.cloak').classList.add('remove-cloak');
```

### Hiding Visible Elements

To hide a visible element with a fade-out animation, add the `add-cloak` class:

```javascript
// To hide an element
document.querySelector('.some-element').classList.add('add-cloak');
```

## Features

- Prevents flash of unstyled content during page load
- Smooth fade-in and fade-out animations
- Simple implementation with just CSS classes
- Compatible with any HTML element

## Available Classes

| Class | Description |
| ----- | ----------- |
| `cloak`, `m4-cloak` | Makes an element invisible (opacity: 0) |
| `remove-cloak` | Fades in an element (from opacity 0 to 1) over 1 second |
| `add-cloak` | Fades out an element (from opacity 1 to 0) over 1 second |

## Common Use Cases

### Loading Indicators

Hide content until it's fully loaded:

```html
<div class="loading-indicator">Loading...</div>
<div class="content cloak">
    <!-- Content that will be shown after loading -->
</div>

<script>
    // After content is loaded
    function onContentLoaded() {
        document.querySelector('.loading-indicator').classList.add('add-cloak');
        document.querySelector('.content').classList.add('remove-cloak');
    }
</script>
```

### Progressive Enhancement

Use with JavaScript to enhance the user experience:

```html
<div class="no-js-message">
    Please enable JavaScript to use all features.
</div>
<div class="js-content cloak">
    <!-- Content that requires JavaScript -->
</div>

<script>
    // JavaScript is enabled, so we can show the JS content
    document.querySelector('.no-js-message').classList.add('add-cloak');
    document.querySelector('.js-content').classList.add('remove-cloak');
</script>
```

## Animation Details

- Fade-in animation duration: 1 second (linear)
- Fade-out animation duration: 1 second (linear)