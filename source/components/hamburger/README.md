# Hamburger Component

The Hamburger component provides an animated hamburger menu button that can transform into different icons when activated. It's commonly used for toggling navigation menus, especially on mobile devices.

## Usage

### Basic Hamburger Button

```html
<button class="hamburger">
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
</button>
```

### With JavaScript Toggle

```html
<button class="hamburger menu-down" id="menu-toggle">
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
</button>

<script>
    document.getElementById('menu-toggle').addEventListener('click', function() {
        this.classList.toggle('active');
    });
</script>
```

## Animation Styles

The Hamburger component supports several animation styles that transform the hamburger icon when the `active` class is added:

### Menu Down / Chevron Down

Rotates 90 degrees and transforms into a chevron pointing right:

```html
<button class="hamburger menu-down">
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
</button>
```

### Menu Up / Chevron Up

Rotates -90 degrees and transforms into a chevron pointing left:

```html
<button class="hamburger menu-up">
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
</button>
```

### Arrow Left

Transforms into a left-pointing arrow:

```html
<button class="hamburger arrow-left">
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
</button>
```

### Arrow Right

Transforms into a right-pointing arrow:

```html
<button class="hamburger arrow-right">
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
</button>
```

## Features

- Clean, minimalist hamburger menu button
- Smooth animations when toggling states
- Multiple animation styles to choose from
- Customizable through CSS variables
- Works with both `.hamburger` and `.nav-button` classes

## Styling with CSS Variables

The Hamburger component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --hamburger-background | transparent | transparent | Background color of the hamburger button |
| --hamburger-color | #191919 | #ffffff | Color of the hamburger lines |

### Example of Custom Styling

```css
/* Custom styling for a specific hamburger button */
.custom-hamburger {
    --hamburger-background: #2196F3;
    --hamburger-color: #ffffff;
}
```

## Class Reference

| Class | Description |
| ----- | ----------- |
| `.hamburger`, `.nav-button` | Base class for the hamburger button |
| `.menu-down`, `.chevron-down` | Transforms into a right-pointing chevron when active |
| `.menu-up`, `.chevron-up` | Transforms into a left-pointing chevron when active |
| `.arrow-left` | Transforms into a left-pointing arrow when active |
| `.arrow-right` | Transforms into a right-pointing arrow when active |
| `.active` | Applied to show the transformed state |

## Dimensions

- Button size: 36px × 36px
- Line width: 30px (default), 20px (in transformed state)
- Line height: 3px
- Line spacing: 4px margin between lines

## Animation Details

- Transition duration: 0.3s with ease-in-out timing
- The middle line has a transition delay of 0.3s in menu-up/menu-down styles
- In the active state, the middle line disappears and the top and bottom lines transform