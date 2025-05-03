# Ripple Component

The Ripple component adds a material design-inspired ripple effect to elements when they are clicked. This provides visual feedback to user interactions, enhancing the user experience.

## Usage

### Basic Usage

```html
<!-- Add ripple effect to a button -->
<button class="button" data-role="ripple">Button with Ripple</button>

<!-- Add ripple effect to any element -->
<div class="card" data-role="ripple">
    <div class="card-content">
        Card with Ripple Effect
    </div>
</div>
```

### Customizing Ripple Color

```html
<!-- Custom ripple color -->
<button class="button" data-role="ripple" data-ripple-color="#ff5252">
    Red Ripple
</button>

<!-- Custom ripple with opacity -->
<div class="card" data-role="ripple" data-ripple-color="#0078d7" data-ripple-alpha="0.6">
    Card with Blue Ripple
</div>
```

### Targeting Child Elements

```html
<!-- Ripple effect on specific child elements -->
<div data-role="ripple" data-ripple-target=".ripple-target">
    <div class="ripple-target">This will have ripple effect</div>
    <div>This will not have ripple effect</div>
    <div class="ripple-target">This will have ripple effect</div>
</div>
```

## Component Parameters

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| rippleDeferred | 0 | Delay before the ripple effect starts (in milliseconds) |
| rippleColor | "#fff" | Color of the ripple effect |
| rippleAlpha | 0.4 | Opacity of the ripple effect (0-1) |
| rippleTarget | "default" | Selector for child elements that should receive the ripple effect. If "default", the effect applies to the element itself |
| onRippleCreate | Metro.noop | Callback function triggered when the ripple is created |

## API Methods

### Metro.rippleSetup(options)

Configure global default options for all ripple components.

```javascript
Metro.rippleSetup({
    rippleColor: "#0078d7",
    rippleAlpha: 0.5
});
```

### Metro.ripple(target, color, alpha, event)

Manually trigger a ripple effect on an element.

```javascript
// Trigger ripple on an element with default settings
Metro.ripple("#myElement");

// Trigger ripple with custom color and opacity
Metro.ripple("#myElement", "#ff5252", 0.6);

// Trigger ripple at a specific position (using an event object)
element.addEventListener("mousedown", function(e) {
    Metro.ripple(this, "#0078d7", 0.5, e);
});
```

## HTML Attributes

| Attribute | Description |
| --------- | ----------- |
| data-ripple-color | Sets the color of the ripple effect |
| data-ripple-alpha | Sets the opacity of the ripple effect (0-1) |

## CSS Styling

The ripple effect uses simple CSS animations to create the expanding circle effect. While there are no specific CSS variables for this component, you can customize the appearance by modifying the following classes:

- `.ripple` - The base ripple element
- `.rippleEffect` - Applied to the ripple when the animation is active

## Accessibility

The ripple effect is purely visual and doesn't affect the accessibility of the elements it's applied to. It provides additional visual feedback for interactions but doesn't change the semantic meaning or keyboard accessibility of the elements.

## Best Practices

1. Use ripple effects on interactive elements like buttons, cards, and list items
2. Choose ripple colors that provide good contrast against the background
3. Consider using a slightly lower alpha value (0.2-0.3) for subtle effects
4. Avoid using ripple effects on elements that aren't interactive, as this may confuse users