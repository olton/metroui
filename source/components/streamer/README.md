# Streamer Component

The Streamer Component is a timeline-based UI element for displaying events in streams. It allows you to create interactive timelines with events organized in different streams.

## Plugin Parameters

The Streamer Component accepts the following parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| streamerDeferred | Number | 0 | Deferred initialization time in milliseconds |
| wheel | Boolean | true | Enable mouse wheel scrolling |
| wheelStep | Number | 20 | Scroll step for mouse wheel |
| duration | Number | METRO_ANIMATION_DURATION | Animation duration |
| defaultClosedIcon | String | "" | Default icon for closed state |
| defaultOpenIcon | String | "" | Default icon for open state |
| changeUri | Boolean | true | Change URI when selecting events |
| encodeLink | Boolean | true | Encode links in URI |
| closed | Boolean | false | Initial state (closed or open) |
| chromeNotice | Boolean | false | Show Chrome browser notice |
| startFrom | String | null | Start time point |
| slideToStart | Boolean | true | Slide to start position |
| startSlideSleep | Number | 1000 | Delay before sliding to start position |
| source | String | null | Data source URL |
| data | Object | null | Data object |
| eventClick | String | "select" | Event click behavior |
| selectGlobal | Boolean | true | Global event selection |
| streamSelect | Boolean | false | Enable stream selection |
| excludeSelectElement | String | null | Selector for elements to exclude from selection |
| excludeClickElement | String | null | Selector for elements to exclude from click |
| excludeElement | String | null | Selector for elements to exclude from both selection and click |
| excludeSelectClass | String | "" | Class for elements to exclude from selection |
| excludeClickClass | String | "" | Class for elements to exclude from click |
| excludeClass | String | "" | Class for elements to exclude from both selection and click |

## Events

The Streamer Component provides the following events:

| Event | Description |
|-------|-------------|
| onDataLoad | Triggered when data loading starts |
| onDataLoaded | Triggered when data is loaded |
| onDataLoadError | Triggered when data loading fails |
| onDrawEvent | Triggered when an event is drawn |
| onDrawGlobalEvent | Triggered when a global event is drawn |
| onDrawStream | Triggered when a stream is drawn |
| onStreamClick | Triggered when a stream is clicked |
| onStreamSelect | Triggered when a stream is selected |
| onEventClick | Triggered when an event is clicked |
| onEventSelect | Triggered when an event is selected |
| onEventsScroll | Triggered when events are scrolled |
| onStreamerCreate | Triggered when the streamer is created |

## API Methods

### scrollEvents(direction, step)

Scrolls events in the specified direction.

```javascript
const streamer = Metro.getPlugin('#streamer', 'streamer');
streamer.scrollEvents('left', 20);
```

### buildEvents()

Rebuilds the events area.

```javascript
const streamer = Metro.getPlugin('#streamer', 'streamer');
streamer.buildEvents();
```

### build()

Rebuilds the entire streamer.

```javascript
const streamer = Metro.getPlugin('#streamer', 'streamer');
streamer.build();
```

### source(source)

Sets a new data source and rebuilds the streamer.

```javascript
const streamer = Metro.getPlugin('#streamer', 'streamer');
streamer.source('data/streamer.json');
```

### data(data)

Sets new data and rebuilds the streamer.

```javascript
const streamer = Metro.getPlugin('#streamer', 'streamer');
streamer.data({
  timeline: {
    start: "09:00",
    stop: "18:00",
    step: 20
  },
  streams: [
    // Stream data
  ]
});
```

## CSS Styling

The Streamer Component can be styled using the following CSS variables:

```css
:root {
    --streamer-item-width: 224px;
    --streamer-background: #ffffff;
    --streamer-color: #191919;
    --streamer-stream-border-color: #fefefe;
    --stream-event-group-background: #f7f8fa;
    --stream-event-group-color: #191919;
    --stream-event-background: #fefefe;
    --stream-event-color: #191919;
    --stream-event-border-color: #fefefe;
    --stream-event-border-color-hover: #fefefe;
    --stream-event-border-radius: 6px;
    --stream-event-shadow-color: #b5b5b5;
    --streamer-scrollbar-size: 10px;
    --streamer-scrollbar-color: #000;
    --streamer-scrollbar-thumb-color: #2e9fff;
}
```

### Dark Theme

The Streamer Component also supports a dark theme:

```css
.dark-side {
    --streamer-background: #343637;
    --streamer-color: #dbdfe7;
    --streamer-stream-border-color: #2b2d30;
    --stream-event-group-background: #272729;
    --stream-event-group-color: #191919;
    --stream-event-background: #343637;
    --stream-event-color: #dbdfe7;
    --stream-event-border-color: #484b4c;
    --stream-event-border-color-hover: #616567;
    --stream-event-shadow-color: #191919;
    --streamer-scrollbar-color: #000;
    --streamer-scrollbar-thumb-color: #ff6211;
}
```

## Example Usage

```html
<div id="streamer" data-role="streamer" 
     data-source="data/streamer.json"
     data-start-from="10:00"
     data-slide-to-start="true">
</div>
```

```javascript
// Initialize with JavaScript
Metro.makePlugin('#streamer', 'streamer', {
    source: 'data/streamer.json',
    startFrom: '10:00',
    slideToStart: true,
    onEventClick: function(event, eventData) {
        console.log('Event clicked:', eventData);
    }
});
```

## Data Format

The Streamer Component expects data in the following format:

```javascript
{
  "timeline": {
    "start": "09:00",
    "stop": "18:00",
    "step": 20
  },
  "streams": [
    {
      "title": "Stream 1",
      "secondary": "Secondary text",
      "icon": "<span class='mif-apps'></span>",
      "cls": "bg-cyan fg-white",
      "events": [
        {
          "time": "10:00",
          "title": "Event 1",
          "subtitle": "Subtitle",
          "icon": "images/icon.png",
          "cls": "bg-green fg-white",
          "size": "medium"
        }
      ]
    }
  ]
}
```