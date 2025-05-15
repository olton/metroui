# Audio Player Component

The Audio Player component creates a customizable audio player with controls for playback, volume adjustment, and track progress visualization.

## Usage

```html
<!-- Basic usage -->
<audio data-role="audio-player" data-src="path/to/audio.mp3"></audio>

<!-- With custom options -->
<audio data-role="audio-player" 
       data-volume="0.8" 
       data-loop="true" 
       data-autoplay="true"
       data-show-volume="true"
       data-show-loop="true">
    <source src="path/to/audio.mp3" type="audio/mp3">
    <source src="path/to/audio.ogg" type="audio/ogg">
</audio>
```

## Configuration Options

The Audio Player component can be configured with the following options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| src | string/array | null | Audio source URL or array of source objects with src and type properties |
| playlist | array | null | Playlist of audio tracks |
| volume | number | 0.5 | Initial volume level (0-1) |
| loop | boolean | false | Whether to loop the audio |
| autoplay | boolean | false | Whether to start playing automatically |
| showLoop | boolean | true | Whether to show the loop button |
| showPlay | boolean | true | Whether to show the play/pause button |
| showStop | boolean | true | Whether to show the stop button |
| showMute | boolean | true | Whether to show the mute button |
| showFull | boolean | true | Whether to show the fullscreen button |
| showStream | boolean | true | Whether to show the progress bar |
| showVolume | boolean | true | Whether to show the volume control |
| showInfo | boolean | true | Whether to show the time information |
| showPlaylist | boolean | true | Whether to show playlist controls |
| showNext | boolean | true | Whether to show the next track button |
| showPrev | boolean | true | Whether to show the previous track button |
| showFirst | boolean | true | Whether to show the first track button |
| showLast | boolean | true | Whether to show the last track button |
| showForward | boolean | true | Whether to show the forward button |
| showBackward | boolean | true | Whether to show the backward button |
| showShuffle | boolean | true | Whether to show the shuffle button |
| showRandom | boolean | true | Whether to show the random button |
| loopIcon | string | 🔁 | Icon for the loop button |
| stopIcon | string | ⏹ | Icon for the stop button |
| playIcon | string | ▶ | Icon for the play button |
| pauseIcon | string | ⏸ | Icon for the pause button |
| muteIcon | string | 🔇 | Icon for the mute button |
| volumeLowIcon | string | 🔈 | Icon for low volume |
| volumeMediumIcon | string | 🔉 | Icon for medium volume |
| volumeHighIcon | string | 🔊 | Icon for high volume |
| playlistIcon | string | 📃 | Icon for the playlist button |
| nextIcon | string | → | Icon for the next track button |
| prevIcon | string | ← | Icon for the previous track button |
| firstIcon | string | ⇤ | Icon for the first track button |
| lastIcon | string | ⇥ | Icon for the last track button |
| forwardIcon | string | ⇉ | Icon for the forward button |
| backwardIcon | string | ⇇ | Icon for the backward button |
| shuffleIcon | string | 🔀 | Icon for the shuffle button |
| randomIcon | string | 🎲 | Icon for the random button |
| onPlay | function | Metro.noop | Callback function triggered when audio starts playing |
| onPause | function | Metro.noop | Callback function triggered when audio is paused |
| onStop | function | Metro.noop | Callback function triggered when audio is stopped |
| onEnd | function | Metro.noop | Callback function triggered when audio playback ends |
| onMetadata | function | Metro.noop | Callback function triggered when metadata is loaded |
| onTime | function | Metro.noop | Callback function triggered on time update |
| onAudioPlayerCreate | function | Metro.noop | Callback function triggered when the player is created |

## API Methods

The Audio Player component provides the following API methods:

### play(src)

Plays the audio. If a source is provided, it will change the audio source before playing.

```javascript
// Play current audio
Metro.getPlugin('#myAudio', 'audio-player').play();

// Play with new source
Metro.getPlugin('#myAudio', 'audio-player').play('path/to/new/audio.mp3');
```

### pause()

Pauses the audio playback.

```javascript
Metro.getPlugin('#myAudio', 'audio-player').pause();
```

### resume()

Resumes playback if the audio is paused.

```javascript
Metro.getPlugin('#myAudio', 'audio-player').resume();
```

### stop()

Stops the audio playback and resets the position to the beginning.

```javascript
Metro.getPlugin('#myAudio', 'audio-player').stop();
```

### setVolume(v)

Sets the volume level. If no parameter is provided, returns the current volume.

```javascript
// Set volume to 80%
Metro.getPlugin('#myAudio', 'audio-player').setVolume(0.8);

// Get current volume
const volume = Metro.getPlugin('#myAudio', 'audio-player').setVolume();
```

### loop()

Toggles the loop mode.

```javascript
Metro.getPlugin('#myAudio', 'audio-player').loop();
```

### mute()

Toggles the mute state.

```javascript
Metro.getPlugin('#myAudio', 'audio-player').mute();
```

### changeSource()

Changes the audio source based on the data-src attribute.

```javascript
// After updating the data-src attribute
Metro.getPlugin('#myAudio', 'audio-player').changeSource();
```

### changeVolume()

Changes the volume based on the data-volume attribute.

```javascript
// After updating the data-volume attribute
Metro.getPlugin('#myAudio', 'audio-player').changeVolume();
```

### destroy()

Removes the audio player component and its associated elements.

```javascript
Metro.getPlugin('#myAudio', 'audio-player').destroy();
```

## Styling with CSS Variables

The Audio Player component can be styled using the following CSS variables:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| --player-inactive-color | #555555 | Color of inactive controls |
| --player-active-color | #00b500 | Color of active controls |
| --player-hover-color | #ffffff | Color of controls on hover |
| --player-controls-background | rgba(34, 34, 34, 0.5) | Background color of the controls panel |

### Example of Custom Styling

```css
/* Custom styling for a specific audio player */
#myCustomAudio {
    --player-inactive-color: #888888;
    --player-active-color: #2196F3;
    --player-hover-color: #FFEB3B;
    --player-controls-background: rgba(0, 0, 0, 0.7);
}
```

## Additional Information

The Audio Player component:
- Automatically displays a progress bar showing both playback position and buffering progress
- Provides visual feedback for volume level changes
- Adapts its controls based on screen size (more controls visible on larger screens)
- Displays current time and total duration in a readable format
- Can be used with a single audio source or multiple sources for different formats