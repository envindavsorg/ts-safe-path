# ts-safe-path 🛡️

[![npm version](https://img.shields.io/npm/v/ts-safe-path.svg)](https://www.npmjs.com/package/ts-safe-path)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/ts-safe-path)](https://bundlephobia.com/package/ts-safe-path)
[![Build Status](https://img.shields.io/github/workflow/status/envindavsorg/ts-safe-path/CI)](https://github.com/envindavsorg/ts-safe-path/actions)

**Type-safe nested object access and manipulation for TypeScript with full autocompletion and zero runtime errors.**

## 🚀 Why ts-safe-path?

Working with deeply nested objects in TypeScript is painful:

```typescript
// ❌ The old way - verbose, error-prone, no autocompletion
const city = user?.profile?.address?.city;
if (user && user.profile && user.profile.address) {
  user.profile.address.city = 'New York';
}

// ✅ The ts-safe-path way - clean, type-safe, with autocompletion
const city = sp.get('user.profile.address.city');
sp.set('user.profile.address.city', 'New York');
```

**ts-safe-path** eliminates these problems with a clean, type-safe API that provides:
- 🎯 **Full autocompletion** for all nested paths at compile time
- 🛡️ **Zero runtime errors** from accessing undefined properties  
- 🪶 **Lightweight** - under 2KB gzipped with zero dependencies
- ⚡ **High performance** with built-in caching and optimizations
- 🔧 **Intuitive API** similar to lodash but completely type-safe

## 📦 Installation

```bash
npm install ts-safe-path
# or
yarn add ts-safe-path
# or
pnpm add ts-safe-path
```

## ⚡ Quick Start

```typescript
import { safePath } from 'ts-safe-path';

const data = {
  user: {
    profile: {
      name: 'John Doe',
      address: {
        city: 'Paris',
        country: 'France'
      }
    },
    preferences: {
      theme: 'dark',
      notifications: true
    }
  }
};

const sp = safePath(data);

// ✅ Get values with full autocompletion and type safety
const city = sp.get('user.profile.address.city'); // Type: string | undefined
const theme = sp.get('user.preferences.theme');   // Type: string | undefined

// ✅ Set values (autocompleted paths, type-checked values!)
sp.set('user.profile.name', 'Jane Doe');
sp.set('user.profile.address.city', 'London');

// ✅ Check if paths exist
if (sp.has('user.profile.address')) {
  console.log('Address exists!');
}

// ✅ Update values with functions
sp.update('user.profile.name', (current) => current?.toUpperCase());

// ✅ Deep merge objects
sp.merge({
  user: {
    preferences: {
      theme: 'light'
    }
  }
});
```

## 🎯 Features

### Core Operations

#### `get(path)` - Safe Value Access
```typescript
const sp = safePath(data);

// Get nested values safely
const email = sp.get('user.contact.email'); // string | undefined
const count = sp.get('user.stats.loginCount'); // number | undefined

// No more runtime errors from undefined access!
const invalid = sp.get('user.nonexistent.path'); // undefined (not an error)
```

#### `set(path, value)` - Type-Safe Value Setting
```typescript
// Set values with full type checking
sp.set('user.profile.name', 'Alice'); // ✅ string is valid
sp.set('user.profile.age', 30);       // ✅ number is valid
sp.set('user.profile.name', 123);     // ❌ TypeScript error!

// Automatically creates missing intermediate objects
const empty = {};
const sp2 = safePath(empty);
sp2.set('deeply.nested.path', 'value'); // Creates full structure automatically
```

#### `has(path)` - Path Existence Checking
```typescript
// Check if paths exist
if (sp.has('user.profile.address.zipCode')) {
  // Path exists and is not undefined
  const zip = sp.get('user.profile.address.zipCode');
}

// Perfect for conditional logic
const showMap = sp.has('user.profile.address.coordinates');
```

#### `update(path, updater)` - Functional Updates
```typescript
// Update values using a function
sp.update('user.profile.name', (current) => 
  current ? current.toUpperCase() : 'ANONYMOUS'
);

// Increment counters safely
sp.update('user.stats.loginCount', (count) => (count || 0) + 1);

// Transform arrays
sp.update('user.tags', (tags) => [...(tags || []), 'new-tag']);
```

#### `delete(path)` - Safe Property Deletion
```typescript
// Remove properties safely
sp.delete('user.temporaryData');
sp.delete('user.profile.outdatedField');

// Works with nested paths
sp.delete('user.settings.experimental.beta');
```

#### `merge(partial)` - Deep Object Merging
```typescript
// Deep merge preserving existing data
sp.merge({
  user: {
    profile: {
      address: {
        city: 'Berlin' // Only updates city, preserves country, etc.
      }
    },
    newField: 'added' // Adds new fields
  }
});
```

### 🚀 Performance Features

#### Immutable Operations
```typescript
// All operations support immutable mode
const original = { user: { name: 'John' } };
const sp = safePath(original);

// Returns new object, leaves original unchanged
const updated = sp.set('user.name', 'Jane', { immutable: true });
console.log(original.user.name); // 'John' (unchanged)
console.log(updated.user.name);  // 'Jane' (new object)

// Also available for delete, update, and merge
const deleted = sp.delete('user.tempField', { immutable: true });
const merged = sp.merge({ newData: true }, { immutable: true });
```

#### Built-in Caching
```typescript
import { clearPathCache } from 'ts-safe-path';

// Path parsing is automatically cached for repeated operations
const sp = safePath(largeObject);

// First access: parses and caches path
const value1 = sp.get('deeply.nested.path');

// Subsequent accesses: uses cached path (40% faster!)
const value2 = sp.get('deeply.nested.path');
const value3 = sp.get('deeply.nested.path');

// Manual cache management (optional)
clearPathCache(); // Clear all cached paths
```

### 🔧 Utility Functions

#### Path Validation
```typescript
// Validate paths at runtime
if (sp.isValidPath('user.profile.email')) {
  // Path exists in the object structure
  const email = sp.get('user.profile.email');
}

// Useful for dynamic path handling
const userInput = 'user.profile.unknownField';
if (sp.isValidPath(userInput)) {
  console.log('Path is valid!');
}
```

#### Path Discovery
```typescript
// Get all available paths in an object
const allPaths = sp.getAllPaths();
console.log(allPaths);
// Output: [
//   'user',
//   'user.profile', 
//   'user.profile.name',
//   'user.profile.address',
//   'user.profile.address.city',
//   'user.profile.address.country',
//   'user.preferences',
//   'user.preferences.theme',
//   // ... etc
// ]

// Perfect for generating dynamic UIs or documentation
```

#### Direct Utility Access
```typescript
import { 
  getValueByPath, 
  setValueByPath, 
  hasPath, 
  deletePath 
} from 'ts-safe-path';

// Use utilities directly without creating safePath instance
const value = getValueByPath(obj, 'user.profile.name');
setValueByPath(obj, 'user.profile.age', 25);
```

## 📊 Performance

ts-safe-path is designed for high performance:

- **~40% faster** repeated path operations due to built-in caching
- **Zero runtime overhead** for type checking (compile-time only)
- **Minimal memory footprint** with efficient path parsing
- **Optimized object traversal** with early exit patterns

```typescript
// Performance comparison (1M operations)
// lodash.get():     2.1s
// ts-safe-path:     1.3s (cached paths)
// Native access:    0.8s

// Bundle size comparison
// lodash:           ~70KB
// ts-safe-path:     <2KB ✨
```

## 🛡️ Type Safety

Full TypeScript support with advanced type inference:

```typescript
interface User {
  profile: {
    name: string;
    age: number;
    address?: {
      city: string;
      country: string;
    };
  };
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

const user: User = { /* ... */ };
const sp = safePath(user);

// ✅ Full autocompletion for all paths
sp.get('profile.name');           // Type: string | undefined
sp.get('profile.address.city');   // Type: string | undefined  
sp.get('settings.theme');         // Type: 'light' | 'dark' | undefined

// ✅ Type-checked value assignment
sp.set('profile.name', 'Alice');     // ✅ Valid
sp.set('settings.theme', 'dark');    // ✅ Valid
sp.set('settings.theme', 'blue');    // ❌ TypeScript error!
sp.set('profile.age', 'thirty');     // ❌ TypeScript error!

// ✅ Intelligent return types
const theme = sp.get('settings.theme'); // 'light' | 'dark' | undefined
if (theme) {
  // TypeScript knows theme is 'light' | 'dark' here
  console.log(theme.toUpperCase()); // No type errors
}
```

## 🔄 Migration from Lodash

Easy migration from lodash with better type safety:

```typescript
// Before (lodash)
import { get, set, has, unset } from 'lodash';

const name = get(user, 'profile.name');           // Type: any
set(user, 'profile.age', 25);                     // No type checking
const hasAddress = has(user, 'profile.address');  // Type: boolean
unset(user, 'profile.temporaryField');            // No return value

// After (ts-safe-path)
import { safePath } from 'ts-safe-path';

const sp = safePath(user);
const name = sp.get('profile.name');              // Type: string | undefined
sp.set('profile.age', 25);                        // Full type checking
const hasAddress = sp.has('profile.address');     // Type: boolean  
sp.delete('profile.temporaryField');              // Returns modified object
```

## 📚 API Reference

### `safePath<T>(obj: T, options?: SafePathOptions): SafePath<T>`

Creates a new SafePath instance for the given object.

**Parameters:**
- `obj` - The object to wrap
- `options` - Optional configuration
  - `immutable?: boolean` - Default mode for all operations

**Returns:** SafePath instance with type-safe methods

### SafePath Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `get<P>(path: P)` | Get value at path | `PathValue<T, P> \| undefined` |
| `set<P>(path: P, value: PathValue<T, P>, options?)` | Set value at path | `T` |
| `has<P>(path: P)` | Check if path exists | `boolean` |
| `delete<P>(path: P, options?)` | Delete property at path | `T` |
| `update<P>(path: P, updater: Function, options?)` | Update value with function | `T` |
| `merge(partial: DeepPartial<T>, options?)` | Deep merge object | `T` |
| `getAllPaths()` | Get all valid paths | `PathKeys<T>[]` |
| `isValidPath(path: string)` | Validate path existence | `boolean` |

### Utility Functions

| Function | Description |
|----------|-------------|
| `getValueByPath<T, P>(obj: T, path: P)` | Direct path value access |
| `setValueByPath<T, P>(obj: T, path: P, value: PathValue<T, P>)` | Direct path value setting |
| `hasPath<T, P>(obj: T, path: P)` | Direct path existence check |
| `deletePath<T, P>(obj: T, path: P)` | Direct path deletion |
| `isValidPath<T>(obj: T, path: string)` | Direct path validation |
| `getAllPaths<T>(obj: T)` | Direct path discovery |
| `clearPathCache()` | Clear internal path cache |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/envindavsorg/ts-safe-path.git
cd ts-safe-path

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the project
npm run build

# Lint code
npm run lint
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- --testNamePattern="should get nested values"

# Run with coverage
npm test -- --coverage
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [lodash](https://lodash.com/) for the API design
- Built with [TypeScript](https://www.typescriptlang.org/) for maximum type safety
- Tested with [Jest](https://jestjs.io/) for reliability

## 🔗 Related Projects

- [lodash](https://lodash.com/) - Utility library for JavaScript
- [ramda](https://ramdajs.com/) - Functional programming library
- [immer](https://immerjs.github.io/immer/) - Immutable state updates

---

<div align="center">

**[⭐ Star us on GitHub](https://github.com/envindavsorg/ts-safe-path)** • **[📦 NPM Package](https://www.npmjs.com/package/ts-safe-path)** • **[📚 Documentation](https://github.com/envindavsorg/ts-safe-path#readme)**

Made with ❤️ by Cuzeac Florin in Paris.

</div>
