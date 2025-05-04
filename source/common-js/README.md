# Common JS Utilities

The Common JS component provides a comprehensive set of JavaScript utility functions for Metro UI applications. These utilities help with common tasks such as type checking, DOM manipulation, object handling, and more.

## Usage

```javascript
// The utilities are available through the Metro.utils namespace
// Examples:

// Check if a value is a function
const isFunction = Metro.utils.isFunc(myValue);

// Get element coordinates
const coords = Metro.utils.coords(element);

// Format seconds to time object
const time = Metro.utils.secondsToTime(3600); // {d: 0, h: 1, m: 0, s: 0}
```

## API Methods

The Common JS component provides the following utility methods:

### Basic Utilities

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `nothing()` | None | None | Empty function that does nothing |
| `noop()` | None | None | Alias for nothing() |
| `elementId(prefix)` | prefix: string | string | Generates a unique element ID with the given prefix |
| `$()` | None | jQuery or Dom | Returns jQuery if available, otherwise Dom |

### Type Checking

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `isValue(val)` | val: any | boolean | Checks if a value is defined, not null, and not empty string |
| `isNull(val)` | val: any | boolean | Checks if a value is undefined or null |
| `isFunc(f)` | f: any | boolean | Checks if a value is a function |
| `isObject(o)` | o: any | boolean | Checks if a value is an object |
| `isObject2(o)` | o: any | boolean | Checks if a value is an object but not an array |
| `isTag(val)` | val: any | boolean | Checks if a value is an HTML tag |
| `isUrl(val)` | val: any | boolean | Checks if a value is a URL |
| `isVideoUrl(val)` | val: any | boolean | Checks if a value is a video URL (YouTube, Vimeo, etc.) |
| `isEmbedObject(val)` | val: any | boolean | Checks if a value is an embed object (iframe, object, embed, video) |
| `isDate(val, format, locale)` | val: any, format: string, locale: string | boolean | Checks if a value is a valid date |
| `isDateObject(v)` | v: any | boolean | Checks if a value is a JavaScript Date object |
| `isInt(n)` | n: any | boolean | Checks if a value is an integer |
| `isFloat(n)` | n: any | boolean | Checks if a value is a float |
| `isType(o, t)` | o: any, t: string | boolean | Checks if a value is of a specific type |
| `isNegative(val)` | val: number | boolean | Checks if a number is negative |
| `isPositive(val)` | val: number | boolean | Checks if a number is positive |
| `isZero(val)` | val: number | boolean | Checks if a number is zero |

### DOM Utilities

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `isVisible(element)` | element: HTMLElement | boolean | Checks if an element is visible |
| `isMetroObject(el, type)` | el: HTMLElement, type: string | boolean | Checks if an element has a Metro component of the specified type |
| `isJQuery(el)` | el: any | boolean | Checks if a value is a jQuery object |
| `isDom(el)` | el: any | boolean | Checks if a value is a Dom object |
| `isQ(el)` | el: any | boolean | Checks if a value is a jQuery or Dom object |
| `isOutsider(element)` | element: HTMLElement | boolean | Checks if an element is outside the viewport |
| `inViewport(el)` | el: HTMLElement | boolean | Checks if an element is in the viewport |
| `viewportOutByWidth(el)` | el: HTMLElement | boolean | Checks if an element is outside the viewport by width |
| `viewportOutByHeight(el)` | el: HTMLElement | boolean | Checks if an element is outside the viewport by height |
| `viewportOut(el)` | el: HTMLElement | boolean | Checks if an element is outside the viewport by width or height |
| `rect(el)` | el: HTMLElement | DOMRect | Gets the bounding client rect of an element |
| `coords(element)` | element: HTMLElement | object | Gets the coordinates of an element relative to the document |
| `hiddenElementSize(el, includeMargin)` | el: HTMLElement, includeMargin: boolean | object | Gets the size of a hidden element |
| `getStyle(element)` | element: HTMLElement | CSSStyleDeclaration | Gets the computed style of an element |
| `getStyleOne(el, property)` | el: HTMLElement, property: string | string | Gets a specific CSS property value of an element |
| `getInlineStyles(element)` | element: HTMLElement | object | Gets all inline styles of an element |
| `getCssVar(v)` | v: string | string | Gets the value of a CSS variable |
| `scrollTo(element, options)` | element: HTMLElement, options: object | None | Scrolls to an element smoothly |

### Position and Cursor Utilities

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `getCursorPosition(el, e)` | el: HTMLElement, e: Event | object | Gets the cursor position relative to an element |
| `getCursorPositionX(el, e)` | el: HTMLElement, e: Event | number | Gets the cursor X position relative to an element |
| `getCursorPositionY(el, e)` | el: HTMLElement, e: Event | number | Gets the cursor Y position relative to an element |
| `positionXY(e, t, s)` | e: Event, t: string, s: string | object | Gets the position of an event (client, screen, or page) |
| `clientXY(e, t)` | e: Event, t: string | object | Gets the client position of an event |
| `screenXY(e, t)` | e: Event, t: string | object | Gets the screen position of an event |
| `pageXY(e, t)` | e: Event, t: string | object | Gets the page position of an event |
| `isRightMouse(e)` | e: Event | boolean | Checks if the right mouse button was clicked |

### Time and Date Utilities

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `secondsToTime(s)` | s: number | object | Converts seconds to a time object with days, hours, minutes, and seconds |
| `secondsToFormattedString(time)` | time: number | string | Converts seconds to a formatted time string (HH:MM:SS) |

### Function Utilities

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `func(f)` | f: string | Function | Creates a new function from a string |
| `exec(f, args, context)` | f: Function, args: array, context: object | any | Executes a function with the given arguments and context |

### Object and Array Utilities

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `objectLength(obj)` | obj: object | number | Gets the number of properties in an object |
| `objectShift(obj)` | obj: object | object | Removes the property with the lowest key from an object |
| `objectDelete(obj, key)` | obj: object, key: string | None | Deletes a property from an object |
| `objectClone(obj)` | obj: object | object | Creates a shallow clone of an object |
| `arrayDelete(arr, val)` | arr: array, val: any | None | Removes a value from an array |
| `arrayDeleteByKey(arr, key)` | arr: array, key: number | None | Removes an item at a specific index from an array |
| `arrayDeleteByMultipleKeys(arr, keys)` | arr: array, keys: array | array | Removes items at multiple indexes from an array |
| `nvl(data, other)` | data: any, other: any | any | Returns the first argument if it's not null or undefined, otherwise returns the second argument |
| `valueInObject(obj, value)` | obj: object, value: any | boolean | Checks if a value exists in an object |
| `keyInObject(obj, key)` | obj: object, key: string | boolean | Checks if a key exists in an object |
| `inObject(obj, key, val)` | obj: object, key: string, val: any | boolean | Checks if an object has a property with a specific value |

### String and Number Utilities

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `embedUrl(val)` | val: string | string | Converts a URL to an embedded HTML iframe |
| `percent(total, part, round_value)` | total: number, part: number, round_value: boolean | number | Calculates the percentage of a part relative to a total |
| `between(val, bottom, top, equals)` | val: number, bottom: number, top: number, equals: boolean | boolean | Checks if a value is between two numbers |
| `parseMoney(val)` | val: string | number | Parses a money string to a number |
| `parseCard(val)` | val: string | string | Parses a card number string, removing non-numeric characters |
| `parsePhone(val)` | val: string | string | Parses a phone number string, removing non-numeric characters |
| `parseNumber(val, thousand, decimal)` | val: string, thousand: string, decimal: string | string | Parses a number string with custom thousand and decimal separators |
| `nearest(val, precision, down)` | val: number, precision: number, down: boolean | number | Rounds a number to the nearest multiple of precision |
| `bool(value)` | value: any | boolean | Converts various values to boolean |
| `decCount(v)` | v: number | number | Counts the number of decimal places in a number |
| `classNames(...args)` | args: any[] | string | Combines class names into a space-separated string |
| `join(...values)` | values: any[] | string | Joins values with a separator (last argument is the separator) |
| `copy2clipboard(v, cb)` | v: string, cb: Function | None | Copies a string to the clipboard and calls a callback |

### CSS and Media Utilities

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `newCssSheet(media)` | media: string | CSSStyleSheet | Creates a new CSS stylesheet with optional media query |
| `addCssRule(sheet, selector, rules, index)` | sheet: CSSStyleSheet, selector: string, rules: string, index: number | None | Adds a CSS rule to a stylesheet |
| `media(query)` | query: string | boolean | Checks if a media query matches |
| `mediaModes()` | None | array | Gets the current media modes |
| `mediaExist(media)` | media: string | boolean | Checks if a media mode exists |
| `inMedia(media)` | media: string | boolean | Checks if a specific media mode is active |
| `aspectRatioH(width, a)` | width: number, a: string | number | Calculates height based on width and aspect ratio |
| `aspectRatioW(height, a)` | height: number, a: string | number | Calculates width based on height and aspect ratio |

### URL and URI Utilities

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `encodeURI(str)` | str: string | string | Encodes a URI with special handling for brackets |
| `updateURIParameter(uri, key, value)` | uri: string, key: string, value: string | string | Updates or adds a parameter to a URI |
| `getURIParameter(url, name)` | url: string, name: string | string | Gets a parameter value from a URI |

### Miscellaneous Utilities

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| `github(repo, callback)` | repo: string, callback: Function | None | Fetches GitHub repository information and calls a callback |
| `pageHeight()` | None | number | Gets the height of the page |
| `cleanPreCode(selector)` | selector: string | None | Cleans whitespace in pre code elements |
| `getLocales()` | None | array | Gets available locales |
| `addLocale(locale)` | locale: object | None | Adds a new locale |

## Styling with CSS Variables

The Common JS component doesn't directly use CSS variables, as it's a JavaScript utility library. However, some of its methods interact with CSS variables:

- `getCssVar(v)` - Gets the value of a CSS variable
- Many DOM-related utilities work with elements that may be styled using CSS variables

## Best Practices

1. Use type checking utilities (`isFunc`, `isObject`, etc.) to validate inputs before processing them
2. Leverage DOM utilities for cross-browser compatible element manipulation
3. Use the time formatting utilities for consistent time display across your application
4. Prefer the built-in object and array utilities over custom implementations for better maintainability
5. Use `exec()` for safely executing functions that might not exist or could throw errors

## Browser Compatibility

The Common JS utilities are designed to work in all modern browsers. Some utilities provide cross-browser compatibility for operations that might otherwise require browser-specific code.