<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

---

# Component Development Guidelines

## Storybook Documentation (MANDATORY)

**IMPORTANT**: All UI components MUST be documented in Storybook.

### Rules for Component Development:

1. **Reuse Before Creating**
   - ALWAYS check existing components in `components/` before creating new ones
   - Use existing UI primitives from `components/ui/` (Button, Card, Input, etc.)
   - Only create new components when absolutely necessary

2. **Storybook Documentation Required**
   - Every NEW component MUST have a `.stories.tsx` file
   - Document all component variants and states
   - Include real-world usage examples
   - Add component description and props documentation
   - Show responsive behavior where applicable

3. **Storybook Location**
   - Place stories in the same directory as the component
   - Use naming pattern: `component-name.stories.tsx`
   - Example: `components/tasks/subtask-list.tsx` → `components/tasks/subtask-list.stories.tsx`

4. **Story Structure**
   ```typescript
   import type { Meta, StoryObj } from '@storybook/react';
   import { ComponentName } from './component-name';

   const meta = {
     title: 'Category/ComponentName',
     component: ComponentName,
     parameters: {
       layout: 'centered', // or 'fullscreen', 'padded'
     },
     tags: ['autodocs'],
   } satisfies Meta<typeof ComponentName>;

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {
     args: {
       // component props
     },
   };

   export const Variant: Story = {
     // additional variants
   };
   ```

5. **Before Committing**
   - Verify component works in Storybook (http://localhost:6006)
   - Test all variants and states
   - Ensure Art Nouveau theme compatibility
   - Check dark mode support

### Running Storybook

```bash
npm run storybook
```

### Existing Components

Check `components/ui/*.stories.tsx` for examples of properly documented components.

---

## Performance Optimization Guidelines

**IMPORTANT**: Apply performance optimizations strategically, not everywhere. Premature optimization can make code harder to maintain.

### When to Use React.memo

Use `React.memo` for components that:
- Receive complex props that don't change often
- Render frequently due to parent re-renders
- Are expensive to render (complex calculations, large lists, animations)
- Are part of a frequently updated view (like dashboards)

**Examples where React.memo is beneficial:**
- Dashboard cards that display stats
- List items in large lists
- Components with animations using Framer Motion
- Components that receive stable callback props

**Don't use React.memo for:**
- Simple presentational components (single div with text)
- Components that change props frequently anyway
- Components that are only rendered once

### When to Use useMemo

Use `useMemo` for:
- Expensive calculations (filtering, sorting, mapping large arrays)
- Creating objects/arrays that are passed as props to memoized children
- Values that are used in dependency arrays of other hooks

**Examples:**
```typescript
// Good: Expensive filtering operation
const filteredTasks = useMemo(
  () => tasks.filter(t => t.status === 'active').sort((a, b) => a.priority - b.priority),
  [tasks]
);

// Good: Object passed to memoized child
const config = useMemo(() => ({ theme, locale }), [theme, locale]);

// Bad: Simple calculation (overhead not worth it)
const total = useMemo(() => a + b, [a, b]); // Just use: const total = a + b;
```

### When to Use useCallback

Use `useCallback` for:
- Functions passed as props to memoized child components
- Functions used in dependency arrays of useEffect/useMemo
- Event handlers in frequently re-rendered components

**Examples:**
```typescript
// Good: Callback passed to memoized child
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Good: Used in useEffect dependency
const fetchData = useCallback(async () => {
  const data = await api.get(url);
  setData(data);
}, [url]);

useEffect(() => {
  fetchData();
}, [fetchData]);

// Bad: Simple inline handler (not passed to memoized child)
<button onClick={useCallback(() => setCount(c => c + 1), [])}>
  Click
</button>
// Better: Just use inline
<button onClick={() => setCount(c => c + 1)}>
  Click
</button>
```

### Performance Checklist for New Components

Before adding performance optimizations, ask:
1. ✅ Is this component rendered frequently?
2. ✅ Does it have expensive calculations or renders?
3. ✅ Will memoization actually prevent re-renders? (Check React DevTools Profiler)
4. ✅ Are the dependencies stable enough to benefit from memoization?

If you answer "yes" to 2 or more questions, apply optimizations.

### Example: Well-Optimized Component

```typescript
"use client";

import { memo, useMemo, useCallback } from "react";

interface Props {
  tasks: Task[];
  onTaskClick: (id: string) => void;
}

export const TaskList = memo(function TaskList({ tasks, onTaskClick }: Props) {
  // useMemo for expensive filtering/sorting
  const sortedTasks = useMemo(
    () => tasks.filter(t => t.is_active).sort((a, b) => b.priority - a.priority),
    [tasks]
  );

  // useCallback for event handler passed to memoized children
  const handleClick = useCallback(
    (taskId: string) => {
      onTaskClick(taskId);
    },
    [onTaskClick]
  );

  return (
    <div>
      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={handleClick}
        />
      ))}
    </div>
  );
});
```

### Performance Anti-Patterns to Avoid

❌ **Don't memo everything:**
```typescript
// Bad: Over-optimization
const SimpleText = memo(({ text }: { text: string }) => <p>{text}</p>);
```

❌ **Don't useMemo for simple values:**
```typescript
// Bad: Unnecessary overhead
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
// Better: Just compute it
const fullName = `${firstName} ${lastName}`;
```

❌ **Don't useCallback without memo:**
```typescript
// Bad: Callback optimization without memoized child
const onClick = useCallback(() => console.log('clicked'), []);
return <button onClick={onClick}>Click</button>; // button is not memoized
```

### Tools for Performance Analysis

- **React DevTools Profiler**: Measure component render times
- **Chrome DevTools Performance Tab**: Identify performance bottlenecks
- **Why Did You Render**: Debug unnecessary re-renders (development only)

```bash
# Install why-did-you-render for debugging
npm install --save-dev @welldone-software/why-did-you-render
```