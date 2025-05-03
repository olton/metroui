# Master Component

The Master component provides a multi-page container with navigation controls, allowing users to move between pages with animated transitions. It's useful for creating wizards, slideshows, or multi-step forms.

## Usage

```html
<div data-role="master">
    <div class="page">
        <h2>Page 1</h2>
        <p>Content for page 1</p>
    </div>
    <div class="page">
        <h2>Page 2</h2>
        <p>Content for page 2</p>
    </div>
    <div class="page">
        <h2>Page 3</h2>
        <p>Content for page 3</p>
    </div>
</div>
```

## Parameters

| Parameter | Type | Default                 | Description |
| --- | --- |-------------------------| --- |
| masterDeferred | number | 0                       | Deferred initialization time in milliseconds |
| effect | string | "slide"                 | Animation effect ("slide", "fade", "switch") |
| effectFunc | string | "linear"                | Easing function for the animation |
| duration | number | 200                     | Duration of the animation in milliseconds |
| controlPrev | string | "🡐"                    | Previous control icon |
| controlNext | string | "🡒"                    | Next control icon |
| controlTitle | string | "Master, page $1 of $2" | Title template ($1 = current page, $2 = total pages) |
| backgroundImage | string | ""                      | Background image URL |
| clsMaster | string | ""                      | Additional CSS class for the master container |
| clsControls | string | ""                      | Additional CSS class for controls |
| clsControlPrev | string | ""                      | Additional CSS class for previous control |
| clsControlNext | string | ""                      | Additional CSS class for next control |
| clsControlTitle | string | ""                      | Additional CSS class for title |
| clsPages | string | ""                      | Additional CSS class for pages container |
| clsPage | string | ""                      | Additional CSS class for page |

## Methods

### toPage(index)
Goes to a specific page by index (zero-based).

```javascript
var master = Metro.getPlugin('#my-master', 'master');
master.toPage(2); // Go to the third page
```

### next()
Goes to the next page.

```javascript
var master = Metro.getPlugin('#my-master', 'master');
master.next();
```

### prev()
Goes to the previous page.

```javascript
var master = Metro.getPlugin('#my-master', 'master');
master.prev();
```

### changeEffect()
Changes the animation effect based on the data-effect attribute.

```javascript
// First set the data-effect attribute
$('#my-master').attr('data-effect', 'fade');
// Then call the method
var master = Metro.getPlugin('#my-master', 'master');
master.changeEffect();
```

### changeEffectFunc()
Changes the easing function based on the data-effect-func attribute.

```javascript
// First set the data-effect-func attribute
$('#my-master').attr('data-effect-func', 'easeOutQuart');
// Then call the method
var master = Metro.getPlugin('#my-master', 'master');
master.changeEffectFunc();
```

### changeEffectDuration()
Changes the animation duration based on the data-duration attribute.

```javascript
// First set the data-duration attribute
$('#my-master').attr('data-duration', '500');
// Then call the method
var master = Metro.getPlugin('#my-master', 'master');
master.changeEffectDuration();
```

### destroy()
Destroys the master component.

```javascript
var master = Metro.getPlugin('#my-master', 'master');
master.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onBeforePage | Triggered before changing page (return false to cancel) |
| onBeforeNext | Triggered before going to next page (return false to cancel) |
| onBeforePrev | Triggered before going to previous page (return false to cancel) |
| onNextPage | Triggered when going to next page |
| onPrevPage | Triggered when going to previous page |
| onMasterCreate | Triggered when the master is created |

## Styling

The Master component uses the following CSS classes for styling:

### Base Classes
- `.master` - Base class for the component
- `.controls` - Container for navigation controls
- `.controls-top` - Top controls
- `.controls-bottom` - Bottom controls
- `.prev` - Previous button
- `.next` - Next button
- `.title` - Title element
- `.pages` - Container for pages
- `.page` - Individual page

## Examples

### Basic Master
```html
<div data-role="master">
    <div class="page">
        <h2>Page 1</h2>
        <p>Content for page 1</p>
    </div>
    <div class="page">
        <h2>Page 2</h2>
        <p>Content for page 2</p>
    </div>
</div>
```

### Master with Custom Background Images
```html
<div data-role="master" data-background-image="global-bg.jpg">
    <div class="page" data-cover="page1-bg.jpg">
        <h2>Page 1</h2>
        <p>This page has a custom background</p>
    </div>
    <div class="page" data-cover="page2-bg.jpg">
        <h2>Page 2</h2>
        <p>This page has another custom background</p>
    </div>
</div>
```

### Master with Fade Effect
```html
<div data-role="master" data-effect="fade" data-duration="500">
    <div class="page">
        <h2>Page 1</h2>
        <p>Content for page 1</p>
    </div>
    <div class="page">
        <h2>Page 2</h2>
        <p>Content for page 2</p>
    </div>
</div>
```

### Master with Custom Controls
```html
<div data-role="master" 
     data-control-prev="&larr;" 
     data-control-next="&rarr;" 
     data-control-title="Step $1 of $2">
    <div class="page">
        <h2>Step 1</h2>
        <p>First step instructions</p>
    </div>
    <div class="page">
        <h2>Step 2</h2>
        <p>Second step instructions</p>
    </div>
</div>
```

### Master with Event Handling
```html
<div id="wizard" data-role="master">
    <div class="page">
        <h2>Step 1</h2>
        <p>First step instructions</p>
    </div>
    <div class="page">
        <h2>Step 2</h2>
        <p>Second step instructions</p>
    </div>
</div>

<script>
    $(function(){
        var wizard = Metro.getPlugin('#wizard', 'master');
        
        $('#wizard').on('next-page', function(e, data){
            console.log('Moving to next page', data);
        });
        
        $('#wizard').on('before-page', function(e, data){
            // Validate the current page before proceeding
            if (!validateCurrentPage()) {
                return false;
            }
            return true;
        });
    });
</script>
```

## Best Practices

1. Use the `data-cover` attribute on pages to provide page-specific background images
2. Choose appropriate animation effects based on your content and user experience needs
3. Use the `onBeforePage` event to validate user input before allowing navigation
4. Consider using different animation durations based on the complexity of your content
5. For responsive designs, ensure your page content adapts well to different screen sizes