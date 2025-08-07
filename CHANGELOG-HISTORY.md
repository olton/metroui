# Changelog

### 5.1.14

+ [x] Updated `Farbe` - fixed `saturate()`, `desaturate()`, and `brighten()`
+ [x] Fixed incorrect behavior of `calendar` and `calendarpicker` components, issue #1991
+ [x] Change `Number.isNaN` to `isNaN`

### 5.1.13

+ [x] Fixed `Component` for using `Dom` instead of `jQuery` if `jQuery` is loaded.
+ [x] Updated `Farbe` class

### 5.1.12

+ [x] `select` - fixed method `val()` no icons were displayed when using this method
+ [x] `select` - added method `clear()` to clear selected value(s)
+ [x] `select` - refactored method `reset()` - now calling this method resets select to initial state
+ [x] `typer` - fixed color change
+ [x] `sidenav-m3` renamed to `sidenav` and has role `sidenav`

### 5.1.11

+ [x] Updated `select` component: added event `onOptions` to `select` component, to remote data added `selected` prop.
+ [x] `md5` moved to `common-js`
+ [x] Fixed function `min`, `max` in `validator` component.

### 5.1.10

- [x] Fixed `dropdown-caret` position on `d-menu` and `v-menu` components.
- [x] Rewritten `h-menu`.
- [x] Fixed `t-menu` for items with submenus.
- [x] Fixed position property for `context-menu` component.
- [x] Improved `sidebar` component.
- [x] Improved `sidenav-simple` menu.
- [x] Improved `sidenav-counter` menu.
- [x] Improved `sidenav-m3` menu.
- [x] Fixed bug in `toast` for applying options
- [x] Updated button size, reduce `large`, added `largest`
- [x] Updated input size, reduce `large`, added `largest`
- [x] Fixed `gravatar` for creating when an element is not `img`, added `avatar` class
- [x] Improved `split-button` component, added `place-left` class for dropdown menu
- [x] Updated `table`, added padding classes `small-padding`, `medium-padding`, `large-padding`, `largest-padding`
- [x] Updated icons, added tags set
- [x] Improved **custom buttons** in `input`, `dialog`, `panel`, and `window` components
- [x] Updated `remote-dataset`, `remote-table` components - changed property names, added custom params
- [x] Fixed using css var `--dialog-border-color`
- [x] Removed **upper-case** from `label-for-input` class
- [x] Fixed losing focus on `input` with role `input-mask` after clicking `tab`
- [x] Updated gradients
- [x] Fixed `x` position in `select` filter input
- [x] Added `product-show-card` component
- [x] Fixed `maxDate` for `calendar` component. Max date now is not included in the range.
- [x] Updated `bulls`, added `chat`, `checkmark`, `cancel`, `tree` images
- [x] Fixed method `val()` for `select` component
- [x] Added component `catalog-menu`
- [x] Added component `stack-menu`
- [x] Added function `getInnerSize()` to `utils` for getting element inner size
- [x] Added sizes `small`, `medium`, `large`, `largest` to `checkbox` and `radio` components
- [x] Added using `clamp()` function for define size for headers `h1...h6`, and `display4...display1` classes
- [x] Updated `breadcrumbs`
- [x] Added component `image-carousel`
- [x] Improved `animated-border` class
- [x] Fixed font-size in `bar3d` component
- [x] Fixed bug for min, max constraints  in `spinner` component
- [x] Improved `remote-dataset`, `remote-table` components for using remote controls

### 5.1.9
+ [x] Added bulls: `star`, `badge`
+ [x] Updated `textarea`, added attribute `data-initial-height`
+ [x] Updated `chat`, added attribute `data-send-mode` (values: `button`, `enter`, `control+enter`)
+ [x] Updated `chat`, an input field type changed to `textarea`
+ [x] Updated `chat`, added support "```...```" code blocks
+ [x] Updated `chat`, added support for emoji
+ [x] Fixed `toggle-button` behavior

### 5.1.8
+ [x] Renamed `radio-button` to `toggle-button`
+ [x] Fixed attribute `data-caption` for `radio` component
+ [x] Added component `cutter` for visual cutting page
+ [x] Added new events to `table` component: `onDrawHead`, `onDrawFoot`, `onDrawBody`, `onInspectorOpen`, `onInspectorClose`, `onFieldShow`, `onFieldHide`, `onFieldToggle`, `onFieldMove`, `onSort`, `onPageChange`, `onRowClick`, `onRowDblClick`, `onCellClick`, `onCellDblClick`
+ [x] Added color classes for `tabs`
+ [x] Updated `tabs` API: method `open` now can accept `target` as a parameter
+ [x] Added new features to `chat` component: attachments, links, code blocks

### 5.1.7
+ [x] Added component `radio-buttons` (n8n style)
+ [x] Fixed component `splitter` for save state
+ [x] Added sizes to `info-button`, `image-button`, `split-button`
+ [x] Added sizes to input controls
+ [x] Fixed hover on appbar menu subitems
+ [x] Updated docs for a lot of components
+ [x] Added component `bar3d`
+ [x] Added component `github-box`
+ [x] Improved component `audio-button`

### 5.1.6
+ [x] Fixed knob position in the witch component
+ [x] Updated docs for a lot of components

### 5.1.5
+ [x] Fixed checkbox bug in `table` component
+ [x] Updated docs for a lot of components

### 5.1.4
+ [x] Updated colors `yellow`, `seashell`, `clown`
+ [x] To `navview` added new CSS vars: `--navview-icon-color`, `--navview-icon-color-hover`, `--navview-icon-color-active`
+ [x] `navview` now uses two chars for icon replacer if caption has two words: for caption `Serhii Pimenov` will be used `SP`
+ [x] Remove default styles for lists: `list-style-type`
+ [x] Fixed the dialog close action for default actions
+ [x] Fixed knob position in `switch` component

### 5.1.3
+ [x] Improved `audio-player` component
+ [x] Fixed i18n for `clock` component
+ [x] Fixed input `file` component
+ [x] Fixed `resetWith` method in `countdown` component

### 5.1.2
+ [x] Added new languages for `i18n` component: `de`, `es`, `fr`, `hi`, `it`, `pl`, `pt`, `zh`
+ [x] Ukrainian language for `i18n` component renamed to `uk`
+ [x] Updated `hotkey` component: arbitrary order of special keys: `ctrl+shift+alt+f`, added handler for `windows`/`command` key
+ [x] Fixed icons for `wizard`
+ [x] Added component `wizard-classic`
+ [x] Minor fixes and improvements
+ [x] Fixed `i18n` component

### 5.1.1
+ [x] Added a combined hotkeys feature. Now you can create hotkey as: `alt+1 2`
+ [x] Improved window caption buttons
+ [x] Improved `ribbon-menu` component, added scrollable feature
+ [x] Removed default transition property, update loading button
+ [x] Fixed bug in `countdown` component

### 5.1.0
+ [x] Updated color values, each color is worked by hand.
+ [x] Added gradient backgrounds with `gr-COLOR`, `gr-light-COLOR`, and `gr-dark-COLOR`
+ [x] Added new colors: `champagne`, `khaki`, `charcoal`, `cinnamon`, `glaucous`, `nude`, `terracotta`, `coral`, `army`, `seashell`
+ [x] Renamed colors to `*-color`, `*-light-color`, `*-dark-color`
+ [x] Improved progress bars
+ [x] Added classes `.animated-border`, `.animated-border-COLOR`
+ [x] Full refactoring
+ [x] New components
+ [x] Dark/Light themes for all components
+ [x] Complete migration from JavaScript 5 to JavaScript 6+
+ [x] New build engine with esbuild
+ [x] New built-in libraries (Dom, Hooks, Html, Farme, Datetime, Guardian, -String, Router, Model)
+ [x] Built-in Reactive Model with two ways binding
+ [x] New i18n engine
+ [x] And much, much more...

### 5.0.13
+ [x] Update Sidenav Counter, added role, theme
+ [x] Update NavView (save compact state)
+ [x] Set the default size for body to `100vh`

### 5.0.12
+ [x] Update components for themes
+ [x] Update NavView (save compact state)
+ [x] Update sizing css, added `h-10, h-66, h-80, h-90`
+ [x] Improve Spinner button hold event 
+ [x] Fix Calendar duplicate day 27 for october

### 5.0.11
+ [x] Fix G.number()
+ [x] Bugs fixes

### 5.0.7
+ [x] Update components for themes
+ [x] Update Hooks
+ [x] Update m4q
+ [x] Update Farbe


### 5.0.6
+ [x] Fixed `app-bar-menu` for collapsed `appbar`
+ [x] Redesign `navview` and upd for themes
+ [x] Update `listview` for themes
+ [x] Update `select` for themes
+ [x] Redesign `grid`. Now used with grid gap instead of cell padding. You can compile old grid manually from file `grid-old.less`.

### 5.0.5
+ [x] Update `dialog` for themes
+ [x] Added color variables
+ [x] Updated `m4q`, new methods: `$.curry`, `$.compose`, `$.pipe`
+ [x] Redesign `treeview`

### 5.0.4
+ [x] Improved `app-bar`, added `dark`, `light` themes
+ [x] Improved `d-menu`, added `dark`, `light` themes
+ [x] Fix `d-menu` in `app-bar`
+ [x] Improved `collapse` components
+ [x] Improved `panel`, added `dark`, `light` themes
+ [x] `expand-button` renamed to `transofrm-button`, added new states `left`, `right`, `top`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` 
+ [x] Added component `theme-switcher`
+ [x] Update `common css` for themes
+ [x] Update `accordion` for themes
+ [x] Update `calendar` for themes
+ [x] Update `button-group` for themes
+ [x] Update `checkbox` for themes, `style2` removed
+ [x] Update `cards` for themes
+ [x] Added class `error`
+ [x] Updated `breadcrumbs default`, added new style `breadcrumbs arrow`


### 5.0.3
+ [x] Improved counter with `useEffect`
+ [x] Improved `v-menu`
+ [x] Update `core libs`
+ [x] Added `grid2`

### 5.0.2
+ [x] Improved `d-menu`, fix interacts with other components (`treeview`, `sidenav-m3`, `app-bar`)

### 5.0.1
+ [x] Fixed button `outline` style
+ [x] Improved `d-menu` 

### 5.0.0
+ [x] Added/updated libs `color`, `html`, `datetime`, `string`, `hooks`, `animation`, `m4q`
+ [x] Improved any components (`treeview`)
+ [x] Added `page-control`
+ [x] Bugs fixed
+ [x] Improved building with `rollup`
