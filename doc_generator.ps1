# Documentation Generator Script for Metro UI Components

# Get the list of components that need documentation
$components = Get-ChildItem -Path "source\components" -Directory
$needsReadme = @()

foreach ($component in $components) {
    $readmePath = Join-Path -Path $component.FullName -ChildPath "README.md"
    if (-not (Test-Path $readmePath)) {
        $needsReadme += $component.Name
    }
}

Write-Host "Components needing README.md ($($needsReadme.Count)):"
$needsReadme | ForEach-Object { Write-Host "- $_" }

# Function to generate a basic README template for a component
function Generate-ComponentReadme {
    param (
        [string]$componentName
    )
    
    $componentPath = "source\components\$componentName"
    $jsFiles = Get-ChildItem -Path $componentPath -Filter "*.js" | Where-Object { $_.Name -ne "index.js" }
    $lessFiles = Get-ChildItem -Path $componentPath -Filter "*.less"
    
    if ($jsFiles.Count -eq 0) {
        Write-Host "No JS files found for component: $componentName"
        return
    }
    
    $jsFile = $jsFiles[0]
    $jsContent = Get-Content -Path $jsFile.FullName -Raw
    
    # Extract component name for title (capitalize first letter)
    $displayName = $componentName -replace '-', ' '
    $displayName = (Get-Culture).TextInfo.ToTitleCase($displayName)
    
    # Create basic README structure
    $readme = @"
# $displayName Component

The $displayName component provides [brief description].

## Usage

### Basic $displayName

```html
<!-- Basic $displayName -->
<div data-role="$componentName"></div>
```

## Plugin Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `param1` | type | default | Description of parameter |
| `param2` | type | default | Description of parameter |

## API Methods

### Method Name

```javascript
// Example of method usage
$('#my-$componentName').data('$componentName').methodName();
```

## Events

| Event | Description |
| ----- | ----------- |
| `onEvent` | Description of event |

## Styling with CSS Variables

The $displayName component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--variable` | value | value | Description of variable |

### Example of Custom Styling

```css
/* Custom styling for a specific $componentName */
#my-custom-$componentName {
    --variable: value;
}
```

## Available CSS Classes

### Base Classes
- `.$componentName` - Standard $componentName

### Modifiers
- `.modifier` - Description of modifier
"@
    
    # Create the README.md file
    $readmePath = Join-Path -Path $componentPath -ChildPath "README.md"
    $readme | Out-File -FilePath $readmePath -Encoding utf8
    
    Write-Host "Generated basic README for: $componentName"
    Write-Host "Please review and complete the documentation at: $readmePath"
}

# Ask if user wants to generate documentation for a specific component
Write-Host "`nTo generate documentation for a specific component, enter the component name."
Write-Host "To generate documentation for all components, enter 'all'."
Write-Host "To exit without generating documentation, press Enter."

$input = Read-Host "Component name"

if ($input -eq "all") {
    foreach ($component in $needsReadme) {
        Generate-ComponentReadme -componentName $component
    }
} elseif ($input -ne "") {
    if ($needsReadme -contains $input) {
        Generate-ComponentReadme -componentName $input
    } else {
        Write-Host "Component '$input' either already has documentation or does not exist."
    }
}

Write-Host "`nDocumentation generation complete."
Write-Host "Remember to review and complete each generated README file with component-specific details."