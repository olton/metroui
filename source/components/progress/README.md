# Progress Component

The Progress component provides a visual indicator of an operation's progress. It supports various styles including standard progress bars, buffer indicators, loading animations, and segmented progress.

## Usage

### Basic Progress Bar

```html
<!-- Basic progress bar -->
<div data-role="progress" data-value="50"></div>

<!-- Progress bar with label and value -->
<div data-role="progress" data-value="75" data-show-label="true" data-show-value="true"></div>

<!-- Small progress bar -->
<div data-role="progress" data-value="25" data-small="true"></div>
```

### Progress Types

```html
<!-- Standard progress bar (default) -->
<div data-role="progress" data-type="bar" data-value="60"></div>

<!-- Buffer progress bar -->
<div data-role="progress" data-type="buffer" data-value="40" data-buffer="70"></div>

<!-- Loading animation -->
<div data-role="progress" data-type="load"></div>

<!-- Line progress animation -->
<div data-role="progress" data-type="line"></div>

<!-- Segmented progress bar -->
<div data-role="progress" data-type="segment" data-value="50" data-segment-size="15"></div>
```

### Colored Progress Bars

```html
<!-- Primary colored progress bar -->
<div data-role="progress" data-value="65" class="progress-primary"></div>

<!-- Success colored progress bar -->
<div data-role="progress" data-value="80" class="progress-success"></div>

<!-- Warning colored progress bar -->
<div data-role="progress" data-value="45" class="progress-warning"></div>

<!-- Alert colored progress bar -->
<div data-role="progress" data-value="30" class="progress-alert"></div>
```

## Plugin Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `showValue` | boolean | false | Show the progress value percentage |
| `showLabel` | boolean | false | Show the progress label |
| `label` | string | "Progress:" | Text for the progress label |
| `value` | number | 0 | Initial progress value (0-100) |
| `buffer` | number | 0 | Buffer value for buffer type progress (0-100) |
| `type` | string | "bar" | Progress type: "bar", "buffer", "load", "line", or "segment" |
| `small` | boolean | false | Use smaller height for the progress bar |
| `segmentSize` | number | 10 | Size of segments for segment type progress |
| `clsProgress` | string | "" | Additional CSS class for the progress component |
| `clsBack` | string | "" | Additional CSS class for the progress background |
| `clsBar` | string | "" | Additional CSS class for the progress bar |
| `clsBuffer` | string | "" | Additional CSS class for the buffer element |
| `clsValue` | string | "" | Additional CSS class for the value display |
| `clsLabel` | string | "" | Additional CSS class for the label |
| `clsData` | string | "" | Additional CSS class for the data container |

## API Methods

### Get/Set Progress Value

```javascript
// Get current value
var value = $('#my-progress').data('progress').val();

// Set value
$('#my-progress').data('progress').val(75);
```

### Get/Set Buffer Value

```javascript
// Get buffer value
var buffer = $('#my-progress').data('progress').buff();

// Set buffer value
$('#my-progress').data('progress').buff(50);
```

## Events

| Event | Description |
| ----- | ----------- |
| `onValueChange` | Triggered when progress value changes |
| `onBufferChange` | Triggered when buffer value changes |
| `onComplete` | Triggered when progress reaches 100% |
| `onBuffered` | Triggered when buffer reaches 100% |
| `onProgressCreate` | Triggered when progress component is created |

## Styling with CSS Variables

The Progress component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--progress-bar-height` | 12px | 12px | Height of the progress bar |
| `--progress-bar-radius` | 8px | 8px | Border radius of the progress bar |
| `--progress-bar-back-color` | #eeeeee | #363942 | Background color of the progress bar |
| `--progress-bar-color` | #60A917 | #60A917 | Color of the progress bar |
| `--progress-bar-buffer-color` | #CE352C | #CE352C | Color of the buffer element |
| `--progress-bar-line-color` | #b3d4fc | #b3d4fc | Color of the line type progress |
| `--progress-bar-line-back-color` | #004D6F | #004D6F | Background color of the line type progress |
| `--progress-bar-load-color` | radial-gradient(...) | radial-gradient(...) | Color of the load animation |
| `--progress-bar-value-color` | #191919 | #ffffff | Color of the value text |

### Example of Custom Styling

```css
/* Custom styling for a specific progress bar */
#my-custom-progress {
    --progress-bar-height: 16px;
    --progress-bar-radius: 10px;
    --progress-bar-color: #9C27B0;
    --progress-bar-back-color: #E1BEE7;
    --progress-bar-buffer-color: #7B1FA2;
}
```

## Available CSS Classes

### Base Classes
- `.progress-component` - Container for the progress component
- `.progress` - The progress bar element

### Size Modifiers
- `.small` - Smaller height progress bar

### Type Classes
- `.with-load` - For load type progress
- `.line` - For line type progress
- `.segments` - For segmented progress

### Color Classes
- `.progress-primary` - Primary colored progress
- `.progress-secondary` - Secondary colored progress
- `.progress-success` - Success colored progress
- `.progress-warning` - Warning colored progress
- `.progress-alert` - Alert colored progress
- `.progress-info` - Info colored progress
- `.bar-primary`, `.bar-success`, etc. - Color variants for just the bar element