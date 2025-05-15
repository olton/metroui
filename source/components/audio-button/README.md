# Audio Button Component

The Audio Button component allows you to create buttons that play audio when clicked. It provides a simple way to add sound effects to your user interface elements.

## Usage

```html
<button class="button" data-role="audio-button" data-audio-src="path/to/sound.mp3">
    Click to play sound
</button>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| audioVolume | number | 0.5 | Volume level for the audio (0.0 to 1.0) |
| audioSrc | string | "" | Path to the audio file |

## Methods

### play(callback)
Plays the audio.

```javascript
var audioButton = Metro.getPlugin('#my-audio-button', 'audio-button');
audioButton.play(function(audio){
    console.log("Audio started playing");
});
```

### stop(callback)
Stops the audio and resets it to the beginning.

```javascript
var audioButton = Metro.getPlugin('#my-audio-button', 'audio-button');
audioButton.stop(function(audio){
    console.log("Audio stopped");
});
```

### destroy()
Destroys the audio button component.

```javascript
var audioButton = Metro.getPlugin('#my-audio-button', 'audio-button');
audioButton.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onAudioStart | Triggered when audio starts playing |
| onAudioEnd | Triggered when audio finishes playing |
| onAudioButtonCreate | Triggered when audio button is created |

## Attributes

You can change the audio source and volume using data attributes:

| Attribute | Description |
| --- | --- |
| data-audio-src | Path to the audio file |
| data-audio-volume | Volume level for the audio (0.0 to 1.0) |

## Metro.playSound Utility

The Audio Button component also provides a utility function `Metro.playSound()` that can be used to play sounds without creating an audio button:

```javascript
// Play sound with a string path
Metro.playSound("path/to/sound.mp3");

// Play sound with options
Metro.playSound({
    audioSrc: "path/to/sound.mp3",
    audioVolume: 0.7,
    onAudioStart: function(src) {
        console.log("Audio started: " + src);
    },
    onAudioEnd: function() {
        console.log("Audio ended");
    }
});
```

## Example

```html
<!-- Simple audio button -->
<button class="button" data-role="audio-button" data-audio-src="sounds/click.mp3">
    Click Me
</button>

<!-- Audio button with custom volume -->
<button class="button success" data-role="audio-button" 
        data-audio-src="sounds/success.mp3" 
        data-audio-volume="0.8">
    Success
</button>
```

```javascript
// Play sound on some event
$("#my-element").on("click", function(){
    Metro.playSound("sounds/notification.mp3");
});
```

## Notes

- The audio button component uses the HTML5 Audio API, so it supports audio formats that are compatible with the user's browser.
- Common supported formats include MP3, WAV, and OGG.
- For better user experience, it's recommended to use short sound files to avoid delays.