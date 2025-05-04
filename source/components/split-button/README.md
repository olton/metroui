# Split Button Component

The Split Button component provides a button with two parts: a main button and a dropdown toggle. It's useful for actions that have multiple options.

## Usage

```html
<div class="split-button">
  <button class="button">Main Action</button>
  <button class="split dropdown-toggle" data-role="dropdown" data-toggle-element="#split-dropdown">
    <span class="mif-chevron-down"></span>
  </button>
  <ul class="d-menu" id="split-dropdown">
    <li><a href="#">Option 1</a></li>
    <li><a href="#">Option 2</a></li>
    <li><a href="#">Option 3</a></li>
  </ul>
</div>
```

## Variants

### No Gap

You can remove the gap between the main button and the dropdown toggle by adding the `no-gap` class:

```html
<div class="split-button no-gap">
  <button class="button">Main Action</button>
  <button class="split dropdown-toggle" data-role="dropdown" data-toggle-element="#split-dropdown-no-gap">
    <span class="mif-chevron-down"></span>
  </button>
  <ul class="d-menu" id="split-dropdown-no-gap">
    <li><a href="#">Option 1</a></li>
    <li><a href="#">Option 2</a></li>
    <li><a href="#">Option 3</a></li>
  </ul>
</div>
```

### Outline

You can use the outline style for the split button by adding the `outline` class to the split element:

```html
<div class="split-button">
  <button class="button outline">Main Action</button>
  <button class="split outline dropdown-toggle" data-role="dropdown" data-toggle-element="#split-dropdown-outline">
    <span class="mif-chevron-down"></span>
  </button>
  <ul class="d-menu" id="split-dropdown-outline">
    <li><a href="#">Option 1</a></li>
    <li><a href="#">Option 2</a></li>
    <li><a href="#">Option 3</a></li>
  </ul>
</div>
```

## CSS Variables

The Split Button component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --split-button-border-radius | 4px | 4px | Border radius for the split button |
| --split-button-background | #ebebeb | #2e2e2e | Background color of the split button |
| --split-button-color | #191919 | #F8F8F8 | Text color of the split button |
| --split-button-background-hover | #dcdcdc | #373737 | Background color on hover |
| --split-button-color-hover | #474747 | #bfbfbf | Text color on hover |
| --split-button-border-color | #E8E8E8 | #4A4D51 | Border color of the split button |

## Styling with CSS

You can customize the appearance of the Split Button by overriding the CSS variables:

```css
:root {
  --split-button-border-radius: 8px;
  --split-button-background: #007bff;
  --split-button-color: #ffffff;
  --split-button-background-hover: #0069d9;
  --split-button-color-hover: #ffffff;
  --split-button-border-color: #0062cc;
}
```

### Component Structure

The Split Button has the following structure:

```html
<div class="split-button">
  <!-- Main button -->
  <button class="button">...</button>
  
  <!-- Dropdown toggle -->
  <button class="split dropdown-toggle">...</button>
  
  <!-- Dropdown menu -->
  <ul class="d-menu">...</ul>
</div>
```

## Dependencies

The Split Button component depends on:
- Dropdown component (for the dropdown functionality)