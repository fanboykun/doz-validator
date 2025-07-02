# Important: You should just use a validation/schema validation library that follows <a href="https://github.com/standard-schema/standard-schema"> standard schema </a> like <a href="https://zod.dev/"> Zod </a>. This project is just a way i use to learn typescript

# Doz Validator


A powerful, type-safe validation library for TypeScript/JavaScript with zero
dependencies.

## Features

- 🎯 Type-safe validation
- 🚀 Zero dependencies
- 💪 Extensive validation rules
- 🔄 Composable validation
- 📝 Clear error messages
- 🌟 TypeScript support

## Installation

```bash
deno add jsr:@fanboykun/doz-validator
```

## Quick Start

```typescript
import { Rule, Validate } from "doz-validator";

const validation = new Validate({
  name: Rule.string("John"),
  age: Rule.number(25, { min: 0, max: 120 }),
  email: Rule.email("john@example.com"),
});

if (validation.result.valid) {
  console.log("Valid data:", validation.result.data);
} else {
  console.log("Validation errors:", validation.result.exception);
}
```

## Available Validation Rules

### Basic Types

#### `Rule.string(value)`

Validates that the input is a non-empty string.

```typescript
Rule.string("hello"); // ✅
Rule.string(""); // ❌ "must be string"
```

#### `Rule.number(value, options?)`

Validates numbers with optional min/max constraints.

```typescript
Rule.number(25, { min: 0, max: 100 }); // ✅
Rule.number(-1, { min: 0 }); // ❌ "must be greater than 0"
```

#### `Rule.boolean(value)`

Validates boolean values.

```typescript
Rule.boolean(true); // ✅
Rule.boolean("true"); // ❌ "must be boolean"
```

### Arrays

#### `Rule.array(value, options?)`

Validates arrays with optional length constraints.

```typescript
Rule.array([1, 2, 3], { minLength: 1, maxLength: 5 }); // ✅
Rule.array([], { minLength: 1 }); // ❌ "length must be at least 1"
```

#### `Rule.arrayOf(value, validator)`

Validates array elements using a specified validator.

```typescript
Rule.arrayOf([1, 2, 3], Rule.number); // ✅
Rule.arrayOf([1, "2", 3], Rule.number); // ❌ "Item at index 1: must be number"
```

#### `Rule.arrayIncludes(value, items)`

Validates that an array includes all specified items.

```typescript
Rule.arrayIncludes(["a", "b", "c"], ["a", "b"]); // ✅
Rule.arrayIncludes(["a"], ["a", "b"]); // ❌ "must include all of these items: b"
```

### Objects

#### `Rule.object(value)`

Validates that the input is an object.

```typescript
Rule.object({ key: "value" }); // ✅
Rule.object(null); // ❌ "must be object"
```

#### `Rule.shape(value, shape)`

Validates object properties against specified validators.

```typescript
Rule.shape(
  { name: "John", age: 25 },
  { name: Rule.string, age: Rule.number },
); // ✅
```

#### `Rule.hasProperties(value, properties)`

Validates that an object has specified properties.

```typescript
Rule.hasProperties({ a: 1, b: 2 }, ["a", "b"]); // ✅
Rule.hasProperties({ a: 1 }, ["a", "b"]); // ❌ "must have all of these properties: b"
```

### Special Types

#### `Rule.email(value)`

Validates email addresses.

```typescript
Rule.email("test@example.com"); // ✅
Rule.email("invalid-email"); // ❌ "must be valid email address"
```

#### `Rule.date(value)`

Validates dates.

```typescript
Rule.date("2023-12-25"); // ✅
Rule.date("invalid-date"); // ❌ "must be valid date"
```

#### `Rule.url(value, options?)`

Validates URLs with optional protocol restrictions.

```typescript
Rule.url("https://example.com", { protocols: ["https"] }); // ✅
Rule.url("ftp://example.com", { protocols: ["https"] }); // ❌ "must use one of these protocols: https"
```

#### `Rule.password(value, options?)`

Validates passwords with customizable requirements.

```typescript
Rule.password("Test123!", {
  minLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
}); // ✅
```

#### `Rule.uuidv4(value)`

Validates UUIDv4 strings.

```typescript
Rule.uuidv4("123e4567-e89b-4d3c-8456-426614174000"); // ✅
Rule.uuidv4("invalid-uuid"); // ❌ "must be a valid UUIDv4"
```

#### `Rule.ip(value, allowLocal?)`

Validates IP addresses (v4 and v6).

```typescript
Rule.ip("192.168.1.1", true); // ✅ (allows local IPs)
Rule.ip("256.256.256.256"); // ❌ "must be valid IPv4 or IPv6 address"
```

### Modifiers

#### `Rule.nullable(validator)`

Makes a validator accept null values.

```typescript
Rule.nullable(Rule.string)(null); // ✅
Rule.nullable(Rule.string)("hello"); // ✅
```

#### `Rule.optional(validator)`

Makes a validator accept undefined values.

```typescript
Rule.optional(Rule.string)(undefined); // ✅
Rule.optional(Rule.string)("hello"); // ✅
```

## Advanced Usage

### Composing Validations

```typescript
const userValidation = new Validate({
  user: Rule.shape({
    name: Rule.string("John"),
    age: Rule.number(25, { min: 18 }),
    email: Rule.email("john@example.com"),
    preferences: Rule.shape({
      newsletter: Rule.boolean(true),
      theme: Rule.string("dark"),
    }),
  }),
});
```

### Optional Fields

```typescript
const validation = new Validate({
  requiredField: Rule.string("hello"),
  optionalField: Rule.optional(Rule.string)(undefined),
  nullableField: Rule.nullable(Rule.number)(null),
});
```

## Error Handling

The validation result will be either:

```typescript
// Success case
{
  valid: true,
  data: {
    // Your validated data
  }
}

// Error case
{
  valid: false,
  exception: {
    // Field-specific error messages
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the
[LICENSE.md](LICENSE.md) file for details.
