# Media Player Component

The Media Player component provides styling for HTML5 video and audio elements with custom controls. It offers a consistent and attractive interface for media playback across different browsers.

## Usage

### Video Player

```html
<div class="media-player">
    <video src="video.mp4" controls></video>
    <div class="logo">
        <img src="logo.png" alt="Logo">
    </div>
    <div class="preloader"></div>
    <div class="controls">
        <button class="button loop"><span class="mif-loop"></span></button>
        <button class="button play"><span class="mif-play"></span></button>
        <button class="button stop"><span class="mif-stop"></span></button>
        <div class="info-box">00:00 / 00:00</div>
        <div class="stream">
            <div class="slider" data-role="slider"></div>
            <div class="load-audio"></div>
        </div>
        <button class="button mute"><span class="mif-volume-medium"></span></button>
        <div class="volume">
            <div class="slider" data-role="slider" data-value="100"></div>
        </div>
        <button class="button full"><span class="mif-enlarge"></span></button>
    </div>
</div>
```

### Audio Player

```html
<div class="media-player audio-player">
    <audio src="audio.mp3" controls></audio>
    <div class="controls">
        <button class="button loop"><span class="mif-loop"></span></button>
        <button class="button play"><span class="mif-play"></span></button>
        <button class="button stop"><span class="mif-stop"></span></button>
        <div class="info-box">00:00 / 00:00</div>
        <div class="stream">
            <div class="slider" data-role="slider"></div>
            <div class="load-audio"></div>
        </div>
        <button class="button mute"><span class="mif-volume-medium"></span></button>
        <div class="volume">
            <div class="slider" data-role="slider" data-value="100"></div>
        </div>
    </div>
</div>
```

## Styling

The Media Player component uses the following CSS classes for styling:

### Base Classes
- `.media-player` - Base class for the media player container
- `.audio-player` - Additional class for audio players

### Elements
- `.logo` - Container for a logo overlay
- `.preloader` - Loading indicator (add `.show` class to display)
- `.controls` - Container for player controls
- `.stream` - Progress bar container
- `.load-audio` - Audio loading progress indicator
- `.info-box` - Display for time information
- `.volume` - Volume control container

### Control Buttons
- `.loop` - Loop button
- `.play` - Play/pause button
- `.stop` - Stop button
- `.mute` - Mute button
- `.full` - Fullscreen button

### Modifiers
- `.outside` - Places controls outside the media container
- `.light` - Light theme variant
- `.full-screen` - Applied when in fullscreen mode

## Examples

### Basic Video Player
```html
<div class="media-player">
    <video src="video.mp4" controls></video>
</div>
```

### Video Player with Logo
```html
<div class="media-player">
    <video src="video.mp4" controls></video>
    <div class="logo">
        <img src="logo.png" alt="Logo">
    </div>
</div>
```

### Light Theme Video Player
```html
<div class="media-player light">
    <video src="video.mp4" controls></video>
</div>
```

### Audio Player
```html
<div class="media-player audio-player">
    <audio src="audio.mp3" controls></audio>
</div>
```

### Player with External Controls
```html
<div class="media-player">
    <video src="video.mp4"></video>
</div>
<div class="controls outside">
    <button class="button play"><span class="mif-play"></span></button>
    <div class="stream">
        <div class="slider" data-role="slider"></div>
    </div>
    <button class="button mute"><span class="mif-volume-medium"></span></button>
</div>
```

## JavaScript Integration

While the Media Player component itself doesn't include JavaScript functionality, you can use the HTML5 Media API to control the player:

```javascript
$(function(){
    var video = document.querySelector('video');
    var player = $(video).closest('.media-player');
    
    // Play/pause button
    player.find('.play').on('click', function(){
        if (video.paused) {
            video.play();
            $(this).find('span').removeClass('mif-play').addClass('mif-pause');
        } else {
            video.pause();
            $(this).find('span').removeClass('mif-pause').addClass('mif-play');
        }
    });
    
    // Update time display
    video.addEventListener('timeupdate', function(){
        var currentTime = formatTime(video.currentTime);
        var duration = formatTime(video.duration);
        player.find('.info-box').text(currentTime + ' / ' + duration);
    });
    
    // Format time helper
    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }
});
```

## Responsive Behavior

The Media Player component is fully responsive:

- On small screens (below 576px), the loop, stop, and volume controls are hidden
- On larger screens, all controls are displayed
- The player container adapts to the width of its parent element
- Video maintains its aspect ratio while filling the container width

## Best Practices

1. Always provide fallback content for browsers that don't support HTML5 video/audio
2. Include multiple source formats (MP4, WebM, OGG) for better browser compatibility
3. Add the `preload="metadata"` attribute to improve initial loading performance
4. Consider adding the `poster` attribute to video elements to show a preview image
5. For accessibility, include captions or subtitles using the `<track>` element