# Context Menu Component

The Context Menu component provides a customizable right-click menu for any element on your page. It allows you to define menu items with various options including text, icons, links, and nested submenus.

## Usage

### Basic Usage

```javascript
// Create a context menu for the entire document
Metro.contextMenu([
    { text: "Cut", icon: "<span class='mif-scissors'></span>", onclick: function() { console.log("Cut action"); } },
    { text: "Copy", icon: "<span class='mif-copy'></span>", onclick: function() { console.log("Copy action"); } },
    { text: "Paste", icon: "<span class='mif-paste'></span>", onclick: function() { console.log("Paste action"); } },
    { type: "divider" },
    { text: "Delete", icon: "<span class='mif-bin'></span>", onclick: function() { console.log("Delete action"); } }
]);

// Create a context menu for a specific element
const element = document.getElementById("my-element");
Metro.contextMenu([
    { text: "Edit", onclick: function() { console.log("Edit action"); } },
    { text: "Delete", onclick: function() { console.log("Delete action"); } }
], element);
```

### Menu Items with Submenu

```javascript
Metro.contextMenu([
    { 
        text: "File", 
        items: [
            { text: "New", icon: "<span class='mif-file-empty'></span>" },
            { text: "Open", icon: "<span class='mif-folder-open'></span>" },
            { text: "Save", icon: "<span class='mif-floppy-disk'></span>" }
        ]
    },
    { 
        text: "Edit", 
        items: [
            { text: "Cut", icon: "<span class='mif-scissors'></span>" },
            { text: "Copy", icon: "<span class='mif-copy'></span>" },
            { text: "Paste", icon: "<span class='mif-paste'></span>" }
        ]
    }
], element);
```

### Disabled Items and Custom Attributes

```javascript
Metro.contextMenu([
    { text: "Enabled option", onclick: function() { console.log("Clicked"); } },
    { text: "Disabled option", disabled: true },
    { 
        text: "Custom attributes", 
        attributes: {
            "data-role": "custom-item",
            "data-custom": "value"
        }
    }
], element);
```

## Plugin Parameters

The Context Menu component accepts the following parameters:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| items | Array | [] | Array of menu item objects |
| element | DOM Element | document | The element to attach the context menu to |

## Menu Item Properties

Each menu item can have the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| text | String | The text content of the menu item |
| icon | String | HTML for an icon to display before the text |
| href | String | URL for the menu item (defaults to "#") |
| onclick | Function | Click event handler function |
| attributes | Object | Additional HTML attributes to add to the menu item |
| disabled | Boolean | Whether the item is disabled |
| items | Array | Array of submenu items |
| type | String | Set to "divider" to create a separator line |

## Styling with CSS Variables

The Context Menu component inherits styling from the d-menu component and can be customized using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--menu-background` | #ffffff | #1b1e1f | Background color of the menu |
| `--menu-border-color` | #dadbdc | #3f4245 | Border color of the menu |
| `--menu-dropdown-shadow` | 0 2px 4px rgba(0,0,0,.2) | 0 2px 4px rgba(0,0,0,.4) | Shadow for dropdown menus |
| `--menu-item-hover-background` | #f0f0f0 | #2b2d30 | Background color of menu items on hover |
| `--menu-item-hover-color` | #1d1d1d | #ffffff | Text color of menu items on hover |
| `--menu-item-color` | #3a3a3a | #e6e6e6 | Default text color of menu items |

## Additional Information

- The context menu is automatically hidden when clicking anywhere on the page
- The menu appears at the exact position of the right-click
- The component uses the d-menu component for styling and dropdown functionality
- Submenus are implemented using the dropdown component
- The context menu has a z-index of one level higher than fixed elements to ensure it appears above other content