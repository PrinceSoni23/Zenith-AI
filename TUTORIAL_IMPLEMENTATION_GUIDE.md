# Tutorial System Implementation Guide

## Overview

The tutorial system provides interactive guided tours for each dashboard page. Users see a help button in the top-right and can click to start a tutorial explaining the page.

## Quick Start - Add Tutorial to Any Dashboard Page

### 1. **Import Components**

```tsx
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";
```

### 2. **Add Help Button to Page Header**

Place the `HelpButton` component in your page header, typically in the top-right:

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    {/* Your icon and title here */}
  </div>

  <div className="flex items-center gap-3">
    <HelpButton tutorial={dashboardTutorials.yourPageKey} />
    {/* Other buttons */}
  </div>
</div>
```

### 3. **Add Tutorial Content**

Edit `/frontend/src/config/tutorialConfig.ts` and add your page's tutorial:

```tsx
export const dashboardTutorials: Record<string, PageTutorial> = {
  yourPageKey: {
    pageId: "your-page-id",
    pageName: "Your Page Name",
    steps: [
      {
        id: "step1",
        title: "Step Title",
        description: "What the user should know about this section",
        target: "[data-tutorial='element-id']", // CSS selector
        position: "bottom",
        highlightPadding: 8,
      },
      // ... more steps
    ],
  },
};
```

### 4. **Add Data Attributes to Elements**

Mark important elements that should be highlighted:

```tsx
<button data-tutorial="your-button-id">Click Me</button>
```

## Available Tutorial Properties

### PageTutorial

- `pageId` - Unique identifier (used to track completion)
- `pageName` - Display name shown in tutorial
- `steps` - Array of tutorial steps

### TutorialStep

- `id` - Unique step identifier
- `title` - Step heading
- `description` - Explanation text
- `target` - CSS selector for element to highlight (optional)
- `position` - Tooltip position: "top", "bottom", "left", "right", "center"
- `highlightPadding` - Extra padding around highlighted element (default: 8)

## Usage Examples

### Example 1: Simple Page Tutorial

```tsx
const mathsHelperTutorial: PageTutorial = {
  pageId: "maths-helper",
  pageName: "Maths Helper",
  steps: [
    {
      id: "welcome",
      title: "Welcome!",
      description: "Upload a math problem to get step-by-step solutions",
      position: "center",
    },
    {
      id: "upload",
      title: "Upload Problem",
      description: "Click here to take a photo or upload an image",
      target: "[data-tutorial='upload-btn']",
      position: "bottom",
    },
  ],
};
```

### Example 2: Page with Multiple Sections to Highlight

```tsx
const leaderboardTutorial: PageTutorial = {
  pageId: "leaderboard",
  pageName: "Leaderboard",
  steps: [
    {
      id: "your-rank",
      title: "Your Position",
      description: "See where you rank",
      target: "[data-tutorial='your-rank']",
      position: "right",
      highlightPadding: 12,
    },
    {
      id: "top-students",
      title: "Top Performers",
      description: "Learn from the best students",
      target: "[data-tutorial='top-students']",
      position: "top",
    },
  ],
};
```

## Available Tutorials

Already configured tutorials:

1. **Dashboard** - `dashboardTutorials.dashboard`
2. **Study Planner** - `dashboardTutorials.studyPlanner` ✅ Already integrated
3. **Smart Notes** - `dashboardTutorials.smartNotes`
4. **Maths Helper** - `dashboardTutorials.mathsHelper`
5. **Question Generator** - `dashboardTutorials.questionGenerator`
6. **Leaderboard** - `dashboardTutorials.leaderboard`
7. **Power Hour** - `dashboardTutorials.powerHour`
8. **Revision** - `dashboardTutorials.revision`
9. **Class Translator** - `dashboardTutorials.classTranslator`
10. **Writing Coach** - `dashboardTutorials.writingCoach`
11. **Profile** - `dashboardTutorials.profile`
12. **Mentor** - `dashboardTutorials.mentor`
13. **Story Mode** - `dashboardTutorials.storyMode`
14. **Learning Analytics** - `dashboardTutorials.monitoring`

## Features

### Help Button Styling

- ✨ Blue highlighted when tutorial NOT completed
- 📌 Pulsing animation for new tutorials
- ✅ Grayed out after tutorial is completed
- 🔔 Small indicator badge

### Tutorial Overlay

- 🎯 Smooth element highlighting with glow effect
- 📍 Smart positioning (auto-adjusts if near screen edge)
- 🎨 Next/Back/Skip/Done buttons
- 📊 Progress bar showing current step
- ⌨️ Keyboard support (Escape to close)
- 📱 Responsive on mobile

### Persistence

- Completed tutorials are saved to localStorage
- Users can retake tutorials anytime by clicking help button
- Tracks completion per page

## Styling Customization

### Dark Mode Support

All components support light and dark themes automatically via Tailwind.

### Color Customization

Edit colors in `TutorialOverlay.tsx`:

- Primary: `blue-500` / `blue-600`
- Success: `green-500` / `green-600`
- Highlight: `blue-500` (border)

## Integration Points

### TutorialContext Methods

Available in any component via `useTutorial()`:

```tsx
const {
  startTutorial, // Start a tutorial
  nextStep, // Go to next step
  previousStep, // Go to previous step
  endTutorial, // Close tutorial
  skipTutorial, // Skip and mark complete
  isTutorialCompleted, // Check if completed
  markTutorialAsCompleted, // Mark as done
} = useTutorial();
```

## Next Steps

1. ✅ Go through existing pages and add HelpButton to each
2. ✅ Add `data-tutorial` attributes to important elements
3. ✅ Test tutorials on different screen sizes
4. ✅ Consider auto-starting tutorials for first-time users
5. ✅ Add analytics to track tutorial completion rates

## Troubleshooting

### Tutorial not showing?

- Check that `TutorialProvider` is in `RootLayoutWrapper.tsx`
- Verify tutorial config has correct keys
- Check browser console for errors

### Element not highlighting?

- Verify `data-tutorial` attribute matches selector in config
- Check CSS selector is valid
- Ensure element is visible on page

### Styles not applying?

- Check Tailwind classes are available
- Verify dark mode classes are correct
- Check z-index conflicts with other components

## Examples in Codebase

- Study Planner: `/app/dashboard/study-planner/page.tsx` - Complete example
- Tutorial Config: `/config/tutorialConfig.ts` - All tutorial definitions
- Context: `/context/TutorialContext.tsx` - State management
- Components: `/components/Tutorial/` - Reusable components
