# ListView Component

The ListView component provides a flexible way to display hierarchical data in various view modes, including list, table, content, tiles, and icons views. It supports features like selection, grouping, and node manipulation.

## Usage

```html
<ul data-role="listview">
    <li data-caption="Documents">
        <ul>
            <li data-caption="Report.docx" data-icon="..."></li>
            <li data-caption="Presentation.pptx" data-icon="..."></li>
        </ul>
    </li>
    <li data-caption="Images">
        <ul>
            <li data-caption="Photo1.jpg" data-icon="..."></li>
            <li data-caption="Photo2.jpg" data-icon="..."></li>
        </ul>
    </li>
</ul>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| listviewDeferred | number | 0 | Deferred initialization time in milliseconds |
| selectable | boolean | false | If true, enables item selection with checkboxes |
| duration | number | 100 | Animation duration for expanding/collapsing nodes in milliseconds |
| view | string | Metro.listView.LIST | View mode (LIST, TABLE, CONTENT, TILES, ICONS, ICONS_MEDIUM, ICONS_LARGE) |
| selectCurrent | boolean | true | If true, selects the current node when clicked |
| defaultIcon | string | file_icon | Default icon for nodes |
| onNodeInsert | function | Metro.noop | Triggered when a node is inserted |
| onNodeDelete | function | Metro.noop | Triggered when a node is deleted |
| onNodeClean | function | Metro.noop | Triggered when a node is cleaned |
| onCollapseNode | function | Metro.noop | Triggered when a node is collapsed |
| onExpandNode | function | Metro.noop | Triggered when a node is expanded |
| onGroupNodeClick | function | Metro.noop | Triggered when a group node is clicked |
| onNodeClick | function | Metro.noop | Triggered when a node is clicked |
| onNodeDblclick | function | Metro.noop | Triggered when a node is double-clicked |
| onListViewCreate | function | Metro.noop | Triggered when the listview is created |

## Methods

### view(v)
Gets or sets the view mode.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
// Get current view
var currentView = listview.view();
// Set view to icons
listview.view(Metro.listView.ICONS);
```

### toggleNode(node)
Toggles a node's expanded state.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
listview.toggleNode(document.querySelector('.node-group'));
```

### toggleSelectable()
Toggles selectable mode.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
listview.toggleSelectable();
```

### add(data, node)
Adds a new node. If node is provided, adds as a child of that node.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
listview.add({
    caption: "New Item",
    icon: "<svg>...</svg>",
    desc: "Description",
    date: "2023-05-15"
});
```

### addGroup(data)
Adds a new group node.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
listview.addGroup({
    caption: "New Group"
});
```

### insertBefore(data, node)
Inserts a node before another node.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
var targetNode = document.querySelector('#target-node');
listview.insertBefore({
    caption: "New Item"
}, targetNode);
```

### insertAfter(data, node)
Inserts a node after another node.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
var targetNode = document.querySelector('#target-node');
listview.insertAfter({
    caption: "New Item"
}, targetNode);
```

### del(node)
Deletes a node.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
var nodeToDelete = document.querySelector('#node-to-delete');
listview.del(nodeToDelete);
```

### clean(node)
Cleans a node (removes children).

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
var nodeToClean = document.querySelector('#node-to-clean');
listview.clean(nodeToClean);
```

### getSelected()
Gets selected nodes.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
var selectedNodes = listview.getSelected();
```

### clearSelected()
Clears all selections.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
listview.clearSelected();
```

### selectAll(mode)
Selects or deselects all nodes.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
// Select all
listview.selectAll(true);
// Deselect all
listview.selectAll(false);
```

### selectByAttribute(attributeName, attributeValue, select)
Selects nodes by attribute.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
listview.selectByAttribute('data-type', 'document', true);
```

### destroy()
Destroys the component.

```javascript
var listview = Metro.getPlugin('#my-listview', 'listview');
listview.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onNodeInsert | Triggered when a node is inserted |
| onNodeDelete | Triggered when a node is deleted |
| onNodeClean | Triggered when a node is cleaned |
| onCollapseNode | Triggered when a node is collapsed |
| onExpandNode | Triggered when a node is expanded |
| onGroupNodeClick | Triggered when a group node is clicked |
| onNodeClick | Triggered when a node is clicked |
| onNodeDblclick | Triggered when a node is double-clicked |
| onListViewCreate | Triggered when the listview is created |

## CSS Variables

The ListView component can be styled using the following CSS variables:

| Variable | Default (Light) | Default (Dark) | Description |
| --- | --- | --- | --- |
| --listview-item-border-radius | 4px | 4px | Border radius of list items |
| --listview-item-width | 220px | 220px | Width of list items |
| --listview-background | #ffffff | #1e1f22 | Background color of the listview |
| --listview-color | #191919 | #dbdfe7 | Text color of the listview |
| --listview-color-secondary | #919191 | #bcbcbc | Secondary text color |
| --listview-item-background-hover | #d4e2ff | #2d2d32 | Background color on hover |
| --listview-item-background-active | #d4e2ff | #28282c | Background color when active |
| --listview-badge-background | transparent | transparent | Background color for badges |
| --listview-badge-color | #191919 | #dbdfe7 | Text color for badges |

## View Modes

The ListView component supports several view modes:

### List View
```html
<ul data-role="listview" data-view="list">
    <!-- items -->
</ul>
```

### Table View
```html
<ul data-role="listview" data-view="table">
    <!-- items -->
</ul>
```

### Content View
```html
<ul data-role="listview" data-view="content">
    <!-- items -->
</ul>
```

### Tiles View
```html
<ul data-role="listview" data-view="tiles">
    <!-- items -->
</ul>
```

### Icons View
```html
<ul data-role="listview" data-view="icons">
    <!-- items -->
</ul>
```

### Medium Icons View
```html
<ul data-role="listview" data-view="icons-medium">
    <!-- items -->
</ul>
```

### Large Icons View
```html
<ul data-role="listview" data-view="icons-large">
    <!-- items -->
</ul>
```

## Examples

### Basic ListView
```html
<ul data-role="listview">
    <li data-caption="Documents">
        <ul>
            <li data-caption="Report.docx"></li>
            <li data-caption="Presentation.pptx"></li>
        </ul>
    </li>
    <li data-caption="Images">
        <ul>
            <li data-caption="Photo1.jpg"></li>
            <li data-caption="Photo2.jpg"></li>
        </ul>
    </li>
</ul>
```

### Selectable ListView
```html
<ul data-role="listview" data-selectable="true">
    <li data-caption="Documents">
        <ul>
            <li data-caption="Report.docx"></li>
            <li data-caption="Presentation.pptx"></li>
        </ul>
    </li>
</ul>
```

### ListView with Custom Icons
```html
<ul data-role="listview">
    <li data-caption="Documents" data-icon="<svg>...</svg>">
        <ul>
            <li data-caption="Report.docx" data-icon="<svg>...</svg>"></li>
            <li data-caption="Presentation.pptx" data-icon="<svg>...</svg>"></li>
        </ul>
    </li>
</ul>
```

### ListView with Description and Date
```html
<ul data-role="listview" data-view="table">
    <li data-caption="Documents">
        <ul>
            <li data-caption="Report.docx" data-desc="Word document" data-date="2023-05-15"></li>
            <li data-caption="Presentation.pptx" data-desc="PowerPoint presentation" data-date="2023-05-16"></li>
        </ul>
    </li>
</ul>
```

## Available CSS Classes

### Base Classes
- `.listview` - Base class for the component
- `.node` - Regular node
- `.node-group` - Group node

### Node Elements
- `.icon` - Icon container
- `.caption` - Caption text
- `.desc` - Description text
- `.date` - Date text
- `.content` - Content container

### State Classes
- `.current-select` - Selected node
- `.expanded` - Expanded group node
- `.node-toggle` - Toggle button for group nodes

### View Classes
- `.view-list` - List view
- `.view-table` - Table view
- `.view-content` - Content view
- `.view-tiles` - Tiles view
- `.view-icons` - Icons view
- `.view-icons-medium` - Medium icons view
- `.view-icons-large` - Large icons view