# Sidenav Counter Component

The Sidenav Counter component provides a compact, icon-based navigation menu with counters that can expand to show text labels. It's ideal for applications that need to save space while still providing clear navigation options.

## Usage

### Basic Sidenav Counter

```html
<!-- Basic sidenav counter -->
<ul data-role="sidenav-counter">
    <li class="active">
        <a href="#">
            <span class="icon mif-home"></span>
            <span class="title">Home</span>
            <span class="counter">3</span>
        </a>
    </li>
    <li>
        <a href="#">
            <span class="icon mif-user"></span>
            <span class="title">Profile</span>
        </a>
    </li>
    <li>
        <a href="#">
            <span class="icon mif-mail"></span>
            <span class="title">Messages</span>
            <span class="counter">12</span>
        </a>
    </li>
    <li>
        <a href="#">
            <span class="icon mif-cog"></span>
            <span class="title">Settings</span>
        </a>
    </li>
</ul>
```

### With Toggle Button

```html
<!-- Sidenav counter with toggle button -->
<button id="sidenav-toggle" class="button">Toggle Menu</button>

<ul data-role="sidenav-counter" data-toggle="#sidenav-toggle">
    <!-- Menu items -->
</ul>
```

### Right-to-Left Support

```html
<!-- RTL sidenav counter -->
<ul data-role="sidenav-counter" dir="rtl">
    <!-- Menu items -->
</ul>
```

## Component Parameters

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| compacted | false | Whether the sidenav starts in compacted mode |
| toggle | null | Selector for the element that toggles the sidenav |
| expandPoint | "fs" | Media breakpoint at which the sidenav automatically expands (e.g., "fs", "sm", "md", "lg", "xl") |
| onMenuItemClick | Metro.noop | Callback function when a menu item is clicked |
| onCollapse | Metro.noop | Callback function when the sidenav collapses |
| onExpand | Metro.noop | Callback function when the sidenav expands |
| onSidenavCreate | Metro.noop | Callback function when the sidenav is created |

## API Methods

### Metro.sidenavCounterSetup(options)

Configure global default options for all sidenav-counter components.

```javascript
Metro.sidenavCounterSetup({
    expandPoint: "md",
    compacted: true
});
```

## HTML Structure

```html
<ul data-role="sidenav-counter">
    <li class="active">
        <a href="#">
            <span class="icon mif-home"></span>
            <span class="title">Home</span>
            <span class="counter">3</span>
        </a>
    </li>
    <!-- More menu items -->
</ul>
```

## States

The sidenav-counter component has two main states:

1. **Collapsed** (default on mobile): Only icons and counters are visible, width is 52px
2. **Expanded**: Icons, titles, and counters are visible, width is 220px

The state can be toggled by:
- Clicking on a toggle element specified by the `toggle` parameter
- Automatically based on screen size using the `expandPoint` parameter
- User preference is remembered between sessions using local storage

## Styling with CSS Variables

The Sidenav Counter component can be styled using the following CSS variables:

| Variable | Light Mode | Dark Mode | Description |
| -------- | ---------- | --------- | ----------- |
| --sidenav-counter-background | #f6f6f6 | #2b2d30 | Background color of the sidenav |
| --sidenav-counter-color | #191919 | #dfe1e5 | Text color of the sidenav |
| --sidenav-counter-icon-color | #191919 | #dfe1e5 | Color of the icons |
| --sidenav-counter-counter-color | #191919 | #dfe1e5 | Color of the counters |
| --sidenav-counter-background-hover | #cecece | #43454a | Background color on hover |
| --sidenav-counter-color-hover | #0a0a0a | #ffffff | Text color on hover |
| --sidenav-counter-background-active | #68a3ff | #468cff | Background color of active items |
| --sidenav-counter-color-active | #ffffff | #ffffff | Text color of active items |

### Example of Custom Styling

```css
/* Custom sidenav counter styling */
:root {
    --sidenav-counter-background: #f0f7ff;
    --sidenav-counter-color: #0d47a1;
    --sidenav-counter-icon-color: #1976d2;
    --sidenav-counter-background-hover: #bbdefb;
    --sidenav-counter-color-hover: #0d47a1;
    --sidenav-counter-background-active: #1976d2;
    --sidenav-counter-color-active: #ffffff;
}
```

## Dark Mode Support

The Sidenav Counter component automatically adjusts its colors when the `.dark-side` class is applied to a parent element, providing appropriate styling for dark mode interfaces.

## Accessibility

For better accessibility, consider adding appropriate ARIA attributes:

```html
<ul data-role="sidenav-counter" role="navigation" aria-label="Main Navigation">
    <li class="active">
        <a href="#" aria-current="page">
            <span class="icon mif-home" aria-hidden="true"></span>
            <span class="title">Home</span>
            <span class="counter" aria-label="3 notifications">3</span>
        </a>
    </li>
    <!-- More menu items -->
</ul>
```

## Best Practices

1. Use clear, recognizable icons that represent each navigation item
2. Keep the number of navigation items reasonable to avoid scrolling in the collapsed state
3. Use counters only when they provide meaningful information (e.g., number of unread messages)
4. Consider using the expandPoint parameter to automatically expand the menu on larger screens
5. Provide a toggle button that is easily accessible
6. Use consistent styling for active and hover states
7. Ensure the expanded state doesn't obscure important content on smaller screens
8. Use the dark mode support to ensure the navigation looks appropriate in both light and dark interfaces