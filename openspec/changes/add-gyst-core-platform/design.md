# Technical Design: Gyst Core Platform

## Context

Gyst is being built on top of an existing Next.js + Supabase starter kit. The platform needs to support:
- Complex task scheduling with AI recommendations
- Real-time streak tracking and notifications
- External calendar integrations
- Multi-language support
- A distinctive Art Nouveau-inspired design system
- High accessibility standards (WCAG 2.2 AA)

### Constraints
- Must use Supabase for backend (already integrated)
- Must maintain existing auth flow (cookie-based SSR)
- Must be deployable on Vercel
- Must support mobile-first responsive design
- Budget constraints on AI API calls

### Stakeholders
- End users: Individuals seeking life organization
- Developers: Small team, prefer simple, maintainable solutions
- Business: Need to control costs (AI, storage, email)

## Goals / Non-Goals

### Goals
- ✅ Create a maintainable, scalable architecture
- ✅ Minimize external service costs
- ✅ Provide excellent UX with smooth animations
- ✅ Ensure accessibility compliance
- ✅ Support internationalization from day 1
- ✅ Enable easy theming and customization

### Non-Goals
- ❌ Native mobile apps (future consideration)
- ❌ Offline-first architecture (web app requires connection)
- ❌ Real-time collaboration (future backlog item)
- ❌ Payment processing (future premium features)

## Technical Decisions

### 1. Architecture Pattern: Next.js App Router with Server Components

**Decision**: Use Next.js App Router with React Server Components where possible

**Rationale**:
- Already using Next.js 16 with App Router
- Server Components reduce client-side JavaScript
- Better SEO and initial load performance
- Simplified data fetching with async components

**Implementation**:
- Dashboard, statistics, settings: Server Components
- Interactive task management: Client Components
- Calendar integration: Client Components (3rd party libs)
- Use `'use client'` directive only where needed

**Alternatives Considered**:
- Pages Router: Legacy, missing modern features
- Client-only SPA: Worse SEO, larger bundle size

---

### 2. State Management: Zustand

**Decision**: Use Zustand for global client-side state

**Rationale**:
- Lightweight (< 1KB minzipped)
- Simpler than Redux (less boilerplate)
- TypeScript-first API
- Excellent DevTools support
- Can be used outside React components

**Implementation**:
```typescript
// stores/task-store.ts
import { create } from 'zustand'

interface TaskStore {
  tasks: Task[]
  loading: boolean
  fetchTasks: () => Promise<void>
  addTask: (task: Task) => void
  // ...
}

export const useTaskStore = create<TaskStore>((set) => ({
  // ...
}))
```

**Stores Structure**:
- `taskStore` - Task CRUD and filtering
- `streakStore` - Streak calculation and display
- `settingsStore` - User preferences, theme, language
- `notificationStore` - Notification queue and preferences

**Alternatives Considered**:
- Redux: Too much boilerplate for our needs
- Jotai: Atomic approach less suitable for our domain
- React Context: Performance issues with frequent updates

---

### 3. API Architecture: RESTful with Next.js Route Handlers

**Decision**: Use Next.js Route Handlers for REST API

**Rationale**:
- Native to Next.js, no additional setup
- TypeScript support out of the box
- Easy to protect with middleware
- Can leverage Server Actions for mutations

**API Structure**:
```
app/api/
├── tasks/
│   ├── route.ts              # GET, POST /api/tasks
│   └── [id]/
│       └── route.ts          # GET, PATCH, DELETE /api/tasks/:id
├── categories/
│   └── route.ts
├── streaks/
│   └── route.ts
├── ai/
│   ├── suggest/route.ts      # POST /api/ai/suggest
│   └── onboard/route.ts      # POST /api/ai/onboard
├── calendar/
│   ├── sync/route.ts
│   └── events/route.ts
└── notifications/
    └── send/route.ts
```

**Error Handling**:
```typescript
// Standard error response format
{
  error: {
    code: "TASK_NOT_FOUND",
    message: "Task with ID xyz not found",
    details: { /* ... */ }
  }
}
```

**Alternatives Considered**:
- GraphQL: Overkill for our CRUD-heavy operations
- tRPC: Adds complexity, REST is more familiar
- Server Actions only: Limited for complex workflows

---

### 4. Database: Supabase PostgreSQL with RLS

**Decision**: Use Supabase PostgreSQL with Row Level Security

**Schema Design Principles**:
- Normalize to 3NF where reasonable
- Denormalize for performance where needed (e.g., streak counts)
- Use UUIDs for primary keys
- Timestamps: `created_at`, `updated_at` on all tables
- Soft deletes for user-created content (`deleted_at`)

**Key Tables** (see database schema for full details):
- `profiles` - Extended user data
- `tasks` - Core task entity
- `task_categories` - Predefined and custom categories
- `task_completions` - Completion history
- `streaks` - Calculated streak data (materialized view)
- `ai_suggestions` - Cached AI recommendations
- `calendar_events` - Synced external events

**RLS Policies**:
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Admin role for future admin panel
CREATE POLICY "Admins can view all tasks"
  ON tasks FOR SELECT
  USING (is_admin());
```

**Alternatives Considered**:
- Prisma ORM: Adds abstraction layer, Supabase client is sufficient
- Raw SQL only: Less type-safe, more error-prone

---

### 5. Design System: Tailwind CSS 4 + CVA + Storybook

**Decision**: Extend existing Tailwind v4 setup with Art Nouveau theme

**Color Palette** (Mucha-inspired):
```css
@theme {
  /* Primary - Warm Pastels */
  --color-cream: oklch(95% 0.02 85);
  --color-peach: oklch(85% 0.08 50);
  --color-sage: oklch(75% 0.06 140);
  --color-gold: oklch(70% 0.10 85);

  /* Accents - Rich Tones */
  --color-petrol: oklch(45% 0.12 220);
  --color-ruby: oklch(50% 0.18 25);
  --color-amber: oklch(65% 0.15 70);

  /* Neutrals */
  --color-ivory: oklch(98% 0.01 85);
  --color-charcoal: oklch(25% 0.02 280);

  /* Semantic */
  --color-success: var(--color-sage);
  --color-error: var(--color-ruby);
  --color-warning: var(--color-amber);
  --color-info: var(--color-petrol);
}
```

**Typography**:
- **Headings**: Variable serif with ornamental details (e.g., Cormorant Garamond)
- **Body**: Modern sans-serif (e.g., Inter Variable, already in Next.js)
- **Display**: Art Nouveau-inspired font for hero sections (e.g., Poiret One)

**Component Variants** (using CVA):
```typescript
const buttonVariants = cva(
  "rounded-full transition-all duration-300", {
    variants: {
      variant: {
        primary: "bg-petrol text-ivory hover:bg-petrol/90",
        secondary: "bg-sage text-charcoal hover:bg-sage/90",
        ornamental: "border-2 border-gold bg-ivory/50 backdrop-blur",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      }
    }
  }
);
```

**Storybook Setup**:
- Document all design system components
- Include Art Nouveau ornament variants
- Accessibility testing addon
- Dark/light mode toggle
- Theme palette switcher

**Alternatives Considered**:
- CSS-in-JS (styled-components): Tailwind is already integrated
- Material UI: Doesn't fit Art Nouveau aesthetic
- Custom CSS: Less maintainable than Tailwind

**UI/UX Guidelines**:

**Hover Effects**:
- **Rule**: Only apply hover effects to truly interactive elements
- **Interactive elements**: Buttons, links, clickable cards, form inputs, navigation items
- **Non-interactive elements**: Headers, static text, containers, decorative elements
- **Examples**:
  - ✅ DO: `<Button className="hover:bg-primary/90">` - Button is interactive
  - ✅ DO: `<Link className="hover:text-primary">` - Link is interactive
  - ❌ DON'T: `<nav className="hover:opacity-80">` - Nav container itself isn't interactive
  - ❌ DON'T: `<CardHeader className="hover:scale-105">` - Header is static content
- **Rationale**: Improves UX by clearly indicating what can be interacted with, reduces visual noise

---

### 6. Animations: Framer Motion

**Decision**: Use Framer Motion for animations and micro-interactions

**Rationale**:
- Declarative API, easy to use
- Excellent performance (GPU-accelerated)
- Gesture support for mobile
- Respects `prefers-reduced-motion`

**Animation Patterns**:
```typescript
// Organic, plant-like movements
const organicTransition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 0.8
};

// Smooth fade and slide
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: organicTransition
};
```

**Use Cases**:
- Task completion celebrations
- Streak milestone animations
- Dashboard transitions
- Modal/drawer open/close
- Loading states

**Alternatives Considered**:
- CSS animations only: Less flexible, harder to coordinate
- React Spring: More complex API
- GSAP: Commercial license, heavier bundle

---

### 7. AI Integration: OpenAI GPT-4

**Decision**: Use OpenAI API with aggressive caching

**Cost Mitigation Strategies**:
1. **Cache suggestions**: Store AI responses for 24h
2. **Batch processing**: Generate suggestions in bulk during onboarding
3. **User limits**: Max 10 AI requests per day per user
4. **Fallback templates**: Predefined suggestions if AI unavailable

**Prompt Engineering**:
```typescript
const taskSuggestionPrompt = `
You are a life organization assistant helping users manage their routines.

User Context:
- Lives alone: ${profile.livesAlone}
- Has plants: ${profile.hasPlants}
- Preferred time: ${profile.preferredTime}
- Available calendar slots: ${availableSlots}

Suggest 3-5 tasks from these categories: ${categories.join(', ')}

Format: JSON array of {title, category, frequency, estimatedMinutes}
`;
```

**Implementation**:
```typescript
// lib/ai/suggestions.ts
import OpenAI from 'openai';

export async function generateTaskSuggestions(userId: string) {
  const cached = await getCachedSuggestions(userId);
  if (cached && !isStale(cached)) return cached;

  const profile = await getUserProfile(userId);
  const calendar = await getCalendarAvailability(userId);

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [/* ... */],
    max_tokens: 500,
    temperature: 0.7,
  });

  const suggestions = parseSuggestions(response);
  await cacheSuggestions(userId, suggestions);

  return suggestions;
}
```

**Alternatives Considered**:
- Claude API: OpenAI has better JSON mode support
- Self-hosted LLM: Too expensive to run, quality concerns
- Rule-based suggestions: Less personalized, rigid

---

### 8. Calendar Integration: Google + Microsoft Graph APIs

**Decision**: Support Google Calendar and Microsoft Outlook/365

**Authentication Flow**:
1. User clicks "Connect Calendar"
2. OAuth2 redirect to provider
3. Exchange code for access/refresh tokens
4. Store tokens encrypted in Supabase
5. Background sync every 15 minutes

**Sync Strategy**:
```typescript
// Bidirectional sync
// Gyst → Calendar: When task scheduled
// Calendar → Gyst: Import external events as blockers

interface CalendarEvent {
  id: string;
  provider: 'google' | 'microsoft';
  externalId: string;
  title: string;
  start: Date;
  end: Date;
  isTaskRelated: boolean;
  taskId?: string;
}
```

**Conflict Resolution**:
- Gyst tasks have priority
- External events marked as "blockers"
- User can manually override

**Implementation**:
```typescript
// lib/calendar/google.ts
import { google } from 'googleapis';

export async function syncGoogleCalendar(userId: string) {
  const tokens = await getCalendarTokens(userId, 'google');
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 100,
  });

  await importEvents(userId, events.data.items);
}
```

**Alternatives Considered**:
- Apple Calendar: CalDAV protocol is complex, low ROI
- Outlook (legacy): Replaced by Microsoft Graph
- iCal export only: Not bidirectional

---

### 9. Notifications: Resend (Email) + Web Push API

**Decision**: Dual notification system

**Email Notifications (Resend)**:
- Transactional emails (onboarding, weekly digest)
- Task reminders (configurable frequency)
- Streak milestones
- Progressive intensity levels

**Intensity Levels**:
```typescript
enum NotificationTone {
  ENCOURAGING = 'encouraging',  // "You've got this!"
  NEUTRAL = 'neutral',          // "Task due soon"
  PUSHY = 'pushy',              // "Don't forget!"
  SCOLDING = 'scolding',        // "You missed this task!"
}

// User can configure per category
interface NotificationPreferences {
  categoryId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  toneProgression: NotificationTone[]; // escalation path
  maxPerDay: number;
}
```

**Web Push**:
- Browser notifications for immediate reminders
- Requires user permission prompt
- Fallback to email if permission denied

**Implementation**:
```typescript
// lib/notifications/send.ts
import { Resend } from 'resend';

export async function sendTaskReminder(task: Task, user: Profile) {
  const prefs = await getNotificationPreferences(user.id, task.categoryId);

  if (prefs.emailEnabled) {
    await resend.emails.send({
      from: 'Gyst <notifications@gyst.app>',
      to: user.email,
      subject: getSubjectForTone(task, prefs.currentTone),
      html: renderEmailTemplate('task-reminder', { task, user }),
    });
  }

  if (prefs.pushEnabled && user.pushSubscription) {
    await sendWebPush(user.pushSubscription, {
      title: task.title,
      body: `Due ${formatRelative(task.dueDate)}`,
      icon: '/icons/task-icon.png',
    });
  }
}
```

**Alternatives Considered**:
- SendGrid: Resend has better DX
- Twilio: SMS too expensive for this use case
- Firebase Cloud Messaging: Adds extra dependency

---

### 10. Internationalization: react-i18next

**Decision**: Use react-i18next for multi-language support

**Supported Languages** (Initial):
- English (default)
- German

**Translation Structure**:
```
public/locales/
├── en/
│   ├── common.json
│   ├── tasks.json
│   ├── dashboard.json
│   ├── settings.json
│   └── ai.json
└── de/
    ├── common.json
    ├── tasks.json
    ├── dashboard.json
    ├── settings.json
    └── ai.json
```

**Usage**:
```typescript
import { useTranslation } from 'react-i18next';

function TaskCard() {
  const { t } = useTranslation('tasks');

  return (
    <div>
      <h3>{t('task.title')}</h3>
      <p>{t('task.frequency.daily', { count: task.count })}</p>
    </div>
  );
}
```

**Date/Time Localization**:
- Use `date-fns` with locale support
- Timezone handling: Store UTC, display local

**Alternatives Considered**:
- next-i18next: More Next.js specific, but heavier
- FormatJS: More features, steeper learning curve

---

### 11. Testing Strategy

**Unit + Integration: Vitest**
- All utility functions
- Stores (Zustand)
- API route handlers
- Components (with React Testing Library)

**E2E: Playwright**
- Critical user flows:
  - User registration and onboarding
  - Create and complete task
  - View streak progress
  - Connect calendar
  - Change theme
- Cross-browser (Chrome, Firefox, Safari)
- Mobile viewport testing

**Coverage Goals**:
- 90% overall code coverage
- 100% critical path coverage
- All API routes covered

**Implementation**:
```typescript
// __tests__/stores/task-store.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTaskStore } from '@/lib/store/task-store';

describe('Task Store', () => {
  it('should add task correctly', () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask({
        title: 'Water plants',
        categoryId: 'household',
        frequency: 'daily',
      });
    });

    expect(result.current.tasks).toHaveLength(1);
  });
});
```

**Alternatives Considered**:
- Jest: Vitest is faster, better ESM support
- Cypress: Playwright has better cross-browser support

---

### 12. Performance Optimizations

**Code Splitting**:
- Route-based code splitting (automatic with Next.js)
- Dynamic imports for heavy components (calendar, charts)

**Image Optimization**:
- Next.js Image component for all images
- Compress user uploads (sharp)
- Lazy load images below fold

**Caching Strategy**:
- API responses: SWR with stale-while-revalidate
- Static assets: CDN caching (Vercel Edge)
- Database queries: Supabase caching

**Bundle Size**:
- Tree-shake all libraries
- Monitor bundle with `@next/bundle-analyzer`
- Target: < 200KB initial JS bundle

---

## Risks / Trade-offs

### OpenAI API Costs
**Risk**: AI suggestions could become expensive at scale

**Mitigation**:
- Aggressive caching (24h TTL)
- Rate limiting (10 requests/user/day)
- Fallback to template-based suggestions
- Monitor usage with alerts

**Trade-off**: Less personalized suggestions when cached

---

### Calendar Sync Reliability
**Risk**: External APIs can fail or have downtime

**Mitigation**:
- Retry logic with exponential backoff
- Graceful degradation (show last synced time)
- Queue failed syncs for later

**Trade-off**: Data may be stale for brief periods

---

### Photo Storage Growth
**Risk**: User photos accumulate, increasing storage costs

**Mitigation**:
- Compress images on upload (WebP, 1024px max)
- Implement storage quotas (e.g., 100MB per user)
- Automatic cleanup of old photos (> 6 months)

**Trade-off**: Photo quality slightly reduced

---

### Notification Fatigue
**Risk**: Too many notifications annoy users

**Mitigation**:
- Smart batching (combine multiple reminders)
- User-configurable limits (max per day)
- Unsubscribe option in every email

**Trade-off**: Users might miss reminders if too conservative

---

## Migration Plan

### Phase 1: Database Setup
1. Run Supabase migrations for new tables
2. Enable RLS policies
3. Seed initial categories
4. Test with sample data

### Phase 2: Component Migration
1. Update existing auth components
2. Create design system components
3. Build dashboard page
4. Migrate to Zustand (if any existing state)

### Phase 3: Feature Rollout
1. Enable task management
2. Add streak tracking
3. Integrate AI assistant (beta)
4. Connect calendar (opt-in)
5. Full notifications

### Phase 4: Testing & Optimization
1. Run Playwright E2E suite
2. Performance audit with Lighthouse
3. Accessibility audit with axe
4. Load testing with k6

### Rollback Plan
- Database migrations are reversible
- Feature flags for gradual rollout
- Can disable AI/calendar if issues arise
- Maintain backward compatibility for 2 versions

---

## Open Questions

### 1. Calendar View
**Question**: Should we implement a full calendar view or just a list of suggested times?

**Options**:
- **Option A**: Full calendar grid (week/month view)
  - Pros: Better visualization, familiar UX
  - Cons: Complex to build, large bundle size
- **Option B**: List of time slots with availability
  - Pros: Simpler, faster to implement
  - Cons: Less visual, harder to spot conflicts

**Recommendation**: Start with Option B, add Option A in Phase 4 if users request it

---

### 2. Photo Storage Service
**Question**: Use Supabase Storage or external service like Cloudinary?

**Options**:
- **Option A**: Supabase Storage
  - Pros: Already integrated, simple setup
  - Cons: Limited image transformations
- **Option B**: Cloudinary
  - Pros: Automatic optimization, transformations
  - Cons: Extra service, more complex, costs

**Recommendation**: Use Supabase Storage initially, monitor usage and quality

---

### 3. Notification Nagging Limits
**Question**: What's the maximum "nagging" frequency users will tolerate?

**Options**:
- **Option A**: Conservative (max 3 emails/day)
- **Option B**: Moderate (max 5 emails/day)
- **Option C**: Aggressive (max 10 emails/day)

**Recommendation**: Start with Option A, let users opt into higher limits

---

### 4. AI Suggestion Refresh
**Question**: How often should we regenerate AI task suggestions?

**Options**:
- **Option A**: On-demand only (user clicks "Refresh")
- **Option B**: Daily automatic refresh
- **Option C**: Weekly automatic refresh

**Recommendation**: Option A to minimize costs, with smart prompts for refresh

---

### 5. Custom Themes
**Question**: Allow users to create custom color themes or only predefined?

**Options**:
- **Option A**: Only predefined Mucha-inspired palettes
- **Option B**: Custom theme creator with color pickers
- **Option C**: Community-submitted themes (moderated)

**Recommendation**: Option A for MVP, consider Option C later for engagement

---

## Success Metrics

### Technical
- Lighthouse score > 90 (performance, accessibility, SEO)
- Time to Interactive < 2s
- API response time < 200ms (p95)
- Zero critical security vulnerabilities
- 90% test coverage

### User Experience
- Task creation flow < 30 seconds
- Dashboard load time < 1s
- Calendar sync completes < 5s
- Zero accessibility violations (WCAG 2.2 AA)

### Business
- AI API costs < $0.10 per user per month
- Email deliverability > 98%
- Storage costs < $0.05 per user per month

---

## 13. Progressive Web App (PWA)

**Decision**: Implement PWA features for mobile-first experience before native apps

**Rationale**:
- Fastest path to mobile users
- No App Store approval needed
- Single codebase for web + mobile
- Modern iOS (16.4+) and Android support Web Push
- "Add to Home Screen" provides app-like experience

**Implementation**:
```typescript
// next.config.ts
import withPWA from '@ducanh2912/next-pwa';

const config = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});
```

**manifest.json**:
```json
{
  "name": "Gyst - Get Your Shit Together",
  "short_name": "Gyst",
  "description": "Life organization app with Art Nouveau design",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#F5EFE6",
  "theme_color": "#4A90A4",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker Strategy**:
- **Static assets**: Cache-first (JS, CSS, fonts, images)
- **API calls**: Network-first with fallback
- **Dashboard**: Stale-while-revalidate

**iOS Considerations**:
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
```

**Alternatives Considered**:
- Native apps first: Longer time to market
- Capacitor: Wrapped WebView, worse performance than PWA

**Mobile Coverage:**
- iOS 16.4+: Full PWA support including Web Push
- Android: Full PWA support since Chrome 79
- Estimated 95%+ of target users covered

---

## Open Questions - RESOLVED

### ~~1. Calendar View~~
**Decision**: **Full calendar grid** (week/month view)
- User prefers richer visualization
- Will use react-big-calendar or similar library
- Implement in Phase 4

### ~~2. Photo Storage Service~~
**Decision**: **Supabase Storage**
- Already integrated, simple setup
- Image compression via sharp before upload
- Monitor storage costs and migrate to Cloudinary if needed

### ~~3. Notification Limits~~
**Decision**: **Configurable per user**
- Default: 3 emails/day (conservative)
- Users can increase to 5 or 10/day in settings
- Progressive tone: encouraging → neutral → pushy (configurable progression)

### ~~4. AI Suggestion Refresh~~
**Decision**: **On-demand only**
- User clicks "Refresh suggestions" button
- Smart prompts when refresh makes sense (e.g., after adding new categories)
- Minimizes OpenAI API costs
- 24h cache for suggestions

### ~~5. Theme Customization~~
**Decision**: **Predefined Mucha palettes only (MVP)**
- Mucha Classic, Emerald, Ruby themes
- Future: Community-submitted themes (moderated)
- No custom theme builder in MVP to maintain Art Nouveau aesthetic quality
