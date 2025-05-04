# Vegas Component

Vegas component provides a versatile background slideshow with various transitions and animation effects. It's based on the Vegas Background Slideshow plugin by Jay Salvat, adapted for Metro UI.

## Usage

```html
<!-- Basic usage -->
<div data-role="vegas" data-slides='[
    {"src": "image1.jpg"},
    {"src": "image2.jpg"},
    {"src": "image3.jpg"}
]'></div>

<!-- With options -->
<div data-role="vegas" 
     data-transition="slideLeft" 
     data-animation="kenburns"
     data-duration="5000"
     data-overlay="5"
     data-slides='[
        {"src": "image1.jpg"},
        {"src": "image2.jpg"},
        {"src": "video.mp4", "video": true}
     ]'></div>
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `duration` | Number | `4000` | Duration of each slide in milliseconds |
| `animationDuration` | Number | `null` | Duration of slide animations in milliseconds |
| `transitionDuration` | Number | `null` | Duration of transitions between slides in milliseconds |
| `transition` | String | `"fade"` | Type of transition between slides |
| `animation` | String | `null` | Type of animation for slides |
| `slides` | Array | `[]` | Array of slide objects |
| `shuffle` | Boolean | `false` | Whether to randomize the order of slides |
| `align` | String | `"center"` | Horizontal alignment of slide content |
| `valign` | String | `"center"` | Vertical alignment of slide content |
| `loop` | Boolean | `true` | Whether to loop through slides continuously |
| `autoplay` | Boolean | `true` | Whether to automatically advance through slides |
| `mute` | Boolean | `true` | Whether to mute video slides |
| `cover` | Boolean/String | `true` | How to size images (`true` for "cover", `false` for "contain", or "repeat") |
| `preload` | Boolean | `true` | Whether to preload all slides |
| `timer` | Boolean | `true` | Whether to show the progress timer |
| `overlay` | Number/Boolean | `2` | Overlay pattern to use (1-9), or false for none |
| `color` | String | `null` | Background color |
| `volume` | Number | `1` | Volume level for videos (0.0 to 1.0) |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `onPlay` | `{}` | Triggered when slideshow starts playing |
| `onPause` | `{slide}` | Triggered when slideshow is paused |
| `onEnd` | `{slide}` | Triggered when slideshow ends |
| `onWalk` | `{slide}` | Triggered when advancing to a slide |
| `onNext` | `{slide}` | Triggered when moving to the next slide |
| `onPrev` | `{slide}` | Triggered when moving to the previous slide |
| `onJump` | `{slide}` | Triggered when jumping to a specific slide |
| `onVegasCreate` | `{element}` | Triggered after Vegas component creation |

## API Methods

### play()

Starts or resumes the slideshow.

```javascript
var vegas = $("#my-vegas").data("vegas");
vegas.play();
```

### pause()

Pauses the slideshow.

```javascript
var vegas = $("#my-vegas").data("vegas");
vegas.pause();
```

### toggle()

Toggles between playing and paused states.

```javascript
var vegas = $("#my-vegas").data("vegas");
vegas.toggle();
```

### playing()

Returns whether the slideshow is currently playing.

```javascript
var vegas = $("#my-vegas").data("vegas");
var isPlaying = vegas.playing(); // true or false
```

### current([advanced])

Gets the current slide. If advanced is true, returns an object with slide index and data.

```javascript
var vegas = $("#my-vegas").data("vegas");
var currentIndex = vegas.current(); // Index number
var currentData = vegas.current(true); // {slide: index, data: slideObject}
```

### jump(n)

Jumps to a specific slide (1-based index).

```javascript
var vegas = $("#my-vegas").data("vegas");
vegas.jump(2); // Jump to second slide
```

### next()

Advances to the next slide.

```javascript
var vegas = $("#my-vegas").data("vegas");
vegas.next();
```

### prev()

Goes back to the previous slide.

```javascript
var vegas = $("#my-vegas").data("vegas");
vegas.prev();
```

## Global Configuration

You can globally configure Vegas component defaults using the `Metro.vegasSetup` method:

```javascript
Metro.vegasSetup({
    duration: 5000,
    transition: "slideLeft",
    animation: "kenburns",
    overlay: false
});
```

## Slide Structure

Slides can be defined as objects in the `slides` array:

```javascript
[
    // Image slide
    {
        "src": "path/to/image.jpg"
    },
    
    // Video slide (string format)
    {
        "src": "path/to/video.mp4",
        "video": true
    },
    
    // Video slide (object format with options)
    {
        "video": {
            "src": ["path/to/video.mp4", "path/to/video.webm"],
            "loop": true,
            "mute": true
        }
    }
]
```

## Transitions

The component supports the following transitions:

- `fade`, `fade2`
- `slideLeft`, `slideLeft2`
- `slideRight`, `slideRight2`
- `slideUp`, `slideUp2`
- `slideDown`, `slideDown2`
- `zoomIn`, `zoomIn2`
- `zoomOut`, `zoomOut2`
- `swirlLeft`, `swirlLeft2`
- `swirlRight`, `swirlRight2`

You can also use `"random"` to randomly select a transition for each slide change.

## Animations

The following animations are available:

- `kenburns`
- `kenburnsUp`
- `kenburnsDown`
- `kenburnsRight`
- `kenburnsLeft`
- `kenburnsUpLeft`
- `kenburnsUpRight`
- `kenburnsDownLeft`
- `kenburnsDownRight`

You can also use `"random"` to randomly select an animation for each slide.

## Overlay Patterns

The component includes 9 overlay patterns (numbered 1-9) that can be applied on top of slides. Set `overlay` to a number between 1 and 9, or `false` to disable overlays.

## Example

```html
<div id="vegas-background" data-role="vegas" 
     data-transition="random"
     data-animation="kenburns"
     data-overlay="2"
     data-slides='[
        {"src": "images/slide1.jpg"},
        {"src": "images/slide2.jpg"},
        {
            "video": {
                "src": ["videos/background.mp4", "videos/background.webm"],
                "loop": true,
                "mute": false
            }
        }
     ]'></div>

<script>
    // Control the slideshow via JavaScript
    var vegas = $("#vegas-background").data("vegas");
    
    // Pause when a button is clicked
    $("#pause-button").on("click", function(){
        vegas.pause();
    });
    
    // Jump to slide 3
    $("#jump-button").on("click", function(){
        vegas.jump(3);
    });
</script>
```

## CSS Variables

The Vegas component uses the following CSS variables that you can customize:

| Variable | Default (Light Theme) | Default (Dark Theme) | Description |
| --- | --- | --- | --- |
| `--vegas-timer-color` | `#ffffff` | `#2b2d30` | Color of the progress timer |

Example of customizing CSS variables:

```css
:root {
    --vegas-timer-color: #ff0000;
}
```
