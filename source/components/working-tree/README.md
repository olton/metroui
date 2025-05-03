# Working Tree Component

The Working Tree component provides a visual representation of processes or tasks with status indicators. It displays a hierarchical structure with nodes that can have different states (pending, success, fail) and child items.

## Usage

```html
<!-- Basic usage -->
<ul data-role="working-tree" id="my-tree"></ul>

<!-- Controlling with JavaScript -->
<script>
    // Get component reference
    var workingTree = $("#my-tree").data("working-tree");
    
    // Add a node with children
    var nodeId = workingTree.addNode({
        title: "Installation process",
        value: "0%",
        items: [
            {title: "Download files", value: "Pending"},
            {title: "Extract archive", value: "Waiting"},
            {title: "Install components", value: "Waiting"}
        ]
    });
    
    // Change node state
    workingTree.setState(nodeId, "pending");
    
    // Later update to success
    setTimeout(function() {
        workingTree.setState(nodeId, "success");
    }, 3000);
</script>
```

## Component Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `onStateChange` | Function | `Metro.noop` | Triggered when node state changes |
| `onWorkingTreeCreate` | Function | `Metro.noop` | Triggered after working tree component creation |

## Events

| Event | Arguments | Description |
| --- | --- | --- |
| `state-change` | `{id, state, node}` | Triggered when a node changes state |
| `tree-create` | `{element}` | Triggered after component creation |

## API Methods

### addNode(options)

Adds a new node to the working tree.

```javascript
var nodeId = workingTree.addNode({
    id: "optional-id", // Optional - auto-generated if not provided
    title: "Process Title",
    value: "In Progress",
    items: [ // Optional child items
        {title: "Sub-step 1", value: "Pending"},
        {title: "Sub-step 2", value: "Waiting"}
    ]
});
```

Returns the ID of the newly created node.

### setState(id, state)

Updates the state of a node.

```javascript
workingTree.setState("node-id", "pending"); // Set to pending state
workingTree.setState("node-id", "success"); // Set to success state
workingTree.setState("node-id", "fail");    // Set to fail state
```

Valid states:
- `"pending"` - In progress (orange indicator)
- `"success"` - Completed successfully (green indicator)
- `"fail"` - Failed (red indicator)

## Global Configuration

You can globally configure the working tree component using the `Metro.workingTreeSetup` method:

```javascript
Metro.workingTreeSetup({
    onStateChange: function(data) {
        console.log("Node " + data.id + " changed to state: " + data.state);
    }
});
```

## CSS Variables

The working tree component uses the following CSS variables that you can customize:

| Variable | Default (Light Theme) | Default (Dark Theme) | Description |
| --- | --- | --- | --- |
| `--working-tree-marker-color` | `#e8e8e8` | `#3d444d` | Color for connection lines and default markers |
| `--working-tree-marker-success` | `#219707` | `#81e06c` | Color for success state markers |
| `--working-tree-marker-fail` | `#fb3838` | `#fb3838` | Color for failure state markers |
| `--working-tree-marker-pending` | `#ff9c17` | `#ff9c17` | Color for pending state markers |
| `--working-tree-color` | `#191919` | `#efefef` | Text color |

Example of customizing CSS variables:

```css
:root {
    --working-tree-marker-success: #00a300;
    --working-tree-marker-fail: #ce352c;
    --working-tree-marker-pending: #fa6800;
}
```

## Structure

The component creates the following HTML structure:

```html
<ul class="working-tree">
    <li id="working-tree-node-1" class="work-pending">
        <div class="bull">
            <span data-role="bull" data-type="pending"></span>
        </div>
        <div class="node">
            <div class="title">Node Title</div>
            <div class="value">Value Text</div>
        </div>
        <ul class="leaves">
            <li>
                <div class="title">Item Title</div>
                <div class="value">Item Value</div>
            </li>
            <!-- More items... -->
        </ul>
    </li>
    <!-- More nodes... -->
</ul>
```
