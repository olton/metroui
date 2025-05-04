# Package Manager Component

The Package Manager component provides a tabbed interface for displaying installation commands for different package managers (npm, pnpm, yarn, bun). It allows users to easily copy the correct installation command for their preferred package manager.

## Usage

### Basic Usage

```html
<div data-role="package-manager" data-package="metro4"></div>
```

### With Options

```html
<div data-role="package-manager" 
     data-package="metro4" 
     data-default="yarn" 
     data-deps="dev">
</div>
```

### JavaScript Creation

```javascript
// Create a package manager component programmatically
const packageManager = $("<div>").packageManager({
    package: "metro4",
    default: "npm",
    deps: "dev"
}).appendTo("#container");
```

## Plugin Parameters

The Package Manager component accepts the following configuration options:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `link` | string | `"package-manager"` | Name for the tabs link |
| `default` | string | `"npm"` | Default selected package manager (npm, pnpm, yarn, bun) |
| `deps` | string | `""` | Dependency type: empty for regular dependencies, "dev" for dev dependencies, "peer" for peer dependencies |
| `package` | string | `""` | Package name to install |

### Event Callbacks

| Callback | Description |
| -------- | ----------- |
| `onPackageManagerCreate` | Triggered when the component is created |

## API Methods

The Package Manager component provides the following methods:

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `destroy()` | - | Removes the component from the DOM |

## Installation Commands

The component automatically formats the correct installation command for each package manager based on the dependency type:

### Regular Dependencies

| Package Manager | Command Format |
| --------------- | -------------- |
| npm | `npm i <package>` |
| pnpm | `pnpm add <package>` |
| yarn | `yarn add <package>` |
| bun | `bun add <package>` |

### Development Dependencies

| Package Manager | Command Format |
| --------------- | -------------- |
| npm | `npm i -D <package>` |
| pnpm | `pnpm add -D <package>` |
| yarn | `yarn add -D <package>` |
| bun | `bun add -D <package>` |

### Peer Dependencies

| Package Manager | Command Format |
| --------------- | -------------- |
| npm | `npm i <package>` (npm doesn't have a specific flag for peer dependencies) |
| pnpm | `pnpm add --save-peer <package>` |
| yarn | `yarn add -P <package>` |
| bun | `bun add --peer <package>` |

## Styling

The Package Manager component uses the following CSS variables for styling:

| Variable | Description |
| -------- | ----------- |
| `--code-background` | Background color for code blocks and tabs |
| `--code-color` | Text color for code blocks and icons |

### Example of Custom Styling

```css
/* Custom styling for package manager */
.custom-package-manager {
    --code-background: #f5f5f5;
    --code-color: #333333;
}
```

## Available CSS Classes

- `.package-manager` - Base class for the component
- `.pm-command` - Container for each package manager command
- `.pm-command code` - Command text
- `.pm-command button` - Copy button

## Features

1. **Tabbed Interface**: Easily switch between different package managers
2. **Copy to Clipboard**: One-click copying of installation commands
3. **Dependency Type Support**: Configure for regular, development, or peer dependencies
4. **Visual Icons**: Each package manager has its own icon for easy identification
5. **Responsive Design**: Works well in different container sizes

## Best Practices

1. Place the component near package information for easy discovery
2. Set a default package manager that matches your project's recommended tooling
3. Specify the correct dependency type to ensure users install packages correctly
4. Consider adding additional context around the component to explain what the package does
5. For packages with complex installation requirements, consider providing additional instructions