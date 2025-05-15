# Timeline Component

The Timeline component provides a vertical timeline display for chronological events or activities.

## Usage

```html
<ul class="timeline">
    <li>
        <span class="time">10:00</span>
        <span class="data">Event description</span>
    </li>
    <li>
        <span class="time">11:30</span>
        <span class="data">Another event description</span>
    </li>
    <li class="timeline-end">
        <span class="time">14:45</span>
        <span class="data">Final event description</span>
    </li>
</ul>
```

## CSS Classes

- `.timeline` - The main container class for the timeline component
- `.time` - Used for displaying the time of an event
- `.data` - Used for displaying the event description
- `.no-marker` - Add to a list item to hide its marker
- `.timeline-end` - Add to the last list item to hide the connecting line after it

## Styling with CSS Variables

The Timeline component can be customized using the following CSS variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--timeline-marker-color` | `#e8e8e8` | Controls the color of timeline markers and lines |
| `--timeline-time-color` | `#59636e` | Controls the color of the time text |
| `--timeline-color` | `#191919` | Controls the color of the main content text |

### Example of Custom Styling

```css
.timeline {
    --timeline-marker-color: #007bff;
    --timeline-time-color: #6c757d;
    --timeline-color: #212529;
}
```

For dark mode, the component includes a `.dark-side` class with the following variable values:

```css
.dark-side {
    --timeline-marker-color: #3d444d;
    --timeline-time-color: #9198a1;
    --timeline-color: #efefef;
}
```