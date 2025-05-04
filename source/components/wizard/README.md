# Wizard Component

The Wizard component provides a step-by-step interface for guiding users through a process with multiple stages. It includes navigation controls and visual indicators for completed steps.

## Usage

```html
<!-- Basic usage -->
<div data-role="wizard">
    <section>
        <div class="page-content">
            <h3>Step 1</h3>
            <p>First step content goes here</p>
        </div>
    </section>
    <section>
        <div class="page-content">
            <h3>Step 2</h3>
            <p>Second step content goes here</p>
        </div>
    </section>
    <section>
        <div class="page-content">
            <h3>Step 3</h3>
            <p>Final step content goes here</p>
        </div>
    </section>
</div>

<!-- With custom options -->
<div data-role="wizard" data-start="2" data-finish="3" class="wizard-wide-md">
    <!-- Steps content -->
</div>
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `wizardDeferred` | Number | `0` | Defer initialization of component in milliseconds |
| `start` | Number | `1` | Initial active step (1-based index) |
| `finish` | Number | `0` | Which page is considered the finish page (0 = none) |
| `iconHelp` | String | `"💡"` | Icon for help button |
| `iconPrev` | String | `"🡐"` | Icon for previous button |
| `iconNext` | String | `"🡒"` | Icon for next button |
| `iconFinish` | String | `"✔"` | Icon for finish button |
| `buttonMode` | String | `"cycle"` | Button appearance: "cycle", "default", or "square" |
| `buttonOutline` | Boolean | `true` | Whether to use outline style for buttons |
| `duration` | Number | `300` | Animation duration in milliseconds |

## Styling Classes

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `clsWizard` | String | `""` | Additional class for wizard component |
| `clsActions` | String | `""` | Additional class for actions bar |
| `clsHelp` | String | `""` | Additional class for help button |
| `clsPrev` | String | `""` | Additional class for previous button |
| `clsNext` | String | `""` | Additional class for next button |
| `clsFinish` | String | `""` | Additional class for finish button |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `onPage` | `{index, page}` | Triggered when any page is shown |
| `onNextPage` | `{index, page}` | Triggered when moving to next page |
| `onPrevPage` | `{index, page}` | Triggered when moving to previous page |
| `onFirstPage` | `{index, page}` | Triggered when moving to first page |
| `onLastPage` | `{index, page}` | Triggered when moving to last page |
| `onFinishPage` | `{index, page}` | Triggered when moving to finish page |
| `onHelpClick` | `{index, page}` | Triggered when help button is clicked |
| `onPrevClick` | `{index, page}` | Triggered when previous button is clicked |
| `onNextClick` | `{index, page}` | Triggered when next button is clicked |
| `onFinishClick` | `{index, page}` | Triggered when finish button is clicked |
| `onBeforePrev` | `[index, page, element]` | Return false to prevent moving to previous page |
| `onBeforeNext` | `[index, page, element]` | Return false to prevent moving to next page |
| `onWizardCreate` | `{element}` | Triggered after wizard component creation |

## API Methods

### next()

Advances to the next step.

```javascript
var wizard = $(element).data("wizard");
wizard.next();
```

### prev()

Goes back to the previous step.

```javascript
var wizard = $(element).data("wizard");
wizard.prev();
```

### first()

Jumps to the first step.

```javascript
var wizard = $(element).data("wizard");
wizard.first();
```

### last()

Jumps to the last step.

```javascript
var wizard = $(element).data("wizard");
wizard.last();
```

### toPage(page)

Jumps to a specific page (1-based index).

```javascript
var wizard = $(element).data("wizard");
wizard.toPage(2); // Go to second step
```

## Global Configuration

You can globally configure the wizard component using the `Metro.wizardSetup` method:

```javascript
Metro.wizardSetup({
    buttonMode: "default",
    buttonOutline: false,
    iconNext: "<span class='mif-arrow-right'></span>",
    iconPrev: "<span class='mif-arrow-left'></span>",
    iconFinish: "<span class='mif-checkmark'></span>",
    iconHelp: "<span class='mif-help'></span>"
});
```

## CSS Variables

The wizard component uses the following CSS variables that you can customize:

| Variable | Default (Light Theme) | Default (Dark Theme) | Description |
| --- | --- | --- | --- |
| `--wizard-height` | `200px` | `200px` | Minimum height of the wizard |
| `--wizard-background` | `#ffffff` | `#1e1f22` | Background color |
| `--wizard-color` | `#191919` | `#dbdfe7` | Text color |
| `--wizard-border-color` | `#f3f3f3` | `#484b4c` | Border color |
| `--wizard-number-color` | `#a8a8a8` | `#a8a8a8` | Step number color |

Example of customizing CSS variables:

```css
:root {
    --wizard-background: #f0f0f0;
    --wizard-border-color: #c0c0c0;
    --wizard-height: 300px;
}
```

## Responsive Features

The wizard component provides responsive options with the following classes:

- `wizard-wide-xs` - Expands step indicators on extra small screens and above
- `wizard-wide-sm` - Expands step indicators on small screens and above
- `wizard-wide-md` - Expands step indicators on medium screens and above
- `wizard-wide-lg` - Expands step indicators on large screens and above
- `wizard-wide-xl` - Expands step indicators on extra large screens and above

Example:
```html
<div data-role="wizard" class="wizard-wide-md">
    <!-- Content -->
</div>
```

## Step Structure

Each step in the wizard is defined by a `<section>` element with content in a child `.page-content` div:

```html
<div data-role="wizard">
    <section>
        <div class="page-content">
            <!-- Step content here -->
        </div>
    </section>
</div>
```

The wizard automatically adds numbering to steps and applies visual styles to indicate current and completed steps.
