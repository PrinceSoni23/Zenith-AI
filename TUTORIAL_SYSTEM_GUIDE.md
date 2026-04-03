# ✨ Component-Focused Tutorial System Guide

## Overview

This tutorial system provides **step-by-step guided tours** where each step highlights ONE specific button or component, explains what it does, and tells users how to use it.

Users click the blue help button (?) on any page to start a guided tour that walks through all the important components on that page.

---

## How It Works

### 1. **Tutorial Flow**

```
User clicks Help Button (blue ?)
         ↓
Tutorial starts with welcome message
         ↓
Each step highlights ONE specific component
         ↓
Tooltip explains: "This button does X. To use it..."
         ↓
User clicks NEXT to go to next component
         ↓
Tutorial end with celebration message
```

### 2. **Component Highlighting**

- Overlay covers entire page with accent
- ONE component is highlighted with a glowing border
- Tooltip appears next to highlighted component
- Smooth animations and transitions

### 3. **Visual Indicators**

- **Blue help button**: New tutorial available
- **Gray help button**: Tutorial already completed
- **Pulsing animation**: Attention-grabbing

---

## How to Add Component-Focused Tutorials

### Step 1: Add `data-tutorial` Attributes to Components

In your page JSX, add a `data-tutorial` attribute to each component you want to highlight:

```jsx
{
  /* ✅ CORRECT - Component with data attribute */
}
<button
  data-tutorial="generate-plan-button"
  onClick={generatePlan}
  className="btn-primary"
>
  Generate Plan
</button>;

{
  /* ✅ CORRECT - Wrapper div with data attribute */
}
<div data-tutorial="missions-section" className="...">
  <MissionsTile missions={missions} />
</div>;

{
  /* ❌ WRONG - No data attribute */
}
<button onClick={generatePlan} className="btn-primary">
  Generate Plan
</button>;
```

### Step 2: Define Tutorial Steps in `tutorialConfig.ts`

```typescript
myPage: {
  pageId: "my-page",
  pageName: "My Page",
  steps: [
    // Step 1: Introduction (no target = centered on screen)
    {
      id: "intro",
      title: "Welcome to My Page! 👋",
      description: "This page helps you do X. Let's learn about each feature!",
      position: "center",
    },

    // Step 2: First component (targets specific element)
    {
      id: "first-component",
      title: "🔵 First Button - Does This",
      description: "Click this button to [explain what it does]. Here's how to use it: [instructions].",
      target: "[data-tutorial='first-component']",  // ← Matches your data attribute!
      position: "bottom",                           // ← Where tooltip appears
      highlightPadding: 10,                         // ← Padding around highlight
    },

    // Step 3: Second component
    {
      id: "second-component",
      title: "🟢 Second Button - Does That",
      description: "Use this to [explain]. Try clicking it when [condition].",
      target: "[data-tutorial='second-component']",
      position: "right",
      highlightPadding: 12,
    },

    // Step 4+: More components...

    // Final step: Celebration (no target = centered)
    {
      id: "page-end",
      title: "🎉 You've Learned Everything! 🎓",
      description: "Now explore and use what you learned. Great job!",
      position: "center",
    },
  ],
}
```

### Step 3: Import and Use in Your Page

```jsx
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";

export default function MyPage() {
  return (
    <div className="...">
      {/* Header with help button */}
      <div className="flex items-center justify-between">
        <h1>My Page</h1>
        <HelpButton tutorial={dashboardTutorials.myPage} />
      </div>

      {/* Components with data-tutorial attributes */}
      <button data-tutorial="my-button" onClick={handleClick}>
        Click Me
      </button>
    </div>
  );
}
```

---

## Tutorial Step Configuration

Each step object has these properties:

```typescript
{
  id: "unique-id",                              // Unique ID for this step
  title: "🎯 Component Name - What It Does",   // Main title (use emoji)
  description: "Long description explaining what this component does and how to use it.",
  target: "[data-tutorial='component-name']",  // CSS selector for the component (optional)
  position: "bottom",                          // Tooltip position: "top", "bottom", "left", "right", "center"
  highlightPadding: 12,                        // Padding around highlight box (optional, default 8)
}
```

### Position Options:

- **"center"**: No target element, tooltip centered on screen (use for intro/outro)
- **"top"**: Tooltip above the element
- **"bottom"**: Tooltip below the element (most common)
- **"left"**: Tooltip to the left (for right-side components)
- **"right"**: Tooltip to the right (for left-side components)

---

## Best Practices

### ✅ DO:

1. **Use emojis in titles** - Makes tutorials more engaging 📚✨
2. **One component per step** - Clear focus and learning
3. **Explain what it does** - "This button generates a study plan"
4. **Explain how to use it** - "Click it to create a plan for today"
5. **Include action descriptions** - "Click NEXT to continue" or "Try clicking it now!"
6. **Name data attributes clearly** - `data-tutorial="generate-button"` not `data-tutorial="btn1"`
7. **Start with intro, end with celebration** - Good UX flow
8. **Add 4-8 steps per page** - Not too long, not too short

### ❌ DON'T:

1. ❌ Too many targets per page (users get confused)
2. ❌ Vague descriptions - Be specific!
3. ❌ Missing data attributes - Components won't be found
4. ❌ Bad CSS selectors - Double-check `[data-tutorial='...']` matches attribute
5. ❌ Inconsistent naming - Keep names lowercase with hyphens
6. ❌ Skip the intro/outro - Users need context

---

## Real Examples from Codebase

### Dashboard Example:

```jsx
// In page.tsx
<div className="flex items-center gap-2 flex-shrink-0">
  <HelpButton tutorial={dashboardTutorials.dashboard} data-tutorial="help-button" />
  <div data-tutorial="level-badge" className="...">
    {/* Level badge content */}
  </div>
</div>

<div data-tutorial="streak-hero">
  <StreakHero streakData={streakData} />
</div>

<div data-tutorial="missions-section">
  <MissionsTile missions={missions} />
</div>

// In tutorialConfig.ts
{
  id: "help-button",
  title: "🆘 Help Button - Your Guide",
  description:
    "This blue button (?) shows tutorials like this one! Click it anytime to learn about the current page.",
  target: "[data-tutorial='help-button']",
  position: "left",
  highlightPadding: 8,
},
```

### Study Planner Example:

```jsx
// In page.tsx
<button
  onClick={generatePlan}
  data-tutorial="generate-plan-button"
  className="btn-primary"
>
  Generate Plan
</button>

<div data-tutorial="plan-results">
  {result && <YourResults />}
</div>

// In tutorialConfig.ts
{
  id: "generate-button",
  title: "✨ Generate Plan Button",
  description:
    "Click this button to create your AI-powered study plan for today.
     The AI will suggest tasks with time estimates.",
  target: "[data-tutorial='generate-plan-button']",
  position: "bottom",
  highlightPadding: 10,
},
```

---

## Tutorial Lifecycle

### 1. **Initial State**

- Help button is BLUE with pulsing animation
- Indicates a tutorial is available for this page

### 2. **During Tutorial**

- Page darkens with overlay
- One component highlights with glowing border
- Tooltip appears with step information
- User can: NEXT, BACK, SKIP buttons

### 3. **Completion**

- User clicks DONE on final step
- Confetti animation! 🎉
- Victory animation with celebration message
- Tutorial marked as COMPLETED
- Help button turns GRAY

### 4. **After Completion**

- Help button remains GRAY
- User can still restart anytime (button still clickable)
- Tutorial progress saved in localStorage

---

## Adding Tutorial to a New Page

### Quick Checklist:

- [ ] Import HelpButton component
- [ ] Import dashboardTutorials from config
- [ ] Add HelpButton to page header with tutorial prop
- [ ] Add `data-tutorial` attributes to key components
- [ ] Define tutorial steps in `tutorialConfig.ts`
- [ ] Test tutorial: click help button, go through all steps
- [ ] Verify: all targets found, smooth highlighting, good UX

### Example: Adding tutorial to "New Feature Page"

```jsx
// 1. In new-feature/page.tsx
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";

export default function NewFeaturePage() {
  return (
    <div className="...">
      <div className="flex justify-between">
        <h1>New Feature</h1>
        <HelpButton tutorial={dashboardTutorials.newFeature} />  {/* ← Add this */}
      </div>

      <button data-tutorial="main-button">Main Action</button>  {/* ← Add attributes */}
      <div data-tutorial="content">Content Area</div>
    </div>
  );
}

// 2. In tutorialConfig.ts - Add this object:
newFeature: {
  pageId: "new-feature",
  pageName: "New Feature",
  steps: [
    {
      id: "intro",
      title: "Welcome to New Feature! 🚀",
      description: "This page helps you do something awesome. Let's learn!",
      position: "center",
    },
    {
      id: "main-button",
      title: "🔵 Main Action Button",
      description: "Click this to perform the main action. Here's how to use it...",
      target: "[data-tutorial='main-button']",
      position: "bottom",
      highlightPadding: 10,
    },
    // ... more steps
  ],
}
```

---

## Troubleshooting

### Problem: Step doesn't highlight anything

**Solution:** Check that `target` CSS selector matches your `data-tutorial` attribute exactly.

```jsx
// ✓ Correct match
<button data-tutorial="my-button">Click</button>
// Target: "[data-tutorial='my-button']"

// ✗ Wrong - selector doesn't match
<button data-tutorial="myButton">Click</button>
// Target: "[data-tutorial='my_button']"  // ← Won't find it!
```

### Problem: Help button not showing

**Solution:** Ensure you imported both components correctly.

```jsx
// Must be present in page:
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";

// And used in JSX:
<HelpButton tutorial={dashboardTutorials.yourPage} />;
```

### Problem: Tutorial not completing or confetti not showing

**Solution:** Make sure final step has NO target (centered position).

```jsx
{
  id: "page-end",
  title: "🎉 Done!",
  description: "You completed the tutorial!",
  position: "center",  // ← No target = centered
}
```

---

## Summary

This tutorial system provides:
✅ **Component-focused learning** - One button/feature per step
✅ **Interactive highlighting** - Shows exactly what you're learning
✅ **Clear explanations** - What it does, how to use it
✅ **Beautiful animations** - Engagement & celebration
✅ **Progress tracking** - Know what you've learned
✅ **Easy to implement** - Just add data attributes!

Users get a guided tour through each page, learning features systematically. Perfect for onboarding! 🎓
