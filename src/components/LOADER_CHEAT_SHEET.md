# 🎯 Loader Cheat Sheet - Copy & Paste Ready

## Quick Start (30 seconds)

### Import the hook

```typescript
import { useAsync } from "@/hooks/useAsync";
```

### Add to your button click

```typescript
const myAction = useAsync(
  async () => {
    // Your async code here
    const res = await fetch('/api/endpoint');
    return res.json();
  },
  (result) => { /* handle success */ },
  (error) => { /* handle error */ },
  { showMessage: 'Your message here...' }
);

// Use it:
<button onClick={myAction}>Do Something</button>
```

---

## Copy & Paste Templates

### Template 1: Simple API Call

```typescript
const loadData = useAsync(
  async () => {
    const res = await fetch("/api/something");
    if (!res.ok) throw new Error("Failed to load");
    return res.json();
  },
  data => {
    // Update state with data
    setMyData(data);
  },
  error => {
    console.error("Error:", error);
    // Show error toast/alert
  },
  { showMessage: "Loading data..." },
);
```

### Template 2: POST Request

```typescript
const submitForm = useAsync(
  async () => {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
      }),
    });
    if (!res.ok) throw new Error("Submission failed");
    return res.json();
  },
  result => {
    alert("Success!");
    // Refresh page or redirect
  },
  error => alert("Error: " + error.message),
  { showMessage: "Submitting..." },
);
```

### Template 3: Multi-Step Operation

```typescript
const { showLoader, hideLoader, setMessage } = useLoading();

const complexOperation = async () => {
  showLoader();
  try {
    setMessage("Step 1 of 3: Loading files...");
    const files = await fetch("/api/files").then(r => r.json());

    setMessage("Step 2 of 3: Processing...");
    const processed = await fetch("/api/process", {
      method: "POST",
      body: JSON.stringify(files),
    }).then(r => r.json());

    setMessage("Step 3 of 3: Saving...");
    await fetch("/api/save", {
      method: "POST",
      body: JSON.stringify(processed),
    });

    hideLoader();
    alert("Done!");
  } catch (error) {
    hideLoader();
    alert("Error: " + error.message);
  }
};
```

### Template 4: Manual Control

```typescript
const { showLoader, hideLoader, setMessage } = useLoading();

const handleClick = async () => {
  showLoader();
  setMessage("Please wait...");

  try {
    // Do something
    await somethingAsync();
  } finally {
    hideLoader();
  }
};
```

### Template 5: Data Fetching + State Update

```typescript
const [students, setStudents] = useState([]);

const loadStudents = useAsync(
  async () => {
    const res = await fetch('/api/students');
    return res.json();
  },
  (data) => setStudents(data),
  undefined,
  { showMessage: 'Loading students...' }
);

// In component:
<button onClick={loadStudents}>Load</button>
<ul>
  {students.map(s => <li key={s.id}>{s.name}</li>)}
</ul>
```

---

## Common Patterns

### Pattern: Delete with Confirmation

```typescript
const deleteItem = useAsync(
  async () => {
    if (!window.confirm("Are you sure?")) throw new Error("Cancelled");
    const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
    return res.json();
  },
  () => {
    /* remove from list */
  },
  undefined,
  { showMessage: "Deleting..." },
);
```

### Pattern: Search/Filter

```typescript
const [results, setResults] = useState([]);
const [query, setQuery] = useState('');

const search = useAsync(
  async () => {
    const res = await fetch(`/api/search?q=${query}`);
    return res.json();
  },
  (data) => setResults(data),
  undefined,
  { showMessage: `Searching for "${query}"...` }
);

// Use in component:
<input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => e.key === 'Enter' && search()}
/>
<button onClick={search}>Search</button>
```

### Pattern: Export/Download

```typescript
const exportData = useAsync(
  async () => {
    const res = await fetch("/api/export", { method: "POST" });
    const blob = await res.blob();

    // Trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();
  },
  () => alert("Export complete!"),
  error => alert("Export failed: " + error),
  { showMessage: "Exporting data..." },
);
```

### Pattern: Polling/Retry

```typescript
const pollData = useAsync(
  async () => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        const res = await fetch("/api/status");
        return res.json();
      } catch (error) {
        attempts++;
        if (attempts >= 3) throw error;
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  },
  data => setStatus(data),
  error => alert("Failed after 3 attempts"),
  { showMessage: "Checking status..." },
);
```

---

## Message Customization

### For Different Operations

```typescript
// Study
"Loading your study materials...";
"Generating questions...";
"Analyzing performance...";

// Profile
"Fetching your profile...";
"Updating settings...";
"Saving preferences...";

// Dashboard
"Loading leaderboard...";
"Calculating badges...";
"Processing analytics...";

// Agents
"Solving problem...";
"Translating text...";
"Generating notes...";
"Coaching writing...";
```

---

## Debugging

### Check if loader shows

1. Open DevTools → Network tab
2. Throttle to "Slow 3G"
3. Click your button
4. Loader should appear immediately

### If loader doesn't show

- ✅ Check component has `'use client'`
- ✅ Check parent has `<RootLayoutWrapper>`
- ✅ Check you're using the hook correctly
- ✅ Check console for errors

### If loader takes too long

- Increase `minDuration` to 500-1000ms
- Or decrease if API is fast

---

## Loader + React Query Integration

If using React Query:

```typescript
import { useMutation } from '@tanstack/react-query';
import { useLoading } from '@/hooks/useLoading';

export function MyComponent() {
  const { showLoader, hideLoader } = useLoading();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onMutate: () => showLoader(),
    onSuccess: () => hideLoader(),
    onError: () => hideLoader(),
  });

  return <button onClick={() => mutation.mutate(data)}>Submit</button>;
}
```

---

## Files You Need to Know

- 📁 `src/context/LoaderContext.tsx` - State
- 📁 `src/hooks/useLoading.ts` - Manual control
- 📁 `src/hooks/useAsync.ts` - For async ops
- 📁 `src/hooks/useFetch.ts` - For API calls
- 📁 `src/components/GlobalLoader.tsx` - Beautiful loader
- 📁 `src/components/SleekLoader.tsx` - Minimal loader
- 🔧 Already integrated in `src/app/layout.tsx`

---

## Still Have Questions?

Read the full guide:

- 📖 `LOADER_USAGE_GUIDE.md` - Complete documentation
- 📖 `BEFORE_AFTER_EXAMPLES.md` - Real examples

---

**Happy Loading! 🚀**
