# Video Player Component

Video Player component provides a customizable HTML5 video player with various controls and features such as volume control, fullscreen mode, and custom aspect ratios.

## Usage

```html
<!-- Basic usage -->
<video data-role="video-player" src="video.mp4"></video>

<!-- With custom options -->
<video data-role="video-player" 
       data-aspect-ratio="16/9"
       data-volume="0.8" 
       data-autoplay="true"
       data-poster="poster.jpg">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
</video>

<!-- With array of source files -->
<video data-role="video-player" 
       data-src='[
           {"src": "video.mp4", "type": "video/mp4"},
           {"src": "video.webm", "type": "video/webm"}
       ]'>
</video>
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `videoDeferred` | Number | `0` | Defer initialization of component in milliseconds |
| `src` | String/Array | `null` | Video source URL or array of sources with type |
| `poster` | String | `""` | URL for the video poster image |
| `logo` | String | `""` | URL for logo displayed over the video |
| `logoHeight` | Number | `32` | Height of the logo in pixels |
| `logoWidth` | String | `"auto"` | Width of the logo (can be "auto" or a number of pixels) |
| `logoTarget` | String | `""` | URL that the logo links to when clicked |
| `volume` | Number | `0.5` | Initial volume level (0 to 1) |
| `loop` | Boolean | `false` | Whether the video should loop after ending |
| `autoplay` | Boolean | `false` | Whether the video should play automatically |
| `fullScreenMode` | String | `Metro.fullScreenMode.DESKTOP` | Fullscreen mode: "desktop" or "window" |
| `aspectRatio` | String | `Metro.aspectRatio.HD` | Aspect ratio: "hd" (16:9), "sd" (4:3), or "cinema" (21:9) |
| `controlsHide` | Number | `3000` | Time in milliseconds before controls are hidden (0 = never hide) |
| `showLoop` | Boolean | `true` | Whether to show loop toggle button |
| `showPlay` | Boolean | `true` | Whether to show play/pause button |
| `showStop` | Boolean | `true` | Whether to show stop button |
| `showMute` | Boolean | `true` | Whether to show mute button |
| `showFull` | Boolean | `true` | Whether to show fullscreen button |
| `showStream` | Boolean | `true` | Whether to show progress slider |
| `showVolume` | Boolean | `true` | Whether to show volume slider |
| `showInfo` | Boolean | `true` | Whether to show time info display |
| `loopIcon` | String | `"🔁"` | Icon for loop button |
| `stopIcon` | String | `"⏹"` | Icon for stop button |
| `playIcon` | String | `"▶"` | Icon for play button |
| `pauseIcon` | String | `"⏸"` | Icon for pause button |
| `muteIcon` | String | `"🔇"` | Icon for mute button |
| `volumeLowIcon` | String | `"🔈"` | Icon for low volume |
| `volumeMediumIcon` | String | `"🔉"` | Icon for medium volume |
| `volumeHighIcon` | String | `"🔊"` | Icon for high volume |
| `screenMoreIcon` | String | `"⬜"` | Icon for entering fullscreen |
| `screenLessIcon` | String | `"⬚"` | Icon for exiting fullscreen |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `onPlay` | `{video, player}` | Triggered when video starts playing |
| `onPause` | `{video, player}` | Triggered when video is paused |
| `onStop` | `{video, player}` | Triggered when video is stopped |
| `onEnd` | `{video, player}` | Triggered when video reaches the end |
| `onMetadata` | `{video, player}` | Triggered when video metadata is loaded |
| `onTime` | `{currentTime, duration, video, player}` | Triggered when playback time updates |
| `onVideoPlayerCreate` | `{element, player}` | Triggered after video player component creation |

## API Methods

### play([src])

Plays the video. If `src` parameter is provided, changes the video source first.

```javascript
var player = $("#my-video").data("video-player");
player.play(); // Play current video
player.play("new-video.mp4"); // Change source and play
```

### pause()

Pauses video playback.

```javascript
var player = $("#my-video").data("video-player");
player.pause();
```

### resume()

Resumes video playback if paused.

```javascript
var player = $("#my-video").data("video-player");
player.resume();
```

### stop()

Stops video playback and resets to the beginning.

```javascript
var player = $("#my-video").data("video-player");
player.stop();
```

### setVolume(v)

Gets or sets the video volume level (0 to 1).

```javascript
var player = $("#my-video").data("video-player");
var currentVolume = player.setVolume(); // Get current volume

player.setVolume(0.7); // Set to 70%
player.setVolume(50); // Also accepts 0-100 scale
```

### loop()

Toggles the loop state of the video.

```javascript
var player = $("#my-video").data("video-player");
player.loop();
```

### mute()

Toggles the muted state of the video.

```javascript
var player = $("#my-video").data("video-player");
player.mute();
```

### aspectRatio(ratio)

Changes the aspect ratio of the player.

```javascript
var player = $("#my-video").data("video-player");
player.aspectRatio(Metro.aspectRatio.SD); // Change to 4:3
```

### destroy()

Destroys the component and returns the original element.

```javascript
var player = $("#my-video").data("video-player");
var element = player.destroy();
```

## Global Configuration

You can globally configure the video player component using the `Metro.videoPlayerSetup` method:

```javascript
Metro.videoPlayerSetup({
    aspectRatio: Metro.aspectRatio.SD,
    volume: 0.8,
    autoplay: true,
    showControls: false
});
```

## Aspect Ratio Constants

The component provides three aspect ratio constants:

- `Metro.aspectRatio.HD` - 16:9 (default)
- `Metro.aspectRatio.SD` - 4:3
- `Metro.aspectRatio.CINEMA` - 21:9

## Full Screen Mode Constants

Two fullscreen mode options are available:

- `Metro.fullScreenMode.DESKTOP` - Uses browser fullscreen API (default)
- `Metro.fullScreenMode.WINDOW` - Makes the player fill its container

## Multiple Sources Example

You can provide multiple video sources for different browser support:

```html
<video data-role="video-player">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    <source src="video.ogv" type="video/ogg">
</video>
```

Or via JavaScript:

```javascript
Metro.getPlugin("#my-video", "video-player").play([
    {src: "video.mp4", type: "video/mp4"},
    {src: "video.webm", type: "video/webm"}
]);
```
