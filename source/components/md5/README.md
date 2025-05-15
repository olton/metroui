# MD5 Utility

The MD5 utility provides a function to generate MD5 hash values from strings. This is useful for creating checksums, simple password hashing (though not recommended for production security), or generating unique identifiers based on content.

## Usage

```javascript
// Generate an MD5 hash of a string
var hash = Metro.md5("Hello, world!");
console.log(hash); // "6cd3556deb0da54bca060b4c39479839"
```

## Function

### Metro.md5(string)

Calculates the MD5 hash of the provided string.

#### Parameters
- **string** (string): The input string to hash

#### Returns
- (string): The MD5 hash as a lowercase hexadecimal string

## Examples

### Basic Usage
```javascript
// Generate a simple hash
var hash = Metro.md5("Hello, world!");
console.log(hash); // "6cd3556deb0da54bca060b4c39479839"
```

### Hashing User Input
```javascript
// Hash user input (for demonstration purposes only)
$("#hashButton").on("click", function(){
    var input = $("#textInput").val();
    var hash = Metro.md5(input);
    $("#hashOutput").text(hash);
});
```

### Creating a Content Checksum
```javascript
// Create a checksum for content verification
function verifyContent(content, expectedHash) {
    var actualHash = Metro.md5(content);
    return actualHash === expectedHash;
}

// Usage
if (verifyContent(downloadedData, "a1b2c3d4e5f6g7h8i9j0")) {
    console.log("Content verified successfully");
} else {
    console.log("Content may be corrupted or tampered with");
}
```

### Generating a Unique ID Based on Content
```javascript
// Generate a unique ID for a data object
function generateContentId(data) {
    return Metro.md5(JSON.stringify(data));
}

// Usage
var userData = {
    name: "John Doe",
    email: "john@example.com",
    timestamp: Date.now()
};

var userId = generateContentId(userData);
console.log("Generated user ID:", userId);
```

## Important Notes

1. **Security Considerations**: MD5 is considered cryptographically broken and unsuitable for security applications where collision resistance is important. For secure password hashing, use dedicated password hashing functions like bcrypt, Argon2, or PBKDF2.

2. **Performance**: The MD5 algorithm is relatively fast, making it suitable for non-security applications like checksums or content verification.

3. **Deterministic Output**: The same input will always produce the same output hash, which is a 32-character hexadecimal string.

4. **Character Encoding**: The function handles UTF-8 encoding internally, so it properly processes international characters.

5. **Case Sensitivity**: The input string is case-sensitive, and the output hash is returned in lowercase.