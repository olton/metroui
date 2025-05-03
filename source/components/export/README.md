# Export Component

The Export component provides utilities for exporting data from tables and arrays to CSV format and downloading the results.

## Usage

```javascript
// Initialize with default options
const exporter = Metro.export;

// Export a table to CSV and download
exporter.tableToCSV('#myTable', 'exported-table.csv');

// Export an array to CSV and download
exporter.arrayToCsv(myArray, 'exported-array.csv');
```

## Options

The Export component accepts the following configuration options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| csvDelimiter | String | `"\t"` | The delimiter character used to separate values in the CSV output |
| csvNewLine | String | `"\r\n"` | The character(s) used for line breaks in the CSV output |
| includeHeader | Boolean | `true` | Whether to include the table header in the CSV output when exporting tables |

## API Methods

### setup(options)

Sets up the component with custom options.

```javascript
Metro.export.setup({
    csvDelimiter: ',',
    csvNewLine: '\n',
    includeHeader: false
});
```

### tableToCSV(table, filename, options)

Converts an HTML table to CSV format and optionally downloads it.

**Parameters:**
- `table` - The table element or selector
- `filename` - (Optional) If provided, the CSV will be downloaded with this filename
- `options` - (Optional) Configuration options for this specific export

**Returns:**
- If `filename` is provided: `true` after download is initiated
- If `filename` is not provided: The CSV data as a string

```javascript
// Export and download
Metro.export.tableToCSV('#dataTable', 'exported-data.csv');

// Just get the CSV data without downloading
const csvData = Metro.export.tableToCSV('#dataTable');
```

### arrayToCsv(array, filename, options)

Converts a JavaScript array to CSV format and optionally downloads it.

**Parameters:**
- `array` - The array to convert to CSV
- `filename` - (Optional) If provided, the CSV will be downloaded with this filename
- `options` - (Optional) Configuration options for this specific export

**Returns:**
- If `filename` is provided: `true` after download is initiated
- If `filename` is not provided: The CSV data as a string

```javascript
const myArray = [
    ['Name', 'Age', 'City'],
    ['John', 30, 'New York'],
    ['Jane', 25, 'Boston']
];

// Export and download
Metro.export.arrayToCsv(myArray, 'people-data.csv');

// Just get the CSV data without downloading
const csvData = Metro.export.arrayToCsv(myArray);
```

### base64(data)

Converts data to base64 encoding.

**Parameters:**
- `data` - The data to convert to base64

**Returns:**
- The base64 encoded string

```javascript
const encodedData = Metro.export.base64('Hello, world!');
```

### b64toBlob(b64Data, contentType, sliceSize)

Converts base64 data to a Blob object.

**Parameters:**
- `b64Data` - The base64 data to convert
- `contentType` - (Optional) The content type of the data (default: "")
- `sliceSize` - (Optional) The size of each slice when processing the data (default: 512)

**Returns:**
- A Blob object containing the data

```javascript
const blob = Metro.export.b64toBlob(base64Data, 'text/csv');
```

### createDownload(data, contentType, filename)

Creates a download for the provided data.

**Parameters:**
- `data` - The base64 encoded data to download
- `contentType` - The content type of the data
- `filename` - (Optional) The filename for the download

**Returns:**
- `true` after download is initiated

```javascript
Metro.export.createDownload(base64Data, 'application/csv', 'export.csv');
```

## Styling

The Export component is a utility component that doesn't have a visual representation, so there are no CSS variables available for styling.

## Examples

### Exporting a Table with Custom Options

```javascript
// Set up custom options
Metro.export.setup({
    csvDelimiter: ',',
    csvNewLine: '\n'
});

// Export the table
Metro.export.tableToCSV('#dataTable', 'exported-data.csv');
```

### Exporting an Array with One-time Custom Options

```javascript
const data = [
    ['Name', 'Email', 'Phone'],
    ['John Doe', 'john@example.com', '555-1234'],
    ['Jane Smith', 'jane@example.com', '555-5678']
];

Metro.export.arrayToCsv(data, 'contacts.csv', {
    csvDelimiter: ',',
    csvNewLine: '\n'
});
```