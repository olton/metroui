# Container Component

The Container component provides responsive layout containers that help center and horizontally pad your content. It's a fundamental building block for creating responsive layouts in Metro UI.

## Usage

### Basic Container

The standard container is responsive and adjusts its width based on the viewport size:

```html
<div class="container">
    <!-- Your content here -->
</div>
```

### Fluid Container

For a full-width container that spans the entire viewport width:

```html
<div class="container-fluid">
    <!-- Your content here -->
</div>
```

### Fixed-Width Containers

For containers with specific maximum widths:

```html
<div class="container-xs"><!-- Max-width based on xs breakpoint --></div>
<div class="container-sm"><!-- Max-width based on sm breakpoint --></div>
<div class="container-md"><!-- Max-width based on md breakpoint --></div>
<div class="container-lg"><!-- Max-width based on lg breakpoint --></div>
<div class="container-xl"><!-- Max-width based on xl breakpoint --></div>
<div class="container-xxl"><!-- Max-width based on xxl breakpoint --></div>
```

### Maximum Width Container

For a container that takes 100% width:

```html
<div class="container-max">
    <!-- Your content here -->
</div>
```

### Container Query Support

For containers that support CSS container queries:

```html
<div class="container-query">
    <!-- Content that can respond to container size -->
</div>

<div class="responsive-container">
    <!-- Content that can respond to container size -->
</div>
```

## Features

- Responsive containers that adapt to different screen sizes
- Fluid container option for full-width layouts
- Fixed-width container options for specific breakpoints
- Container query support for component-level responsiveness
- Consistent padding on left and right sides
- Automatic centering with `margin: 0 auto`

## Responsive Behavior

The standard `.container` class has the following responsive behavior:

| Viewport Width | Container Max Width |
| -------------- | ------------------ |
| < 360px        | 100% |
| 360px - 576px  | 98% |
| 577px - 768px  | 95% |
| 769px - 992px  | 90% |
| 993px - 1200px | 90% |
| > 1200px       | 80% |

## HTML Semantic Elements

The container styles are also applied to the following semantic HTML elements:

```html
<header><!-- Header content --></header>
<section><!-- Section content --></section>
<footer><!-- Footer content --></footer>
<aside><!-- Sidebar content --></aside>
```

## Container Queries

The `.container-query` and `.responsive-container` classes enable CSS container queries, allowing child elements to respond to the container's size rather than the viewport size:

```css
/* Example of using container queries */
@container container-query (min-width: 400px) {
    .responsive-element {
        font-size: 1.2rem;
    }
}
```

## Spacing

- Containers have 12px padding on both left and right sides
- No default vertical padding is applied
- Containers are positioned relatively, allowing absolute positioning of child elements