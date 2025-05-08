# Wizard Classic Component

The Wizard Classic component provides a step-by-step interface for guiding users through multi-step processes or forms. It features customizable navigation buttons, page transitions, and various styling options.

## Usage

```html
<div data-role="wizard-classic">
    <div class="page">Page 1 Content</div>
    <div class="page">Page 2 Content</div>
    <div class="page">Page 3 Content</div>
</div>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `buttons` | string | `"next, prev, finish, cancel, help"` | Comma-separated list of buttons to display |
| `startPage` | number | `1` | The initial page to show (1-based index) |
| `height` | number | `300` | Height of the wizard in pixels |
| `labelNext` | string | `""` | Custom label for the Next button |
| `labelPrev` | string | `""` | Custom label for the Previous button |
| `labelHelp` | string | `""` | Custom label for the Help button |
| `labelFinish` | string | `""` | Custom label for the Finish button |
| `labelCancel` | string | `""` | Custom label for the Cancel button |
| `iconNext` | string | `""` | HTML for the Next button icon |
| `iconPrev` | string | `""` | HTML for the Previous button icon |
| `iconHelp` | string | `""` | HTML for the Help button icon |
| `iconFinish` | string | `""` | HTML for the Finish button icon |
| `iconCancel` | string | `""` | HTML for the Cancel button icon |
| `clsWizard` | string | `""` | Additional CSS class for the wizard container |
| `clsPage` | string | `""` | Additional CSS class for wizard pages |
| `clsActions` | string | `""` | Additional CSS class for the actions container |
| `clsActionHelp` | string | `""` | Additional CSS class for the Help button |
| `clsActionPrev` | string | `""` | Additional CSS class for the Previous button |
| `clsActionNext` | string | `""` | Additional CSS class for the Next button |
| `clsActionFinish` | string | `""` | Additional CSS class for the Finish button |
| `clsActionCancel` | string | `""` | Additional CSS class for the Cancel button |

## Events

| Event | Description |
| --- | --- |
| `onBeforePage` | Fires before changing the page. Return `false` to prevent page change. |
| `onPage` | Fires when the page changes |
| `onNext` | Fires when the Next button is clicked |
| `onPrev` | Fires when the Previous button is clicked |
| `onFinish` | Fires when the Finish button is clicked |
| `onCancel` | Fires when the Cancel button is clicked |
| `onHelp` | Fires when the Help button is clicked |
| `onMyObjectCreate` | Fires when the component is created |

## Methods

### next()
Navigate to the next page.

```javascript
$(element).data('wizard-classic').next();
```

### prev()
Navigate to the previous page.

```javascript
$(element).data('wizard-classic').prev();
```

### destroy()
Destroy the component and remove it from the DOM.

```javascript
$(element).data('wizard-classic').destroy();
```

## CSS Variables

The component can be customized using the following CSS variables:

| Variable | Default | Description |
| --- | --- | --- |
| `--wizard-classic-border-color` | `#f3f3f3` | Border color of the wizard |
| `--wizard-classic-background` | `#ffffff` | Background color of the wizard |
| `--wizard-classic-color` | `#191919` | Text color of the wizard |

## Example

```html
<div data-role="wizard-classic"
     data-cls-page="d-flex flex-center"
     data-on-help="alert('Help Pressed!')"
     data-on-cancel="alert('Cancel Pressed!')"
     data-on-finish="alert('Finish Pressed!')"
     data-icon-help="<span class='mif-help'>">
    <div class="page">Page 1</div>
    <div class="page">Page 2</div>
    <div class="page">Page 3</div>
    <div class="page">Page 4</div>
</div>
```
