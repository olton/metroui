# Ribbon Menu Component

The Ribbon Menu component provides a Microsoft Office-style ribbon interface for organizing commands and controls into logical groups. It features a tabbed interface with sections containing various button types and controls.

## Usage

```html
<div data-role="ribbon-menu">
    <!-- Tabs -->
    <ul class="tabs-holder">
        <li class="active"><a href="#section-home">Home</a></li>
        <li><a href="#section-edit">Edit</a></li>
        <li><a href="#section-view">View</a></li>
        <li class="static"><a href="help.html">Help</a></li>
    </ul>
    
    <!-- Content -->
    <div class="content-holder">
        <!-- Home section -->
        <div class="section" id="section-home">
            <!-- Group 1 -->
            <div class="group">
                <button class="ribbon-button">
                    <span class="icon">
                        <span class="mif-file-empty"></span>
                    </span>
                    <span class="caption">New</span>
                </button>
                <button class="ribbon-button">
                    <span class="icon">
                        <span class="mif-folder"></span>
                    </span>
                    <span class="caption">Open</span>
                </button>
                <span class="title">File</span>
            </div>
            
            <!-- Group 2 -->
            <div class="group">
                <div class="ribbon-toggle-group">
                    <button class="ribbon-icon-button">
                        <span class="icon"><span class="mif-bold"></span></span>
                        <span class="caption">Bold</span>
                    </button>
                    <button class="ribbon-icon-button">
                        <span class="icon"><span class="mif-italic"></span></span>
                        <span class="caption">Italic</span>
                    </button>
                    <button class="ribbon-icon-button">
                        <span class="icon"><span class="mif-underline"></span></span>
                        <span class="caption">Underline</span>
                    </button>
                </div>
                <span class="title">Format</span>
            </div>
        </div>
        
        <!-- Edit section -->
        <div class="section" id="section-edit">
            <!-- Edit section content -->
        </div>
        
        <!-- View section -->
        <div class="section" id="section-view">
            <!-- View section content -->
        </div>
    </div>
</div>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| ribbonMenuDeferred | number | 0 | Deferred initialization time in milliseconds |

## Methods

### open(tab)
Opens the specified tab.

```javascript
var ribbonMenu = Metro.getPlugin('#myRibbonMenu', 'ribbon-menu');
ribbonMenu.open('#section-edit'); // Open by selector
// or
ribbonMenu.open($('#tab-edit')); // Open by jQuery object
```

### destroy()
Destroys the ribbon-menu component.

```javascript
var ribbonMenu = Metro.getPlugin('#myRibbonMenu', 'ribbon-menu');
ribbonMenu.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onStatic | Triggered when a static tab is clicked |
| onBeforeTab | Triggered before a tab is opened (can return false to prevent opening) |
| onTab | Triggered when a tab is opened |
| onRibbonMenuCreate | Triggered when the ribbon-menu component is created |

## CSS Variables

The Ribbon Menu component can be styled using the following CSS variables:

| Variable | Default (Light) | Default (Dark) | Description |
| --- | --- | --- | --- |
| --ribbon-menu-border-color | #dadbdc | #4a4d51 | Border color for the ribbon menu |
| --ribbon-menu-background | #ffffff | #1e1f22 | Background color of the ribbon menu |
| --ribbon-menu-color | #191919 | #dbdfe7 | Text color of the ribbon menu |
| --ribbon-menu-tab-background | #f5f6f7 | #343637 | Background color of tabs |
| --ribbon-menu-tab-color | #191919 | #ffffff | Text color of tabs |
| --ribbon-menu-tab-background-active | #f5f6f7 | #26282e | Background color of active tab |
| --ribbon-menu-tab-color-active | #191919 | #ffffff | Text color of active tab |
| --ribbon-menu-tab-background-static | #1979ca | #1979ca | Background color of static tab |
| --ribbon-menu-tab-color-static | #ffffff | #ffffff | Text color of static tab |
| --ribbon-menu-button-background | #f5f6f7 | #26282e | Background color of buttons |
| --ribbon-menu-button-color | #191919 | #dbdfe7 | Text color of buttons |
| --ribbon-menu-button-background-hover | rgba(164, 206, 249, 0.2) | rgba(164, 206, 249, 0.2) | Background color of buttons on hover |
| --ribbon-menu-button-background-active | rgba(164, 206, 249, 0.8) | rgba(164, 206, 249, 0.8) | Background color of active buttons |

## Button Types

The Ribbon Menu supports several types of buttons:

### Ribbon Button
Large button with icon and text, typically used for primary actions.

```html
<button class="ribbon-button">
    <span class="icon">
        <span class="mif-file-empty"></span>
    </span>
    <span class="caption">New</span>
</button>
```

### Ribbon Icon Button
Button with icon and text in a horizontal layout, used for common actions.

```html
<button class="ribbon-icon-button">
    <span class="icon"><span class="mif-bold"></span></span>
    <span class="caption">Bold</span>
</button>
```

### Ribbon Tool Button
Small button with only an icon, used for tools and utilities.

```html
<button class="ribbon-tool-button">
    <span class="mif-wrench"></span>
</button>
```

### Ribbon Split Button
Button with a main action and a dropdown for related options.

```html
<div class="ribbon-split-button">
    <button class="ribbon-main">
        <span class="icon">
            <span class="mif-paste"></span>
        </span>
        <span class="caption">Paste</span>
    </button>
    <span class="ribbon-split dropdown-toggle">Paste options</span>
    <ul class="ribbon-dropdown" data-role="dropdown">
        <li><a href="#">Paste Special</a></li>
        <li><a href="#">Paste as Link</a></li>
        <li><a href="#">Paste as Image</a></li>
    </ul>
</div>
```

### Ribbon Toggle Group
Group of toggle buttons where one or more can be selected.

```html
<div class="ribbon-toggle-group">
    <button class="ribbon-icon-button">
        <span class="icon"><span class="mif-align-left"></span></span>
        <span class="caption">Left</span>
    </button>
    <button class="ribbon-icon-button">
        <span class="icon"><span class="mif-align-center"></span></span>
        <span class="caption">Center</span>
    </button>
    <button class="ribbon-icon-button">
        <span class="icon"><span class="mif-align-right"></span></span>
        <span class="caption">Right</span>
    </button>
</div>
```

## Structure

The Ribbon Menu component has the following structure:

```html
<div class="ribbon-menu">
    <!-- Tabs -->
    <ul class="tabs-holder">
        <li class="active"><a href="#section-id">Tab Name</a></li>
        <!-- More tabs -->
    </ul>
    
    <!-- Content -->
    <div class="content-holder">
        <div class="section" id="section-id">
            <div class="group">
                <!-- Buttons and controls -->
                <span class="title">Group Title</span>
            </div>
            <!-- More groups -->
        </div>
        <!-- More sections -->
    </div>
</div>
```

## Custom Styling Example

```css
.custom-ribbon-menu {
    --ribbon-menu-border-color: #3498db;
    --ribbon-menu-background: #ecf0f1;
    --ribbon-menu-color: #2c3e50;
    --ribbon-menu-tab-background: #3498db;
    --ribbon-menu-tab-color: #ffffff;
    --ribbon-menu-tab-background-active: #ffffff;
    --ribbon-menu-tab-color-active: #2c3e50;
    --ribbon-menu-button-background: #ffffff;
    --ribbon-menu-button-color: #2c3e50;
    --ribbon-menu-button-background-hover: rgba(52, 152, 219, 0.2);
    --ribbon-menu-button-background-active: rgba(52, 152, 219, 0.8);
}
```

```html
<div data-role="ribbon-menu" class="custom-ribbon-menu">
    <!-- Ribbon menu content -->
</div>
```

## Example

```html
<div id="documentEditor" data-role="ribbon-menu">
    <ul class="tabs-holder">
        <li class="active"><a href="#section-file">File</a></li>
        <li><a href="#section-edit">Edit</a></li>
        <li><a href="#section-view">View</a></li>
        <li><a href="#section-insert">Insert</a></li>
        <li><a href="#section-format">Format</a></li>
        <li class="static"><a href="help.html">Help</a></li>
    </ul>
    
    <div class="content-holder">
        <div class="section" id="section-file">
            <div class="group">
                <button class="ribbon-button" id="newDocument">
                    <span class="icon"><span class="mif-file-empty"></span></span>
                    <span class="caption">New</span>
                </button>
                <button class="ribbon-button" id="openDocument">
                    <span class="icon"><span class="mif-folder"></span></span>
                    <span class="caption">Open</span>
                </button>
                <button class="ribbon-button" id="saveDocument">
                    <span class="icon"><span class="mif-floppy-disk"></span></span>
                    <span class="caption">Save</span>
                </button>
                <span class="title">Document</span>
            </div>
            
            <div class="group">
                <button class="ribbon-button" id="printDocument">
                    <span class="icon"><span class="mif-printer"></span></span>
                    <span class="caption">Print</span>
                </button>
                <div class="ribbon-split-button">
                    <button class="ribbon-main">
                        <span class="icon"><span class="mif-file-download"></span></span>
                        <span class="caption">Export</span>
                    </button>
                    <span class="ribbon-split dropdown-toggle">Export options</span>
                    <ul class="ribbon-dropdown" data-role="dropdown">
                        <li><a href="#">Export as PDF</a></li>
                        <li><a href="#">Export as DOCX</a></li>
                        <li><a href="#">Export as HTML</a></li>
                    </ul>
                </div>
                <span class="title">Output</span>
            </div>
        </div>
        
        <!-- Other sections -->
    </div>
</div>

<script>
    Metro.init(function(){
        var ribbonMenu = Metro.getPlugin('#documentEditor', 'ribbon-menu');
        
        // Handle tab changes
        ribbonMenu.options.onTab = function(e){
            console.log('Tab changed to:', $(e.tab).find('a').text());
        };
        
        // Handle static tab clicks
        ribbonMenu.options.onStatic = function(e){
            console.log('Static tab clicked:', $(e.tab).find('a').text());
        };
        
        // Add button event handlers
        $('#newDocument').on('click', function(){
            alert('New document created');
        });
        
        $('#openDocument').on('click', function(){
            alert('Open document dialog');
        });
        
        $('#saveDocument').on('click', function(){
            alert('Document saved');
        });
    });
</script>
```

## Best Practices

1. Group related commands together within the same group
2. Use appropriate button types based on the action's importance and frequency of use
3. Keep the most commonly used commands in the first tab (typically "Home")
4. Use icons that clearly represent the action being performed
5. Provide tooltips for buttons to explain their function
6. Consider using static tabs for help or other resources that should always be accessible
7. Limit the number of tabs to avoid overwhelming users
8. Use consistent styling for buttons of the same type