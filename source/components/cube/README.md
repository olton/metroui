# Cube Component

The Cube component is a 3D cube visualization with animated cells that can be used for decorative or interactive purposes in your Metro UI application.

## Usage

### HTML
```html
<div data-role="cube"></div>
```

### JavaScript
```javascript
// Create a cube with custom options
$('#myCube').cube({
    cells: 5,
    color: 'red',
    flashColor: 'yellow'
});

// Access cube methods
var cube = $('#myCube').data('cube');
cube.start();
```

## Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| `cubeDeferred` | `0` | Delay before initialization (milliseconds) |
| `rules` | `null` | Rules for cell animation (uses default rules if null) |
| `color` | `null` | Base color for cells (CSS color or class name) |
| `flashColor` | `null` | Color for flashing cells (CSS color) |
| `flashInterval` | `1000` | Interval between flashes (milliseconds) |
| `numbers` | `false` | Show numbers in cells |
| `offBefore` | `true` | Turn off cells before animation |
| `attenuation` | `0.3` | Attenuation value for flashing effect |
| `stopOnBlur` | `false` | Stop animation when window loses focus |
| `cells` | `4` | Number of cells per side (creates a grid of cells × cells) |
| `margin` | `8` | Margin between cells (pixels) |
| `showAxis` | `false` | Show X, Y, Z axes |
| `axisStyle` | `"arrow"` | Axis style, can be "arrow" or "line" |
| `cellClick` | `false` | Enable toggling cell state on click |
| `autoRestart` | `5000` | Auto restart animation after specified time (milliseconds) |

### CSS Classes Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| `clsCube` | `""` | Additional CSS class for cube container |
| `clsCell` | `""` | Additional CSS class for cells |
| `clsSide` | `""` | Additional CSS class for all sides |
| `clsSideLeft` | `""` | Additional CSS class for left side |
| `clsSideRight` | `""` | Additional CSS class for right side |
| `clsSideTop` | `""` | Additional CSS class for top side |
| `clsSideLeftCell` | `""` | Additional CSS class for cells on left side |
| `clsSideRightCell` | `""` | Additional CSS class for cells on right side |
| `clsSideTopCell` | `""` | Additional CSS class for cells on top side |
| `clsAxis` | `""` | Additional CSS class for all axes |
| `clsAxisX` | `""` | Additional CSS class for X axis |
| `clsAxisY` | `""` | Additional CSS class for Y axis |
| `clsAxisZ` | `""` | Additional CSS class for Z axis |

### Callbacks

| Callback | Description |
| -------- | ----------- |
| `onTick` | Fired on each animation tick |
| `onCubeCreate` | Fired when cube is created |
| `custom` | Custom function for animation (if provided, default animation is not used) |

## Methods

### start()
Starts the cube animation.

```javascript
var cube = $('#myCube').data('cube');
cube.start();
```

### stop()
Stops the cube animation.

```javascript
var cube = $('#myCube').data('cube');
cube.stop();
```

### toRule(index, speed)
Executes rules up to a specific index.

```javascript
var cube = $('#myCube').data('cube');
cube.toRule(2); // Execute rules 0, 1, and 2
```

### rule(r)
Gets or sets the rules for the cube.

```javascript
// Get current rules
var rules = cube.rule();

// Set new rules
cube.rule([
    {
        on: { top: [1, 2, 3], left: [4, 5, 6], right: [7, 8, 9] },
        off: { top: [10, 11, 12], left: [13, 14, 15], right: [16] }
    }
]);
```

### axis(show)
Shows or hides the axes.

```javascript
cube.axis(true);  // Show axes
cube.axis(false); // Hide axes
```

### destroy()
Destroys the component and removes event handlers.

```javascript
cube.destroy();
```

## Styling with CSS Variables

The Cube component can be styled using the following CSS variables (defined as LESS variables in the source):

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `@cubeCellBackground` | `#231F20` | Background color for cube cells |
| `@cubeCellBorder` | `#303030` | Border color for cube cells |
| `@cubeCellColor` | `#767676` | Color used for cell shadows |
| `@cubeCellFlash` | `#c4122f` | Color used for flashing/highlighted cells |

### Customizing with CSS

You can override these variables in your own LESS file:

```less
@cubeCellBackground: #000000;
@cubeCellBorder: #444444;
@cubeCellColor: #888888;
@cubeCellFlash: #ff0000;
```

Or you can directly target the cube elements with CSS:

```css
.cube .side .cube-cell {
    background-color: #000000;
    border-color: #444444;
}

.cube .side .cube-cell.light {
    background-color: #ff0000;
    border-color: #ff0000;
}

.cube .axis {
    background-color: #ff0000;
}
```

## Rules Format

Rules define which cells should be turned on or off during animation. Each rule is an object with `on` and `off` properties, which specify which cells to turn on or off for each side (top, left, right).

```javascript
{
    on: { 
        top: [1, 2, 3],    // Cell IDs to turn on for top side
        left: [4, 5, 6],   // Cell IDs to turn on for left side
        right: [7, 8, 9]   // Cell IDs to turn on for right side
    },
    off: { 
        top: [10, 11, 12], // Cell IDs to turn off for top side
        left: [13, 14, 15], // Cell IDs to turn off for left side
        right: [16]        // Cell IDs to turn off for right side
    }
}
```

Cell IDs are numbered from 1 to (cells × cells), starting from the top-left corner of each side.