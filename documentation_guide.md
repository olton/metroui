# Metro UI Components Documentation Guide

## Overview

This guide provides instructions for creating documentation for Metro UI components. The documentation should be in markdown format and placed in a README.md file in each component's directory. The documentation should describe plugin parameters, API methods (excluding those starting with an underscore), and how to style the component using CSS variables.

## Progress Summary

- **Total components**: 154
- **Components with existing documentation**: 83
- **Components needing documentation**: 71

Documentation has been created for the following components as examples:
- `slider` - A comprehensive example of a component with various options and styling
- `switch` - A simpler component with toggle functionality
- `progress` - A component with multiple display types and animations

## Documentation Structure

Each component's README.md should follow this structure:

1. **Title and Description**
   ```markdown
   # Component Name
   
   Brief description of what the component does and its main features.
   ```

2. **Usage Examples**
   ```markdown
   ## Usage
   
   ### Basic Usage
   
   ```html
   <!-- Example HTML code -->
   <div data-role="component-name"></div>
   ```
   
   ### Additional Configurations
   
   ```html
   <!-- More examples showing different configurations -->
   ```
   ```

3. **Plugin Parameters**
   ```markdown
   ## Plugin Parameters
   
   | Parameter | Type | Default | Description |
   | --------- | ---- | ------- | ----------- |
   | `paramName` | type | default | Description of parameter |
   ```

4. **API Methods**
   ```markdown
   ## API Methods
   
   ### Method Name
   
   ```javascript
   // Example of method usage
   $('#element').data('component-name').methodName();
   ```
   ```

5. **Events**
   ```markdown
   ## Events
   
   | Event | Description |
   | ----- | ----------- |
   | `onEventName` | Description of event |
   ```

6. **CSS Variables**
   ```markdown
   ## Styling with CSS Variables
   
   | Variable | Default (Light) | Dark Mode | Description |
   | -------- | --------------- | --------- | ----------- |
   | `--variable-name` | value | value | Description of variable |
   
   ### Example of Custom Styling
   
   ```css
   /* Custom styling example */
   #my-element {
       --variable-name: custom-value;
   }
   ```
   ```

7. **CSS Classes**
   ```markdown
   ## Available CSS Classes
   
   ### Base Classes
   - `.class-name` - Description
   
   ### Modifiers
   - `.modifier-class` - Description
   ```

## How to Create Documentation

For each component that needs documentation:

1. **Examine the Component Files**:
   - Look at the JavaScript file (e.g., `component-name.js`) to understand:
     - Default configuration options (usually in a variable like `ComponentDefaultConfig`)
     - API methods (public methods that don't start with underscore)
     - Events (usually in the configuration with names like `onEvent`)
   
   - Look at the LESS file (e.g., `component-name.less`) to understand:
     - CSS variables (usually defined in `:root` and `.dark-side` selectors)
     - Available CSS classes and their purpose

2. **Create the README.md File**:
   - Use the structure outlined above
   - Include practical examples showing different configurations
   - Document all parameters, methods, events, and styling options
   - Provide clear descriptions for each item

3. **Test the Documentation**:
   - Ensure all examples are correct and work as expected
   - Verify that all parameters, methods, and CSS variables are accurately documented

## Tools

Two scripts have been created to help with the documentation process:

1. **check_readme.ps1**: Lists components that already have documentation and those that need it
   ```powershell
   .\check_readme.ps1
   ```

2. **doc_generator.ps1**: Generates a basic README.md template for a component
   ```powershell
   .\doc_generator.ps1
   ```
   Follow the prompts to generate documentation for a specific component or all components.

## Best Practices

1. **Be Comprehensive**: Document all aspects of the component
2. **Be Clear**: Use simple language and provide examples
3. **Be Consistent**: Follow the same structure for all components
4. **Be Accurate**: Ensure all information is correct and up-to-date
5. **Be Helpful**: Include practical examples and use cases

## Example Components

Refer to the following components as examples:
- `source\components\slider\README.md`
- `source\components\switch\README.md`
- `source\components\progress\README.md`

These examples demonstrate how to document different types of components with varying complexity.