# Splitter Component

The Splitter component divides a container into resizable panels, allowing users to adjust the size of each panel by dragging the divider (gutter) between them.

## Usage

```html
<div data-role="splitter">
  <div>Panel 1 Content</div>
  <div>Panel 2 Content</div>
  <div>Panel 3 Content</div>
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| splitterDeferred | number | 0 | Deferred initialization time in milliseconds |
| split | string | "vertical" | Split mode: "vertical" or "horizontal" |
| splitSizes | string/array | null | Initial sizes of the split panels (comma-separated string or array) |
| gutterSize | number | 5 | Size of the gutter between panels in pixels |
| gutterStyle | string | "default" | Style of the gutter: "default", "ribbed", "dashed", "dotted" |
| minSizes | string/array | null | Minimum sizes of the panels (comma-separated string or array) |
| children | string | "*" | Selector for the child elements to be split |
| gutterClick | string | "expand" | Behavior when the gutter is clicked |
| saveState | boolean | false | Whether to save the state of the splitter |
| noResize | boolean | false | Whether to disable resizing |

## Events

| Event | Description |
| --- | --- |
| onResizeStart | Triggered when resizing starts |
| onResizeStop | Triggered when resizing stops |
| onResizeSplit | Triggered during resizing |
| onResizeWindow | Triggered when the window is resized |
| onSplitterCreate | Triggered when the splitter is created |

## Methods

### changeAttribute(attributeName)

Updates the splitter when specified attributes change.

```javascript
Metro.getPlugin('#mySplitter', 'splitter').changeAttribute('data-split-sizes');
```

### setSize(sizes)

Sets the sizes of the split panels.

```javascript
// Set panel sizes to 30%, 40%, 30%
Metro.getPlugin('#mySplitter', 'splitter').setSize([30, 40, 30]);
```

## CSS Variables

The Splitter component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --splitter-color | #F8F8F8 | #1e1f22 | Background color of the splitter |
| --splitter-color-active | #F8F8F8 | #26282e | Background color of the active splitter |
| --splitter-gutter-color | #BEBEBE | #4a4d51 | Color of the gutter |
| --splitter-gutter-color-active | #BEBEBE | #2e436e | Color of the active gutter |
| --gutter-dot-size | 2px | 2px | Size of the dots in the dotted gutter style |
| --gutter-bg-size | 8px | 8px | Size of the background in the dotted gutter style |
| --gutter-bg-position | calc(var(--gutter-bg-size) / 2) | calc(var(--gutter-bg-size) / 2) | Position of the background in the dotted gutter style |
| --gutter-dot-color | var(--splitter-color) | var(--splitter-color) | Color of the dots in the dotted gutter style |
| --gutter-dot-color-second | var(--splitter-gutter-color) | var(--splitter-gutter-color) | Secondary color of the dots in the dotted gutter style |

## Styling with CSS

You can customize the appearance of the Splitter by overriding the CSS variables:

```css
:root {
  --splitter-color: #f0f0f0;
  --splitter-color-active: #e0e0e0;
  --splitter-gutter-color: #c0c0c0;
  --splitter-gutter-color-active: #a0a0a0;
}
```

### Gutter Styles

The Splitter component supports different gutter styles:

- Default: No additional class
- Ribbed: Add `gutter-style-ribbed` class
- Dashed: Add `gutter-style-dashed` class
- Dotted: Add `gutter-style-dotted` class

```html
<div data-role="splitter" data-gutter-style="ribbed">
  <div>Panel 1 Content</div>
  <div>Panel 2 Content</div>
</div>
```

### Split Modes

The Splitter component supports two split modes:

- Vertical: Panels are arranged horizontally, with vertical gutters
- Horizontal: Panels are arranged vertically, with horizontal gutters

```html
<div data-role="splitter" data-split="vertical">
  <div>Panel 1 Content</div>
  <div>Panel 2 Content</div>
</div>

<div data-role="splitter" data-split="horizontal">
  <div>Panel 1 Content</div>
  <div>Panel 2 Content</div>
</div>
```

### Static Size

You can disable resizing by setting the `data-no-resize` attribute to `true`:

```html
<div data-role="splitter" data-no-resize="true">
  <div>Panel 1 Content</div>
  <div>Panel 2 Content</div>
</div>
```

## Examples

### Basic Vertical Splitter

```html
<div data-role="splitter">
  <div>Left Panel</div>
  <div>Right Panel</div>
</div>
```

### Horizontal Splitter with Custom Sizes

```html
<div data-role="splitter" data-split="horizontal" data-split-sizes="30, 70">
  <div>Top Panel (30%)</div>
  <div>Bottom Panel (70%)</div>
</div>
```

### Three-Panel Splitter with Minimum Sizes

```html
<div data-role="splitter" data-min-sizes="100, 200, 100">
  <div>Left Panel (min 100px)</div>
  <div>Middle Panel (min 200px)</div>
  <div>Right Panel (min 100px)</div>
</div>
```