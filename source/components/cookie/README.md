# Cookie Component

The Cookie component provides a simple and efficient way to manage browser cookies. It offers methods for setting, getting, and deleting cookies with various configuration options.

## Usage

### Basic Usage

```javascript
// Set a cookie
Metro.cookie.setCookie("user-preference", "dark-mode");

// Get a cookie
const preference = Metro.cookie.getCookie("user-preference");
console.log(preference); // "dark-mode"

// Delete a cookie
Metro.cookie.delCookie("user-preference");
```

### Get All Cookies

```javascript
// Get all cookies as an object
const allCookies = Metro.cookie.getCookies();
console.log(allCookies);
```

### Set Cookie with Options

```javascript
// Set a cookie with expiration date (in milliseconds)
Metro.cookie.setCookie("session-token", "abc123", 3600000); // Expires in 1 hour

// Set a cookie with detailed options
Metro.cookie.setCookie("user-id", "12345", {
    path: "/dashboard",
    domain: "example.com",
    secure: true,
    maxAge: 86400, // 24 hours in seconds
    samesite: "Strict"
});
```

### Configure Default Cookie Settings

```javascript
// Configure default settings for all cookies
Metro.cookieSetup({
    path: "/app",
    secure: true,
    samesite: "Lax"
});

// After this, all cookies will use these defaults unless overridden
```

## API Reference

### Metro.cookieSetup(options)

Configures default settings for all cookies.

**Parameters:**
- `options` (Object): Configuration options
  - `path` (String): The path where the cookie is valid (default: "/")
  - `expires` (String): Expiration date in UTC string format (default: null)
  - `maxAge` (Number): Maximum age of the cookie in seconds (default: null)
  - `domain` (String): Domain where the cookie is valid (default: null)
  - `secure` (Boolean): If true, cookie is only sent over HTTPS (default: false)
  - `samesite` (String): CSRF protection setting ("Strict", "Lax", or "None") (default: null)

### Metro.cookie.getCookies()

Returns all cookies as an object with cookie names as keys and their values as values.

**Returns:**
- (Object): All cookies

### Metro.cookie.getCookie(name)

Gets the value of a specific cookie.

**Parameters:**
- `name` (String): The name of the cookie to retrieve

**Returns:**
- (String|null): The cookie value, or null if the cookie doesn't exist

### Metro.cookie.setCookie(name, value, options)

Sets a cookie with the specified name, value, and options.

**Parameters:**
- `name` (String): The name of the cookie
- `value` (String): The value to store in the cookie
- `options` (Object|Number): 
  - If a number, it's treated as expiration time in milliseconds
  - If an object, it can contain the following properties:
    - `path` (String): The path where the cookie is valid
    - `expires` (String): Expiration date in UTC string format
    - `maxAge` (Number): Maximum age of the cookie in seconds
    - `domain` (String): Domain where the cookie is valid
    - `secure` (Boolean): If true, cookie is only sent over HTTPS
    - `samesite` (String): CSRF protection setting ("Strict", "Lax", or "None")

### Metro.cookie.delCookie(name)

Deletes a cookie with the specified name.

**Parameters:**
- `name` (String): The name of the cookie to delete

## Examples

### User Authentication

```javascript
// Store authentication token
function login(token) {
    // Set cookie to expire in 7 days
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    Metro.cookie.setCookie("auth-token", token, {
        maxAge: sevenDays / 1000, // Convert to seconds
        secure: true,
        samesite: "Strict"
    });
}

// Check if user is logged in
function isLoggedIn() {
    return Metro.cookie.getCookie("auth-token") !== null;
}

// Logout user
function logout() {
    Metro.cookie.delCookie("auth-token");
}
```

### User Preferences

```javascript
// Save user theme preference
function setTheme(theme) {
    // Store for 1 year
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    Metro.cookie.setCookie("user-theme", theme, oneYear);
}

// Get user theme preference
function getTheme() {
    return Metro.cookie.getCookie("user-theme") || "light";
}
```

## Best Practices

1. Always use the `secure` flag for cookies containing sensitive information
2. Consider using the `samesite` attribute to prevent CSRF attacks
3. Set appropriate expiration times for cookies to enhance security
4. Be mindful of cookie size limitations (typically 4KB per cookie)
5. For storing complex data, consider serializing to JSON before storing