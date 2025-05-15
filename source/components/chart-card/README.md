# Chart Card Component

The Chart Card component provides a flexible layout for displaying charts alongside content such as titles, values, and subtitles. It's designed to present data visualizations in a clean, structured format.

## Usage

```html
<!-- Basic Chart Card -->
<div class="chart-card">
    <div class="content">
        <div class="value">75%</div>
        <div class="title">Completion Rate</div>
        <div class="subtitle">Project milestone progress</div>
    </div>
    <div class="chart">
        <!-- Your chart content goes here -->
        <canvas id="myChart" width="100" height="100"></canvas>
    </div>
</div>
```

## Structure

The Chart Card component consists of two main sections:

| Section | Description |
| ------- | ----------- |
| `.content` | Contains text information such as values, titles, and subtitles |
| `.chart` | Contains the chart or visualization element |

Each section takes up 50% of the card's width by default.

### Content Elements

| Element | Description |
| ------- | ----------- |
| `.value` | Large, bold text typically used for displaying the primary metric (28px) |
| `.title` | Medium-sized text for the card's title (16px) |
| `.subtitle` | Smaller text for additional information, displayed below a separator line (12px) |

## Styling with CSS Variables

The Chart Card component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--chart-card-border-radius` | 6px | 6px | Border radius of the card |
| `--chart-card-border-color` | var(--border-color) | var(--border-color) | Border color of the card |
| `--chart-card-background` | var(--default-background) | var(--default-background) | Background color of the card |
| `--chart-card-color` | var(--default-color) | var(--default-color) | Text color within the card |

### Example of Custom Styling

```css
/* Custom styling for chart cards */
.custom-chart-card {
    --chart-card-border-radius: 12px;
    --chart-card-border-color: #2196F3;
    --chart-card-background: #E3F2FD;
    --chart-card-color: #0D47A1;
}
```

## Additional Information

The Chart Card component:
- Is purely CSS-based with no JavaScript functionality
- Automatically adapts to both light and dark themes
- Uses flexbox for layout and alignment
- Has a default padding of 1rem
- Includes a border to visually separate it from surrounding content
- Can be used with any chart library that outputs to HTML elements (like Canvas)

## Best Practices

1. Keep the content concise to maintain readability
2. Use the value element for the most important metric
3. Provide context in the subtitle to help users understand the data
4. Choose chart types that fit well in the available space
5. Maintain consistent styling across multiple chart cards for a cohesive UI