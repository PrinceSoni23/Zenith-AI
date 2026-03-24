# Dashboard Components - Before & After Examples

## Example 1: Simple Button Click with API Call

### ❌ BEFORE (No Loader)

```typescript
'use client';

import { useState } from 'react';

export function StudentProfileCard() {
  const [profile, setProfile] = useState(null);

  const handleLoadProfile = async () => {
    try {
      const res = await fetch('/api/student/profile');
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <div className="p-4">
      <button onClick={handleLoadProfile}>
        Load My Profile
      </button>
      {profile && <h2>{profile.name}</h2>}
    </div>
  );
}
```

### ✅ AFTER (With Loader)

```typescript
'use client';

import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';

export function StudentProfileCard() {
  const [profile, setProfile] = useState(null);

  const handleLoadProfile = useAsync(
    async () => {
      const res = await fetch('/api/student/profile');
      return res.json();
    },
    (data) => setProfile(data),
    (error) => console.error('Failed:', error),
    { showMessage: 'Loading your profile...' }
  );

  return (
    <div className="p-4">
      <button onClick={handleLoadProfile}>
        Load My Profile
      </button>
      {profile && <h2>{profile.name}</h2>}
    </div>
  );
}
```

---

## Example 2: Form Submission

### ❌ BEFORE

```typescript
'use client';

import { useState } from 'react';

export function SettingsForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* form data */ })
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={loading}>
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
```

### ✅ AFTER

```typescript
'use client';

import { useAsync } from '@/hooks/useAsync';

export function SettingsForm() {
  const handleSubmit = useAsync(
    async () => {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* form data */ })
      });
    },
    () => console.log('Settings saved!'),
    (error) => console.error('Save failed:', error),
    { showMessage: 'Saving your settings...' }
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <button>Save Settings</button>
    </form>
  );
}
```

---

## Example 3: Multi-step Operation (Most Complex)

### ❌ BEFORE

```typescript
'use client';

import { useState } from 'react';

export function StudyPlanCreator() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');

  const handleCreatePlan = async () => {
    setLoading(true);
    try {
      setStep('Analyzing your goals...');
      const goals = await fetch('/api/goals').then(r => r.json());

      setStep('Creating schedule...');
      const schedule = await fetch('/api/schedule', {
        method: 'POST',
        body: JSON.stringify(goals)
      }).then(r => r.json());

      setStep('Finalizing plan...');
      await fetch('/api/study-plan', {
        method: 'POST',
        body: JSON.stringify(schedule)
      });

      setStep('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button disabled={loading} onClick={handleCreatePlan}>
        Create Study Plan
      </button>
      {loading && <p>{step}</p>}
    </div>
  );
}
```

### ✅ AFTER

```typescript
'use client';

import { useLoading } from '@/hooks/useLoading';

export function StudyPlanCreator() {
  const { showLoader, hideLoader, setMessage } = useLoading();

  const handleCreatePlan = async () => {
    showLoader();
    try {
      setMessage('Analyzing your goals...');
      const goals = await fetch('/api/goals').then(r => r.json());

      setMessage('Creating schedule...');
      const schedule = await fetch('/api/schedule', {
        method: 'POST',
        body: JSON.stringify(goals)
      }).then(r => r.json());

      setMessage('Finalizing plan...');
      await fetch('/api/study-plan', {
        method: 'POST',
        body: JSON.stringify(schedule)
      });

      hideLoader();
    } catch (error) {
      hideLoader();
      console.error('Failed:', error);
    }
  };

  return (
    <button onClick={handleCreatePlan}>
      Create Study Plan
    </button>
  );
}
```

---

## Example 4: List/Table Pagination

### ❌ BEFORE

```typescript
'use client';

import { useState } from 'react';

export function LeaderboardTable() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNextPage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?page=${page + 1}`);
      setUsers(await res.json());
      setPage(page + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <table>
        {/* table rows */}
      </table>
      <button disabled={loading} onClick={handleNextPage}>
        Next Page
      </button>
    </div>
  );
}
```

### ✅ AFTER

```typescript
'use client';

import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';

export function LeaderboardTable() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  const handleNextPage = useAsync(
    async () => {
      const res = await fetch(`/api/leaderboard?page=${page + 1}`);
      return res.json();
    },
    (data) => {
      setUsers(data);
      setPage(page + 1);
    },
    undefined,
    { showMessage: 'Loading more users...' }
  );

  return (
    <div>
      <table>
        {/* table rows */}
      </table>
      <button onClick={handleNextPage}>Next Page</button>
    </div>
  );
}
```

---

## Example 5: useCallback Pattern (Advanced)

### ✅ RECOMMENDED PATTERN

```typescript
'use client';

import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';

export function AdvancedComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Memoized fetch function
  const fetchData = useCallback(() =>
    fetch('/api/data').then(r => r.json()),
    []
  );

  const handleFetch = useAsync(
    fetchData,
    (result) => {
      setData(result);
      setError(null);
    },
    (err) => {
      setError('Failed to load data');
      console.error(err);
    },
    { showMessage: 'Loading data...', minDuration: 400 }
  );

  return (
    <div>
      <button onClick={handleFetch}>Fetch</button>
      {error && <p className="text-red-500">{error}</p>}
      {data && <div>{/* render data */}</div>}
    </div>
  );
}
```

---

## Example 6: Conditional Loading (Agent Modules)

### ✅ AFTER

```typescript
'use client';

import { useState } from 'react';
import { useAsync } from '@/hooks/useAsync';

export function MathSolverModule() {
  const [solution, setSolution] = useState(null);
  const [problem, setProblem] = useState('');

  const solveMath = useAsync(
    async () => {
      const res = await fetch('/api/agents/maths-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem })
      });
      return res.json();
    },
    (result) => setSolution(result),
    (error) => alert('Could not solve: ' + error.message),
    { showMessage: 'Solving your problem...' }
  );

  return (
    <div>
      <textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="Enter your math problem..."
      />
      <button onClick={solveMath}>Solve</button>
      {solution && <div className="mt-4">{solution.steps}</div>}
    </div>
  );
}
```

---

## Quick Migration Guide

1. **Find all `useState(false)` + `setLoading` patterns**
2. **Replace with `useAsync` or `useLoading`**
3. **Remove manual loading state management**
4. **Add meaningful `showMessage` values**
5. **Test with slow network (DevTools Throttle)**

---

## Pro Tips

✨ **Tip 1**: Always provide meaningful messages

```typescript
showMessage: "Analyzing your study patterns..."; // Good
showMessage: "Loading..."; // OK
```

✨ **Tip 2**: Chain async operations

```typescript
const step1 = await fetch1();
setMessage("Step 2 of 3...");
const step2 = await fetch2(step1);
setMessage("Almost done...");
const step3 = await fetch3(step2);
```

✨ **Tip 3**: Error messages should hide loader

```typescript
const operation = useAsync(
  fn,
  success,
  error => {
    hideLoader(); // Always call this
    showErrorNotif(error.message);
  },
  opts,
);
```

✨ **Tip 4**: Test with slow 3G for realistic UX

- DevTools → Network → Slow 3G
- Verify loader appears immediately

---

## Next Steps

1. Update your dashboard `/dashboard` components
2. Update `/dashboard/profile`
3. Update `/dashboard/leaderboard`
4. Update `/dashboard/study-planner`
5. Update agent module pages
6. Test page refreshes
7. Deploy! 🚀
