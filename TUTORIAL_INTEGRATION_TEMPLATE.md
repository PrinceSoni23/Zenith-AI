# Tutorial Integration Template

This shows the exact pattern to add a tutorial help button to any dashboard page.

## Step 1: Add Imports at Top of File

```tsx
// Existing imports...
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";
```

## Step 2: Add HelpButton to Page Header

Replace your simple header button layout with this pattern:

### BEFORE (without tutorial):

```tsx
<div className="mb-8 flex items-center justify-between">
  <div className="flex items-center gap-4">{/* Title and icon */}</div>
  <button onClick={handleAction} className="btn-primary">
    Action Button
  </button>
</div>
```

### AFTER (with tutorial):

```tsx
<div className="mb-8 flex items-center justify-between">
  <div className="flex items-center gap-4">{/* Title and icon */}</div>
  <div className="flex items-center gap-3">
    <HelpButton tutorial={dashboardTutorials.yourPageKey} />
    <button onClick={handleAction} className="btn-primary">
      Action Button
    </button>
  </div>
</div>
```

## Step 3: Mark Key Elements with data-tutorial Attributes

```tsx
{
  /* Important section */
}
<div data-tutorial="element-id">{/* content */}</div>;

{
  /* Important button */
}
<button data-tutorial="button-id">Click Me</button>;
```

### Example in Context:

```tsx
{
  /* Input section */
}
<textarea
  data-tutorial="problem-input"
  placeholder="Enter your math problem..."
/>;

{
  /* Solve button */
}
<button
  data-tutorial="solve-btn"
  onClick={solveProblem}
  className="btn-primary"
>
  Solve
</button>;

{
  /* Solution display */
}
<div data-tutorial="solution-output">
  {solution && <Solution {...solution} />}
</div>;
```

## Available Page Tutorial Keys

Use these exact keys when adding HelpButton:

```tsx
dashboardTutorials.dashboard; // Main dashboard
dashboardTutorials.studyPlanner; // Study Planner ✅
dashboardTutorials.smartNotes; // Smart Notes
dashboardTutorials.mathsHelper; // Maths Helper
dashboardTutorials.questionGenerator; // Question Generator
dashboardTutorials.leaderboard; // Leaderboard
dashboardTutorials.powerHour; // Power Hour
dashboardTutorials.revision; // Revision
dashboardTutorials.classTranslator; // Class Translator
dashboardTutorials.writingCoach; // Writing Coach
dashboardTutorials.profile; // Profile
dashboardTutorials.mentor; // Mentor
dashboardTutorials.storyMode; // Story Mode
dashboardTutorials.monitoring; // Learning Analytics
```

## Minimal Working Example

```tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";

export default function ExamplePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleProcess = async () => {
    // Do something
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          {/* Header with Help Button */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Your Page Title</h1>
            </div>
            <div className="flex items-center gap-3">
              <HelpButton tutorial={dashboardTutorials.yourPageKey} />
              <button onClick={handleProcess} className="btn-primary">
                Action
              </button>
            </div>
          </div>

          {/* Content sections with data-tutorial markers */}
          <div data-tutorial="input-area">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Input here..."
            />
          </div>

          {result && <div data-tutorial="output-area">{/* Results */}</div>}
        </div>
      </main>
    </div>
  );
}
```

## Adding Tutorial Content

Edit `/frontend/src/config/tutorialConfig.ts`:

```tsx
export const dashboardTutorials: Record<string, PageTutorial> = {
  // ... existing tutorials ...

  yourPageKey: {
    pageId: "your-page-id",
    pageName: "Your Page Name",
    steps: [
      {
        id: "welcome",
        title: "Welcome! 👋",
        description:
          "This page helps you do X and Y. Let's learn how to use it.",
        position: "center",
      },
      {
        id: "input-step",
        title: "Enter Your Data",
        description:
          "Type or paste your data here. The system will process it automatically.",
        target: "[data-tutorial='input-area']",
        position: "bottom",
        highlightPadding: 8,
      },
      {
        id: "button-step",
        title: "Process",
        description: "Click this button to process your data.",
        target: "[data-tutorial='process-btn']",
        position: "bottom",
        highlightPadding: 8,
      },
      {
        id: "result-step",
        title: "View Results",
        description: "Your results will appear here with detailed analysis.",
        target: "[data-tutorial='output-area']",
        position: "top",
        highlightPadding: 8,
      },
    ],
  },
};
```

## Position Guide

Choose the best position for the tooltip based on screen space:

- **"center"** - Floating in the middle of the screen (usually for welcome/overview steps)
- **"top"** - Above the element (good for elements near bottom of page)
- **"bottom"** - Below the element (good for title/header elements)
- **"left"** - To the left of element (good for right-side elements)
- **"right"** - To the right of element (good for left-side elements)

## Styling Tips

- Use **consistent gap sizes**: `gap-3` between help button and main button
- **Button width**: Help button is `p-2.5` (compact), main buttons are larger
- **Alignment**: Use `items-center` to vertically align help icon with text
- **Z-index**: Don't worry about it - overlay handles stacking

## Common Patterns

### Page with Form

```tsx
<div className="flex items-center justify-between mb-8">
  <h1>Form Title</h1>
  <div className="flex gap-3">
    <HelpButton tutorial={dashboardTutorials.yourPage} />
    <button className="btn-primary">Submit</button>
  </div>
</div>
```

### Page with Multiple Actions

```tsx
<div className="flex items-center justify-between mb-8">
  <h1>Page Title</h1>
  <div className="flex gap-2 items-center">
    <HelpButton tutorial={dashboardTutorials.yourPage} />
    <button className="btn-secondary">Cancel</button>
    <button className="btn-primary">Save</button>
  </div>
</div>
```

### Page with Filters

```tsx
<div className="flex items-center justify-between mb-8">
  <h1>Results</h1>
  <div className="flex gap-3 items-center">
    <HelpButton tutorial={dashboardTutorials.yourPage} />
    <select className="input-select">{/* filters */}</select>
    <button className="btn-primary">Go</button>
  </div>
</div>
```
