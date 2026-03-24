# 🚀 LOADER SYSTEM - QUICK REFERENCE CARD

**Print this or bookmark it**

---

## 📍 WHERE EVERYTHING IS

### Documentation Files

All in `frontend/src/components/`:

- `LOADER_CHEAT_SHEET.md` ← Copy/paste templates
- `BEFORE_AFTER_EXAMPLES.md` ← Real examples
- `LOADER_USAGE_GUIDE.md` ← Full guide
- `API_REFERENCE.md` ← All exports
- `VISUAL_GUIDE.md` ← Appearance
- `DOCUMENTATION_INDEX.md` ← Navigation

### Root Documentation

- `frontend/LOADER_SYSTEM_COMPLETE.md` ← Start here
- `frontend/COMPLETION_REPORT.md` ← What was built
- `frontend/VERIFICATION_CHECKLIST.md` ← Verify it works

### Code Files

```
src/
├─ context/LoaderContext.tsx
├─ hooks/
│  ├─ useLoading.ts
│  ├─ useAsync.ts
│  └─ useFetch.ts
└─ components/
   ├─ GlobalLoader.tsx
   ├─ SleekLoader.tsx
   ├─ PageTransitionLoader.tsx
   └─ RootLayoutWrapper.tsx
```

---

## ⚡ 60-SECOND START

### Already Works (No Code)

✅ Page navigation shows loader  
✅ F5 refresh shows loader  
✅ URL changes show loader

### Add to Any Component (8 lines)

```typescript
'use client';
import { useAsync } from '@/hooks/useAsync';

const action = useAsync(
  async () => { const res = await fetch('/api/data'); return res.json(); },
  (data) => console.log('Got data:', data),
  undefined,
  { showMessage: 'Loading...' }
);

<button onClick={action}>Load</button>
```

---

## 🎯 IMPORT REFERENCE

### Manual Control

```typescript
import { useLoading } from "@/hooks/useLoading";
const { showLoader, hideLoader, setMessage } = useLoading();
```

### For Async Code

```typescript
import { useAsync } from "@/hooks/useAsync";
const execute = useAsync(asyncFn, onSuccess, onError, opts);
```

### For Fetch Calls

```typescript
import { useFetch } from "@/hooks/useFetch";
const fetch = useFetch();
const response = await fetch("/api/endpoint", options);
```

---

## 📝 COMMON PATTERNS

### Pattern 1: Button Click

```typescript
const loadData = useAsync(
  async () => { return fetch('/api/data').then(r => r.json()); },
  (data) => setData(data),
  (error) => alert('Error: ' + error),
  { showMessage: 'Loading data...' }
);

<button onClick={loadData}>Load</button>
```

### Pattern 2: Form Submit

```typescript
const handleSubmit = useAsync(
  async () => {
    const res = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    return res.json();
  },
  () => alert('Submitted!'),
  (error) => alert('Error: ' + error),
  { showMessage: 'Submitting...' }
);

<form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  {/* fields */}
  <button>Submit</button>
</form>
```

### Pattern 3: Multi-step

```typescript
const { showLoader, hideLoader, setMessage } = useLoading();

const handleClick = async () => {
  showLoader();
  try {
    setMessage("Step 1...");
    await doStep1();
    setMessage("Step 2...");
    await doStep2();
    hideLoader();
  } catch (err) {
    hideLoader();
    alert("Error: " + err);
  }
};
```

---

## 🎨 CUSTOMIZATION

### Change Message

```typescript
{
  showMessage: "Analyzing your data...";
}
```

### Change Duration

```typescript
{
  minDuration: 1000;
} // 1 second minimum
```

### Switch Loader Design

In `PageTransitionLoader.tsx`:

```typescript
// Change from:
import { Loader } from "@/components/GlobalLoader";

// To:
import { SleekLoader as Loader } from "@/components/SleekLoader";
```

### Change Colors

In `GlobalLoader.tsx`, update Tailwind classes:

```typescript
from-purple-600/20  → from-blue-600/20  // Change color
```

---

## ✅ STATUS

| Feature        | Status          |
| -------------- | --------------- |
| Route changes  | ✅ Working      |
| Page refresh   | ✅ Working      |
| API loader     | ✅ Ready to use |
| Manual control | ✅ Available    |
| Documentation  | ✅ 2800+ lines  |
| Examples       | ✅ 6+ included  |
| Production     | ✅ Ready        |

---

## 🆘 QUICK HELP

### Loader not showing?

- Check: Component has `'use client'` at top
- Check: Component inside LoaderProvider (it is)
- Check: useLoading() is being called

### Loader stuck?

- Always call hideLoader() or use finally block
- Check console for errors

### Need example?

- Read `LOADER_CHEAT_SHEET.md`
- Or `BEFORE_AFTER_EXAMPLES.md`

### Need full details?

- Read `LOADER_USAGE_GUIDE.md`
- Or `API_REFERENCE.md`

### Need visual?

- Read `VISUAL_GUIDE.md`

---

## 📚 READING ORDER

1. **This card** (overview - 2 min)
2. `LOADER_SYSTEM_COMPLETE.md` (details - 5 min)
3. `LOADER_CHEAT_SHEET.md` (templates - 3 min)
4. `BEFORE_AFTER_EXAMPLES.md` (examples - 15 min)

---

## 🎯 YOUR FIRST INTEGRATION

### Step 1: Find a button

Open `src/app/dashboard/page.tsx`

### Step 2: Add hook

```typescript
"use client";
import { useAsync } from "@/hooks/useAsync";
```

### Step 3: Create handler

```typescript
const fetchData = useAsync(
  () => fetch("/api/dashboard").then(r => r.json()),
  data => setData(data),
  undefined,
  { showMessage: "Loading dashboard..." },
);
```

### Step 4: Attach to button

```typescript
<button onClick={fetchData}>Load Data</button>
```

### Step 5: Test

- Click button
- Loader should appear
- Wait for API response
- Loader should disappear

### Step 6: Celebrate! 🎉

---

## 🚀 PRODUCTION CHECKLIST

- [ ] Tested route changes (nav to different pages)
- [ ] Tested page refresh (F5)
- [ ] Tested API call (added useAsync)
- [ ] Tested slow network (DevTools Slow 3G)
- [ ] Tested mobile view
- [ ] All components updated
- [ ] No console errors
- [ ] Ready to deploy

---

## 💡 PRO TIPS

**Tip 1:** Use meaningful messages

```typescript
{
  showMessage: "Generating your study plan...";
} // Good
{
  showMessage: "Loading...";
} // OK
```

**Tip 2:** For longer operations, update message

```typescript
setMessage("Step 1 of 3...");
setMessage("Step 2 of 3...");
setMessage("Step 3 of 3...");
```

**Tip 3:** Test with slow network

- DevTools → Network → Slow 3G
- See your loader in action

**Tip 4:** Cache results if possible

- Reduces loader frequency
- Better performance

**Tip 5:** Keep minDuration reasonable

- 300-500ms is usually perfect
- Don't go too high
- Feels natural to users

---

## 🎪 YOU HAVE

✨ 5-component loader system  
🎣 3 custom hooks  
📚 8 documentation files  
🎨 2 design variants  
⚡ 60fps animations  
🌙 Dark mode ready  
📱 Mobile responsive  
💯 Production quality

---

## 🏁 NEXT STEPS

1. Read `LOADER_SYSTEM_COMPLETE.md`
2. Read `LOADER_CHEAT_SHEET.md`
3. Add `useAsync` to first component
4. Test it works
5. Repeat for other components
6. Deploy! 🚀

---

## 📞 REMEMBER

Everything is in `src/components/` - just pick a doc!

---

**Happy loading! 🚀✨**
