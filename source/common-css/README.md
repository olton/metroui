# Common CSS Utilities

The Common CSS component provides a comprehensive set of CSS utilities and variables for styling your Metro UI applications. This component serves as the foundation for consistent styling across the entire framework.

## CSS Variables

### Layout Variables
```css
--layout-fs: /* Font size */
--layout-xs: /* Extra small size */
--layout-sm: /* Small size */
--layout-ld: /* Leading size */
--layout-md: /* Medium size */
--layout-lg: /* Large size */
--layout-xl: /* Extra large size */
--layout-xxl: /* Extra extra large size */
--layout-xxxl: /* Extra extra extra large size */
```

### Color Variables
```css
--default-background: #fff
--default-color: #191919
--default-color-hover: #000000
--default-background-disabled: #f7f8fa
--default-color-disabled: #c9ccd6

--body-background: var(--default-background)
--body-color: var(--default-color)
--body-color-secondary: #a2a5b1
--border-color: #e8e8e8
--link-color: #5a87cb
--link-color-hover: #0056B3FF
--selected-color: #1FB1F8FF

--selected-row-background: #f5f8fe
--selected-item-background: #d4e2ff
```

### Typography Variables
```css
--h1-size: 2rem
--h2-size: 1.5rem
--h3-size: 1.25rem
--h4-size: 1rem
--h5-size: 0.875rem
--h6-size: 0.75rem
--base-text-weight-ultralight: 100
--base-text-weight-light: 300
--base-text-weight-medium: 500
--base-text-weight-normal: 400
--base-text-weight-semibold: 600

--mark-background: #a6d2ff
--mark-color: #191919
--code-background: #99a1b31a
--code-color: #191919
--kbd-background: #004D6FFF
--kbd-color: #ffffff
```

### Font Variables
```css
--font-name: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Roboto", "Ubuntu", "Helvetica Neue", sans-serif
--font-symbol: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji"
--font-size: 1rem
--line-height: 1.5
--font-style: normal
--font-weight: 400
```

## Dark Mode

The Common CSS component includes a dark mode theme that can be applied by adding the `.dark-side` class to an element (typically the `<body>` or a container element). This will override the default light theme variables with dark theme equivalents.

```css
.dark-side {
    --default-background: #1e1f22
    --default-color: #dbdfe7
    --default-color-hover: #dbdfe7
    --default-background-disabled: #343637
    --default-color-disabled: #54565a

    --body-background: var(--default-background)
    --body-color: var(--default-color)
    --body-color-secondary: #c0c0c0
    --border-color: #4a4d51
    --link-color: #5a87cb
    --link-color-hover: #0056B3FF

    --selected-row-background: #26282e
    --selected-item-background: #2e436e
    
    --mark-background: #c0c0c0
    --mark-color: #000000
    --code-background: #2b2d30
    --code-color: #b3b3aa
    --kbd-background: #004D6FFF
    --kbd-color: #ffffff
}
```

## Utility Classes

The Common CSS component provides a wide range of utility classes for common styling needs:

### Typography Utilities

#### Text Weight
- `.text-ultralight` - Ultra light text (100)
- `.text-light` - Light text (300)
- `.text-normal` - Normal text (400)
- `.text-medium` - Medium text (500)
- `.text-bold` - Bold text (600)
- `.text-weight-1` through `.text-weight-10` - Specific font weights from 100 to 1000

#### Text Size
- `.display1` through `.display4` - Large display text
- `.h1` through `.h6` - Heading styles
- `.leader`, `.sub-leader`, `.header`, `.sub-header`, `.alt-header`, `.sub-alt-header` - Various heading styles
- `.text-small`, `.text-secondary` - Smaller text sizes
- `.text-leader`, `.text-leader2` - Leading paragraph styles
- `.reduce-1` through `.reduce-9` - Reduce text size by percentage
- `.enlarge-1` through `.enlarge-9`, `.enlarge-2x`, `.enlarge-3x`, `.enlarge-4x` - Enlarge text size by percentage

#### Text Alignment
- `.text-left` - Left-aligned text
- `.text-right` - Right-aligned text
- `.text-center` - Center-aligned text
- `.text-just` - Justified text

#### Text Transformation
- `.text-upper` - Uppercase text
- `.text-lower` - Lowercase text
- `.text-cap` - Capitalized text

#### Text Decoration
- `.text-italic` - Italic text
- `.text-oblique` - Oblique text
- `.text-overline` - Overlined text
- `.text-linethrough` - Line-through text
- `.text-underline` - Underlined text
- `.text-underover` - Underlined and overlined text
- `.no-decor` - No text decoration

#### Text Overflow
- `.text-ellipsis` - Ellipsis for overflowing text
- `.wrap-long` - Word break for long text

### Flexbox Utilities

#### Display
- `.d-flex` - Display flex
- `.d-inline-flex` - Display inline-flex

#### Flex Direction
- `.flex-row` - Row direction
- `.flex-row-reverse` - Reversed row direction
- `.flex-column` - Column direction
- `.flex-column-reverse` - Reversed column direction

#### Flex Wrap
- `.flex-nowrap` - No wrapping
- `.flex-wrap` - Wrap
- `.flex-wrap-reverse` - Reverse wrap

#### Flex Alignment
- `.flex-align-items-*` - Align items (start, end, center, baseline, stretch, etc.)
- `.flex-align-self-*` - Align self (start, end, center, baseline, stretch, etc.)
- `.flex-align-content-*` - Align content (start, end, center, between, around, stretch, etc.)
- `.flex-justify-content-*` - Justify content (start, end, center, between, around, evenly, etc.)
- `.flex-justify-items-*` - Justify items (start, end, center, stretch, etc.)
- `.flex-justify-self-*` - Justify self (start, end, center, stretch, etc.)

#### Flex Grow/Shrink
- `.flex-grow`, `.flex-no-grow` - Control flex grow for children
- `.flex-shrink`, `.flex-no-shrink` - Control flex shrink for children
- `.flex-grow-self`, `.flex-no-grow-self` - Control flex grow for self
- `.flex-shrink-self`, `.flex-no-shrink-self` - Control flex shrink for self

#### Flex Positioning
- `.flex-center` - Center content both horizontally and vertically
- `.flex-right`, `.flex-left`, `.flex-top`, `.flex-bottom` - Position elements

#### Flex Order
- `.order-1` through `.order-24` - Control the order of flex items

#### Flex Gap
- `.gap-1` through `.gap-12` - Control the gap between flex items

### Border Utilities
Various border utilities for controlling border width, style, color, and radius.

### Spacing Utilities
Utilities for controlling margin and padding.

### Display Utilities
Utilities for controlling element display type.

### Position Utilities
Utilities for controlling element positioning.

### Responsive Variants
Most utility classes have responsive variants that apply at different screen sizes, following the pattern `.{utility}-{breakpoint}`.

Available breakpoints:
- `fs` - Font size
- `xs` - Extra small
- `sm` - Small
- `ld` - Leading
- `md` - Medium
- `lg` - Large
- `xl` - Extra large
- `xxl` - Extra extra large
- `xxxl` - Extra extra extra large

Example: `.text-center-md` will center text only on medium screens and above.

## Usage

To use the Common CSS utilities, simply import the component:

```javascript
import "@olton/metroui/source/common-css";
```

Then apply the utility classes to your HTML elements:

```html
<div class="d-flex flex-justify-content-between flex-align-items-center">
  <h1 class="text-bold text-upper">Title</h1>
  <p class="text-muted">Subtitle</p>
</div>
```

## Customization

You can customize the Common CSS component by overriding the CSS variables in your own stylesheet:

```css
:root {
  --default-background: #f0f0f0;
  --default-color: #333333;
  --link-color: #0078d7;
  --font-name: "Roboto", sans-serif;
  --font-size: 16px;
}
```