# Accordion Component

The Accordion component provides a way to organize content into collapsible sections, allowing users to expand or collapse each section individually. It's useful for presenting information in a compact and organized manner.

## Usage

```html
<div class="accordion" data-role="accordion">
    <div class="frame">
        <div class="heading">Section 1</div>
        <div class="content">Content for section 1</div>
    </div>
    <div class="frame">
        <div class="heading">Section 2</div>
        <div class="content">Content for section 2</div>
    </div>
    <div class="frame active">
        <div class="heading">Section 3 (Initially Open)</div>
        <div class="content">Content for section 3</div>
    </div>
</div>
```

## Configuration Options

The Accordion component can be configured with the following options:

| Option | Type | Default | Description |
| ------ | ---- |---------| ----------- |
| accordionDeferred | number | 0       | Deferred initialization time in milliseconds |
| showMarker | boolean | true    | Show/hide marker (arrow) in the heading |
| material | boolean | false   | Use material design style |
| duration | number | 100     | Animation duration for expanding/collapsing |
| oneFrame | boolean | true    | Allow only one frame to be open at a time |
| showActive | boolean | true    | Show active frames on initialization |
| clsFrame | string | ""      | Additional CSS class for frames |
| clsHeading | string | ""      | Additional CSS class for headings |
| clsContent | string | ""      | Additional CSS class for content |
| clsAccordion | string | ""      | Additional CSS class for the accordion container |
| clsActiveFrame | string | ""      | Additional CSS class for active frames |
| clsActiveFrameHeading | string | ""      | Additional CSS class for active frame headings |
| clsActiveFrameContent | string | ""      | Additional CSS class for active frame content |

## Events

The Accordion component provides the following events:

| Event | Description |
| ----- | ----------- |
| onFrameOpen | Triggered when a frame is opened |
| onFrameBeforeOpen | Triggered before a frame is opened (return false to cancel) |
| onFrameClose | Triggered when a frame is closed |
| onFrameBeforeClose | Triggered before a frame is closed (return false to cancel) |
| onAccordionCreate | Triggered when the accordion is created |

## API Methods

The Accordion component provides the following API methods:

### open(index)

Opens the frame at the specified index.

```javascript
Metro.getPlugin('#myAccordion', 'accordion').open(2); // Opens the third frame
```

### close(index)

Closes the frame at the specified index.

```javascript
Metro.getPlugin('#myAccordion', 'accordion').close(0); // Closes the first frame
```

### toggle(index)

Toggles the state of the frame at the specified index.

```javascript
Metro.getPlugin('#myAccordion', 'accordion').toggle(1); // Toggles the second frame
```

### getActive()

Returns an array of indices of currently active (open) frames.

```javascript
const activeFrames = Metro.getPlugin('#myAccordion', 'accordion').getActive();
console.log(activeFrames); // e.g., [0, 2] if first and third frames are open
```

## Styling with CSS Variables

The Accordion component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --accordion-heading-background | #f8f8f8 | #2b2d30 | Background color of the accordion headings |
| --accordion-heading-color | #191919 | #dfe1e5 | Text color of the accordion headings |

### Example of Custom Styling

```css
/* Custom styling for a specific accordion */
#myCustomAccordion {
    --accordion-heading-background: #e0f7fa;
    --accordion-heading-color: #006064;
}
```

## Additional Styling Options

### Marker Display

By default, the accordion shows markers (arrows) in the headings. You can control this with the `showMarker` option or by adding/removing the `marker-on` class.

### Material Design

Enable material design styling by setting the `material` option to `true` or by adding the `material` class to the accordion.

### RTL Support

For right-to-left languages, add the `rtl` class or `dir="rtl"` attribute to the accordion.

## Accessibility

The Accordion component includes ARIA attributes for improved accessibility:
- Headings have `role="button"` and `aria-expanded` attributes
- Content sections have `role="region"` and `aria-labelledby` attributes
- Keyboard navigation is supported (Enter/Space to toggle, Up/Down arrows to navigate)