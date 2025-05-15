# Cards Component

The Cards component provides a flexible container for displaying content in a clean, organized format. Cards can include headers, content areas, and footers, making them suitable for a wide range of use cases such as product displays, user profiles, or information panels.

## Usage

### Basic Card

```html
<div class="card">
    <div class="card-header">
        Card Title
    </div>
    <div class="card-content">
        Card content goes here...
    </div>
    <div class="card-footer">
        <button class="button">Action</button>
    </div>
</div>
```

### Card with Avatar in Header

```html
<div class="card">
    <div class="card-header">
        <div class="avatar">
            <img src="user-avatar.jpg" alt="User">
        </div>
        <div class="name">John Doe</div>
        <div class="date">May 2, 2025</div>
    </div>
    <div class="card-content">
        Card content goes here...
    </div>
    <div class="card-footer">
        <button class="button">Like</button>
        <button class="button">Share</button>
    </div>
</div>
```

### Card with Image Header

```html
<div class="card image-header">
    <div class="card-header" style="background-image: url('header-image.jpg')">
        <div class="avatar">
            <img src="user-avatar.jpg" alt="User">
        </div>
    </div>
    <div class="card-content">
        Card content goes here...
    </div>
    <div class="card-footer">
        <button class="button">Action</button>
    </div>
</div>
```

## Features

- Clean, bordered container with rounded corners
- Flexible structure with header, content, and footer sections
- Support for avatars and dates in headers
- Image header option with avatar overlay
- Header buttons for actions
- Customizable through CSS variables
- Flexible card option for dynamic height content

## Styling with CSS Variables

The Cards component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --card-header-background | #fbfbfb | #282c35 | Background color of the card header |
| --card-header-color | #191919 | #fbfbfb | Text color of the card header |
| --card-footer-background | #fbfbfb | #282c35 | Background color of the card footer |
| --card-footer-color | #191919 | #fbfbfb | Text color of the card footer |
| --card-background | #ffffff | #2b2d30 | Background color of the card content |
| --card-color | #191919 | #dbdfe7 | Text color of the card content |
| --card-avatar-border-color | #ffffff | #414245 | Border color for avatars in image headers |
| --card-border-radius | 6px | 6px | Border radius of the card |
| --card-button-border-color | var(--border-color) | var(--border-color) | Border color for buttons in the card header |

### Example of Custom Styling

```css
/* Custom styling for a specific card */
.custom-card {
    --card-header-background: #1976D2;
    --card-header-color: #ffffff;
    --card-background: #E3F2FD;
    --card-color: #0D47A1;
    --card-border-radius: 12px;
}
```

## Structure

The Cards component includes the following elements:

- `.card` - The main container
- `.card-header` - The header section (optional)
  - `.avatar` - Container for user avatar image
  - `.name` - User name or title
  - `.date` - Date or subtitle information
  - `.buttons` - Container for header action buttons
- `.card-content` - The main content area
- `.card-footer` - The footer section (optional)

## Special Card Types

### Flexible Card

Add the `.flex-card` class to create a card that can expand to fill available space:

```html
<div class="card flex-card">
    <!-- Card content -->
</div>
```

### Image Header Card

Add the `.image-header` class to create a card with a background image in the header:

```html
<div class="card image-header">
    <!-- Card content -->
</div>
```

## Spacing

- Cards have a default margin of 8px auto
- Multiple cards are automatically spaced with a 1rem margin between them
- Card headers and footers have padding of 0.5rem 1rem
- Card content has padding of 1rem