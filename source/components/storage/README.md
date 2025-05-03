# Storage Component

The Storage Component provides a convenient wrapper for working with browser's localStorage and sessionStorage. It allows you to store, retrieve, and manage data with namespaced keys.

## Plugin Parameters

The Storage Component accepts the following parameter when initialized:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| type | Storage | localStorage | The storage type to use (localStorage or sessionStorage) |

## API Methods

### Metro.storage

A pre-configured instance that uses `localStorage`.

### Metro.session

A pre-configured instance that uses `sessionStorage`.

### setKey(key)

Sets the namespace key prefix for all storage operations.

```javascript
Metro.storage.setKey("myApp");
```

### getKey()

Returns the current namespace key prefix.

```javascript
const currentKey = Metro.storage.getKey();
```

### setItem(key, value)

Stores a value with the specified key. The value is automatically stringified using JSON.

```javascript
Metro.storage.setItem("settings", { theme: "dark", fontSize: 16 });
```

### getItem(key, default_value, reviver)

Retrieves a value by key. If the key doesn't exist, returns the default_value.

| Parameter | Type | Description |
|-----------|------|-------------|
| key | String | The key to retrieve |
| default_value | Any | Value to return if the key doesn't exist |
| reviver | Function | Optional function for transforming the parsed value |

```javascript
const settings = Metro.storage.getItem("settings", { theme: "light" });
```

### getItemPart(key, sub_key, default_value, reviver)

Retrieves a nested property from a stored object.

| Parameter | Type | Description |
|-----------|------|-------------|
| key | String | The key to retrieve |
| sub_key | String | Path to the nested property, using "->" as separator |
| default_value | Any | Value to return if the key doesn't exist |
| reviver | Function | Optional function for transforming the parsed value |

```javascript
// If settings contains { theme: { mode: "dark", color: "blue" } }
const themeMode = Metro.storage.getItemPart("settings", "theme->mode", "light");
```

### delItem(key)

Removes an item from storage.

```javascript
Metro.storage.delItem("settings");
```

### size(unit)

Returns the approximate size of the storage in the specified unit.

| Parameter | Type | Description |
|-----------|------|-------------|
| unit | String | Unit for the size: "b" (bytes), "k" (kilobytes), or "m" (megabytes) |

```javascript
const sizeInKB = Metro.storage.size("k");
```

## CSS Styling

This component is a JavaScript utility and does not have CSS variables for styling.

## Example Usage

```javascript
// Set namespace
Metro.storage.setKey("myApplication");

// Store data
Metro.storage.setItem("userPreferences", {
  theme: "dark",
  fontSize: 16,
  notifications: true
});

// Retrieve data
const preferences = Metro.storage.getItem("userPreferences", {});

// Get a specific property
const theme = Metro.storage.getItemPart("userPreferences", "theme", "light");

// Delete data
Metro.storage.delItem("userPreferences");

// Use session storage
Metro.session.setKey("myApplication");
Metro.session.setItem("temporaryData", { id: 123 });
```