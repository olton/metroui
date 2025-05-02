# Grid Component

The Grid component provides a flexible, responsive 12-column grid system based on flexbox. It's designed to help you create complex layouts that adapt to different screen sizes.

## Usage

### Basic Grid Layout

```html
<div class="grid">
    <div class="row">
        <div class="cell-6">Half width column</div>
        <div class="cell-6">Half width column</div>
    </div>
    <div class="row">
        <div class="cell-4">One third</div>
        <div class="cell-4">One third</div>
        <div class="cell-4">One third</div>
    </div>
</div>
```

### Responsive Grid

```html
<div class="grid">
    <div class="row">
        <!-- Full width on small screens, half width on medium and up -->
        <div class="cell-12 cell-md-6">Responsive column</div>
        <!-- Full width on small screens, half width on medium and up -->
        <div class="cell-12 cell-md-6">Responsive column</div>
    </div>
</div>
```

### Auto-Width Columns

```html
<div class="grid">
    <div class="row">
        <div class="cell-auto">Auto width (takes only needed space)</div>
        <div class="cell">Flexible width (takes remaining space)</div>
    </div>
</div>
```

### Column Offsets

```html
<div class="grid">
    <div class="row">
        <div class="cell-6 offset-3">Centered column with offset</div>
    </div>
    <div class="row">
        <div class="cell-4">First column</div>
        <div class="cell-4 offset-4">Column with offset</div>
    </div>
</div>
```

### Controlling Gaps

```html
<div class="grid">
    <!-- Default gap (16px) -->
    <div class="row">
        <div class="cell-6">Column</div>
        <div class="cell-6">Column</div>
    </div>
    
    <!-- Custom gap (8px) -->
    <div class="row gap-2">
        <div class="cell-6">Column</div>
        <div class="cell-6">Column</div>
    </div>
    
    <!-- No gap -->
    <div class="row no-gap">
        <div class="cell-6">Column</div>
        <div class="cell-6">Column</div>
    </div>
</div>
```

### Fractional Widths

```html
<div class="grid">
    <div class="row">
        <div class="cell-one-fifth">20% width</div>
        <div class="cell-four-fifth">80% width</div>
    </div>
    <div class="row">
        <div class="cell-two-fifth">40% width</div>
        <div class="cell-three-fifth">60% width</div>
    </div>
</div>
```

## Features

- 12-column grid system based on flexbox
- Responsive classes for different screen sizes
- Auto-width and flexible columns
- Column offsets for layout control
- Customizable gaps between columns
- Fractional width classes (one-fifth, two-fifth, etc.)
- Container query support for component-level responsiveness

## CSS Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| --grid-gap | 16px | Gap between grid columns |

## Available Classes

### Grid Container

- `.grid` - The main grid container

### Row

- `.row` - A row container for columns
- `.row.gap-{0-12}` - Set custom gap size (gap-0 = 0px, gap-1 = 4px, gap-2 = 8px, etc.)
- `.row.no-gap` - Remove gaps between columns

### Columns

- `.cell-{1-12}`, `.col-{1-12}` - Column width (1-12 columns)
- `.cell`, `.col` - Flexible column (takes available space)
- `.cell-auto`, `.col-auto` - Auto width column (takes only needed space)
- `.offset-{1-12}` - Column offset (1-12 columns)

### Fractional Columns

- `.cell-one-fifth`, `.col-one-fifth` - 20% width
- `.cell-two-fifth`, `.col-two-fifth` - 40% width
- `.cell-three-fifth`, `.col-three-fifth` - 60% width
- `.cell-four-fifth`, `.col-four-fifth` - 80% width
- `.cell-half`, `.col-half` - 50% width

### Responsive Columns

For each breakpoint (xs, sm, md, lg, xl, xxl), the following classes are available:

- `.cell-{breakpoint}-{1-12}`, `.col-{breakpoint}-{1-12}` - Column width at specific breakpoint
- `.cell-{breakpoint}`, `.col-{breakpoint}` - Flexible column at specific breakpoint
- `.cell-{breakpoint}-auto`, `.col-{breakpoint}-auto` - Auto width at specific breakpoint
- `.offset-{breakpoint}-{1-12}` - Column offset at specific breakpoint
- `.cell-{breakpoint}-half`, `.col-{breakpoint}-half` - 50% width at specific breakpoint
- `.cell-{breakpoint}-one-fifth`, `.col-{breakpoint}-one-fifth` - 20% width at specific breakpoint
- `.cell-{breakpoint}-two-fifth`, `.col-{breakpoint}-two-fifth` - 40% width at specific breakpoint
- `.cell-{breakpoint}-three-fifth`, `.col-{breakpoint}-three-fifth` - 60% width at specific breakpoint
- `.cell-{breakpoint}-four-fifth`, `.col-{breakpoint}-four-fifth` - 80% width at specific breakpoint

## Spacing

- Default gap between columns is 16px
- Gap between rows is equal to the column gap
- Columns have no padding by default