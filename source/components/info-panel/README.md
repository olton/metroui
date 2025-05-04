# Info Panel Component

The Info Panel component provides a simple, structured container for displaying information with a header, content, and footer sections. It's a CSS-only component designed for presenting content in a clean, organized format.

## Usage

### Basic Structure

```html
<!-- Basic info panel -->
<div class="info-panel">
    <div class="info-panel-header">
        Panel Title
    </div>
    <div class="info-panel-content">
        <p>This is the main content of the info panel.</p>
        <p>You can add any HTML content here.</p>
    </div>
    <div class="info-panel-footer">
        <button class="button">Action Button</button>
    </div>
</div>
```

### Variations

```html
<!-- Info panel without footer -->
<div class="info-panel">
    <div class="info-panel-header">
        Panel Title
    </div>
    <div class="info-panel-content">
        <p>This panel has no footer section.</p>
    </div>
</div>

<!-- Info panel without header -->
<div class="info-panel">
    <div class="info-panel-content">
        <p>This panel has no header section.</p>
    </div>
    <div class="info-panel-footer">
        <button class="button">Action Button</button>
    </div>
</div>
```

## CSS Classes

### Base Classes

| Class | Description |
| ----- | ----------- |
| `.info-panel` | Main container for the info panel |
| `.info-panel-header` | Header section of the info panel |
| `.info-panel-content` | Content section of the info panel |
| `.info-panel-footer` | Footer section of the info panel |

## Styling

The Info Panel component uses the following default styles:

- Background color: White
- Text color: Dark
- Text alignment: Center

### Header Styling

- Padding: 30px
- Text transform: Uppercase
- Font size: 18px
- Font weight: 500
- Letter spacing: 2px
- Line height: 1.2
- White space: nowrap

### Content Styling

- Padding: 20px 40px

### Footer Styling

- Padding: 40px

## Example Use Cases

### Information Display

```html
<div class="info-panel">
    <div class="info-panel-header">
        System Information
    </div>
    <div class="info-panel-content">
        <p><strong>Version:</strong> 5.1.0</p>
        <p><strong>Last Updated:</strong> May 2, 2025</p>
        <p><strong>Status:</strong> Active</p>
    </div>
</div>
```

### Call to Action Panel

```html
<div class="info-panel">
    <div class="info-panel-header">
        Subscribe to Our Newsletter
    </div>
    <div class="info-panel-content">
        <p>Stay updated with our latest news and promotions.</p>
        <input type="email" placeholder="Your email address">
    </div>
    <div class="info-panel-footer">
        <button class="button primary">Subscribe</button>
    </div>
</div>
```

### Feature Highlight

```html
<div class="info-panel">
    <div class="info-panel-header">
        Premium Features
    </div>
    <div class="info-panel-content">
        <ul class="unstyled-list">
            <li>✓ Advanced Analytics</li>
            <li>✓ Unlimited Storage</li>
            <li>✓ Priority Support</li>
            <li>✓ Custom Branding</li>
        </ul>
    </div>
    <div class="info-panel-footer">
        <button class="button success">Upgrade Now</button>
    </div>
</div>
```

## Best Practices

1. Keep header text concise and descriptive
2. Use consistent styling for related info panels
3. Ensure content is well-organized and easy to read
4. Use the footer for primary actions related to the panel content
5. Consider using grid or flex layouts to arrange multiple info panels