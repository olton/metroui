# Theme Switcher Component

Theme Switcher component provides a convenient way to toggle between light and dark themes in your Metro UI application.

## Usage

```html
<!-- Basic usage -->
<input type="checkbox" data-role="theme-switcher">

<!-- With custom options -->
<input type="checkbox" data-role="theme-switcher" 
       data-mode="button" 
       data-dark-symbol="🌚" 
       data-light-symbol="🌝">
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | String | `Metro.theme.LIGHT` | Initial state of the theme switcher |
| `target` | String | `"html"` | Selector for the element to apply theme classes to |
| `saveState` | Boolean | `true` | Whether to save the selected theme in localStorage |
| `saveStateKey` | String | `"THEME:SWITCHER"` | Key used for storing theme preference in localStorage |
| `clsDark` | String | `""` | Additional class to add to the target when dark theme is active |
| `darkSymbol` | String | `"🌙"` | Symbol displayed when dark theme is active |
| `lightSymbol` | String | `"🌞"` | Symbol displayed when light theme is active |
| `mode` | String | `"switch"` | Display mode: "switch" (toggle switch) or "button" (circular button) |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `onThemeSwitcherCreate` | `{element}` | Triggered after theme switcher component creation |
| `onChangeTheme` | `{state}` | Triggered when theme is changed (state is a boolean: true for dark, false for light) |

## API Methods

### val([value])

Gets or sets the current theme value. Returns `Metro.theme.DARK` or `Metro.theme.LIGHT` if called without arguments.

```javascript
// Get current theme
var themeSwitcher = $('#theme-switcher').data('theme-switcher');
var currentTheme = themeSwitcher.val(); // Returns "dark" or "light"

// Set theme
themeSwitcher.val(Metro.theme.DARK); // Switch to dark theme
// or
themeSwitcher.val(true); // Same as above
```

### destroy()

Destroys the component and removes it from the DOM.

```javascript
var themeSwitcher = $('#theme-switcher').data('theme-switcher');
themeSwitcher.destroy();
```

## Global Configuration

You can globally configure the theme-switcher component using the `Metro.themeSwitcherSetup` method:

```javascript
Metro.themeSwitcherSetup({
    saveState: false,
    darkSymbol: "🌚",
    lightSymbol: "🌝",
    mode: "button"
});
```

## CSS Variables

The theme-switcher component uses the following CSS variables that you can customize:

| Variable | Light Theme Default | Dark Theme Default | Description |
| --- | --- | --- | --- |
| `--theme-switcher-background` | `#e9e9e9` | `#232527` | Background color of the switcher track |
| `--theme-switcher-background-button` | `#ffffff` | `#232527` | Background color in button mode |
| `--theme-switcher-background-checked` | `#191919` | `#474748` | Background color when checked (dark mode) |
| `--theme-switcher-background-disabled` | `#e8e8e8` | `#e8e8e8` | Background color when disabled |
| `--theme-switcher-toggle-color` | `#fff` | `#232527` | Toggle button color |
| `--theme-switcher-toggle-disabled` | `#ccc` | `#3e4145` | Toggle color when disabled |
| `--theme-switcher-text-color` | `#000` | `#efefef` | Text color |
| `--theme-switcher-text-color-checked` | `#fff` | `#fff` | Text color when checked (dark mode) |
| `--theme-switcher-focus-color` | `#e8e8e8` | `#191919` | Focus outline color |
| `--theme-switcher-border-color` | `#e8e8e8` | `#474748` | Border color |

Example of customizing CSS variables:

```css
:root {
    --theme-switcher-background: #f0f0f0;
    --theme-switcher-background-checked: #333;
    --theme-switcher-toggle-color: #ffd700;
}
```

## Display Modes

### Switch Mode (Default)

Displays as a toggle switch with the light/dark symbols:

```html
<input type="checkbox" data-role="theme-switcher" data-mode="switch">
```

### Button Mode

Displays as a circular button that toggles between light/dark symbols:

```html
<input type="checkbox" data-role="theme-switcher" data-mode="button">
```

## Theme Implementation

When activated, the component adds the class `dark-side` to the target element (default is `html`). You can use this class to define your dark theme styles:

```css
:root {
    --background-color: #ffffff;
    --text-color: #000000;
}

.dark-side {
    --background-color: #232527;
    --text-color: #ffffff;
}
```
