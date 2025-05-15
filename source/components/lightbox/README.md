# Lightbox Component

The Lightbox component provides an elegant way to display images in a fullscreen overlay. It includes navigation controls for browsing through multiple images and supports image captions.

## Usage

```html
<div data-role="lightbox">
    <img src="image1.jpg" alt="Image 1">
    <img src="image2.jpg" alt="Image 2">
    <img src="image3.jpg" alt="Image 3">
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| loop | boolean | true | If true, allows looping through images when reaching the end |
| source | string | "img" | Selector for elements that should trigger the lightbox |
| iconClose | string | "❌" | Icon for the close button |
| iconPrev | string | "🡐" | Icon for the previous button |
| iconNext | string | "🡒" | Icon for the next button |
| clsNext | string | "" | Additional CSS class for the next button |
| clsPrev | string | "" | Additional CSS class for the previous button |
| clsClose | string | "" | Additional CSS class for the close button |
| clsImage | string | "" | Additional CSS class for the image |
| clsImageContainer | string | "" | Additional CSS class for the image container |
| clsImageWrapper | string | "" | Additional CSS class for the image wrapper |
| clsLightbox | string | "" | Additional CSS class for the lightbox |

## Methods

### open(element)
Opens the lightbox with the specified element.

```javascript
var lightbox = Metro.getPlugin('#my-lightbox', 'lightbox');
lightbox.open(document.querySelector('#my-lightbox img:first-child'));
```

### close()
Closes the lightbox.

```javascript
var lightbox = Metro.getPlugin('#my-lightbox', 'lightbox');
lightbox.close();
```

### next()
Navigates to the next image.

```javascript
var lightbox = Metro.getPlugin('#my-lightbox', 'lightbox');
lightbox.next();
```

### prev()
Navigates to the previous image.

```javascript
var lightbox = Metro.getPlugin('#my-lightbox', 'lightbox');
lightbox.prev();
```

### destroy()
Destroys the lightbox component.

```javascript
var lightbox = Metro.getPlugin('#my-lightbox', 'lightbox');
lightbox.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onDrawImage | Triggered when an image is drawn in the lightbox |
| onLightboxCreate | Triggered when the lightbox is created |

## Styling

The Lightbox component uses the following CSS classes for styling:

### Base Classes
- `.lightbox-overlay` - The overlay background
- `.lightbox` - The main lightbox container
- `.lightbox__image` - The image container
- `.lightbox__image-wrapper` - The wrapper for the image
- `.lightbox__image-portrait` - Applied to portrait orientation images
- `.lightbox__image-landscape` - Applied to landscape orientation images

### Control Classes
- `.lightbox__closer` - The close button
- `.lightbox__prev` - The previous button
- `.lightbox__next` - The next button

## Examples

### Basic Lightbox
```html
<div data-role="lightbox">
    <img src="image1.jpg" alt="Image 1">
    <img src="image2.jpg" alt="Image 2">
</div>
```

### Custom Icons
```html
<div data-role="lightbox" data-icon-close="✖" data-icon-prev="◀" data-icon-next="▶">
    <img src="image1.jpg" alt="Image 1">
    <img src="image2.jpg" alt="Image 2">
</div>
```

### Lightbox with Custom Source Selector
```html
<div data-role="lightbox" data-source=".lightbox-item">
    <div class="lightbox-item" data-original="image1-large.jpg">
        <img src="image1-thumb.jpg" alt="Image 1">
    </div>
    <div class="lightbox-item" data-original="image2-large.jpg">
        <img src="image2-thumb.jpg" alt="Image 2">
    </div>
</div>
```

### Lightbox with Titles
```html
<div data-role="lightbox">
    <img src="image1.jpg" alt="Beautiful sunset" data-title="Beautiful sunset">
    <img src="image2.jpg" alt="Mountain landscape" data-title="Mountain landscape">
</div>
```

## Best Practices

1. Use the `alt` attribute or `data-title` attribute to provide captions for images
2. Optimize images for web to ensure fast loading in the lightbox
3. Consider using thumbnails with `data-original` pointing to the full-size image for better performance
4. Ensure images have appropriate dimensions to display well in the lightbox