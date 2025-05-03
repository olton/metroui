# Tile Component

Tile component provides functionality to create interactive, animated tiles in various sizes with different effects. It's useful for creating modern, Metro-style interfaces with dynamic content presentation.

## Usage

Basic usage:
```html
<div data-role="tile" data-size="medium" data-effect="slide-up">
    <div class="icon">
        <span class="mif-home"></span>
    </div>
    <div class="branding-bar">
        Home
    </div>
</div>
```

Creating a grid of tiles:
```html
<div class="tiles-grid">
    <div data-role="tile" data-size="small">Tile 1</div>
    <div data-role="tile" data-size="medium">Tile 2</div>
    <div data-role="tile" data-size="wide">Tile 3</div>
    <div data-role="tile" data-size="large">Tile 4</div>
</div>
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | String | `medium` | Size of the tile. Available options: small, medium, wide, large, app |
| `cover` | String | `""` | URL to the background cover image |
| `coverPosition` | String | `center` | Position of the background cover image |
| `effect` | String | `""` | Animation effect for slides. Available options: slide-up, slide-down, slide-left, slide-right, fade, zoom, swirl, switch |
| `effectInterval` | Number | `3000` | Interval between effect animations in milliseconds |
| `effectDuration` | Number | `500` | Duration of effect animation in milliseconds |
| `target` | String | `null` | URL to navigate to when the tile is clicked |
| `canTransform` | Boolean | `true` | Whether the tile can transform on click |

## Hover Effects

You can add hover effects to tiles using the following classes:

- `effect-hover-slide-up`
- `effect-hover-slide-down`
- `effect-hover-slide-left`
- `effect-hover-slide-right`
- `effect-hover-zoom-up`
- `effect-hover-zoom-down`
- `effect-hover-zoom-left`
- `effect-hover-zoom-right`

Example:
```html
<div data-role="tile" class="effect-hover-slide-up">
    <div class="slide-front">Front Content</div>
    <div class="slide-back">Back Content</div>
</div>
```

## Tile Sizes

The component supports the following tile sizes:

- `small`: 70x70px
- `medium`: 150x150px
- `wide`: 310x150px
- `large`: 310x310px
- `app`: 310x310px

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `onTileClick` | `{side}` | Triggered when tile is clicked. Side indicates which part of the tile was clicked (left, right, top, bottom) |
| `onTileCreate` | `{element}` | Triggered after tile component creation |

## API Methods

The API methods are accessed via the component's object:

```javascript
var tile = $(selector).data('tile');
```

### destroy()

Destroys the component and removes it from the DOM.

```javascript
var tile = $('#my-tile').data('tile');
tile.destroy();
```

## Tile Elements

You can add several elements to a tile:

### Icon

```html
<div data-role="tile">
    <div class="icon">
        <span class="mif-home"></span>
    </div>
</div>
```

### Branding Bar

```html
<div data-role="tile">
    <div class="branding-bar">
        Tile Title
    </div>
</div>
```

### Badges

```html
<div data-role="tile">
    <span class="badge-top">99+</span>
    <span class="badge-bottom">NEW</span>
</div>
```

## Tile Grid

Tiles can be organized in a grid using the `tiles-grid` class:

```html
<div class="tiles-grid">
    <div data-role="tile" data-size="small" class="col-1 row-1">Tile 1</div>
    <div data-role="tile" data-size="medium" class="col-2 row-1">Tile 2</div>
    <div data-role="tile" data-size="wide" class="col-4 row-3">Tile 3</div>
</div>
```

You can specify the column and row positions with classes:
- `col-{n}`: position in column n
- `row-{n}`: position in row n
- `col-{breakpoint}-{n}`: position in column n for specific breakpoint
- `row-{breakpoint}-{n}`: position in row n for specific breakpoint

## Tile Groups

You can group tiles under a title:

```html
<div class="tiles-group" data-group-title="Group Title">
    <div data-role="tile">Tile 1</div>
    <div data-role="tile">Tile 2</div>
</div>
```

## Sliding Content

Create slides within a tile for animation effects:

```html
<div data-role="tile" data-effect="slide-up">
    <div class="slide">Slide 1</div>
    <div class="slide">Slide 2</div>
    <div class="slide">Slide 3</div>
</div>
```

## Image Set

Create a special tile with multiple images:

```html
<div data-role="tile" class="image-set">
    <img src="image1.jpg">
    <img src="image2.jpg">
    <img src="image3.jpg">
    <img src="image4.jpg">
    <img src="image5.jpg">
</div>
```

## Global Configuration

You can globally configure the tile component using the `Metro.tileSetup` method:

```javascript
Metro.tileSetup({
    size: "large",
    effectInterval: 5000,
    canTransform: false,
});
```

## CSS Variables

The tile component uses the following CSS variables that you can customize:

| Variable | Default (Light Theme) | Default (Dark Theme) | Description |
| --- | --- | --- | --- |
| `--tile-background` | `#ededed` | `#26282e` | Background color |
| `--tile-color` | `#191919` | `#ffffff` | Text color |
| `--tile-border-color` | `var(--border-color)` | `var(--border-color)` | Border color |
| `--tile-border-radius` | `6px` | `6px` | Border radius |
| `--tile-badge-background` | `rgba(25,25,25,0.1)` | `rgba(25,25,25,0.1)` | Badge background |
| `--tile-badge-color` | `#191919` | `#ffffff` | Badge text color |
| `--tile-grid-gap` | `10px` | `10px` | Gap between tiles in grid |

Example of customizing CSS variables:

```css
:root {
    --tile-background: #007ACC;
    --tile-color: white;
    --tile-border-radius: 10px;
    --tile-grid-gap: 15px;
}
```
