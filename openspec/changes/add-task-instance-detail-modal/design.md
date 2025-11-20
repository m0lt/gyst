# Design Document: Task Instance Detail Modal

## Overview

This document outlines the architectural design and implementation approach for the Task Instance Detail Modal feature.

## Architecture

### Component Structure

```
TaskInstanceDetailModal (New)
├── Header
│   ├── Task Title
│   ├── Category Badge
│   └── Close Button
├── Main Content (Scrollable)
│   ├── Task Image Section
│   │   └── AI-generated image or placeholder
│   ├── Schedule Information
│   │   ├── Date and Time
│   │   ├── Duration (estimated/scheduled)
│   │   └── Priority Badge
│   ├── Description Section
│   │   └── Task description text
│   ├── Subtasks Section (if applicable)
│   │   ├── Progress Bar
│   │   └── Subtask List (read-only checkboxes)
│   └── Completion Info Section (if completed)
│       ├── Completion Timestamp
│       ├── Mood Display
│       ├── Actual Time Taken
│       ├── Completion Photo
│       └── Completion Notes
└── Footer (Fixed)
    ├── Primary Actions
    │   ├── Complete Button
    │   └── Reschedule Button
    └── Secondary Actions
        ├── Skip Button
        └── Edit Template Button
```

### Data Flow

```
Calendar/Todo View
    ↓ (user clicks task)
TaskInstanceDetailModal
    ↓ (receives TaskInstance data)
Display Information
    ↓ (user clicks action button)
    ├── Complete → CompleteTaskModal
    ├── Reschedule → RescheduleTaskModal
    ├── Skip → Confirmation + skipTaskInstance()
    └── Edit Template → TaskFormModal
    ↓ (action completes)
onSuccess callback
    ↓
Parent view refreshes
```

## Component Interface

### Props

```typescript
interface TaskInstanceDetailModalProps {
  instance: TaskInstance & {
    task?: {
      title: string;
      description?: string;
      ai_image_url?: string;
      ai_image_prompt?: string;
      estimated_minutes?: number;
      scheduled_duration?: number;
      priority: "low" | "medium" | "high";
      category?: {
        name: string;
        color: string;
        icon: string;
      };
      task_subtasks?: Array<{
        id: string;
        title: string;
        is_required: boolean;
        sort_order: number;
      }>;
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
```

### State Management

```typescript
const [showCompleteModal, setShowCompleteModal] = useState(false);
const [showRescheduleModal, setShowRescheduleModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [isSkipping, setIsSkipping] = useState(false);
```

## Integration Points

### 1. Calendar Day View (`components/calendar/day-view.tsx`)

**Current Behavior:**
```typescript
const handleTaskClick = (task: TaskInstance) => {
  setSelectedTask(task);
  setIsModalOpen(true); // Opens TaskFormModal
};
```

**New Behavior:**
```typescript
const [selectedInstance, setSelectedInstance] = useState<TaskInstance | null>(null);
const [showDetailModal, setShowDetailModal] = useState(false);

const handleTaskClick = (task: TaskInstance) => {
  setSelectedInstance(task);
  setShowDetailModal(true); // Opens TaskInstanceDetailModal
};
```

### 2. Calendar Week View (`components/calendar/week-view.tsx`)

Same pattern as day view - replace TaskFormModal with TaskInstanceDetailModal.

### 3. Todo List (`components/todo/todo-list.tsx`)

**Current Behavior:**
No click handler on task cards.

**New Behavior:**
```typescript
const [selectedInstance, setSelectedInstance] = useState<TaskInstance | null>(null);
const [showDetailModal, setShowDetailModal] = useState(false);

const handleTaskCardClick = (instance: TaskInstance) => {
  setSelectedInstance(instance);
  setShowDetailModal(true);
};
```

## UI/UX Decisions

### Visual Hierarchy

1. **Header** (Fixed)
   - Large task title
   - Category badge with color accent
   - Close button (top-right)

2. **Content** (Scrollable)
   - Sections separated by borders or spacing
   - Icons for each section (Calendar, Clock, CheckSquare, etc.)
   - Consistent padding and margins
   - Category color used as subtle accent throughout

3. **Footer** (Fixed)
   - Primary actions (Complete, Reschedule) - prominent buttons
   - Secondary actions (Skip, Edit Template) - ghost/outline buttons
   - Proper spacing between button groups

### Responsive Design

- **Mobile (< 640px)**:
  - Full-screen modal
  - Stacked buttons
  - Smaller image display
  - Compact spacing

- **Tablet (640px - 1024px)**:
  - Medium modal (max-w-2xl)
  - Two-column button layout
  - Standard image sizing

- **Desktop (> 1024px)**:
  - Large modal (max-w-3xl)
  - Grid layout for action buttons
  - Large image display

### State-Specific Display

**Pending Task:**
- Show all action buttons
- No completion section
- Enable Complete, Reschedule, Skip buttons

**Completed Task:**
- Hide Complete button
- Show completion information section
- Keep Reschedule and Edit Template buttons
- Disable Skip button (already completed)

**Skipped Task:**
- Hide Complete button
- Show skip information
- Keep Reschedule and Edit Template buttons

## Server Actions

### Existing (No changes needed)

- `completeTaskInstance()` - Already exists in `app/actions/task-instances.ts`
- `rescheduleTaskInstance()` - Already exists in `app/actions/task-instances.ts`

### New (To be created)

```typescript
// app/actions/task-instances.ts
export async function skipTaskInstance(instanceId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("task_instances")
    .update({
      status: "skipped",
      skipped_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", instanceId);

  if (error) {
    console.error("Error skipping task instance:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
```

## Performance Considerations

1. **Data Loading**: The modal receives data from parent component (no additional fetch)
2. **Image Loading**: Use lazy loading for AI images and completion photos
3. **Modal Mounting**: Use React's built-in lazy/Suspense if modal becomes heavy
4. **Nested Modals**: Ensure proper z-index stacking (Detail modal = 50, Action modals = 51)

## Accessibility

- **Keyboard Navigation**: Support Tab, Escape, Enter keys
- **Screen Readers**: Proper ARIA labels for all sections and buttons
- **Focus Management**: Focus trap within modal, return focus on close
- **Color Contrast**: Ensure category colors meet WCAG AA standards

## i18n Strategy

### Translation Keys Structure

```json
{
  "taskInstance": {
    "details": "Task Details",
    "scheduledFor": "Scheduled for",
    "estimatedTime": "Estimated time",
    "scheduledTime": "Scheduled time",
    "subtasks": "Subtasks",
    "completionInfo": "Completion Information",
    "complete": "Complete Task",
    "reschedule": "Reschedule",
    "skip": "Skip",
    "editTemplate": "Edit Task Template",
    "skipConfirm": "Are you sure you want to skip this task?"
  }
}
```

### Date/Time Formatting

Use date-fns with locale support:
```typescript
import { format } from "date-fns";
import { de } from "date-fns/locale";

const locale = i18n.language === "de" ? de : undefined;
format(date, "PPp", { locale }); // Localized date and time
```

## Testing Strategy

### Manual Testing Checklist

1. **Display Testing**
   - Task with all fields populated
   - Task with minimal fields
   - Task with/without AI image
   - Task with/without subtasks
   - Pending vs completed vs skipped states

2. **Action Testing**
   - Complete button → CompleteTaskModal opens
   - Reschedule button → RescheduleTaskModal opens
   - Skip button → Confirmation → Task skipped
   - Edit Template → TaskFormModal opens
   - All actions refresh parent view

3. **Integration Testing**
   - Calendar day view click
   - Calendar week view click
   - Todo list click
   - Data refresh after actions

4. **Responsive Testing**
   - Mobile view (375px)
   - Tablet view (768px)
   - Desktop view (1440px)

5. **i18n Testing**
   - English locale display
   - German locale display
   - Date/time formatting

## Migration Path

1. **Phase 1**: Create TaskInstanceDetailModal component
2. **Phase 2**: Integrate with calendar views (replace current behavior)
3. **Phase 3**: Integrate with todo list (add new behavior)
4. **Phase 4**: Add skip functionality
5. **Phase 5**: Polish and testing

No breaking changes - existing modals (CompleteTaskModal, RescheduleTaskModal, TaskFormModal) remain unchanged and are reused.

## Future Enhancements (Out of Scope)

- Inline editing of instance-specific fields
- Quick notes feature
- Share task instance
- Task history timeline
- Recurring pattern visualization
