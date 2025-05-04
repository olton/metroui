# List Component

The List component provides a powerful way to display and manage lists of data with features like sorting, filtering, pagination, and search. It can work with both HTML content and JSON data sources.

## Usage

```html
<ul data-role="list">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| listDeferred | number | 0 | Deferred initialization time in milliseconds |
| templateBeginToken | string | "<%" | Beginning token for templates |
| templateEndToken | string | "%>" | Ending token for templates |
| paginationDistance | number | 5 | Number of pagination buttons to show |
| paginationShortMode | boolean | true | If true, uses short pagination mode |
| thousandSeparator | string | "," | Separator for thousands in numbers |
| decimalSeparator | string | "," | Separator for decimals in numbers |
| itemTag | string | "li" | HTML tag for list items |
| defaultTemplateTag | string | "div" | Default tag for template items |
| sortClass | string | null | CSS class to use for sorting |
| sortDir | string | "asc" | Sort direction ("asc" or "desc") |
| sortInitial | boolean | true | If true, sorts the list on initialization |
| filterClass | string | null | CSS class to use for filtering |
| filter | string/function | null | Filter function or string |
| filterString | string | "" | Initial filter string |
| filters | string | null | Additional filters |
| source | string | null | URL for JSON data source |
| showItemsSteps | boolean | false | If true, shows items per page selector |
| showSearch | boolean | false | If true, shows search field |
| showListInfo | boolean | false | If true, shows list information |
| showPagination | boolean | false | If true, shows pagination |
| showActivity | boolean | true | If true, shows activity indicator during loading |
| muteList | boolean | true | If true, mutes the list during operations |
| items | number | -1 | Number of items per page (-1 for all) |
| itemsSteps | string | "all, 10,25,50,100" | Options for items per page selector |
| itemsAllTitle | string | "Show all" | Title for "show all" option |
| listItemsCountTitle | string | "Show entries:" | Title for items count selector |
| listSearchTitle | string | "Search:" | Title for search field |
| listInfoTitle | string | "Showing $1 to $2 of $3 entries" | Template for list info |
| paginationPrevTitle | string | "Prev" | Title for previous page button |
| paginationNextTitle | string | "Next" | Title for next page button |
| activityType | string | "cycle" | Type of activity indicator |
| activityStyle | string | "color" | Style of activity indicator |
| activityTimeout | number | 100 | Timeout for activity indicator |
| searchWrapper | string | null | Selector for custom search wrapper |
| rowsWrapper | string | null | Selector for custom rows wrapper |
| infoWrapper | string | null | Selector for custom info wrapper |
| paginationWrapper | string | null | Selector for custom pagination wrapper |
| searchThreshold | number | 500 | Threshold for search debounce in milliseconds |
| clsComponent | string | "" | Additional CSS class for component |
| clsList | string | "" | Additional CSS class for list |
| clsListItem | string | "" | Additional CSS class for list items |
| clsListTop | string | "" | Additional CSS class for top block |
| clsItemsCount | string | "" | Additional CSS class for items count block |
| clsSearch | string | "" | Additional CSS class for search block |
| clsListBottom | string | "" | Additional CSS class for bottom block |
| clsListInfo | string | "" | Additional CSS class for info block |
| clsListPagination | string | "" | Additional CSS class for pagination block |
| clsPagination | string | "" | Additional CSS class for pagination |
| clsTemplateTag | string | "" | Additional CSS class for template tags |

## Methods

### deleteItem(value)
Deletes items matching the value or function.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
// Delete by value
list.deleteItem("Item 1");
// Delete by function
list.deleteItem(function(item){
    return item.textContent.includes("Item");
});
```

### draw()
Redraws the list.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.draw();
```

### sorting(source, dir, redraw)
Sorts the list.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
// Sort by class "sort-name" in ascending order and redraw
list.sorting("sort-name", "asc", true);
```

### filter(val)
Filters the list.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.filter("search term");
```

### setData(data)
Sets the data for the list.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.setData({
    "data": [
        {"name": "Item 1", "value": 1},
        {"name": "Item 2", "value": 2}
    ],
    "template": "<div><%name%>: <%value%></div>"
});
```

### loadData(source)
Loads data from a URL.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.loadData("data.json");
```

### next()
Goes to the next page.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.next();
```

### prev()
Goes to the previous page.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.prev();
```

### first()
Goes to the first page.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.first();
```

### last()
Goes to the last page.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.last();
```

### page(num)
Goes to a specific page.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.page(3); // Go to page 3
```

### addFilter(f, redraw)
Adds a filter function.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.addFilter(function(item){
    return item.textContent.includes("Important");
}, true);
```

### removeFilter(key, redraw)
Removes a filter by key.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.removeFilter(0, true);
```

### removeFilters(redraw)
Removes all filters.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.removeFilters(true);
```

### getFilters()
Gets all filters.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
var filters = list.getFilters();
```

### destroy()
Destroys the component.

```javascript
var list = Metro.getPlugin('#my-list', 'list');
list.destroy();
```

## Events

| Event | Description |
| --- | --- |
| onDraw | Triggered when the list is drawn |
| onDrawItem | Triggered when an item is drawn |
| onSortStart | Triggered when sorting starts |
| onSortStop | Triggered when sorting stops |
| onSortItemSwitch | Triggered when items are switched during sorting |
| onSearch | Triggered when search is performed |
| onRowsCountChange | Triggered when the number of rows changes |
| onDataLoad | Triggered when data loading starts |
| onDataLoaded | Triggered when data is loaded |
| onDataLoadError | Triggered when data loading fails |
| onFilterItemAccepted | Triggered when an item passes the filter |
| onFilterItemDeclined | Triggered when an item is filtered out |
| onListCreate | Triggered when the list is created |

## Examples

### Basic List
```html
<ul data-role="list">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

### List with Pagination and Search
```html
<ul data-role="list" data-show-pagination="true" data-show-search="true" data-items="10">
    <li>Item 1</li>
    <li>Item 2</li>
    <!-- More items -->
</ul>
```

### List with JSON Data Source
```html
<ul data-role="list" data-source="data.json" data-show-activity="true"></ul>
```

### List with Custom Template
```html
<script>
    var listData = {
        "template": "<div class='item'><%name%>: <%value%></div>",
        "data": [
            {"name": "Item 1", "value": 100},
            {"name": "Item 2", "value": 200},
            {"name": "Item 3", "value": 300}
        ]
    };
</script>

<ul data-role="list" id="my-list"></ul>

<script>
    $(function(){
        var list = Metro.getPlugin('#my-list', 'list');
        list.setData(listData);
    });
</script>
```

### List with Sorting
```html
<ul data-role="list" data-sort-class="sort-name" data-sort-dir="asc">
    <li><span class="sort-name">Charlie</span></li>
    <li><span class="sort-name">Alpha</span></li>
    <li><span class="sort-name">Bravo</span></li>
</ul>
```

## Best Practices

1. Use the `data-sort-class` attribute to specify which elements should be used for sorting
2. For large datasets, enable pagination with `data-show-pagination="true"`
3. When loading data from a remote source, show the activity indicator with `data-show-activity="true"`
4. Use templates for consistent rendering of complex list items
5. Consider using custom filters for advanced filtering requirements