# Pagination Component

The Pagination component provides a flexible and customizable way to create pagination controls for navigating through multi-page content. It automatically generates page numbers, previous/next buttons, and handles active states.

## Usage

### Basic Usage

```javascript
// Create pagination with 100 total items, 10 items per page, current page 1
const pagination = Metro.pagination({
    length: 100,
    rows: 10,
    current: 1,
    target: "#pagination-container"
});
```

### HTML Structure

```html
<!-- Container for pagination -->
<div id="pagination-container"></div>

<!-- JavaScript to create pagination -->
<script>
    Metro.pagination({
        length: 100,
        rows: 10,
        current: 1,
        target: "#pagination-container"
    });
</script>
```

### With Custom Styling

```javascript
// Create pagination with custom styling
Metro.pagination({
    length: 100,
    rows: 10,
    current: 1,
    target: "#pagination-container",
    clsPagination: "rounded primary"
});
```

## Configuration Options

The Pagination component accepts the following configuration options:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `length` | number | `0` | Total number of items/rows |
| `rows` | number | `0` | Number of items per page (page size) |
| `current` | number | `0` | Current page number |
| `target` | string | `"body"` | Selector for the container element |
| `clsPagination` | string | `""` | Additional CSS classes for the pagination |
| `prevTitle` | string | `""` | Custom text for the previous button (defaults to localized "Previous") |
| `nextTitle` | string | `""` | Custom text for the next button (defaults to localized "Next") |
| `distance` | number | `5` | Number of pages to show before/after current page |
| `islandSize` | number | `3` | Number of pages to show around current page when in middle |
| `shortTrack` | number | `10` | Threshold for showing all pages without ellipsis |

## Styling with CSS Variables

The Pagination component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| `--pagination-page-item-background` | var(--default-background) | var(--default-background) | Background color of pagination items |
| `--pagination-page-item-color` | var(--default-color) | var(--default-color) | Text color of pagination items |
| `--pagination-page-item-background-hover` | #e4e4e4 | rgba(106, 106, 106, 0.44) | Background color on hover |
| `--pagination-page-item-color-hover` | var(--default-color) | var(--default-color) | Text color on hover |
| `--pagination-page-item-background-disabled` | var(--default-background-disabled) | var(--default-background-disabled) | Background color of disabled items |
| `--pagination-page-item-color-disabled` | var(--default-color-disabled) | var(--default-color-disabled) | Text color of disabled items |
| `--pagination-page-item-background-active` | rgba(217, 217, 217, 0.44) | rgba(106, 106, 106, 0.44) | Background color of active item |
| `--pagination-page-item-color-active` | var(--default-color) | var(--default-color) | Text color of active item |
| `--pagination-page-item-border-color` | var(--border-color) | var(--border-color) | Border color of pagination items |
| `--pagination-page-item-border-radius` | 4px | 6px | Border radius of pagination items |

### Example of Custom Styling

```css
/* Custom styling for pagination */
.custom-pagination {
    --pagination-page-item-background: #f0f8ff;
    --pagination-page-item-color: #0d47a1;
    --pagination-page-item-background-hover: #bbdefb;
    --pagination-page-item-border-color: #2196f3;
    --pagination-page-item-background-active: #2196f3;
    --pagination-page-item-color-active: #ffffff;
    --pagination-page-item-border-radius: 8px;
}
```

## Available CSS Classes

### Base Classes
- `.pagination` - Main container for pagination
- `.page-item` - Individual pagination item
- `.page-link` - Link inside pagination item
- `.page-item.active` - Active page
- `.page-item.disabled` - Disabled page
- `.page-item.no-link` - Item without link (ellipsis)
- `.page-item.service` - Service items (prev/next)

### Modifier Classes
- `.pagination.rounded` - Rounded pagination items
- `.pagination.no-gap` - Pagination without gaps between items
- `.pagination.size-large` - Large pagination
- `.pagination.size-small` - Small pagination

### Color Variants
The pagination component supports all Metro UI color variants:
- `.pagination.primary` - Primary color variant
- `.pagination.secondary` - Secondary color variant
- `.pagination.success` - Success color variant
- `.pagination.alert` - Alert color variant
- `.pagination.warning` - Warning color variant
- `.pagination.yellow` - Yellow color variant
- `.pagination.info` - Info color variant
- `.pagination.light` - Light color variant
- `.pagination.dark` - Dark color variant

## Pagination Structure

The pagination component generates the following structure:

```html
<ul class="pagination [additional-classes]">
    <!-- Previous button -->
    <li class="page-item service prev-page [disabled]">
        <a class="page-link" data-page="prev">Previous</a>
    </li>
    
    <!-- First page -->
    <li class="page-item [active]">
        <a class="page-link" data-page="1">1</a>
    </li>
    
    <!-- Ellipsis if needed -->
    <li class="page-item no-link">
        <a class="page-link">...</a>
    </li>
    
    <!-- Page numbers -->
    <li class="page-item [active]">
        <a class="page-link" data-page="n">n</a>
    </li>
    
    <!-- Last page -->
    <li class="page-item [active]">
        <a class="page-link" data-page="last">last</a>
    </li>
    
    <!-- Next button -->
    <li class="page-item service next-page [disabled]">
        <a class="page-link" data-page="next">Next</a>
    </li>
</ul>
```

## Event Handling

To handle pagination clicks, you can attach a click event handler to the pagination items:

```javascript
// Create pagination
const pagination = Metro.pagination({
    length: 100,
    rows: 10,
    current: 1,
    target: "#pagination-container"
});

// Handle pagination clicks
$("#pagination-container").on("click", ".page-item", function() {
    const page = $(this).find(".page-link").data("page");
    
    if (page === "prev") {
        // Handle previous page
        loadPage(currentPage - 1);
    } else if (page === "next") {
        // Handle next page
        loadPage(currentPage + 1);
    } else if (page !== null) {
        // Handle specific page
        loadPage(page);
    }
});
```

## Best Practices

1. Use appropriate page sizes to balance content density and number of pages
2. Consider using the `distance` and `islandSize` parameters to control pagination complexity for large datasets
3. Add clear visual indication of the current page
4. Ensure pagination controls are large enough for touch interaction on mobile devices
5. Consider using the `.size-large` modifier on touch devices for better usability
6. Use color variants that match your application's color scheme
7. Provide appropriate ARIA attributes for accessibility when implementing click handlers