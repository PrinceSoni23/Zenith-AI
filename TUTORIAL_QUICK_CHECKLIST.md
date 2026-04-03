# Tutorial Integration Checklist - Quick Reference

Use this checklist to quickly add the help button to each remaining dashboard page.

## ✅ Already Completed Pages

- [x] Study Planner
- [x] Maths Helper
- [x] Revision
- [x] Mentor
- [x] Smart Notes

## ⏳ Remaining Pages to Integrate

### Question Generator

**Path:** `/dashboard/question-generator/page.tsx`

Steps:

1. [ ] Add imports:

```tsx
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";
```

2. [ ] Find header section (usually around top of JSX return)
3. [ ] Modify header to add HelpButton on right:

```tsx
<div className="flex justify-between items-center">
  <div>{/* title and icon */}</div>
  <div className="flex gap-3">
    <HelpButton tutorial={dashboardTutorials.questionGenerator} />
    {/* existing button */}
  </div>
</div>
```

### Leaderboard

**Path:** `/dashboard/leaderboard/page.tsx`

Steps:

1. [ ] Add imports
2. [ ] Locate page header
3. [ ] Add HelpButton with `dashboardTutorials.leaderboard`

### Power Hour

**Path:** `/dashboard/power-hour/page.tsx`

Steps:

1. [ ] Add imports
2. [ ] Locate page header
3. [ ] Add HelpButton with `dashboardTutorials.powerHour`

### Class Translator

**Path:** `/dashboard/class-translator/page.tsx`

Steps:

1. [ ] Add imports
2. [ ] Locate page header
3. [ ] Add HelpButton with `dashboardTutorials.classTranslator`

### Writing Coach

**Path:** `/dashboard/writing-coach/page.tsx`

Steps:

1. [ ] Add imports
2. [ ] Locate page header
3. [ ] Add HelpButton with `dashboardTutorials.writingCoach`

### Profile

**Path:** `/dashboard/profile/page.tsx`

Steps:

1. [ ] Add imports
2. [ ] Locate page header
3. [ ] Add HelpButton with `dashboardTutorials.profile`

### Story Mode

**Path:** `/dashboard/story-mode/page.tsx`

Steps:

1. [ ] Add imports
2. [ ] Locate page header
3. [ ] Add HelpButton with `dashboardTutorials.storyMode`

### Monitoring/Analytics

**Path:** `/dashboard/monitoring/page.tsx`

Steps:

1. [ ] Add imports
2. [ ] Locate page header
3. [ ] Add HelpButton with `dashboardTutorials.monitoring`

### Dashboard Main

**Path:** `/dashboard/page.tsx`

Steps:

1. [ ] Add imports
2. [ ] Locate page header (find title section)
3. [ ] Add HelpButton with `dashboardTutorials.dashboard`

## Integration Pattern (Copy & Paste Ready)

**STEP 1 - Add to imports section:**

```tsx
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";
```

**STEP 2 - Change header layout from:**

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-4">{/* icon and title */}</div>
  <button>Action</button>
</div>
```

**TO:**

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-4">{/* icon and title */}</div>
  <div className="flex items-center gap-3">
    <HelpButton tutorial={dashboardTutorials.yourPageKey} />
    <button>Action</button>
  </div>
</div>
```

**STEP 3 - Replace `yourPageKey` with correct key from list below**

## Tutorial Keys Reference

Copy the correct key for your page:

```
dashboardTutorials.dashboard           // Main dashboard
dashboardTutorials.studyPlanner        // ✅ DONE
dashboardTutorials.smartNotes          // ✅ DONE
dashboardTutorials.mathsHelper         // ✅ DONE
dashboardTutorials.questionGenerator   // TODO
dashboardTutorials.leaderboard         // TODO
dashboardTutorials.powerHour           // TODO
dashboardTutorials.revision            // ✅ DONE
dashboardTutorials.classTranslator     // TODO
dashboardTutorials.writingCoach        // TODO
dashboardTutorials.profile             // TODO
dashboardTutorials.mentor              // ✅ DONE
dashboardTutorials.storyMode           // TODO
dashboardTutorials.monitoring          // TODO
```

## Time Estimate

- Per page: 2-3 minutes
- All 9 remaining pages: 20-30 minutes total

## Verification Steps

After adding HelpButton to each page:

1. [ ] Page loads without errors
2. [ ] Help button appears in top-right corner
3. [ ] Button is blue (first time) or gray (after completion)
4. [ ] Click button - tutorial starts
5. [ ] Tutorial steps display correctly
6. [ ] Next button moves through steps
7. [ ] Done button closes tutorial
8. [ ] Refresh page - button now shows as completed (gray)

## Common Issues & Fixes

**"Cannot find module 'Tutorial/HelpButton'"**

- Fix: Make sure path is `@/components/Tutorial/HelpButton`
- Check file exists: `/src/components/Tutorial/HelpButton.tsx`

**Help button doesn't appear**

- Fix: Make sure it's inside the JSX return block
- Check flex container around it has correct classes
- Verify z-index isn't being overridden

**Imports show as unused**

- If using strict ESLint: That's normal, just ignore the warning
- HelpButton component will be used when page renders

**Tutorial doesn't start when clicking**

- Check: Is TutorialProvider in RootLayoutWrapper?
- Check: Browser console for JavaScript errors
- Try: Hard refresh (Ctrl+F5 or Cmd+Shift+R)

## Done!

Once all pages have the HelpButton:

- [ ] All 14 pages have tutorial buttons
- [ ] Each button shows correct tutorial content
- [ ] Users can access tutorials from all pages
- [ ] Tutorial system is complete ✅

---

## Notes for Team

This tutorial system:

- Works in light and dark modes
- Is fully localized (respects language settings)
- Saves completion state to localStorage
- Works on mobile, tablet, desktop
- Has zero external dependencies beyond what's already used

Users will appreciate:

- Clear guidance on what each page does
- Better onboarding for new features
- Self-service help reduces support tickets
- Professional presentation of your product
