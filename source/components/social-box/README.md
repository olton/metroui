# Social Box Component

The Social Box component provides a card-like element for displaying social profiles or user information with a centered avatar that overlaps the header and content sections.

## Usage

```html
<div class="social-box">
    <div class="header">
        <div class="avatar">
            <img src="avatar.jpg" alt="User Avatar">
        </div>
        <div class="title">John Doe</div>
        <div class="subtitle">Web Developer</div>
    </div>
    <div class="content">
        <ul class="skills">
            <li>
                <a href="#">
                    <span class="mif-facebook"></span>
                    <div>12.5K</div>
                    <div>Followers</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <span class="mif-twitter"></span>
                    <div>8.6K</div>
                    <div>Followers</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <span class="mif-instagram"></span>
                    <div>15.2K</div>
                    <div>Followers</div>
                </a>
            </li>
        </ul>
    </div>
</div>
```

## Structure

The Social Box component consists of the following parts:

### Header

The header section contains:

- **Avatar**: A circular image or icon representing the person, positioned at the center bottom of the header
- **Title**: The main title (typically a person's name)
- **Subtitle**: A secondary title (typically a job title or description)

```html
<div class="header">
    <div class="avatar">
        <!-- Avatar content (image or icon) -->
    </div>
    <div class="title">Title Text</div>
    <div class="subtitle">Subtitle Text</div>
</div>
```

### Content

The content section typically contains a horizontal list of social media stats or links:

```html
<div class="content">
    <ul class="skills">
        <li>
            <a href="#">
                <span class="mif-facebook"></span>
                <div>12.5K</div>
                <div>Followers</div>
            </a>
        </li>
        <!-- More social links -->
    </ul>
</div>
```

## Styling with CSS Variables

The Social Box component can be customized using CSS variables:

| CSS Variable | Default Value (Light) | Default Value (Dark) | Description |
|--------------|----------------------|---------------------|-------------|
| `--social-box-border-radius` | `6px` | `6px` | Border radius of the box |
| `--social-box-border-color` | `var(--border-color)` | `var(--border-color)` | Border color of the box |
| `--social-box-background` | `#ffffff` | `#2b2d30` | Background color of the box |
| `--social-box-color` | `#191919` | `#dbdfe7` | Text color of the box |
| `--social-box-header-background` | `#fbfbfb` | `#282c35` | Background color of the header |
| `--social-box-header-color` | `#191919` | `#fbfbfb` | Text color of the header |
| `--social-box-avatar-background` | `#e6e6e6` | `#3b414e` | Background color of the avatar |
| `--social-box-avatar-color` | `#191919` | `#fbfbfb` | Text color of the avatar |

### Dark Mode

The component automatically adapts to dark mode when the `.dark-side` class is applied to a parent element:

```html
<div class="dark-side">
    <div class="social-box">
        <!-- Social box content -->
    </div>
</div>
```

## Example with Custom Styling

```html
<style>
    .custom-social-box {
        --social-box-border-radius: 10px;
        --social-box-border-color: #3b5998;
        --social-box-background: #f8f9fa;
        --social-box-color: #333333;
        --social-box-header-background: #3b5998;
        --social-box-header-color: #ffffff;
        --social-box-avatar-background: #ffffff;
        --social-box-avatar-color: #3b5998;
    }
</style>

<div class="social-box custom-social-box">
    <div class="header">
        <div class="avatar">
            <span class="mif-user"></span>
        </div>
        <div class="title">Jane Smith</div>
        <div class="subtitle">Social Media Manager</div>
    </div>
    <div class="content">
        <ul class="skills">
            <li>
                <a href="#">
                    <span class="mif-facebook"></span>
                    <div>25.8K</div>
                    <div>Followers</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <span class="mif-twitter"></span>
                    <div>18.3K</div>
                    <div>Followers</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <span class="mif-linkedin"></span>
                    <div>12.4K</div>
                    <div>Connections</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <span class="mif-instagram"></span>
                    <div>32.1K</div>
                    <div>Followers</div>
                </a>
            </li>
        </ul>
    </div>
</div>
```

This example creates a social box with Facebook-themed styling for a social media manager's profile.