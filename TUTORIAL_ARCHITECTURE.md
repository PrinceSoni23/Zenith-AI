# Tutorial System Architecture & Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Application Root                             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              layout.tsx (Root Layout)                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           RootLayoutWrapper                                  │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │ LanguageProvider                                    │   │  │
│  │  │                                                     │   │  │
│  │  │  ┌──────────────────────────────────────────────┐  │   │  │
│  │  │  │ LoaderProvider                               │  │   │  │
│  │  │  │                                              │  │   │  │
│  │  │  │  ┌────────────────────────────────────────┐ │   │  │
│  │  │  │  │ ★ TutorialProvider ★                  │ │   │  │
│  │  │  │  │                                        │ │   │  │
│  │  │  │  │ Manages:                               │ │   │  │
│  │  │  │  │ • activeTutorial state                │ │   │  │
│  │  │  │  │ • currentStepIndex                    │ │   │  │
│  │  │  │  │ • completedTutorials (Set)            │ │   │  │
│  │  │  │  │ • Tutorial lifecycle methods          │ │   │  │
│  │  │  │  │                                        │ │   │  │
│  │  │  │  │ Provides: useTutorial() hook          │ │   │  │
│  │  │  │  │                                        │ │   │  │
│  │  │  │  │ ┌────────────────────────────────────┐│   │  │
│  │  │  │  │ │ GlobalClickInterceptor             ││   │  │
│  │  │  │  │ └────────────────────────────────────┘│   │  │
│  │  │  │  │ ┌────────────────────────────────────┐│   │  │
│  │  │  │  │ │ PageTransitionLoader               ││   │  │
│  │  │  │  │ └────────────────────────────────────┘│   │  │
│  │  │  │  │ ┌────────────────────────────────────┐│   │  │
│  │  │  │  │ │ ★ TutorialOverlay ★                ││   │  │
│  │  │  │  │ │ (Renders globally when needed)    ││   │  │
│  │  │  │  │ └────────────────────────────────────┘│   │  │
│  │  │  │  │ ┌────────────────────────────────────┐│   │  │
│  │  │  │  │ │ {children} - All pages             ││   │  │
│  │  │  │  │ │                                    ││   │  │
│  │  │  │  │ │ Each Dashboard Page:               ││   │  │
│  │  │  │  │ │ • Imports HelpButton               ││   │  │
│  │  │  │  │ │ • Imports dashboardTutorials       ││   │  │
│  │  │  │  │ │ • Uses useTutorial() if needed    ││   │  │
│  │  │  │  │ │ • Renders HelpButton in header    ││   │  │
│  │  │  │  │ │                                    ││   │  │
│  │  │  │  │ │ Example Page Flow:                 ││   │  │
│  │  │  │  │ │ 1. Component renders              ││   │  │
│  │  │  │  │ │ 2. User clicks HelpButton         ││   │  │
│  │  │  │  │ │ 3. startTutorial(config) called  ││   │  │
│  │  │  │  │ │ 4. TutorialContext updates state ││   │  │
│  │  │  │  │ │ 5. TutorialOverlay reads state   ││   │  │
│  │  │  │  │ │ 6. Overlay renders with tutorial ││   │  │
│  │  │  │  │ │                                    ││   │  │
│  │  │  │  │ └────────────────────────────────────┘│   │  │
│  │  │  │  └────────────────────────────────────┘   │   │  │
│  │  │  └──────────────────────────────────────────┘   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Interaction Flow

```
User clicks HelpButton
        ↓
HelpButton calls startTutorial(tutorial)
        ↓
TutorialContext.startTutorial() updates state
        ↓
- activeTutorial = tutorial config
- currentStepIndex = 0
- isOpen = true
        ↓
TutorialOverlay component re-renders
        ↓
Overlay reads from context and displays:
- Backdrop with semi-transparency
- Element highlight (if target selector)
- Tooltip with step content
- Navigation buttons
```

### 2. Navigation Flow

```
User clicks "Next" button
        ↓
TutorialOverlay calls nextStep()
        ↓
TutorialContext.nextStep() logic:
- Is there a next step? → currentStepIndex++
- Is this the last step? → endTutorial()
        ↓
TutorialOverlay detects step change
        ↓
Updates element position calculation
Renders new step content
Smooth animation to new tooltip
```

### 3. Completion Flow

```
User clicks "Done" on last step
        ↓
TutorialOverlay calls nextStep()
        ↓
nextStep() detects this is last step
        ↓
Calls endTutorial()
        ↓
TutorialContext.endTutorial():
- Marks tutorial complete (localStorage + state)
- Sets isOpen = false
- Resets currentStepIndex to 0
        ↓
TutorialOverlay unmounts (isOpen = false)
        ↓
HelpButton renders as "completed" (gray color)
```

## Component Interactions

### TutorialContext.tsx

```typescript
Provides:
├── activeTutorial: PageTutorial | null
├── currentStepIndex: number
├── isOpen: boolean
├── completedTutorials: Set<string>
│
└── Methods:
    ├── startTutorial(tutorial)
    ├── nextStep()
    ├── previousStep()
    ├── endTutorial()
    ├── skipTutorial()
    ├── markTutorialAsCompleted(pageId)
    └── isTutorialCompleted(pageId)

Used by: Any component via useTutorial() hook
```

### HelpButton.tsx

```typescript
Receives:
├── tutorial: PageTutorial
├── className?: string

Uses:
├── useTutorial() → { startTutorial, isTutorialCompleted }
│
Renders:
├── Clickable button element
├── Help icon
├── Blue pulsing animation (if not completed)
├── Gray appearance (if completed)
└── Pulse badge indicator

On Click → Calls startTutorial(tutorial)
```

### TutorialOverlay.tsx

```typescript
Uses:
├── useTutorial() → {
│   ├── activeTutorial
│   ├── currentStepIndex
│   ├── isOpen
│   ├── nextStep
│   ├── previousStep
│   ├── endTutorial
│   └── skipTutorial
│
└── Renders (only if isOpen = true):
    ├── Backdrop overlay
    ├── Element highlight + glow
    ├── Smart-positioned tooltip
    ├── Step content (title, description)
    ├── Progress bar
    └── Navigation buttons

Calculates:
├── Element position from DOM
├── Tooltip position (smart placement)
├── Progress percentage
└── Button states (enabled/disabled)
```

### tutorialConfig.ts

```typescript
Provides:
├── dashboardTutorials: Dictionary of PageTutorial objects
│
└── Each PageTutorial contains:
    ├── pageId: unique identifier
    ├── pageName: display name
    └── steps: Array of TutorialStep objects
        ├── Each step has:
        │   ├── id: unique step ID
        │   ├── title: heading
        │   ├── description: explanation
        │   ├── target?: CSS selector (optional)
        │   ├── position?: "top"|"bottom"|"left"|"right"|"center"
        │   └── highlightPadding?: number

Consumed by: HelpButton component
```

## State Management

### Context State

```
TutorialContext
│
├─ activeTutorial: PageTutorial | null
│  └─ Reference to current tutorial config
│
├─ currentStepIndex: number
│  └─ Which step (0-indexed) is being displayed
│
├─ isOpen: boolean
│  └─ Is overlay visible?
│
├─ completedTutorials: Set<string>
│  └─ Set of completed tutorial pageIds
│
└─ localStorage persistence
   └─ tutorial_completed_{pageId} = "true"
```

## Component Integration Pattern

Each dashboard page follows this pattern:

```typescript
// 1. IMPORTS
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";

// 2. COMPONENT
export default function PageComponent() {
  return (
    <div>
      {/* 3. HEADER WITH HELP BUTTON */}
      <div className="flex justify-between items-center">
        <h1>Page Title</h1>
        <div className="flex gap-3">
          {/* Help button triggered here */}
          <HelpButton tutorial={dashboardTutorials.pageKey} />

          {/* Can also use useTutorial() for manual control */}
          {/* const { startTutorial } = useTutorial(); */}
        </div>
      </div>

      {/* 4. PAGE CONTENT */}
      <div data-tutorial="section-id">
        {/* Content that can be highlighted in tutorial */}
      </div>
    </div>
  );
}
```

## Tutorial Step Execution

For each step:

```
┌─ Step Rendered ─────────────────────────────────────┐
│                                                      │
│ 1. Calculate element position                       │
│    └─ If target selector exists, find element      │
│    └─ Get rect, convert to window coordinates      │
│                                                      │
│ 2. Determine tooltip position                       │
│    └─ Based on step.position config                │
│    └─ Calculate offset from element                │
│    └─ Ensure tooltip stays in viewport             │
│                                                      │
│ 3. Render overlay layers                           │
│    ├─ Semi-transparent backdrop                    │
│    ├─ Element highlight box (if target)           │
│    └─ Glow effect around highlight                │
│                                                      │
│ 4. Render tooltip                                  │
│    ├─ Step counter badge                          │
│    ├─ Title and description                       │
│    ├─ Progress bar                                │
│    └─ Navigation buttons                          │
│                                                      │
│ 5. Handle user interactions                        │
│    ├─ Click backdrop → endTutorial()              │
│    ├─ Click next → nextStep()                     │
│    ├─ Click back → previousStep()                 │
│    └─ Click skip → skipTutorial()                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Performance Considerations

### Why Context?

- ✅ Global state without prop drilling
- ✅ Efficient re-rendering (only TutorialOverlay re-renders on step change)
- ✅ Best practice for shared state in React

### Re-render Optimization

- TutorialOverlay is memoized-friendly
- Only re-renders when context values change
- useEffect only updates on target selector change
- Smooth animations don't cause unnecessary re-renders

### Memory Usage

- completedTutorials is a Set (O(1) lookup)
- Tutorial configs are static (not recreated)
- localStorage used for persistence (no extra memory)

## Accessibility

### Keyboard Support

```
Escape → Close overlay
Tab → Navigate buttons
Enter → Click focused button
Space → Toggle focused button
```

### ARIA Labels

```
HelpButton: aria-label="Help and tutorial"
Tooltip: Semantic structure with headings
Buttons: Clear labels for states
```

### Visual Accessibility

- High contrast colors
- Clear button states
- Readable font sizes
- Animation respects prefers-reduced-motion

## Mobile Responsiveness

### Screen Size Adaptations

```
Desktop (1024px+):
├─ Fixed-size tooltip (320px max)
├─ Full highlight padding
└─ Smooth animations

Tablet (640px+):
├─ Responsive tooltip width
├─ Adjusted highlight padding
└─ Touch-friendly spacing

Mobile (<640px):
├─ Full-width center tooltip
├─ Maximum padding for visibility
├─ Larger touch targets
└─ Simplified animations
```

## Browser Compatibility

### Supported

- ✅ Chrome/Edge 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ✅ Mobile Safari 14+
- ✅ Chrome Android

### Uses Standard APIs

- document.querySelector() - Element selection
- getBoundingClientRect() - Position calculation
- localStorage - Persistence
- CSS transforms - Positioning
- Tailwind CSS - Styling

## Future Enhancement Ideas

```
Potential additions:
├─ Video tutorials within steps
├─ Auto-play tutorials on first visit
├─ Analytics integration (track completion rates)
├─ A/B testing different tutorial flows
├─ Guided product tours across multiple pages
├─ Conditional steps based on user state
├─ Repeat tutorial button in settings
├─ Keyboard shortcut to start tutorial
└─ Tutorial hint system on hover
```

## Summary

The tutorial system is:

🎯 **Well-structured** - Clean separation of concerns
🎨 **Maintainable** - Easy to add new tutorials
⚡ **Performant** - Efficient state management
♿ **Accessible** - Keyboard and screen reader support
📱 **Responsive** - Works on all screen sizes
🔐 **Type-safe** - Full TypeScript support
📦 **Self-contained** - No external dependencies

Ready for production use on all 14 dashboard pages!
