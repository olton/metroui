# Flip Card Component

The Flip Card component is a purely CSS-based component that creates a card with front and back sides that can be flipped either horizontally or vertically. The flip effect can be triggered on hover or when the card has an "active" class.

## HTML Structure

```html
<div class="flip-card">
    <div class="front">
        <!-- Front content goes here -->
    </div>
    <div class="back">
        <!-- Back content goes here -->
    </div>
</div>
```

## CSS Classes

The Flip Card component uses the following CSS classes:

| Class | Description |
| ----- | ----------- |
| `flip-card` | The main container class for the flip card component |
| `front` | The front side of the card |
| `back` | The back side of the card |
| `flip-horizontal` | Makes the card flip horizontally (by default, the card flips vertically) |
| `effect-on-hover` | Triggers the flip effect when the user hovers over the card |
| `effect-on-active` | Triggers the flip effect when the card has the `active` class |

## Examples

### Basic Flip Card (Vertical Flip on Hover)

```html
<div class="flip-card effect-on-hover">
    <div class="front">
        <h3>Front Side</h3>
        <p>This is the front content of the card.</p>
    </div>
    <div class="back">
        <h3>Back Side</h3>
        <p>This is the back content of the card.</p>
    </div>
</div>
```

### Horizontal Flip Card with Active State

```html
<div class="flip-card flip-horizontal effect-on-active">
    <div class="front">
        <h3>Front Side</h3>
        <p>Click a button to activate the flip.</p>
    </div>
    <div class="back">
        <h3>Back Side</h3>
        <p>This is the back content of the card.</p>
    </div>
</div>
```

To trigger the flip effect with JavaScript:

```javascript
// Select the flip card
const flipCard = document.querySelector('.flip-card.effect-on-active');

// Toggle the active class to flip the card
flipCard.classList.toggle('active');
```

## CSS Variables

The Flip Card component uses the following CSS variables:

| Variable | Default Value | Description |
| -------- | ------------- | ----------- |
| `@defaultAnimationSpeed` | `.3s` | The duration of the flip animation |
| `@defaultPerspective` | `600px` | The perspective value for the 3D effect |

## Customization

You can customize the Flip Card component by overriding the default CSS variables:

```css
:root {
    --defaultAnimationSpeed: 0.5s; /* Slower animation */
    --defaultPerspective: 1000px; /* More dramatic perspective */
}
```

Or by adding your own styles:

```css
.flip-card {
    width: 300px;
    height: 200px;
    margin: 20px;
}

.flip-card .front,
.flip-card .back {
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.flip-card .front {
    background-color: #f8f9fa;
}

.flip-card .back {
    background-color: #e9ecef;
}
```

## Notes

- The flip card requires a defined width and height to work properly
- Both the front and back sides are absolutely positioned within the container
- The component uses CSS 3D transforms for the flip effect
- The flip effect is triggered either on hover or by adding/removing the `active` class