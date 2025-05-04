# Stepper Component

The Stepper component displays a sequence of steps, highlighting the current step and marking completed steps. It's useful for multi-step processes like wizards, forms, or checkout flows.

## Usage

```html
<div data-role="stepper" data-steps="5" data-step="2"></div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| stepperDeferred | number | 0 | Deferred initialization time in milliseconds |
| view | string | "square" | Visual style of the stepper: "square", "cycle", or "diamond" |
| steps | number | 3 | Number of steps to display |
| step | number | 1 | Initial active step |
| stepClick | boolean | false | Whether clicking on a step changes the active step |
| clsStepper | string | "" | Additional CSS class for the stepper container |
| clsStep | string | "" | Additional CSS class for each step |
| clsComplete | string | "" | Additional CSS class for completed steps |
| clsCurrent | string | "" | Additional CSS class for the current step |

## Events

| Event | Description |
| --- | --- |
| onStep | Triggered when the active step changes |
| onStepClick | Triggered when a step is clicked |
| onStepperCreate | Triggered when the stepper is created |

## Methods

### next()

Moves to the next step.

```javascript
Metro.getPlugin('#myStepper', 'stepper').next();
```

### prev()

Moves to the previous step.

```javascript
Metro.getPlugin('#myStepper', 'stepper').prev();
```

### first()

Moves to the first step.

```javascript
Metro.getPlugin('#myStepper', 'stepper').first();
```

### last()

Moves to the last step.

```javascript
Metro.getPlugin('#myStepper', 'stepper').last();
```

### toStep(step)

Moves to a specific step.

```javascript
// Move to step 3
Metro.getPlugin('#myStepper', 'stepper').toStep(3);
```

## CSS Variables

The Stepper component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --stepper-step-background | #515151 | #515151 | Background color of the step |
| --stepper-step-color | #FFFFFF | #FFFFFF | Text color of the step |
| --stepper-step-background-complete | #00B500 | #00B500 | Background color of completed steps |
| --stepper-step-color-complete | #FFFFFF | #FFFFFF | Text color of completed steps |
| --stepper-step-background-current | #94B6FF | #94B6FF | Background color of the current step |
| --stepper-step-color-current | #FFFFFF | #FFFFFF | Text color of the current step |
| --stepper-line-color | #e3e3e3 | #2b2d30 | Color of the line connecting the steps |

## Styling with CSS

You can customize the appearance of the Stepper by overriding the CSS variables:

```css
:root {
  --stepper-step-background: #757575;
  --stepper-step-color: #ffffff;
  --stepper-step-background-complete: #4caf50;
  --stepper-step-color-complete: #ffffff;
  --stepper-step-background-current: #2196f3;
  --stepper-step-color-current: #ffffff;
  --stepper-line-color: #e0e0e0;
}
```

### Step Shapes

The Stepper component supports different step shapes:

- Square: Default shape (no additional class needed)
- Cycle (Round): Add `data-view="cycle"` attribute
- Diamond: Add `data-view="diamond"` attribute

```html
<div data-role="stepper" data-view="square" data-steps="4"></div>
<div data-role="stepper" data-view="cycle" data-steps="4"></div>
<div data-role="stepper" data-view="diamond" data-steps="4"></div>
```

### Vertical Stepper

You can create a vertical stepper by adding the `vertical` class:

```html
<div data-role="stepper" class="vertical" data-steps="5"></div>
```

## Examples

### Basic Stepper

```html
<div data-role="stepper" data-steps="5" data-step="2"></div>
```

### Interactive Stepper

```html
<div data-role="stepper" data-steps="4" data-step="1" data-step-click="true"></div>
```

### Stepper with Custom Classes

```html
<div data-role="stepper" 
     data-steps="3" 
     data-cls-stepper="custom-stepper" 
     data-cls-step="custom-step" 
     data-cls-complete="custom-complete" 
     data-cls-current="custom-current">
</div>
```