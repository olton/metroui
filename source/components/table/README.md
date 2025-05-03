# Table Component

The Table Component is a powerful and feature-rich data table for displaying, sorting, filtering, and manipulating tabular data. It supports pagination, searching, row selection, and many other features.

## Plugin Parameters

The Table Component accepts the following parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| caption | String | "" | Table caption text |
| cardMode | String | "" | Card mode for responsive tables |
| useCurrentSlice | Boolean | false | Use current data slice |
| showInspectorButton | Boolean | false | Show inspector button |
| inspectorButtonIcon | String | "🔧" | Icon for inspector button |
| tableDeferred | Number | 0 | Deferred initialization time in milliseconds |
| templateBeginToken | String | "<%" | Template begin token |
| templateEndToken | String | "%>" | Template end token |
| paginationDistance | Number | 5 | Pagination distance |
| paginationIslandSize | Number | 3 | Pagination island size |
| paginationShortTrack | Number | 10 | Pagination short track |
| horizontalScroll | Boolean | false | Enable horizontal scrolling |
| horizontalScrollStop | String | null | Horizontal scroll stop selector |
| check | Boolean | false | Enable row selection |
| checkType | String | "checkbox" | Type of check control (checkbox or radio) |
| checkColIndex | Number | 0 | Index of check column |
| checkName | String | null | Name for check inputs |
| checkStoreKey | String | "TABLE:$1:KEYS" | Storage key for checked rows |
| rownum | Boolean | false | Show row numbers |
| rownumTitle | String | "#" | Title for row number column |
| filters | Object | null | Column filters |
| filtersOperator | String | "and" | Operator for combining filters (and/or) |
| head | Array | null | Table header definition |
| body | Array | null | Table body data |
| source | String | null | Data source URL |
| static | Boolean | false | Static table mode |
| searchMinLength | Number | 1 | Minimum search query length |
| searchThreshold | Number | 500 | Search threshold in milliseconds |
| searchFields | Array | null | Fields to search in |
| showRowsSteps | Boolean | true | Show rows per page selector |
| showSearch | Boolean | true | Show search field |
| showTableInfo | Boolean | true | Show table information |
| showPagination | Boolean | true | Show pagination |
| paginationShortMode | Boolean | true | Use short pagination mode |
| showActivity | Boolean | true | Show activity indicator |
| muteTable | Boolean | true | Mute table during operations |
| showSkip | Boolean | false | Show skip to page control |
| rows | Number | 10 | Rows per page |
| rowsSteps | String | "10,25,50,100" | Available rows per page options |
| staticView | Boolean | false | Static view mode |
| viewSaveMode | String | "client" | View save mode (client/server) |
| viewSavePath | String | "TABLE:$1:OPTIONS" | Path for saving view options |
| sortDir | String | "asc" | Default sort direction |
| decimalSeparator | String | "." | Decimal separator for numbers |
| thousandSeparator | String | "," | Thousand separator for numbers |
| activityType | String | "atom" | Activity indicator type |
| activityStyle | String | "color" | Activity indicator style |
| activityTimeout | Number | 100 | Activity timeout in milliseconds |
| cellWrapper | Boolean | true | Wrap cell content |

## API Methods

The Table Component provides the following methods:

### reload()

Reloads the table data from the source.

```javascript
const table = Metro.getPlugin('#table', 'table');
table.reload();
```

### setData(data)

Sets new data for the table.

```javascript
const table = Metro.getPlugin('#table', 'table');
table.setData([
  { id: 1, name: "John", age: 30 },
  { id: 2, name: "Jane", age: 25 }
]);
```

### setHeadData(data)

Sets new header data for the table.

```javascript
const table = Metro.getPlugin('#table', 'table');
table.setHeadData([
  { name: "id", title: "ID" },
  { name: "name", title: "Name" },
  { name: "age", title: "Age" }
]);
```

### setSource(source)

Sets a new data source URL.

```javascript
const table = Metro.getPlugin('#table', 'table');
table.setSource('data/new-table-data.json');
```

### search(val)

Performs a search on the table data.

```javascript
const table = Metro.getPlugin('#table', 'table');
table.search("John");
```

### getSelectedItems()

Returns the selected items.

```javascript
const table = Metro.getPlugin('#table', 'table');
const selected = table.getSelectedItems();
```

### getFilteredItems()

Returns the filtered items.

```javascript
const table = Metro.getPlugin('#table', 'table');
const filtered = table.getFilteredItems();
```

### getAllItems()

Returns all items.

```javascript
const table = Metro.getPlugin('#table', 'table');
const allItems = table.getAllItems();
```

### getItem(index)

Returns the item at the specified index.

```javascript
const table = Metro.getPlugin('#table', 'table');
const item = table.getItem(0);
```

### addItem(item)

Adds a new item to the table.

```javascript
const table = Metro.getPlugin('#table', 'table');
table.addItem({ id: 3, name: "Bob", age: 40 });
```

### updateItem(index, item)

Updates an item at the specified index.

```javascript
const table = Metro.getPlugin('#table', 'table');
table.updateItem(0, { id: 1, name: "John Updated", age: 31 });
```

### deleteItem(index)

Deletes an item at the specified index.

```javascript
const table = Metro.getPlugin('#table', 'table');
table.deleteItem(0);
```

## CSS Styling

The Table Component can be styled using the following CSS variables:

```css
:root {
    --table-inspector-border-radius: 10px;
    --table-head-font-size: 14px;
    --table-caption-font-size: 16px;
    --table-footer-font-size: 14px;
    --table-body-font-size: 16px;
    --table-border-radius: 6px;

    --table-border-color: #e8e8e8;
    --table-color: #191919;
    --table-background: transparent;
    --table-header-background: #fafafa;
    --table-header-color: #191919;
    --table-sortable-background: #e8e8e8;
    --table-sortable-color: #000000;
    --table-selected-background: #d4e2ff;
    --table-selected-color: #000000;
    --table-striped-background: #f8f8f8;
    --table-hover-background: #eaeaea;
    --table-hover-color: #191919;
    --table-inspector-background: #ffffff;
    --table-inspector-border-color: #e8e8e8;
    --table-inspector-color: #191919;
}
```

### Dark Theme

The Table Component also supports a dark theme:

```css
.dark-side {
    --table-border-color: #4a4d51;
    --table-color: #dbdfe7;
    --table-background: transparent;
    --table-header-background: #1b1b1e;
    --table-header-color: #efefef;
    --table-sortable-background: #26282e;
    --table-sortable-color: #ffffff;
    --table-selected-background: #2e436e;
    --table-selected-color: #ffffff;
    --table-striped-background: #26282e;
    --table-hover-background: #323437;
    --table-hover-color: #ffffff;
    --table-inspector-background: #26282e;
    --table-inspector-border-color: #4a4d51;
    --table-inspector-color: #dbdfe7;
}
```

## Example Usage

### HTML

```html
<table id="table" data-role="table"
       data-source="data/table-data.json"
       data-rows="10"
       data-check="true"
       data-rownum="true">
</table>
```

### JavaScript

```javascript
// Initialize with JavaScript
Metro.makePlugin('#table', 'table', {
    source: 'data/table-data.json',
    rows: 10,
    check: true,
    rownum: true,
    onRowClick: function(row) {
        console.log('Row clicked:', row);
    }
});
```

## Data Format

The Table Component expects data in the following format:

```javascript
{
  "head": [
    {
      "name": "id",
      "title": "ID",
      "sortable": true
    },
    {
      "name": "name",
      "title": "Name",
      "sortable": true
    },
    {
      "name": "age",
      "title": "Age",
      "sortable": true
    }
  ],
  "body": [
    {
      "id": 1,
      "name": "John",
      "age": 30
    },
    {
      "id": 2,
      "name": "Jane",
      "age": 25
    }
  ]
}
```

## Column Options

Each column in the table can be configured with the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| title | String | undefined | Column title |
| format | String | undefined | Format for cell values |
| formatMask | String | undefined | Format mask for cell values |
| name | String | undefined | Column name |
| colspan | Number | null | Column span |
| size | String | undefined | Column size |
| sortable | Boolean | false | Enable sorting for this column |
| sortDir | String | undefined | Sort direction (asc/desc) |
| clsColumn | String | undefined | CSS class for the column |
| cls | String | undefined | CSS class for cells in this column |
| show | Boolean | true | Show/hide the column |
| required | Boolean | true | Column is required |
| field | String | undefined | Field name for form inputs |
| fieldType | String | undefined | Field type for form inputs |
| validator | Function | undefined | Validator function for form inputs |
| template | String | undefined | Template for cell rendering |
| type | String | "data" | Column type |