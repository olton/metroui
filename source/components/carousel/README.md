# Carousel Component

The Carousel component provides a versatile and customizable slideshow for cycling through elements like images or slides of content. It supports various transition effects, navigation controls, and automatic cycling.

## Usage

### Basic Carousel

```html
<div class="carousel">
    <div class="slides">
        <div class="slide">Slide 1</div>
        <div class="slide">Slide 2</div>
        <div class="slide">Slide 3</div>
    </div>
</div>
```

### Carousel with Background Images

```html
<div class="carousel" data-role="carousel">
    <div class="slides">
        <div class="slide" data-cover="image1.jpg"></div>
        <div class="slide" data-cover="image2.jpg"></div>
        <div class="slide" data-cover="image3.jpg"></div>
    </div>
</div>
```

### Carousel with Custom Options

```html
<div class="carousel" 
     data-role="carousel" 
     data-auto-start="true" 
     data-effect="fade" 
     data-control-prev="<span class='mif-arrow-left'></span>" 
     data-control-next="<span class='mif-arrow-right'></span>">
    <div class="slides">
        <div class="slide">Slide 1</div>
        <div class="slide">Slide 2</div>
        <div class="slide">Slide 3</div>
    </div>
</div>
```

## Plugin Parameters

The Carousel component accepts the following configuration options:

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| `autoStart` | `false` | Whether to automatically start the carousel |
| `width` | `"100%"` | Width of the carousel |
| `height` | `"16/9"` | Height of the carousel (can be aspect ratio like "16/9", "4/3", "21/9" or a fixed pixel value) |
| `effect` | `"slide"` | Transition effect between slides. Options: "slide", "slide-v", "fade", "switch", "zoom", "swirl" |
| `effectFunc` | `"linear"` | Easing function for the transition effect |
| `direction` | `"left"` | Direction of the carousel movement. Options: "left", "right" |
| `duration` | `300` | Duration of the transition effect in milliseconds |
| `period` | `5000` | Time between slide transitions in milliseconds |
| `stopOnMouse` | `true` | Whether to pause the carousel when the mouse hovers over it |
| `controls` | `true` | Whether to show the next/previous controls |
| `controlsOnMouse` | `false` | Whether to show controls only when the mouse hovers over the carousel |
| `controlsOutside` | `false` | Whether to position controls outside the carousel |
| `controlPrev` | `"&larr;"` | HTML content for the previous control |
| `controlNext` | `"&rarr;"` | HTML content for the next control |
| `bullets` | `true` | Whether to show the bullet navigation |
| `bulletsStyle` | `"square"` | Style of the bullets. Options: "square", "circle", "rect", "diamond" |
| `bulletsSize` | `"default"` | Size of the bullets. Options: "default", "mini", "small", "large" |
| `bulletsPosition` | `"default"` | Position of the bullets. Options: "default", "left", "right" |

### CSS Class Parameters

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| `clsCarousel` | `""` | Additional CSS class for the carousel element |
| `clsSlides` | `""` | Additional CSS class for the slides container |
| `clsSlide` | `""` | Additional CSS class for each slide |
| `clsControls` | `""` | Additional CSS class for the controls |
| `clsControlNext` | `""` | Additional CSS class for the next control |
| `clsControlPrev` | `""` | Additional CSS class for the previous control |
| `clsBullets` | `""` | Additional CSS class for the bullets container |
| `clsBullet` | `""` | Additional CSS class for each bullet |
| `clsBulletOn` | `""` | Additional CSS class for the active bullet |
| `clsThumbOn` | `""` | Additional CSS class for the active thumbnail |

### Event Callbacks

| Callback | Description |
| -------- | ----------- |
| `onStop` | Triggered when the carousel stops |
| `onStart` | Triggered when the carousel starts |
| `onPlay` | Triggered when the carousel plays |
| `onSlideClick` | Triggered when a slide is clicked |
| `onBulletClick` | Triggered when a bullet is clicked |
| `onThumbClick` | Triggered when a thumbnail is clicked |
| `onMouseEnter` | Triggered when the mouse enters the carousel |
| `onMouseLeave` | Triggered when the mouse leaves the carousel |
| `onNextClick` | Triggered when the next control is clicked |
| `onPrevClick` | Triggered when the previous control is clicked |
| `onSlideShow` | Triggered when a slide is shown |
| `onSlideHide` | Triggered when a slide is hidden |
| `onCarouselCreate` | Triggered when the carousel is created |

## API Methods

The Carousel component provides the following API methods:

| Method | Description |
| ------ | ----------- |
| `toSlide(index)` | Navigate to a specific slide by index |
| `next()` | Navigate to the next slide |
| `prev()` | Navigate to the previous slide |
| `stop()` | Stop the carousel |
| `play()` | Start the carousel |
| `setEffect(effect)` | Change the transition effect |

### Example of API Usage

```javascript
// Get the carousel element
const carousel = Metro.getPlugin('#myCarousel', 'carousel');

// Navigate to a specific slide
carousel.toSlide(2);

// Navigate to the next slide
carousel.next();

// Stop the carousel
carousel.stop();

// Start the carousel
carousel.play();

// Change the transition effect
carousel.setEffect('fade');
```

## Styling with CSS Variables

The Carousel component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--carousel-background` | `var(--default-background)` | `var(--default-background)` | Background color of the carousel |
| `--carousel-switch-color` | `var(--default-color)` | `var(--default-color)` | Color of the navigation switches |
| `--carousel-switch-color-hover` | `var(--default-color-hover)` | `var(--default-color-hover)` | Hover color for navigation switches |
| `--carousel-bullet-color` | `#f5f8fe` | `#26282e` | Color of the bullets |
| `--carousel-bullet-color-active` | `#50a8ff` | `#50a8ff` | Color of the active bullet |

### Example of Custom Styling

```css
/* Custom styling for a specific carousel */
#myCustomCarousel {
    --carousel-background: #f0f8ff;
    --carousel-switch-color: #0078d7;
    --carousel-switch-color-hover: #0063b1;
    --carousel-bullet-color: #d0d0d0;
    --carousel-bullet-color-active: #0078d7;
}
```

## Available CSS Classes

### Base Classes
- `.carousel` - Main carousel container
- `.slides` - Container for slides
- `.slide` - Individual slide
- `.active-slide` - Currently active slide

### Control Classes
- `.carousel-switch-next` - Next control button
- `.carousel-switch-prev` - Previous control button
- `.carousel-bullets` - Container for bullet navigation
- `.carousel-bullet` - Individual bullet
- `.bullet-on` - Active bullet

### Size Modifiers for Bullets
- `.default-size` - Default size bullets
- `.mini-size` - Mini size bullets
- `.small-size` - Small size bullets
- `.large-size` - Large size bullets

### Style Modifiers for Bullets
- `.bullet-style-square` - Square bullets
- `.bullet-style-cycle` - Circular bullets
- `.bullet-style-diamond` - Diamond-shaped bullets
- `.bullet-style-rect` - Rectangular bullets

### Layout Modifiers
- `.controls-outside` - Places controls outside the carousel

## Accessibility

The Carousel component includes features for improved accessibility:
- Proper keyboard navigation support
- ARIA attributes for screen readers
- Pause on hover functionality to give users time to read content
- High contrast visual indicators

## Best Practices

1. Always provide alternative text for image slides to improve accessibility
2. Use appropriate slide transition durations (not too fast or too slow)
3. Consider disabling auto-rotation for content that requires more time to read
4. Ensure sufficient contrast between slide content and background
5. Test carousel navigation with keyboard-only users in mind
6. Use meaningful content in slides rather than purely decorative elements