# Task Bar Component

The Task Bar component provides a Windows-like taskbar interface with tasks, system tray items, and widgets.

## Usage

```html
<div data-role="task-bar"></div>
```

## Plugin Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `onTaskClick` | `Metro.noop` | Callback function triggered when a task is clicked |
| `onMyObjectCreate` | `Metro.noop` | Callback function triggered when the component is created |

## Events

| Event | Description |
|-------|-------------|
| `onTaskClick` | Triggered when a task is clicked |
| `onMyObjectCreate` | Triggered when the component is created |

## API Methods

### addTask(task, active)
Adds a task to the task bar.

**Parameters:**
- `task` - Object containing task properties:
  - `title` - Task title
  - `description` - Task description
  - `icon` - HTML for the task icon
  - `ref` - Reference to the element in the DOM
- `active` (optional) - Boolean indicating if the task should be active (default: false)

```javascript
var taskBar = Metro.getPlugin('#my-task-bar', 'task-bar');
taskBar.addTask({
    title: "File Explorer",
    description: "Browse files and folders",
    icon: "<span class='mif-folder'></span>",
    ref: document.getElementById("file-explorer")
}, true);
```

### removeTask(task)
Removes a task from the task bar.

**Parameters:**
- `task` - Reference to the task element to remove

```javascript
var taskBar = Metro.getPlugin('#my-task-bar', 'task-bar');
taskBar.removeTask(document.getElementById("file-explorer"));
```

### activateTask(ref)
Activates a specific task.

**Parameters:**
- `ref` - Reference to the task element to activate

```javascript
var taskBar = Metro.getPlugin('#my-task-bar', 'task-bar');
taskBar.activateTask(document.getElementById("file-explorer"));
```

### addToSystemTray(item)
Adds an item to the system tray.

**Parameters:**
- `item` - HTML element to add to the system tray

```javascript
var taskBar = Metro.getPlugin('#my-task-bar', 'task-bar');
var clockElement = document.createElement("div");
clockElement.innerHTML = "<span class='mif-alarm'></span>";
taskBar.addToSystemTray(clockElement);
```

### addWidget(widget)
Adds a widget to the task bar.

**Parameters:**
- `widget` - HTML element to add as a widget

```javascript
var taskBar = Metro.getPlugin('#my-task-bar', 'task-bar');
var searchWidget = document.createElement("div");
searchWidget.innerHTML = "<span class='mif-search'></span>";
taskBar.addWidget(searchWidget);
```

## CSS Classes

- `.task-bar` - The main container class
- `.tasks` - Container for task items
- `.system-tray` - Container for system tray items
- `.widgets` - Container for widgets
- `.task` - Individual task item
- `.system-tray-item` - Individual system tray item
- `.widget` - Individual widget item
- `.active` - Applied to the active task

## Styling with CSS Variables

The Task Bar component can be customized using the following CSS variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--task-bar-background` | `#f5f5f5` | Controls the background color of the task bar |
| `--task-bar-color` | `#191919` | Controls the text color of the task bar |
| `--task-bar-task-background` | `transparent` | Controls the background color of tasks |
| `--task-bar-task-color` | `inherit` | Controls the text color of tasks |
| `--task-bar-task-background-hover` | `#e8e8e8` | Controls the background color of tasks on hover |
| `--task-bar-task-color-hover` | `#000000` | Controls the text color of tasks on hover |
| `--task-bar-task-background-active` | `#e8e8e8` | Controls the background color of active tasks |
| `--task-bar-task-color-active` | `#000000` | Controls the text color of active tasks |

### Example of Custom Styling

```css
.task-bar {
    --task-bar-background: #2b579a;
    --task-bar-color: #ffffff;
    --task-bar-task-background-hover: #3b67aa;
    --task-bar-task-color-hover: #ffffff;
    --task-bar-task-background-active: #3b67aa;
    --task-bar-task-color-active: #ffffff;
}
```

For dark mode, the component includes a `.dark-side` class with the following variable values:

```css
.dark-side {
    --task-bar-background: #2b2d30;
    --task-bar-color: #dbdfe7;
    --task-bar-task-background: transparent;
    --task-bar-task-color: inherit;
    --task-bar-task-background-hover: #37393e;
    --task-bar-task-color-hover: #ffffff;
    --task-bar-task-background-active: #37393e;
    --task-bar-task-color-active: #ffffff;
}
```