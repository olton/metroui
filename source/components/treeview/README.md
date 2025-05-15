# TreeView Component

TreeView component provides a hierarchical view of data in a tree-like structure, allowing users to navigate through different levels of information.

## Usage

```html
<!-- Basic usage -->
<ul data-role="tree-view">
    <li data-caption="Item 1"></li>
    <li data-caption="Folder 1" data-type="node">
        <ul>
            <li data-caption="Sub Item 1"></li>
            <li data-caption="Sub Item 2" data-icon="<span class='mif-file'></span>"></li>
        </ul>
    </li>
</ul>

<!-- With checkboxes -->
<ul data-role="tree-view">
    <li data-caption="Option 1" data-type="checkbox" data-name="options[]" data-value="1"></li>
    <li data-caption="Option 2" data-type="checkbox" data-name="options[]" data-value="2"></li>
</ul>
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `treeviewDeferred` | Number | `0` | Defer initialization of component in milliseconds |
| `showChildCount` | Boolean | `false` | Show count of child nodes |
| `duration` | Number | `100` | Duration of animation in milliseconds |
| `hideActionsOnLeave` | Boolean | `true` | Hide action menu when mouse leaves node |
| `recheckTimeout` | Number | `100` | Timeout for rechecking state of tree checkboxes |
| `leaves` | Array/Object | `[]` | Data to create tree structure |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `onNodeClick` | `{node}` | Triggered when a node is clicked |
| `onNodeDblClick` | `{node}` | Triggered when a node is double-clicked |
| `onNodeDelete` | `{node}` | Triggered when a node is deleted |
| `onNodeInsert` | `{node, parent}` | Triggered when a node is inserted |
| `onNodeClean` | `{node}` | Triggered when a node is cleaned (children removed) |
| `onCheckClick` | `{checked, check, node}` | Triggered when a checkbox is clicked |
| `onRadioClick` | `{checked, check, node}` | Triggered when a radio button is clicked |
| `onExpandNode` | `{node}` | Triggered when a node is expanded |
| `onCollapseNode` | `{node}` | Triggered when a node is collapsed |
| `onTreeViewCreate` | `{element}` | Triggered after tree view component creation |

## API Methods

### current([node])

Gets or sets the current node.

```javascript
// Get current node
var treeView = $("#my-tree").data("tree-view");
var currentNode = treeView.current();

// Set current node
treeView.current($("#my-tree li").eq(2));
```

### toggleNode(node)

Toggles a node's expanded/collapsed state.

```javascript
var treeView = $("#my-tree").data("tree-view");
treeView.toggleNode($("#my-tree li").eq(1));
```

### expandNode(node)

Expands a specific node.

```javascript
var treeView = $("#my-tree").data("tree-view");
treeView.expandNode($("#my-tree li.tree-node").eq(0));
```

### collapseNode(node)

Collapses a specific node.

```javascript
var treeView = $("#my-tree").data("tree-view");
treeView.collapseNode($("#my-tree li.tree-node").eq(0));
```

### expandAll()

Expands all nodes in the tree.

```javascript
var treeView = $("#my-tree").data("tree-view");
treeView.expandAll();
```

### collapseAll()

Collapses all nodes in the tree.

```javascript
var treeView = $("#my-tree").data("tree-view");
treeView.collapseAll();
```

### addTo(targetNode, data)

Adds a new node to the target node or to the root if targetNode is not specified.

```javascript
var treeView = $("#my-tree").data("tree-view");

// Add to root
treeView.addTo(null, {
    caption: "New Root Item",
    icon: "<span class='mif-file'></span>"
});

// Add to specific node
var targetNode = $("#my-tree li").eq(1);
treeView.addTo(targetNode, {
    caption: "New Child Item",
    icon: "<span class='mif-file'></span>"
});
```

### insertBefore(targetNode, data)

Inserts a node before the specified target node.

```javascript
var treeView = $("#my-tree").data("tree-view");
var targetNode = $("#my-tree li").eq(1);

treeView.insertBefore(targetNode, {
    caption: "New Item Before",
    icon: "<span class='mif-file'></span>"
});
```

### insertAfter(targetNode, data)

Inserts a node after the specified target node.

```javascript
var treeView = $("#my-tree").data("tree-view");
var targetNode = $("#my-tree li").eq(1);

treeView.insertAfter(targetNode, {
    caption: "New Item After",
    icon: "<span class='mif-file'></span>"
});
```

### del(targetNode)

Deletes the specified node.

```javascript
var treeView = $("#my-tree").data("tree-view");
var nodeToDelete = $("#my-tree li").eq(2);

treeView.del(nodeToDelete);
```

### clean(targetNode)

Removes all children from the specified node.

```javascript
var treeView = $("#my-tree").data("tree-view");
var nodeToClean = $("#my-tree li").eq(1);

treeView.clean(nodeToClean);
```

### fillTree(leaves, [node])

Fills the tree with data.

```javascript
var treeView = $("#my-tree").data("tree-view");

treeView.fillTree([
    {
        caption: "Item 1",
        icon: "<span class='mif-file'></span>"
    },
    {
        caption: "Folder 1",
        icon: "<span class='mif-folder'></span>",
        items: [
            {
                caption: "Sub Item 1",
                icon: "<span class='mif-file'></span>"
            },
            {
                caption: "Sub Item 2",
                icon: "<span class='mif-file'></span>"
            }
        ]
    }
]);
```

## Node Data Structure

When creating nodes programmatically, you can use the following properties:

```javascript
{
    caption: "Node Title",              // Node text
    icon: "<span class='mif-file'></span>", // Icon HTML or image URL
    html: "<div>Custom content</div>",  // Custom HTML content
    link: "https://example.com",        // URL for node
    badge: "99:bg-red",                 // Badge with text and optional class
    badges: ["New:bg-green", "Hot:bg-orange"], // Multiple badges
    current: true,                      // Mark as current node
    type: "node",                       // "node" for expandable nodes
    collapsed: true,                    // Initial collapse state
    secondary: "Details:text-muted",    // Secondary text with optional class
    style: "color: red",                // Custom CSS style
    attributes: {                       // Custom attributes
        "data-custom": "value"
    },
    actions: [                          // Custom actions menu
        {
            caption: "Edit",
            icon: "<span class='mif-pencil'></span>",
            onclick: function() { console.log("Edit clicked"); }
        },
        { type: "divider" },
        {
            caption: "Delete",
            icon: "<span class='mif-bin'></span>",
            cls: "alert",
            onclick: function() { console.log("Delete clicked"); }
        }
    ],
    items: []                           // Child items
}
```

## Checkbox and Radio Nodes

```javascript
// Checkbox node
{
    type: "checkbox",
    caption: "Option 1",
    name: "options[]",
    value: "1",
    checked: true
}

// Radio node
{
    type: "radio",
    caption: "Option A",
    name: "radio-group",
    value: "a",
    checked: false
}
```

## Input Nodes

```javascript
// Input node
{
    type: "input",
    caption: "Search",
    name: "search",
    placeholder: "Enter search term",
    value: ""
}
```

## Global Configuration

You can globally configure the treeview component using the `Metro.treeViewSetup` method:

```javascript
Metro.treeViewSetup({
    duration: 300,
    hideActionsOnLeave: false,
    // other options
});
```

## CSS Variables

The treeview component uses the following CSS variables that you can customize:

| Variable | Default (Light Theme) | Default (Dark Theme) | Description |
| --- | --- | --- | --- |
| `--treeview-background` | `#ffffff` | `#1e1f22` | Background color |
| `--treeview-color` | `#43454a` | `#dfe1e5` | Text color |
| `--treeview-selected-row-background` | `#d4e2ff` | `#43454a` | Selected node background |
| `--treeview-selected-row-color` | `#2b2d30` | `#ffffff` | Selected node text color |
| `--treeview-node-toggle-color` | `#191919` | `#ffffff` | Toggle icon color |

Example of customizing CSS variables:

```css
:root {
    --treeview-background: #f0f0f0;
    --treeview-selected-row-background: #0078d7;
    --treeview-selected-row-color: white;
}
```

## HTML Structure Example

```html
<ul data-role="tree-view">
    <!-- Simple item -->
    <li data-caption="Simple item"></li>
    
    <!-- Item with icon -->
    <li data-caption="Item with icon" data-icon="<span class='mif-file'></span>"></li>
    
    <!-- Node with children -->
    <li data-caption="Node with children" data-type="node" data-collapsed="true">
        <ul>
            <li data-caption="Child item 1"></li>
            <li data-caption="Child item 2"></li>
        </ul>
    </li>
    
    <!-- Item with badge -->
    <li data-caption="Item with badge" data-badge="5:bg-red"></li>
    
    <!-- Item with secondary text -->
    <li data-caption="Item with secondary" data-secondary="Details"></li>
    
    <!-- Checkbox item -->
    <li data-caption="Checkbox item" data-type="checkbox" data-name="check1" data-value="1"></li>
    
    <!-- Radio item -->
    <li data-caption="Radio item" data-type="radio" data-name="radio1" data-value="1"></li>
</ul>
```
