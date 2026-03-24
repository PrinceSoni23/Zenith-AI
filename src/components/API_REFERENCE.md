# 📚 Loader System - API Reference

Complete API documentation for all exports and usage.

## Exports Reference

### 1. LoaderContext

**File:** `src/context/LoaderContext.tsx`

```typescript
// Type Definition
interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoader: () => void;
  hideLoader: () => void;
  message?: string;
  setMessage: (message: string | undefined) => void;
}

// Exported
export const LoaderContext: React.Context<LoaderContextType | undefined>;
export function LoaderProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element;
```

### 2. useLoading Hook

**File:** `src/hooks/useLoading.ts`

```typescript
// Usage
const {
  isLoading, // boolean - is loader visible?
  setIsLoading, // (bool) => void
  showLoader, // () => void
  hideLoader, // () => void
  message, // string | undefined
  setMessage, // (msg?: string) => void
} = useLoading();

// Example
const { showLoader, hideLoader, setMessage } = useLoading();
```

### 3. useAsync Hook

**File:** `src/hooks/useAsync.ts`

```typescript
// Signature
function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: E) => void,
  options?: UseAsyncOptions,
): () => Promise<T>;

// Options
interface UseAsyncOptions {
  showMessage?: string; // Default: "Loading..."
  minDuration?: number; // Default: 300ms
}

// Usage
const execute = useAsync(
  async () => {
    /* async work */
  },
  data => {
    /* success */
  },
  error => {
    /* error */
  },
  { showMessage: "Loading...", minDuration: 300 },
);

// Call it
await execute();
```

### 4. useFetch Hook

**File:** `src/hooks/useFetch.ts`

```typescript
// Signature
function useFetch(): (
  url: string,
  options?: RequestInit & FetchOptions,
) => Promise<Response>;

// FetchOptions
interface FetchOptions {
  message?: string; // Loading message
  minDuration?: number; // Minimum loader visible time
}

// Usage
const fetch = useFetch();
const response = await fetch("/api/data", {
  method: "GET",
  message: "Fetching data...",
  minDuration: 400,
});
```

### 5. Loader Component

**File:** `src/components/GlobalLoader.tsx`

```typescript
// Component
export function Loader({ message }: LoaderProps): JSX.Element

// Props
interface LoaderProps {
  message?: string;  // Optional loading message
}

// Usage (Usually automatic, but can use directly)
import { Loader } from '@/components/GlobalLoader';

<Loader message="Custom message" />
```

### 6. SleekLoader Component

**File:** `src/components/SleekLoader.tsx`

```typescript
// Component
export function SleekLoader({ message }: SleekLoaderProps): JSX.Element

// Props
interface SleekLoaderProps {
  message?: string;  // Optional loading message
}

// Usage
import { SleekLoader } from '@/components/SleekLoader';

<SleekLoader message="Loading..." />
```

### 7. PageTransitionLoader Component

**File:** `src/components/PageTransitionLoader.tsx`

```typescript
// Component
export function PageTransitionLoader(): JSX.Element;

// Does: Handles route changes automatically
// Returns: <Loader /> when isLoading is true, null otherwise
// Usage: Automatically integrated in RootLayoutWrapper
```

### 8. RootLayoutWrapper Component

**File:** `src/components/RootLayoutWrapper.tsx`

```typescript
// Component
export function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element;

// Does: Provides LoaderProvider and PageTransitionLoader
// Usage: Wrap in layout.tsx
// Already integrated in: src/app/layout.tsx
```

---

## Quick Integration Guide

### Minimal Setup (Already Done!)

```typescript
// In src/app/layout.tsx
import { RootLayoutWrapper } from '@/components/RootLayoutWrapper';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <RootLayoutWrapper>
              {children}
            </RootLayoutWrapper>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Use in Components

**Method 1: useAsync (Recommended)**

```typescript
'use client';

import { useAsync } from '@/hooks/useAsync';

export function Component() {
  const action = useAsync(
    async () => { /* your code */ },
    (result) => { /* handle result */ }
  );

  return <button onClick={action}>Action</button>;
}
```

**Method 2: useFetch**

```typescript
'use client';

import { useFetch } from '@/hooks/useFetch';

export function Component() {
  const fetch = useFetch();

  const handleClick = async () => {
    const res = await fetch('/api/endpoint');
  };

  return <button onClick={handleClick}>Fetch</button>;
}
```

**Method 3: useLoading**

```typescript
'use client';

import { useLoading } from '@/hooks/useLoading';

export function Component() {
  const { showLoader, hideLoader } = useLoading();

  const handleClick = async () => {
    showLoader();
    try {
      await doSomething();
    } finally {
      hideLoader();
    }
  };

  return <button onClick={handleClick}>Do It</button>;
}
```

---

## Type Definitions

### LoaderContextType

```typescript
interface LoaderContextType {
  isLoading: boolean; // Current state
  setIsLoading: (loading: boolean) => void; // Direct setter
  showLoader: () => void; // Show loader
  hideLoader: () => void; // Hide loader
  message?: string; // Current message
  setMessage: (message: string | undefined) => void; // Set message
}
```

### UseAsyncOptions

```typescript
interface UseAsyncOptions {
  showMessage?: string; // Message to display
  minDuration?: number; // Minimum visible time (ms)
}
```

### FetchOptions (in useFetch)

```typescript
interface FetchOptions {
  message?: string; // Loading message
  minDuration?: number; // Minimum visible time (ms)
}
```

### LoaderProps

```typescript
interface LoaderProps {
  message?: string; // Optional message under "Loading"
}
```

---

## Return Types

### useAsync Return

```typescript
// Returns: An async function
() => Promise<T>

// Usage:
const method = useAsync(...);
const result = await method();  // Returns what asyncFunction returns
```

### useFetch Return

```typescript
// Returns: A fetch wrapper function
(url: string, options?: RequestInit & FetchOptions) => Promise<Response>;

// Usage:
const response = await fetch(url, options);
const data = await response.json();
```

### useLoading Return

```typescript
// Returns: Object with methods
{
  isLoading: boolean;
  setIsLoading: (bool) => void;
  showLoader: () => void;
  hideLoader: () => void;
  message?: string;
  setMessage: (msg?: string) => void;
}
```

---

## Error Handling

### In useAsync

```typescript
const action = useAsync(
  async () => {
    /* might throw */
  },
  data => {
    /* success */
  },
  (error: Error) => {
    /* error handling */
  }, // Called on error
);
```

### In useFetch

```typescript
try {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
} catch (error) {
  console.error("Fetch failed:", error);
}
```

### In useLoading

```typescript
const { showLoader, hideLoader } = useLoading();

try {
  showLoader();
  // do work
} catch (error) {
  hideLoader(); // Always hide on error
  throw error;
}
```

---

## Lifecycle

### Route Change Lifecycle

```
1. User clicks Link/uses router.push()
2. Next.js detects route change (pathname/searchParams change)
3. useEffect in PageTransitionLoader triggers
4. showLoader() called
5. <Loader> component renders (full screen overlay)
6. Next.js loads new page
7. After ~300ms, hideLoader() called
8. <Loader> hides
```

### API Call Lifecycle

```
1. User clicks button
2. useAsync/useFetch triggered
3. showLoader() called (async function starts)
4. setMessage(showMessage) called
5. Async function executes
6. Response received
7. If elapsedTime < minDuration:
     Wait (minDuration - elapsedTime)
8. hideLoader() called
9. Component updates with result
```

---

## Troubleshooting Reference

### Won't Hide

```typescript
// Wrong: Missing finally
const method = useAsync(async () => {
  const res = await fetch("/api");
  return res.json(); // If throws, never hides!
});

// Right: Use try/finally
const method = useAsync(async () => {
  try {
    const res = await fetch("/api");
    return res.json();
  } finally {
    // Will be called in catch block too
  }
});
```

### Not Triggering

```typescript
// Wrong: Not 'use client'
export function Component() {
  const { showLoader } = useLoading(); // Error!
}

// Right: Must be client component
("use client");
export function Component() {
  const { showLoader } = useLoading(); // Works!
}
```

### Provider Error

```typescript
// Error: useLoading must be used within LoaderProvider
// Cause: Component not wrapped by RootLayoutWrapper
// Fix: Check RootLayoutWrapper is in layout.tsx
```

---

## Performance Considerations

### Best Practices

```typescript
// ✅ Good: Use useCallback for stable reference
const fetchData = useCallback(() =>
  fetch('/api/data').then(r => r.json()),
  []
);

const action = useAsync(fetchData, ...);


// ❌ Bad: New function every render
const action = useAsync(
  async () => fetch('/api/data').then(r => r.json()),
  ...
);  // Will recreate on every render
```

### Optimization Tips

```typescript
// Cache async functions
const fetchUsers = useCallback(async () => {
  const res = await fetch('/api/users');
  return res.json();
}, []);  // Empty deps means stable reference

const loadUsers = useAsync(fetchUsers, ...);

// Memoize components
export const UserList = React.memo(({ users }) => (
  <div>{users.map(u => <div key={u.id}>{u.name}</div>)}</div>
));
```

---

## Browser Compatibility

All exports work in:

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Mobile browsers

---

## File Structure

```
src/
├── context/
│   └── LoaderContext.tsx          ← State & Provider
├── hooks/
│   ├── useLoading.ts              ← Access state
│   ├── useAsync.ts                ← Async operations
│   └── useFetch.ts                ← Fetch API calls
├── components/
│   ├── GlobalLoader.tsx           ← Main UI
│   ├── SleekLoader.tsx            ← Alternative UI
│   ├── PageTransitionLoader.tsx   ← Route detection
│   ├── RootLayoutWrapper.tsx      ← Provider wrapper
│   └── [Documentation files]
└── app/
    └── layout.tsx                 ← Uses RootLayoutWrapper
```

---

## Summary

| What      | Where                      | Use Case                    |
| --------- | -------------------------- | --------------------------- |
| Context   | `LoaderContext.tsx`        | State management (internal) |
| Hook      | `useLoading.ts`            | Manual control              |
| Hook      | `useAsync.ts`              | Async operations            |
| Hook      | `useFetch.ts`              | Fetch API calls             |
| Component | `GlobalLoader.tsx`         | Beautiful UI                |
| Component | `SleekLoader.tsx`          | Minimal UI                  |
| Detection | `PageTransitionLoader.tsx` | Route changes               |
| Wrapper   | `RootLayoutWrapper.tsx`    | Provider setup              |

---

## Next: Implementation

Now that you know the API, check these files:

- `LOADER_USAGE_GUIDE.md` - How to use each part
- `BEFORE_AFTER_EXAMPLES.md` - Real code examples
- `LOADER_CHEAT_SHEET.md` - Copy & paste templates

Start integrating into your dashboard components! 🚀
