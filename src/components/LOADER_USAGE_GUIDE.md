# 🚀 Loader System Implementation Guide

This guide shows you how to use the new loader system throughout your app.

## Quick Overview

The loader system consists of:

- **LoaderContext** - Global state management
- **PageTransitionLoader** - Automatic route change detection
- **useLoading()** - Hook for manual control
- **useAsync()** - For async operations
- **useFetch()** - For API calls
- **Loader** - Main loader component (GlobalLoader.tsx)
- **SleekLoader** - Alternative minimal design

## Features

✅ Automatically shows on page transitions  
✅ Shows on page refresh  
✅ Sexy animated design with particles  
✅ Smooth 300ms minimum duration  
✅ Easy integration with API calls  
✅ Works with all dashboard features  
✅ No flash of unstyled content

---

## Usage Examples

### 1. Automatic Route Changes (Already Working!)

The loader automatically shows when navigating between pages. No code needed!

```typescript
// This already shows the loader automatically
<Link href="/dashboard/profile">
  Go to Profile
</Link>
```

### 2. Page Refresh

The loader automatically shows when the page is refreshed. Already handled!

### 3. Manual Control with useLoading Hook

For manual control in any component:

```typescript
'use client';

import { useLoading } from '@/hooks/useLoading';

export function MyComponent() {
  const { showLoader, hideLoader, setMessage } = useLoading();

  const handleClick = async () => {
    showLoader();
    setMessage('Processing your request...');

    try {
      // Do something
      await someAsyncFunction();
    } finally {
      hideLoader();
    }
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### 4. Using useAsync Hook for Async Operations

Perfect for button clicks that need to fetch data:

```typescript
'use client';

import { useAsync } from '@/hooks/useAsync';

export function DashboardFeature() {
  const fetchData = useAsync(
    async () => {
      const response = await fetch('/api/get-data');
      return response.json();
    },
    (data) => {
      console.log('Success!', data);
      // Update your state or UI here
    },
    (error) => {
      console.error('Error:', error);
      // Handle error
    },
    { showMessage: 'Fetching your data...', minDuration: 500 }
  );

  return (
    <button onClick={fetchData}>
      Load Dashboard Data
    </button>
  );
}
```

### 5. Using useFetch Hook for Direct API Calls

For simpler fetch operations:

```typescript
'use client';

import { useFetch } from '@/hooks/useFetch';

export function StudentAnalytics() {
  const fetch = useFetch();

  const handleFetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/student', {
        method: 'GET',
        message: 'Loading your analytics...',
        minDuration: 400,
      });
      const data = await response.json();
      // Use data...
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  return (
    <button onClick={handleFetchAnalytics}>
      View Analytics
    </button>
  );
}
```

### 6. Integration with Dashboard Buttons

Example: Adding loader to your dashboard features

```typescript
'use client';

import { useAsync } from '@/hooks/useAsync';

export function ProfileCard() {
  const [profile, setProfile] = useState(null);

  const loadProfile = useAsync(
    async () => {
      const res = await fetch('/api/profile');
      return res.json();
    },
    (data) => setProfile(data),
    (error) => alert('Failed to load profile'),
    { showMessage: 'Loading your profile...' }
  );

  return (
    <div>
      <button onClick={loadProfile}>
        Load Profile
      </button>
      {profile && <h2>{profile.name}</h2>}
    </div>
  );
}
```

### 7. Multiple Operations

Chain multiple async operations:

```typescript
'use client';

import { useLoading } from '@/hooks/useLoading';

export function ComplexFeature() {
  const { showLoader, hideLoader, setMessage } = useLoading();

  const handleComplexOperation = async () => {
    showLoader();

    try {
      setMessage('Step 1: Fetching data...');
      const data = await fetch('/api/step1').then(r => r.json());

      setMessage('Step 2: Processing...');
      const processed = await fetch('/api/step2', {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json());

      setMessage('Step 3: Saving...');
      await fetch('/api/step3', {
        method: 'POST',
        body: JSON.stringify(processed)
      });

      hideLoader();
    } catch (error) {
      hideLoader();
      console.error('Error:', error);
    }
  };

  return <button onClick={handleComplexOperation}>Execute</button>;
}
```

---

## Switching Loader Styles

The system currently uses **GlobalLoader** (fancy with particles).

To switch to the **SleekLoader** instead, update `PageTransitionLoader.tsx`:

```typescript
// Change this:
import { Loader } from "@/components/GlobalLoader";

// To this:
import { SleekLoader as Loader } from "@/components/SleekLoader";
```

Or create custom variants by modifying either component!

---

## Integration Checklist

- [x] Loader shows on page transitions
- [x] Loader shows on page refresh
- [x] useLoading() hook available
- [x] useAsync() hook available
- [x] useFetch() hook available
- [ ] Update your dashboard buttons to use useAsync/useFetch
- [ ] Add loading messages to key API calls
- [ ] Test with slow network (DevTools > Network > Slow 3G)

---

## Dashboard Integration Examples

### Study Planner

```typescript
const fetchPlanner = useAsync(
  async () => {
    const res = await fetch("/api/planner/weekly");
    return res.json();
  },
  data => setPlanData(data),
  undefined,
  { showMessage: "Creating your study plan..." },
);
```

### Leaderboard

```typescript
const loadLeaderboard = useAsync(
  async () => {
    const res = await fetch("/api/leaderboard");
    return res.json();
  },
  data => setLeaderboardData(data),
  undefined,
  { showMessage: "Fetching leaderboard..." },
);
```

### Math Solver

```typescript
const solveProblem = useAsync(
  async () => {
    const res = await fetch("/api/maths-solver/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem: userProblem }),
    });
    return res.json();
  },
  solution => setAnswer(solution),
  error => showError("Failed to solve"),
  { showMessage: "Solving your problem..." },
);
```

---

## Customization

### Change Loader Colors

Edit `GlobalLoader.tsx` gradient colors:

```typescript
// Change gradient colors in className
from - purple - 600 / 20; // Start color
to - transparent;
from - purple - 500; // Ring color
```

### Change Loader Message

Pass custom messages:

```typescript
setMessage("Custom message here!");
```

### Change Minimum Duration

```typescript
const fetch = useAsync(asyncFn, onSuccess, onError, {
  minDuration: 1000, // 1 second minimum
});
```

---

## Performance Tips

1. **Use minDuration wisely** - 300-500ms is usually good
2. **Don't show loader for sub-100ms calls** - Use higher minDuration
3. **Cache API responses** - Reduces loader frequency
4. **Prefetch data on hover** - Show loader only when necessary
5. **Lazy load heavy modules** - Load with loader visible

---

## Troubleshooting

**Loader not showing?**

- Check if component is wrapped with useLoading() inside LoaderProvider
- Ensure PageTransitionLoader is in RootLayoutWrapper

**Loader stuck on screen?**

- Always call hideLoader() in finally block
- Check console for errors

**Loader appears too briefly?**

- Increase minDuration option
- API might be too fast (good problem!)

**Loader doesn't show for route changes?**

- Verify RootLayoutWrapper is in layout.tsx
- Check devTools for errors

---

## Files Modified/Created

- ✅ `context/LoaderContext.tsx` - State management
- ✅ `hooks/useLoading.ts` - Main hook
- ✅ `hooks/useAsync.ts` - Async operations helper
- ✅ `hooks/useFetch.ts` - Fetch API helper
- ✅ `components/GlobalLoader.tsx` - Main loader UI
- ✅ `components/SleekLoader.tsx` - Alternative design
- ✅ `components/PageTransitionLoader.tsx` - Route detection
- ✅ `components/RootLayoutWrapper.tsx` - Provider wrapper
- ✅ `app/layout.tsx` - Updated with wrapper

---

Next step: Add `useAsync` or `useFetch` to your dashboard components! 🚀
